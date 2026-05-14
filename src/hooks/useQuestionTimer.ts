import { useEffect, useRef, useState } from "react";

interface TimerSnapshot {
  startedAt: number;
  activeMs: number;
  pausedMs: number;
  pauseCount: number;
}

/**
 * מד-זמן חבוי לשאלה.
 * - מודד זמן אקטיבי (כשהילד באמת מסתכל ועובד).
 * - מודד בנפרד זמן השהיה (pause) - לא נספר נגד הילד.
 * - גם כשהמסך מוסתר (טאב לא פעיל) הזמן עובר לקטגוריית "הפסקה".
 * - הילד לא רואה אותו - הוא מיועד למורה בלבד.
 */
export function useQuestionTimer(active: boolean) {
  const startRef = useRef<number>(Date.now());
  const activeMsRef = useRef<number>(0);
  const pausedMsRef = useRef<number>(0);
  const pauseCountRef = useRef<number>(0);
  const lastTickRef = useRef<number>(Date.now());
  const [, force] = useState(0);

  // איפוס במידה ולא פעיל בכניסה (מנע ספירה לפני שהשאלה מוצגת)
  useEffect(() => {
    startRef.current = Date.now();
    activeMsRef.current = 0;
    pausedMsRef.current = 0;
    pauseCountRef.current = 0;
    lastTickRef.current = Date.now();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      const isHidden = typeof document !== "undefined" && document.hidden;
      if (active && !isHidden) {
        activeMsRef.current += delta;
      } else {
        pausedMsRef.current += delta;
      }
      force((x) => x + 1);
    }, 500);
    return () => clearInterval(id);
  }, [active]);

  // עליה ל-pause כאשר active משתנה ל-false
  const prevActive = useRef(active);
  useEffect(() => {
    if (prevActive.current && !active) {
      pauseCountRef.current += 1;
    }
    prevActive.current = active;
  }, [active]);

  const snapshot = (): TimerSnapshot => ({
    startedAt: startRef.current,
    activeMs: activeMsRef.current,
    pausedMs: pausedMsRef.current,
    pauseCount: pauseCountRef.current,
  });

  return { snapshot };
}
