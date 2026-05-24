import type { PanInfo } from "framer-motion";
import type { RefObject } from "react";
import { LilyPad } from "../LilyPad";
import { DraggableFrog, type FrogMood } from "./DraggableFrog";
import type { FrogDef, LevelDef, PadDef } from "@/game/levels";

type DragHandlers = ReturnType<
  (frogId: string) => {
    onDragStart: (info: PanInfo) => void;
    onDrag: (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void;
    onDragEnd: (info: PanInfo) => void;
  }
>;

type Props = {
  level: LevelDef;
  padById: Map<string, PadDef>;
  pondRef: RefObject<HTMLDivElement | null>;
  splashPadId: string | null;
  hoverPad: string | null;
  draggingId: string | null;
  placedFrogs: [string, string][];
  frogById: Record<string, FrogDef>;
  happiness: Record<string, boolean>;
  allPlaced: boolean;
  bindPadRef: (padId: string) => (el: HTMLDivElement | null) => void;
  padOccupant: (padId: string, exceptFrogId?: string) => string | null;
  dragHandlers: DragHandlers;
};

export function PondPlayfield({
  level,
  padById,
  pondRef,
  splashPadId,
  hoverPad,
  draggingId,
  placedFrogs,
  frogById,
  happiness,
  allPlaced,
  bindPadRef,
  padOccupant,
  dragHandlers,
}: Props) {
  return (
    <div
      ref={pondRef}
      className="pond-playfield relative isolate z-0 mx-4 mt-4 flex-1 overflow-hidden rounded-[40px] shadow-pop"
    >
      <div className="relative h-full w-full">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {level.adjacency.map(([a, b], i) => {
            const pa = padById.get(a);
            const pb = padById.get(b);
            if (!pa || !pb) return null;
            return (
              <line
                key={i}
                x1={`${pa.x}%`}
                y1={`${pa.y}%`}
                x2={`${pb.x}%`}
                y2={`${pb.y}%`}
                stroke="oklch(0.95 0.04 180 / 0.55)"
                strokeWidth={3}
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {level.pads.map((pad, i) => (
          <div
            key={pad.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pad.x}%`, top: `${pad.y}%` }}
          >
            <LilyPad
              ref={bindPadRef(pad.id)}
              size={pad.size ?? 108}
              splash={splashPadId === pad.id}
              highlight={hoverPad === pad.id}
              swapTarget={
                hoverPad === pad.id &&
                draggingId !== null &&
                padOccupant(pad.id, draggingId) !== null
              }
              occupied={padOccupant(pad.id) !== null}
              flower={i % 3 === 0}
            />
          </div>
        ))}

        {placedFrogs.map(([fid, pid]) => {
          const pad = padById.get(pid);
          const frog = frogById[fid];
          if (!pad || !frog) return null;
          const mood: FrogMood = happiness[fid] ? "happy" : allPlaced ? "sad" : "neutral";
          return (
            <DraggableFrog
              key={`${fid}-${pid}`}
              frog={frog}
              mood={mood}
              pad={pad}
              size={72}
              hidden={draggingId === fid}
              {...dragHandlers(fid)}
            />
          );
        })}
      </div>
    </div>
  );
}
