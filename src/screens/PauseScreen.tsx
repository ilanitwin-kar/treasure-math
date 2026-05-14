import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Parrot } from "../components/Parrot";
import { SpeechBubble } from "../components/SpeechBubble";
import { BigButton } from "../components/BigButton";
import { useSpeech } from "../hooks/useSpeech";

const PAUSE_GUIDE_SPEECH = "התוכי נח על הדקל. כשאתה מוכן - נחזור לאוצר!";

export function PauseScreen() {
  const navigate = useNavigate();
  const { speakKeyed, stop } = useSpeech();

  useEffect(() => {
    speakKeyed("pause", PAUSE_GUIDE_SPEECH, "guide");
    return () => {
      stop();
    };
  }, [speakKeyed, stop]);

  return (
    <div className="h-full min-h-0 overflow-hidden flex flex-col items-center justify-center px-4 py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-md"
      >
        <h2 className="text-2xl font-black text-amber-700 mb-1" style={{ textShadow: "2px 2px 0 white" }}>
          האי של ההפסקה
        </h2>
        <p className="text-stone-600 mb-3 text-sm">קח את הזמן שאתה צריך 🌴</p>

        <div className="relative w-full flex justify-center mb-4 shrink-0">
          <div className="text-6xl">🌴</div>
          <div className="absolute top-4 right-6">
            <Parrot size={88} mood="sleeping" />
          </div>
        </div>

        <SpeechBubble
          pointerSide="none"
          className="mb-4 px-4 py-3"
          innerTextClassName="text-sm"
          speechReplay={{
            slotKey: "pause",
            kind: "single",
            text: PAUSE_GUIDE_SPEECH,
            personality: "guide",
          }}
        >
          התוכי נח על הדקל
          <br />
          כשאתה מוכן - נחזור לאוצר!
        </SpeechBubble>

        <div className="flex flex-col gap-3 items-center">
          <BigButton
            size="lg"
            variant="primary"
            onClick={() => navigate(-1)}
            icon="⛵"
          >
            ממשיכים במסע
          </BigButton>
          <BigButton
            size="sm"
            variant="ghost"
            onClick={() => navigate("/")}
            icon="🏠"
          >
            לצאת לרגע (יישמר!)
          </BigButton>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
            fill="#06b6d4"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
