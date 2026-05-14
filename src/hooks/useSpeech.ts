import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ParrotPersonality } from "../types";

const MUTE_STORAGE_KEY = "isMuted";

export type SpeechVoiceKey = ParrotPersonality | "captain" | "guide";

export type InlineSpeechPhase = "idle" | "speaking" | "paused";

export const VOICE_CONFIG: Record<
  SpeechVoiceKey,
  { rate: number; pitch: number }
> = {
  captain: { rate: 0.8, pitch: 0.8 },
  guide: { rate: 1.0, pitch: 1.2 },
  smart: { rate: 0.9, pitch: 1.0 },
  emotional: { rate: 1.0, pitch: 1.3 },
  grumpy: { rate: 0.85, pitch: 0.9 },
  showoff: { rate: 1.1, pitch: 1.1 },
  calm: { rate: 0.8, pitch: 1.0 },
  dramatic: { rate: 1.1, pitch: 1.4 },
  artist: { rate: 0.9, pitch: 1.2 },
  storyteller: { rate: 0.85, pitch: 1.1 },
  rushed: { rate: 1.2, pitch: 1.2 },
  silly: { rate: 1.0, pitch: 1.4 },
};

/** מסיר אמוג'ים וריווחים מיותרים — קריאה נוחה יותר ב־TTS בעברית. */
export function stripForSpeech(raw: string): string {
  if (!raw) return "";
  let s = raw.replace(/\s+/g, " ").trim();
  try {
    s = s.replace(/\p{Extended_Pictographic}/gu, "");
  } catch {
    // סביבות ישנות בלי Unicode property escapes
  }
  return s.replace(/\s+/g, " ").trim();
}

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  const s = window.speechSynthesis;
  return s && typeof s.speak === "function" ? s : null;
}

function synthSupportsPauseResume(syn: SpeechSynthesis): boolean {
  return typeof syn.pause === "function" && typeof syn.resume === "function";
}

export type InlineSpeechPayload =
  | { kind: "single"; text: string; personality?: SpeechVoiceKey }
  | {
      kind: "sequential";
      parts: Array<{ text: string; personality?: SpeechVoiceKey }>;
    };

/** תצורת כפתור inline ב־SpeechBubble */
export type SpeechReplayConfig = { slotKey: string } & InlineSpeechPayload;

interface SpeechContextValue {
  speak: (text: string, personality?: SpeechVoiceKey) => void;
  speakSequential: (
    parts: Array<{ text: string; personality?: SpeechVoiceKey }>
  ) => void;
  /** השמעה עם מפתח לכפתור inline (🔊 / ⏸️ / ▶️) */
  speakKeyed: (
    slotKey: string,
    text: string,
    personality?: SpeechVoiceKey
  ) => void;
  speakSequentialKeyed: (
    slotKey: string,
    parts: Array<{ text: string; personality?: SpeechVoiceKey }>
  ) => void;
  getInlinePhase: (slotKey: string) => InlineSpeechPhase;
  toggleInlineSpeech: (slotKey: string, payload: InlineSpeechPayload) => void;
  /** אייקון לכפתור ליד טקסט */
  getInlineToggleGlyph: (slotKey: string) => string;
  stop: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

function readMutedFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(readMutedFromStorage);
  const [activeSlotKey, setActiveSlotKey] = useState<string | null>(null);
  const [activeSlotPhase, setActiveSlotPhase] = useState<"speaking" | "paused">(
    "speaking"
  );
  const activeSlotKeyRef = useRef<string | null>(null);

  const clearSlot = useCallback(() => {
    activeSlotKeyRef.current = null;
    setActiveSlotKey(null);
  }, []);

  const markSlotSpeaking = useCallback((key: string) => {
    activeSlotKeyRef.current = key;
    setActiveSlotKey(key);
    setActiveSlotPhase("speaking");
  }, []);

  const stop = useCallback(() => {
    const syn = getSynth();
    if (syn) syn.cancel();
    clearSlot();
  }, [clearSlot]);

  const speak = useCallback(
    (text: string, personality?: SpeechVoiceKey) => {
      const syn = getSynth();
      if (!syn || isMuted) return;
      const plain = stripForSpeech(text);
      if (!plain) return;
      syn.cancel();
      clearSlot();
      const u = new SpeechSynthesisUtterance(plain);
      u.lang = "he-IL";
      const key = personality ?? "guide";
      const config = VOICE_CONFIG[key] ?? VOICE_CONFIG.guide;
      u.rate = config.rate;
      u.pitch = config.pitch;
      syn.speak(u);
    },
    [isMuted, clearSlot]
  );

  const speakSequential = useCallback(
    (parts: Array<{ text: string; personality?: SpeechVoiceKey }>) => {
      const syn = getSynth();
      if (!syn || isMuted) return;
      syn.cancel();
      clearSlot();
      const filtered = parts
        .map((p) => ({
          text: stripForSpeech(p.text),
          personality: p.personality ?? "guide",
        }))
        .filter((p) => p.text.length > 0);
      if (filtered.length === 0) return;

      let idx = 0;
      const speakNext = () => {
        if (idx >= filtered.length) return;
        const { text, personality } = filtered[idx];
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "he-IL";
        const cfg = VOICE_CONFIG[personality] ?? VOICE_CONFIG.guide;
        u.rate = cfg.rate;
        u.pitch = cfg.pitch;
        u.onend = () => {
          idx += 1;
          speakNext();
        };
        syn.speak(u);
      };
      speakNext();
    },
    [isMuted, clearSlot]
  );

  const speakKeyed = useCallback(
    (slotKey: string, text: string, personality?: SpeechVoiceKey) => {
      const syn = getSynth();
      if (!syn || isMuted) return;
      const plain = stripForSpeech(text);
      if (!plain) return;
      syn.cancel();
      clearSlot();
      markSlotSpeaking(slotKey);
      const u = new SpeechSynthesisUtterance(plain);
      u.lang = "he-IL";
      const key = personality ?? "guide";
      const config = VOICE_CONFIG[key] ?? VOICE_CONFIG.guide;
      u.rate = config.rate;
      u.pitch = config.pitch;
      u.onend = () => {
        if (activeSlotKeyRef.current === slotKey) clearSlot();
      };
      syn.speak(u);
    },
    [isMuted, markSlotSpeaking, clearSlot]
  );

  const speakSequentialKeyed = useCallback(
    (slotKey: string, parts: Array<{ text: string; personality?: SpeechVoiceKey }>) => {
      const syn = getSynth();
      if (!syn || isMuted) return;
      syn.cancel();
      clearSlot();
      const filtered = parts
        .map((p) => ({
          text: stripForSpeech(p.text),
          personality: p.personality ?? "guide",
        }))
        .filter((p) => p.text.length > 0);
      if (filtered.length === 0) {
        clearSlot();
        return;
      }
      markSlotSpeaking(slotKey);

      let idx = 0;
      const speakNext = () => {
        if (idx >= filtered.length) {
          if (activeSlotKeyRef.current === slotKey) clearSlot();
          return;
        }
        const { text, personality } = filtered[idx];
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "he-IL";
        const cfg = VOICE_CONFIG[personality] ?? VOICE_CONFIG.guide;
        u.rate = cfg.rate;
        u.pitch = cfg.pitch;
        u.onend = () => {
          idx += 1;
          speakNext();
        };
        syn.speak(u);
      };
      speakNext();
    },
    [isMuted, markSlotSpeaking, clearSlot]
  );

  const startInlineFromPayload = useCallback(
    (slotKey: string, payload: InlineSpeechPayload) => {
      if (payload.kind === "single") {
        speakKeyed(slotKey, payload.text, payload.personality);
      } else {
        speakSequentialKeyed(slotKey, payload.parts);
      }
    },
    [speakKeyed, speakSequentialKeyed]
  );

  const getInlinePhase = useCallback(
    (slotKey: string): InlineSpeechPhase => {
      if (!activeSlotKey || activeSlotKey !== slotKey) return "idle";
      return activeSlotPhase === "paused" ? "paused" : "speaking";
    },
    [activeSlotKey, activeSlotPhase]
  );

  const getInlineToggleGlyph = useCallback(
    (slotKey: string): string => {
      const p = getInlinePhase(slotKey);
      if (p === "speaking") return "⏸️";
      if (p === "paused") return "▶️";
      return "🔊";
    },
    [getInlinePhase]
  );

  const toggleInlineSpeech = useCallback(
    (slotKey: string, payload: InlineSpeechPayload) => {
      const syn = getSynth();
      if (!syn) return;
      if (isMuted && getInlinePhase(slotKey) === "idle") return;

      const same = activeSlotKey === slotKey;
      const phase = getInlinePhase(slotKey);

      if (same && phase === "speaking") {
        if (synthSupportsPauseResume(syn)) {
          try {
            syn.pause();
          } catch {
            /* ignore */
          }
          setActiveSlotPhase("paused");
        } else {
          syn.cancel();
          clearSlot();
        }
        return;
      }

      if (same && phase === "paused") {
        if (synthSupportsPauseResume(syn)) {
          try {
            syn.resume();
          } catch {
            /* ignore */
          }
          setActiveSlotPhase("speaking");
        } else {
          startInlineFromPayload(slotKey, payload);
        }
        return;
      }

      if (isMuted) return;
      syn.cancel();
      startInlineFromPayload(slotKey, payload);
    },
    [
      activeSlotKey,
      getInlinePhase,
      isMuted,
      startInlineFromPayload,
      clearSlot,
    ]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      const next = !m;
      try {
        window.localStorage.setItem(MUTE_STORAGE_KEY, next ? "true" : "false");
      } catch {
        /* ignore */
      }
      if (next) {
        const syn = getSynth();
        if (syn) syn.cancel();
        clearSlot();
      }
      return next;
    });
  }, [clearSlot]);

  const value = useMemo(
    () => ({
      speak,
      speakSequential,
      speakKeyed,
      speakSequentialKeyed,
      getInlinePhase,
      toggleInlineSpeech,
      getInlineToggleGlyph,
      stop,
      isMuted,
      toggleMute,
    }),
    [
      speak,
      speakSequential,
      speakKeyed,
      speakSequentialKeyed,
      getInlinePhase,
      toggleInlineSpeech,
      getInlineToggleGlyph,
      stop,
      isMuted,
      toggleMute,
    ]
  );

  return createElement(SpeechContext.Provider, { value }, children);
}

export function useSpeech(): SpeechContextValue {
  const ctx = useContext(SpeechContext);
  if (!ctx) {
    throw new Error("useSpeech must be used within SpeechProvider");
  }
  return ctx;
}
