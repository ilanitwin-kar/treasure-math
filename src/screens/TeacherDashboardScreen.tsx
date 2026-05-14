import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  loadAllProfiles,
  loadSessionsForStudent,
  loadInventory,
} from "../storage/storage";
import {
  buildStudentReport,
  formatLastActive,
  formatMs,
  topicLabel,
  type StudentReport,
} from "../data/teacherInsights";
import type { StudentProfile } from "../types";
import { UNIQUE_PARROT_COUNT } from "../data/parrots";

/**
 * סיסמה לכניסה לדשבורד המורה.
 * חשוב: בייצור אמיתי - יש להחליף ב-Firebase Auth.
 * כרגע זו אבטחה בסיסית בצד הלקוח כדי שילד לא ייכנס בטעות.
 */
const TEACHER_PIN = "1234";

export function TeacherDashboardScreen() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (authenticated) {
      setProfiles(loadAllProfiles());
    }
  }, [authenticated, refreshKey]);

  // רענון אוטומטי כל 5 שניות כדי לראות התקדמות בזמן אמת.
  useEffect(() => {
    if (!authenticated) return;
    const id = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [authenticated]);

  const selectedProfile = useMemo(
    () => profiles.find((p) => p.id === selectedStudentId) ?? null,
    [selectedStudentId, profiles]
  );

  const report: StudentReport | null = useMemo(() => {
    if (!selectedProfile) return null;
    const sessions = loadSessionsForStudent(selectedProfile.id);
    return buildStudentReport(selectedProfile, sessions);
    // refreshKey משמש כדי לרענן את המאמ"ו - eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile, refreshKey]);

  const inventory = useMemo(
    () => (selectedProfile ? loadInventory(selectedProfile.id) : null),
    [selectedProfile, refreshKey]
  );

  if (!authenticated) {
    return (
      <div className="h-full min-h-0 overflow-hidden flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-b from-slate-100 to-slate-200">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full border-4 border-slate-300"
        >
          <div className="text-5xl text-center mb-2">👩‍🏫</div>
          <h1 className="text-2xl font-black text-slate-800 text-center mb-1">
            כניסת מורה
          </h1>
          <p className="text-sm text-slate-500 text-center mb-5">
            הזיני את ה-PIN שלך
          </p>
          <input
            type="password"
            inputMode="numeric"
            placeholder="• • • •"
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setPinError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (pinInput === TEACHER_PIN) {
                  setAuthenticated(true);
                } else {
                  setPinError(true);
                }
              }
            }}
            className={`w-full text-2xl text-center bg-slate-50 border-4 rounded-2xl px-4 py-3 font-black tracking-widest ${
              pinError ? "border-red-400" : "border-slate-200"
            } focus:border-slate-400 focus:outline-none`}
            maxLength={6}
            autoFocus
          />
          {pinError && (
            <div className="text-red-600 text-sm font-bold text-center mt-2">
              PIN שגוי. ברירת מחדל: 1234
            </div>
          )}
          <button
            onClick={() => {
              if (pinInput === TEACHER_PIN) {
                setAuthenticated(true);
              } else {
                setPinError(true);
              }
            }}
            className="w-full mt-4 bg-slate-700 hover:bg-slate-800 active:scale-95 text-white font-black py-3 rounded-2xl text-lg shadow"
          >
            כניסה
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-2 text-slate-500 hover:text-slate-700 text-sm py-2"
          >
            חזרה לאפליקציה
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden flex flex-col bg-slate-50 px-2 py-2">
      {/* כותרת */}
      <div className="flex items-center justify-between mb-2 shrink-0 bg-slate-50 py-1 z-10">
        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
          👩‍🏫 לוח המורה
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="text-sm font-bold text-slate-600 bg-white border-2 border-slate-300 rounded-xl px-3 py-1.5 active:scale-95"
            title="רענן נתונים"
          >
            🔄
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-bold text-slate-600 bg-white border-2 border-slate-300 rounded-xl px-3 py-1.5 active:scale-95"
          >
            חזרה
          </button>
        </div>
      </div>

      {/* הסבר על איך הנתונים מתעדכנים */}
      <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-1.5 mb-2 text-[11px] text-sky-900 flex items-center gap-2 shrink-0 leading-tight">
        <span className="text-lg">ℹ️</span>
        <span>
          הנתונים מתעדכנים אוטומטית בכל פעם שהילד עונה על שאלה.
          הלוח מתרענן כל 5 שניות לבד.
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2">
      {!selectedProfile ? (
        // ============= רשימת ילדים =============
        <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
          <p className="text-slate-600 mb-3 text-sm">
            בחרי תלמיד כדי לראות דוח מפורט
          </p>
          {profiles.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border-2 border-slate-200">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-stone-600">
                עדיין אין תלמידים במערכת.
                <br />
                ילדים שייצרו פרופיל יופיעו כאן.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-0 overflow-hidden auto-rows-min content-start">
              {profiles.map((profile) => {
                const sessions = loadSessionsForStudent(profile.id);
                const allAttempts = sessions.flatMap((s) => s.attempts);
                const totalAttempts = allAttempts.length;
                const correctCount = allAttempts.filter((a) => a.status === "correct").length;
                const successRate = totalAttempts > 0
                  ? Math.round((correctCount / totalAttempts) * 100)
                  : null;
                const hasActive = sessions.some((s) => s.completedAt == null);
                const lastActive = sessions.reduce<number | null>(
                  (max, s) => (max == null || s.lastActiveAt > max ? s.lastActiveAt : max),
                  null
                );
                return (
                  <motion.button
                    key={profile.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedStudentId(profile.id)}
                    className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow text-right hover:border-amber-400 active:scale-95 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="font-black text-lg text-slate-800">
                          {profile.name}
                        </div>
                        {hasActive && (
                          <span
                            className="bg-sky-100 text-sky-700 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                            title="יש מסע פעיל כרגע"
                          >
                            🚢
                          </span>
                        )}
                      </div>
                      {successRate !== null && (
                        <div
                          className={`text-xs font-black rounded-full px-2 py-0.5 ${
                            successRate >= 75
                              ? "bg-emerald-100 text-emerald-800"
                              : successRate >= 50
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {successRate}%
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      כיתה {["", "א'", "ב'", "ג'", "ד'", "ה'", "ו'"][profile.grade]} ·
                      גיל {profile.age}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>
                        {totalAttempts} שאלות · {sessions.length} מסעות
                      </span>
                      <span>{formatLastActive(lastActive)}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      ) : report ? (
        // ============= דוח מפורט =============
        <div className="space-y-2 min-h-0 flex-1 overflow-hidden flex flex-col">
          <button
            onClick={() => setSelectedStudentId(null)}
            className="text-sm font-bold text-slate-600 mb-2 active:scale-95"
          >
            ← רשימת תלמידים
          </button>

          {/* פרופיל */}
          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-black text-slate-800">
                {report.profile.name}
              </h2>
              <span className="text-sm text-slate-500">
                כיתה {["", "א'", "ב'", "ג'", "ד'", "ה'", "ו'"][report.profile.grade]} · {report.profile.age} שנים
              </span>
            </div>

            {/* שורת סטטוס המסעות */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
              <span
                className={`rounded-full px-2 py-0.5 font-bold ${
                  report.hasActiveSession
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {report.hasActiveSession ? "🚢 מסע פעיל" : "⚓ אין מסע פעיל"}
              </span>
              <span className="bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-bold">
                ✅ הושלמו: {report.completedSessions}
              </span>
              <span className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 font-bold">
                סך הכול: {report.totalSessions}
              </span>
              <span className="text-slate-500">· {formatLastActive(report.lastActiveAt)}</span>
            </div>

            {report.totalAttempts === 0 ? (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">📋</div>
                <div className="text-stone-700 font-bold text-sm">
                  הילד עדיין לא ענה על שאלות.
                </div>
                <div className="text-stone-500 text-xs mt-1">
                  הנתונים מתעדכנים אוטומטית בכל פעם שהילד עונה על שאלה.
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <Stat label="שאלות" value={report.totalAttempts.toString()} color="slate" />
                  <Stat label="נכונות" value={report.totalCorrect.toString()} color="emerald" />
                  <Stat label="טעויות" value={report.totalIncorrect.toString()} color="red" />
                  <Stat label="דילוגים" value={report.totalSkipped.toString()} color="amber" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Stat label="ממוצע זמן לשאלה" value={formatMs(report.averageTimePerQuestionMs)} color="sky" />
                  <Stat label='סה"כ זמן פעיל' value={formatMs(report.totalActiveTimeMs)} color="slate" />
                </div>
              </>
            )}

            {inventory && (
              <div className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-2">
                💎 צבר <span className="font-black text-amber-700">{inventory.pearls}</span> פנינים ·
                הציל{" "}
                <span className="font-black text-emerald-700">{inventory.rescuedParrotIds.length}</span> מתוך{" "}
                {UNIQUE_PARROT_COUNT} תוכים (דמות לכל נושא — לא מספר האיים)
              </div>
            )}
          </div>

          {/* המלצות */}
          {report.recommendations.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 shadow">
              <h3 className="font-black text-amber-800 mb-2">💡 המלצות עבורך, המורה:</h3>
              <ul className="space-y-1.5">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-stone-700 leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* חוזקות וחולשות */}
          {(report.strengths.length > 0 || report.weaknesses.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.strengths.length > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-3 border-2 border-emerald-200">
                  <h3 className="font-black text-emerald-800 mb-2">💪 חוזקות</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {report.strengths.map((t) => (
                      <span
                        key={t}
                        className="bg-emerald-200 text-emerald-900 rounded-full px-2 py-0.5 text-xs font-bold"
                      >
                        {topicLabel(t)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {report.weaknesses.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-3 border-2 border-red-200">
                  <h3 className="font-black text-red-800 mb-2">📌 לחזק</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {report.weaknesses.map((t) => (
                      <span
                        key={t}
                        className="bg-red-200 text-red-900 rounded-full px-2 py-0.5 text-xs font-bold"
                      >
                        {topicLabel(t)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ביצועים לפי נושא */}
          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow">
            <h3 className="font-black text-slate-800 mb-3">📊 ביצועים לפי נושא</h3>
            <div className="space-y-2">
              {report.topicInsights.map((insight) => {
                const successRate = insight.totalQuestions > 0
                  ? Math.round((insight.correct / insight.totalQuestions) * 100)
                  : 0;
                return (
                  <div key={insight.topic} className="bg-slate-50 rounded-xl p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-bold text-slate-800 text-sm">
                        {topicLabel(insight.topic)}
                      </div>
                      <div
                        className={`text-xs font-black rounded-full px-2 py-0.5 ${
                          successRate >= 75
                            ? "bg-emerald-100 text-emerald-800"
                            : successRate >= 50
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {successRate}%
                      </div>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white">
                      {insight.correct > 0 && (
                        <div
                          className="bg-emerald-500"
                          style={{ width: `${(insight.correct / insight.totalQuestions) * 100}%` }}
                        />
                      )}
                      {insight.incorrect > 0 && (
                        <div
                          className="bg-red-400"
                          style={{ width: `${(insight.incorrect / insight.totalQuestions) * 100}%` }}
                        />
                      )}
                      {insight.skipped > 0 && (
                        <div
                          className="bg-amber-400"
                          style={{ width: `${(insight.skipped / insight.totalQuestions) * 100}%` }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>
                        ✓ {insight.correct} · ✗ {insight.incorrect} · ⏭ {insight.skipped}
                      </span>
                      <span>
                        ממוצע {formatMs(insight.averageTimeMs)} · ארוך {formatMs(insight.longestTimeMs)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* טעויות ספציפיות */}
          {report.incorrectAttempts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow">
              <h3 className="font-black text-slate-800 mb-3">
                ❌ טעויות ({report.incorrectAttempts.length})
              </h3>
              <div className="space-y-1.5 max-h-[22vh] overflow-hidden">
                {report.incorrectAttempts.slice(0, 6).map((d, i) => (
                  <div key={i} className="bg-red-50 rounded-xl p-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="font-bold text-red-700">
                        {topicLabel(d.topic)}
                      </span>
                      <span className="text-slate-500">{formatMs(d.timeMs)}</span>
                    </div>
                    <div className="text-stone-800 line-clamp-2">{d.questionText}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      תשובת הילד:{" "}
                      <span className="font-black text-red-700">{d.studentAnswer}</span>
                      {" · "}
                      נכון:{" "}
                      <span className="font-black text-emerald-700">{d.correctAnswer}</span>
                    </div>
                  </div>
                ))}
                {report.incorrectAttempts.length > 6 && (
                  <p className="text-[10px] text-slate-500 text-center pt-0.5">
                    + עוד {report.incorrectAttempts.length - 6} טעויות
                  </p>
                )}
              </div>
            </div>
          )}

          {/* דילוגים */}
          {report.skippedAttempts.length > 0 && (
            <div className="bg-white rounded-2xl p-3 border-2 border-slate-200 shadow shrink-0">
              <h3 className="font-black text-slate-800 mb-2 text-sm">
                ⏭ דילוגים ({report.skippedAttempts.length})
              </h3>
              <div className="space-y-1.5 max-h-[18vh] overflow-hidden">
                {report.skippedAttempts.slice(0, 5).map((d, i) => (
                  <div key={i} className="bg-amber-50 rounded-xl p-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="font-bold text-amber-700">
                        {topicLabel(d.topic)}
                      </span>
                      <span className="text-slate-500">{formatMs(d.timeMs)}</span>
                    </div>
                    <div className="text-stone-800 line-clamp-2">{d.questionText}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      תשובה נכונה: <span className="font-black text-emerald-700">{d.correctAnswer}</span>
                    </div>
                  </div>
                ))}
                {report.skippedAttempts.length > 5 && (
                  <p className="text-[10px] text-slate-500 text-center">
                    + עוד {report.skippedAttempts.length - 5} דילוגים
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "slate" | "emerald" | "red" | "amber" | "sky";
}) {
  const colorClasses = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
  } as const;
  return (
    <div className={`${colorClasses[color]} rounded-xl p-2 text-center`}>
      <div className="text-xl font-black leading-none">{value}</div>
      <div className="text-[10px] mt-1">{label}</div>
    </div>
  );
}
