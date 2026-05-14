import type { ShopItem } from "../types";

/**
 * הפריטים שניתן לקנות בחנות הפיראטים בפנינים.
 * מסודרים לפי קטגוריה - כובעים, ספינות, חיות מחמד וקישוטים.
 */
export const SHOP_ITEMS: ShopItem[] = [
  // ============= כובעים =============
  {
    id: "hat_classic",
    name: "כובע פיראט קלאסי",
    category: "hat",
    emoji: "🎩",
    description: "כובע שחור עם גולגולת לבנה - קלאסיקה לכל פיראט!",
    priceInPearls: 10,
  },
  {
    id: "hat_red",
    name: "כובע אדום מלכותי",
    category: "hat",
    emoji: "🧢",
    description: "כובע אדום עם נוצה זהובה - לפיראטים אצילים.",
    priceInPearls: 15,
  },
  {
    id: "hat_crown",
    name: "כתר מלכותי",
    category: "hat",
    emoji: "👑",
    description: "כתר זהב לפיראט המלך של הים!",
    priceInPearls: 30,
  },
  {
    id: "hat_bandana",
    name: "בנדנה מעוטרת",
    category: "hat",
    emoji: "🎽",
    description: "בנדנה מעוטרת בכוכבי ים.",
    priceInPearls: 8,
  },

  // ============= ספינות =============
  {
    id: "ship_basic",
    name: "ספינה קטנה",
    category: "ship",
    emoji: "⛵",
    description: "ספינה זריזה לתחילת המסע.",
    priceInPearls: 20,
  },
  {
    id: "ship_galleon",
    name: "ספינת גליאון מפוארת",
    category: "ship",
    emoji: "🚢",
    description: "ספינה גדולה עם 3 תרנים - מתאימה לקפטן.",
    priceInPearls: 50,
  },
  {
    id: "ship_ghost",
    name: "ספינת רוח",
    category: "ship",
    emoji: "👻",
    description: "ספינה מסתורית שמופיעה בערפל.",
    priceInPearls: 80,
  },

  // ============= חיות מחמד =============
  {
    id: "pet_monkey",
    name: "קוף ספינה",
    category: "pet",
    emoji: "🐒",
    description: "קוף קטן וזריז שמטפס על התרן.",
    priceInPearls: 25,
  },
  {
    id: "pet_dog",
    name: "כלב פיראט",
    category: "pet",
    emoji: "🐕",
    description: "החבר הכי טוב של כל פיראט.",
    priceInPearls: 25,
  },
  {
    id: "pet_octopus",
    name: "תמנון חכם",
    category: "pet",
    emoji: "🐙",
    description: "תמנון פיקח שיודע את כל סודות הים.",
    priceInPearls: 40,
  },
  {
    id: "pet_dolphin",
    name: "דולפין מסור",
    category: "pet",
    emoji: "🐬",
    description: "דולפין שמלווה את הספינה ושר לה שירים.",
    priceInPearls: 35,
  },

  // ============= קישוטים =============
  {
    id: "deco_flag_skull",
    name: "דגל גולגולת",
    category: "decoration",
    emoji: "🏴‍☠️",
    description: "הדגל המסורתי של הפיראטים - גולגולת ועצמות.",
    priceInPearls: 12,
  },
  {
    id: "deco_compass",
    name: "מצפן זהב",
    category: "decoration",
    emoji: "🧭",
    description: "מצפן עתיק שמראה תמיד את הדרך.",
    priceInPearls: 18,
  },
  {
    id: "deco_telescope",
    name: "טלסקופ",
    category: "decoration",
    emoji: "🔭",
    description: "טלסקופ לראות אוצרות באופק.",
    priceInPearls: 20,
  },
  {
    id: "deco_map",
    name: "מפת אוצר זקנה",
    category: "decoration",
    emoji: "🗺️",
    description: "מפה עתיקה ומסתורית.",
    priceInPearls: 15,
  },
  {
    id: "deco_chest",
    name: "תיבת אוצר",
    category: "decoration",
    emoji: "💰",
    description: "תיבת אוצר מלאה מטבעות זהב.",
    priceInPearls: 45,
  },
];

export const CATEGORY_LABELS: Record<ShopItem["category"], { label: string; emoji: string }> = {
  hat: { label: "כובעים", emoji: "🎩" },
  ship: { label: "ספינות", emoji: "⛵" },
  pet: { label: "חיות מחמד", emoji: "🐒" },
  decoration: { label: "קישוטים", emoji: "🏴‍☠️" },
};
