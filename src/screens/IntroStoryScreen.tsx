import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BigButton } from "../components/BigButton";
import { CaptainYamZahav } from "../components/CaptainYamZahav";
import { PirateAvatar } from "../components/PirateAvatar";
import { markIntroSeen } from "../storage/storage";
import { useGameStore } from "../store/gameStore";
import { getPirateById } from "../data/pirates";
import { stripForSpeech, useSpeech } from "../hooks/useSpeech";
import { SpeechInlineButton } from "../components/SpeechInlineButton";

interface Scene {
  bgGradient: string;
  bigEmoji: string;
  title: string;
  /** טקסט הקריינות של קפטן ים-זהב - בלוקים נפרדים. */
  narration: string[];
  floatingEmojis: string[];
  /** האם להציג את הפיראט שנבחר בסצנה הזו. */
  showPirate?: boolean;
  /** האם להציג את הקפטן עצמו. */
  showCaptain?: boolean;
  textOnDark?: boolean;
}

/**
 * הסצנות בסיפור - מסופרות בקול הראשון של קפטן ים-זהב.
 */
function buildScenes(playerName: string): Scene[] {
  return [
    {
      bgGradient: "from-amber-200 via-orange-200 to-rose-200",
      bigEmoji: "📜",
      title: "הסיפור שלי",
      narration: [
        `אהוי, ${playerName}! שמי קפטן ים-זהב,`,
        "פיראט זקן שזרק עוגן בכל ימי העולם.",
        "🏴‍☠️ בידיי הייתה המפה הכי סודית - 🏴‍☠️",
        "מפה לאוצר נדיר שאף אחד עוד לא מצא.",
        "על המפה שמרו 10 חברי-לב נאמנים -",
        "תוכים-פיראטים חכמים, שלכל אחד היה כוח קסם משלו.",
      ],
      floatingEmojis: ["🗺️", "⛵", "🦜", "💎"],
      showCaptain: true,
    },
    {
      bgGradient: "from-slate-700 via-purple-900 to-slate-900",
      bigEmoji: "⚡",
      title: "האסון",
      narration: [
        "אבל יום אחד...",
        "💀 הופיע פיראט רע ומרושע, 💀",
        "וגנב ממני את כל מה שהיה לי יקר.",
        "✂️ הוא חתך את המפה ל-10 חתיכות, ✂️",
        "🔒 חטף את כל תוכי-החברים שלי, 🔒",
        "🏝️ והחביא כל אחד באי אחר, כלוא בכלוב.",
        "גם הפנינים הקסומות של התוכים -",
        "נשארו בידיהם, שמורות.",
      ],
      floatingEmojis: ["⛈️", "🔒", "💀", "⚡"],
      showCaptain: true,
      textOnDark: true,
    },
    {
      bgGradient: "from-cyan-200 via-blue-200 to-indigo-200",
      bigEmoji: "🗝️",
      title: "סוד הכלובים",
      narration: [
        "אבל יש סוד אחד שלפיראט הרע לא היה...",
        "🧠 רק מי שפותר את החידה של כל אי - 🧠",
        "יכול לשבור את הסורגים של הכלוב!",
        "כל תוכי שתשחרר -",
        "🦜 יצטרף לצוות שלך,",
        "💎 ייתן לך את הפנינה הקסומה שלו,",
        "🗺️ ויחזיר חתיכה אחת מהמפה.",
      ],
      floatingEmojis: ["🔑", "✨", "💫", "🗝️"],
      showCaptain: true,
    },
    {
      bgGradient: "from-violet-200 via-purple-200 to-fuchsia-200",
      bigEmoji: "🦜",
      title: "רגע, רגע...",
      narration: [
        "מישהו שואל בחשאי: איך אותו תוכי נחטף שוב ושוב? חחח.",
        "התשובה הפיראטית: בכל כיתה פיראט הרע מניח ארגז 'מתנה+חידות' חדש — והתוכים שלנו... טוב, הם חכמים במתמטיקה וקצת פחות בזהירות.",
        "אז כן: עשרה חברים אמיתיים, הרבה איים, הרבה כלובים. זה ים, לא טלוויזיה דוקומנטרית.",
      ],
      floatingEmojis: ["🦜", "😅", "🌊", "📦"],
      showCaptain: true,
    },
    {
      bgGradient: "from-emerald-200 via-teal-200 to-cyan-200",
      bigEmoji: "⚓",
      title: `אתה, ${playerName}!`,
      narration: [
        `בחרתי בך, ${playerName}!`,
        "אתה הפיראט/ית הצעיר/ה שיציל את חבריי.",
        "המשימה שלך:",
        "🏝️ להפליג אל כל האיים,",
        "🦜 להציל את התוכים החטופים,",
        "💎 לאסוף את כל 10 הפנינים,",
        "🗺️ להשלים את המפה,",
        "👑 ולגלות את האוצר הגדול!",
      ],
      floatingEmojis: ["⚓", "⛵", "🏝️", "🌊"],
      showPirate: true,
    },
    {
      bgGradient: "from-amber-100 via-yellow-200 to-orange-200",
      bigEmoji: "🎁",
      title: "מה תקבל/י",
      narration: [
        "בכל אי שתסיים -",
        "תיבת מתנה קטנה תיפתח עבורך!",
        "🏪 את הפנינים שלך תוכל/י להחליף בחנות הפיראטים -",
        "בכובעים, ספינות, חיות מחמד וקישוטים!",
        "ובסוף המסע הגדול - תיבת האוצר תיפתח",
        `⭐ עם תעודת אלוף המסע, בשם ${playerName}! ⭐`,
        "",
        "מוכן/ה לעלות על הספינה?",
      ],
      floatingEmojis: ["🎁", "💎", "🏆", "⭐"],
      showPirate: true,
      showCaptain: true,
    },
  ];
}

export function IntroStoryScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useGameStore((s) => s.profile);
  const [sceneIndex, setSceneIndex] = useState(0);

  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? "/login";
  const playerName = profile?.name ?? "פיראט";
  const pirate = profile?.pirateId ? getPirateById(profile.pirateId) : null;

  const scenes = buildScenes(playerName);
  const scene = scenes[sceneIndex];
  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === scenes.length - 1;

  const { speakKeyed, stop } = useSpeech();

  const introSlotKey = useMemo(() => `intro-${sceneIndex}`, [sceneIndex]);

  const captainSceneSpeech = useMemo(() => {
    return scene.narration
      .filter((l) => l.trim().length > 0)
      .map((l) => stripForSpeech(l))
      .filter((l) => l.length > 0)
      .join(". ");
  }, [scene]);

  useEffect(() => {
    if (!captainSceneSpeech) return;
    speakKeyed(introSlotKey, captainSceneSpeech, "captain");
    return () => {
      stop();
    };
  }, [sceneIndex, introSlotKey, captainSceneSpeech, speakKeyed, stop]);

  const handleNext = () => {
    if (isLast) {
      stop();
      markIntroSeen();
      navigate(returnTo);
    } else {
      setSceneIndex(sceneIndex + 1);
    }
  };

  const handleSkip = () => {
    stop();
    markIntroSeen();
    navigate(returnTo);
  };

  return (
    <div
      className={`h-full min-h-0 overflow-hidden flex flex-col px-2 py-2 bg-gradient-to-b ${scene.bgGradient} relative transition-colors`}
    >
      {/* אמוג'ים צפים ברקע */}
      {scene.floatingEmojis.map((emoji, i) => (
        <motion.div
          key={`${sceneIndex}-${i}`}
          className="absolute text-3xl opacity-30 pointer-events-none"
          initial={{
            x: `${10 + i * 20}vw`,
            y: `${15 + i * 18}vh`,
            scale: 0,
          }}
          animate={{
            x: [`${10 + i * 20}vw`, `${20 + i * 20}vw`, `${10 + i * 20}vw`],
            y: [`${15 + i * 18}vh`, `${25 + i * 18}vh`, `${15 + i * 18}vh`],
            scale: 1,
            rotate: [0, 15, -15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 0.5 }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* כפתור דלג */}
      <div className="flex justify-between items-center shrink-0 mb-2">
        <div className="bg-white/80 rounded-full px-3 py-1 shadow text-xs font-bold text-stone-700">
          סצנה {sceneIndex + 1} / {scenes.length}
        </div>
        <button
          onClick={handleSkip}
          className="bg-white/80 rounded-full px-3 py-1 shadow text-xs font-bold text-stone-700 active:scale-95"
        >
          דלג ⏭
        </button>
      </div>

      {/* תוכן הסצנה */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center justify-center text-center min-h-0 overflow-hidden py-1"
        >
          {/* אמוג'י גדול */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
            className="text-4xl mb-0.5 drop-shadow-lg shrink-0"
          >
            {scene.bigEmoji}
          </motion.div>

          {/* כותרת */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xl sm:text-2xl font-black mb-1 shrink-0 ${
              scene.textOnDark ? "text-white" : "text-stone-800"
            }`}
            style={{
              textShadow: scene.textOnDark
                ? "2px 2px 0 rgba(0,0,0,0.5)"
                : "2px 2px 0 rgba(255,255,255,0.7)",
            }}
          >
            {scene.title}
          </motion.h2>

          {/* דמויות - קפטן + פיראט */}
          <div className="flex items-end gap-2 mb-1 shrink-0">
            {scene.showCaptain && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <CaptainYamZahav size={72} />
                <div className="text-[10px] font-black text-center bg-amber-400 text-white rounded-full px-2 mt-1">
                  קפטן ים-זהב
                </div>
              </motion.div>
            )}
            {scene.showPirate && pirate && (
              <motion.div
                initial={{ scale: 0, x: 30 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-center"
              >
                <div
                  className={`rounded-full p-1 border-4 border-amber-400 shadow bg-gradient-to-br ${
                    pirate.gender === "boy"
                      ? "from-sky-100 to-cyan-200"
                      : "from-pink-100 to-rose-200"
                  }`}
                >
                  <PirateAvatar id={pirate.id} size={56} />
                </div>
                <div className="text-[10px] font-black mt-1 bg-emerald-400 text-white rounded-full px-2">
                  {playerName}
                </div>
              </motion.div>
            )}
          </div>

          {/* טקסט הקריינות */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`bg-white/95 rounded-xl p-2.5 max-w-md shadow-lg border-2 max-h-[38vh] min-h-0 overflow-hidden flex flex-col relative pr-10 ${
              scene.textOnDark ? "border-purple-300" : "border-amber-300"
            }`}
          >
            <SpeechInlineButton
              slotKey={introSlotKey}
              payload={{
                kind: "single",
                text: captainSceneSpeech,
                personality: "captain",
              }}
              className="absolute top-2 right-2 z-[1] w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-sm flex items-center justify-center active:scale-95 hover:bg-amber-200 shadow-sm"
              titleIdle="השמע את הסיפור"
            />
            {/* "פצפץ דיבור" - חץ כלפי הדמות */}
            <div
              className={`absolute -top-3 ${
                scene.showPirate ? "right-12" : "left-12"
              } w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] ${
                scene.textOnDark ? "border-b-purple-300" : "border-b-amber-300"
              }`}
            />
            {scene.narration.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="text-xs sm:text-sm font-bold text-stone-800 leading-snug"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* כפתורי ניווט */}
      <div className="flex gap-2 justify-center shrink-0 mb-1">
        {!isFirst && (
          <BigButton
            size="sm"
            variant="ghost"
            onClick={() => setSceneIndex(sceneIndex - 1)}
            icon="⬅"
          >
            חזרה
          </BigButton>
        )}
        <BigButton size="lg" variant="primary" onClick={handleNext} icon={isLast ? "⛵" : "➡"}>
          {isLast ? "אני מוכן/ה!" : "הלאה..."}
        </BigButton>
      </div>

      {/* נקודות התקדמות */}
      <div className="flex justify-center gap-1.5 shrink-0">
        {scenes.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === sceneIndex
                ? "w-6 bg-amber-500"
                : i < sceneIndex
                ? "w-2 bg-amber-300"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
