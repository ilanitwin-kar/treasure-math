import type { Question } from "../../types";

/**
 * כיתה ג' - מבוסס תוכנית הלימודים הרשמית של משרד החינוך.
 *
 * נושאים מרכזיים:
 * 1. הכרת המספרים בתחום הרבבה (עד 10,000)
 * 2. חיבור וחיסור בתחום הרבבה
 * 3. לוח הכפל המלא (10×10) וחילוק
 * 4. חילוק עם שארית
 * 5. חוק הפילוג וסדר פעולות החשבון (כולל סוגריים)
 * 6. כפל וחילוק ב-10, 100, 1,000
 * 7. עיגול מספרים
 * 8. זוויות ומשולשים (לפי זוויות)
 * 9. שטח מלבן
 * 10. שעון (שעות ודקות)
 */
export const GRADE_3_QUESTIONS: Question[] = [
  // ===== מספרים עד 10,000 =====
  { id: "g3_num_after_999", text: "איזה מספר בא אחרי 999?", answer: "1000", topic: "numbers", difficulty: 3, grade: 3 },
  { id: "g3_num_after_9999", text: "איזה מספר בא אחרי 9999?", answer: "10000", topic: "numbers", difficulty: 3, grade: 3 },
  { id: "g3_num_bigger_a", text: "איזה מספר גדול יותר: 4,567 או 4,576?", answer: "4576", topic: "numbers", difficulty: 3, grade: 3, acceptAlternatives: ["4,576"] },
  { id: "g3_num_thousand", text: "כמה מאות יש ב-2,300?", answer: "23", topic: "numbers", difficulty: 3, grade: 3 },
  { id: "g3_num_digit_value", text: "מה ערך הספרה 5 במספר 5,247?", answer: "5000", topic: "numbers", difficulty: 3, grade: 3 },

  // עיגול מספרים
  { id: "g3_round_a", text: "עגל את המספר 47 לעשרת השלמה הקרובה", answer: "50", topic: "numbers", difficulty: 3, grade: 3 },
  { id: "g3_round_b", text: "עגל את המספר 384 למאה השלמה הקרובה", answer: "400", topic: "numbers", difficulty: 3, grade: 3 },
  { id: "g3_round_c", text: "עגל את המספר 2,650 לאלף השלם הקרוב", answer: "3000", topic: "numbers", difficulty: 3, grade: 3 },

  // סדרות
  { id: "g3_pat_200", text: "סדרה: 200, 400, 600, ___ - מה הבא?", answer: "800", topic: "numbers", difficulty: 3, grade: 3 },
  { id: "g3_pat_250", text: "סדרה: 250, 500, 750, ___ - מה הבא?", answer: "1000", topic: "numbers", difficulty: 3, grade: 3 },

  // ===== חיבור וחיסור =====
  { id: "g3_add_3digit_a", text: "234 + 158 = ?", answer: "392", topic: "addition", difficulty: 3, grade: 3 },
  { id: "g3_add_3digit_b", text: "467 + 289 = ?", answer: "756", topic: "addition", difficulty: 3, grade: 3 },
  { id: "g3_add_3digit_c", text: "1,200 + 850 = ?", answer: "2050", topic: "addition", difficulty: 3, grade: 3, acceptAlternatives: ["2,050"] },
  { id: "g3_add_3digit_d", text: "345 + 678 = ?", answer: "1023", topic: "addition", difficulty: 3, grade: 3, acceptAlternatives: ["1,023"] },
  { id: "g3_add_3digit_e", text: "1,500 + 2,300 = ?", answer: "3800", topic: "addition", difficulty: 3, grade: 3, acceptAlternatives: ["3,800"] },
  { id: "g3_add_complete", text: "200 + ___ = 750", answer: "550", topic: "addition", difficulty: 3, grade: 3 },
  { id: "g3_sub_3digit_a", text: "500 - 178 = ?", answer: "322", topic: "subtraction", difficulty: 3, grade: 3 },
  { id: "g3_sub_3digit_b", text: "800 - 367 = ?", answer: "433", topic: "subtraction", difficulty: 3, grade: 3 },
  { id: "g3_sub_3digit_c", text: "1,500 - 750 = ?", answer: "750", topic: "subtraction", difficulty: 3, grade: 3 },
  { id: "g3_sub_3digit_d", text: "1,000 - 234 = ?", answer: "766", topic: "subtraction", difficulty: 3, grade: 3 },
  { id: "g3_sub_3digit_e", text: "2,500 - 1,250 = ?", answer: "1250", topic: "subtraction", difficulty: 3, grade: 3, acceptAlternatives: ["1,250"] },
  { id: "g3_sub_complete", text: "___ - 350 = 450", answer: "800", topic: "subtraction", difficulty: 3, grade: 3 },

  // ===== כפל - לוח הכפל =====
  { id: "g3_mul_3_a", text: "3 × 7 = ?", answer: "21", topic: "multiplication", difficulty: 3, grade: 3 },
  { id: "g3_mul_4_a", text: "4 × 8 = ?", answer: "32", topic: "multiplication", difficulty: 3, grade: 3 },
  { id: "g3_mul_6_a", text: "6 × 7 = ?", answer: "42", topic: "multiplication", difficulty: 3, grade: 3 },
  { id: "g3_mul_7_a", text: "7 × 8 = ?", answer: "56", topic: "multiplication", difficulty: 3, grade: 3 },
  { id: "g3_mul_8_a", text: "8 × 9 = ?", answer: "72", topic: "multiplication", difficulty: 3, grade: 3 },
  { id: "g3_mul_9_a", text: "9 × 9 = ?", answer: "81", topic: "multiplication", difficulty: 3, grade: 3 },

  // כפל ב-10, 100, 1000
  { id: "g3_mul_10_a", text: "23 × 10 = ?", answer: "230", topic: "multiplication", difficulty: 3, grade: 3 },
  { id: "g3_mul_100_a", text: "7 × 100 = ?", answer: "700", topic: "multiplication", difficulty: 3, grade: 3 },
  { id: "g3_mul_1000_a", text: "6 × 1000 = ?", answer: "6000", topic: "multiplication", difficulty: 3, grade: 3 },

  // ===== חילוק =====
  { id: "g3_div_a", text: "48 ÷ 6 = ?", answer: "8", topic: "division", difficulty: 3, grade: 3 },
  { id: "g3_div_b", text: "63 ÷ 9 = ?", answer: "7", topic: "division", difficulty: 3, grade: 3 },
  { id: "g3_div_c", text: "56 ÷ 8 = ?", answer: "7", topic: "division", difficulty: 3, grade: 3 },
  { id: "g3_div_d", text: "72 ÷ 8 = ?", answer: "9", topic: "division", difficulty: 3, grade: 3 },

  // חילוק ב-10, 100, 1000
  { id: "g3_div_10_a", text: "240 ÷ 10 = ?", answer: "24", topic: "division", difficulty: 3, grade: 3 },
  { id: "g3_div_100_a", text: "800 ÷ 100 = ?", answer: "8", topic: "division", difficulty: 3, grade: 3 },

  // חילוק עם שארית (פשוט)
  { id: "g3_div_rem_a", text: "מה השארית כשמחלקים 17 ב-5?", answer: "2", topic: "division", difficulty: 3, grade: 3, hint: "5 כפול 3 הוא 15, נשאר 2" },
  { id: "g3_div_rem_b", text: "מה השארית כשמחלקים 29 ב-4?", answer: "1", topic: "division", difficulty: 3, grade: 3 },

  // ===== סדר פעולות =====
  { id: "g3_order_a", text: "5 + 2 × 3 = ?", answer: "11", topic: "multiplication", difficulty: 3, grade: 3, hint: "קודם כפל, אחר כך חיבור" },
  { id: "g3_order_b", text: "(4 + 6) × 2 = ?", answer: "20", topic: "multiplication", difficulty: 3, grade: 3, hint: "מה שבתוך הסוגריים קודם" },
  { id: "g3_order_c", text: "20 - 3 × 4 = ?", answer: "8", topic: "multiplication", difficulty: 3, grade: 3 },

  // ===== שאלות מילוליות =====
  { id: "g3_word_a", text: "בכל אריזה יש 6 עוגיות. כמה עוגיות יש ב-7 אריזות?", answer: "42", topic: "wordProblems", difficulty: 3, grade: 3 },
  { id: "g3_word_b", text: "המורה חילקה 24 ספרים שווה בשווה בין 6 תלמידים. כמה ספרים קיבל כל תלמיד?", answer: "4", topic: "wordProblems", difficulty: 3, grade: 3 },
  { id: "g3_word_c", text: "באוטובוס יש 45 מקומות. ב-3 אוטובוסים, כמה מקומות יש בסך הכל?", answer: "135", topic: "wordProblems", difficulty: 3, grade: 3 },
  { id: "g3_word_d", text: "ספר עולה 25 שקלים. כמה תשלם עבור 4 ספרים?", answer: "100", topic: "wordProblems", difficulty: 3, grade: 3 },
  { id: "g3_word_e", text: "בכיתה 28 תלמידים. הם התחלקו ל-4 קבוצות שוות. כמה תלמידים בכל קבוצה?", answer: "7", topic: "wordProblems", difficulty: 3, grade: 3 },

  // ===== גאומטריה - זוויות ושטח =====
  { id: "g3_geo_area_rect_a", text: "מה שטח של מלבן שצלעיו 6 ס\"מ ו-4 ס\"מ?", answer: "24", topic: "geometry", difficulty: 3, grade: 3 },
  { id: "g3_geo_area_rect_b", text: "מה שטח של ריבוע שצלעו 5 ס\"מ?", answer: "25", topic: "geometry", difficulty: 3, grade: 3 },
  { id: "g3_geo_angle_a", text: "כמה זוויות ישרות יש בריבוע?", answer: "4", topic: "geometry", difficulty: 3, grade: 3 },
  { id: "g3_geo_tri_types", text: "במשולש כל הצלעות שוות. איך קוראים לו?", answer: "שווה-צלעות", topic: "geometry", difficulty: 3, grade: 3, acceptAlternatives: ["שווה צלעות", "שווה-צלעי", "שווה-צלעות ושווה זוויות"] },
  { id: "g3_geo_shape_visual", text: "כמה צלעות יש לצורה הזו?", answer: "5", topic: "geometry", difficulty: 3, grade: 3, kind: "shape", visual: { type: "shape", shape: "pentagon" } },

  // ===== זמן =====
  { id: "g3_time_min_in_hour", text: "כמה דקות יש בשעה אחת?", answer: "60", topic: "time", difficulty: 3, grade: 3 },
  { id: "g3_time_min_in_half", text: "כמה דקות יש בחצי שעה?", answer: "30", topic: "time", difficulty: 3, grade: 3 },
  { id: "g3_time_min_in_quarter", text: "כמה דקות יש ברבע שעה?", answer: "15", topic: "time", difficulty: 3, grade: 3 },
  { id: "g3_time_clock_4", text: "איזו שעה השעון מראה?", answer: "4", topic: "time", difficulty: 3, grade: 3, kind: "clock", visual: { type: "clock", hour: 4 } },
  { id: "g3_time_clock_9", text: "איזו שעה השעון מראה?", answer: "9", topic: "time", difficulty: 3, grade: 3, kind: "clock", visual: { type: "clock", hour: 9 } },
  { id: "g3_time_sec_in_min", text: "כמה שניות יש בדקה אחת?", answer: "60", topic: "time", difficulty: 3, grade: 3 },
  { id: "g3_time_word_a", text: "סרט התחיל ב-5 ונמשך שעה ו-30 דקות. באיזו שעה הסתיים? (כתוב כשעה בלבד אם נגמר בדיוק בשעה, אחרת אינו רלוונטי)", answer: "6:30", topic: "wordProblems", difficulty: 3, grade: 3, acceptAlternatives: ["6.30", "6:30 בערב", "שש וחצי"] },

  // ===== ספירה ויזואלית =====
  { id: "g3_count_22", text: "כמה כוכבים יש כאן?", answer: "22", topic: "counting", difficulty: 3, grade: 3, kind: "counting", visual: { type: "counting", emoji: "⭐", count: 22 } },
  { id: "g3_count_25", text: "כמה תפוחים יש כאן?", answer: "25", topic: "counting", difficulty: 3, grade: 3, kind: "counting", visual: { type: "counting", emoji: "🍎", count: 25 } },
  { id: "g3_count_28", text: "כמה דגים יש כאן?", answer: "28", topic: "counting", difficulty: 3, grade: 3, kind: "counting", visual: { type: "counting", emoji: "🐠", count: 28 } },
  { id: "g3_count_32", text: "כמה פרחים יש כאן?", answer: "32", topic: "counting", difficulty: 3, grade: 3, kind: "counting", visual: { type: "counting", emoji: "🌸", count: 32 } },
  { id: "g3_count_35", text: "כמה בלונים יש כאן?", answer: "35", topic: "counting", difficulty: 3, grade: 3, kind: "counting", visual: { type: "counting", emoji: "🎈", count: 35 } },

  // ===== שברים =====
  { id: "g3_frac_add_same_a", text: "2/7 + 3/7 = ? (כתוב כשבר)", answer: "5/7", topic: "fractions", difficulty: 3, grade: 3 },
  { id: "g3_frac_sub_same_a", text: "4/5 - 1/5 = ? (כתוב כשבר)", answer: "3/5", topic: "fractions", difficulty: 3, grade: 3 },
  { id: "g3_frac_half_30", text: "כמה זה 1/2 מ-30?", answer: "15", topic: "fractions", difficulty: 3, grade: 3 },
  { id: "g3_frac_compare_2_3_3_4", text: "מה גדול יותר: 2/3 או 3/4? (כתוב כשבר)", answer: "3/4", topic: "fractions", difficulty: 3, grade: 3 },
  { id: "g3_frac_to_decimal", text: "כתוב 3/10 כשבר עשרוני", answer: "0.3", topic: "fractions", difficulty: 3, grade: 3 },
];
