import type { Question } from "../../types";

/**
 * כיתה א' - מבוסס על תוכנית הלימודים של משרד החינוך.
 *
 * הנושאים המרכזיים (לפי המסמך הרשמי):
 * 1. הכרת המספרים הטבעיים בתחום 0-100 (ספירה, מנייה, סדר, סדרות, ישר המספרים)
 * 2. פעולות חשבון בתחום ה-100 (חיבור וחיסור עד 20, עשרות שלמות עד 100)
 * 3. צורות גיאומטריות (מצולעים, מיון)
 * 4. מדידות אורך (השוואות, יחידות מידה)
 * 5. מדידת זמן (שעון בשעות שלמות)
 * 6. חקר נתונים (קריאה בדיאגרמות)
 *
 * הערה: שאלות שדורשות תמונה (גיאומטריה, שעון, דיאגרמה) - יסומנו בשדה
 * needsVisual ויקבלו טיפול מיוחד בעתיד. כרגע הוצאתי אותן או הפכתי אותן
 * לטקסטואליות.
 */
export const GRADE_1_QUESTIONS: Question[] = [
  // ===============================
  // נושא 1: הכרת המספרים עד 100
  // ===============================

  // ספירה וסדר
  { id: "g1_seq_after_3", text: "איזה מספר בא אחרי 3?", answer: "4", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_seq_after_9", text: "איזה מספר בא אחרי 9?", answer: "10", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_seq_before_7", text: "איזה מספר בא לפני 7?", answer: "6", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_seq_after_19", text: "איזה מספר בא אחרי 19?", answer: "20", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_seq_after_29", text: "איזה מספר בא אחרי 29?", answer: "30", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_seq_after_99", text: "איזה מספר בא אחרי 99?", answer: "100", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_seq_before_50", text: "איזה מספר בא לפני 50?", answer: "49", topic: "numbers", difficulty: 1, grade: 1 },

  // השוואה בין מספרים (סדר המספרים)
  { id: "g1_bigger_a", text: "איזה מספר גדול יותר: 7 או 5?", answer: "7", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_bigger_b", text: "איזה מספר גדול יותר: 15 או 17?", answer: "17", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_smaller_a", text: "איזה מספר קטן יותר: 12 או 21?", answer: "12", topic: "numbers", difficulty: 1, grade: 1 },

  // סדרות (דילוגים של 2, 5, 10)
  { id: "g1_pat_2_a", text: "סדרה: 2, 4, 6, 8, ___ - מה המספר הבא?", answer: "10", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_pat_5_a", text: "סדרה: 5, 10, 15, 20, ___ - מה המספר הבא?", answer: "25", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_pat_10_a", text: "סדרה: 10, 20, 30, 40, ___ - מה המספר הבא?", answer: "50", topic: "numbers", difficulty: 1, grade: 1 },
  { id: "g1_pat_2_back", text: "סדרה אחורה: 10, 8, 6, ___ - מה המספר הבא?", answer: "4", topic: "numbers", difficulty: 1, grade: 1 },

  // ===============================
  // נושא 2: חיבור וחיסור
  // ===============================

  // חיבור עד 10 (הכי בסיסי)
  { id: "g1_add_10_a", text: "2 + 3 = ?", answer: "5", topic: "addition", difficulty: 1, grade: 1, hint: "אפשר לספור על האצבעות" },
  { id: "g1_add_10_b", text: "4 + 4 = ?", answer: "8", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_add_10_c", text: "5 + 5 = ?", answer: "10", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_add_10_d", text: "6 + 3 = ?", answer: "9", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_add_10_e", text: "1 + 7 = ?", answer: "8", topic: "addition", difficulty: 1, grade: 1 },

  // פירוקים של 10 (קריטי לפי תוכנית הלימודים)
  { id: "g1_add_complete_10_a", text: "3 + ___ = 10", answer: "7", topic: "addition", difficulty: 1, grade: 1, hint: "כמה צריך להוסיף כדי להגיע ל-10?" },
  { id: "g1_add_complete_10_b", text: "6 + ___ = 10", answer: "4", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_add_complete_10_c", text: "___ + 8 = 10", answer: "2", topic: "addition", difficulty: 1, grade: 1 },

  // חיבור עד 20 (קצת יותר מאתגר)
  { id: "g1_add_20_a", text: "7 + 5 = ?", answer: "12", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_add_20_b", text: "8 + 6 = ?", answer: "14", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_add_20_c", text: "9 + 9 = ?", answer: "18", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_add_20_d", text: "12 + 4 = ?", answer: "16", topic: "addition", difficulty: 1, grade: 1 },

  // 0 כאיבר ניטרלי
  { id: "g1_add_zero", text: "5 + 0 = ?", answer: "5", topic: "addition", difficulty: 1, grade: 1 },

  // חיסור עד 10
  { id: "g1_sub_10_a", text: "7 - 3 = ?", answer: "4", topic: "subtraction", difficulty: 1, grade: 1 },
  { id: "g1_sub_10_b", text: "9 - 5 = ?", answer: "4", topic: "subtraction", difficulty: 1, grade: 1 },
  { id: "g1_sub_10_c", text: "10 - 4 = ?", answer: "6", topic: "subtraction", difficulty: 1, grade: 1 },
  { id: "g1_sub_10_d", text: "8 - 8 = ?", answer: "0", topic: "subtraction", difficulty: 1, grade: 1, hint: "כל מספר פחות עצמו הוא 0" },

  // חיסור עד 20
  { id: "g1_sub_20_a", text: "15 - 7 = ?", answer: "8", topic: "subtraction", difficulty: 1, grade: 1 },
  { id: "g1_sub_20_b", text: "18 - 9 = ?", answer: "9", topic: "subtraction", difficulty: 1, grade: 1 },
  { id: "g1_sub_20_c", text: "13 - 8 = ?", answer: "5", topic: "subtraction", difficulty: 1, grade: 1 },

  // משוואות עם חסר (סימן השוויון משמאל - לפי המסמך)
  { id: "g1_eq_left_a", text: "___ - 6 = 4", answer: "10", topic: "subtraction", difficulty: 1, grade: 1 },
  { id: "g1_eq_left_b", text: "12 = 7 + ___", answer: "5", topic: "addition", difficulty: 1, grade: 1 },

  // חיבור וחיסור בעשרות שלמות עד 100
  { id: "g1_add_tens_a", text: "20 + 60 = ?", answer: "80", topic: "addition", difficulty: 1, grade: 1, hint: "כמו 2 + 6, רק בעשרות" },
  { id: "g1_add_tens_b", text: "30 + 40 = ?", answer: "70", topic: "addition", difficulty: 1, grade: 1 },
  { id: "g1_sub_tens_a", text: "80 - 30 = ?", answer: "50", topic: "subtraction", difficulty: 1, grade: 1 },
  { id: "g1_sub_tens_b", text: "100 - 40 = ?", answer: "60", topic: "subtraction", difficulty: 1, grade: 1 },

  // ===============================
  // נושא 3: שאלות מילוליות (פיננסי / חיי יום-יום)
  // ===============================

  {
    id: "g1_word_a",
    text: "באגרטל יש 8 פרחים: 3 צהובים והשאר אדומים. כמה פרחים אדומים יש?",
    answer: "5",
    topic: "wordProblems",
    difficulty: 1,
    grade: 1,
  },
  {
    id: "g1_word_candy",
    text: "לדנה היו 9 סוכריות. היא נתנה לחבר 4 סוכריות. כמה נשארו?",
    answer: "5",
    topic: "wordProblems",
    difficulty: 1,
    grade: 1,
  },
  {
    id: "g1_word_money",
    text: "לתומר היו 10 שקלים. הוא קנה גלידה ב-7 שקלים. כמה עודף הוא קיבל?",
    answer: "3",
    topic: "wordProblems",
    difficulty: 1,
    grade: 1,
  },
  {
    id: "g1_word_pens",
    text: "בקלמר 6 עפרונות ו-4 עטים. כמה כלי כתיבה יש בקלמר?",
    answer: "10",
    topic: "wordProblems",
    difficulty: 1,
    grade: 1,
  },
  {
    id: "g1_word_balloons",
    text: "במסיבה היו 15 בלונים. 8 התפוצצו. כמה בלונים נשארו?",
    answer: "7",
    topic: "wordProblems",
    difficulty: 1,
    grade: 1,
  },

  // ===============================
  // נושא 4: מצולעים (טקסטואלי בלבד - בלי תמונה)
  // ===============================

  { id: "g1_geo_triangle", text: "כמה צלעות יש למשולש?", answer: "3", topic: "geometry", difficulty: 1, grade: 1 },
  { id: "g1_geo_square", text: "כמה צלעות יש לריבוע?", answer: "4", topic: "geometry", difficulty: 1, grade: 1 },
  { id: "g1_geo_pentagon", text: "כמה צלעות יש למחומש?", answer: "5", topic: "geometry", difficulty: 1, grade: 1 },
  { id: "g1_geo_hexagon", text: "כמה צלעות יש למשושה?", answer: "6", topic: "geometry", difficulty: 1, grade: 1 },
  { id: "g1_geo_rectangle", text: "כמה קודקודים יש למלבן?", answer: "4", topic: "geometry", difficulty: 1, grade: 1 },

  // ===============================
  // נושא 5: שעון - שעות שלמות (שאלות ויזואליות)
  // ===============================

  {
    id: "g1_clock_visual_3",
    text: "איזו שעה השעון מראה?",
    answer: "3",
    topic: "time",
    difficulty: 1,
    grade: 1,
    kind: "clock",
    visual: { type: "clock", hour: 3 },
  },
  {
    id: "g1_clock_visual_7",
    text: "איזו שעה השעון מראה?",
    answer: "7",
    topic: "time",
    difficulty: 1,
    grade: 1,
    kind: "clock",
    visual: { type: "clock", hour: 7 },
  },
  {
    id: "g1_clock_visual_10",
    text: "איזו שעה השעון מראה?",
    answer: "10",
    topic: "time",
    difficulty: 1,
    grade: 1,
    kind: "clock",
    visual: { type: "clock", hour: 10 },
  },
  {
    id: "g1_clock_visual_1",
    text: "איזו שעה השעון מראה?",
    answer: "1",
    topic: "time",
    difficulty: 1,
    grade: 1,
    kind: "clock",
    visual: { type: "clock", hour: 1 },
  },
  {
    id: "g1_clock_visual_6",
    text: "איזו שעה השעון מראה?",
    answer: "6",
    topic: "time",
    difficulty: 1,
    grade: 1,
    kind: "clock",
    visual: { type: "clock", hour: 6 },
  },

  // שאלות מילוליות הקשורות לשעון
  {
    id: "g1_clock_word_a",
    text: "אימון הכדורגל התחיל ב-3 ונמשך שעתיים. באיזו שעה הסתיים?",
    answer: "5",
    topic: "wordProblems",
    difficulty: 1,
    grade: 1,
  },
  {
    id: "g1_clock_word_b",
    text: "המשפחה יצאה מהבית ב-8 בבוקר. הנסיעה נמשכה שעתיים. באיזו שעה הגיעה ליעד?",
    answer: "10",
    topic: "wordProblems",
    difficulty: 1,
    grade: 1,
  },

  // ===============================
  // נושא 6: ספירת אובייקטים (ויזואלית)
  // ===============================

  {
    id: "g1_count_apples_5",
    text: "כמה תפוחים יש כאן?",
    answer: "5",
    topic: "counting",
    difficulty: 1,
    grade: 1,
    kind: "counting",
    visual: { type: "counting", emoji: "🍎", count: 5 },
  },
  {
    id: "g1_count_balloons_7",
    text: "כמה בלונים יש כאן?",
    answer: "7",
    topic: "counting",
    difficulty: 1,
    grade: 1,
    kind: "counting",
    visual: { type: "counting", emoji: "🎈", count: 7 },
  },
  {
    id: "g1_count_stars_9",
    text: "כמה כוכבים יש כאן?",
    answer: "9",
    topic: "counting",
    difficulty: 1,
    grade: 1,
    kind: "counting",
    visual: { type: "counting", emoji: "⭐", count: 9 },
  },
  {
    id: "g1_count_fish_12",
    text: "כמה דגים יש כאן?",
    answer: "12",
    topic: "counting",
    difficulty: 1,
    grade: 1,
    kind: "counting",
    visual: { type: "counting", emoji: "🐠", count: 12 },
  },
  {
    id: "g1_count_hearts_8",
    text: "כמה לבבות יש כאן?",
    answer: "8",
    topic: "counting",
    difficulty: 1,
    grade: 1,
    kind: "counting",
    visual: { type: "counting", emoji: "❤️", count: 8 },
  },
  {
    id: "g1_count_flowers_6",
    text: "כמה פרחים יש כאן?",
    answer: "6",
    topic: "counting",
    difficulty: 1,
    grade: 1,
    kind: "counting",
    visual: { type: "counting", emoji: "🌸", count: 6 },
  },

  // ===============================
  // נושא 7: צורות גאומטריות (ויזואליות)
  // ===============================

  {
    id: "g1_shape_triangle_sides",
    text: "כמה צלעות יש לצורה הזו?",
    answer: "3",
    topic: "geometry",
    difficulty: 1,
    grade: 1,
    kind: "shape",
    visual: { type: "shape", shape: "triangle" },
  },
  {
    id: "g1_shape_square_sides",
    text: "כמה צלעות יש לצורה הזו?",
    answer: "4",
    topic: "geometry",
    difficulty: 1,
    grade: 1,
    kind: "shape",
    visual: { type: "shape", shape: "square" },
  },
  {
    id: "g1_shape_hexagon_sides",
    text: "כמה צלעות יש לצורה הזו?",
    answer: "6",
    topic: "geometry",
    difficulty: 1,
    grade: 1,
    kind: "shape",
    visual: { type: "shape", shape: "hexagon" },
  },
  {
    id: "g1_shape_name_triangle",
    text: "איך קוראים לצורה הזו?",
    answer: "משולש",
    topic: "geometry",
    difficulty: 1,
    grade: 1,
    kind: "shape",
    visual: { type: "shape", shape: "triangle" },
  },
  {
    id: "g1_shape_name_square",
    text: "איך קוראים לצורה הזו?",
    answer: "ריבוע",
    topic: "geometry",
    difficulty: 1,
    grade: 1,
    kind: "shape",
    visual: { type: "shape", shape: "square" },
    acceptAlternatives: ["מרובע"],
  },
  {
    id: "g1_shape_name_circle",
    text: "איך קוראים לצורה הזו?",
    answer: "עיגול",
    topic: "geometry",
    difficulty: 1,
    grade: 1,
    kind: "shape",
    visual: { type: "shape", shape: "circle" },
    acceptAlternatives: ["עגול", "מעגל"],
  },
];
