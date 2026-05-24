export type FrogColor = "green" | "yellow" | "pink" | "blue";

export type RuleKind =
  | { type: "needs-neighbor" }       // at least 1 neighbor
  | { type: "needs-solitude" }       // zero neighbors
  | { type: "needs-color"; color: FrogColor }; // at least one neighbor of color

export interface FrogDef {
  id: string;
  color: FrogColor;
  name: string;
  rule: RuleKind;
}

export interface PadDef {
  id: string;
  x: number; // % of pond width
  y: number; // % of pond height
  size?: number; // px, default 96
}

export interface LevelDef {
  id: number;
  name: string;
  hint: string;
  pads: PadDef[];
  adjacency: [string, string][];
  frogs: FrogDef[];
}

export const RULE_LABEL: Record<string, string> = {
  "needs-neighbor": "Wants company",
  "needs-solitude": "Wants peace",
  "needs-color-green": "Loves green friends",
  "needs-color-yellow": "Loves sunny friends",
  "needs-color-pink": "Loves pink friends",
  "needs-color-blue": "Loves blue friends",
};

export function ruleKey(r: RuleKind) {
  return r.type === "needs-color" ? `needs-color-${r.color}` : r.type;
}

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    name: "Morning Dew",
    hint: "Place each frog so its wish comes true.",
    pads: [
      { id: "a", x: 30, y: 32 },
      { id: "b", x: 70, y: 32 },
      { id: "c", x: 50, y: 70 },
    ],
    adjacency: [
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
    ],
    frogs: [
      { id: "f1", color: "yellow", name: "Sunny", rule: { type: "needs-neighbor" } },
      { id: "f2", color: "pink", name: "Petal", rule: { type: "needs-color", color: "yellow" } },
      { id: "f3", color: "green", name: "Mossy", rule: { type: "needs-neighbor" } },
    ],
  },
  {
    id: 2,
    name: "Quiet Cove",
    hint: "Grumpy frogs need their own pad.",
    pads: [
      { id: "a", x: 22, y: 28 },
      { id: "b", x: 60, y: 22 },
      { id: "c", x: 78, y: 58 },
      { id: "d", x: 35, y: 72 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["a", "d"],
    ],
    frogs: [
      { id: "f1", color: "blue", name: "Bluebell", rule: { type: "needs-solitude" } },
      { id: "f2", color: "yellow", name: "Sunny", rule: { type: "needs-neighbor" } },
      { id: "f3", color: "pink", name: "Petal", rule: { type: "needs-color", color: "yellow" } },
      { id: "f4", color: "green", name: "Mossy", rule: { type: "needs-neighbor" } },
    ],
  },
  {
    id: 3,
    name: "Lotus Circle",
    hint: "Find the perfect seating chart.",
    pads: [
      { id: "a", x: 50, y: 18 },
      { id: "b", x: 82, y: 38 },
      { id: "c", x: 72, y: 72 },
      { id: "d", x: 28, y: 72 },
      { id: "e", x: 18, y: 38 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "e"],
      ["e", "a"],
    ],
    frogs: [
      { id: "f1", color: "blue", name: "Bluebell", rule: { type: "needs-solitude" } },
      { id: "f2", color: "pink", name: "Petal", rule: { type: "needs-color", color: "pink" } },
      { id: "f3", color: "pink", name: "Rosie", rule: { type: "needs-color", color: "pink" } },
      { id: "f4", color: "yellow", name: "Sunny", rule: { type: "needs-neighbor" } },
      { id: "f5", color: "green", name: "Mossy", rule: { type: "needs-solitude" } },
    ],
  },
];

export function neighborsOf(level: LevelDef, padId: string): string[] {
  const out: string[] = [];
  for (const [a, b] of level.adjacency) {
    if (a === padId) out.push(b);
    if (b === padId) out.push(a);
  }
  return out;
}

export function isFrogHappy(
  frog: FrogDef,
  padId: string,
  level: LevelDef,
  placements: Record<string, string>, // frogId -> padId
): boolean {
  const neighborPads = neighborsOf(level, padId);
  const neighborFrogs = Object.entries(placements)
    .filter(([fid, pid]) => fid !== frog.id && neighborPads.includes(pid))
    .map(([fid]) => fid);

  switch (frog.rule.type) {
    case "needs-neighbor":
      return neighborFrogs.length >= 1;
    case "needs-solitude":
      return neighborFrogs.length === 0;
    case "needs-color": {
      const wanted = frog.rule.color;
      const frogById = Object.fromEntries(level.frogs.map((f) => [f.id, f]));
      return neighborFrogs.some((fid) => frogById[fid]?.color === wanted);
    }
  }
}