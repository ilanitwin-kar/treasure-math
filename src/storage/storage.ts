import type {
  AssessmentSession,
  PlayerInventory,
  QuestionAttempt,
  StudentProfile,
} from "../types";

const KEYS = {
  profile: "treasure_app_profile",
  session: "treasure_app_session",
  completedSessions: "treasure_app_completed_sessions",
  inventory: "treasure_app_inventory",
  allProfiles: "treasure_app_all_profiles", // לרשימת כל הילדים שמופיעים בלוח של המורה
  seenIntro: "treasure_app_seen_intro", // האם הסיפור הוצג כבר במכשיר זה
} as const;

export const DEFAULT_INVENTORY: PlayerInventory = {
  pearls: 0,
  rescuedParrotIds: [],
  ownedItems: [],
  equippedItems: {},
};

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Fail silently. Storage may be full or unavailable (private mode).
  }
}

export function loadProfile(): StudentProfile | null {
  const profile = safeGet<StudentProfile & { iconId?: string }>(KEYS.profile);
  if (!profile) return null;
  // פרופיל ישן (לפני שינוי האייקונים לפיראטים) - מנוטרל.
  if (!profile.pirateId) {
    localStorage.removeItem(KEYS.profile);
    localStorage.removeItem(KEYS.session);
    return null;
  }
  return profile;
}

export function saveProfile(profile: StudentProfile): void {
  safeSet(KEYS.profile, profile);
}

export function clearProfile(): void {
  localStorage.removeItem(KEYS.profile);
}

export function loadSession(): AssessmentSession | null {
  const session = safeGet<AssessmentSession>(KEYS.session);
  if (!session) return null;
  // ולידציה - אם המבנה לא תקין (סשן ישן ממבנה קודם של האפליקציה) - נמחק.
  if (
    !Array.isArray(session.islandIds) ||
    typeof session.currentIslandIndex !== "number" ||
    typeof session.currentQuestionInIslandIndex !== "number"
  ) {
    localStorage.removeItem(KEYS.session);
    return null;
  }
  return session;
}

export function saveSession(session: AssessmentSession): void {
  safeSet(KEYS.session, session);
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.session);
}

export function archiveSession(session: AssessmentSession): void {
  const completed = safeGet<AssessmentSession[]>(KEYS.completedSessions) ?? [];
  completed.push(session);
  safeSet(KEYS.completedSessions, completed);
}

export function loadCompletedSessions(): AssessmentSession[] {
  return safeGet<AssessmentSession[]>(KEYS.completedSessions) ?? [];
}

// Helper to find all attempts across all sessions (used later for teacher dashboard).
export function loadAllAttempts(): QuestionAttempt[] {
  const sessions = loadCompletedSessions();
  return sessions.flatMap((s) => s.attempts);
}

// ============== Inventory (פנינים, תוכים, פריטים) ==============

function inventoryKey(studentId: string): string {
  return `${KEYS.inventory}_${studentId}`;
}

export function loadInventory(studentId: string): PlayerInventory {
  const inv = safeGet<PlayerInventory>(inventoryKey(studentId));
  if (!inv) return { ...DEFAULT_INVENTORY };
  return {
    pearls: inv.pearls ?? 0,
    rescuedParrotIds: Array.isArray(inv.rescuedParrotIds) ? inv.rescuedParrotIds : [],
    ownedItems: Array.isArray(inv.ownedItems) ? inv.ownedItems : [],
    equippedItems: inv.equippedItems ?? {},
  };
}

export function saveInventory(studentId: string, inventory: PlayerInventory): void {
  safeSet(inventoryKey(studentId), inventory);
}

// ============== All Profiles (לדשבורד המורה) ==============

export function addProfileToList(profile: StudentProfile): void {
  const all = safeGet<StudentProfile[]>(KEYS.allProfiles) ?? [];
  const idx = all.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    all[idx] = profile;
  } else {
    all.push(profile);
  }
  safeSet(KEYS.allProfiles, all);
}

export function loadAllProfiles(): StudentProfile[] {
  return safeGet<StudentProfile[]>(KEYS.allProfiles) ?? [];
}

// ============== Intro Story Flag ==============

export function hasSeenIntro(): boolean {
  return localStorage.getItem(KEYS.seenIntro) === "1";
}

export function markIntroSeen(): void {
  localStorage.setItem(KEYS.seenIntro, "1");
}

// ============== Sessions per student (לדשבורד המורה) ==============

/**
 * מחזיר את כל הסשנים של ילד מסוים - **כולל את הסשן שבתהליך עכשיו**.
 * זה חשוב כדי שהמורה תראה בזמן אמת את ההתקדמות של הילד,
 * גם לפני שהוא סיים את כל המסע.
 */
export function loadSessionsForStudent(studentId: string): AssessmentSession[] {
  const completed = loadCompletedSessions().filter((s) => s.studentId === studentId);
  const active = loadSession();
  if (active && active.studentId === studentId && !active.completedAt) {
    // הסשן הפעיל - לוודא שהוא לא כפול (לא אמור לקרות, אבל ליתר ביטחון).
    if (!completed.some((s) => s.id === active.id)) {
      return [...completed, active];
    }
  }
  return completed;
}
