import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Frog } from "./Frog";
import { LilyPad } from "./LilyPad";
import {
  DIFFICULTY_LABEL,
  LEVELS,
  padOccupant,
  ruleLabel,
  type FrogDef,
  type LevelDef,
} from "@/game/levels";
import pondBackground from "@/game/pond-background";
import { isFrogHappy } from "@/game/rules";

type Placements = Record<string, string | null>; // frogId -> padId | null

function emptyPlacements(level: LevelDef): Placements {
  return Object.fromEntries(level.frogs.map((f) => [f.id, null]));
}

export function Pond() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];
  const [placements, setPlacements] = useState<Placements>(() => emptyPlacements(level));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number } | null>(null);
  const [hoverPad, setHoverPad] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const pondRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const padRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const frogById = useMemo(
    () => Object.fromEntries(level.frogs.map((f) => [f.id, f])),
    [level],
  );

  const placedFrogs = useMemo(
    () =>
      Object.entries(placements).filter(
        ([fid, p]) => p !== null && fid in frogById,
      ) as [string, string][],
    [placements, frogById],
  );
  const allPlaced = placedFrogs.length === level.frogs.length;

  const realPlacements = useMemo(() => {
    const o: Record<string, string> = {};
    for (const [fid, pid] of Object.entries(placements)) {
      if (pid && fid in frogById) o[fid] = pid;
    }
    return o;
  }, [placements, frogById]);

  const happiness = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const [fid, pid] of Object.entries(realPlacements)) {
      const frog = frogById[fid];
      if (!frog) continue;
      map[fid] = isFrogHappy(frog, pid, level, realPlacements);
    }
    return map;
  }, [realPlacements, level, frogById]);

  useEffect(() => {
    if (allPlaced && Object.values(happiness).every(Boolean)) {
      const t = setTimeout(() => setWon(true), 500);
      return () => clearTimeout(t);
    }
  }, [allPlaced, happiness]);

  function pointInRect(x: number, y: number, el: HTMLElement | null): boolean {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function padAtPoint(x: number, y: number): string | null {
    for (const pad of level.pads) {
      const el = padRefs.current[pad.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return pad.id;
    }
    return null;
  }

  function placeOnPad(frogId: string, padId: string) {
    setPlacements((prev) => {
      const occupant = padOccupant(prev, padId, frogId);
      const fromPad = prev[frogId];
      const next: Placements = { ...prev, [frogId]: padId };
      if (occupant) next[occupant] = fromPad;
      return next;
    });
  }

  function handleDragStart(frogId: string, info: PanInfo) {
    setDraggingId(frogId);
    setDragPoint({ x: info.point.x, y: info.point.y });
  }

  function handleDrag(
    frogId: string,
    _e: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) {
    setDragPoint({ x: info.point.x, y: info.point.y });
    setHoverPad(padAtPoint(info.point.x, info.point.y));
  }

  function handleDragEnd(frogId: string, info: PanInfo) {
    setDraggingId(null);
    setDragPoint(null);
    setHoverPad(null);

    const { x, y } = info.point;

    if (pointInRect(x, y, trayRef.current)) {
      setPlacements((prev) => ({ ...prev, [frogId]: null }));
      return;
    }

    const padId = padAtPoint(x, y);
    if (padId) {
      placeOnPad(frogId, padId);
      return;
    }

    // Dropped outside pond pads — return to tray if was on a pad
    if (placements[frogId] !== null && !pointInRect(x, y, pondRef.current)) {
      setPlacements((prev) => ({ ...prev, [frogId]: null }));
    }
  }

  function applyLevel(index: number) {
    padRefs.current = {};
    const def = LEVELS[index];
    setLevelIndex(index);
    setPlacements(emptyPlacements(def));
    setWon(false);
    setDraggingId(null);
    setDragPoint(null);
    setHoverPad(null);
  }

  function resetLevel() {
    applyLevel(levelIndex);
  }

  function nextLevel() {
    applyLevel((levelIndex + 1) % LEVELS.length);
  }

  const trayFrogs = level.frogs.filter((f) => placements[f.id] === null);
  const draggingFrog = draggingId ? frogById[draggingId] : null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <img
          src={pondBackground}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="select-none-game relative z-10 mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden">
      <header className="relative z-20 flex items-center justify-between px-5 pt-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/80 drop-shadow-sm">
            Level {level.id} · {DIFFICULTY_LABEL[level.difficulty]}
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground drop-shadow-md">
            {level.name}
          </h1>
        </div>
        <button
          onClick={resetLevel}
          className="rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft active:scale-95 transition"
        >
          Reset
        </button>
      </header>

      <p className="relative z-20 px-5 pt-1 text-sm text-foreground/90 drop-shadow-sm">
        {level.hint}
      </p>

      <div
        ref={pondRef}
        className="pond-playfield relative z-0 mx-4 mt-4 flex-1 overflow-hidden rounded-[40px] shadow-pop"
      >
        <div className="relative h-full w-full">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            {level.adjacency.map(([a, b], i) => {
              const pa = level.pads.find((p) => p.id === a)!;
              const pb = level.pads.find((p) => p.id === b)!;
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
                ref={(el) => {
                  padRefs.current[pad.id] = el;
                }}
                size={pad.size ?? 108}
                highlight={hoverPad === pad.id}
                swapTarget={
                  hoverPad === pad.id &&
                  draggingId !== null &&
                  padOccupant(placements, pad.id, draggingId) !== null
                }
                occupied={padOccupant(placements, pad.id) !== null}
                flower={i % 3 === 0}
              />
            </div>
          ))}

          {placedFrogs.map(([fid, pid]) => {
            const pad = level.pads.find((p) => p.id === pid);
            const frog = frogById[fid];
            if (!pad || !frog) return null;
            const mood = happiness[fid] ? "happy" : allPlaced ? "sad" : "neutral";
            return (
              <PadFrog
                key={`${fid}-${pid}`}
                frog={frog}
                mood={mood}
                pad={pad}
                hidden={draggingId === fid}
                onDragStart={(info) => handleDragStart(fid, info)}
                onDrag={(e, info) => handleDrag(fid, e, info)}
                onDragEnd={(info) => handleDragEnd(fid, info)}
              />
            );
          })}
        </div>
      </div>

      {/* Tray */}
      <div
        ref={trayRef}
        className="relative z-10 mt-3 mb-4 mx-4 rounded-[28px] bg-card/80 backdrop-blur shadow-soft"
      >
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Pond friends
          </p>
          <p className="text-xs text-muted-foreground">
            {level.frogs.length - trayFrogs.length}/{level.frogs.length}
          </p>
        </div>
        <div className="flex min-h-[120px] items-end gap-3 overflow-x-auto px-4 pb-4 pt-2">
          <AnimatePresence>
            {trayFrogs.map((f) => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: draggingId === f.id ? 0.25 : 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="flex shrink-0 flex-col items-center"
              >
                <TrayFrog
                  frog={f}
                  hidden={draggingId === f.id}
                  onDragStart={(info) => handleDragStart(f.id, info)}
                  onDrag={(e, info) => handleDrag(f.id, e, info)}
                  onDragEnd={(info) => handleDragEnd(f.id, info)}
                />
                <p className="mt-1 text-xs font-semibold text-foreground">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {f.rules.map(ruleLabel).join(" · ")}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {trayFrogs.length === 0 && (
            <p className="w-full py-6 text-center text-sm text-muted-foreground">
              All friends are on the pond
            </p>
          )}
        </div>
      </div>

      {draggingFrog &&
        dragPoint &&
        createPortal(
          <div
            className="pointer-events-none fixed"
            style={{
              left: dragPoint.x,
              top: dragPoint.y,
              transform: "translate(-50%, -55%)",
              zIndex: 9999,
            }}
          >
            <Frog color={draggingFrog.color} size={72} />
          </div>,
          document.body,
        )}

      <AnimatePresence>
        {won && <WinOverlay levelName={level.name} onNext={nextLevel} onReplay={resetLevel} />}
      </AnimatePresence>
      </div>
    </>
  );
}

function TrayFrog({
  frog,
  hidden,
  onDragStart,
  onDrag,
  onDragEnd,
}: {
  frog: FrogDef;
  hidden: boolean;
  onDragStart: (info: PanInfo) => void;
  onDrag: (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void;
  onDragEnd: (info: PanInfo) => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragSnapToOrigin
      onDragStart={(_, info) => onDragStart(info)}
      onDrag={(e, info) => onDrag(e, info)}
      onDragEnd={(_, info) => onDragEnd(info)}
      className="cursor-grab touch-none active:cursor-grabbing"
      style={{ touchAction: "none", visibility: hidden ? "hidden" : "visible" }}
    >
      <div className="animate-bob">
        <Frog color={frog.color} size={68} />
      </div>
    </motion.div>
  );
}

function PadFrog({
  frog,
  mood,
  pad,
  hidden,
  onDragStart,
  onDrag,
  onDragEnd,
}: {
  frog: FrogDef;
  mood: "happy" | "sad" | "neutral";
  pad: { x: number; y: number };
  hidden: boolean;
  onDragStart: (info: PanInfo) => void;
  onDrag: (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void;
  onDragEnd: (info: PanInfo) => void;
}) {
  return (
    <div
      className="absolute z-30"
      style={{
        left: `${pad.x}%`,
        top: `${pad.y}%`,
        transform: "translate(-50%, -58%)",
      }}
    >
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        dragSnapToOrigin
        onDragStart={(_, info) => onDragStart(info)}
        onDrag={(e, info) => onDrag(e, info)}
        onDragEnd={(_, info) => onDragEnd(info)}
        className="touch-none cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none", visibility: hidden ? "hidden" : "visible" }}
      >
        <div className="relative">
          <Frog color={frog.color} mood={mood} size={72} />
          <MoodPip mood={mood} />
        </div>
      </motion.div>
    </div>
  );
}

function MoodPip({ mood }: { mood: "happy" | "sad" | "neutral" }) {
  if (mood === "neutral") return null;
  const happy = mood === "happy";
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full text-xs shadow-soft"
      style={{
        background: happy ? "var(--sun-glow)" : "oklch(0.92 0.04 25)",
      }}
    >
      {happy ? "♥" : "…"}
    </motion.span>
  );
}

function WinOverlay({
  levelName,
  onNext,
  onReplay,
}: {
  levelName: string;
  onNext: () => void;
  onReplay: () => void;
}) {
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
            onClick={onNext}
            className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-soft active:scale-[0.98] transition"
          >
            Next pond
          </button>
          <button
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
