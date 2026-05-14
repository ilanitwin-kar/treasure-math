import { PirateAvatar } from "./PirateAvatar";
import { useGameStore } from "../store/gameStore";

/** לחיצה פותחת מודאל עריכת פרופיל (שם, כיתה, גיל). */
export function ProfileHeaderButton({ className = "" }: { className?: string }) {
  const profile = useGameStore((s) => s.profile);
  const openProfileEditModal = useGameStore((s) => s.openProfileEditModal);
  if (!profile) return null;
  return (
    <button
      type="button"
      onClick={() => openProfileEditModal()}
      className={`bg-white/90 rounded-full px-2 py-1 shadow font-bold text-stone-700 text-sm flex items-center gap-1.5 min-w-0 max-w-full active:scale-95 hover:bg-white ${className}`}
      title="הפרופיל שלי"
      aria-label="פתח פרופיל"
    >
      <div className="bg-gradient-to-br from-sky-100 to-cyan-200 rounded-full overflow-hidden border-2 border-amber-300 shrink-0">
        <PirateAvatar id={profile.pirateId} size={32} />
      </div>
      <span className="truncate">{profile.name}</span>
    </button>
  );
}
