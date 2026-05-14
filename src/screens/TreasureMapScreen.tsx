import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Parrot } from "../components/Parrot";
import { BigButton } from "../components/BigButton";
import { useGameStore } from "../store/gameStore";
import { getSkippedIslandsToRevisit } from "../data/adaptivePath";
import { PEARL_COLOR_CLASSES, PARROTS, UNIQUE_PARROT_COUNT, getParrotByTopic } from "../data/parrots";
import { PirateAvatar } from "../components/PirateAvatar";
import { CagedParrot } from "../components/CagedParrot";
import { IslandDetailModal } from "../components/IslandDetailModal";
import { SpeechInlineButton } from "../components/SpeechInlineButton";
import { useSpeech } from "../hooks/useSpeech";
import type { Island, Topic } from "../types";

/** גודל אי (קוטר), מרווח אנכי בין איים, וגובה תצוגה — עד 3 איים בו-זמנית */
const ISLAND_DIAMETER_PX = 80;
const MIN_GAP_BETWEEN_ISLANDS_PX = 120;
const ROW_STRIDE_PX = ISLAND_DIAMETER_PX + MIN_GAP_BETWEEN_ISLANDS_PX;
const MAP_VIEWPORT_MAX_ISLANDS = 3;
const MAP_SCROLL_MAX_HEIGHT_PX = MAP_VIEWPORT_MAX_ISLANDS * ROW_STRIDE_PX + 32;

export function TreasureMapScreen() {
  const navigate = useNavigate();
  const profile = useGameStore((s) => s.profile);
  const session = useGameStore((s) => s.session);
  const islands = useGameStore((s) => s.islands);
  const inventory = useGameStore((s) => s.inventory);
  const recentlyRescuedEvent = useGameStore((s) => s.recentlyRescuedEvent);
  const clearRecentRescue = useGameStore((s) => s.clearRecentRescue);
  const mapFeedback = useGameStore((s) => s.mapFeedback);
  const clearMapFeedback = useGameStore((s) => s.clearMapFeedback);
  const { speak, speakKeyed, stop } = useSpeech();
  const resumeSessionOrStartNew = useGameStore((s) => s.resumeSessionOrStartNew);
  const finishSession = useGameStore((s) => s.finishSession);

  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const mapScrollRef = useRef<HTMLDivElement | null>(null);
  const islandRowRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    if (profile && !session) {
      resumeSessionOrStartNew();
    }
  }, [profile, session, resumeSessionOrStartNew]);

  const totalIslands = session?.islandIds.length ?? 0;
  const currentIdx = session?.currentIslandIndex ?? 0;
  const completed = session?.completedAt != null;

  /** נקודת אוצר בסוף הנתיב (תמיד אם יש איים) — גם אחרי סיום המסע */
  const showsTreasure = totalIslands > 0;
  const drawCount = showsTreasure ? totalIslands + 1 : 0;

  const currentIsland = session
    ? islands.find((i) => i.id === session.islandIds[session.currentIslandIndex])
    : undefined;

  const skippedRevisitIslandIds = useMemo(() => {
    if (!session || !profile || session.completedAt) return new Set<string>();
    return new Set(
      getSkippedIslandsToRevisit(
        session.attempts,
        session.islandIds,
        islands,
        profile.grade,
        session.currentIslandIndex
      )
    );
  }, [session, islands, profile]);

  /** אי i (0..total-1) הושלם במסלול — עברנו אותו (לפני האי הנוכחי). */
  const islandIndexCompleted = (globalIdx: number) => globalIdx < currentIdx;

  /** פרוגרס עד האי הנוכחי: מונה 1-מבוסס מתוך כל האיים במסלול */
  const progressLabel =
    totalIslands > 0
      ? `אי ${Math.min(currentIdx + 1, totalIslands)} מתוך ${totalIslands}`
      : "";
  const progressRatio =
    totalIslands > 0 ? Math.min(1, Math.max(0, (currentIdx + 1) / totalIslands)) : 0;

  if (!profile) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!session) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center">
        <Parrot mood="thinking" size={120} />
      </div>
    );
  }

  const currentParrot = currentIsland ? getParrotByTopic(currentIsland.topic) : null;
  const rescuedCount = inventory.rescuedParrotIds.length;
  const answeredInCurrentIsland = session.currentQuestionInIslandIndex;
  const questionsInCurrentIsland = currentIsland?.questionIds.length ?? 0;

  const mapGuideSpeechText = useMemo(() => {
    if (completed) return "הגענו לאוצר! מסע מדהים!";
    if (currentIsland && currentParrot) {
      const islandShort = currentIsland.title.split(" (")[0];
      return `לאי הבא: ${currentIsland.emoji} ${islandShort}. התוכי ${currentParrot.name} מחכה לעזרה. ${answeredInCurrentIsland} מתוך ${questionsInCurrentIsland} שאלות`;
    }
    return "בוא נתחיל!";
  }, [
    completed,
    currentIsland,
    currentParrot,
    answeredInCurrentIsland,
    questionsInCurrentIsland,
  ]);

  useEffect(() => {
    speakKeyed("map-guide", mapGuideSpeechText, "guide");
    return () => {
      stop();
    };
  }, [mapGuideSpeechText, speakKeyed, stop]);

  useEffect(() => {
    if (!mapFeedback) return;
    speak(mapFeedback, "guide");
  }, [mapFeedback, speak]);

  useEffect(() => {
    if (!recentlyRescuedEvent || !profile) return;
    const p = PARROTS[recentlyRescuedEvent.parrotId as Topic];
    if (!p) return;
    const tier = profile.grade <= 2 ? p.younger : p.older;
    speakKeyed(
      `rescue-${recentlyRescuedEvent.parrotId}`,
      tier.free[0],
      p.personality
    );
    return () => {
      stop();
    };
  }, [recentlyRescuedEvent, profile, speakKeyed, stop]);

  /** גלילה לאי הנוכחי (או לאוצר אחרי סיום) */
  useLayoutEffect(() => {
    if (!session || drawCount === 0) return;
    const targetIdx = completed ? drawCount - 1 : Math.min(currentIdx, drawCount - 1);
    const el = islandRowRefs.current.get(targetIdx);
    const sc = mapScrollRef.current;
    if (!el || !sc) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    });
  }, [session, currentIdx, completed, drawCount, totalIslands]);

  return (
    <div className="h-full min-h-0 flex flex-col px-2 py-2 relative overflow-hidden" dir="rtl">
      {mapFeedback && (
        <div className="mb-2 shrink-0 w-full max-w-md mx-auto">
          <div className="bg-violet-100 border-2 border-violet-400 rounded-2xl px-3 py-2 flex items-start gap-2 shadow">
            <span className="text-lg shrink-0" aria-hidden>
              🎯
            </span>
            <p className="text-xs font-bold text-violet-950 leading-snug flex-1 min-w-0">{mapFeedback}</p>
            <button
              type="button"
              onClick={clearMapFeedback}
              className="shrink-0 text-violet-600 font-black text-sm px-2 py-0.5 rounded-lg hover:bg-violet-200/80 active:scale-95"
              aria-label="סגור הודעה"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* כותרת עליונה - בית + אוואטר + פנינים + חנות */}
      <div className="flex items-center justify-between gap-1 mb-2 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="bg-white/90 hover:bg-white active:scale-95 rounded-full w-9 h-9 shadow font-bold text-stone-700 text-lg flex items-center justify-center shrink-0"
          title="חזרה למסך הראשי"
          aria-label="חזרה למסך הראשי"
        >
          🏠
        </button>
        <div className="bg-white/90 rounded-full px-2 py-1 shadow font-bold text-stone-700 text-sm flex items-center gap-1.5 min-w-0">
          <div className="bg-gradient-to-br from-sky-100 to-cyan-200 rounded-full overflow-hidden border-2 border-amber-300 shrink-0">
            <PirateAvatar id={profile.pirateId} size={32} />
          </div>
          <span className="truncate">{profile.name}</span>
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="bg-amber-400/95 hover:bg-amber-500 active:scale-95 rounded-full px-3 py-1 shadow font-bold text-white text-sm flex items-center gap-1.5 shrink-0"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-inner border border-white" />
          <span>{inventory.pearls}</span>
          <span className="text-xs opacity-90">🏪</span>
        </button>
      </div>

      {/* פרוגרס מסלול */}
      {!completed && totalIslands > 0 ? (
        <div className="mb-2 shrink-0 w-full max-w-md mx-auto rounded-2xl bg-white/90 border-2 border-amber-200 px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-black text-amber-900">{progressLabel}</span>
          </div>
          <div dir="ltr">
            <div
              className="h-2.5 rounded-full bg-amber-100 overflow-hidden border border-amber-200/80"
              role="progressbar"
              aria-valuenow={Math.round(progressRatio * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="התקדמות במסלול האיים"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                initial={false}
                animate={{ width: `${progressRatio * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* תוכי + כרטיסיית האי הנוכחי */}
      <div className="flex items-center gap-2 mb-2 shrink-0 bg-white/90 rounded-2xl border-2 border-amber-300 shadow p-2">
        <Parrot size={48} mood={completed ? "celebrating" : "happy"} />
        <div className="flex-1 text-sm font-bold text-stone-700 leading-tight text-right min-w-0">
          {completed ? (
            <>🏆 הגענו לאוצר! מסע מדהים!</>
          ) : currentIsland && currentParrot ? (
            <>
              <span className="text-xs text-stone-500">לאי הבא:</span>
              <br />
              <span className="font-black">
                {currentIsland.emoji} {currentIsland.title.split(" (")[0]}
              </span>
              <div className="text-xs text-stone-500">
                התוכי <span className="font-black text-amber-700">{currentParrot.name}</span> מחכה לעזרה
              </div>
              {questionsInCurrentIsland > 0 && (
                <div className="text-xs font-black text-amber-800 mt-1 bg-amber-50 rounded-lg px-2 py-1 inline-block border border-amber-200">
                  {answeredInCurrentIsland} מתוך {questionsInCurrentIsland} שאלות
                </div>
              )}
            </>
          ) : (
            <>בוא נתחיל!</>
          )}
        </div>
        <SpeechInlineButton
          slotKey="map-guide"
          payload={{ kind: "single", text: mapGuideSpeechText, personality: "guide" }}
          className="shrink-0 w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-300 text-base flex items-center justify-center active:scale-95 hover:bg-amber-200 shadow-sm"
          titleIdle="השמע את הטקסט"
        />
      </div>

      {/* רצועת תוכים שהוצלו */}
      {rescuedCount > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-1 mb-2 shrink-0 bg-white/70 rounded-xl px-2 py-1 overflow-hidden">
          <span className="text-[10px] font-bold text-stone-600 whitespace-nowrap">
            תוכים שונים ({rescuedCount}/{UNIQUE_PARROT_COUNT}):
          </span>
          {inventory.rescuedParrotIds.map((pid) => {
            const parrot = PARROTS[pid as Topic];
            if (!parrot) return null;
            return (
              <div
                key={pid}
                className="flex items-center gap-0.5 bg-emerald-100 rounded-full px-1.5 py-0.5 shrink-0"
                title={`${parrot.name} - ${parrot.power}`}
              >
                <span className="text-sm">🦜</span>
                <span className="text-[10px] font-bold text-emerald-800">{parrot.name}</span>
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                    PEARL_COLOR_CLASSES[pid as Topic]
                  } border border-white`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* מפה — גלילה אנכית, זיגזג (Candy Crush), קו רק על מה שעברנו */}
      <div
        ref={mapScrollRef}
        className="flex-1 min-h-0 min-h-[120px] overflow-y-auto overflow-x-hidden rounded-3xl border-4 border-amber-300 shadow-inner overscroll-y-contain"
        style={{ maxHeight: `min(65dvh, ${MAP_SCROLL_MAX_HEIGHT_PX}px)` }}
      >
        {drawCount > 0 ? (
          <div
            className="relative mx-auto w-full max-w-md bg-gradient-to-b from-amber-50 via-cyan-100 to-sky-300"
            style={{ minHeight: drawCount * ROW_STRIDE_PX + 32 }}
          >
            <div className="absolute top-3 start-4 text-2xl opacity-70 pointer-events-none z-[1]">☁️</div>
            <div className="absolute top-8 end-6 text-xl opacity-60 pointer-events-none z-[1]">☁️</div>

            <svg
              className="absolute start-0 top-0 w-full pointer-events-none z-0"
              style={{ height: drawCount * ROW_STRIDE_PX + 32 }}
              viewBox={`0 0 100 ${drawCount * ROW_STRIDE_PX + 32}`}
              preserveAspectRatio="none"
            >
              {Array.from({ length: drawCount - 1 }, (_, seg) => {
                const passed = completed || seg < currentIdx;
                if (!passed) return null;
                const rowSeg = drawCount - 1 - seg;
                const rowNext = drawCount - 2 - seg;
                const y1 = rowSeg * ROW_STRIDE_PX + ROW_STRIDE_PX / 2;
                const y2 = rowNext * ROW_STRIDE_PX + ROW_STRIDE_PX / 2;
                const x1 = seg % 2 === 0 ? 24 : 76;
                const x2 = (seg + 1) % 2 === 0 ? 24 : 76;
                return (
                  <line
                    key={`path-${seg}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ca8a04"
                    strokeWidth={1.25}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            {Array.from({ length: drawCount }, (_, rowFromTop) => {
              const i = drawCount - 1 - rowFromTop;
              const isTreasureSpot = showsTreasure && i === drawCount - 1;
              const globalIdx = isTreasureSpot ? -1 : i;
              const island = !isTreasureSpot
                ? islands.find((isl) => isl.id === session.islandIds[globalIdx])
                : undefined;

              const isPast = !isTreasureSpot && islandIndexCompleted(globalIdx);
              const isCurrent = !isTreasureSpot && globalIdx === currentIdx && !completed;
              const isFuture = !isTreasureSpot && globalIdx > currentIdx;
              const isSkippedRevisit = island && skippedRevisitIslandIds.has(island.id);
              const questionCount = island?.questionIds.length ?? 0;
              const lockFuture = isFuture && !completed;
              const zigStart = i % 2 === 0;

              return (
                <div
                  key={isTreasureSpot ? "treasure" : `row-${session.islandIds[globalIdx]}`}
                  ref={(el) => {
                    if (el) islandRowRefs.current.set(i, el);
                    else islandRowRefs.current.delete(i);
                  }}
                  className={`relative z-[2] flex items-start pt-2 ${
                    zigStart ? "justify-start ps-4" : "justify-end pe-4"
                  }`}
                  style={{ minHeight: ROW_STRIDE_PX }}
                >
                  <div className="relative flex w-[112px] flex-col items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (island && !lockFuture) setSelectedIsland(island);
                      }}
                      disabled={isTreasureSpot || !!lockFuture}
                      className={`relative flex w-full flex-col items-center bg-transparent p-0 ${
                        lockFuture ? "cursor-not-allowed opacity-80" : "cursor-pointer active:scale-95"
                      } disabled:cursor-default`}
                      aria-label={
                        isTreasureSpot
                          ? "האוצר"
                          : island
                            ? lockFuture
                              ? `אי נעול — ${island.title}`
                              : `פרטי האי ${island.title}`
                            : "אי"
                      }
                    >
                      {isPast && island && !isSkippedRevisit && (
                        <div
                          className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 text-base leading-none drop-shadow-md"
                          aria-hidden
                        >
                          <span className="text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]">⭐</span>
                        </div>
                      )}
                      {isPast && island && isSkippedRevisit && (
                        <div
                          className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 text-sm leading-none"
                          title="דילגת — נחזור לכאן"
                          aria-hidden
                        >
                          🕐
                        </div>
                      )}

                      <div
                        className={`flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-full border-4 text-3xl transition-all ${
                          lockFuture ? "border-stone-300 bg-stone-100/80 grayscale blur-[0.5px]" : "border-amber-400 bg-white/95 shadow-md"
                        } ${isCurrent ? "ring-4 ring-amber-300 ring-offset-2 ring-offset-cyan-50 scale-105" : ""}`}
                      >
                        {isTreasureSpot ? "💎" : "🏝️"}
                      </div>

                      {lockFuture && (
                        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-sm" aria-hidden>
                          🔒
                        </div>
                      )}

                      {island && (
                        <p
                          className={`mt-1.5 w-full max-w-[7.5rem] text-center text-[10px] font-bold leading-tight line-clamp-2 min-h-[2.5rem] ${
                            isCurrent ? "text-amber-900" : isPast ? "text-emerald-800" : "text-stone-600"
                          }`}
                        >
                          {island.emoji} {island.title.split(" (")[0]}
                          <span className="block text-[9px] font-black opacity-80">· {questionCount}❓</span>
                        </p>
                      )}
                      {isTreasureSpot && (
                        <p className="mt-1.5 w-full max-w-[7.5rem] text-center text-[10px] font-black leading-tight line-clamp-2 text-amber-900">
                          האוצר! 🏆
                        </p>
                      )}
                    </button>

                    {!completed && isCurrent && (
                      <motion.div
                        className="pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2"
                        animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <div className="relative flex flex-col items-center">
                          <div className="rounded-full border-2 border-amber-400 bg-white p-0.5 shadow">
                            <PirateAvatar id={profile.pirateId} size={28} />
                          </div>
                          <div className="-mt-1 text-2xl drop-shadow-md">⛵</div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex justify-center items-center gap-2 shrink-0">
        {completed ? (
          <BigButton
            size="lg"
            variant="primary"
            onClick={() => {
              finishSession();
              navigate("/");
            }}
            icon="🏆"
          >
            סיימנו! חזרה הביתה
          </BigButton>
        ) : (
          <>
            <BigButton size="lg" variant="primary" onClick={() => navigate("/question")} icon="⛵">
              הפלגה לאי!
            </BigButton>
            <button
              onClick={() => navigate("/intro", { state: { returnTo: "/map" } })}
              className="bg-white/80 hover:bg-white active:scale-95 rounded-full p-2 shadow text-xl shrink-0"
              title="לשמוע שוב את הסיפור"
              aria-label="לשמוע שוב את הסיפור"
            >
              📜
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedIsland && (
          <IslandDetailModal
            island={selectedIsland}
            playerGrade={profile.grade}
            status={(() => {
              const idx = session.islandIds.indexOf(selectedIsland.id);
              if (idx < currentIdx) return "past";
              if (idx === currentIdx && !completed) return "current";
              return "future";
            })()}
            answeredCount={
              session.islandIds.indexOf(selectedIsland.id) === currentIdx
                ? session.currentQuestionInIslandIndex
                : 0
            }
            onClose={() => setSelectedIsland(null)}
            onSail={() => {
              setSelectedIsland(null);
              navigate("/question");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recentlyRescuedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={clearRecentRescue}
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-3xl p-6 max-w-sm shadow-2xl border-4 border-amber-400 text-center relative"
            >
              {[..."✨🌟⭐✨🌟"].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-3xl"
                  style={{
                    left: `${10 + i * 18}%`,
                    top: i % 2 === 0 ? "-10%" : "100%",
                  }}
                  animate={{ rotate: [0, 360], scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {emoji}
                </motion.span>
              ))}

              <div className="text-amber-700 font-black text-xl mb-2">
                {recentlyRescuedEvent.isNewToCrew ? "🎉 הצלת תוכי-פיראט! 🎉" : "🎉 סיימת אי נוסף! 🎉"}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed px-1 mb-2">
                עשרה חברי-תוכי (אחד לכל נושא). בכל אי — אותו חבר ברמת כיתה אחרת, לכן יש הרבה איים ורק עשר דמויות.
              </p>
              <div className="flex items-center justify-center gap-2 my-3 flex-row-reverse">
                <div className="bg-gradient-to-br from-sky-100 to-cyan-200 rounded-full p-1 border-2 border-amber-400">
                  <PirateAvatar id={profile.pirateId} size={56} />
                </div>
                <div className="text-3xl">🤝</div>
                <div>
                  <CagedParrot
                    topic={recentlyRescuedEvent.parrotId as Topic}
                    size={70}
                    state="free"
                    showPearl
                  />
                </div>
              </div>
              {(() => {
                const parrot = PARROTS[recentlyRescuedEvent.parrotId as Topic];
                if (!parrot) return null;
                const tier = profile.grade <= 2 ? parrot.younger : parrot.older;
                const freeMsg = tier.free[0];
                return (
                  <>
                    <div className="text-2xl font-black text-stone-800">{parrot.name}</div>
                    <div className="text-sm text-stone-600 my-2 px-2">&ldquo;{freeMsg}&rdquo;</div>
                    <div className="text-xs text-stone-500 italic px-2">⚡ {parrot.power}</div>
                    <div className="flex items-center justify-center gap-2 my-3">
                      <span className="text-xs font-bold text-stone-500">קיבלת פנינת</span>
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${
                          PEARL_COLOR_CLASSES[parrot.id as Topic]
                        } shadow border-2 border-white`}
                      />
                      <span className="text-xs font-bold text-stone-700">{parrot.color}</span>
                    </div>
                  </>
                );
              })()}
              <BigButton size="md" variant="primary" onClick={clearRecentRescue} icon="⛵">
                ממשיכים!
              </BigButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
