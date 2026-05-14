interface CaptainYamZahavProps {
  size?: number;
}

/**
 * קפטן ים-זהב - הקריין של הסיפור והדמות הראשית במשחק.
 * זקן חכם, זקן לבן ארוך, כובע פיראטים מפואר, עיניים חכמות.
 */
export function CaptainYamZahav({ size = 120 }: CaptainYamZahavProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={size * (140 / 120)}
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      {/* גוף - מעיל אדום מפואר */}
      <path
        d="M 30 100 Q 30 80 45 75 L 75 75 Q 90 80 90 100 L 90 138 L 30 138 Z"
        fill="#991b1b"
      />
      {/* פסי זהב על המעיל */}
      <rect x="58" y="80" width="4" height="58" fill="#fbbf24" />
      <circle cx="60" cy="90" r="2.5" fill="#fbbf24" />
      <circle cx="60" cy="105" r="2.5" fill="#fbbf24" />
      <circle cx="60" cy="120" r="2.5" fill="#fbbf24" />
      <circle cx="60" cy="135" r="2.5" fill="#fbbf24" />

      {/* צווארון לבן */}
      <path
        d="M 45 75 L 60 88 L 75 75 L 75 80 L 60 92 L 45 80 Z"
        fill="white"
      />

      {/* פנים */}
      <ellipse cx="60" cy="55" rx="20" ry="22" fill="#fbcdaa" />

      {/* אוזניים */}
      <ellipse cx="40" cy="58" rx="3" ry="4" fill="#fbcdaa" />
      <ellipse cx="80" cy="58" rx="3" ry="4" fill="#fbcdaa" />

      {/* עגיל זהב */}
      <circle cx="80" cy="63" r="2" fill="#fbbf24" stroke="#92400e" strokeWidth="0.4" />

      {/* שיער לבן בצדדים */}
      <path
        d="M 40 45 Q 38 60 42 70"
        stroke="#e5e7eb"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 80 45 Q 82 60 78 70"
        stroke="#e5e7eb"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* כובע פיראטים גדול */}
      <path
        d="M 30 40 Q 30 30 60 25 Q 90 30 90 40 L 95 45 L 85 50 L 60 38 L 35 50 L 25 45 Z"
        fill="#1f2937"
      />
      {/* קצה הכובע - חלק עליון */}
      <path
        d="M 30 40 Q 30 28 60 20 Q 90 28 90 40 Z"
        fill="#1f2937"
      />
      {/* סמל גולגולת ועצמות */}
      <circle cx="60" cy="32" r="4" fill="white" />
      <circle cx="58.5" cy="31" r="0.8" fill="#1f2937" />
      <circle cx="61.5" cy="31" r="0.8" fill="#1f2937" />
      <rect x="55" y="36" width="10" height="1.8" fill="white" transform="rotate(45, 60, 36.9)" />
      <rect x="55" y="36" width="10" height="1.8" fill="white" transform="rotate(-45, 60, 36.9)" />
      {/* קישוט זהב על הכובע */}
      <rect x="30" y="40" width="60" height="2" fill="#fbbf24" />

      {/* עיניים - חכמות, מקומטות מנסיון */}
      <ellipse cx="51" cy="54" rx="2.5" ry="2.8" fill="white" />
      <ellipse cx="69" cy="54" rx="2.5" ry="2.8" fill="white" />
      <circle cx="51" cy="55" r="1.5" fill="#1e3a8a" />
      <circle cx="69" cy="55" r="1.5" fill="#1e3a8a" />
      <circle cx="51.5" cy="54.5" r="0.5" fill="white" />
      <circle cx="69.5" cy="54.5" r="0.5" fill="white" />

      {/* גבות לבנות עבות */}
      <path d="M 47 49 Q 51 47 55 49" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 65 49 Q 69 47 73 49" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* קמטים סביב העיניים */}
      <path d="M 45 56 L 47 57" stroke="#92400e" strokeWidth="0.4" opacity="0.5" />
      <path d="M 73 56 L 75 57" stroke="#92400e" strokeWidth="0.4" opacity="0.5" />

      {/* אף */}
      <path
        d="M 60 58 Q 58 63 58 67 Q 60 69 62 67 Q 62 63 60 58"
        fill="#e9b88d"
      />

      {/* זקן לבן ארוך ומעוצב */}
      <path
        d="M 47 68 Q 50 75 52 80 Q 53 90 55 95 Q 58 100 60 102 Q 62 100 65 95 Q 67 90 68 80 Q 70 75 73 68 Q 70 72 60 73 Q 50 72 47 68"
        fill="white"
      />
      {/* פסי הזקן */}
      <path d="M 55 78 Q 56 88 58 95" stroke="#d1d5db" strokeWidth="0.5" fill="none" />
      <path d="M 65 78 Q 64 88 62 95" stroke="#d1d5db" strokeWidth="0.5" fill="none" />

      {/* שפם */}
      <path
        d="M 50 67 Q 55 70 60 68 Q 65 70 70 67"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* פה (קצת מסתתר בזקן) */}
      <path
        d="M 56 72 Q 60 74 64 72"
        stroke="#7c2d12"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
