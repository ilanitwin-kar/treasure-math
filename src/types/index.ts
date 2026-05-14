export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * זהויי פיראטים שהילד יכול לבחור באוואטר שלו.
 * שמות לפי הסיפור הפיראטי.
 */
export type PirateId =
  // בנים
  | "captain_jack"
  | "blackbeard"
  | "scout"
  | "redbeard"
  | "lookout"
  | "navigator"
  // בנות
  | "pearl"
  | "anne"
  | "storm"
  | "ruby"
  | "sky"
  | "rosie";

export type PirateGender = "boy" | "girl";

export interface PirateInfo {
  id: PirateId;
  name: string;
  gender: PirateGender;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: Grade;
  age: number;
  pirateId: PirateId;
  createdAt: number;
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type Topic =
  | "numbers"
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "fractions"
  | "geometry"
  | "wordProblems"
  | "time"
  | "counting";

/**
 * סוג הצגה של שאלה.
 * - text: שאלה טקסטואלית רגילה (יכולה להיות חישוב או מילולית).
 * - clock: שעון מצויר - הילד קורא שעה.
 * - counting: ספירת תמונות שמופיעות על המסך.
 * - shape: זיהוי צורה גאומטרית מצוירת.
 */
export type QuestionKind = "text" | "clock" | "counting" | "shape";

export interface VisualClock {
  type: "clock";
  hour: number; // 1-12
}

export interface VisualCounting {
  type: "counting";
  emoji: string;
  count: number;
}

export interface VisualShape {
  type: "shape";
  shape: "triangle" | "square" | "rectangle" | "pentagon" | "hexagon" | "circle";
  sides?: number; // אם רוצים לסמן את הצלעות
}

export type QuestionVisual = VisualClock | VisualCounting | VisualShape;

export interface Question {
  id: string;
  text: string;
  answer: string;
  topic: Topic;
  difficulty: DifficultyLevel;
  grade: Grade;
  kind?: QuestionKind; // ברירת מחדל: "text"
  visual?: QuestionVisual;
  hint?: string;
  acceptAlternatives?: string[]; // תשובות נוספות חוקיות (למשל: "ריבוע" או "מרובע")
}

/**
 * אישיות התוכי - מסומן לעיצוב חזותי ולטון הדיבור.
 */
export type ParrotPersonality =
  | "smart" // 🤓 חכמולוג
  | "emotional" // 🥰 רגשני
  | "grumpy" // 😤 ציני
  | "showoff" // 💪 ראוותן
  | "calm" // 🧘 רוגע
  | "dramatic" // 😭 דרמטי
  | "artist" // 🎨 אמן
  | "storyteller" // 📖 מספר סיפורים
  | "rushed" // ⏰ לחוץ-בזמן
  | "silly"; // 🤪 שובב

/**
 * משפטי תוכי - מסודרים לפי שלב, כל שלב מכיל מערך וריאציות.
 * שמירת המבנה הזה לפי גיל מאפשרת להתאים את המשפטים לרמת הילד.
 */
export interface ParrotSpeechVariants {
  intro: string[]; // ההצגה הראשונה
  midSpeech: string[]; // משפט אמצע (לא תלוי-כמות)
  waitingSpeech: string[]; // עם {n} - מספר חידות שנותרו
  lastQuestion: string[]; // לפני החידה האחרונה באי
  free: string[]; // אחרי שיצא מהכלוב
}

/**
 * תוכי-פיראט - דמות לכל אי.
 * נחטף לאי, הילד צריך להציל אותו על-ידי השלמת השאלות.
 */
export interface Parrot {
  id: string; // = topic name
  name: string;
  power: string;
  color: string;
  emoji: string;
  personality: ParrotPersonality;
  rewardDescription: string;
  /** משפטים לכיתות א'-ב' - שפה פשוטה. */
  younger: ParrotSpeechVariants;
  /** משפטים לכיתות ג' ומעלה - הומור מתוחכם יותר. */
  older: ParrotSpeechVariants;
}

/**
 * אי במפה - מקבץ של שאלות מאותו נושא.
 * כל אי הוא "אתגר" שמורכב מ-X שאלות, ומחזיק תוכי-פיראט שיש להציל.
 */
export interface Island {
  id: string;
  title: string;
  emoji: string;
  topic: Topic;
  grade: Grade;
  questionIds: string[];
  parrotId: string; // התוכי שמחכה באי
}

export type AnswerStatus = "correct" | "incorrect" | "skipped";

export interface QuestionAttempt {
  questionId: string;
  islandId: string;
  studentAnswer: string;
  status: AnswerStatus;
  timeMs: number;
  pausedMs: number;
  pauseCount: number;
  startedAt: number;
  finishedAt: number;
  topic: Topic;
  difficulty: DifficultyLevel;
}

export interface AssessmentSession {
  id: string;
  studentId: string;
  startedAt: number;
  lastActiveAt: number;
  completedAt?: number;
  islandIds: string[];
  currentIslandIndex: number;
  currentQuestionInIslandIndex: number;
  attempts: QuestionAttempt[];
  draftAnswer: string;
}

/**
 * אוסף הפנינים והתוכים שילד אסף לאורך הזמן.
 * נשמר ב-localStorage ונשאר בין הפעלות.
 */
export interface PlayerInventory {
  /** סה"כ פנינים שצברה. מתעדכן בכל שאלה שנענתה. */
  pearls: number;
  /** רשימת ID-ים של תוכים שהילד הציל. */
  rescuedParrotIds: string[];
  /** רשימת פריטים שקנתה הילד בחנות. */
  ownedItems: string[];
  /** הפריט הפעיל כרגע (כובע, ספינה וכו'). */
  equippedItems: Record<string, string | undefined>; // category -> itemId
}

/**
 * פריט בחנות הפיראטים.
 * הילד יכול לקנות בפנינים.
 */
export interface ShopItem {
  id: string;
  name: string;
  category: "hat" | "ship" | "pet" | "decoration";
  emoji: string;
  description: string;
  priceInPearls: number;
}
