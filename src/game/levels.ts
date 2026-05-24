import type { Rule } from "./rules";

export type FrogColor = "green" | "yellow" | "pink" | "blue";

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface FrogDef {
  id: string;
  color: FrogColor;
  name: string;
  rules: Rule[];
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
  difficulty: Difficulty;
  hint: string;
  pads: PadDef[];
  adjacency: [string, string][];
  frogs: FrogDef[];
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

export const RULE_LABEL: Record<string, string> = {
  near: "Wants company",
  "near-green": "Loves green friends",
  "near-yellow": "Loves sunny friends",
  "near-pink": "Loves pink friends",
  "near-blue": "Loves blue friends",
  not_near: "Wants peace",
  specific_tile: "Has a favorite pad",
};

export function ruleLabel(rule: Rule): string {
  if (rule.type === "near" && rule.color) return RULE_LABEL[`near-${rule.color}`] ?? RULE_LABEL.near;
  return RULE_LABEL[rule.type] ?? rule.type;
}

function rule(id: string, def: Omit<Rule, "id">): Rule {
  return { id, ...def } as Rule;
}

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    name: "Morning Dew",
    difficulty: "easy",
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
      {
        id: "f1",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f1-r1", { type: "near" })],
      },
      {
        id: "f2",
        color: "pink",
        name: "Petal",
        rules: [rule("f2-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f3",
        color: "green",
        name: "Mossy",
        rules: [rule("f3-r1", { type: "near" })],
      },
    ],
  },
  {
    id: 2,
    name: "Two Lilies",
    difficulty: "easy",
    hint: "Neighbors share the same pair of pads.",
    pads: [
      { id: "a", x: 38, y: 48 },
      { id: "b", x: 62, y: 48 },
    ],
    adjacency: [["a", "b"]],
    frogs: [
      {
        id: "f1",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f1-r1", { type: "near" })],
      },
      {
        id: "f2",
        color: "pink",
        name: "Petal",
        rules: [rule("f2-r1", { type: "near", color: "yellow" })],
      },
    ],
  },
  {
    id: 3,
    name: "Quiet Cove",
    difficulty: "medium",
    hint: "Grumpy frogs need a pad with no neighbors.",
    pads: [
      { id: "a", x: 22, y: 28 },
      { id: "b", x: 60, y: 22 },
      { id: "c", x: 78, y: 58 },
      { id: "d", x: 22, y: 78 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "not_near" })],
      },
      {
        id: "f2",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f2-r1", { type: "near" })],
      },
      {
        id: "f3",
        color: "pink",
        name: "Petal",
        rules: [rule("f3-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f4",
        color: "green",
        name: "Mossy",
        rules: [rule("f4-r1", { type: "near" })],
      },
    ],
  },
  {
    id: 4,
    name: "Favorite Pad",
    difficulty: "medium",
    hint: "Bluebell loves the center pad. Sunny and Petal can share the wings.",
    pads: [
      { id: "a", x: 28, y: 38 },
      { id: "b", x: 50, y: 52 },
      { id: "c", x: 72, y: 38 },
      { id: "d", x: 50, y: 78 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
      ["b", "d"],
      ["a", "c"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "specific_tile", padId: "b" })],
      },
      {
        id: "f2",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f2-r1", { type: "near" })],
      },
      {
        id: "f3",
        color: "pink",
        name: "Petal",
        rules: [rule("f3-r1", { type: "near", color: "yellow" })],
      },
    ],
  },
  {
    id: 5,
    name: "Lotus Path",
    difficulty: "hard",
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
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "not_near" })],
      },
      {
        id: "f2",
        color: "pink",
        name: "Petal",
        rules: [rule("f2-r1", { type: "near", color: "pink" })],
      },
      {
        id: "f3",
        color: "pink",
        name: "Rosie",
        rules: [rule("f3-r1", { type: "near", color: "pink" })],
      },
      {
        id: "f4",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f4-r1", { type: "near" })],
      },
      {
        id: "f5",
        color: "green",
        name: "Mossy",
        rules: [rule("f5-r1", { type: "near" })],
      },
    ],
  },
  {
    id: 6,
    name: "Twin Shores",
    difficulty: "hard",
    hint: "Loners take the outer pads; friends stay on the bridge.",
    pads: [
      { id: "a", x: 30, y: 40 },
      { id: "b", x: 50, y: 52 },
      { id: "c", x: 70, y: 40 },
      { id: "d", x: 18, y: 72 },
      { id: "e", x: 50, y: 78 },
      { id: "f", x: 82, y: 72 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "not_near" })],
      },
      {
        id: "f2",
        color: "green",
        name: "Mossy",
        rules: [rule("f2-r1", { type: "not_near" })],
      },
      {
        id: "f3",
        color: "pink",
        name: "Rosie",
        rules: [rule("f3-r1", { type: "not_near" })],
      },
      {
        id: "f4",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f4-r1", { type: "near" })],
      },
      {
        id: "f5",
        color: "pink",
        name: "Petal",
        rules: [rule("f5-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f6",
        color: "pink",
        name: "Blossom",
        rules: [rule("f6-r1", { type: "near", color: "pink" })],
      },
    ],
  },
  {
    id: 7,
    name: "Grand Chorus",
    difficulty: "expert",
    hint: "The hub is crowded — loners must find pads far from the center.",
    pads: [
      { id: "a", x: 50, y: 22 },
      { id: "b", x: 24, y: 46 },
      { id: "c", x: 76, y: 46 },
      { id: "d", x: 50, y: 50 },
      { id: "e", x: 18, y: 76 },
      { id: "f", x: 50, y: 80 },
      { id: "g", x: 82, y: 76 },
    ],
    adjacency: [
      ["a", "d"],
      ["b", "d"],
      ["c", "d"],
      ["b", "c"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "not_near" })],
      },
      {
        id: "f2",
        color: "blue",
        name: "Ripple",
        rules: [rule("f2-r1", { type: "not_near" })],
      },
      {
        id: "f3",
        color: "green",
        name: "Mossy",
        rules: [rule("f3-r1", { type: "not_near" })],
      },
      {
        id: "f4",
        color: "yellow",
        name: "Sunny",
        rules: [
          rule("f4-r1", { type: "specific_tile", padId: "d" }),
          rule("f4-r2", { type: "near" }),
        ],
      },
      {
        id: "f5",
        color: "pink",
        name: "Petal",
        rules: [rule("f5-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f6",
        color: "pink",
        name: "Blossom",
        rules: [rule("f6-r1", { type: "near", color: "pink" })],
      },
    ],
  },
  {
    id: 8,
    name: "Starlight",
    difficulty: "hard",
    hint: "A long chain — the last pad is only for a peaceful frog.",
    pads: [
      { id: "a", x: 18, y: 50 },
      { id: "b", x: 36, y: 42 },
      { id: "c", x: 54, y: 50 },
      { id: "d", x: 72, y: 42 },
      { id: "e", x: 88, y: 50 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "not_near" })],
      },
      {
        id: "f2",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f2-r1", { type: "near" })],
      },
      {
        id: "f3",
        color: "pink",
        name: "Petal",
        rules: [rule("f3-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f4",
        color: "green",
        name: "Mossy",
        rules: [rule("f4-r1", { type: "near" })],
      },
      {
        id: "f5",
        color: "pink",
        name: "Rosie",
        rules: [rule("f5-r1", { type: "near", color: "pink" })],
      },
    ],
  },
  {
    id: 9,
    name: "Corner Seats",
    difficulty: "hard",
    hint: "Two corners want pink company; the shy frog hides in the other corner.",
    pads: [
      { id: "a", x: 22, y: 28 },
      { id: "b", x: 78, y: 28 },
      { id: "c", x: 22, y: 72 },
      { id: "d", x: 78, y: 72 },
    ],
    adjacency: [
      ["a", "b"],
      ["c", "d"],
      ["a", "c"],
      ["b", "d"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "specific_tile", padId: "c" })],
      },
      {
        id: "f2",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f2-r1", { type: "near" })],
      },
      {
        id: "f3",
        color: "pink",
        name: "Petal",
        rules: [rule("f3-r1", { type: "near", color: "pink" })],
      },
      {
        id: "f4",
        color: "pink",
        name: "Rosie",
        rules: [rule("f4-r1", { type: "near", color: "pink" })],
      },
    ],
  },
  {
    id: 10,
    name: "Royal Seats",
    difficulty: "expert",
    hint: "Two frogs have favorite pads; everyone else must negotiate the bridge.",
    pads: [
      { id: "a", x: 26, y: 38 },
      { id: "b", x: 50, y: 28 },
      { id: "c", x: 74, y: 38 },
      { id: "d", x: 38, y: 62 },
      { id: "e", x: 62, y: 62 },
      { id: "f", x: 50, y: 82 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
      ["a", "d"],
      ["c", "e"],
      ["d", "e"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "specific_tile", padId: "b" })],
      },
      {
        id: "f2",
        color: "green",
        name: "Mossy",
        rules: [rule("f2-r1", { type: "specific_tile", padId: "f" })],
      },
      {
        id: "f3",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f3-r1", { type: "near" })],
      },
      {
        id: "f4",
        color: "pink",
        name: "Petal",
        rules: [rule("f4-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f5",
        color: "green",
        name: "Fern",
        rules: [rule("f5-r1", { type: "near" })],
      },
    ],
  },
  {
    id: 11,
    name: "Mosaic",
    difficulty: "expert",
    hint: "Fill every pad — the quiet ones are far from the bridge.",
    pads: [
      { id: "a", x: 22, y: 42 },
      { id: "b", x: 42, y: 42 },
      { id: "c", x: 62, y: 42 },
      { id: "d", x: 82, y: 42 },
      { id: "e", x: 18, y: 74 },
      { id: "f", x: 50, y: 74 },
      { id: "g", x: 82, y: 74 },
    ],
    adjacency: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [rule("f1-r1", { type: "not_near" })],
      },
      {
        id: "f2",
        color: "blue",
        name: "Ripple",
        rules: [rule("f2-r1", { type: "not_near" })],
      },
      {
        id: "f3",
        color: "green",
        name: "Mossy",
        rules: [rule("f3-r1", { type: "not_near" })],
      },
      {
        id: "f4",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f4-r1", { type: "near" })],
      },
      {
        id: "f5",
        color: "pink",
        name: "Petal",
        rules: [rule("f5-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f6",
        color: "pink",
        name: "Rosie",
        rules: [rule("f6-r1", { type: "near", color: "pink" })],
      },
      {
        id: "f7",
        color: "green",
        name: "Fern",
        rules: [rule("f7-r1", { type: "near" })],
      },
    ],
  },
  {
    id: 12,
    name: "Master Pond",
    difficulty: "expert",
    hint: "Bluebell owns the hub. Pair up colors on the wings without waking the loners.",
    pads: [
      { id: "a", x: 50, y: 18 },
      { id: "b", x: 26, y: 40 },
      { id: "c", x: 74, y: 40 },
      { id: "d", x: 18, y: 62 },
      { id: "e", x: 50, y: 50 },
      { id: "f", x: 82, y: 62 },
      { id: "g", x: 26, y: 82 },
      { id: "h", x: 74, y: 82 },
    ],
    adjacency: [
      ["a", "e"],
      ["b", "e"],
      ["c", "e"],
      ["b", "c"],
      ["d", "e"],
      ["f", "e"],
      ["b", "d"],
      ["c", "f"],
    ],
    frogs: [
      {
        id: "f1",
        color: "blue",
        name: "Bluebell",
        rules: [
          rule("f1-r1", { type: "specific_tile", padId: "e" }),
          rule("f1-r2", { type: "near" }),
        ],
      },
      {
        id: "f2",
        color: "blue",
        name: "Ripple",
        rules: [rule("f2-r1", { type: "not_near" })],
      },
      {
        id: "f3",
        color: "green",
        name: "Mossy",
        rules: [rule("f3-r1", { type: "not_near" })],
      },
      {
        id: "f4",
        color: "yellow",
        name: "Sunny",
        rules: [rule("f4-r1", { type: "near" })],
      },
      {
        id: "f5",
        color: "pink",
        name: "Petal",
        rules: [rule("f5-r1", { type: "near", color: "yellow" })],
      },
      {
        id: "f6",
        color: "pink",
        name: "Rosie",
        rules: [rule("f6-r1", { type: "near", color: "pink" })],
      },
      {
        id: "f7",
        color: "green",
        name: "Fern",
        rules: [rule("f7-r1", { type: "near" })],
      },
    ],
  },
];

export { neighborsOf } from "./rules";

export function padOccupant(
  placements: Record<string, string | null>,
  padId: string,
  exceptFrogId?: string,
): string | null {
  for (const [frogId, pad] of Object.entries(placements)) {
    if (pad === padId && frogId !== exceptFrogId) return frogId;
  }
  return null;
}
