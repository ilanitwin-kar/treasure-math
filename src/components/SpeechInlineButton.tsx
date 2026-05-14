import type { InlineSpeechPayload } from "../hooks/useSpeech";
import { useSpeech } from "../hooks/useSpeech";

interface SpeechInlineButtonProps {
  slotKey: string;
  payload: InlineSpeechPayload;
  className?: string;
  /** כותרת כשהמצב idle (ברירת מחדל: "השמע") */
  titleIdle?: string;
}

export function SpeechInlineButton({
  slotKey,
  payload,
  className,
  titleIdle = "השמע",
}: SpeechInlineButtonProps) {
  const { toggleInlineSpeech, getInlineToggleGlyph, getInlinePhase } = useSpeech();
  const phase = getInlinePhase(slotKey);
  const title =
    phase === "speaking" ? "השהה" : phase === "paused" ? "המשך" : titleIdle;

  return (
    <button
      type="button"
      className={className}
      onClick={() => toggleInlineSpeech(slotKey, payload)}
      title={title}
      aria-label={title}
    >
      {getInlineToggleGlyph(slotKey)}
    </button>
  );
}
