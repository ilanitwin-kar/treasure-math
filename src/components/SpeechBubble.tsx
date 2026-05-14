import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SpeechReplayConfig } from "../hooks/useSpeech";
import { SpeechInlineButton } from "./SpeechInlineButton";

interface SpeechBubbleProps {
  children: ReactNode;
  className?: string;
  /** מחליף את ברירת המחדל לגודל הטקסט הפנימי (למשל במסכים צפופים). */
  innerTextClassName?: string;
  pointerSide?: "right" | "left" | "bottom" | "none";
  /** כפתור 🔊 / ⏸️ / ▶️ ליד הבועה */
  speechReplay?: SpeechReplayConfig;
}

export function SpeechBubble({
  children,
  className = "",
  innerTextClassName = "text-lg md:text-xl",
  pointerSide = "right",
  speechReplay,
}: SpeechBubbleProps) {
  const payload =
    speechReplay?.kind === "sequential"
      ? { kind: "sequential" as const, parts: speechReplay.parts }
      : speechReplay?.kind === "single"
        ? {
            kind: "single" as const,
            text: speechReplay.text,
            personality: speechReplay.personality,
          }
        : null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative bg-white rounded-3xl px-6 py-4 shadow-lg border-4 border-amber-200 ${className}`}
    >
      {speechReplay && payload && (
        <SpeechInlineButton
          slotKey={speechReplay.slotKey}
          payload={payload}
          className="absolute top-1 left-1 z-[1] w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-sm flex items-center justify-center active:scale-95 hover:bg-amber-200 shadow-sm"
        />
      )}
      <div
        className={`text-stone-800 font-bold text-center leading-snug line-clamp-5 ${innerTextClassName} ${
          speechReplay ? "pt-6" : ""
        }`}
      >
        {children}
      </div>

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
