import { motion } from "framer-motion";

interface CountingVisualProps {
  emoji: string;
  count: number;
}

/**
 * מציג N אובייקטים שהילד יספור.
 * מסדר אותם בגריד נחמד עם אנימציה של "הופעה".
 */
export function CountingVisual({ emoji, count }: CountingVisualProps) {
  // מחשב מספר עמודות לפי כמות
  const cols = count <= 4 ? count : count <= 9 ? Math.ceil(Math.sqrt(count)) : 4;

  return (
    <div
      className="grid gap-2 sm:gap-3 p-4 bg-sky-50 rounded-2xl border-4 border-sky-200"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        maxWidth: `${cols * 60 + 40}px`,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            delay: i * 0.08,
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
          className="text-4xl sm:text-5xl text-center select-none"
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
