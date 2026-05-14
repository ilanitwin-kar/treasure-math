import type { Question } from "../../types";

/**
 * כיתה ד' - מבוסס תוכנית הלימודים הרשמית של משרד החינוך.
 *
 * נושאים מרכזיים:
 * 1. הכרת המספרים בתחום המיליון
 * 2. ארבע פעולות חשבון עד מיליון, כולל אסטרטגיות שונות
 * 3. כפל וחילוק במספרים גדולים (במאונך, אלגוריתם)
 * 4. סימני התחלקות ב-3, 6, 9
 * 5. סדר פעולות החשבון
 * 6. שברים (משמעות, השוואה, חיבור וחיסור פשוטים)
 * 7. מאונכות ומקבילות, מרובעים מיוחדים
 * 8. מעבר בין יחידות אורך (ק"מ, מ', דצ"מ, ס"מ, מ"מ)
 * 9. שטח פנים של תיבה
 * 10. לוח שנה
 */
export const GRADE_4_QUESTIONS: Question[] = [
  // ===== מספרים בתחום המיליון =====
  { id: "g4_num_compare_a", text: "איזה מספר גדול יותר: 25,470 או 25,407?", answer: "25470", topic: "numbers", difficulty: 4, grade: 4, acceptAlternatives: ["25,470"] },
  { id: "g4_num_compare_b", text: "איזה מספר גדול יותר: 99,999 או 100,000?", answer: "100000", topic: "numbers", difficulty: 4, grade: 4, acceptAlternatives: ["100,000"] },
  { id: "g4_num_digit_value_a", text: "מה ערך הספרה 7 במספר 174,532?", answer: "70000", topic: "numbers", difficulty: 4, grade: 4, acceptAlternatives: ["70,000"] },
  { id: "g4_num_digit_value_b", text: "מה ערך הספרה 3 במספר 235,000?", answer: "30000", topic: "numbers", difficulty: 4, grade: 4, acceptAlternatives: ["30,000"] },
  { id: "g4_num_round_thousands", text: "עגל את המספר 3,478 לאלף השלם הקרוב", answer: "3000", topic: "numbers", difficulty: 4, grade: 4 },
  { id: "g4_num_round_10k", text: "עגל את 47,823 לעשרת האלפים הקרובה", answer: "50000", topic: "numbers", difficulty: 4, grade: 4, acceptAlternatives: ["50,000"] },
  { id: "g4_num_round_100k", text: "עגל את 348,000 למאת האלפים הקרובה", answer: "300000", topic: "numbers", difficulty: 4, grade: 4, acceptAlternatives: ["300,000"] },

  // ===== חיבור וחיסור עד מיליון =====
  { id: "g4_add_a", text: "1,234 + 5,678 = ?", answer: "6912", topic: "addition", difficulty: 4, grade: 4, acceptAlternatives: ["6,912"] },
  { id: "g4_add_b", text: "23,400 + 18,750 = ?", answer: "42150", topic: "addition", difficulty: 4, grade: 4, acceptAlternatives: ["42,150"] },
  { id: "g4_add_c", text: "12,500 + 7,800 = ?", answer: "20300", topic: "addition", difficulty: 4, grade: 4, acceptAlternatives: ["20,300"] },
  { id: "g4_add_d", text: "999 + 999 = ?", answer: "1998", topic: "addition", difficulty: 4, grade: 4, acceptAlternatives: ["1,998"] },
  { id: "g4_add_e", text: "50,000 + 25,500 = ?", answer: "75500", topic: "addition", difficulty: 4, grade: 4, acceptAlternatives: ["75,500"] },
  { id: "g4_add_complete", text: "השלם: ____ + 47 + ____ = 100 (תן זוג פתרון אפשרי כסכום שני המספרים החסרים)", answer: "53", topic: "addition", difficulty: 4, grade: 4, hint: "100 - 47 = 53, אז הסכום של שני החסרים הוא 53" },
  { id: "g4_sub_a", text: "5,000 - 1,346 = ?", answer: "3654", topic: "subtraction", difficulty: 4, grade: 4, acceptAlternatives: ["3,654"] },
  { id: "g4_sub_b", text: "100,000 - 35,000 = ?", answer: "65000", topic: "subtraction", difficulty: 4, grade: 4, acceptAlternatives: ["65,000"] },
  { id: "g4_sub_c", text: "8,200 - 3,750 = ?", answer: "4450", topic: "subtraction", difficulty: 4, grade: 4, acceptAlternatives: ["4,450"] },
  { id: "g4_sub_d", text: "20,000 - 12,345 = ?", answer: "7655", topic: "subtraction", difficulty: 4, grade: 4, acceptAlternatives: ["7,655"] },
  { id: "g4_sub_e", text: "1,000,000 - 1 = ?", answer: "999999", topic: "subtraction", difficulty: 4, grade: 4, acceptAlternatives: ["999,999"] },

  // ===== כפל =====
  { id: "g4_mul_2digit_a", text: "23 × 14 = ?", answer: "322", topic: "multiplication", difficulty: 4, grade: 4 },
  { id: "g4_mul_2digit_b", text: "47 × 12 = ?", answer: "564", topic: "multiplication", difficulty: 4, grade: 4 },
  { id: "g4_mul_2digit_c", text: "36 × 25 = ?", answer: "900", topic: "multiplication", difficulty: 4, grade: 4 },
  { id: "g4_mul_3by1_a", text: "234 × 3 = ?", answer: "702", topic: "multiplication", difficulty: 4, grade: 4 },
  { id: "g4_mul_3by1_b", text: "456 × 4 = ?", answer: "1824", topic: "multiplication", difficulty: 4, grade: 4, acceptAlternatives: ["1,824"] },
  { id: "g4_mul_tens_a", text: "40 × 30 = ?", answer: "1200", topic: "multiplication", difficulty: 4, grade: 4, acceptAlternatives: ["1,200"] },
  { id: "g4_mul_hundreds_a", text: "200 × 30 = ?", answer: "6000", topic: "multiplication", difficulty: 4, grade: 4, acceptAlternatives: ["6,000"] },

  // ===== חילוק =====
  { id: "g4_div_a", text: "84 ÷ 7 = ?", answer: "12", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_div_b", text: "96 ÷ 8 = ?", answer: "12", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_div_c", text: "144 ÷ 12 = ?", answer: "12", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_div_long_a", text: "132 ÷ 4 = ?", answer: "33", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_div_long_b", text: "225 ÷ 5 = ?", answer: "45", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_div_tens", text: "800 ÷ 40 = ?", answer: "20", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_div_rem_a", text: "23 ÷ 4 - מה השארית?", answer: "3", topic: "division", difficulty: 4, grade: 4 },

  // ===== סימני התחלקות =====
  { id: "g4_divis_3_a", text: "האם 27 מתחלק ב-3 ללא שארית? (כתוב 'כן' או 'לא')", answer: "כן", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_divis_9_a", text: "האם 81 מתחלק ב-9 ללא שארית? (כתוב 'כן' או 'לא')", answer: "כן", topic: "division", difficulty: 4, grade: 4 },
  { id: "g4_divis_6_a", text: "האם 25 מתחלק ב-6 ללא שארית? (כתוב 'כן' או 'לא')", answer: "לא", topic: "division", difficulty: 4, grade: 4 },

  // ===== סדר פעולות =====
  { id: "g4_order_a", text: "(5 + 3) × 4 = ?", answer: "32", topic: "multiplication", difficulty: 4, grade: 4 },
  { id: "g4_order_b", text: "20 - 6 ÷ 2 = ?", answer: "17", topic: "subtraction", difficulty: 4, grade: 4, hint: "קודם חילוק, אחר כך חיסור" },
  { id: "g4_order_c", text: "3 × (12 - 4) = ?", answer: "24", topic: "multiplication", difficulty: 4, grade: 4 },

  // ===== שברים פשוטים =====
  { id: "g4_frac_half_of", text: "כמה זה חצי מ-40?", answer: "20", topic: "fractions", difficulty: 4, grade: 4 },
  { id: "g4_frac_quarter_of", text: "כמה זה רבע מ-20?", answer: "5", topic: "fractions", difficulty: 4, grade: 4 },
  { id: "g4_frac_third_of", text: "כמה זה שליש מ-18?", answer: "6", topic: "fractions", difficulty: 4, grade: 4 },
  { id: "g4_frac_compare_a", text: "מה גדול יותר: 1/2 או 1/4? (כתוב כשבר)", answer: "1/2", topic: "fractions", difficulty: 4, grade: 4 },
  { id: "g4_frac_compare_b", text: "מה גדול יותר: 1/3 או 1/5? (כתוב כשבר)", answer: "1/3", topic: "fractions", difficulty: 4, grade: 4 },
  { id: "g4_frac_add_a", text: "1/4 + 1/4 = ? (כתוב כשבר, לדוגמה: 2/4)", answer: "2/4", topic: "fractions", difficulty: 4, grade: 4, acceptAlternatives: ["1/2"] },
  { id: "g4_frac_add_b", text: "1/3 + 1/3 = ? (כתוב כשבר, לדוגמה: 2/3)", answer: "2/3", topic: "fractions", difficulty: 4, grade: 4 },

  // ===== שאלות מילוליות =====
  { id: "g4_word_a", text: "בכל קופסה יש 24 עפרונות. כמה עפרונות יש ב-15 קופסאות?", answer: "360", topic: "wordProblems", difficulty: 4, grade: 4 },
  { id: "g4_word_b", text: "307 תלמידים חזרו מטיול ב-50 אוטובוסים. כמה אוטובוסים נדרשו? (לכל אוטובוס 50 מקומות)", answer: "7", topic: "wordProblems", difficulty: 4, grade: 4, hint: "צריך 7 אוטובוסים כי יישארו 43 ילדים לאוטובוס שמיני שאינו מלא, אבל בטיול הם נסעו ב-7 אוטובוסים מלאים" },
  { id: "g4_word_c", text: "תמר קוראת בכל יום 36 עמודים בספר. כמה עמודים תקרא ב-7 ימים?", answer: "252", topic: "wordProblems", difficulty: 4, grade: 4 },
  { id: "g4_word_d", text: "אוטובוס נסע 450 ק\"מ בשעתיים וחצי. כמה ק\"מ נסע בשעה אחת?", answer: "180", topic: "wordProblems", difficulty: 4, grade: 4 },
  { id: "g4_word_e", text: "מחיר מחברת 8 שקלים. דנה קנתה 12 מחברות. כמה שילמה?", answer: "96", topic: "wordProblems", difficulty: 4, grade: 4 },

  // ===== המרת יחידות אורך =====
  { id: "g4_len_m_to_cm", text: "כמה ס\"מ יש ב-3 מטרים?", answer: "300", topic: "geometry", difficulty: 4, grade: 4 },
  { id: "g4_len_cm_to_m", text: "כמה מטרים זה 500 ס\"מ?", answer: "5", topic: "geometry", difficulty: 4, grade: 4 },
  { id: "g4_len_km_to_m", text: "כמה מטרים יש ב-2 ק\"מ?", answer: "2000", topic: "geometry", difficulty: 4, grade: 4, acceptAlternatives: ["2,000"] },
  { id: "g4_len_mm_to_cm", text: "כמה ס\"מ זה 50 מ\"מ?", answer: "5", topic: "geometry", difficulty: 4, grade: 4 },

  // ===== גאומטריה - מרובעים =====
  { id: "g4_geo_rect_area", text: "מה שטח של מלבן שצלעיו 12 מ' ו-8 מ'?", answer: "96", topic: "geometry", difficulty: 4, grade: 4 },
  { id: "g4_geo_rect_perim", text: "מה היקף של מלבן שצלעיו 12 מ' ו-8 מ'?", answer: "40", topic: "geometry", difficulty: 4, grade: 4 },
  { id: "g4_geo_sq_area", text: "מה שטח של ריבוע שצלעו 9 ס\"מ?", answer: "81", topic: "geometry", difficulty: 4, grade: 4 },
  { id: "g4_geo_parallel", text: "במקבילית כמה זוגות של צלעות מקבילות יש?", answer: "2", topic: "geometry", difficulty: 4, grade: 4 },
  { id: "g4_geo_diag_rect", text: "כמה אלכסונים יש למלבן?", answer: "2", topic: "geometry", difficulty: 4, grade: 4 },

  // ===== זמן ולוח שנה =====
  { id: "g4_time_days_in_week", text: "כמה ימים יש בשבועיים?", answer: "14", topic: "time", difficulty: 4, grade: 4 },
  { id: "g4_time_weeks_in_year", text: "כמה שבועות יש (בערך) בשנה?", answer: "52", topic: "time", difficulty: 4, grade: 4 },
  { id: "g4_time_days_in_year", text: "כמה ימים יש בשנה רגילה?", answer: "365", topic: "time", difficulty: 4, grade: 4 },
  { id: "g4_time_months", text: "כמה חודשים יש בשנה?", answer: "12", topic: "time", difficulty: 4, grade: 4 },
  { id: "g4_time_hours_day", text: "כמה שעות יש ביממה?", answer: "24", topic: "time", difficulty: 4, grade: 4 },

  // ===== ספירה ויזואלית =====
  { id: "g4_count_36", text: "כמה כוכבים יש כאן?", answer: "36", topic: "counting", difficulty: 4, grade: 4, kind: "counting", visual: { type: "counting", emoji: "⭐", count: 36 } },
  { id: "g4_count_40", text: "כמה תפוחים יש כאן?", answer: "40", topic: "counting", difficulty: 4, grade: 4, kind: "counting", visual: { type: "counting", emoji: "🍎", count: 40 } },
  { id: "g4_count_42", text: "כמה דגים יש כאן?", answer: "42", topic: "counting", difficulty: 4, grade: 4, kind: "counting", visual: { type: "counting", emoji: "🐠", count: 42 } },
  { id: "g4_count_45", text: "כמה פרחים יש כאן?", answer: "45", topic: "counting", difficulty: 4, grade: 4, kind: "counting", visual: { type: "counting", emoji: "🌸", count: 45 } },
  { id: "g4_count_48", text: "כמה בלונים יש כאן?", answer: "48", topic: "counting", difficulty: 4, grade: 4, kind: "counting", visual: { type: "counting", emoji: "🎈", count: 48 } },
];
