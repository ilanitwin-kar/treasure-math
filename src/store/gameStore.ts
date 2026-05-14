import { create } from "zustand";
import type {
  AnswerStatus,
  AssessmentSession,
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
  /** ID של תוכי שזה עתה הוצל - למסך אנימציית הצלה. */
  recentlyRescuedParrotId: string | null;

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
  rescueParrot: (parrotId: string) => void;
  spendPearls: (amount: number) => boolean;
  buyItem: (itemId: string, price: number) => boolean;
  equipItem: (category: string, itemId: string) => void;
}

function rebuildIslands(grade: number | undefined): Island[] {
  if (!grade) return [];
  return buildIslands(grade as 1 | 2 | 3 | 4 | 5 | 6);
}

export const useGameStore = create<GameState>((set, get) => ({
  profile: null,
  session: null,
  islands: [],
  inventory: { ...DEFAULT_INVENTORY },
  recentPearlGain: null,
  recentlyRescuedParrotId: null,

  hydrate: () => {
    const profile = loadProfile();
    const session = loadSession();
    const inventory = profile ? loadInventory(profile.id) : { ...DEFAULT_INVENTORY };
    set({
      profile,
      session,
      islands: rebuildIslands(profile?.grade),
      inventory,
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
    });
  },

  resetProfile: () => {
    set({
      profile: null,
      session: null,
      islands: [],
      inventory: { ...DEFAULT_INVENTORY },
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
    set({ session, islands });
  },

  resumeSessionOrStartNew: () => {
    const existing = loadSession();
    if (existing && !existing.completedAt) {
      const profile = get().profile;
      set({
        session: existing,
        islands: rebuildIslands(profile?.grade),
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
    const attempt: QuestionAttempt = {
      questionId,
      islandId: island.id,
      studentAnswer,
      status,
      timeMs,
      pausedMs,
      pauseCount,
      startedAt,
      finishedAt: Date.now(),
      topic: question.topic,
      difficulty: question.difficulty,
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

    if (nextQInIsland < island.questionIds.length) {
      next = {
        ...session,
        currentQuestionInIslandIndex: nextQInIsland,
        draftAnswer: "",
        lastActiveAt: Date.now(),
      };
    } else {
      const nextIslandIdx = session.currentIslandIndex + 1;
      rescuedParrot = island.parrotId;
      next = {
        ...session,
        currentIslandIndex: nextIslandIdx,
        currentQuestionInIslandIndex: 0,
        draftAnswer: "",
        lastActiveAt: Date.now(),
      };
      if (nextIslandIdx >= session.islandIds.length) {
        next.completedAt = Date.now();
      }
    }

    saveSession(next);
    set({ session: next });

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
    set({ session: null });
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
  clearRecentRescue: () => set({ recentlyRescuedParrotId: null }),

  rescueParrot: (parrotId) => {
    const { profile, inventory } = get();
    if (!profile) return;
    if (inventory.rescuedParrotIds.includes(parrotId)) return;
    const next: PlayerInventory = {
      ...inventory,
      rescuedParrotIds: [...inventory.rescuedParrotIds, parrotId],
    };
    saveInventory(profile.id, next);
    set({ inventory: next, recentlyRescuedParrotId: parrotId });
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
