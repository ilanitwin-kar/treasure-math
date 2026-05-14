import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Parrot } from "../components/Parrot";
import { SpeechBubble } from "../components/SpeechBubble";
import { BigButton } from "../components/BigButton";
import { ProfileHeaderButton } from "../components/ProfileHeaderButton";
import { useGameStore } from "../store/gameStore";

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

  return (
    <div className="min-h-[100dvh] min-h-0 w-full overflow-x-hidden overflow-y-auto flex flex-col items-center justify-between px-4 py-4 relative" dir="rtl">
      {profile ? (
        <div className="absolute top-2 end-2 z-20 max-w-[min(100%,14rem)]">
          <ProfileHeaderButton className="w-full" />
        </div>
      ) : null}
      {/* כניסת מורה — פינה נגדית לפרופיל (ב-RTL end=שמאל, start=ימין) כדי שלא יכסה את הכפתור */}
      <button
        type="button"
        onClick={() => navigate("/teacher")}
        className="absolute top-2 start-2 text-[10px] opacity-35 hover:opacity-100 px-1.5 py-0.5 bg-white/50 rounded-md z-[35] shadow-sm"
        title="כניסת מורה"
        aria-label="כניסת מורה"
      >
        👩‍🏫
      </button>
      {/* רקע - שמים, שמש, ענן */}
      <div className="absolute top-6 left-6 w-14 h-14 bg-yellow-300 rounded-full opacity-70 blur-sm pointer-events-none" />
      <motion.div
        className="absolute top-8 right-8 text-4xl opacity-80 pointer-events-none"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute top-20 right-16 text-2xl opacity-70 pointer-events-none"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-md overflow-x-hidden overflow-y-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-black text-amber-700 mb-1 drop-shadow-lg text-center shrink-0"
          style={{ textShadow: "3px 3px 0 rgba(255,255,255,0.8)" }}
        >
          מסע האוצר
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-amber-800 mb-3 text-center shrink-0"
        >
          הרפתקה של מספרים וחידות
        </motion.p>

        <div className="flex items-center gap-2 mb-4 max-w-md shrink-0">
          <Parrot size={88} mood="happy" />
          <SpeechBubble pointerSide="right" innerTextClassName="text-sm sm:text-base">
            {profile ? (
              <>
                שלום {profile.name}!<br />
                מוכן/ה להמשיך?
              </>
            ) : (
              <>
                אהוי! אני קפטן תוכי.<br />
                בוא נצא למסע!
              </>
            )}
          </SpeechBubble>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs shrink-0 z-[1]">
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
