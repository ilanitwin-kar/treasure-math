import type { Question } from "../types";
import { GRADE_1_QUESTIONS } from "./curriculum/grade1";
import { GRADE_2_QUESTIONS } from "./curriculum/grade2";
import { GRADE_3_QUESTIONS } from "./curriculum/grade3";
import { GRADE_4_QUESTIONS } from "./curriculum/grade4";
import { GRADE_5_QUESTIONS } from "./curriculum/grade5";
import { GRADE_6_QUESTIONS } from "./curriculum/grade6";

/**
 * מאגר השאלות המרכזי.
 *
 * כל מאגר נבנה לפי תוכנית הלימודים הרשמית של משרד החינוך, כיתות א' עד ו'.
 * ראו את הקבצים בתיקיית `curriculum/` ב-`src/data/curriculum/`.
 */
export const QUESTIONS: Question[] = [
  ...GRADE_1_QUESTIONS,
  ...GRADE_2_QUESTIONS,
  ...GRADE_3_QUESTIONS,
  ...GRADE_4_QUESTIONS,
  ...GRADE_5_QUESTIONS,
  ...GRADE_6_QUESTIONS,
];

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
