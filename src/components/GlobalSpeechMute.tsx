import { useLocation } from "react-router-dom";
import { useSpeech } from "../hooks/useSpeech";

/**
 * כפתור השתקה גלובלי — קבוע בפינה, מסנכרן ל־localStorage.
 * במפת האוצר לא מציגים (אין שם TTS ומפריע מעל המפה).
 */
export function GlobalSpeechMute() {
  const { pathname } = useLocation();
  const { isMuted, toggleMute } = useSpeech();
  if (pathname === "/map") return null;
  return (
    <button
      type="button"
      onClick={toggleMute}
      className="fixed top-2 right-2 z-[200] w-10 h-10 rounded-full bg-white/95 border-2 border-amber-300 shadow-lg text-lg flex items-center justify-center active:scale-95 hover:bg-amber-50"
      title={isMuted ? "הפעל קול" : "השתק קול"}
      aria-label={isMuted ? "הפעל קול" : "השתק קול"}
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}
