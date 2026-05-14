import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SpeechBubble } from "../components/SpeechBubble";
import { SpeechInlineButton } from "../components/SpeechInlineButton";
import { BigButton } from "../components/BigButton";
import { useGameStore } from "../store/gameStore";
import { getQuestionById } from "../data/questions";
import { useQuestionTimer } from "../hooks/useQuestionTimer";
import { useSpeech } from "../hooks/useSpeech";
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
  const { speakSequentialKeyed, speakKeyed, stop } = useSpeech();
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

  const parrot = useMemo(
    () => (currentIsland ? getParrotByTopic(currentIsland.topic) : null),
    [currentIsland]
  );

  const totalInIslandSafe = currentIsland?.questionIds.length ?? 0;

  const parrotSpeech = useMemo(() => {
    if (!currentIsland || !session || !profile) return "";
    return getParrotSpeechForQuestion(
      currentIsland.topic,
      profile.grade,
      session.currentQuestionInIslandIndex,
      totalInIslandSafe
    );
  }, [
    currentIsland,
    session,
    profile,
    session?.currentQuestionInIslandIndex,
    totalInIslandSafe,
  ]);

  const feedbackSpeechFull = useMemo(() => {
    if (!question) return "";
    if (feedbackStatus === "incorrect") {
      return `${feedbackMessage} התשובה הנכונה הייתה: ${question.answer}`;
    }
    return feedbackMessage;
  }, [feedbackMessage, feedbackStatus, question]);

  useEffect(() => {
    if (!question || !parrot || !parrotSpeech || !currentQuestionId) return;
    if (phase !== "asking") return;
    speakSequentialKeyed(`ask-${currentQuestionId}`, [
      { text: parrotSpeech, personality: parrot.personality },
      { text: question.text, personality: parrot.personality },
    ]);
    return () => {
      stop();
    };
  }, [
    phase,
    currentQuestionId,
    parrotSpeech,
    question,
    parrot,
    speakSequentialKeyed,
    stop,
  ]);

  useEffect(() => {
    if (!question || !currentQuestionId) return;
    if (phase !== "feedback" || !feedbackMessage) return;
    speakKeyed(`feedback-${currentQuestionId}`, feedbackSpeechFull, "guide");
    return () => {
      stop();
    };
  }, [phase, feedbackMessage, feedbackSpeechFull, speakKeyed, stop, question, currentQuestionId]);

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
    <div
      dir="rtl"
      className="h-full min-h-0 max-h-[100dvh] overflow-hidden flex flex-col px-2 pt-2 pb-2 w-full max-w-lg mx-auto"
    >
      <header className="shrink-0 flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="bg-white/90 rounded-full w-9 h-9 shadow font-bold text-stone-700 flex items-center justify-center text-base active:scale-95"
            title="חזרה למפה"
            aria-label="חזרה למפה"
          >
            🗺️
          </button>
          <button
            type="button"
            onClick={handlePause}
            className="bg-white/90 rounded-full px-2 py-1.5 shadow font-bold text-stone-700 flex items-center gap-1 active:scale-95 text-xs"
          >
            <span className="text-base">⏸</span>
            <span>השהה</span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-0.5 min-w-0 flex-1">
          <div className="bg-amber-400/90 text-white rounded-full px-2 py-0.5 shadow text-xs font-bold flex items-center gap-1 max-w-full truncate">
            <span>{currentIsland.emoji}</span>
            <span className="truncate">{currentIsland.title}</span>
          </div>
          <div className="text-[10px] text-stone-700 font-bold bg-white/70 rounded-full px-2 py-0.5 whitespace-nowrap">
            שאלה {questionInIsland}/{totalInIsland} · אי {islandNum}/{totalIslands}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-center bg-white/90 rounded-full p-0.5 shadow">
          <PirateAvatar id={profile.pirateId} size={32} />
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === "asking" ? (
            <motion.div
              key={`ask-${currentQuestionId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 flex-col min-h-0 overflow-hidden"
            >
              <div className="flex shrink-0 gap-1.5 mb-1.5 min-h-0 max-h-[22vh] items-end">
                <div className="shrink-0 flex flex-col items-center">
                  <CagedParrot
                    topic={currentIsland.topic}
                    size={64}
                    correctSoFar={correctInIsland}
                    totalQuestions={totalInIsland}
                    state={cageState}
                  />
                  <div className="text-[9px] font-black text-amber-700 bg-amber-100 rounded-full px-1.5 py-0.5 mt-0.5 whitespace-nowrap max-w-[4.5rem] truncate">
                    {parrot?.name}
                  </div>
                </div>
                <SpeechBubble
                  pointerSide="right"
                  className="px-3 py-2 border-2 min-w-0 flex-1 max-h-[22vh] overflow-hidden"
                  innerTextClassName="text-xs leading-snug"
                  speechReplay={
                    parrot && parrotSpeech && currentQuestionId
                      ? {
                          slotKey: `ask-${currentQuestionId}`,
                          kind: "sequential",
                          parts: [
                            { text: parrotSpeech, personality: parrot.personality },
                            { text: question.text, personality: parrot.personality },
                          ],
                        }
                      : undefined
                  }
                >
                  {parrotSpeech}
                </SpeechBubble>
              </div>

              <div className="flex min-h-0 flex-1 flex-col rounded-2xl border-2 border-amber-300 bg-white p-2.5 shadow-md overflow-hidden mb-2">
                {question.visual && (
                  <div className="flex shrink-0 justify-center max-h-[min(18vh,140px)] min-h-0 items-center overflow-hidden mb-1.5">
                    <div className="max-h-full scale-[0.88] origin-center flex items-center justify-center">
                      <QuestionVisualRenderer visual={question.visual} />
                    </div>
                  </div>
                )}

                <div className="relative shrink-0">
                  {parrot && currentQuestionId && (
                    <SpeechInlineButton
                      slotKey={`ask-qtext-${currentQuestionId}`}
                      payload={{
                        kind: "single",
                        text: question.text,
                        personality: parrot.personality,
                      }}
                      className="absolute top-0 left-0 z-[1] w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-sm flex items-center justify-center active:scale-95 hover:bg-amber-200 shadow-sm"
                      titleIdle="השמע את השאלה"
                    />
                  )}
                  <div
                    className="shrink-0 text-center text-base sm:text-lg font-black text-stone-800 mb-1.5 leading-snug line-clamp-3 pt-1"
                    dir={isCalculation(question.text) ? "ltr" : "rtl"}
                  >
                    {question.text}
                  </div>
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  inputMode={isNumericQuestion ? "numeric" : "text"}
                  pattern={isNumericQuestion ? "[0-9]*" : undefined}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  placeholder="התשובה שלי..."
                  className="w-full shrink-0 text-center text-lg py-2 bg-amber-50 border-2 border-amber-200 rounded-xl px-2 focus:border-amber-400 focus:outline-none font-black text-stone-800"
                  autoComplete="off"
                />
              </div>

              <div className="mt-auto shrink-0 flex w-full max-w-md mx-auto gap-2 items-stretch">
                <BigButton
                  size="sm"
                  variant="ghost"
                  onClick={handleSkip}
                  icon="⏭"
                  className="!w-[25%] !min-h-[44px] !shrink-0 !px-1 !py-2 !text-xs !rounded-xl !border-b-2"
                >
                  דלג
                </BigButton>
                <BigButton
                  size="md"
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  icon="✨"
                  className="!w-[70%] !min-h-[44px] !shrink-0 !px-3 !py-2.5 !text-base !rounded-xl !border-b-4"
                >
                  שולח!
                </BigButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 flex-col min-h-0 overflow-hidden gap-1.5"
            >
              <div className="relative shrink-0 flex justify-center max-h-[32vh]">
                <CagedParrot
                  topic={currentIsland.topic}
                  size={100}
                  correctSoFar={
                    feedbackStatus === "correct" ? correctInIsland + 1 : correctInIsland
                  }
                  totalQuestions={totalInIsland}
                  state={cageState}
                />
                {feedbackStatus === "correct" && (
                  <>
                    {[..."🌟⭐✨"].map((emoji, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-2xl pointer-events-none"
                        style={{ left: `${15 + i * 22}%`, top: -8 }}
                        initial={{ y: 0, opacity: 1, scale: 0 }}
                        animate={{ y: 56, opacity: 0, scale: 1.2 }}
                        transition={{ duration: 1, delay: i * 0.08 }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </>
                )}
              </div>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`relative shrink-0 rounded-2xl px-4 py-2.5 shadow-lg border-2 max-w-md mx-auto w-full text-center pr-10 ${
                  feedbackStatus === "correct"
                    ? "bg-emerald-50 border-emerald-400"
                    : feedbackStatus === "incorrect"
                    ? "bg-sky-50 border-sky-300"
                    : "bg-amber-50 border-amber-300"
                }`}
              >
                {currentQuestionId && (
                  <SpeechInlineButton
                    slotKey={`feedback-${currentQuestionId}`}
                    payload={{
                      kind: "single",
                      text: feedbackSpeechFull,
                      personality: "guide",
                    }}
                    className="absolute top-2 right-2 z-[1] w-8 h-8 rounded-full bg-white/90 border border-stone-300 text-sm flex items-center justify-center active:scale-95 hover:bg-white shadow-sm"
                    titleIdle="השמע עידוד"
                  />
                )}
                <div
                  className={`text-lg font-black ${
                    feedbackStatus === "correct"
                      ? "text-emerald-700"
                      : feedbackStatus === "incorrect"
                      ? "text-sky-700"
                      : "text-amber-700"
                  }`}
                >
                  {feedbackMessage}
                </div>
                {feedbackStatus === "incorrect" && (
                  <div className="text-stone-600 text-sm mt-1.5 leading-snug">
                    התשובה הנכונה הייתה:{" "}
                    <span className="font-black text-stone-800" dir="ltr">
                      {question.answer}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="shrink-0 flex items-center justify-center gap-2 bg-white rounded-full px-3 py-1.5 shadow border border-amber-200 max-w-md mx-auto w-full"
              >
                <div className="text-stone-700 font-bold text-xs">קיבלת</div>
                {Array.from({ length: pearlsEarned }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 220 }}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                      PEARL_COLOR_CLASSES[question.topic]
                    } shadow border-2 border-white flex items-center justify-center shrink-0`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white/40" />
                  </motion.div>
                ))}
                <div className="text-amber-700 font-black text-sm">
                  {pearlsEarned > 1 ? `${pearlsEarned} פנינים` : "פנינה"}
                </div>
              </motion.div>

              <div className="shrink-0 text-center text-[11px] text-stone-600 font-bold bg-white/70 rounded-xl px-2 py-1 border border-amber-200 max-w-md mx-auto w-full line-clamp-2">
                {(() => {
                  const isLast = questionInIsland >= totalInIsland;
                  if (isLast) {
                    return (
                      <>
                        🎉 <span className="text-amber-700">{parrot!.name}</span> משתחרר מהכלוב!
                      </>
                    );
                  }
                  const remaining = totalInIsland - questionInIsland;
                  return (
                    <>
                      <span className="text-amber-700">{parrot!.name}</span>: עוד{" "}
                      <span className="text-amber-700">{remaining}</span> חידות לחופש! 🦜
                    </>
                  );
                })()}
              </div>

              <div className="flex-1 min-h-0" aria-hidden />

              <div className="shrink-0 pt-1 w-full max-w-md mx-auto">
                <BigButton
                  size="md"
                  variant="primary"
                  onClick={handleNext}
                  icon="⛵"
                  className="!w-full !py-3 !text-base !rounded-2xl"
                >
                  {questionInIsland < totalInIsland ? "לחידה הבאה באי!" : "להציל את התוכי!"}
                </BigButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
