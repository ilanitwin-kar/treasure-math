import { create } from "zustand";
import type {
  AnswerStatus,
  AssessmentSession,
  Grade,
  Island,
  PlayerInventory,
  QuestionAttempt,
  StudentProfile,
} from "../types";
import {
  addProfileToList,
  archiveSession,
  clearSession,
  DEFAULT_INVENTORY,
  loadInventory,
  loadProfile,
  loadSession,
  saveInventory,
  saveProfile,
  saveSession,
} from "../storage/storage";
import { getQuestionById } from "../data/questions";
import { buildIslands } from "../data/islands";
import {
  calculateConfidenceScore,
  compressIslandQueueAfterGradeBlock,
  getSkippedIslandsToRevisit,
  shouldOfferAdaptiveSkip,
  shouldRevisitSkipped,
} from "../data/adaptivePath";

/** כמות פנינים שמרוויחים על שאלה שנענתה (גם שגויה). */
const PEARLS_PER_ANSWER = 1;
/** בונוס פנינים על תשובה נכונה. */
const PEARLS_BONUS_CORRECT = 2;
/** בונוס פנינים על השלמת אי (הצלת תוכי). */
const PEARLS_BONUS_ISLAND = 5;

interface GameState {
  profile: StudentProfile | null;
  session: AssessmentSession | null;
  islands: Island[];
  inventory: PlayerInventory;

  /** הודעת אנימציה זמנית: כמה פנינים זה עתה זיכינו ולמה. */
  recentPearlGain: { amount: number; reason: string } | null;
  /**
   * אירוע הצלה אחרון — למסך חגיגה.
   * `isNewToCrew`: true בפעם הראשונה שהתוכי (לפי נושא) מצטרף לצוות; false כשמסיימים אי נוסף באותו נושא (כיתה אחרת).
   */
  recentlyRescuedEvent: { parrotId: string; isNewToCrew: boolean } | null;
  /** הודעה קצרה אחרי דילוג אדפטיבי במסלול האיים (מוצגת במפה). */
  mapFeedback: string | null;

  hydrate: () => void;

  setProfile: (profile: StudentProfile) => void;
  resetProfile: () => void;

  startNewSession: () => void;
  resumeSessionOrStartNew: () => void;

  updateDraftAnswer: (draft: string) => void;

  recordAttempt: (params: {
    studentAnswer: string;
    status: AnswerStatus;
    timeMs: number;
    pausedMs: number;
    pauseCount: number;
    startedAt: number;
  }) => void;

  advanceToNextQuestion: () => void;
  finishSession: () => void;

  // === פנינים, תוכים, פריטים ===
  awardPearls: (amount: number, reason: string) => void;
  clearRecentPearlGain: () => void;
  clearRecentRescue: () => void;
  clearMapFeedback: () => void;
  rescueParrot: (parrotId: string) => void;
  spendPearls: (amount: number) => boolean;
  buyItem: (itemId: string, price: number) => boolean;
  equipItem: (category: string, itemId: string) => void;
}

function rebuildIslands(grade: number | undefined): Island[] {
  if (!grade) return [];
  return buildIslands(grade as 1 | 2 | 3 | 4 | 5 | 6);
}

/** מזיז מזהה אי כך שיהיה מיד אחרי האי באינדקס `afterIslandIndex` (במסלול המעודכן). */
function moveIslandImmediatelyAfter(
  islandIds: string[],
  afterIslandIndex: number,
  movingIslandId: string
): string[] {
  const ids = [...islandIds];
  const curMoving = ids.indexOf(movingIslandId);
  if (curMoving < 0) return islandIds;
  if (curMoving === afterIslandIndex + 1) return ids;
  ids.splice(curMoving, 1);
  let insertAfter = afterIslandIndex;
  if (curMoving <= afterIslandIndex) insertAfter -= 1;
  ids.splice(insertAfter + 1, 0, movingIslandId);
  return ids;
}

/** אחרי ניסיון: אם מתקיימים תנאי חזרה — מזיז אי שדולג להיות הבא אחרי האי הנוכחי (לפי מצב לפני/אחרי מעבר אי). */
function applySkippedIslandRevisitToSession(
  sessionBeforeAdvance: AssessmentSession,
  next: AssessmentSession,
  islands: Island[],
  profileGrade: Grade,
  attempts: QuestionAttempt[]
): AssessmentSession {
  if (next.completedAt) return next;
  const candidates = getSkippedIslandsToRevisit(
    attempts,
    next.islandIds,
    islands,
    profileGrade,
    next.currentIslandIndex
  );
  const afterIdx =
    next.currentIslandIndex === sessionBeforeAdvance.currentIslandIndex
      ? next.currentIslandIndex
      : sessionBeforeAdvance.currentIslandIndex;
  for (const sid of candidates) {
    if (!shouldRevisitSkipped(attempts, sid)) continue;
    const newIds = moveIslandImmediatelyAfter(next.islandIds, afterIdx, sid);
    if (newIds !== next.islandIds) {
      return { ...next, islandIds: newIds };
    }
  }
  return next;
}

export const useGameStore = create<GameState>((set, get) => ({
  profile: null,
  session: null,
  islands: [],
  inventory: { ...DEFAULT_INVENTORY },
  recentPearlGain: null,
  recentlyRescuedEvent: null,
  mapFeedback: null,

  hydrate: () => {
    const profile = loadProfile();
    const session = loadSession();
    const inventory = profile ? loadInventory(profile.id) : { ...DEFAULT_INVENTORY };
    set({
      profile,
      session,
      islands: rebuildIslands(profile?.grade),
      inventory,
      mapFeedback: null,
    });
  },

  setProfile: (profile) => {
    saveProfile(profile);
    addProfileToList(profile);
    const inventory = loadInventory(profile.id);
    set({
      profile,
      islands: rebuildIslands(profile.grade),
      inventory,
      mapFeedback: null,
    });
  },

  resetProfile: () => {
    set({
      profile: null,
      session: null,
      islands: [],
      inventory: { ...DEFAULT_INVENTORY },
      mapFeedback: null,
    });
    clearSession();
  },

  startNewSession: () => {
    const profile = get().profile;
    if (!profile) return;
    const islands = buildIslands(profile.grade);
    const session: AssessmentSession = {
      id: `session_${Date.now()}`,
      studentId: profile.id,
      startedAt: Date.now(),
      lastActiveAt: Date.now(),
      islandIds: islands.map((i) => i.id),
      currentIslandIndex: 0,
      currentQuestionInIslandIndex: 0,
      attempts: [],
      draftAnswer: "",
    };
    saveSession(session);
    set({ session, islands, mapFeedback: null });
  },

  resumeSessionOrStartNew: () => {
    const existing = loadSession();
    if (existing && !existing.completedAt) {
      const profile = get().profile;
      set({
        session: existing,
        islands: rebuildIslands(profile?.grade),
        mapFeedback: null,
      });
      return;
    }
    get().startNewSession();
  },

  updateDraftAnswer: (draft) => {
    const session = get().session;
    if (!session) return;
    const next: AssessmentSession = {
      ...session,
      draftAnswer: draft,
      lastActiveAt: Date.now(),
    };
    saveSession(next);
    set({ session: next });
  },

  recordAttempt: ({ studentAnswer, status, timeMs, pausedMs, pauseCount, startedAt }) => {
    const session = get().session;
    const islands = get().islands;
    if (!session) return;
    const island = islands.find((i) => i.id === session.islandIds[session.currentIslandIndex]);
    if (!island) return;
    const questionId = island.questionIds[session.currentQuestionInIslandIndex];
    const question = getQuestionById(questionId);
    if (!question) return;
    const finishedAt = Date.now();
    const timeSeconds = Math.max(0, timeMs / 1000);
    const attemptBase: QuestionAttempt = {
      questionId,
      islandId: island.id,
      studentAnswer,
      status,
      timeMs,
      timeSeconds,
      pausedMs,
      pauseCount,
      startedAt,
      finishedAt,
      topic: question.topic,
      difficulty: question.difficulty,
    };
    const attempt: QuestionAttempt = {
      ...attemptBase,
      confidenceScore: calculateConfidenceScore(attemptBase),
    };
    const next: AssessmentSession = {
      ...session,
      attempts: [...session.attempts, attempt],
      lastActiveAt: Date.now(),
    };
    saveSession(next);
    set({ session: next });

    // הענקת פנינים - גם על תשובה לא נכונה, וגם על דילוג, אבל לא על דילוג זוכים בבונוס.
    if (status === "correct") {
      get().awardPearls(PEARLS_PER_ANSWER + PEARLS_BONUS_CORRECT, "תשובה נכונה! בונוס!");
    } else if (status === "incorrect") {
      get().awardPearls(PEARLS_PER_ANSWER, "פנינה על הניסיון!");
    } else {
      // skipped - עדיין מקבל פנינה אחת על הניסיון
      get().awardPearls(PEARLS_PER_ANSWER, "פנינה על המסע!");
    }
  },

  advanceToNextQuestion: () => {
    const session = get().session;
    const islands = get().islands;
    if (!session) return;
    const island = islands.find((i) => i.id === session.islandIds[session.currentIslandIndex]);
    if (!island) return;

    const nextQInIsland = session.currentQuestionInIslandIndex + 1;
    let next: AssessmentSession;
    let rescuedParrot: string | null = null;
    let skipMessage: string | null = null;

    if (nextQInIsland < island.questionIds.length) {
      next = {
        ...session,
        currentQuestionInIslandIndex: nextQInIsland,
        draftAnswer: "",
        lastActiveAt: Date.now(),
      };
    } else {
      const completedIdx = session.currentIslandIndex;
      rescuedParrot = island.parrotId;

      let nextIslandIds = [...session.islandIds];
      let nextIslandIdx = completedIdx + 1;

      const profile = get().profile;
      if (
        profile &&
        shouldOfferAdaptiveSkip(
          session.attempts,
          nextIslandIds,
          islands,
          completedIdx,
          island.grade,
          profile.grade
        )
      ) {
        const compressed = compressIslandQueueAfterGradeBlock(
          nextIslandIds,
          islands,
          completedIdx,
          island.grade,
          profile.grade
        );
        if (compressed) {
          nextIslandIds = compressed;
          nextIslandIdx = completedIdx + 1;
          const gHeb = ["", "א'", "ב'", "ג'", "ד'", "ה'", "ו'"][island.grade] ?? `${island.grade}`;
          const pHeb = ["", "א'", "ב'", "ג'", "ד'", "ה'", "ו'"][profile.grade] ?? `${profile.grade}`;
          skipMessage = `מסלול אדפטיבי: שליטה מצוינת בחומר כיתה ${gHeb} — דילגנו לכיתה ${pHeb} (בלי לשעמם אתכם).`;
          get().awardPearls(2, "בונוס קפיצה חכמה! 🎯");
        }
      }

      next = {
        ...session,
        islandIds: nextIslandIds,
        currentIslandIndex: nextIslandIdx,
        currentQuestionInIslandIndex: 0,
        draftAnswer: "",
        lastActiveAt: Date.now(),
      };
      if (nextIslandIdx >= nextIslandIds.length) {
        next.completedAt = Date.now();
      }
    }

    const profile = get().profile;
    if (profile) {
      next = applySkippedIslandRevisitToSession(session, next, islands, profile.grade, next.attempts);
    }

    saveSession(next);
    set({ session: next, mapFeedback: skipMessage });

    // הצלת תוכי + בונוס פנינים
    if (rescuedParrot) {
      get().rescueParrot(rescuedParrot);
      get().awardPearls(PEARLS_BONUS_ISLAND, `הצלת את ${island.title}!`);
    }

    if (next.completedAt) {
      archiveSession(next);
    }
  },

  finishSession: () => {
    const session = get().session;
    if (!session) return;
    const finished: AssessmentSession = {
      ...session,
      completedAt: Date.now(),
      lastActiveAt: Date.now(),
    };
    archiveSession(finished);
    clearSession();
    set({ session: null, mapFeedback: null });
  },

  // === פנינים ===
  awardPearls: (amount, reason) => {
    const { profile, inventory } = get();
    if (!profile) return;
    const next: PlayerInventory = {
      ...inventory,
      pearls: inventory.pearls + amount,
    };
    saveInventory(profile.id, next);
    set({
      inventory: next,
      recentPearlGain: { amount, reason },
    });
  },

  clearRecentPearlGain: () => set({ recentPearlGain: null }),
  clearRecentRescue: () => set({ recentlyRescuedEvent: null }),
  clearMapFeedback: () => set({ mapFeedback: null }),

  rescueParrot: (parrotId) => {
    const { profile, inventory } = get();
    if (!profile) return;
    const isNewToCrew = !inventory.rescuedParrotIds.includes(parrotId);
    if (isNewToCrew) {
      const next: PlayerInventory = {
        ...inventory,
        rescuedParrotIds: [...inventory.rescuedParrotIds, parrotId],
      };
      saveInventory(profile.id, next);
      set({ inventory: next, recentlyRescuedEvent: { parrotId, isNewToCrew: true } });
    } else {
      set({ recentlyRescuedEvent: { parrotId, isNewToCrew: false } });
    }
  },

  spendPearls: (amount) => {
    const { profile, inventory } = get();
    if (!profile) return false;
    if (inventory.pearls < amount) return false;
    const next: PlayerInventory = {
      ...inventory,
      pearls: inventory.pearls - amount,
    };
    saveInventory(profile.id, next);
    set({ inventory: next });
    return true;
  },

  buyItem: (itemId, price) => {
    const { profile, inventory } = get();
    if (!profile) return false;
    if (inventory.ownedItems.includes(itemId)) return false;
    if (inventory.pearls < price) return false;
    const next: PlayerInventory = {
      ...inventory,
      pearls: inventory.pearls - price,
      ownedItems: [...inventory.ownedItems, itemId],
    };
    saveInventory(profile.id, next);
    set({ inventory: next });
    return true;
  },

  equipItem: (category, itemId) => {
    const { profile, inventory } = get();
    if (!profile) return;
    const next: PlayerInventory = {
      ...inventory,
      equippedItems: {
        ...inventory.equippedItems,
        [category]: itemId,
      },
    };
    saveInventory(profile.id, next);
    set({ inventory: next });
  },
}));
