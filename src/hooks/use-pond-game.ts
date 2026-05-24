import type { PanInfo } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, padOccupant, type FrogDef } from "@/game/levels";
import { isFrogHappy } from "@/game/rules";
import {
  activePlacements,
  emptyPlacements,
  padAtPoint,
  placeOnPad,
  pointInRect,
  type Placements,
} from "@/game/placements";

type GameAudio = {
  playPop: () => void;
  playWin: () => void;
};

export function usePondGame(audio: GameAudio) {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];

  const [placements, setPlacements] = useState<Placements>(() => emptyPlacements(level));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPoint, setDragPoint] = useState<{ x: number; y: number } | null>(null);
  const [hoverPad, setHoverPad] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [splashPadId, setSplashPadId] = useState<string | null>(null);

  const pondRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const padRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const splashTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const frogById = useMemo(
    () => Object.fromEntries(level.frogs.map((f) => [f.id, f])) as Record<string, FrogDef>,
    [level.frogs],
  );

  const padById = useMemo(
    () => new Map(level.pads.map((p) => [p.id, p])),
    [level.pads],
  );

  const frogIds = useMemo(() => new Set(level.frogs.map((f) => f.id)), [level.frogs]);

  const placedFrogs = useMemo(
    () =>
      Object.entries(placements).filter(
        ([fid, p]) => p !== null && frogIds.has(fid),
      ) as [string, string][],
    [placements, frogIds],
  );

  const onPads = activePlacements(placements, frogIds);
  const allPlaced = placedFrogs.length === level.frogs.length;

  const happiness = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const [fid, pid] of Object.entries(onPads)) {
      map[fid] = isFrogHappy(frogById[fid], pid, level, onPads);
    }
    return map;
  }, [onPads, level, frogById]);

  useEffect(() => {
    if (allPlaced && Object.values(happiness).every(Boolean)) {
      const t = setTimeout(() => setWon(true), 500);
      return () => clearTimeout(t);
    }
  }, [allPlaced, happiness]);

  const playWinRef = useRef(audio.playWin);
  playWinRef.current = audio.playWin;

  useEffect(() => {
    if (won) playWinRef.current();
  }, [won]);

  useEffect(() => () => clearTimeout(splashTimerRef.current), []);

  function clearSplash() {
    setSplashPadId(null);
    clearTimeout(splashTimerRef.current);
  }

  function triggerSplash(padId: string) {
    setSplashPadId(padId);
    clearTimeout(splashTimerRef.current);
    splashTimerRef.current = setTimeout(() => setSplashPadId(null), 900);
  }

  function resetDragUi() {
    setDraggingId(null);
    setDragPoint(null);
    setHoverPad(null);
  }

  function applyLevel(index: number) {
    const def = LEVELS[index];
    padRefs.current = {};
    setLevelIndex(index);
    setPlacements(emptyPlacements(def));
    setWon(false);
    resetDragUi();
    clearSplash();
  }

  const bindPadRef = (padId: string) => (el: HTMLDivElement | null) => {
    padRefs.current[padId] = el;
  };

  const dragHandlers = (frogId: string) => ({
    onDragStart: (info: PanInfo) => {
      setDraggingId(frogId);
      setDragPoint({ x: info.point.x, y: info.point.y });
    },
    onDrag: (_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      setDragPoint({ x: info.point.x, y: info.point.y });
      setHoverPad(padAtPoint(info.point.x, info.point.y, level, padRefs.current));
    },
    onDragEnd: (info: PanInfo) => {
      resetDragUi();
      const { x, y } = info.point;

      if (pointInRect(x, y, trayRef.current)) {
        setPlacements((prev) => ({ ...prev, [frogId]: null }));
        return;
      }

      const targetPad = padAtPoint(x, y, level, padRefs.current);
      if (targetPad) {
        if (placements[frogId] !== targetPad) {
          audio.playPop();
          triggerSplash(targetPad);
        }
        setPlacements((prev) => placeOnPad(prev, frogId, targetPad));
        return;
      }

      if (placements[frogId] !== null && !pointInRect(x, y, pondRef.current)) {
        setPlacements((prev) => ({ ...prev, [frogId]: null }));
      }
    },
  });

  return {
    level,
    levelIndex,
    placements,
    draggingId,
    dragPoint,
    hoverPad,
    won,
    splashPadId,
    pondRef,
    trayRef,
    frogById,
    padById,
    placedFrogs,
    happiness,
    allPlaced,
    trayFrogs: level.frogs.filter((f) => placements[f.id] === null),
    draggingFrog: draggingId ? frogById[draggingId] : null,
    bindPadRef,
    dragHandlers,
    resetLevel: () => applyLevel(levelIndex),
    nextLevel: () => applyLevel((levelIndex + 1) % LEVELS.length),
    padOccupant: (padId: string, exceptFrogId?: string) =>
      padOccupant(placements, padId, exceptFrogId),
  };
}
