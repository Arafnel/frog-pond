import { motion } from "framer-motion";
import { Frog } from "../Frog";

type Props = {
  levelName: string;
  onNext: () => void;
  onReplay: () => void;
};

export function WinOverlay({ levelName, onNext, onReplay }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 grid place-items-center bg-foreground/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.6, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-6 w-full max-w-xs rounded-[32px] bg-card p-6 text-center shadow-pop"
      >
        <div className="mx-auto mb-2 flex justify-center gap-1">
          <Frog color="green" mood="happy" size={56} />
          <Frog color="pink" mood="happy" size={56} />
          <Frog color="yellow" mood="happy" size={56} />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">Everyone&rsquo;s happy</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {levelName} solved. The pond glows softly.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft active:scale-[0.98] transition"
          >
            Next pond
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground active:scale-[0.98] transition"
          >
            Replay
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
