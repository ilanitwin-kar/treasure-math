import type { Question } from "../../types";

/**
 * כיתה ו' - מבוסס תוכנית הלימודים הרשמית של משרד החינוך.
 *
 * נושאים מרכזיים:
 * 1. המספרים הטבעיים (חזרה - המבנה העשרוני, פעולות חשבון, אומדן)
 * 2. שברים - משמעויות ופעולות (כפל וחילוק שברים)
 * 3. שברים עשרוניים (כפל וחילוק)
 * 4. אחוזים (חישוב ערך האחוז, מציאת השלם, הנחה והתייקרות)
 * 5. שטח והיקף של מצולעים מורכבים
 * 6. מעגל ועיגול (קוטר, רדיוס, היקף, שטח)
 * 7. נפח של תיבות ויחידות נפח (סמ"ק, מ"ק, ליטר, מ"ל)
 * 8. ממוצע חשבוני
 */
export const GRADE_6_QUESTIONS: Question[] = [
  // ===== חזרה על מספרים טבעיים =====
  { id: "g6_add_a", text: "5,432,167 + 2,345,833 = ?", answer: "7778000", topic: "addition", difficulty: 6, grade: 6, acceptAlternatives: ["7,778,000"] },
  { id: "g6_add_b", text: "1,250,000 + 3,750,000 = ?", answer: "5000000", topic: "addition", difficulty: 6, grade: 6, acceptAlternatives: ["5,000,000"] },
  { id: "g6_add_c", text: "999,999 + 1 = ?", answer: "1000000", topic: "addition", difficulty: 6, grade: 6, acceptAlternatives: ["1,000,000"] },
  { id: "g6_add_d", text: "השלם: 250,000 + ____ = 1,000,000", answer: "750000", topic: "addition", difficulty: 6, grade: 6, acceptAlternatives: ["750,000"] },
  { id: "g6_add_e", text: "12,345 + 54,321 = ?", answer: "66666", topic: "addition", difficulty: 6, grade: 6, acceptAlternatives: ["66,666"] },
  { id: "g6_sub_a", text: "1,000,000 - 250,000 = ?", answer: "750000", topic: "subtraction", difficulty: 6, grade: 6, acceptAlternatives: ["750,000"] },
  { id: "g6_sub_b", text: "5,000,000 - 1,234,567 = ?", answer: "3765433", topic: "subtraction", difficulty: 6, grade: 6, acceptAlternatives: ["3,765,433"] },
  { id: "g6_sub_c", text: "10,000 - 2,808 = ?", answer: "7192", topic: "subtraction", difficulty: 6, grade: 6, acceptAlternatives: ["7,192"] },
  { id: "g6_sub_d", text: "השלם: 1,500,000 - ____ = 900,000", answer: "600000", topic: "subtraction", difficulty: 6, grade: 6, acceptAlternatives: ["600,000"] },
  { id: "g6_sub_e", text: "2,808 - 234 × 12 = ?", answer: "0", topic: "subtraction", difficulty: 6, grade: 6 },
  { id: "g6_mul_a", text: "324 × 25 = ?", answer: "8100", topic: "multiplication", difficulty: 6, grade: 6, acceptAlternatives: ["8,100"] },
  { id: "g6_mul_b", text: "234 × 18 = ?", answer: "4212", topic: "multiplication", difficulty: 6, grade: 6, acceptAlternatives: ["4,212"] },
  { id: "g6_mul_c", text: "500 × 80 = ?", answer: "40000", topic: "multiplication", difficulty: 6, grade: 6, acceptAlternatives: ["40,000"] },
  { id: "g6_mul_d", text: "125 × 16 = ?", answer: "2000", topic: "multiplication", difficulty: 6, grade: 6, acceptAlternatives: ["2,000"] },
  { id: "g6_mul_e", text: "750 × 12 = ?", answer: "9000", topic: "multiplication", difficulty: 6, grade: 6, acceptAlternatives: ["9,000"] },
  { id: "g6_div_a", text: "31,606 ÷ 6 - מה השארית?", answer: "4", topic: "division", difficulty: 6, grade: 6, hint: "31,606 = 6 × 5,267 + 4" },
  { id: "g6_div_b", text: "4,312 ÷ 7 = ?", answer: "616", topic: "division", difficulty: 6, grade: 6 },
  { id: "g6_div_c", text: "10,000 ÷ 50 = ?", answer: "200", topic: "division", difficulty: 6, grade: 6 },
  { id: "g6_div_d", text: "6,300 ÷ 9 = ?", answer: "700", topic: "division", difficulty: 6, grade: 6 },
  { id: "g6_div_e", text: "8,400 ÷ 12 = ?", answer: "700", topic: "division", difficulty: 6, grade: 6 },

  // ===== כפל וחילוק בשברים =====
  { id: "g6_frac_mul_a", text: "1/2 × 1/3 = ? (כתוב כשבר מצומצם)", answer: "1/6", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_frac_mul_b", text: "2/3 × 3/4 = ? (כתוב כשבר מצומצם)", answer: "1/2", topic: "fractions", difficulty: 6, grade: 6, acceptAlternatives: ["6/12", "3/6"] },
  { id: "g6_frac_mul_c", text: "4 × 3/5 = ? (כתוב כשבר/מספר מעורב)", answer: "12/5", topic: "fractions", difficulty: 6, grade: 6, acceptAlternatives: ["2 2/5", "2.4"] },
  { id: "g6_frac_mul_word", text: "כמה זה 2/3 מ-15?", answer: "10", topic: "fractions", difficulty: 6, grade: 6 },

  { id: "g6_frac_div_a", text: "1/2 ÷ 1/4 = ?", answer: "2", topic: "fractions", difficulty: 6, grade: 6, hint: "חילוק בשבר שקול לכפל בהופכי" },
  { id: "g6_frac_div_b", text: "3/4 ÷ 1/2 = ? (כתוב כשבר)", answer: "3/2", topic: "fractions", difficulty: 6, grade: 6, acceptAlternatives: ["1 1/2", "1.5"] },
  { id: "g6_frac_div_c", text: "6 ÷ 1/3 = ?", answer: "18", topic: "fractions", difficulty: 6, grade: 6 },

  // ===== כפל וחילוק בשברים עשרוניים =====
  { id: "g6_dec_mul_a", text: "0.5 × 0.4 = ?", answer: "0.2", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_dec_mul_b", text: "1.2 × 0.5 = ?", answer: "0.6", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_dec_mul_c", text: "2.5 × 4 = ?", answer: "10", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_dec_mul_d", text: "0.25 × 8 = ?", answer: "2", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_dec_div_a", text: "2.4 ÷ 0.4 = ?", answer: "6", topic: "fractions", difficulty: 6, grade: 6, hint: "2.4 ÷ 0.4 = 24 ÷ 4" },
  { id: "g6_dec_div_b", text: "10 ÷ 0.5 = ?", answer: "20", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_dec_div_c", text: "0.6 ÷ 0.2 = ?", answer: "3", topic: "fractions", difficulty: 6, grade: 6 },

  // ===== אחוזים =====
  { id: "g6_pct_50", text: "כמה זה 50% מ-80?", answer: "40", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_pct_25", text: "כמה זה 25% מ-200?", answer: "50", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_pct_10", text: "כמה זה 10% מ-350?", answer: "35", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_pct_20", text: "כמה זה 20% מ-150?", answer: "30", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_pct_75", text: "כמה זה 75% מ-400?", answer: "300", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_pct_find_whole", text: "80% ממספר הם 120. מה המספר?", answer: "150", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_pct_find_pct", text: "30 הם איזה אחוז מ-150? (כתוב את המספר בלבד)", answer: "20", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_pct_discount", text: "חולצה עולה 200 ש\"ח. יש הנחה של 25%. מה המחיר אחרי ההנחה?", answer: "150", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_pct_increase", text: "מוצר עלה 80 ש\"ח. המחיר התייקר ב-10%. מה המחיר החדש?", answer: "88", topic: "wordProblems", difficulty: 6, grade: 6 },

  // ===== שברים -> עשרוני, אחוזים =====
  { id: "g6_conv_a", text: "כתוב 0.5 באחוזים (רק את המספר)", answer: "50", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_conv_b", text: "כתוב 1/4 באחוזים (רק את המספר)", answer: "25", topic: "fractions", difficulty: 6, grade: 6 },
  { id: "g6_conv_c", text: "כתוב 3/5 כשבר עשרוני", answer: "0.6", topic: "fractions", difficulty: 6, grade: 6 },

  // ===== שטח והיקף מצולעים מורכבים =====
  { id: "g6_geo_l_shape", text: "צורת L מורכבת ממלבן 8×4 ומלבן 3×2 (לא חופפים, סמוכים). מה השטח הכולל?", answer: "38", topic: "geometry", difficulty: 6, grade: 6, hint: "8×4=32, 3×2=6, סך הכל 38" },
  { id: "g6_geo_paral_h2", text: "מה שטח של מקבילית שבסיסה 8.5 ס\"מ וגובהה 4 ס\"מ?", answer: "34", topic: "geometry", difficulty: 6, grade: 6 },
  { id: "g6_geo_tri_dec", text: "מה שטח של משולש שבסיסו 12 ס\"מ וגובהו 5 ס\"מ?", answer: "30", topic: "geometry", difficulty: 6, grade: 6 },

  // ===== מעגל ועיגול =====
  { id: "g6_circ_radius", text: "ברדיוס של 5 ס\"מ - מה אורך הקוטר?", answer: "10", topic: "geometry", difficulty: 6, grade: 6 },
  { id: "g6_circ_diam", text: "קוטר של מעגל הוא 14 ס\"מ. מה הרדיוס?", answer: "7", topic: "geometry", difficulty: 6, grade: 6 },
  { id: "g6_circ_perim", text: "מה היקף מעגל שרדיוסו 10 ס\"מ? (השתמש ב-π = 3.14, ענה כמספר)", answer: "62.8", topic: "geometry", difficulty: 6, grade: 6, hint: "היקף = 2πr" },
  { id: "g6_circ_area", text: "מה שטח עיגול שרדיוסו 10 ס\"מ? (π = 3.14)", answer: "314", topic: "geometry", difficulty: 6, grade: 6, hint: "שטח = π × r × r" },

  // ===== נפח =====
  { id: "g6_vol_cube", text: "מה נפח קובייה שצלעה 5 ס\"מ? (בסמ\"ק)", answer: "125", topic: "geometry", difficulty: 6, grade: 6 },
  { id: "g6_vol_box", text: "מה נפח תיבה שמידותיה 4×3×2 ס\"מ?", answer: "24", topic: "geometry", difficulty: 6, grade: 6 },
  { id: "g6_vol_box_b", text: "תיבה שנפחה 84 סמ\"ק. אורכה 7 ס\"מ ורוחבה 4 ס\"מ. מה הגובה?", answer: "3", topic: "geometry", difficulty: 6, grade: 6 },
  { id: "g6_vol_units_a", text: "כמה מ\"ל יש בליטר אחד?", answer: "1000", topic: "geometry", difficulty: 6, grade: 6, acceptAlternatives: ["1,000"] },
  { id: "g6_vol_units_b", text: "כמה סמ\"ק יש ב-2 ליטרים?", answer: "2000", topic: "geometry", difficulty: 6, grade: 6, acceptAlternatives: ["2,000"] },

  // ===== ממוצע =====
  { id: "g6_avg_a", text: "מה הממוצע של 8, 10, 12, 14, 16?", answer: "12", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_avg_b", text: "הממוצע של 5 מספרים הוא 20. מה הסכום שלהם?", answer: "100", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_avg_c", text: "תלמיד קיבל במבחנים: 75, 80, 85, 90, 95. מה ממוצע הציונים?", answer: "85", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_avg_d", text: "במשפחה 4 ילדים בגילאי 10, 12, 14, 16. מה הגיל הממוצע?", answer: "13", topic: "wordProblems", difficulty: 6, grade: 6 },

  // ===== שאלות מילוליות =====
  { id: "g6_word_a", text: "בכרטיס אשראי 50 ש\"ח. בעל הכרטיס קנה מוצר ב-18.55 ש\"ח. כמה נשאר בכרטיס?", answer: "31.45", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_word_b", text: "מתוך 250 תלמידים, 1/5 הם צמחוניים. כמה תלמידים צמחוניים יש?", answer: "50", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_word_c", text: "מחיר חולצה עם הנחה של 20% הוא 80 ש\"ח. מה היה המחיר המקורי?", answer: "100", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_word_d", text: "נסע אדם 60 ק\"מ ב-1.5 שעות. מה המהירות הממוצעת שלו (ק\"מ לשעה)?", answer: "40", topic: "wordProblems", difficulty: 6, grade: 6 },
  { id: "g6_word_e", text: "תיבה במידות 10×5×4 ס\"מ. ספרים במידות 5×4×1 ס\"מ. כמה ספרים יכולים להיכנס?", answer: "10", topic: "wordProblems", difficulty: 6, grade: 6 },
];
