import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SpeechBubble } from "../components/SpeechBubble";
import { BigButton } from "../components/BigButton";
import { useGameStore } from "../store/gameStore";
import { getQuestionById } from "../data/questions";
import { useQuestionTimer } from "../hooks/useQuestionTimer";
import { praiseForCorrect, praiseForSkip, praiseForTrying } from "../data/praise";
import { QuestionVisualRenderer } from "../components/visuals/QuestionVisualRenderer";
import { PEARL_COLOR_CLASSES, getParrotByTopic, getParrotSpeechForQuestion } from "../data/parrots";
import { CagedParrot } from "../components/CagedParrot";
import { PirateAvatar } from "../components/PirateAvatar";
import type { AnswerStatus } from "../types";

type Phase = "asking" | "feedback";

function normalizeAnswer(s: string): string {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}

// "שאלת חישוב" = שאלה ללא אותיות עבריות (כמו 5+7=?).
// שאלה כזו צריכה להיות מוצגת משמאל לימין כי כך כותבים מתמטיקה.
// שאלה מילולית (עם טקסט בעברית) נשארת מימין לשמאל כרגיל.
function isCalculation(text: string): boolean {
  return !/[\u0590-\u05FF]/.test(text);
}

export function QuestionScreen() {
  const navigate = useNavigate();
  const profile = useGameStore((s) => s.profile);
  const session = useGameStore((s) => s.session);
  const islands = useGameStore((s) => s.islands);
  const updateDraftAnswer = useGameStore((s) => s.updateDraftAnswer);
  const recordAttempt = useGameStore((s) => s.recordAttempt);
  const advanceToNextQuestion = useGameStore((s) => s.advanceToNextQuestion);

  const currentIsland = session
    ? islands.find((i) => i.id === session.islandIds[session.currentIslandIndex])
    : undefined;

  const currentQuestionId = currentIsland?.questionIds[session?.currentQuestionInIslandIndex ?? 0];
  const question = useMemo(
    () => (currentQuestionId ? getQuestionById(currentQuestionId) : undefined),
    [currentQuestionId]
  );

  const [answer, setAnswer] = useState<string>(session?.draftAnswer ?? "");
  const [phase, setPhase] = useState<Phase>("asking");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackStatus, setFeedbackStatus] = useState<AnswerStatus>("correct");
  const [pearlsEarned, setPearlsEarned] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { snapshot } = useQuestionTimer(phase === "asking");

  useEffect(() => {
    setAnswer(session?.draftAnswer ?? "");
    setPhase("asking");
  }, [currentQuestionId, session?.draftAnswer]);

  useEffect(() => {
    if (phase === "asking") {
      updateDraftAnswer(answer);
    }
  }, [answer, phase, updateDraftAnswer]);

  useEffect(() => {
    if (phase === "asking" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentQuestionId]);

  if (!profile) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!session || !currentIsland || !question) {
    navigate("/map", { replace: true });
    return null;
  }

  const isCorrectAnswer = (input: string): boolean => {
    const normalized = normalizeAnswer(input);
    if (normalized === normalizeAnswer(question.answer)) return true;
    if (question.acceptAlternatives) {
      return question.acceptAlternatives.some((alt) => normalizeAnswer(alt) === normalized);
    }
    return false;
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const t = snapshot();
    const correct = isCorrectAnswer(answer);
    recordAttempt({
      studentAnswer: answer,
      status: correct ? "correct" : "incorrect",
      timeMs: t.activeMs,
      pausedMs: t.pausedMs,
      pauseCount: t.pauseCount,
      startedAt: t.startedAt,
    });
    setFeedbackMessage(correct ? praiseForCorrect() : praiseForTrying());
    setFeedbackStatus(correct ? "correct" : "incorrect");
    setPearlsEarned(correct ? 3 : 1); // נכון = 1+2 בונוס, לא נכון = 1
    setPhase("feedback");
  };

  const handleSkip = () => {
    const t = snapshot();
    recordAttempt({
      studentAnswer: answer,
      status: "skipped",
      timeMs: t.activeMs,
      pausedMs: t.pausedMs,
      pauseCount: t.pauseCount,
      startedAt: t.startedAt,
    });
    setFeedbackMessage(praiseForSkip());
    setFeedbackStatus("skipped");
    setPearlsEarned(1);
    setPhase("feedback");
  };

  const handleNext = () => {
    advanceToNextQuestion();
    setAnswer("");
    // אם נשארה שאלה באי - נישאר במסך השאלה (ה-store יעדכן את ה-question).
    // אם סיימנו את האי - חוזרים למפה כדי לראות את ההתקדמות.
    const willStayOnIsland =
      session.currentQuestionInIslandIndex + 1 < currentIsland.questionIds.length;
    if (!willStayOnIsland) {
      navigate("/map");
    }
  };

  const handlePause = () => {
    navigate("/pause");
  };

  const questionInIsland = session.currentQuestionInIslandIndex + 1;
  const totalInIsland = currentIsland.questionIds.length;
  const islandNum = session.currentIslandIndex + 1;
  const totalIslands = session.islandIds.length;

  const parrot = getParrotByTopic(currentIsland.topic);
  const parrotSpeech = getParrotSpeechForQuestion(
    currentIsland.topic,
    profile.grade,
    session.currentQuestionInIslandIndex,
    totalInIsland
  );

  // כמה תשובות נכונות באי הזה (לחישוב כמה סורגים נשברו)
  const correctInIsland = session.attempts.filter(
    (a) => a.islandId === currentIsland.id && a.status === "correct"
  ).length;

  // האם האי הסתיים עם תשובה נכונה אחרונה? (לאנימציית פיצוץ)
  const isFinalCorrect =
    phase === "feedback" &&
    feedbackStatus === "correct" &&
    questionInIsland >= totalInIsland;

  const cageState: "caged" | "shaking" | "free" | "exploding" =
    isFinalCorrect
      ? "exploding"
      : phase === "feedback" && feedbackStatus === "incorrect"
      ? "shaking"
      : "caged";

  // קלט מספרי או טקסטואלי?
  const isNumericQuestion = question.kind !== "shape" || /^\d+$/.test(question.answer);

  return (
    <div className="min-h-full flex flex-col px-4 py-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/map")}
            className="bg-white/90 rounded-full w-10 h-10 shadow font-bold text-stone-700 flex items-center justify-center text-lg active:scale-95"
            title="חזרה למפה"
            aria-label="חזרה למפה"
          >
            🗺️
          </button>
          <button
            onClick={handlePause}
            className="bg-white/90 rounded-full px-3 py-2 shadow font-bold text-stone-700 flex items-center gap-1.5 active:scale-95"
          >
            <span className="text-lg">⏸</span>
            <span className="text-sm">השהה</span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="bg-amber-400/90 text-white rounded-full px-3 py-1 shadow text-sm font-bold flex items-center gap-1">
            <span>{currentIsland.emoji}</span>
            <span>{currentIsland.title}</span>
          </div>
          <div className="text-xs text-stone-700 font-bold bg-white/70 rounded-full px-3 py-0.5">
            שאלה {questionInIsland} מתוך {totalInIsland} | אי {islandNum}/{totalIslands}
          </div>
        </div>
        {/* אווטר הפיראט - בפינה */}
        <div className="flex flex-col items-center bg-white/90 rounded-full p-1 shadow">
          <PirateAvatar id={profile.pirateId} size={36} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "asking" ? (
          <motion.div
            key={`ask-${currentQuestionId}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="flex items-end gap-2 mb-3 max-w-md w-full">
              <div className="shrink-0 flex flex-col items-center">
                <CagedParrot
                  topic={currentIsland.topic}
                  size={95}
                  correctSoFar={correctInIsland}
                  totalQuestions={totalInIsland}
                  state={cageState}
                />
                <div className="text-[10px] font-black text-amber-700 bg-amber-100 rounded-full px-2 py-0.5 mt-0.5 whitespace-nowrap">
                  {parrot.name}
                </div>
              </div>
              <SpeechBubble pointerSide="right" className="text-xs">
                {parrotSpeech}
              </SpeechBubble>
            </div>

            <motion.div
              className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-5 w-full max-w-md"
              animate={{ rotate: [0, 0.5, 0, -0.5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              {/* תצוגת השאלה הויזואלית - שעון, ספירה, צורה */}
              {question.visual && (
                <div className="flex justify-center mb-4">
                  <QuestionVisualRenderer visual={question.visual} />
                </div>
              )}

              <div
                className="text-center text-2xl md:text-3xl font-black text-stone-800 mb-5 leading-snug"
                dir={isCalculation(question.text) ? "ltr" : "rtl"}
              >
                {question.text}
              </div>

              <input
                ref={inputRef}
                type="text"
                inputMode={isNumericQuestion ? "numeric" : "text"}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="התשובה שלי..."
                className="w-full text-2xl text-center bg-amber-50 border-4 border-amber-200 rounded-2xl px-4 py-3 focus:border-amber-400 focus:outline-none font-black text-stone-800"
                autoComplete="off"
              />
            </motion.div>

            <div className="flex gap-3 mt-6">
              <BigButton size="md" variant="ghost" onClick={handleSkip} icon="⏭">
                דלג
              </BigButton>
              <BigButton
                size="lg"
                variant="primary"
                onClick={handleSubmit}
                disabled={!answer.trim()}
                icon="✨"
              >
                שולח!
              </BigButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            {/* תוכי בכלוב - עם מצב מתאים (מתפוצץ אם זו השאלה האחרונה ונכונה) */}
            <div className="relative">
              <CagedParrot
                topic={currentIsland.topic}
                size={140}
                correctSoFar={
                  feedbackStatus === "correct" ? correctInIsland + 1 : correctInIsland
                }
                totalQuestions={totalInIsland}
                state={cageState}
              />
              {/* אנימציית כוכבים - רק לתשובה נכונה */}
              {feedbackStatus === "correct" && (
                <>
                  {[..."🌟⭐✨🎉🌟"].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-3xl pointer-events-none"
                      style={{ left: `${10 + i * 18}%`, top: -20 }}
                      initial={{ y: 0, opacity: 1, scale: 0 }}
                      animate={{ y: 100, opacity: 0, scale: 1.5 }}
                      transition={{ duration: 1.2, delay: i * 0.1 }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </>
              )}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className={`rounded-3xl px-7 py-4 shadow-xl border-4 max-w-md text-center ${
                feedbackStatus === "correct"
                  ? "bg-emerald-50 border-emerald-400"
                  : feedbackStatus === "incorrect"
                  ? "bg-sky-50 border-sky-300"
                  : "bg-amber-50 border-amber-300"
              }`}
            >
              <div
                className={`text-2xl font-black ${
                  feedbackStatus === "correct"
                    ? "text-emerald-700"
                    : feedbackStatus === "incorrect"
                    ? "text-sky-700"
                    : "text-amber-700"
                }`}
              >
                {feedbackMessage}
              </div>
              {/* לתשובה לא נכונה - מציגים את התשובה הנכונה (חשוב ללמידה) */}
              {feedbackStatus === "incorrect" && (
                <div className="text-stone-600 text-base mt-2">
                  התשובה הנכונה הייתה:{" "}
                  <span className="font-black text-stone-800" dir="ltr">
                    {question.answer}
                  </span>
                </div>
              )}
            </motion.div>

            {/* אנימציית הענקת פנינים */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex items-center gap-3 bg-white rounded-full px-5 py-2 shadow border-2 border-amber-200"
            >
              <div className="text-stone-700 font-bold text-sm">
                {pearlsEarned > 1 ? "קיבלת" : "קיבלת"}
              </div>
              {Array.from({ length: pearlsEarned }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 200 }}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                    PEARL_COLOR_CLASSES[question.topic]
                  } shadow-lg border-2 border-white flex items-center justify-center`}
                >
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                </motion.div>
              ))}
              <div className="text-amber-700 font-black text-base">
                {pearlsEarned > 1 ? `${pearlsEarned} פנינים!` : "פנינה!"}
              </div>
            </motion.div>

            {/* הצגת התוכי + מסר התקדמות */}
            <div className="text-center text-sm text-stone-600 font-bold bg-white/70 rounded-2xl px-4 py-2 border-2 border-amber-200">
              {(() => {
                const isLast = questionInIsland >= totalInIsland;
                if (isLast) {
                  return (
                    <>
                      🎉 <span className="text-amber-700">{parrot.name}</span> משתחרר מהכלוב!
                    </>
                  );
                }
                const remaining = totalInIsland - questionInIsland;
                return (
                  <>
                    <span className="text-amber-700">{parrot.name}</span> אומר/ת:
                    {" "}עוד <span className="text-amber-700">{remaining}</span> חידות ואני חופשי בזכותך! 🦜
                  </>
                );
              })()}
            </div>

            <BigButton size="lg" variant="primary" onClick={handleNext} icon="⛵">
              {questionInIsland < totalInIsland ? "לחידה הבאה באי!" : "להציל את התוכי!"}
            </BigButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
