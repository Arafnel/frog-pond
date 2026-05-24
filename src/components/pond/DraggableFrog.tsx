import { motion, type PanInfo } from "framer-motion";
import { Frog } from "../Frog";
import type { FrogDef } from "@/game/levels";

export type FrogMood = "neutral" | "happy" | "sad";

type DragHandlers = {
  onDragStart: (info: PanInfo) => void;
  onDrag: (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void;
  onDragEnd: (info: PanInfo) => void;
};

type Props = DragHandlers & {
  frog: FrogDef;
  hidden: boolean;
  size: number;
  mood?: FrogMood;
  pad?: { x: number; y: number };
};

export function DraggableFrog({ frog, hidden, size, mood, pad, ...drag }: Props) {
  const body = (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragSnapToOrigin
      onDragStart={(_, info) => drag.onDragStart(info)}
      onDrag={(e, info) => drag.onDrag(e, info)}
      onDragEnd={(_, info) => drag.onDragEnd(info)}
      className="cursor-grab touch-none active:cursor-grabbing"
      style={{ touchAction: "none", visibility: hidden ? "hidden" : "visible" }}
    >
      <div className={pad ? "relative" : "animate-bob"}>
        <Frog color={frog.color} name={frog.name} mood={mood} size={size} />
        {mood && mood !== "neutral" && <MoodPip mood={mood} />}
      </div>
    </motion.div>
  );

  if (!pad) return body;

  return (
    <div
      className="absolute z-30"
      style={{
        left: `${pad.x}%`,
        top: `${pad.y}%`,
        transform: "translate(-50%, -58%)",
      }}
    >
      {body}
    </div>
  );
}

function MoodPip({ mood }: { mood: "happy" | "sad" }) {
  const happy = mood === "happy";
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full text-xs shadow-soft"
      style={{ background: happy ? "var(--sun-glow)" : "oklch(0.92 0.04 25)" }}
    >
      {happy ? "♥" : "…"}
    </motion.span>
  );
}
