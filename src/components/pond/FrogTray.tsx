import { AnimatePresence, motion } from "framer-motion";
import { DraggableFrog } from "./DraggableFrog";
import { ruleLabel } from "@/game/levels";
import type { FrogDef } from "@/game/levels";
import type { RefObject } from "react";
import type { PanInfo } from "framer-motion";

type Props = {
  trayRef: RefObject<HTMLDivElement | null>;
  frogs: FrogDef[];
  placedCount: number;
  draggingId: string | null;
  dragHandlers: (frogId: string) => {
    onDragStart: (info: PanInfo) => void;
    onDrag: (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void;
    onDragEnd: (info: PanInfo) => void;
  };
};

export function FrogTray({ trayRef, frogs, placedCount, draggingId, dragHandlers }: Props) {
  const total = placedCount + frogs.length;

  return (
    <div
      ref={trayRef}
      className="relative z-10 mx-4 mt-3 mb-4 rounded-[28px] bg-card/80 backdrop-blur shadow-soft"
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Pond friends
        </p>
        <p className="text-xs text-muted-foreground">
          {placedCount}/{total}
        </p>
      </div>

      <div className="flex min-h-[120px] items-end gap-3 overflow-x-auto px-4 pb-4 pt-2">
        <AnimatePresence>
          {frogs.map((frog) => (
            <motion.div
              key={frog.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: draggingId === frog.id ? 0.25 : 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="flex shrink-0 flex-col items-center"
            >
              <DraggableFrog
                frog={frog}
                size={68}
                hidden={draggingId === frog.id}
                {...dragHandlers(frog.id)}
              />
              <p className="mt-1 text-xs font-semibold text-foreground">{frog.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {frog.rules.map(ruleLabel).join(" · ")}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {frogs.length === 0 && (
          <p className="w-full py-6 text-center text-sm text-muted-foreground">
            All friends are on the pond
          </p>
        )}
      </div>
    </div>
  );
}
