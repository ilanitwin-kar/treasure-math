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
    <div className="min-h-[100dvh] min-h-0 w-full overflow-x-hidden overflow-y-auto flex flex-col items-center px-3 py-2 relative">
      <button
        onClick={() => navigate("/teacher")}
        className="absolute top-1 left-1 text-[10px] opacity-30 hover:opacity-100 px-1.5 py-0.5 bg-white/40 rounded-md z-10"
        title="כניסת מורה"
        aria-label="כניסת מורה"
      >
        👩‍🏫
      </button>

      <div className="flex items-center gap-2 mb-2 shrink-0 max-w-md">
        <Parrot size={64} mood="happy" />
        <SpeechBubble pointerSide="right" innerTextClassName="text-xs sm:text-sm">
          הצוות הפיראטי שלי מחפש חבר חדש!
          <br />
          איזה פיראט אתה רוצה להיות?
        </SpeechBubble>
      </div>

      <div className="flex gap-1.5 mb-2 shrink-0 bg-white/60 rounded-2xl p-1 shadow">
        <button
          onClick={() => {
            setGender("boy");
            setSelectedPirate(null);
          }}
          className={`px-4 py-1.5 rounded-xl font-black text-sm transition-all ${
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
          className={`px-4 py-1.5 rounded-xl font-black text-sm transition-all ${
            gender === "girl"
              ? "bg-pink-500 text-white shadow-md"
              : "text-pink-700 hover:bg-pink-100"
          }`}
        >
          🌸 פיראטית
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-md mb-2 flex-1 min-h-0 content-center">
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
                aspect-square rounded-2xl flex flex-col items-center justify-center
                border-2 shadow-md p-1 bg-gradient-to-br
                ${pirate.gender === "boy"
                  ? "from-sky-100 to-cyan-200"
                  : "from-pink-100 to-rose-200"}
                ${isSelected
                  ? "border-amber-500 ring-4 ring-amber-300 shadow-xl"
                  : "border-white/60"}
              `}
            >
              <div className="flex-1 flex items-center justify-center">
                <PirateAvatar id={pirate.id} size={52} />
              </div>
              <span className="text-[10px] font-bold text-stone-700 mt-0.5 leading-tight text-center line-clamp-2">
                {pirate.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="shrink-0 w-full max-w-md px-1">
        <BigButton
          size="lg"
          variant="primary"
          onClick={handleContinue}
          disabled={!selectedPirate}
          icon="⛵"
          className="!w-full !py-3"
        >
          עולים על הספינה!
        </BigButton>
      </div>
    </div>
  );
}
