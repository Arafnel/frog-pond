export type FrogAccessory =
  | "bow"
  | "flower"
  | "leaf"
  | "crown"
  | "scarf"
  | "droplet"
  | "spots"
  | "beret";

const BY_NAME: Record<string, FrogAccessory> = {
  Sunny: "flower",
  Petal: "bow",
  Mossy: "leaf",
  Bluebell: "crown",
  Rosie: "beret",
  Blossom: "flower",
  Ripple: "droplet",
  Fern: "scarf",
};

export function accessoryForFrog(name: string): FrogAccessory | undefined {
  return BY_NAME[name];
}
