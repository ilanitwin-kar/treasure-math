import type { PirateId } from "../types";

interface PirateAvatarProps {
  id: PirateId;
  size?: number;
}

/**
 * תצורת צבעים לכל פיראט.
 * skinColor, hairColor, hatColor, accentColor
 */
const PIRATE_STYLES: Record<PirateId, {
  skin: string;
  hair: string;
  hat: string;
  bandana?: string;
  scarf: string;
  eye: string;
  hasBeard?: boolean;
  beardColor?: string;
  hasEarring?: boolean;
  hasHairBow?: boolean;
  bowColor?: string;
  longHair?: boolean;
}> = {
  // בנים
  captain_jack: {
    skin: "#f4d4a4",
    hair: "#3a2817",
    hat: "#1f2937",
    scarf: "#dc2626",
    eye: "#1e293b",
    hasBeard: false,
    hasEarring: true,
  },
  blackbeard: {
    skin: "#e8b889",
    hair: "#1a1a1a",
    hat: "#0f172a",
    scarf: "#7c2d12",
    eye: "#1e293b",
    hasBeard: true,
    beardColor: "#1a1a1a",
    hasEarring: true,
  },
  scout: {
    skin: "#f5d2a8",
    hair: "#8b5a2b",
    bandana: "#06b6d4",
    hat: "transparent",
    scarf: "#f59e0b",
    eye: "#0f766e",
  },
  redbeard: {
    skin: "#f5c89b",
    hair: "#c2410c",
    hat: "#451a03",
    scarf: "#fbbf24",
    eye: "#075985",
    hasBeard: true,
    beardColor: "#c2410c",
  },
  lookout: {
    skin: "#d4a276",
    hair: "#1f2937",
    bandana: "#dc2626",
    hat: "transparent",
    scarf: "#1e3a8a",
    eye: "#451a03",
  },
  navigator: {
    skin: "#e8b889",
    hair: "#fbbf24",
    hat: "#92400e",
    scarf: "#16a34a",
    eye: "#0c4a6e",
    hasBeard: false,
  },

  // בנות
  pearl: {
    skin: "#f4d4a4",
    hair: "#ec4899",
    hat: "#a855f7",
    scarf: "#fbbf24",
    eye: "#7c3aed",
    longHair: true,
    hasHairBow: true,
    bowColor: "#fbbf24",
  },
  anne: {
    skin: "#e8b889",
    hair: "#1a1a1a",
    bandana: "#dc2626",
    hat: "transparent",
    scarf: "#0891b2",
    eye: "#1e293b",
    longHair: true,
    hasEarring: true,
  },
  storm: {
    skin: "#d4a276",
    hair: "#6366f1",
    hat: "#1e293b",
    scarf: "#a855f7",
    eye: "#312e81",
    longHair: true,
  },
  ruby: {
    skin: "#f5c89b",
    hair: "#dc2626",
    hat: "#7c2d12",
    scarf: "#fbbf24",
    eye: "#1e3a8a",
    longHair: true,
    hasHairBow: true,
    bowColor: "#ffffff",
  },
  sky: {
    skin: "#f4d4a4",
    hair: "#fbbf24",
    bandana: "#0ea5e9",
    hat: "transparent",
    scarf: "#f97316",
    eye: "#0369a1",
    longHair: true,
  },
  rosie: {
    skin: "#e8b889",
    hair: "#a16207",
    hat: "#be185d",
    scarf: "#fbbf24",
    eye: "#854d0e",
    longHair: true,
    hasHairBow: true,
    bowColor: "#fbbf24",
  },
};

export function PirateAvatar({ id, size = 80 }: PirateAvatarProps) {
  const style = PIRATE_STYLES[id];

  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      {/* שיער ארוך מאחור (לבנות) */}
      {style.longHair && (
        <>
          <ellipse cx="32" cy="62" rx="9" ry="22" fill={style.hair} />
          <ellipse cx="68" cy="62" rx="9" ry="22" fill={style.hair} />
        </>
      )}

      {/* צוואר */}
      <rect x="42" y="62" width="16" height="8" fill={style.skin} />

      {/* גוף עם חולצה פיראטית פסים */}
      <path
        d="M 25 95 Q 25 75 35 70 L 65 70 Q 75 75 75 95 L 75 105 L 25 105 Z"
        fill="#ffffff"
      />
      {/* פסים על החולצה */}
      <rect x="25" y="78" width="50" height="3" fill="#dc2626" />
      <rect x="25" y="86" width="50" height="3" fill="#dc2626" />
      <rect x="25" y="94" width="50" height="3" fill="#dc2626" />

      {/* צעיף סביב הצוואר */}
      <path
        d="M 38 68 Q 50 75 62 68 L 62 73 Q 50 79 38 73 Z"
        fill={style.scarf}
      />

      {/* פנים */}
      <ellipse cx="50" cy="48" rx="18" ry="20" fill={style.skin} />

      {/* אוזניים */}
      <ellipse cx="32" cy="50" rx="3" ry="4" fill={style.skin} />
      <ellipse cx="68" cy="50" rx="3" ry="4" fill={style.skin} />

      {/* עגיל */}
      {style.hasEarring && (
        <circle cx="68" cy="54" r="1.5" fill="#fbbf24" stroke="#92400e" strokeWidth="0.3" />
      )}

      {/* שיער קדמי */}
      {style.hat === "transparent" ? (
        // למי שאין כובע - שיער גלוי
        <path
          d={style.longHair
            ? "M 30 38 Q 32 26 50 25 Q 68 26 70 38 L 67 42 L 60 35 L 52 38 L 44 35 L 38 38 Z"
            : "M 32 38 Q 35 27 50 27 Q 65 27 68 38 L 65 40 L 58 36 L 50 38 L 42 36 L 35 40 Z"}
          fill={style.hair}
        />
      ) : null}

      {/* בנדנה (אם יש) */}
      {style.bandana && (
        <>
          <path
            d="M 28 36 Q 32 30 50 30 Q 68 30 72 36 L 72 42 L 28 42 Z"
            fill={style.bandana}
          />
          {/* נקודות לבנות על הבנדנה */}
          <circle cx="38" cy="36" r="1.5" fill="#ffffff" />
          <circle cx="50" cy="34" r="1.5" fill="#ffffff" />
          <circle cx="62" cy="36" r="1.5" fill="#ffffff" />
          {/* קצה בנדנה תלוי בצד */}
          <path d="M 72 38 L 80 44 L 76 50 L 70 42 Z" fill={style.bandana} />
        </>
      )}

      {/* כובע פיראטים (לא בנדנה) */}
      {style.hat !== "transparent" && (
        <>
          {/* תחתית הכובע (רחב) */}
          <path
            d="M 22 32 Q 50 18 78 32 L 78 36 L 22 36 Z"
            fill={style.hat}
          />
          {/* החלק העליון של הכובע */}
          <path
            d="M 30 32 Q 50 8 70 32 Z"
            fill={style.hat}
          />
          {/* סמל גולגולת ועצמות לבן בכובע */}
          <circle cx="50" cy="22" r="3.5" fill="#ffffff" />
          <circle cx="48.5" cy="21" r="0.7" fill={style.hat} />
          <circle cx="51.5" cy="21" r="0.7" fill={style.hat} />
          <rect x="46" y="25" width="8" height="1.5" fill="#ffffff" transform="rotate(45, 50, 25.75)" />
          <rect x="46" y="25" width="8" height="1.5" fill="#ffffff" transform="rotate(-45, 50, 25.75)" />
        </>
      )}

      {/* פפיון/סרט בשיער (לבנות מסוימות) */}
      {style.hasHairBow && (
        <>
          <ellipse cx="28" cy="48" rx="4" ry="3" fill={style.bowColor} />
          <ellipse cx="33" cy="48" rx="4" ry="3" fill={style.bowColor} />
          <circle cx="30.5" cy="48" r="1.5" fill={style.bowColor} stroke="#000" strokeOpacity="0.2" strokeWidth="0.3" />
        </>
      )}

      {/* עיניים */}
      <ellipse cx="42" cy="48" rx="2.5" ry="2.8" fill="#ffffff" />
      <ellipse cx="58" cy="48" rx="2.5" ry="2.8" fill="#ffffff" />
      <circle cx="42" cy="49" r="1.6" fill={style.eye} />
      <circle cx="58" cy="49" r="1.6" fill={style.eye} />
      <circle cx="42.5" cy="48.5" r="0.6" fill="#ffffff" />
      <circle cx="58.5" cy="48.5" r="0.6" fill="#ffffff" />

      {/* גבות */}
      <path d="M 39 44 Q 42 43 45 44" stroke={style.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 55 44 Q 58 43 61 44" stroke={style.hair} strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* אף */}
      <path
        d="M 50 50 Q 49 53 49 56 Q 50 57 51 56 Q 51 53 50 50"
        fill={style.skin}
        opacity="0.8"
      />

      {/* פה - חיוך */}
      <path
        d="M 44 58 Q 50 62 56 58"
        stroke="#7c2d12"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* שפתיים ורוד עדין */}
      <path
        d="M 45 58 Q 50 61 55 58"
        stroke="#ec4899"
        strokeWidth="0.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* זקן */}
      {style.hasBeard && (
        <path
          d="M 40 58 Q 42 65 50 67 Q 58 65 60 58 Q 58 62 50 63 Q 42 62 40 58"
          fill={style.beardColor}
        />
      )}

      {/* טלאי על העין (לפיראט עם זקן שחור = blackbeard) */}
      {id === "blackbeard" && (
        <>
          <ellipse cx="58" cy="49" rx="4" ry="4.5" fill="#0f172a" />
          <line x1="55" y1="44" x2="78" y2="42" stroke="#0f172a" strokeWidth="1" />
        </>
      )}
    </svg>
  );
}
