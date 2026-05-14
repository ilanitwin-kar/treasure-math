import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BigButton } from "./BigButton";
import { PirateAvatar } from "./PirateAvatar";
import { useGameStore } from "../store/gameStore";
import type { Grade } from "../types";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];
const GRADE_LABELS: Record<Grade, string> = {
  1: "א'",
  2: "ב'",
  3: "ג'",
  4: "ד'",
  5: "ה'",
  6: "ו'",
};

const GRADE_CHANGE_WARN =
  "שינוי כיתה יאפס את המסע שלך. להמשיך?";

export function ProfileEditModal() {
  const profile = useGameStore((s) => s.profile);
  const open = useGameStore((s) => s.profileEditModalOpen);
  const close = useGameStore((s) => s.closeProfileEditModal);
  const apply = useGameStore((s) => s.applyProfileEdits);

  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(8);
  const [grade, setGrade] = useState<Grade>(1);

  useEffect(() => {
    if (!open || !profile) return;
    setName(profile.name);
    setAge(profile.age);
    setGrade(profile.grade);
  }, [open, profile]);

  if (!open || !profile) return null;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (grade !== profile.grade) {
      if (!window.confirm(GRADE_CHANGE_WARN)) return;
    }
    apply({ name: trimmed, age, grade });
  };

  const handleExit = () => {
    close();
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-4"
      dir="rtl"
      onClick={handleExit}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-4 max-w-md w-full shadow-2xl border-4 border-amber-300 max-h-[90dvh] overflow-y-auto"
      >
        <h2 className="text-lg font-black text-amber-900 mb-3 text-center">הפרופיל שלי</h2>

        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="rounded-full p-1 border-4 border-amber-400 shadow bg-gradient-to-br from-sky-100 to-cyan-200">
            <PirateAvatar id={profile.pirateId} size={72} />
          </div>
        </div>

        <label className="block text-stone-700 font-bold mb-1 text-sm">שם הגיבור</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 rounded-xl border-2 border-amber-200 px-3 py-2 font-bold text-stone-800"
          maxLength={40}
        />

        <label className="block text-stone-700 font-bold mb-1 text-sm">כיתה</label>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              className={`rounded-xl px-3 py-2 text-sm font-black border-2 transition-all ${
                grade === g
                  ? "bg-amber-400 border-amber-600 text-white shadow"
                  : "bg-amber-50 border-amber-200 text-stone-700 hover:bg-amber-100"
              }`}
            >
              {GRADE_LABELS[g]}
            </button>
          ))}
        </div>

        <label className="block text-stone-700 font-bold mb-1 text-sm">גיל</label>
        <input
          type="number"
          min={4}
          max={14}
          value={age}
          onChange={(e) => setAge(Number(e.target.value) || profile.age)}
          className="w-full mb-4 rounded-xl border-2 border-amber-200 px-3 py-2 font-bold text-stone-800"
        />

        <div className="flex flex-col gap-2">
          <BigButton size="md" variant="primary" onClick={handleSave} icon="💾" className="!w-full">
            שמור שינויים
          </BigButton>
          <button
            type="button"
            onClick={handleExit}
            className="w-full py-2.5 rounded-xl font-black text-stone-600 bg-stone-100 border-2 border-stone-300 hover:bg-stone-200 active:scale-[0.99]"
          >
            יציאה בלי לשמור
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
