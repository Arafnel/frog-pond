import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Frog } from "./Frog";
import { LilyPad } from "./LilyPad";
import {
  LEVELS,
  isFrogHappy,
  ruleKey,
  RULE_LABEL,
  type FrogDef,
  type LevelDef,
} from "@/game/levels";

type Placements = Record<string, string | null>; // frogId -> padId | null

function emptyPlacements(level: LevelDef): Placements {
  return Object.fromEntries(level.frogs.map((f) => [f.id, null]));
}

export function Pond() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];
  const [placements, setPlacements] = useState<Placements>(() => emptyPlacements(level));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverPad, setHoverPad] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const pondRef = useRef<HTMLDivElement>(null);
  const padRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setPlacements(emptyPlacements(level));
    setWon(false);
  }, [level]);

  const placedFrogs = useMemo(
    () => Object.entries(placements).filter(([, p]) => p !== null) as [string, string][],
    [placements],
  );
  const allPlaced = placedFrogs.length === level.frogs.length;

  const frogById = useMemo(
    () => Object.fromEntries(level.frogs.map((f) => [f.id, f])),
    [level],
  );

  const realPlacements = useMemo(() => {
    const o: Record<string, string> = {};
    for (const [fid, pid] of Object.entries(placements)) if (pid) o[fid] = pid;
    return o;
  }, [placements]);

  const happiness = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const [fid, pid] of Object.entries(realPlacements)) {
      map[fid] = isFrogHappy(frogById[fid], pid, level, realPlacements);
    }
    return map;
  }, [realPlacements, level, frogById]);

  useEffect(() => {
    if (allPlaced && Object.values(happiness).every(Boolean)) {
      const t = setTimeout(() => setWon(true), 500);
      return () => clearTimeout(t);
    }
  }, [allPlaced, happiness]);

  function padAtPoint(x: number, y: number): string | null {
    for (const pad of level.pads) {
      const el = padRefs.current[pad.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return pad.id;
    }
    return null;
  }

  function handleDrag(_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    setHoverPad(padAtPoint(info.point.x, info.point.y));
  }

  function handleDragEnd(frogId: string, info: PanInfo) {
    setDraggingId(null);
    setHoverPad(null);
    const padId = padAtPoint(info.point.x, info.point.y);
    if (!padId) {
      // dropped outside — send back to tray
      setPlacements((p) => ({ ...p, [frogId]: null }));
      return;
    }
    setPlacements((prev) => {
      const next: Placements = { ...prev };
      // if another frog already on pad, swap them to tray
      for (const [fid, pid] of Object.entries(next)) {
        if (pid === padId && fid !== frogId) next[fid] = null;
      }
      next[frogId] = padId;
      return next;
    });
  }

  function resetLevel() {
    setPlacements(emptyPlacements(level));
    setWon(false);
  }

  function nextLevel() {
    setLevelIndex((i) => (i + 1) % LEVELS.length);
  }

  const trayFrogs = level.frogs.filter((f) => placements[f.id] === null);

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden">
      {/* HUD */}
      <header className="relative z-20 flex items-center justify-between px-5 pt-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Level {level.id}
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground">{level.name}</h1>
        </div>
        <button
          onClick={resetLevel}
          className="rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft active:scale-95 transition"
        >
          Reset
        </button>
      </header>

      <p className="relative z-20 px-5 pt-1 text-sm text-muted-foreground">{level.hint}</p>

      {/* Pond stage */}
      <div className="relative mx-4 mt-4 flex-1 overflow-hidden rounded-[40px] shadow-pop"
           style={{ background: "var(--gradient-pond)" }}
           ref={pondRef}>
        {/* decorative reeds & lily flowers */}
        <Decor />

        {/* Adjacency lines */}
        <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: "none" }}>
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
                stroke="oklch(0.95 0.04 180 / 0.45)"
                strokeWidth={3}
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Lily pads */}
        {level.pads.map((pad, i) => (
          <div
            key={pad.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pad.x}%`, top: `${pad.y}%` }}
          >
            <LilyPad
              ref={(el) => {
                padRefs.current[pad.id] = el;
              }}
              size={pad.size ?? 108}
              highlight={hoverPad === pad.id}
              flower={i % 3 === 0}
            />
          </div>
        ))}

        {/* Placed frogs */}
        {placedFrogs.map(([fid, pid]) => {
          const pad = level.pads.find((p) => p.id === pid)!;
          const frog = frogById[fid];
          const mood = happiness[fid] ? "happy" : allPlaced ? "sad" : "neutral";
          return (
            <DraggableFrog
              key={fid}
              frog={frog}
              mood={mood}
              positionStyle={{
                left: `${pad.x}%`,
                top: `${pad.y}%`,
                transform: "translate(-50%, -60%)",
              }}
              dragging={draggingId === fid}
              onDragStart={() => setDraggingId(fid)}
              onDrag={handleDrag}
              onDragEnd={(info) => handleDragEnd(fid, info)}
            />
          );
        })}
      </div>

      {/* Tray */}
      <div className="relative z-10 mt-3 mb-4 mx-4 rounded-[28px] bg-card/80 backdrop-blur shadow-soft">
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
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="flex shrink-0 flex-col items-center"
              >
                <TrayFrog
                  frog={f}
                  onDragStart={() => setDraggingId(f.id)}
                  onDrag={handleDrag}
                  onDragEnd={(info) => handleDragEnd(f.id, info)}
                />
                <p className="mt-1 text-xs font-semibold text-foreground">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{RULE_LABEL[ruleKey(f.rule)]}</p>
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

      <AnimatePresence>
        {won && <WinOverlay levelName={level.name} onNext={nextLevel} onReplay={resetLevel} />}
      </AnimatePresence>
    </div>
  );
}

function TrayFrog({
  frog,
  onDragStart,
  onDrag,
  onDragEnd,
}: {
  frog: FrogDef;
  onDragStart: () => void;
  onDrag: (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void;
  onDragEnd: (info: PanInfo) => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragSnapToOrigin
      whileTap={{ scale: 1.08 }}
      whileDrag={{ scale: 1.18, zIndex: 50 }}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={(_, info) => onDragEnd(info)}
      className="cursor-grab touch-none active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <div className="animate-bob">
        <Frog color={frog.color} size={68} />
      </div>
    </motion.div>
  );
}

function DraggableFrog({
  frog,
  mood,
  positionStyle,
  onDragStart,
  onDrag,
  onDragEnd,
  dragging,
}: {
  frog: FrogDef;
  mood: "happy" | "sad" | "neutral";
  positionStyle: React.CSSProperties;
  onDragStart: () => void;
  onDrag: (e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => void;
  onDragEnd: (info: PanInfo) => void;
  dragging: boolean;
}) {
  return (
    <motion.div
      layoutId={`frog-${frog.id}`}
      className="absolute touch-none"
      style={{ ...positionStyle, touchAction: "none", zIndex: dragging ? 50 : 10 }}
      drag
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={{ scale: 1.18 }}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={(_, info) => onDragEnd(info)}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <div className="relative">
        <Frog color={frog.color} mood={mood} size={72} />
        <MoodPip mood={mood} />
      </div>
    </motion.div>
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

function Decor() {
  return (
    <>
      {/* sun glimmer */}
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
        style={{ background: "oklch(0.95 0.10 90 / 0.55)" }}
      />
      {/* far ripples */}
      {[15, 30, 60, 85].map((y, i) => (
        <div
          key={i}
          className="absolute h-[1px] w-full"
          style={{
            top: `${y}%`,
            background:
              "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.35), transparent)",
          }}
        />
      ))}
      {/* corner reeds */}
      <svg className="absolute bottom-0 left-2" width="60" height="80" viewBox="0 0 60 80">
        <path d="M10 80 Q14 40 18 10" stroke="var(--lily-pad-dark)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="18" cy="8" rx="3" ry="8" fill="var(--lily-pad-dark)" />
        <path d="M28 80 Q26 50 30 24" stroke="var(--lily-pad-dark)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="30" cy="22" rx="2.5" ry="7" fill="var(--lily-pad-dark)" />
      </svg>
      <svg className="absolute bottom-0 right-2" width="60" height="80" viewBox="0 0 60 80">
        <path d="M50 80 Q46 40 42 10" stroke="var(--lily-pad-dark)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="42" cy="8" rx="3" ry="8" fill="var(--lily-pad-dark)" />
      </svg>
    </>
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