import { motion } from "framer-motion";
import type { ParrotPersonality, Topic } from "../types";
import { PARROT_PRIMARY_COLORS, PARROTS } from "../data/parrots";

interface CagedParrotProps {
  topic: Topic;
  size?: number;
  /** כמה תשובות נכונות באי הזה - יוצר שבר בסורגים בהתאם. */
  correctSoFar?: number;
  /** סה"כ שאלות באי. */
  totalQuestions?: number;
  /** מצב התוכי - האם הוא בכלוב? חופשי? מנער? */
  state?: "caged" | "shaking" | "free" | "exploding";
  /** כאשר התוכי משוחרר - מציגים גם את הפנינה. */
  showPearl?: boolean;
}

/**
 * עיצוב התוכי בכלוב.
 * - צבע התוכי לפי הנושא
 * - תוספות חזותיות לפי האישיות (משקפיים, גבות זועפות, דמעה וכו')
 * - סורגים שמשתברים לפי התקדמות הילד באי
 */
export function CagedParrot({
  topic,
  size = 120,
  correctSoFar = 0,
  totalQuestions = 5,
  state = "caged",
  showPearl = false,
}: CagedParrotProps) {
  const parrot = PARROTS[topic];
  const colors = PARROT_PRIMARY_COLORS[topic];
  const personality = parrot.personality;

  // כמה סורגים אנכיים? נחלק את 4 הסורגים האנכיים לפי % הנכונות.
  const TOTAL_BARS = 4;
  const progress = totalQuestions > 0 ? correctSoFar / totalQuestions : 0;
  const barsBroken = Math.min(TOTAL_BARS, Math.floor(progress * TOTAL_BARS));
  const barsRemaining = TOTAL_BARS - barsBroken;

  // אנימציות שונות לפי מצב
  const cageAnimation =
    state === "shaking"
      ? { rotate: [-3, 3, -3, 3, 0], x: [-2, 2, -2, 2, 0] }
      : state === "exploding"
      ? { scale: [1, 1.3, 0], opacity: [1, 1, 0], rotate: [0, 45, 90] }
      : {};

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {/* הכלוב + התוכי */}
      <motion.div
        className="absolute inset-0"
        animate={cageAnimation}
        transition={{ duration: state === "exploding" ? 0.8 : 0.5 }}
      >
        <svg
          viewBox="0 0 120 120"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* הכלוב - תחתית */}
          {state !== "free" && state !== "exploding" && (
            <>
              {/* רצפת הכלוב (אליפסה) */}
              <ellipse
                cx="60"
                cy="108"
                rx="38"
                ry="5"
                fill="#475569"
                opacity="0.6"
              />
              {/* קצה תחתון של הסורגים */}
              <rect x="22" y="100" width="76" height="4" rx="2" fill="#1e293b" />
              {/* קצה עליון של הסורגים */}
              <rect x="22" y="14" width="76" height="3" rx="1" fill="#1e293b" />
              {/* ידית הכלוב */}
              <path
                d="M 56 14 Q 60 4 64 14"
                stroke="#1e293b"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="60" cy="6" r="2" fill="#fbbf24" />
            </>
          )}

          {/* התוכי בפנים */}
          <ParrotSVG
            colors={colors}
            personality={personality}
            mood={state === "free" || state === "exploding" ? "happy" : "stuck"}
          />

          {/* הסורגים האנכיים (4 סורגים) - חלקם שבורים */}
          {state !== "free" && state !== "exploding" && (
            <>
              {[0, 1, 2, 3].map((barIdx) => {
                const isBroken = barIdx < barsBroken;
                const x = 30 + barIdx * 20;
                return (
                  <g key={barIdx}>
                    {isBroken ? (
                      // סורג שבור - שני חלקים נוטים
                      <>
                        <motion.line
                          x1={x}
                          y1="17"
                          x2={x - 3}
                          y2="55"
                          stroke="#475569"
                          strokeWidth="3"
                          strokeLinecap="round"
                          opacity="0.5"
                          initial={{ opacity: 1, x2: x }}
                          animate={{ opacity: 0.5 }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.line
                          x1={x + 4}
                          y1="65"
                          x2={x}
                          y2="100"
                          stroke="#475569"
                          strokeWidth="3"
                          strokeLinecap="round"
                          opacity="0.5"
                        />
                        {/* אפקט "שבירה" */}
                        <motion.circle
                          cx={x}
                          cy="60"
                          r="3"
                          fill="#fbbf24"
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 1 }}
                        />
                      </>
                    ) : (
                      // סורג שלם
                      <line
                        x1={x}
                        y1="17"
                        x2={x}
                        y2="100"
                        stroke="#1e293b"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    )}
                  </g>
                );
              })}
              {/* מנעול */}
              {barsRemaining > 0 && (
                <>
                  <rect x="52" y="55" width="16" height="14" rx="2" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
                  <path
                    d="M 56 55 L 56 50 Q 56 46 60 46 Q 64 46 64 50 L 64 55"
                    stroke="#92400e"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="60" cy="62" r="1.5" fill="#92400e" />
                </>
              )}
            </>
          )}

          {/* אנימציית פיצוץ */}
          {state === "exploding" && (
            <>
              {[..."💥✨⭐🌟💫"].map((emoji, i) => (
                <motion.text
                  key={i}
                  x="60"
                  y="60"
                  textAnchor="middle"
                  fontSize="20"
                  initial={{ scale: 0, x: 60, y: 60 }}
                  animate={{
                    scale: 1.5,
                    x: 60 + Math.cos((i * Math.PI * 2) / 5) * 40,
                    y: 60 + Math.sin((i * Math.PI * 2) / 5) * 40,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                >
                  {emoji}
                </motion.text>
              ))}
            </>
          )}
        </svg>
      </motion.div>

      {/* פנינה - מופיעה כשהתוכי משוחרר */}
      {showPearl && state === "free" && (
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
        >
          <div
            className="w-8 h-8 rounded-full shadow-lg border-2 border-white"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${colors.light}, ${colors.main})`,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

/** ה-SVG הפנימי של התוכי - מותאם לפי צבע ואישיות. */
function ParrotSVG({
  colors,
  personality,
  mood,
}: {
  colors: { main: string; light: string; dark: string };
  personality: ParrotPersonality;
  mood: "happy" | "stuck";
}) {
  return (
    <g>
      {/* גוף */}
      <ellipse cx="60" cy="72" rx="22" ry="20" fill={colors.main} />
      <ellipse cx="60" cy="78" rx="14" ry="13" fill={colors.light} />

      {/* כנפיים */}
      <motion.ellipse
        cx="42"
        cy="68"
        rx="9"
        ry="14"
        fill={colors.dark}
        animate={
          mood === "happy"
            ? { rotate: [-10, 10, -10] }
            : { rotate: [0, -5, 0] }
        }
        transition={{
          duration: mood === "happy" ? 0.6 : 2,
          repeat: Infinity,
        }}
        style={{ originX: "50px", originY: "68px" }}
      />
      <motion.ellipse
        cx="78"
        cy="68"
        rx="9"
        ry="14"
        fill={colors.dark}
        animate={
          mood === "happy"
            ? { rotate: [10, -10, 10] }
            : { rotate: [0, 5, 0] }
        }
        transition={{
          duration: mood === "happy" ? 0.6 : 2,
          repeat: Infinity,
        }}
        style={{ originX: "70px", originY: "68px" }}
      />

      {/* ראש */}
      <circle cx="60" cy="46" r="14" fill={colors.main} />

      {/* אישיות - תוספות חזותיות לפי האישיות */}
      <PersonalityAccents personality={personality} />

      {/* עיניים */}
      <ellipse cx="55" cy="44" rx="3" ry="3.5" fill="white" />
      <ellipse cx="65" cy="44" rx="3" ry="3.5" fill="white" />
      <circle
        cx="55"
        cy="45"
        r="1.8"
        fill={mood === "stuck" ? "#1e293b" : "#000"}
      />
      <circle cx="65" cy="45" r="1.8" fill={mood === "stuck" ? "#1e293b" : "#000"} />
      <circle cx="55.5" cy="44.5" r="0.6" fill="white" />
      <circle cx="65.5" cy="44.5" r="0.6" fill="white" />

      {/* מקור */}
      <path
        d="M 56 50 Q 60 56 64 50 Q 62 53 60 53 Q 58 53 56 50"
        fill="#fbbf24"
        stroke="#92400e"
        strokeWidth="0.5"
      />

      {/* רגליים */}
      <line x1="55" y1="90" x2="53" y2="96" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <line x1="65" y1="90" x2="67" y2="96" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />

      {/* כנפי-ראש (נוצות) */}
      <path
        d="M 56 32 Q 58 26 60 32"
        stroke={colors.dark}
        strokeWidth="2"
        fill={colors.main}
        strokeLinecap="round"
      />
      <path
        d="M 60 32 Q 62 26 64 32"
        stroke={colors.dark}
        strokeWidth="2"
        fill={colors.main}
        strokeLinecap="round"
      />
    </g>
  );
}

/** תוספות חזותיות לפי האישיות - לסמן ייחודיות לכל תוכי. */
function PersonalityAccents({ personality }: { personality: ParrotPersonality }) {
  switch (personality) {
    case "smart":
      // משקפיים
      return (
        <>
          <circle cx="55" cy="44" r="4.5" fill="none" stroke="#1e293b" strokeWidth="0.8" />
          <circle cx="65" cy="44" r="4.5" fill="none" stroke="#1e293b" strokeWidth="0.8" />
          <line x1="59.5" y1="44" x2="60.5" y2="44" stroke="#1e293b" strokeWidth="0.8" />
        </>
      );
    case "emotional":
      // לב על החזה
      return (
        <text x="60" y="78" textAnchor="middle" fontSize="8">
          💛
        </text>
      );
    case "grumpy":
      // גבות זועפות
      return (
        <>
          <path d="M 51 40 L 58 42" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 62 42 L 69 40" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
    case "showoff":
      // שריר על הכנף
      return (
        <text x="40" y="68" textAnchor="middle" fontSize="6">
          💪
        </text>
      );
    case "calm":
      // עיגול זן על המצח
      return (
        <circle cx="60" cy="36" r="2" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.8" />
      );
    case "dramatic":
      // דמעה
      return <text x="50" y="52" textAnchor="middle" fontSize="6">💧</text>;
    case "artist":
      // כובע בארט
      return (
        <>
          <path d="M 50 32 L 70 32 L 60 24 Z" fill="#1e293b" />
          <circle cx="50" cy="32" r="2" fill="#fbbf24" />
        </>
      );
    case "storyteller":
      // ספר פתוח על הראש
      return <text x="60" y="34" textAnchor="middle" fontSize="6">📖</text>;
    case "rushed":
      // שעון על החזה
      return <text x="60" y="78" textAnchor="middle" fontSize="6">⏰</text>;
    case "silly":
      // לשון בחוץ
      return (
        <ellipse cx="60" cy="55" rx="2" ry="2.5" fill="#ec4899" />
      );
    default:
      return null;
  }
}
