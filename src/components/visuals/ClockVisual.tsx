import { motion } from "framer-motion";

interface ClockVisualProps {
  hour: number; // 1-12
  size?: number;
}

export function ClockVisual({ hour, size = 200 }: ClockVisualProps) {
  const hourAngle = (hour % 12) * 30 - 90; // 30° לכל שעה, ב-12 העליון
  const minuteAngle = -90; // תמיד על 12

  return (
    <motion.div
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* מסגרת חיצונית של השעון */}
        <circle cx="100" cy="100" r="95" fill="#fef3c7" stroke="#d97706" strokeWidth="6" />
        <circle cx="100" cy="100" r="88" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />

        {/* מספרי השעות */}
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
          const angle = (n * 30 - 90) * (Math.PI / 180);
          const x = 100 + Math.cos(angle) * 70;
          const y = 100 + Math.sin(angle) * 70;
          return (
            <text
              key={n}
              x={x}
              y={y + 7}
              textAnchor="middle"
              fontSize="20"
              fontWeight="900"
              fill="#92400e"
              fontFamily="Varela Round, sans-serif"
            >
              {n}
            </text>
          );
        })}

        {/* שנתות דקות */}
        {Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = 100 + Math.cos(angle) * 84;
          const y1 = 100 + Math.sin(angle) * 84;
          const x2 = 100 + Math.cos(angle) * 88;
          const y2 = 100 + Math.sin(angle) * 88;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a16207" strokeWidth="1" />;
        })}

        {/* שנתות שעות גדולות */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + Math.cos(angle) * 80;
          const y1 = 100 + Math.sin(angle) * 80;
          const x2 = 100 + Math.cos(angle) * 88;
          const y2 = 100 + Math.sin(angle) * 88;
          return (
            <line
              key={`big-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#92400e"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}

        {/* מחוג דקות (ארוך) */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="100"
          stroke="#1f2937"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            transformOrigin: "100px 100px",
            transform: `rotate(${minuteAngle + 90}deg)`,
          }}
        />
        <line
          x1="100"
          y1="100"
          x2={100 + Math.cos(minuteAngle * (Math.PI / 180)) * 60}
          y2={100 + Math.sin(minuteAngle * (Math.PI / 180)) * 60}
          stroke="#1f2937"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* מחוג שעות (קצר ועבה) */}
        <line
          x1="100"
          y1="100"
          x2={100 + Math.cos(hourAngle * (Math.PI / 180)) * 42}
          y2={100 + Math.sin(hourAngle * (Math.PI / 180)) * 42}
          stroke="#dc2626"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* נקודת מרכז */}
        <circle cx="100" cy="100" r="6" fill="#1f2937" />
        <circle cx="100" cy="100" r="3" fill="#fbbf24" />
      </svg>
    </motion.div>
  );
}
