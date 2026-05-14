import { motion } from "framer-motion";

interface ParrotProps {
  mood?: "happy" | "thinking" | "celebrating" | "sleeping";
  size?: number;
  className?: string;
}

/**
 * דמות התוכי - מלווה את הילד לאורך כל המשחק.
 * גרסה משופרת: ראש גדול וחמוד יותר, צבעים בהירים, יותר "מצויר".
 */
export function Parrot({ mood = "happy", size = 140, className = "" }: ParrotProps) {
  const isSleeping = mood === "sleeping";
  const isCelebrating = mood === "celebrating";

  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={
        isCelebrating
          ? { rotate: [-10, 10, -10, 10, 0], scale: [1, 1.15, 1] }
          : isSleeping
          ? {}
          : { y: [0, -5, 0] }
      }
      transition={
        isCelebrating
          ? { duration: 0.7 }
          : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
          <radialGradient id="bellyGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="100%" stopColor="#fed7aa" />
          </radialGradient>
          <radialGradient id="headGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
        </defs>

        {/* רגליים קטנות וחמודות */}
        <ellipse cx="88" cy="180" rx="8" ry="5" fill="#f97316" />
        <ellipse cx="112" cy="180" rx="8" ry="5" fill="#f97316" />
        <rect x="85" y="165" width="6" height="15" rx="3" fill="#f97316" />
        <rect x="109" y="165" width="6" height="15" rx="3" fill="#f97316" />

        {/* כנף שמאלית (אחורה) - אדומה */}
        <motion.ellipse
          cx="65"
          cy="120"
          rx="18"
          ry="28"
          fill="#dc2626"
          animate={isCelebrating ? { rotate: [0, -25, 0, -25, 0] } : { rotate: [0, -8, 0] }}
          transition={
            isCelebrating
              ? { duration: 0.7 }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformOrigin: "75px 110px" }}
        />

        {/* גוף - צהוב */}
        <ellipse cx="100" cy="130" rx="42" ry="45" fill="url(#bodyGrad)" />

        {/* בטן בהירה */}
        <ellipse cx="100" cy="140" rx="28" ry="32" fill="url(#bellyGrad)" />

        {/* פסים על הבטן */}
        <path d="M 85 145 Q 100 148 115 145" stroke="#fb923c" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M 88 152 Q 100 154 112 152" stroke="#fb923c" strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* כנף ימנית (קדמית) - אדומה עם פסים */}
        <motion.g
          animate={isCelebrating ? { rotate: [0, 25, 0, 25, 0] } : { rotate: [0, 8, 0] }}
          transition={
            isCelebrating
              ? { duration: 0.7 }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformOrigin: "125px 110px" }}
        >
          <ellipse cx="135" cy="120" rx="18" ry="28" fill="#dc2626" />
          <ellipse cx="135" cy="125" rx="12" ry="22" fill="#ef4444" />
          <path d="M 130 110 L 130 140" stroke="#b91c1c" strokeWidth="1" />
          <path d="M 140 110 L 140 140" stroke="#b91c1c" strokeWidth="1" />
        </motion.g>

        {/* זנב - כחול עם נוצות */}
        <g>
          <path d="M 60 145 Q 35 155 30 175 Q 50 170 65 160 Z" fill="#2563eb" />
          <path d="M 55 150 Q 38 162 36 178 Q 50 174 60 165 Z" fill="#3b82f6" />
          <path d="M 50 158 Q 40 170 42 180 Q 50 178 55 170 Z" fill="#60a5fa" />
        </g>

        {/* ראש - ירוק (גדול ובולט) */}
        <circle cx="100" cy="78" r="42" fill="url(#headGrad)" />

        {/* "ציצית" / נוצות עליונות צבעוניות */}
        <motion.g
          animate={isCelebrating ? { rotate: [-15, 15, -15, 15, 0] } : {}}
          transition={{ duration: 0.7 }}
          style={{ transformOrigin: "100px 45px" }}
        >
          <path d="M 95 35 Q 92 22 100 25 Q 108 22 105 35 Z" fill="#facc15" />
          <path d="M 82 42 Q 76 32 86 32 Q 92 38 88 47 Z" fill="#f97316" />
          <path d="M 118 42 Q 124 32 114 32 Q 108 38 112 47 Z" fill="#ec4899" />
        </motion.g>

        {/* לחיים ורודות */}
        <circle cx="72" cy="88" r="6" fill="#fb7185" opacity="0.55" />
        <circle cx="128" cy="88" r="6" fill="#fb7185" opacity="0.55" />

        {/* עיניים - גדולות וחמודות */}
        {isSleeping ? (
          <>
            <path
              d="M 82 78 Q 90 84 98 78"
              stroke="#1f2937"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 102 78 Q 110 84 118 78"
              stroke="#1f2937"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* בסיס לבן של העיניים */}
            <circle cx="88" cy="78" r="11" fill="white" />
            <circle cx="112" cy="78" r="11" fill="white" />
            {/* אישונים */}
            <motion.circle
              cx="88"
              cy="78"
              r="6"
              fill="#1f2937"
              animate={
                mood === "thinking"
                  ? { cx: [85, 91, 85] }
                  : isCelebrating
                  ? { scale: [1, 1.3, 1] }
                  : {}
              }
              transition={{
                duration: mood === "thinking" ? 1.5 : 0.3,
                repeat: mood === "thinking" ? Infinity : 0,
              }}
            />
            <motion.circle
              cx="112"
              cy="78"
              r="6"
              fill="#1f2937"
              animate={
                mood === "thinking"
                  ? { cx: [109, 115, 109] }
                  : isCelebrating
                  ? { scale: [1, 1.3, 1] }
                  : {}
              }
              transition={{
                duration: mood === "thinking" ? 1.5 : 0.3,
                repeat: mood === "thinking" ? Infinity : 0,
              }}
            />
            {/* נצנוצים בעיניים */}
            <circle cx="91" cy="75" r="2.5" fill="white" />
            <circle cx="115" cy="75" r="2.5" fill="white" />
          </>
        )}

        {/* מקור - כתום כפול (כמו של תוכים אמיתיים) */}
        <path
          d="M 88 95 Q 100 115 112 95 Q 105 102 100 105 Q 95 102 88 95 Z"
          fill="#fbbf24"
          stroke="#d97706"
          strokeWidth="1.5"
        />
        <path
          d="M 92 98 Q 100 110 108 98 Q 102 103 100 104 Q 98 103 92 98 Z"
          fill="#f59e0b"
        />

        {/* Zzz אם ישן */}
        {isSleeping && (
          <g>
            <text x="140" y="50" fontSize="22" fill="#3b82f6" fontWeight="bold">
              Z
            </text>
            <text x="155" y="35" fontSize="16" fill="#3b82f6" fontWeight="bold">
              z
            </text>
            <text x="167" y="22" fontSize="11" fill="#3b82f6" fontWeight="bold">
              z
            </text>
          </g>
        )}

        {/* כוכבים סביב התוכי אם חוגג */}
        {isCelebrating && (
          <>
            <motion.text
              x="30"
              y="50"
              fontSize="20"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 1.4, 0], rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⭐
            </motion.text>
            <motion.text
              x="160"
              y="40"
              fontSize="18"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 0], rotate: -360 }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            >
              ✨
            </motion.text>
            <motion.text
              x="170"
              y="120"
              fontSize="16"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              🌟
            </motion.text>
          </>
        )}
      </svg>
    </motion.div>
  );
}
