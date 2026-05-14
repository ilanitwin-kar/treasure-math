import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { CagedParrot } from "./CagedParrot";
import { BigButton } from "./BigButton";
import { applyParrotNTemplate, getParrotByTopic, PEARL_COLOR_CLASSES } from "../data/parrots";
import { topicLabel } from "../data/teacherInsights";
import { useSpeech } from "../hooks/useSpeech";
import { SpeechInlineButton } from "./SpeechInlineButton";
import type { Grade, Island } from "../types";

interface IslandDetailModalProps {
  island: Island;
  /** כיתת הילד — לבחירת younger/older כמו במסך השאלה. */
  playerGrade: Grade;
  /** "current" - האי הנוכחי שאפשר לצאת אליו. "past" - כבר הוצל. "future" - נעול עדיין. */
  status: "current" | "past" | "future";
  /** מספר שאלות שכבר נענו באי הנוכחי (רלוונטי רק ל-current). */
  answeredCount: number;
  onClose: () => void;
  onSail?: () => void; // ל-current בלבד - יוצא לים
}

export function IslandDetailModal({
  island,
  playerGrade,
  status,
  answeredCount,
  onClose,
  onSail,
}: IslandDetailModalProps) {
  const { speakKeyed, stop } = useSpeech();
  const parrot = getParrotByTopic(island.topic);
  const total = island.questionIds.length;
  const remaining = total - answeredCount;

  const modalSpeechSlotKey = useMemo(
    () => `island-${island.id}-${status}-${answeredCount}`,
    [island.id, status, answeredCount]
  );

  const tier = playerGrade <= 2 ? parrot.younger : parrot.older;

  const quoteText = useMemo(() => {
    if (status === "past") {
      return "תודה שהצלת אותי! עכשיו אני בצוות שלך לתמיד";
    }
    if (status === "future") {
      return "אני נעול בכלוב באי הזה... תגיע/י לפה בקרוב, אני סומך עליך!";
    }
    if (answeredCount === 0) {
      return tier.intro[0];
    }
    return applyParrotNTemplate(tier.waitingSpeech[0], remaining);
  }, [status, answeredCount, tier, remaining]);

  useEffect(() => {
    speakKeyed(modalSpeechSlotKey, quoteText, parrot.personality);
    return () => {
      stop();
    };
  }, [quoteText, parrot.personality, speakKeyed, stop, modalSpeechSlotKey]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: "spring", stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-4 max-w-md w-full shadow-2xl border-4 border-amber-300 max-h-[88dvh] overflow-hidden flex flex-col"
      >
        {/* כותרת האי */}
        <div className="flex items-start justify-between mb-2 shrink-0">
          <div className="flex-1">
            <div className="text-4xl mb-1">{island.emoji}</div>
            <h2 className="text-xl font-black text-amber-800 leading-tight">
              {island.title}
            </h2>
            <div className="text-xs text-stone-500 mt-1">
              נושא: {topicLabel(island.topic)} · {total} חידות
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-2xl font-black"
            aria-label="סגור"
          >
            ✕
          </button>
        </div>

        {/* תווית מצב */}
        <div className="mb-2 flex items-center gap-2 shrink-0">
          {status === "past" ? (
            <span className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-sm font-bold">
              ✅ התוכי הוצל!
            </span>
          ) : status === "current" ? (
            <span className="bg-amber-400 text-white rounded-full px-3 py-1 text-sm font-bold">
              📍 אתם כאן עכשיו
            </span>
          ) : (
            <span className="bg-slate-200 text-slate-700 rounded-full px-3 py-1 text-sm font-bold">
              🔒 נעול - תגיעו בקרוב
            </span>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-1">
        {/* תוכי + דיבור */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-2 mb-2 border-2 border-amber-200 shrink-0">
          <div className="flex items-start gap-2">
            <div className="shrink-0">
              <CagedParrot
                topic={island.topic}
                size={64}
                correctSoFar={status === "current" ? answeredCount : 0}
                totalQuestions={total}
                state={status === "past" ? "free" : "caged"}
                showPearl={status === "past"}
              />
            </div>
            <div className="flex-1 min-w-0 relative pr-9">
              <SpeechInlineButton
                slotKey={modalSpeechSlotKey}
                payload={{
                  kind: "single",
                  text: quoteText,
                  personality: parrot.personality,
                }}
                className="absolute top-0 right-0 w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-sm flex items-center justify-center active:scale-95 hover:bg-amber-200 shadow-sm"
                titleIdle="השמע את הדיבור"
              />
              <div className="text-amber-700 font-black text-base mb-0.5">
                {parrot.name}
              </div>
              <div className="text-stone-700 text-sm leading-snug">
                &ldquo;{quoteText}&rdquo;
              </div>
            </div>
          </div>
          <div className="mt-2 bg-white/70 rounded-xl p-2 text-xs">
            <span className="font-bold text-stone-700">⚡ כוח הקסם שלי:</span>
            <span className="text-stone-600"> {parrot.power}</span>
          </div>
        </div>

        {/* מה צריך לעשות */}
        <div className="bg-sky-50 rounded-xl p-2 mb-2 border-2 border-sky-200 shrink-0">
          <div className="font-black text-sky-800 text-xs mb-1 flex items-center gap-1">
            🎯 מה צריך לעשות באי הזה?
          </div>
          <div className="text-xs text-stone-700 leading-snug">
            לפתור{" "}
            <span className="font-black text-sky-700">
              {total} חידות {topicLabel(island.topic)}
            </span>{" "}
            כדי לשבור את המנעול ולשחרר את {parrot.name}.
            {status === "current" && answeredCount > 0 && (
              <div className="mt-2 bg-white rounded-xl p-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-stone-700">התקדמות:</span>
                  <span className="text-stone-600">
                    {answeredCount} / {total}
                  </span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all"
                    style={{ width: `${(answeredCount / total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* מה מקבלים */}
        <div className="bg-emerald-50 rounded-xl p-2 mb-2 border-2 border-emerald-200 shrink-0 min-h-0 overflow-hidden">
          <div className="font-black text-emerald-800 text-xs mb-1 flex items-center gap-1">
            🎁 מה תקבלו אחרי שתשחררו את {parrot.name}?
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 bg-white rounded-xl p-2">
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-br ${
                  PEARL_COLOR_CLASSES[island.topic]
                } border-2 border-white shadow shrink-0`}
              />
              <div className="text-xs text-stone-700 leading-tight">
                <div className="font-black">פנינה {parrot.color}</div>
                <div className="text-stone-500">לחנות + להשלמת המפה</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-2">
              <span className="text-2xl shrink-0">🦜</span>
              <div className="text-xs text-stone-700 leading-tight">
                <div className="font-black">{parrot.name} בצוות שלך</div>
                <div className="text-stone-500">{parrot.power}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-2">
              <span className="text-2xl shrink-0">💎</span>
              <div className="text-xs text-stone-700 leading-tight">
                <div className="font-black">בונוס פנינים</div>
                <div className="text-stone-500">
                  פנינה לכל תשובה + 2 בונוס לתשובה נכונה + 5 בונוס להשלמת האי
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* כפתור פעולה */}
        {status === "current" && onSail && (
          <BigButton size="md" variant="primary" onClick={onSail} icon="⛵" className="!py-2.5">
            {answeredCount === 0 ? `הפלגה ל${parrot.name}!` : "ממשיכים לשחרר!"}
          </BigButton>
        )}
        {status === "past" && (
          <button
            onClick={onClose}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black py-2 rounded-xl text-base shadow"
          >
            סגור
          </button>
        )}
        {status === "future" && (
          <button
            onClick={onClose}
            className="w-full bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black py-2 rounded-xl text-base shadow"
          >
            סגור
          </button>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}
