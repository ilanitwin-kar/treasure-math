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
import { ProfileHeaderButton } from "../components/ProfileHeaderButton";
import type { Island, Topic } from "../types";

/** גודל אי (קוטר), מרווח אנכי בין איים — ~4–5 איים בגובה מסך */
const ISLAND_DIAMETER_PX = 80;
const MIN_GAP_BETWEEN_ISLANDS_PX = 44;
const ROW_STRIDE_PX = ISLAND_DIAMETER_PX + MIN_GAP_BETWEEN_ISLANDS_PX;
const ISLAND_TOP_PAD_PX = 8;
const ISLAND_CENTER_Y_IN_ROW = ISLAND_TOP_PAD_PX + ISLAND_DIAMETER_PX / 2;

const PATH_SEG_DURATION_S = 1.5;

const MAP_ZOOM_STORAGE_KEY = "treasure-map-zoom";
const MAP_ZOOM_MIN = 0.6;
const MAP_ZOOM_MAX = 1.4;

function readStoredMapZoom(): number {
  try {
    const raw = localStorage.getItem(MAP_ZOOM_STORAGE_KEY);
    const v = raw == null ? NaN : Number(raw);
    if (Number.isFinite(v) && v >= MAP_ZOOM_MIN && v <= MAP_ZOOM_MAX) return v;
  } catch {
    /* ignore */
  }
  return 1;
}

function islandCenterXPercent(idx: number): number {
  return idx % 2 === 0 ? 78 : 22;
}

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
  const resumeSessionOrStartNew = useGameStore((s) => s.resumeSessionOrStartNew);
  const finishSession = useGameStore((s) => s.finishSession);

  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [drawingSegIndex, setDrawingSegIndex] = useState<number | null>(null);
  const prevIslandIdxRef = useRef<number | null>(null);
  const mapScrollRef = useRef<HTMLDivElement | null>(null);
  const islandRowRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const [mapZoom, setMapZoom] = useState(readStoredMapZoom);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const pinchRef = useRef<{ dist: number; zoomAtStart: number } | null>(null);
  const lastTapRef = useRef(0);
  const mapZoomRef = useRef(1);

  useEffect(() => {
    try {
      localStorage.setItem(MAP_ZOOM_STORAGE_KEY, String(mapZoom));
    } catch {
      /* ignore */
    }
  }, [mapZoom]);

  useEffect(() => {
    if (!mapFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mapFullscreen]);

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

  useEffect(() => {
    if (!session) return;
    const idx = session.currentIslandIndex;
    if (prevIslandIdxRef.current === null) {
      prevIslandIdxRef.current = idx;
      return;
    }
    if (idx > prevIslandIdxRef.current) {
      setDrawingSegIndex(idx - 1);
      window.setTimeout(() => setDrawingSegIndex(null), PATH_SEG_DURATION_S * 1000);
    }
    prevIslandIdxRef.current = idx;
  }, [session, session?.currentIslandIndex]);

  useLayoutEffect(() => {
    if (!session || drawCount === 0) return;
    const targetIdx = completed ? drawCount - 1 : Math.min(currentIdx, drawCount - 1);
    const el = islandRowRefs.current.get(targetIdx);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    });
  }, [session, currentIdx, completed, drawCount, totalIslands]);

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
  const mapContentHeightPx = drawCount * ROW_STRIDE_PX + 32;
  mapZoomRef.current = mapZoom;

  const bumpZoom = (delta: number) => {
    setMapZoom((z) => {
      const n = Math.round((z + delta) * 100) / 100;
      return Math.min(MAP_ZOOM_MAX, Math.max(MAP_ZOOM_MIN, n));
    });
  };

  const onMapTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const a = e.touches[0];
      const b = e.touches[1];
      pinchRef.current = {
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        zoomAtStart: mapZoomRef.current,
      };
    }
  };

  const onMapTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchRef.current) return;
    const a = e.touches[0];
    const b = e.touches[1];
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (pinchRef.current.dist < 8) return;
    const ratio = dist / pinchRef.current.dist;
    const raw = pinchRef.current.zoomAtStart * ratio;
    setMapZoom(Math.min(MAP_ZOOM_MAX, Math.max(MAP_ZOOM_MIN, raw)));
  };

  const onMapTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) return;
    pinchRef.current = null;
    if (e.changedTouches.length !== 1) return;
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      setMapFullscreen(true);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div className="min-h-[100dvh] min-h-0 w-full overflow-x-hidden overflow-y-auto flex flex-col px-2 py-2 relative" dir="rtl">
      {!mapFullscreen && (
        <>
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
        <ProfileHeaderButton />
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
        </>
      )}

      <motion.div
        layout
        transition={{ duration: 0.28, ease: "easeInOut" }}
        className={
          mapFullscreen
            ? "fixed inset-0 z-[500] flex flex-col bg-gradient-to-b from-slate-900/45 to-slate-900/80 p-2 pt-14"
            : "flex flex-1 min-h-0 flex-col shrink-0"
        }
      >
        {mapFullscreen && (
          <button
            type="button"
            onClick={() => setMapFullscreen(false)}
            className="absolute top-2 end-2 z-[520] w-10 h-10 rounded-full bg-white shadow-lg border-2 border-stone-300 text-lg font-black text-stone-700 flex items-center justify-center active:scale-95"
            aria-label="סגור מסך מלא"
          >
            ✕
          </button>
        )}
        <div className="flex flex-1 min-h-0 flex-row gap-1 w-full min-h-[120px]">
      {/* מפה — גלילה אנכית, זיגזג, זום */}
      <div
        ref={mapScrollRef}
        onTouchStart={onMapTouchStart}
        onTouchMove={onMapTouchMove}
        onTouchEnd={onMapTouchEnd}
        onDoubleClick={() => setMapFullscreen(true)}
        className="flex-1 min-h-0 min-h-[120px] overflow-y-auto overflow-x-hidden rounded-3xl border-4 border-amber-300 shadow-inner overscroll-y-contain touch-manipulation"
      >
        {drawCount > 0 ? (
          <div className="relative w-full mx-auto max-w-md" style={{ height: mapContentHeightPx * mapZoom }}>
            <div
              className="absolute top-0 left-1/2 w-full max-w-md -translate-x-1/2 origin-top"
              style={{ height: mapContentHeightPx, transform: `scale(${mapZoom})` }}
            >
          <div
            className="relative mx-auto w-full max-w-md bg-gradient-to-b from-amber-50 via-cyan-100 to-sky-300"
            style={{ minHeight: mapContentHeightPx }}
          >
            <div className="absolute top-3 start-4 text-2xl opacity-70 pointer-events-none z-[1]">☁️</div>
            <div className="absolute top-8 end-6 text-xl opacity-60 pointer-events-none z-[1]">☁️</div>

            <svg
              className="absolute start-0 top-0 w-full pointer-events-none z-0"
              style={{ height: mapContentHeightPx }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {(() => {
                const contentHLocal = mapContentHeightPx;
                const yNorm = (rowFromTop: number) =>
                  ((rowFromTop * ROW_STRIDE_PX + ISLAND_CENTER_Y_IN_ROW) / contentHLocal) * 100;
                return Array.from({ length: drawCount - 1 }, (_, seg) => {
                  const rowSeg = drawCount - 1 - seg;
                  const rowNext = drawCount - 2 - seg;
                  const x1 = islandCenterXPercent(seg);
                  const x2 = islandCenterXPercent(seg + 1);
                  const y1 = yNorm(rowSeg);
                  const y2 = yNorm(rowNext);
                  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
                  const isDrawing = drawingSegIndex === seg;

                  if (isDrawing) {
                    return (
                      <motion.line
                        key={`path-anim-${seg}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#ca8a04"
                        strokeWidth={0.9}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        strokeDasharray={len}
                        initial={{ strokeDashoffset: len }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: PATH_SEG_DURATION_S, ease: "easeInOut" }}
                      />
                    );
                  }

                  const passed = completed || seg < currentIdx;
                  const isNext = !completed && seg === currentIdx;
                  const isFuture = !completed && seg > currentIdx;

                  if (passed) {
                    return (
                      <line
                        key={`path-${seg}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#ca8a04"
                        strokeWidth={0.85}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }
                  if (isNext) {
                    return (
                      <line
                        key={`path-${seg}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#facc15"
                        strokeWidth={0.75}
                        strokeLinecap="round"
                        strokeDasharray="3 4"
                        opacity={0.95}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }
                  if (isFuture) {
                    return (
                      <line
                        key={`path-${seg}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#e7e5e4"
                        strokeWidth={0.65}
                        strokeLinecap="round"
                        strokeDasharray="2 5"
                        opacity={0.85}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  }
                  return null;
                });
              })()}
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
                      <motion.span
                        className="pointer-events-none absolute -top-7 left-1/2 z-30 -translate-x-1/2 text-2xl drop-shadow-md"
                        aria-hidden
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
                      >
                        📍
                      </motion.span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 justify-center shrink-0 self-stretch py-1">
        <button
          type="button"
          onClick={() => bumpZoom(0.1)}
          disabled={mapZoom >= MAP_ZOOM_MAX - 0.001}
          className="w-9 h-9 shrink-0 rounded-xl bg-white shadow border border-amber-300 text-lg font-black text-stone-800 active:scale-95 disabled:opacity-35"
          aria-label="הגדל מפה"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => bumpZoom(-0.1)}
          disabled={mapZoom <= MAP_ZOOM_MIN + 0.001}
          className="w-9 h-9 shrink-0 rounded-xl bg-white shadow border border-amber-300 text-lg font-black text-stone-800 active:scale-95 disabled:opacity-35"
          aria-label="הקטן מפה"
        >
          −
        </button>
      </div>
    </div>
    </motion.div>

      {!mapFullscreen && (
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
      )}

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
