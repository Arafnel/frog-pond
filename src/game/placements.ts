import type { LevelDef } from "./levels";
import { padOccupant } from "./levels";

export type Placements = Record<string, string | null>;

export function emptyPlacements(level: LevelDef): Placements {
  return Object.fromEntries(level.frogs.map((f) => [f.id, null]));
}

export function pointInRect(x: number, y: number, el: HTMLElement | null): boolean {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

export function padAtPoint(
  x: number,
  y: number,
  level: LevelDef,
  padRefs: Record<string, HTMLDivElement | null>,
): string | null {
  for (const pad of level.pads) {
    const el = padRefs[pad.id];
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return pad.id;
  }
  return null;
}

export function placeOnPad(
  placements: Placements,
  frogId: string,
  padId: string,
): Placements {
  const occupant = padOccupant(placements, padId, frogId);
  const fromPad = placements[frogId];
  const next: Placements = { ...placements, [frogId]: padId };
  if (occupant) next[occupant] = fromPad;
  return next;
}

export function activePlacements(
  placements: Placements,
  frogIds: Set<string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [fid, pid] of Object.entries(placements)) {
    if (pid && frogIds.has(fid)) out[fid] = pid;
  }
  return out;
}
