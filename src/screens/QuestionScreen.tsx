import { useEffect, useMemo, useState } from "react";
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
import { ProfileHeaderButton } from "../components/ProfileHeaderButton";
import type { AnswerStatus, Question } from "../types";

type Phase = "asking" | "feedback";

/** מקסימום תווים בשדה התשובה (מקלדת מובנית בלבד) */
const MAX_ANSWER_CHARS = 15;

function normalizeAnswer(s: string): string {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}

function isCalculation(text: string): boolean {
  return !/[\u0590-\u05FF]/.test(text);
}

function parseQuotedChoices(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(/['׳"]([^'"׳"]{1,40})['׳"]/gu)) {
    const t = m[1].trim();
    if (t) found.add(t);
  }
  return [...found];
}

function choiceChips(question: Question): string[] {
  if (question.tapChoices?.length) return [...new Set(question.tapChoices)];
  const fromQuotes = parseQuotedChoices(question.text);
  if (fromQuotes.length >= 2) return fromQuotes;
  const merged = [question.answer, ...(question.acceptAlternatives ?? [])]
    .map((s) => s.trim())
    .filter(Boolean);
  const uniq = [...new Set(merged)];
  if (uniq.length >= 2 && uniq.length <= 10 && uniq.some((u) => /[\u0590-\u05FF]/.test(u))) return uniq;
  return [];
}

function answerCharPool(question: Question): string {
  return [question.answer, ...(question.acceptAlternatives ?? [])].join("");
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
  }, [currentIsland, session, profile, session?.currentQuestionInIslandIndex, totalInIslandSafe]);

  useEffect(() => {
    setAnswer(session?.draftAnswer ?? "");
    setPhase("asking");
  }, [currentQuestionId, session?.draftAnswer]);

  useEffect(() => {
    if (phase === "asking") {
      updateDraftAnswer(answer);
    }
  }, [answer, phase, updateDraftAnswer]);

  if (!profile) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!session || !currentIsland || !question) {
    navigate("/map", { replace: true });
    return null;
  }

  const chips = choiceChips(question);
  const pool = answerCharPool(question);
  const showSlash = pool.includes("/");
  const showDot = pool.includes(".");
  const showComma = pool.includes(",") || pool.includes("،");

  const append = (ch: string) => {
    setAnswer((prev) => (prev.length >= MAX_ANSWER_CHARS ? prev : prev + ch));
  };

  const backspace = () => setAnswer((prev) => prev.slice(0, -1));

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
    setPearlsEarned(correct ? 3 : 1);
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

  const correctInIsland = session.attempts.filter(
    (a) => a.islandId === currentIsland.id && a.status === "correct"
  ).length;

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

  const keyColors = [
    "bg-gradient-to-br from-sky-400 to-blue-500 text-white border-sky-700",
    "bg-gradient-to-br from-violet-400 to-purple-600 text-white border-purple-800",
    "bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-teal-800",
    "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-orange-800",
    "bg-gradient-to-br from-rose-400 to-pink-600 text-white border-rose-800",
    "bg-gradient-to-br from-cyan-400 to-cyan-600 text-white border-cyan-800",
    "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white border-indigo-900",
    "bg-gradient-to-br from-lime-400 to-green-600 text-white border-green-800",
    "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 text-white border-fuchsia-900",
  ];

  const digitKey = (n: number) => (
    <button
      key={n}
      type="button"
      onClick={() => append(String(n))}
      className={`min-h-[56px] rounded-2xl text-3xl sm:text-4xl font-black shadow-md border-b-4 active:translate-y-0.5 active:border-b-2 ${keyColors[(n - 1) % keyColors.length]}`}
    >
      {n}
    </button>
  );

  return (
    <div
      dir="rtl"
      className="h-[100dvh] max-h-[100dvh] min-h-0 w-full max-w-lg mx-auto overflow-hidden flex flex-col px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] box-border"
    >
      <header className="shrink-0 flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="bg-white/90 rounded-full w-10 h-10 shadow font-bold text-stone-700 flex items-center justify-center text-lg active:scale-95"
            title="חזרה למפה"
            aria-label="חזרה למפה"
          >
            🗺️
          </button>
          <button
            type="button"
            onClick={handlePause}
            className="bg-white/90 rounded-full px-2.5 py-2 shadow font-bold text-stone-700 flex items-center gap-1 active:scale-95 text-sm"
          >
            <span className="text-lg">⏸</span>
            <span>השהה</span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-1 min-w-0 flex-1 px-1">
          <div className="bg-amber-400/90 text-white rounded-full px-3 py-1 shadow text-sm sm:text-base font-black flex items-center gap-1 max-w-full">
            <span className="shrink-0">{currentIsland.emoji}</span>
            <span className="truncate min-w-0">{currentIsland.title}</span>
          </div>
          <div className="text-xs sm:text-sm text-stone-800 font-black bg-white/80 rounded-full px-2.5 py-1 whitespace-nowrap">
            שאלה {questionInIsland}/{totalInIsland} · אי {islandNum}/{totalIslands}
          </div>
        </div>
        <ProfileHeaderButton className="shrink-0 max-w-[38%]" />
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
              className="flex flex-1 flex-col min-h-0 overflow-hidden gap-2"
            >
              <div className="flex shrink-0 gap-2 items-end min-h-0">
                <div className="shrink-0 flex flex-col items-center">
                  <CagedParrot
                    topic={currentIsland.topic}
                    size={64}
                    correctSoFar={correctInIsland}
                    totalQuestions={totalInIsland}
                    state={cageState}
                  />
                  <div className="text-[11px] sm:text-xs font-black text-amber-700 bg-amber-100 rounded-full px-2 py-0.5 mt-1 whitespace-nowrap max-w-[6rem] truncate">
                    {parrot?.name}
                  </div>
                </div>
                <SpeechBubble
                  pointerSide="right"
                  className="px-3 py-2.5 border-2 min-w-0 flex-1 max-h-[32vh] sm:max-h-[30vh] overflow-y-auto"
                  innerTextClassName="text-sm sm:text-base leading-snug"
                >
                  {parrotSpeech && <span className="block text-amber-950 font-black">{parrotSpeech}</span>}
                  <span className="block mt-1.5 text-stone-900 text-base sm:text-lg font-bold">{question.text}</span>
                </SpeechBubble>
              </div>

              <div className="flex min-h-0 flex-1 flex-col rounded-2xl border-2 border-amber-300 bg-white p-3 shadow-md overflow-y-auto overscroll-y-contain mb-1 gap-2">
                {question.visual && (
                  <div className="flex shrink-0 justify-center w-full max-h-[min(36vh,280px)] min-h-[96px] items-center overflow-hidden py-1">
                    <div className="max-h-full max-w-full flex items-center justify-center overflow-x-auto">
                      <QuestionVisualRenderer visual={question.visual} />
                    </div>
                  </div>
                )}

                <div
                  className="shrink-0 text-center text-lg sm:text-xl font-black text-stone-900 leading-snug px-1"
                  dir={isCalculation(question.text) ? "ltr" : "rtl"}
                >
                  {question.text}
                </div>

                <input
                  type="text"
                  readOnly
                  inputMode="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={answer}
                  onChange={() => {}}
                  placeholder="התשובה שלי…"
                  maxLength={MAX_ANSWER_CHARS}
                  aria-label="תשובה"
                  className="w-full shrink-0 text-center text-2xl sm:text-3xl py-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-2 font-black text-stone-900 tracking-wide"
                />

                {chips.length > 0 && (
                  <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                    {chips.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setAnswer(c)}
                        className="rounded-full bg-violet-100 border-2 border-violet-300 px-3 py-1.5 text-sm sm:text-base font-black text-violet-900 active:scale-95"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0 flex gap-2 w-full max-w-md mx-auto items-stretch pt-1">
                <BigButton
                  size="sm"
                  variant="ghost"
                  onClick={handleSkip}
                  icon="⏭"
                  className="!w-[22%] !min-h-[52px] !shrink-0 !px-1 !py-2 !text-sm !font-black !rounded-2xl !border-b-4"
                >
                  דלג
                </BigButton>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => digitKey(n))}
                  </div>
                  {(showSlash || showDot || showComma) && (
                    <div className="flex gap-2 justify-center">
                      {showSlash && (
                        <button
                          type="button"
                          onClick={() => append("/")}
                          className="min-h-[44px] flex-1 max-w-[5rem] rounded-xl bg-stone-200 text-lg font-black text-stone-800 border-b-4 border-stone-400 active:translate-y-0.5"
                        >
                          /
                        </button>
                      )}
                      {showDot && (
                        <button
                          type="button"
                          onClick={() => append(".")}
                          className="min-h-[44px] flex-1 max-w-[5rem] rounded-xl bg-stone-200 text-lg font-black text-stone-800 border-b-4 border-stone-400 active:translate-y-0.5"
                        >
                          .
                        </button>
                      )}
                      {showComma && (
                        <button
                          type="button"
                          onClick={() => append(",")}
                          className="min-h-[44px] flex-1 max-w-[5rem] rounded-xl bg-stone-200 text-lg font-black text-stone-800 border-b-4 border-stone-400 active:translate-y-0.5"
                        >
                          ,
                        </button>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={backspace}
                      className="min-h-[56px] rounded-2xl bg-gradient-to-br from-stone-300 to-stone-500 text-white text-base font-black border-b-4 border-stone-700 shadow-md active:translate-y-0.5"
                      aria-label="מחק"
                    >
                      מחק ←
                    </button>
                    <button
                      type="button"
                      onClick={() => append("0")}
                      className={`min-h-[56px] rounded-2xl text-3xl font-black border-b-4 shadow-md active:translate-y-0.5 ${keyColors[4]}`}
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!answer.trim()}
                      className="min-h-[56px] rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white text-lg font-black border-b-4 border-amber-900 shadow-md active:translate-y-0.5 disabled:opacity-40 disabled:grayscale"
                    >
                      שלח ✨
                    </button>
                  </div>
                </div>
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
                className={`relative shrink-0 rounded-2xl px-4 py-2.5 shadow-lg border-2 max-w-md mx-auto w-full text-center ${
                  feedbackStatus === "correct"
                    ? "bg-emerald-50 border-emerald-400"
                    : feedbackStatus === "incorrect"
                      ? "bg-sky-50 border-sky-300"
                      : "bg-amber-50 border-amber-300"
                }`}
              >
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
