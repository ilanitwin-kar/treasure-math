import type { Grade, Island, QuestionAttempt } from "../types";

/** מינימום תשובות (לא דילוג) בבלוק כיתה כדי לאפשר דילוג קדימה. */
const MIN_ANSWERED_IN_GRADE_BLOCK = 12;

/** יחס נכונות מינימלי (מתוך ניסיונות לא-דילוג) כדי לדלג על כיתות ביניים. */
const MIN_CORRECT_RATIO_TO_SKIP = 0.85;

/** מינימום ניסיונות בכיתה אחת מתחת לאי — כדי לסמן "חור" לחזרה. */
const REVISIT_MIN_ANSWERED_IN_GRADE_BELOW = 8;

/** מספר שאלות (ניסיונות) מינימלי אחרי דילוג כדי לאפשר חזרה לאי שדולג. */
const MIN_ATTEMPTS_AFTER_SKIP_FOR_REVISIT = 3;

function islandById(islands: Island[], id: string): Island | undefined {
  return islands.find((i) => i.id === id);
}

/** האם האי באינדקס `completedIndex` הוא האחרון ברצף לפני מעבר לכיתה גבוהה יותר. */
export function isLastIslandOfGradeInQueue(
  islandIds: string[],
  islands: Island[],
  completedIndex: number
): boolean {
  const cur = islandById(islands, islandIds[completedIndex]);
  if (!cur) return false;
  const g = cur.grade;
  for (let i = completedIndex + 1; i < islandIds.length; i++) {
    const next = islandById(islands, islandIds[i]);
    if (next && next.grade === g) return false;
  }
  return true;
}

/**
 * יחס נכונות על כל הניסיונות באיים של כיתה `grade` שכבר הושלמו עד אינדקס `lastCompletedIslandIndex` (כולל).
 */
export function accuracyForCompletedGradeBlock(
  attempts: QuestionAttempt[],
  islandIds: string[],
  islands: Island[],
  grade: Grade,
  lastCompletedIslandIndexInclusive: number
): { ratio: number; answered: number } {
  const idsInBlock = new Set<string>();
  for (let i = 0; i <= lastCompletedIslandIndexInclusive; i++) {
    const isl = islandById(islands, islandIds[i]);
    if (isl && isl.grade === grade) idsInBlock.add(isl.id);
  }
  const relevant = attempts.filter(
    (a) => idsInBlock.has(a.islandId) && a.status !== "skipped"
  );
  if (relevant.length === 0) return { ratio: 0, answered: 0 };
  const correct = relevant.filter((a) => a.status === "correct").length;
  return { ratio: correct / relevant.length, answered: relevant.length };
}

/**
 * אם התלמיד סיים בלוק כיתה והוכיח שליטה — מסיר מהתור איים של כיתות ביניים (מעל g ומתחת לכיתת הפרופיל).
 * מחזיר מערך מזהים חדש, או null אם אין שינוי.
 */
export function compressIslandQueueAfterGradeBlock(
  islandIds: string[],
  islands: Island[],
  completedIslandIndex: number,
  completedGrade: Grade,
  profileGrade: Grade
): string[] | null {
  if (completedGrade >= profileGrade) return null;
  // צריך לפחות כיתה אחת "באמצע" כדי שיהיה מה לדלג (למשל ו' עם סיום א' → דילוג ב'-ה').
  if (completedGrade >= profileGrade - 1) return null;

  const filtered = islandIds.filter((id, idx) => {
    if (idx <= completedIslandIndex) return true;
    const isl = islandById(islands, id);
    if (!isl) return true;
    if (isl.grade > completedGrade && isl.grade < profileGrade) return false;
    return true;
  });

  if (filtered.length === islandIds.length) return null;
  return filtered;
}

export function shouldOfferAdaptiveSkip(
  attempts: QuestionAttempt[],
  islandIds: string[],
  islands: Island[],
  completedIslandIndex: number,
  completedGrade: Grade,
  profileGrade: Grade
): boolean {
  if (!isLastIslandOfGradeInQueue(islandIds, islands, completedIslandIndex)) return false;
  if (completedGrade >= profileGrade - 1) return false;
  const { ratio, answered } = accuracyForCompletedGradeBlock(
    attempts,
    islandIds,
    islands,
    completedGrade,
    completedIslandIndex
  );
  return answered >= MIN_ANSWERED_IN_GRADE_BLOCK && ratio >= MIN_CORRECT_RATIO_TO_SKIP;
}

// ---------- 1. Confidence (זמן + ממוצע משוקלל 3 ניסיונות אחרונים באי) ----------

/** שניות מענה לניסיון — עדיפות ל־`timeSeconds` אם קיים. */
export function attemptTimeSeconds(a: QuestionAttempt): number {
  if (typeof a.timeSeconds === "number" && !Number.isNaN(a.timeSeconds)) {
    return Math.max(0, a.timeSeconds);
  }
  return Math.max(0, a.timeMs / 1000);
}

/**
 * מכפיל זמן / דילוג לפי האפיון.
 * דילוג: ×0.5 (ענף נפרד מפסי הזמן).
 */
export function answerTimeMultiplier(a: QuestionAttempt): number {
  if (a.status === "skipped") return 0.5;
  const s = attemptTimeSeconds(a);
  if (s < 15) return 1.2;
  if (s <= 45) return 1.0;
  if (s <= 90) return 0.8;
  return 0.7;
}

/** ציון גלם: 1 נכון, 0 אחרת (כולל דילוג → 0 לפני המכפיל). */
export function confidenceRawScore(a: QuestionAttempt): number {
  return a.status === "correct" ? 1 : 0;
}

/**
 * ציון ביטחון לניסיון בודד: ציון גלם × מכפיל זמן/דילוג.
 * דילוג: 0 × 0.5 = 0; אפשר להרחיב ל"עונש" אחר אם תרצו raw שונה לדילוג.
 */
export function confidenceForAttempt(a: QuestionAttempt): number {
  return confidenceRawScore(a) * answerTimeMultiplier(a);
}

/** כינוי ל־`confidenceForAttempt` — לשימוש אחרי כל ניסיון ב־gameStore. */
export function calculateConfidenceScore(attempt: QuestionAttempt): number {
  return confidenceForAttempt(attempt);
}

const ISLAND_CONF_WEIGHTS = [0.5, 0.3, 0.2] as const;

/**
 * ממוצע משוקלל של 3 הניסיונות האחרונים באותו אי (לפי `finishedAt`).
 * אם יש פחות מ־3 — מנרמל משקלים.
 */
export function islandConfidenceScore(attempts: QuestionAttempt[], islandId: string): number {
  const onIsland = attempts
    .filter((a) => a.islandId === islandId)
    .sort((a, b) => a.finishedAt - b.finishedAt);
  if (onIsland.length === 0) return 0;
  const last3 = onIsland.slice(-3);
  const scores = last3.map((a) => confidenceForAttempt(a));
  const n = scores.length;
  if (n === 1) return scores[0];
  if (n === 2) {
    const wNew = ISLAND_CONF_WEIGHTS[0] / (ISLAND_CONF_WEIGHTS[0] + ISLAND_CONF_WEIGHTS[1]);
    const wOld = ISLAND_CONF_WEIGHTS[1] / (ISLAND_CONF_WEIGHTS[0] + ISLAND_CONF_WEIGHTS[1]);
    return scores[0] * wOld + scores[1] * wNew;
  }
  return (
    scores[0] * ISLAND_CONF_WEIGHTS[2] +
    scores[1] * ISLAND_CONF_WEIGHTS[1] +
    scores[2] * ISLAND_CONF_WEIGHTS[0]
  );
}

// ---------- 2. חורים – איים עם דילוג שלא חזרו אליהם + שליטה בכיתה מתחת ----------

function lastIslandIndexForGradeUpTo(
  islandIds: string[],
  islands: Island[],
  grade: Grade,
  beforeIndexExclusive: number
): number {
  let last = -1;
  for (let i = 0; i < beforeIndexExclusive; i++) {
    const isl = islandById(islands, islandIds[i]);
    if (isl && isl.grade === grade) last = i;
  }
  return last;
}

/** האם יש הוכחת שליטה בכיתה `grade` (בלוק שהושלם עד אינדקס כולל). */
export function hasProvenMasteryForGrade(
  attempts: QuestionAttempt[],
  islandIds: string[],
  islands: Island[],
  grade: Grade,
  lastCompletedIslandIndexInclusive: number
): boolean {
  const { ratio, answered } = accuracyForCompletedGradeBlock(
    attempts,
    islandIds,
    islands,
    grade,
    lastCompletedIslandIndexInclusive
  );
  return answered >= REVISIT_MIN_ANSWERED_IN_GRADE_BELOW && ratio >= MIN_CORRECT_RATIO_TO_SKIP;
}

/** זמן הדילוג האחרון באי (אם אין דילוג — null). */
export function lastSkipFinishedAtOnIsland(attempts: QuestionAttempt[], islandId: string): number | null {
  const skips = attempts
    .filter((a) => a.islandId === islandId && a.status === "skipped")
    .map((a) => a.finishedAt);
  if (skips.length === 0) return null;
  return Math.max(...skips);
}

/** האם אחרי הדילוג האחרון אין עדיין תשובה "רגילה" (נכון/לא נכון) באותו אי. */
export function hasNoAnswerAfterLastSkip(attempts: QuestionAttempt[], islandId: string): boolean {
  const tSkip = lastSkipFinishedAtOnIsland(attempts, islandId);
  if (tSkip === null) return false;
  return !attempts.some(
    (a) =>
      a.islandId === islandId &&
      a.finishedAt > tSkip &&
      (a.status === "correct" || a.status === "incorrect")
  );
}

/**
 * איים שדולגו עליהם (לפחות דילוג אחד), עדיין לא חזרו עם תשובה אחרי הדילוג,
 * והכיתה מתחת לאי הוכחה כשליטה (לפי אותם ספים כמו בדילוג כיתתי, עם מינימום ניסיונות נמוך יותר).
 */
export function getSkippedIslandsToRevisit(
  attempts: QuestionAttempt[],
  islandIds: string[],
  islands: Island[],
  profileGrade: Grade,
  /** אינדקס האי הנוכחי במסלול (לא כולל) — רק איים לפניו נבדקים כ"עברו". */
  currentIslandIndexExclusive: number
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < currentIslandIndexExclusive; i++) {
    const id = islandIds[i];
    const isl = islandById(islands, id);
    if (!isl || isl.grade < 2 || isl.grade > profileGrade) continue;
    const gradeBelow = (isl.grade - 1) as Grade;
    const lastBelow = lastIslandIndexForGradeUpTo(islandIds, islands, gradeBelow, i);
    if (lastBelow < 0) continue;
    if (!hasProvenMasteryForGrade(attempts, islandIds, islands, gradeBelow, lastBelow)) continue;
    if (lastSkipFinishedAtOnIsland(attempts, id) === null) continue;
    if (!hasNoAnswerAfterLastSkip(attempts, id)) continue;
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

// ---------- 3. חזרה אחרי דילוג ----------

/** כמה ניסיונות (כל איים) אחרי זמן הדילוג האחרון באי הנתון. */
export function countAttemptsAfterLastSkipOnIsland(
  attempts: QuestionAttempt[],
  islandId: string
): number {
  const tSkip = lastSkipFinishedAtOnIsland(attempts, islandId);
  if (tSkip === null) return 0;
  return attempts.filter((a) => a.finishedAt > tSkip).length;
}

/**
 * האם כדאי "לחזור" לאי שדולג: עברו מספיק שאלות מאז הדילוג, ועדיין אין תשובה אחרי הדילוג באותו אי.
 */
export function shouldRevisitSkipped(
  attempts: QuestionAttempt[],
  skippedIslandId: string,
  minAttemptsAfterSkip: number = MIN_ATTEMPTS_AFTER_SKIP_FOR_REVISIT
): boolean {
  if (lastSkipFinishedAtOnIsland(attempts, skippedIslandId) === null) return false;
  if (!hasNoAnswerAfterLastSkip(attempts, skippedIslandId)) return false;
  return countAttemptsAfterLastSkipOnIsland(attempts, skippedIslandId) >= minAttemptsAfterSkip;
}

/**
 * מסדר את זנב האי מהשאלה שדולגה ואילך: קודם כל שאלות עם `difficulty` נמוך מזו של השאלה שדולגה,
 * אחר כך השאלה שדולגה, ואז השאר (לא פחות קלות מהשאלה שדולגה), לפי קושי עולה.
 */
export function reorderQuestionIdsPreferringEasierThanSkipped(
  questionIds: string[],
  skippedQuestionId: string,
  difficulties: number[]
): string[] {
  if (questionIds.length !== difficulties.length) return [...questionIds];
  const skipIdx = questionIds.indexOf(skippedQuestionId);
  if (skipIdx < 0) return [...questionIds];
  const dSkip = difficulties[skipIdx];
  const head = questionIds.slice(0, skipIdx);
  const tailIds = questionIds.slice(skipIdx + 1);
  const tailDiffs = difficulties.slice(skipIdx + 1);
  const pairs = tailIds.map((qid, j) => ({ qid, d: tailDiffs[j] ?? 99 }));
  const easier = pairs.filter((p) => p.d < dSkip).sort((a, b) => a.d - b.d);
  const notEasier = pairs.filter((p) => p.d >= dSkip).sort((a, b) => a.d - b.d);
  return [...head, ...easier.map((p) => p.qid), skippedQuestionId, ...notEasier.map((p) => p.qid)];
}

export const ADAPTIVE_PATH_CONSTANTS = {
  MIN_ANSWERED_IN_GRADE_BLOCK,
  MIN_CORRECT_RATIO_TO_SKIP,
  REVISIT_MIN_ANSWERED_IN_GRADE_BELOW,
  MIN_ATTEMPTS_AFTER_SKIP_FOR_REVISIT,
} as const;

