import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Parrot } from "../components/Parrot";
import { SpeechBubble } from "../components/SpeechBubble";
import { BigButton } from "../components/BigButton";
import { useGameStore } from "../store/gameStore";
import { hasSeenIntro } from "../storage/storage";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const profile = useGameStore((s) => s.profile);
  const session = useGameStore((s) => s.session);

  const hasSavedGame = profile && session && !session.completedAt;

  /**
   * מעבר לכניסה - תמיד מתחילים בבחירת פיראט (לא בסיפור).
   * הסיפור יוצג אחרי שהילד בחר את הדמות, ב-ProfileScreen אחרי שמילא פרטים.
   */
  const goToLogin = () => {
    navigate("/login");
  };

  // השארת המשתנה לשימוש עתידי (לעדכון הלוגיקה)
  void hasSeenIntro;

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 relative">
      {/* קישור נסתר לדף המורה - פינה שמאל למעלה */}
      <button
        onClick={() => navigate("/teacher")}
        className="absolute top-2 left-2 text-xs opacity-30 hover:opacity-100 px-2 py-1 bg-white/40 rounded-md z-10"
        title="כניסת מורה"
        aria-label="כניסת מורה"
      >
        👩‍🏫
      </button>
      {/* רקע - שמים, שמש, ענן */}
      <div className="absolute top-8 left-8 w-20 h-20 bg-yellow-300 rounded-full opacity-70 blur-sm" />
      <motion.div
        className="absolute top-12 right-12 text-6xl opacity-80"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute top-32 right-32 text-4xl opacity-70"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>

      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-6xl font-black text-amber-700 mb-2 drop-shadow-lg text-center"
        style={{ textShadow: "3px 3px 0 rgba(255,255,255,0.8)" }}
      >
        מסע האוצר
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-amber-800 mb-8 text-center"
      >
        הרפתקה של מספרים וחידות
      </motion.p>

      <div className="flex items-center gap-4 mb-10 max-w-md">
        <Parrot size={130} mood="happy" />
        <SpeechBubble pointerSide="right">
          {profile ? (
            <>שלום {profile.name}!<br />מוכן/ה להמשיך?</>
          ) : (
            <>אהוי! אני קפטן תוכי.<br />בוא נצא למסע!</>
          )}
        </SpeechBubble>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {hasSavedGame ? (
          <>
            <BigButton size="lg" variant="primary" onClick={() => navigate("/map")} icon="⛵">
              להמשיך את המסע
            </BigButton>
            <BigButton size="sm" variant="ghost" onClick={goToLogin}>
              לא אני - להחליף שחקן
            </BigButton>
          </>
        ) : profile ? (
          <>
            <BigButton size="lg" variant="primary" onClick={() => navigate("/map")} icon="🗺️">
              להתחיל מסע חדש
            </BigButton>
            <BigButton size="sm" variant="ghost" onClick={goToLogin}>
              לא אני - להחליף שחקן
            </BigButton>
          </>
        ) : (
          <BigButton size="lg" variant="primary" onClick={goToLogin} icon="🚀">
            בוא נתחיל!
          </BigButton>
        )}
      </div>

      {/* גלים בתחתית */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
            fill="#06b6d4"
            opacity="0.6"
          />
          <path
            d="M0,80 C200,100 400,60 600,80 C800,100 1000,60 1200,80 L1200,120 L0,120 Z"
            fill="#0891b2"
            opacity="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
