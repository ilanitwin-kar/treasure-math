import type { Question } from "../../types";

/**
 * כיתה ב' - מבוסס תוכנית הלימודים הרשמית של משרד החינוך.
 *
 * נושאים מרכזיים:
 * 1. הכרת המספרים עד 1,000 (מבנה עשרוני, סדר, השוואה, סדרות)
 * 2. פעולות חשבון בתחום ה-100 (חיבור וחיסור במאוזן ובמאונך)
 * 3. הכרת הכפל והחילוק (כפולות של 2, 4, 5, 10)
 * 4. צורות גאומטריות (משולשים, זוויות ישרות)
 * 5. מדידות אורך (ס"מ, מטר, היקף מצולעים)
 * 6. גופים ומדידות נפח (קובייה, תיבה, מנסרה)
 * 7. מדידות זמן (שעות שלמות וחצאי שעות)
 */
export const GRADE_2_QUESTIONS: Question[] = [
  // ===== מספרים עד 1,000 =====
  { id: "g2_num_after_99", text: "איזה מספר בא אחרי 99?", answer: "100", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_num_after_199", text: "איזה מספר בא אחרי 199?", answer: "200", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_num_after_499", text: "איזה מספר בא אחרי 499?", answer: "500", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_num_bigger_a", text: "איזה מספר גדול יותר: 234 או 243?", answer: "243", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_num_bigger_b", text: "איזה מספר גדול יותר: 567 או 576?", answer: "576", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_num_tens_in_456", text: "כמה עשרות יש במספר 456?", answer: "45", topic: "numbers", difficulty: 2, grade: 2, hint: "456 = 45 עשרות ועוד 6 יחידות" },
  { id: "g2_num_digit_value", text: "מה ערך הספרה 7 במספר 374?", answer: "70", topic: "numbers", difficulty: 2, grade: 2 },

  // סדרות בדילוגים של 2, 5, 10
  { id: "g2_pat_50", text: "סדרה: 50, 100, 150, 200, ___ - מה המספר הבא?", answer: "250", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_pat_100", text: "סדרה: 100, 200, 300, 400, ___ - מה המספר הבא?", answer: "500", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_pat_25", text: "סדרה: 25, 50, 75, 100, ___ - מה המספר הבא?", answer: "125", topic: "numbers", difficulty: 2, grade: 2 },

  // זוגי / אי-זוגי
  { id: "g2_even_a", text: "האם 14 זוגי או אי-זוגי? (כתוב 'זוגי' או 'אי-זוגי')", answer: "זוגי", topic: "numbers", difficulty: 2, grade: 2 },
  { id: "g2_even_b", text: "האם 37 זוגי או אי-זוגי? (כתוב 'זוגי' או 'אי-זוגי')", answer: "אי-זוגי", topic: "numbers", difficulty: 2, grade: 2, acceptAlternatives: ["אי זוגי", "איזוגי"] },

  // ===== חיבור וחיסור עד 100 =====
  { id: "g2_add_2digit_a", text: "27 + 35 = ?", answer: "62", topic: "addition", difficulty: 2, grade: 2 },
  { id: "g2_add_2digit_b", text: "48 + 26 = ?", answer: "74", topic: "addition", difficulty: 2, grade: 2 },
  { id: "g2_add_2digit_c", text: "55 + 39 = ?", answer: "94", topic: "addition", difficulty: 2, grade: 2 },
  { id: "g2_add_3_a", text: "14 + 23 + 18 = ?", answer: "55", topic: "addition", difficulty: 2, grade: 2 },
  { id: "g2_add_complete_a", text: "38 = ___ + 25", answer: "13", topic: "addition", difficulty: 2, grade: 2 },
  { id: "g2_add_2digit_d", text: "67 + 24 = ?", answer: "91", topic: "addition", difficulty: 2, grade: 2 },
  { id: "g2_add_2digit_e", text: "33 + 47 = ?", answer: "80", topic: "addition", difficulty: 2, grade: 2 },

  { id: "g2_sub_2digit_a", text: "53 - 27 = ?", answer: "26", topic: "subtraction", difficulty: 2, grade: 2 },
  { id: "g2_sub_2digit_b", text: "80 - 34 = ?", answer: "46", topic: "subtraction", difficulty: 2, grade: 2 },
  { id: "g2_sub_2digit_c", text: "100 - 67 = ?", answer: "33", topic: "subtraction", difficulty: 2, grade: 2 },
  { id: "g2_sub_2digit_d", text: "62 - 28 = ?", answer: "34", topic: "subtraction", difficulty: 2, grade: 2 },
  { id: "g2_sub_2digit_e", text: "95 - 47 = ?", answer: "48", topic: "subtraction", difficulty: 2, grade: 2 },
  { id: "g2_sub_complete_a", text: "___ - 19 = 41", answer: "60", topic: "subtraction", difficulty: 2, grade: 2 },
  { id: "g2_sub_complete_b", text: "70 - ___ = 35", answer: "35", topic: "subtraction", difficulty: 2, grade: 2 },

  // ===== כפל וחילוק (כפולות 2, 4, 5, 10) =====
  { id: "g2_mul_2_a", text: "2 × 6 = ?", answer: "12", topic: "multiplication", difficulty: 2, grade: 2 },
  { id: "g2_mul_2_b", text: "2 × 9 = ?", answer: "18", topic: "multiplication", difficulty: 2, grade: 2 },
  { id: "g2_mul_5_a", text: "5 × 4 = ?", answer: "20", topic: "multiplication", difficulty: 2, grade: 2 },
  { id: "g2_mul_5_b", text: "5 × 7 = ?", answer: "35", topic: "multiplication", difficulty: 2, grade: 2 },
  { id: "g2_mul_10_a", text: "10 × 6 = ?", answer: "60", topic: "multiplication", difficulty: 2, grade: 2 },
  { id: "g2_mul_4_a", text: "4 × 4 = ?", answer: "16", topic: "multiplication", difficulty: 2, grade: 2 },
  { id: "g2_mul_4_b", text: "4 × 7 = ?", answer: "28", topic: "multiplication", difficulty: 2, grade: 2 },

  { id: "g2_div_2_a", text: "12 ÷ 2 = ?", answer: "6", topic: "division", difficulty: 2, grade: 2 },
  { id: "g2_div_5_a", text: "30 ÷ 5 = ?", answer: "6", topic: "division", difficulty: 2, grade: 2 },
  { id: "g2_div_10_a", text: "70 ÷ 10 = ?", answer: "7", topic: "division", difficulty: 2, grade: 2 },
  { id: "g2_half_a", text: "כמה זה חצי מ-18?", answer: "9", topic: "division", difficulty: 2, grade: 2 },
  { id: "g2_half_b", text: "כמה זה חצי מ-50?", answer: "25", topic: "division", difficulty: 2, grade: 2 },

  // ===== שברים - חלקים וחיבור פשוט =====
  { id: "g2_frac_half_16", text: "כמה זה 1/2 מ-16?", answer: "8", topic: "fractions", difficulty: 2, grade: 2 },
  { id: "g2_frac_quarter_20", text: "כמה זה 1/4 מ-20?", answer: "5", topic: "fractions", difficulty: 2, grade: 2 },
  { id: "g2_frac_add_same", text: "1/5 + 2/5 = ? (כתוב כשבר מצומצם)", answer: "3/5", topic: "fractions", difficulty: 2, grade: 2 },
  { id: "g2_frac_compare_third_fifth", text: "מה גדול יותר: 1/3 או 1/5? (כתוב כשבר)", answer: "1/3", topic: "fractions", difficulty: 2, grade: 2 },
  { id: "g2_frac_third_of_12", text: "כמה זה 1/3 מ-12?", answer: "4", topic: "fractions", difficulty: 2, grade: 2 },

  // ===== שאלות מילוליות =====
  { id: "g2_word_a", text: "למיה יש 110 שקלים. היא קנתה ספר ב-37 שקלים. כמה כסף נשאר לה?", answer: "73", topic: "wordProblems", difficulty: 2, grade: 2 },
  { id: "g2_word_b", text: "בכל אריזה יש 5 סוכריות. כמה סוכריות יש ב-8 אריזות?", answer: "40", topic: "wordProblems", difficulty: 2, grade: 2 },
  { id: "g2_word_c", text: "סבא קנה 4 חבילות עוגיות, בכל חבילה 10 עוגיות. כמה עוגיות יש בסך הכל?", answer: "40", topic: "wordProblems", difficulty: 2, grade: 2 },
  { id: "g2_word_compare", text: "לדנה יש 38 גולות, לאחיה יש 24 גולות. בכמה יש לדנה יותר?", answer: "14", topic: "wordProblems", difficulty: 2, grade: 2 },
  { id: "g2_word_change", text: "רותי שילמה במכולת בשטר של 50 ש\"ח עבור מוצרים ב-32 ש\"ח. כמה עודף קיבלה?", answer: "18", topic: "wordProblems", difficulty: 2, grade: 2 },

  // ===== גאומטריה =====
  { id: "g2_geo_tri_sides", text: "כמה צלעות יש לצורה הזו?", answer: "3", topic: "geometry", difficulty: 2, grade: 2, kind: "shape", visual: { type: "shape", shape: "triangle" } },
  { id: "g2_geo_rect_sides", text: "כמה צלעות יש למלבן?", answer: "4", topic: "geometry", difficulty: 2, grade: 2 },
  { id: "g2_geo_square_corners", text: "כמה קודקודים יש לריבוע?", answer: "4", topic: "geometry", difficulty: 2, grade: 2 },
  {
    id: "g2_geo_name_pentagon",
    text: "איך קוראים לצורה עם 5 צלעות?",
    answer: "מחומש",
    topic: "geometry",
    difficulty: 2,
    grade: 2,
    tapChoices: ["מחומש", "משושה", "משולש", "ריבוע"],
  },
  {
    id: "g2_geo_name_hexagon",
    text: "איך קוראים לצורה עם 6 צלעות?",
    answer: "משושה",
    topic: "geometry",
    difficulty: 2,
    grade: 2,
    tapChoices: ["משושה", "מחומש", "משולש", "ריבוע"],
  },

  // ===== היקף =====
  { id: "g2_perim_square", text: "מה היקף של ריבוע שצלעו 7 ס\"מ?", answer: "28", topic: "geometry", difficulty: 2, grade: 2 },
  { id: "g2_perim_rect", text: "מה היקף של מלבן שצלעיו 8 ס\"מ ו-3 ס\"מ?", answer: "22", topic: "geometry", difficulty: 2, grade: 2 },
  { id: "g2_perim_tri", text: "מה היקף של משולש שצלעותיו 5 ס\"מ, 6 ס\"מ ו-7 ס\"מ?", answer: "18", topic: "geometry", difficulty: 2, grade: 2 },

  // ===== זמן - חצאי שעות וחישובי זמן =====
  { id: "g2_time_clock_5", text: "איזו שעה השעון מראה?", answer: "5", topic: "time", difficulty: 2, grade: 2, kind: "clock", visual: { type: "clock", hour: 5 } },
  { id: "g2_time_clock_8", text: "איזו שעה השעון מראה?", answer: "8", topic: "time", difficulty: 2, grade: 2, kind: "clock", visual: { type: "clock", hour: 8 } },
  { id: "g2_time_clock_11", text: "איזו שעה השעון מראה?", answer: "11", topic: "time", difficulty: 2, grade: 2, kind: "clock", visual: { type: "clock", hour: 11 } },
  { id: "g2_time_clock_3", text: "איזו שעה השעון מראה?", answer: "3", topic: "time", difficulty: 2, grade: 2, kind: "clock", visual: { type: "clock", hour: 3 } },
  { id: "g2_time_half_hour", text: "כמה דקות יש בחצי שעה?", answer: "30", topic: "time", difficulty: 2, grade: 2 },
  { id: "g2_time_diff_a", text: "מהשעה 10 בבוקר עד 4 אחר הצהריים - כמה שעות עברו?", answer: "6", topic: "time", difficulty: 2, grade: 2 },
  { id: "g2_time_diff_b", text: "מהשעה 8 בבוקר עד 12 בצהריים - כמה שעות עברו?", answer: "4", topic: "time", difficulty: 2, grade: 2 },
  { id: "g2_time_word_a", text: "ההצגה התחילה ב-10 בבוקר ונמשכה שעתיים. באיזו שעה הסתיימה?", answer: "12", topic: "wordProblems", difficulty: 2, grade: 2 },
  { id: "g2_time_word_b", text: "השיעור התחיל ב-9 ונגמר ב-12. כמה שעות הוא נמשך?", answer: "3", topic: "wordProblems", difficulty: 2, grade: 2 },

  // ===== ספירה ויזואלית - מספרים גדולים יותר =====
  { id: "g2_count_15", text: "כמה תפוחים יש כאן?", answer: "15", topic: "counting", difficulty: 2, grade: 2, kind: "counting", visual: { type: "counting", emoji: "🍎", count: 15 } },
  { id: "g2_count_20", text: "כמה לבבות יש כאן?", answer: "20", topic: "counting", difficulty: 2, grade: 2, kind: "counting", visual: { type: "counting", emoji: "❤️", count: 20 } },
  { id: "g2_count_18", text: "כמה כוכבים יש כאן?", answer: "18", topic: "counting", difficulty: 2, grade: 2, kind: "counting", visual: { type: "counting", emoji: "⭐", count: 18 } },
  { id: "g2_count_24", text: "כמה תפוזים יש כאן?", answer: "24", topic: "counting", difficulty: 2, grade: 2, kind: "counting", visual: { type: "counting", emoji: "🍊", count: 24 } },
  { id: "g2_count_30", text: "כמה פרחים יש כאן?", answer: "30", topic: "counting", difficulty: 2, grade: 2, kind: "counting", visual: { type: "counting", emoji: "🌸", count: 30 } },
];
