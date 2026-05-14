import type {
  AssessmentSession,
  QuestionAttempt,
  StudentProfile,
  Topic,
} from "../types";
import { getQuestionById } from "./questions";

/** סיכום הסטטיסטיקה של נושא אחד אצל ילד. */
export interface TopicInsight {
  topic: Topic;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  skipped: number;
  averageTimeMs: number;
  longestTimeMs: number;
  pauseTotal: number;
}

export interface IncorrectAttemptDetail {
  questionId: string;
  questionText: string;
  correctAnswer: string;
  studentAnswer: string;
  topic: Topic;
  timeMs: number;
}

export interface StudentReport {
  profile: StudentProfile;
  totalAttempts: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  totalActiveTimeMs: number;
  totalPausedMs: number;
  averageTimePerQuestionMs: number;
  topicInsights: TopicInsight[];
  incorrectAttempts: IncorrectAttemptDetail[];
  skippedAttempts: IncorrectAttemptDetail[];
  strengths: Topic[];
  weaknesses: Topic[];
  recommendations: string[];
  // ===== מידע על מצב המסעות =====
  totalSessions: number;
  completedSessions: number;
  hasActiveSession: boolean;
  lastActiveAt: number | null;
}

const TOPIC_LABEL: Record<Topic, string> = {
  numbers: "מספרים",
  addition: "חיבור",
  subtraction: "חיסור",
  multiplication: "כפל",
  division: "חילוק",
  fractions: "שברים",
  geometry: "גאומטריה",
  wordProblems: "בעיות מילוליות",
  time: "שעון וזמן",
  counting: "ספירה",
};

export function topicLabel(topic: Topic): string {
  return TOPIC_LABEL[topic] ?? topic;
}

function attemptToDetail(a: QuestionAttempt): IncorrectAttemptDetail {
  const q = getQuestionById(a.questionId);
  return {
    questionId: a.questionId,
    questionText: q?.text ?? a.questionId,
    correctAnswer: q?.answer ?? "?",
    studentAnswer: a.studentAnswer,
    topic: a.topic,
    timeMs: a.timeMs,
  };
}

function computeTopicInsight(topic: Topic, attempts: QuestionAttempt[]): TopicInsight {
  const filtered = attempts.filter((a) => a.topic === topic);
  const correct = filtered.filter((a) => a.status === "correct").length;
  const incorrect = filtered.filter((a) => a.status === "incorrect").length;
  const skipped = filtered.filter((a) => a.status === "skipped").length;
  const totalTime = filtered.reduce((sum, a) => sum + a.timeMs, 0);
  const longestTimeMs = filtered.reduce((max, a) => Math.max(max, a.timeMs), 0);
  const averageTimeMs = filtered.length > 0 ? Math.round(totalTime / filtered.length) : 0;
  const pauseTotal = filtered.reduce((sum, a) => sum + a.pauseCount, 0);
  return {
    topic,
    totalQuestions: filtered.length,
    correct,
    incorrect,
    skipped,
    averageTimeMs,
    longestTimeMs,
    pauseTotal,
  };
}

function buildRecommendations(
  weaknesses: Topic[],
  strengths: Topic[],
  topicInsights: TopicInsight[]
): string[] {
  const recs: string[] = [];

  if (weaknesses.length === 0 && strengths.length > 0) {
    recs.push("🌟 הילד שולט יפה בחומר. כדאי להעמיק ולתת אתגרים בכיתה מתקדמת יותר.");
  }

  for (const topic of weaknesses) {
    const insight = topicInsights.find((t) => t.topic === topic);
    if (!insight) continue;
    const successRate = insight.totalQuestions > 0
      ? Math.round((insight.correct / insight.totalQuestions) * 100)
      : 0;
    recs.push(
      `📚 לחזק את נושא ה-${topicLabel(topic)}: הצלחה של ${successRate}% בלבד. כדאי לתת תרגול ממוקד.`
    );
  }

  const slowTopics = topicInsights
    .filter((t) => t.totalQuestions > 0 && t.averageTimeMs > 30_000)
    .sort((a, b) => b.averageTimeMs - a.averageTimeMs);
  if (slowTopics.length > 0) {
    const topic = slowTopics[0];
    recs.push(
      `⏱ לוקח לילד זמן רב מאוד ב-${topicLabel(topic.topic)} (ממוצע ${Math.round(
        topic.averageTimeMs / 1000
      )} שנ'). אולי כדאי לבדוק הבנה בסיסית של הנושא.`
    );
  }

  if (strengths.length > 0) {
    recs.push(
      `💪 חזק במיוחד ב: ${strengths.map(topicLabel).join(", ")}. אפשר להישען על הנושאים האלה לחיזוק הביטחון.`
    );
  }

  return recs;
}

export function buildStudentReport(
  profile: StudentProfile,
  sessions: AssessmentSession[]
): StudentReport {
  const attempts = sessions.flatMap((s) => s.attempts);

  const totalCorrect = attempts.filter((a) => a.status === "correct").length;
  const totalIncorrect = attempts.filter((a) => a.status === "incorrect").length;
  const totalSkipped = attempts.filter((a) => a.status === "skipped").length;
  const totalActiveTimeMs = attempts.reduce((sum, a) => sum + a.timeMs, 0);
  const totalPausedMs = attempts.reduce((sum, a) => sum + a.pausedMs, 0);
  const averageTimePerQuestionMs = attempts.length > 0
    ? Math.round(totalActiveTimeMs / attempts.length)
    : 0;

  const allTopics: Topic[] = [
    "numbers",
    "addition",
    "subtraction",
    "multiplication",
    "division",
    "fractions",
    "geometry",
    "wordProblems",
    "time",
    "counting",
  ];

  const topicInsights = allTopics
    .map((t) => computeTopicInsight(t, attempts))
    .filter((t) => t.totalQuestions > 0)
    .sort((a, b) => b.totalQuestions - a.totalQuestions);

  const strengths = topicInsights
    .filter((t) => t.correct / t.totalQuestions >= 0.75 && t.totalQuestions >= 3)
    .map((t) => t.topic);

  const weaknesses = topicInsights
    .filter((t) => t.correct / t.totalQuestions <= 0.5 && t.totalQuestions >= 2)
    .map((t) => t.topic);

  const incorrectAttempts = attempts
    .filter((a) => a.status === "incorrect")
    .map(attemptToDetail);

  const skippedAttempts = attempts
    .filter((a) => a.status === "skipped")
    .map(attemptToDetail);

  const completedSessions = sessions.filter((s) => s.completedAt != null).length;
  const activeSession = sessions.find((s) => s.completedAt == null);
  const lastActiveAt = sessions.reduce<number | null>(
    (max, s) => (max == null || s.lastActiveAt > max ? s.lastActiveAt : max),
    null
  );

  return {
    profile,
    totalAttempts: attempts.length,
    totalCorrect,
    totalIncorrect,
    totalSkipped,
    totalActiveTimeMs,
    totalPausedMs,
    averageTimePerQuestionMs,
    topicInsights,
    incorrectAttempts,
    skippedAttempts,
    strengths,
    weaknesses,
    recommendations: buildRecommendations(weaknesses, strengths, topicInsights),
    totalSessions: sessions.length,
    completedSessions,
    hasActiveSession: activeSession != null,
    lastActiveAt,
  };
}

export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} שנ'`;
  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  return `${minutes}:${remSec.toString().padStart(2, "0")} דק'`;
}

/** מחזיר תיאור מילולי של מתי הילד היה פעיל לאחרונה. */
export function formatLastActive(ts: number | null): string {
  if (ts == null) return "לא היה פעיל עדיין";
  const now = Date.now();
  const diff = now - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "פעיל עכשיו 🟢";
  if (minutes < 60) return `לפני ${minutes} דק'`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}
