import { Volume2, VolumeX } from "lucide-react";

type Props = {
  enabled: boolean;
  onToggle: () => void;
};

export function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      aria-pressed={enabled}
      className="grid h-9 w-9 place-items-center rounded-full bg-card/90 text-muted-foreground shadow-soft transition active:scale-95 hover:text-foreground"
    >
      {enabled ? <Volume2 size={17} strokeWidth={2.25} /> : <VolumeX size={17} strokeWidth={2.25} />}
    </button>
  );
}
