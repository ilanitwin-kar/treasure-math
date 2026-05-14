import type { Question } from "../../types";

/**
 * כיתה ה' - מבוסס תוכנית הלימודים הרשמית של משרד החינוך.
 *
 * נושאים מרכזיים:
 * 1. הכרת מספרים גדולים ממיליון
 * 2. ארבע פעולות החשבון בתחום המספרים הגדולים
 * 3. מספרים ראשוניים ומספרים פריקים, פירוק לגורמים
 * 4. שברים - הכרה ופעולות (צמצום והרחבה, חיבור וחיסור עם מכנים שונים)
 * 5. שברים עשרוניים (הכרה, חיבור וחיסור)
 * 6. שטח משולש ומקבילית, גובה משולש
 * 7. גופים: פירמידות ומנסרות, פריסות
 * 8. חקר נתונים, שכיחות וממוצע
 */
export const GRADE_5_QUESTIONS: Question[] = [
  // ===== מספרים גדולים =====
  { id: "g5_num_million", text: "כמה אפסים יש במיליון?", answer: "6", topic: "numbers", difficulty: 5, grade: 5 },
  { id: "g5_num_compare", text: "איזה מספר גדול יותר: 1,250,000 או 1,205,000?", answer: "1250000", topic: "numbers", difficulty: 5, grade: 5, acceptAlternatives: ["1,250,000"] },
  { id: "g5_num_digit_val", text: "מה ערך הספרה 5 במספר 5,420,000?", answer: "5000000", topic: "numbers", difficulty: 5, grade: 5, acceptAlternatives: ["5,000,000"] },

  // ===== ארבע פעולות חשבון =====
  { id: "g5_add_a", text: "234,567 + 125,433 = ?", answer: "360000", topic: "addition", difficulty: 5, grade: 5, acceptAlternatives: ["360,000"] },
  { id: "g5_add_b", text: "1,250,000 + 750,000 = ?", answer: "2000000", topic: "addition", difficulty: 5, grade: 5, acceptAlternatives: ["2,000,000"] },
  { id: "g5_add_c", text: "42,675 + 15,146 = ?", answer: "57821", topic: "addition", difficulty: 5, grade: 5, acceptAlternatives: ["57,821"] },
  { id: "g5_add_d", text: "3,999 + 5,001 = ?", answer: "9000", topic: "addition", difficulty: 5, grade: 5, acceptAlternatives: ["9,000"] },
  { id: "g5_add_e", text: "השלם: 25,000 + ____ = 100,000", answer: "75000", topic: "addition", difficulty: 5, grade: 5, acceptAlternatives: ["75,000"] },
  { id: "g5_sub_a", text: "500,000 - 175,000 = ?", answer: "325000", topic: "subtraction", difficulty: 5, grade: 5, acceptAlternatives: ["325,000"] },
  { id: "g5_sub_b", text: "1,000,000 - 250,500 = ?", answer: "749500", topic: "subtraction", difficulty: 5, grade: 5, acceptAlternatives: ["749,500"] },
  { id: "g5_sub_c", text: "8,000 - 4,397 = ?", answer: "3603", topic: "subtraction", difficulty: 5, grade: 5, acceptAlternatives: ["3,603"] },
  { id: "g5_sub_d", text: "100,000 - 99,999 = ?", answer: "1", topic: "subtraction", difficulty: 5, grade: 5 },
  { id: "g5_sub_e", text: "השלם: 50,000 - ____ = 32,500", answer: "17500", topic: "subtraction", difficulty: 5, grade: 5, acceptAlternatives: ["17,500"] },
  { id: "g5_mul_a", text: "234 × 12 = ?", answer: "2808", topic: "multiplication", difficulty: 5, grade: 5, acceptAlternatives: ["2,808"] },
  { id: "g5_mul_b", text: "125 × 8 = ?", answer: "1000", topic: "multiplication", difficulty: 5, grade: 5, acceptAlternatives: ["1,000"] },
  { id: "g5_mul_c", text: "324 × 79 = ?", answer: "25596", topic: "multiplication", difficulty: 5, grade: 5, acceptAlternatives: ["25,596"] },
  { id: "g5_mul_d", text: "400 × 25 = ?", answer: "10000", topic: "multiplication", difficulty: 5, grade: 5, acceptAlternatives: ["10,000"] },
  { id: "g5_mul_e", text: "1,200 × 5 = ?", answer: "6000", topic: "multiplication", difficulty: 5, grade: 5, acceptAlternatives: ["6,000"] },
  { id: "g5_div_a", text: "2,400 ÷ 12 = ?", answer: "200", topic: "division", difficulty: 5, grade: 5 },
  { id: "g5_div_b", text: "1,500 ÷ 25 = ?", answer: "60", topic: "division", difficulty: 5, grade: 5 },
  { id: "g5_div_c", text: "7,200 ÷ 8 = ?", answer: "900", topic: "division", difficulty: 5, grade: 5 },
  { id: "g5_div_d", text: "10,000 ÷ 100 = ?", answer: "100", topic: "division", difficulty: 5, grade: 5 },
  { id: "g5_div_e", text: "8,000 ÷ 40 = ?", answer: "200", topic: "division", difficulty: 5, grade: 5 },

  // ===== מספרים ראשוניים ופריקים =====
  { id: "g5_prime_a", text: "האם 17 הוא מספר ראשוני? (כתוב 'כן' או 'לא')", answer: "כן", topic: "numbers", difficulty: 5, grade: 5 },
  { id: "g5_prime_b", text: "האם 21 הוא מספר ראשוני? (כתוב 'כן' או 'לא')", answer: "לא", topic: "numbers", difficulty: 5, grade: 5, hint: "21 = 3 × 7" },
  { id: "g5_prime_c", text: "מה הוא המספר הראשוני הקטן ביותר?", answer: "2", topic: "numbers", difficulty: 5, grade: 5 },
  { id: "g5_factor_a", text: "פרק לגורמים ראשוניים: 12 = ?  (כתוב כמכפלת ראשוניים, לדוגמה: 2×2×3)", answer: "2x2x3", topic: "numbers", difficulty: 5, grade: 5, acceptAlternatives: ["2×2×3", "2*2*3", "2 × 2 × 3", "2*2*3"] },

  // ===== שברים =====
  { id: "g5_frac_simplify_a", text: "צמצם את השבר: 4/8 = ?", answer: "1/2", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_frac_simplify_b", text: "צמצם את השבר: 6/9 = ?", answer: "2/3", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_frac_expand_a", text: "השלם: 1/2 = ?/8", answer: "4", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_frac_add_same", text: "2/5 + 1/5 = ? (כתוב כשבר)", answer: "3/5", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_frac_add_diff_a", text: "1/2 + 1/4 = ? (כתוב כשבר)", answer: "3/4", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_frac_add_diff_b", text: "1/3 + 1/6 = ? (כתוב כשבר)", answer: "1/2", topic: "fractions", difficulty: 5, grade: 5, acceptAlternatives: ["3/6"] },
  { id: "g5_frac_sub_a", text: "3/4 - 1/4 = ? (כתוב כשבר)", answer: "1/2", topic: "fractions", difficulty: 5, grade: 5, acceptAlternatives: ["2/4"] },
  { id: "g5_frac_compare", text: "מה גדול יותר: 2/3 או 3/4? (כתוב כשבר)", answer: "3/4", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_frac_of_a", text: "כמה זה 2/5 מ-25?", answer: "10", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_frac_of_b", text: "כמה זה 3/4 מ-40?", answer: "30", topic: "fractions", difficulty: 5, grade: 5 },

  // ===== שברים עשרוניים =====
  { id: "g5_dec_recognize_a", text: "כתוב 1/2 כשבר עשרוני", answer: "0.5", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_recognize_b", text: "כתוב 3/10 כשבר עשרוני", answer: "0.3", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_recognize_c", text: "כתוב 1/4 כשבר עשרוני", answer: "0.25", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_add_a", text: "0.5 + 0.3 = ?", answer: "0.8", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_add_b", text: "1.25 + 2.5 = ?", answer: "3.75", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_sub_a", text: "5 - 2.3 = ?", answer: "2.7", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_sub_b", text: "10 - 6.5 = ?", answer: "3.5", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_compare", text: "איזה גדול יותר: 0.5 או 0.45?", answer: "0.5", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_mul10", text: "0.5 × 10 = ?", answer: "5", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_mul100", text: "0.25 × 100 = ?", answer: "25", topic: "fractions", difficulty: 5, grade: 5 },
  { id: "g5_dec_round", text: "עגל 4.7 למספר השלם הקרוב", answer: "5", topic: "fractions", difficulty: 5, grade: 5 },

  // ===== שאלות מילוליות =====
  { id: "g5_word_a", text: "תופרת רוצה לגזור סרט באורך 25 מטרים ל-4 חלקים שווים. מה אורך כל חלק? (במטרים, מותר שבר עשרוני)", answer: "6.25", topic: "wordProblems", difficulty: 5, grade: 5 },
  { id: "g5_word_b", text: "במחסן יש 1,250 ק\"ג סוכר באריזות של 25 ק\"ג. כמה אריזות יש?", answer: "50", topic: "wordProblems", difficulty: 5, grade: 5 },
  { id: "g5_word_c", text: "מכונית נסעה 360 ק\"מ ב-4.5 שעות. כמה ק\"מ בממוצע נסעה בשעה?", answer: "80", topic: "wordProblems", difficulty: 5, grade: 5 },
  { id: "g5_word_frac", text: "ביום הראשון יואב עבר 1/4 מהמסלול. ביום השני - 1/2 ממנו. איזה חלק עבר בסך הכל? (כתוב כשבר)", answer: "3/4", topic: "wordProblems", difficulty: 5, grade: 5 },
  { id: "g5_word_money", text: "ילד קיבל 100 ש\"ח. הוא קנה ספר ב-37.50 ש\"ח ועט ב-12.25 ש\"ח. כמה כסף נשאר לו?", answer: "50.25", topic: "wordProblems", difficulty: 5, grade: 5 },

  // ===== גאומטריה - שטח משולש ומקבילית =====
  { id: "g5_geo_tri_area_a", text: "מה שטח של משולש שבסיסו 10 ס\"מ וגובהו 6 ס\"מ?", answer: "30", topic: "geometry", difficulty: 5, grade: 5, hint: "שטח משולש = בסיס × גובה ÷ 2" },
  { id: "g5_geo_tri_area_b", text: "מה שטח של משולש שבסיסו 8 ס\"מ וגובהו 5 ס\"מ?", answer: "20", topic: "geometry", difficulty: 5, grade: 5 },
  { id: "g5_geo_paral_area_a", text: "מה שטח של מקבילית שבסיסה 12 ס\"מ וגובהה 7 ס\"מ?", answer: "84", topic: "geometry", difficulty: 5, grade: 5, hint: "שטח מקבילית = בסיס × גובה" },
  { id: "g5_geo_paral_area_b", text: "מה שטח של מקבילית שבסיסה 15 ס\"מ וגובהה 4 ס\"מ?", answer: "60", topic: "geometry", difficulty: 5, grade: 5 },

  // ===== גופים =====
  { id: "g5_geo_cube_faces", text: "כמה פאות יש לקובייה?", answer: "6", topic: "geometry", difficulty: 5, grade: 5 },
  { id: "g5_geo_cube_edges", text: "כמה מקצועות יש לקובייה?", answer: "12", topic: "geometry", difficulty: 5, grade: 5 },
  { id: "g5_geo_cube_vertices", text: "כמה קודקודים יש לקובייה?", answer: "8", topic: "geometry", difficulty: 5, grade: 5 },
  { id: "g5_geo_pyramid_faces", text: "כמה פאות יש לפירמידה רגילה עם בסיס משולש (טטרהדרון)?", answer: "4", topic: "geometry", difficulty: 5, grade: 5 },

  // ===== ממוצע =====
  { id: "g5_avg_a", text: "מה הממוצע של המספרים: 10, 20, 30?", answer: "20", topic: "wordProblems", difficulty: 5, grade: 5 },
  { id: "g5_avg_b", text: "מה הממוצע של 5, 10, 15, 20?", answer: "12.5", topic: "wordProblems", difficulty: 5, grade: 5 },
  { id: "g5_avg_c", text: "תלמיד קיבל 80, 90, 100 במבחנים. מה הממוצע שלו?", answer: "90", topic: "wordProblems", difficulty: 5, grade: 5 },

  // ===== ספירה ויזואלית =====
  { id: "g5_count_44", text: "כמה כוכבים יש כאן?", answer: "44", topic: "counting", difficulty: 5, grade: 5, kind: "counting", visual: { type: "counting", emoji: "⭐", count: 44 } },
  { id: "g5_count_48", text: "כמה תפוחים יש כאן?", answer: "48", topic: "counting", difficulty: 5, grade: 5, kind: "counting", visual: { type: "counting", emoji: "🍎", count: 48 } },
  { id: "g5_count_52", text: "כמה דגים יש כאן?", answer: "52", topic: "counting", difficulty: 5, grade: 5, kind: "counting", visual: { type: "counting", emoji: "🐠", count: 52 } },
  { id: "g5_count_56", text: "כמה פרחים יש כאן?", answer: "56", topic: "counting", difficulty: 5, grade: 5, kind: "counting", visual: { type: "counting", emoji: "🌸", count: 56 } },
  { id: "g5_count_60", text: "כמה בלונים יש כאן?", answer: "60", topic: "counting", difficulty: 5, grade: 5, kind: "counting", visual: { type: "counting", emoji: "🎈", count: 60 } },

  // ===== זמן =====
  { id: "g5_time_min_in_2h", text: "כמה דקות יש בשעתיים?", answer: "120", topic: "time", difficulty: 5, grade: 5 },
  { id: "g5_time_sec_in_5min", text: "כמה שניות יש ב-5 דקות?", answer: "300", topic: "time", difficulty: 5, grade: 5 },
  { id: "g5_time_clock_2", text: "איזו שעה השעון מראה?", answer: "2", topic: "time", difficulty: 5, grade: 5, kind: "clock", visual: { type: "clock", hour: 2 } },
  { id: "g5_time_clock_7", text: "איזו שעה השעון מראה?", answer: "7", topic: "time", difficulty: 5, grade: 5, kind: "clock", visual: { type: "clock", hour: 7 } },
  { id: "g5_time_hours_in_3days", text: "כמה שעות יש ב-3 ימים?", answer: "72", topic: "time", difficulty: 5, grade: 5 },
];
