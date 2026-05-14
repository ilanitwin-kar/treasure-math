import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Parrot } from "../components/Parrot";
import { SpeechBubble } from "../components/SpeechBubble";
import { BigButton } from "../components/BigButton";
import { PirateAvatar } from "../components/PirateAvatar";
import { PIRATES } from "../data/pirates";
import type { PirateGender, PirateId } from "../types";

export function LoginScreen() {
  const navigate = useNavigate();
  const [gender, setGender] = useState<PirateGender>("boy");
  const [selectedPirate, setSelectedPirate] = useState<PirateId | null>(null);

  const handleContinue = () => {
    if (!selectedPirate) return;
    navigate("/profile", { state: { pirateId: selectedPirate } });
  };

  const visiblePirates = PIRATES.filter((p) => p.gender === gender);

  return (
    <div className="min-h-full flex flex-col items-center px-4 py-6 relative">
      {/* קישור נסתר לדף המורה - לחיצה ארוכה על התוכי */}
      <button
        onClick={() => navigate("/teacher")}
        className="absolute top-2 left-2 text-xs opacity-30 hover:opacity-100 px-2 py-1 bg-white/40 rounded-md"
        title="כניסת מורה"
        aria-label="כניסת מורה"
      >
        👩‍🏫
      </button>

      <div className="flex items-center gap-3 mb-4 max-w-md">
        <Parrot size={80} mood="happy" />
        <SpeechBubble pointerSide="right">
          הצוות הפיראטי שלי מחפש חבר חדש!
          <br />
          איזה פיראט אתה רוצה להיות?
        </SpeechBubble>
      </div>

      {/* בחירת מין */}
      <div className="flex gap-2 mb-4 bg-white/60 rounded-2xl p-1.5 shadow">
        <button
          onClick={() => {
            setGender("boy");
            setSelectedPirate(null);
          }}
          className={`px-5 py-2 rounded-xl font-black text-base transition-all ${
            gender === "boy"
              ? "bg-sky-500 text-white shadow-md"
              : "text-sky-700 hover:bg-sky-100"
          }`}
        >
          ⚓ פיראט
        </button>
        <button
          onClick={() => {
            setGender("girl");
            setSelectedPirate(null);
          }}
          className={`px-5 py-2 rounded-xl font-black text-base transition-all ${
            gender === "girl"
              ? "bg-pink-500 text-white shadow-md"
              : "text-pink-700 hover:bg-pink-100"
          }`}
        >
          🌸 פיראטית
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md mb-6">
        {visiblePirates.map((pirate, idx) => {
          const isSelected = selectedPirate === pirate.id;
          return (
            <motion.button
              key={pirate.id}
              onClick={() => setSelectedPirate(pirate.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, type: "spring" }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className={`
                aspect-square rounded-3xl flex flex-col items-center justify-center
                border-4 shadow-md p-2 bg-gradient-to-br
                ${pirate.gender === "boy"
                  ? "from-sky-100 to-cyan-200"
                  : "from-pink-100 to-rose-200"}
                ${isSelected
                  ? "border-amber-500 ring-4 ring-amber-300 shadow-xl"
                  : "border-white/60"}
              `}
            >
              <div className="flex-1 flex items-center justify-center">
                <PirateAvatar id={pirate.id} size={68} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-stone-700 mt-1 leading-tight text-center">
                {pirate.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <BigButton
        size="lg"
        variant="primary"
        onClick={handleContinue}
        disabled={!selectedPirate}
        icon="⛵"
      >
        עולים על הספינה!
      </BigButton>
    </div>
  );
}
