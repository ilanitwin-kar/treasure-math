import type { Grade, Island, Topic } from "../types";
import { QUESTIONS } from "./questions";

/**
 * שם והאימוג'י של אי לפי נושא.
 * שמות פיראטיים מעוררי דמיון.
 */
const ISLAND_INFO: Record<Topic, { title: string; emoji: string }> = {
  numbers: { title: "מצוקי הסודות", emoji: "🏔️" },
  addition: { title: "מפרץ האיחוד", emoji: "🌊" },
  subtraction: { title: "מערת ההבדלים", emoji: "🕳️" },
  multiplication: { title: "הר הכופלים", emoji: "⛰️" },
  division: { title: "גשר החלוקה", emoji: "🌉" },
  fractions: { title: "לגונת הפנינים", emoji: "🐚" },
  geometry: { title: "יער הצורות", emoji: "🌳" },
  wordProblems: { title: "חוף הסיפורים", emoji: "📜" },
  time: { title: "מגדל הזמן", emoji: "⏳" },
  counting: { title: "חוף האלמוגים", emoji: "🪸" },
};

/**
 * סדר הצגה רצוי של נושאים במפה - מהקל לקשה.
 */
const TOPIC_ORDER: Topic[] = [
  "counting",
  "numbers",
  "addition",
  "subtraction",
  "multiplication",
  "division",
  "fractions",
  "geometry",
  "time",
  "wordProblems",
];

/**
 * כמה שאלות יהיו בכל אי.
 * - אם הילד באותה כיתה - יותר שאלות (כדי לקבל אינדיקציה טובה).
 * - אם זו כיתה נמוכה יותר (בדיקת יסודות) - מעט פחות, אך עדיין משמעותי.
 */
function questionsPerIsland(isCurrentGrade: boolean): number {
  return isCurrentGrade ? 6 : 5;
}

/** מינימום שאלות באי - אם בנושא כלשהו אין מספיק, האי לא ייווצר. */
const MIN_QUESTIONS_PER_ISLAND = 5;

/**
 * בונה את רשימת האיים עבור הילד.
 * סדר: כיתה א', כיתה ב'... עד הכיתה של הילד.
 * בכל כיתה - איים לפי נושאים זמינים.
 */
export function buildIslands(grade: Grade): Island[] {
  const islands: Island[] = [];

  for (let g = 1; g <= grade; g++) {
    const isCurrentGrade = g === grade;
    const perIsland = questionsPerIsland(isCurrentGrade);

    const gradeQuestions = QUESTIONS.filter((q) => q.grade === g);

    // מקבץ שאלות לפי נושא
    const byTopic = new Map<Topic, string[]>();
    for (const q of gradeQuestions) {
      const arr = byTopic.get(q.topic) ?? [];
      if (arr.length < perIsland) {
        arr.push(q.id);
      }
      byTopic.set(q.topic, arr);
    }

    // יוצר אי לכל נושא בסדר הרצוי - רק אם יש מספיק שאלות
    for (const topic of TOPIC_ORDER) {
      const qids = byTopic.get(topic);
      if (!qids || qids.length < MIN_QUESTIONS_PER_ISLAND) continue;
      const info = ISLAND_INFO[topic];
      islands.push({
        id: `g${g}_${topic}`,
        title: `${info.title} (כיתה ${gradeHeb(g)})`,
        emoji: info.emoji,
        topic,
        grade: g as Grade,
        questionIds: qids,
        parrotId: topic,
      });
    }
  }

  return islands;
}

function gradeHeb(grade: number): string {
  return ["", "א'", "ב'", "ג'", "ד'", "ה'", "ו'"][grade] ?? `${grade}`;
}

export function getIslandById(id: string, islands: Island[]): Island | undefined {
  return islands.find((i) => i.id === id);
}
