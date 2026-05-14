import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Parrot } from "../components/Parrot";
import { BigButton } from "../components/BigButton";
import { useGameStore } from "../store/gameStore";
import { PEARL_COLOR_CLASSES, PARROTS, getParrotByTopic } from "../data/parrots";
import { PirateAvatar } from "../components/PirateAvatar";
import { CagedParrot } from "../components/CagedParrot";
import { IslandDetailModal } from "../components/IslandDetailModal";
import type { Island, Topic } from "../types";

interface Point {
  x: number;
  y: number;
}

/** כמה איים מציגים בו-זמנית במפה. */
const VISIBLE_WINDOW = 7;
/** כמה איים שכבר עברו רואים מתחת לאי הנוכחי. */
const PAST_VISIBLE = 2;

/**
 * מייצר עמדות איים בנתיב מתפתל מלמטה למעלה.
 * האי האחרון (אינדקס count-1) הוא בתחתית, הראשון בראש.
 * אבל כאן אנחנו מקבלים את האיים בסדר התקדמות (עבר->עתיד),
 * כך ש- index 0 בתחתית (= האי הראשון בחלון = הכי "מאחור" בעבר).
 */
function generateVerticalPositions(count: number): Point[] {
  const points: Point[] = [];
  if (count === 0) return points;
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    // y הולך מ-92 (למטה) ל-8 (למעלה)
    const y = 92 - t * 84;
    // x מתפתל ימינה-שמאלה כדי ליצור נתיב מעניין
    const x = 50 + Math.sin(t * Math.PI * 2.2) * 30;
    points.push({ x, y });
  }
  return points;
}

export function TreasureMapScreen() {
  const navigate = useNavigate();
  const profile = useGameStore((s) => s.profile);
  const session = useGameStore((s) => s.session);
  const islands = useGameStore((s) => s.islands);
  const inventory = useGameStore((s) => s.inventory);
  const recentlyRescuedParrotId = useGameStore((s) => s.recentlyRescuedParrotId);
  const clearRecentRescue = useGameStore((s) => s.clearRecentRescue);
  const resumeSessionOrStartNew = useGameStore((s) => s.resumeSessionOrStartNew);
  const finishSession = useGameStore((s) => s.finishSession);

  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);

  useEffect(() => {
    if (profile && !session) {
      resumeSessionOrStartNew();
    }
  }, [profile, session, resumeSessionOrStartNew]);

  const totalIslands = session?.islandIds.length ?? 0;
  const currentIdx = session?.currentIslandIndex ?? 0;
  const completed = session?.completedAt != null;

  /**
   * מחשב את החלון הנראה - איזה אינדקסים גלובליים של איים מציגים עכשיו.
   * הרעיון: כדי שהילד יראה התקדמות, הצג כמה איים שעברו (PAST_VISIBLE)
   * + האי הנוכחי + שאר העתיד עד למילוי VISIBLE_WINDOW.
   * האוצר מופיע בראש החלון רק כאשר באמת מתקרבים אליו.
   */
  const window = useMemo(() => {
    if (totalIslands === 0) return { start: 0, end: 0, indices: [] as number[], showsTreasure: false };

    const start = Math.max(0, currentIdx - PAST_VISIBLE);
    const end = Math.min(totalIslands, start + VISIBLE_WINDOW);
    // הזזה אם בקצה - שיהיה תמיד VISIBLE_WINDOW פריטים אם אפשר
    const adjustedStart = Math.max(0, end - VISIBLE_WINDOW);
    const indices: number[] = [];
    for (let i = adjustedStart; i < end; i++) {
      indices.push(i);
    }
    const showsTreasure = end === totalIslands;
    return { start: adjustedStart, end, indices, showsTreasure };
  }, [currentIdx, totalIslands]);

  /**
   * עמדות הציור: כמה נקודות יש בפועל במסך.
   * אם החלון כולל את האי האחרון - מוסיפים עמדה נוספת לאוצר.
   */
  const drawCount = window.indices.length + (window.showsTreasure ? 1 : 0);
  // הופכים את הסדר: באינדקס 0 (בתחתית) האי הראשון בחלון, באינדקס המקסימלי - האוצר/אי האחרון.
  // generateVerticalPositions כבר מחזיר מלמטה למעלה.
  const positions = useMemo(() => generateVerticalPositions(drawCount), [drawCount]);

  const currentIsland = session
    ? islands.find((i) => i.id === session.islandIds[session.currentIslandIndex])
    : undefined;

  if (!profile) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!session) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Parrot mood="thinking" size={120} />
      </div>
    );
  }

  const currentParrot = currentIsland ? getParrotByTopic(currentIsland.topic) : null;
  const rescuedCount = inventory.rescuedParrotIds.length;

  return (
    <div className="min-h-full flex flex-col px-3 py-3 relative">
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

      {/* תוכי + תיבה קומפקטית - לאי הבא */}
      <div className="flex items-center gap-2 mb-2 shrink-0 bg-white/90 rounded-2xl border-2 border-amber-300 shadow p-2">
        <Parrot size={48} mood={completed ? "celebrating" : "happy"} />
        <div className="flex-1 text-sm font-bold text-stone-700 leading-tight">
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
                התוכי <span className="font-black text-amber-700">{currentParrot.name}</span>
                {" "}מחכה לעזרה · {currentIsland.questionIds.length} שאלות
              </div>
            </>
          ) : (
            <>בוא נתחיל!</>
          )}
        </div>
      </div>

      {/* רצועת תוכים שהוצלו */}
      {rescuedCount > 0 && (
        <div className="flex items-center gap-1 mb-2 shrink-0 bg-white/70 rounded-xl px-2 py-1 overflow-x-auto">
          <span className="text-[10px] font-bold text-stone-600 whitespace-nowrap">
            הוצלו ({rescuedCount}):
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

      {/* המפה - מלמטה למעלה */}
      <div className="relative flex-1 bg-gradient-to-t from-sky-300 via-cyan-100 to-amber-50 rounded-3xl border-4 border-amber-300 shadow-inner overflow-hidden min-h-[480px]">
        {/* גלים בתחתית (ים) */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,88 Q15,84 30,88 T60,88 T100,88" stroke="#0891b2" strokeWidth="0.5" fill="none" />
          <path d="M0,94 Q15,90 30,94 T60,94 T100,94" stroke="#0891b2" strokeWidth="0.5" fill="none" />
        </svg>

        {/* כמה עננים בראש */}
        <div className="absolute top-2 left-4 text-2xl opacity-70">☁️</div>
        <div className="absolute top-6 right-6 text-xl opacity-60">☁️</div>

        {/* אינדיקטור - איים מאחור (אם יש) */}
        {window.start > 0 && (
          <div className="absolute bottom-1 right-2 bg-white/70 rounded-full px-2 py-0.5 text-[10px] font-bold text-stone-600">
            ⬇ עוד {window.start} איים שעברנו
          </div>
        )}
        {/* אינדיקטור - איים לפנינו (אם יש) */}
        {!window.showsTreasure && (
          <div className="absolute top-1 left-2 bg-white/70 rounded-full px-2 py-0.5 text-[10px] font-bold text-stone-600">
            ⬆ עוד {totalIslands - window.end} איים בדרך
          </div>
        )}

        {/* נתיב מקווקו בין איים */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {positions.map((p, i) => {
            if (i === 0) return null;
            const prev = positions[i - 1];
            // האם הקטע הזה כבר עבר?
            const localIdx = i; // המיקום בחלון, 0 = תחתון
            const globalIdx = window.indices[localIdx] ?? totalIslands; // האוצר = totalIslands
            const isPast = globalIdx <= currentIdx;
            return (
              <line
                key={i}
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                stroke="#d97706"
                strokeWidth="0.5"
                strokeDasharray="2 1.5"
                opacity={isPast ? 0.9 : 0.4}
              />
            );
          })}
        </svg>

        {/* האיים */}
        {positions.map((p, i) => {
          const isTreasureSpot = window.showsTreasure && i === positions.length - 1;
          const globalIdx = window.indices[i];
          const island = !isTreasureSpot ? islands.find((isl) => isl.id === session.islandIds[globalIdx]) : undefined;
          const isPast = globalIdx < currentIdx;
          const isCurrent = !isTreasureSpot && globalIdx === currentIdx && !completed;
          const isFuture = !isTreasureSpot && globalIdx > currentIdx;
          // הצגת השעון בכל אי - כמה שאלות
          const questionCount = island?.questionIds.length ?? 0;

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.07, type: "spring" }}
            >
              <button
                onClick={() => {
                  if (island) setSelectedIsland(island);
                }}
                disabled={isTreasureSpot}
                className="relative flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer active:scale-95 disabled:cursor-default disabled:active:scale-100"
                aria-label={island ? `פרטי האי ${island.title}` : "האוצר"}
              >
                <div
                  className={`text-5xl md:text-6xl select-none transition-all ${
                    isFuture ? "grayscale opacity-60" : ""
                  } ${isCurrent ? "drop-shadow-xl scale-110" : ""}`}
                >
                  {isTreasureSpot ? "💎" : "🏝️"}
                </div>

                {/* תווית האי + מספר שאלות */}
                {island && (
                  <div
                    className={`absolute top-full mt-1 text-[11px] sm:text-xs font-bold whitespace-nowrap px-2 py-0.5 rounded-md shadow-sm ${
                      isCurrent
                        ? "bg-amber-400 text-white"
                        : isPast
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-white/80 text-stone-600"
                    }`}
                  >
                    {island.emoji} {island.title.split(" (")[0]}
                    <span className="opacity-70"> · {questionCount}❓</span>
                  </div>
                )}
                {isTreasureSpot && (
                  <div className="absolute top-full mt-1 text-xs font-black whitespace-nowrap px-2 py-0.5 rounded-md bg-amber-500 text-white shadow">
                    האוצר! 🏆
                  </div>
                )}

                {isCurrent && (
                  <motion.div
                    className="absolute -top-4 -right-3 text-2xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    📍
                  </motion.div>
                )}
                {isPast && (
                  <div className="absolute -top-1 -right-1 text-lg bg-emerald-500 rounded-full w-6 h-6 flex items-center justify-center text-white font-black border-2 border-white shadow">
                    ✓
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}

        {/* ספינה עם הפיראט ליד האי הנוכחי */}
        {!completed &&
          (() => {
            const localCurrentIdx = window.indices.indexOf(currentIdx);
            if (localCurrentIdx === -1 || !positions[localCurrentIdx]) return null;
            const pos = positions[localCurrentIdx];
            return (
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: `${pos.x - 10}%`,
                  top: `${pos.y - 4}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="relative">
                  {/* האווטר על הספינה */}
                  <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white rounded-full p-0.5 border-2 border-amber-400 shadow">
                    <PirateAvatar id={profile.pirateId} size={28} />
                  </div>
                  {/* הספינה */}
                  <div className="text-4xl">⛵</div>
                </div>
              </motion.div>
            );
          })()}
      </div>

      <div className="mt-3 flex justify-center items-center gap-2 shrink-0">
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
              onClick={() =>
                navigate("/intro", { state: { returnTo: "/map" } })
              }
              className="bg-white/80 hover:bg-white active:scale-95 rounded-full p-2 shadow text-xl shrink-0"
              title="לשמוע שוב את הסיפור"
              aria-label="לשמוע שוב את הסיפור"
            >
              📜
            </button>
          </>
        )}
      </div>

      {/* מודאל פרטי האי - שיוצג כשלוחצים על אי במפה */}
      <AnimatePresence>
        {selectedIsland && (
          <IslandDetailModal
            island={selectedIsland}
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

      {/* פופאפ: הצלת תוכי */}
      <AnimatePresence>
        {recentlyRescuedParrotId && (
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
              {/* כוכבים סביב */}
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
                🎉 הצלת תוכי-פיראט! 🎉
              </div>
              {/* הפיראט והתוכי - יחד! */}
              <div className="flex items-center justify-center gap-2 my-3">
                <div className="bg-gradient-to-br from-sky-100 to-cyan-200 rounded-full p-1 border-2 border-amber-400">
                  <PirateAvatar id={profile.pirateId} size={56} />
                </div>
                <div className="text-3xl">🤝</div>
                <div>
                  <CagedParrot
                    topic={recentlyRescuedParrotId as Topic}
                    size={70}
                    state="free"
                    showPearl
                  />
                </div>
              </div>
              {(() => {
                const parrot = PARROTS[recentlyRescuedParrotId as Topic];
                if (!parrot) return null;
                const tier = profile.grade <= 2 ? parrot.younger : parrot.older;
                const freeMsg = tier.free[0];
                return (
                  <>
                    <div className="text-2xl font-black text-stone-800">
                      {parrot.name}
                    </div>
                    <div className="text-sm text-stone-600 my-2 px-2">
                      &ldquo;{freeMsg}&rdquo;
                    </div>
                    <div className="text-xs text-stone-500 italic px-2">
                      ⚡ {parrot.power}
                    </div>
                    <div className="flex items-center justify-center gap-2 my-3">
                      <span className="text-xs font-bold text-stone-500">
                        קיבלת פנינת
                      </span>
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
              <BigButton
                size="md"
                variant="primary"
                onClick={clearRecentRescue}
                icon="⛵"
              >
                ממשיכים!
              </BigButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
