import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Parrot } from "../components/Parrot";
import { SpeechBubble } from "../components/SpeechBubble";
import { BigButton } from "../components/BigButton";
import { PirateAvatar } from "../components/PirateAvatar";
import { useGameStore } from "../store/gameStore";
import { getPirateById } from "../data/pirates";
import { hasSeenIntro } from "../storage/storage";
import { useSpeech } from "../hooks/useSpeech";
import type { Grade, PirateId, StudentProfile } from "../types";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

const GRADE_LABELS: Record<Grade, string> = {
  1: "א'",
  2: "ב'",
  3: "ג'",
  4: "ד'",
  5: "ה'",
  6: "ו'",
};

export function ProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const setProfile = useGameStore((s) => s.setProfile);
  const startNewSession = useGameStore((s) => s.startNewSession);

  const pirateId = (location.state as { pirateId?: PirateId } | null)?.pirateId;
  const pirate = pirateId ? getPirateById(pirateId) : undefined;

  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [age, setAge] = useState<number | null>(null);

  const { speakKeyed, stop } = useSpeech();

  const PROFILE_GUIDE_SPEECH = "ספר לי על עצמך, פיראט! איך קוראים לך?";

  useEffect(() => {
    if (!pirateId) return;
    speakKeyed("profile", PROFILE_GUIDE_SPEECH, "guide");
    return () => {
      stop();
    };
  }, [pirateId, speakKeyed, stop]);

  const canContinue = name.trim().length > 0 && grade !== null && age !== null;

  const handleStart = () => {
    if (!canContinue || !pirateId) return;
    const profile: StudentProfile = {
      id: `student_${Date.now()}`,
      name: name.trim(),
      grade: grade!,
      age: age!,
      pirateId,
      createdAt: Date.now(),
    };
    setProfile(profile);
    startNewSession();
    // אם זו הפעם הראשונה במכשיר - מציגים את הסיפור עם הפיראט שלו.
    if (!hasSeenIntro()) {
      navigate("/intro", { state: { returnTo: "/map" } });
    } else {
      navigate("/map");
    }
  };

  if (!pirateId) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="h-full min-h-0 overflow-hidden flex flex-col items-center px-3 py-2">
      <div className="flex items-center gap-2 mb-2 shrink-0 max-w-md">
        <Parrot size={56} mood="happy" />
        <SpeechBubble
          pointerSide="right"
          innerTextClassName="text-xs sm:text-sm"
          speechReplay={{
            slotKey: "profile",
            kind: "single",
            text: PROFILE_GUIDE_SPEECH,
            personality: "guide",
          }}
        >
          ספר לי על עצמך, פיראט!
          <br />
          איך קוראים לך?
        </SpeechBubble>
      </div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 rounded-2xl p-3 w-full max-w-md shadow-xl border-2 border-amber-200 flex-1 min-h-0 overflow-hidden flex flex-col gap-2"
      >
        {/* תצוגת פיראט נבחר */}
        {pirate && (
          <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 -mt-0.5">
            <div
              className={`rounded-full p-1 border-2 border-amber-300 shadow bg-gradient-to-br ${
                pirate.gender === "boy"
                  ? "from-sky-100 to-cyan-200"
                  : "from-pink-100 to-rose-200"
              }`}
            >
              <PirateAvatar id={pirate.id} size={56} />
            </div>
            <span className="text-stone-700 font-bold text-sm">{pirate.name}</span>
          </div>
        )}

        {/* שם */}
        <div className="shrink-0">
          <label className="block text-stone-700 font-bold mb-1 text-sm">השם שלי:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="הקלד את השם שלך"
            className="w-full text-lg text-center bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2 focus:border-amber-400 focus:outline-none font-bold text-stone-800"
            maxLength={20}
            autoFocus
          />
        </div>

        {/* כיתה */}
        <div className="shrink-0">
          <label className="block text-stone-700 font-bold mb-1 text-sm">אני בכיתה:</label>
          <div className="grid grid-cols-6 gap-1">
            {GRADES.map((g) => (
              <motion.button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                whileTap={{ scale: 0.9 }}
                className={`
                  aspect-square rounded-lg border-2 font-black text-lg
                  ${grade === g
                    ? "bg-amber-400 border-amber-600 text-white shadow-md"
                    : "bg-white border-amber-200 text-amber-700"}
                `}
              >
                {GRADE_LABELS[g]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* גיל */}
        <div className="shrink-0 min-h-0">
          <label className="block text-stone-700 font-bold mb-1 text-sm">הגיל שלי:</label>
          <div className="grid grid-cols-7 gap-1">
            {[6, 7, 8, 9, 10, 11, 12].map((a) => (
              <motion.button
                key={a}
                type="button"
                onClick={() => setAge(a)}
                whileTap={{ scale: 0.9 }}
                className={`
                  aspect-square rounded-lg border-2 font-black text-base
                  ${age === a
                    ? "bg-sky-400 border-sky-600 text-white shadow-md"
                    : "bg-white border-sky-200 text-sky-700"}
                `}
              >
                {a}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-2 shrink-0 w-full max-w-md px-1">
        <BigButton
          size="md"
          variant="primary"
          onClick={handleStart}
          disabled={!canContinue}
          icon="🗺️"
          className="!w-full !py-3"
        >
          להתחיל מסע!
        </BigButton>
      </div>
    </div>
  );
}
