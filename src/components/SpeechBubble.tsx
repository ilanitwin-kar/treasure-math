import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SpeechBubbleProps {
  children: ReactNode;
  className?: string;
  pointerSide?: "right" | "left" | "bottom" | "none";
}

export function SpeechBubble({ children, className = "", pointerSide = "right" }: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative bg-white rounded-3xl px-6 py-4 shadow-lg border-4 border-amber-200 ${className}`}
    >
      <div className="text-lg md:text-xl text-stone-800 font-bold text-center">{children}</div>

      {pointerSide === "right" && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-amber-200" />
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[14px] border-r-white absolute top-0.5 right-1" />
        </div>
      )}

      {pointerSide === "left" && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-amber-200" />
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[14px] border-l-white absolute top-0.5 left-1" />
        </div>
      )}

      {pointerSide === "bottom" && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-amber-200" />
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-white absolute -top-4 left-0.5" />
        </div>
      )}
    </motion.div>
  );
}
