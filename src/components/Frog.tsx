import { motion } from "framer-motion";
import type { FrogColor } from "@/game/levels";
import { accessoryForFrog } from "@/game/frog-accessories";
import { FrogAccessorySvg } from "./FrogAccessory";

const COLORS: Record<FrogColor, { body: string; belly: string; cheek: string }> = {
  green: { body: "var(--frog-green)", belly: "oklch(0.93 0.06 140)", cheek: "oklch(0.82 0.10 30)" },
  yellow: { body: "var(--frog-yellow)", belly: "oklch(0.96 0.05 95)", cheek: "oklch(0.82 0.10 30)" },
  pink: { body: "var(--frog-pink)", belly: "oklch(0.96 0.04 350)", cheek: "oklch(0.78 0.12 20)" },
  blue: { body: "var(--frog-blue)", belly: "oklch(0.95 0.04 230)", cheek: "oklch(0.78 0.12 20)" },
};

interface Props {
  color: FrogColor;
  name?: string;
  mood?: "neutral" | "happy" | "sad";
  size?: number;
}

export function Frog({ color, name, mood = "neutral", size = 72 }: Props) {
  const c = COLORS[color];
  const accessory = name ? accessoryForFrog(name) : undefined;
  const mouth =
    mood === "happy"
      ? "M40 60 Q50 70 60 60"
      : mood === "sad"
        ? "M40 64 Q50 56 60 64"
        : "M42 60 Q50 64 58 60";

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ filter: "drop-shadow(0 6px 8px oklch(0.30 0.08 160 / 0.30))" }}
    >
      <ellipse cx="22" cy="70" rx="14" ry="10" fill={c.body} />
      <ellipse cx="78" cy="70" rx="14" ry="10" fill={c.body} />
      <ellipse cx="50" cy="58" rx="32" ry="28" fill={c.body} />
      {accessory === "scarf" && <FrogAccessorySvg kind="scarf" />}
      {accessory === "spots" && <FrogAccessorySvg kind="spots" />}
      <ellipse cx="50" cy="64" rx="20" ry="16" fill={c.belly} />
      <circle cx="34" cy="34" r="14" fill={c.body} />
      <circle cx="66" cy="34" r="14" fill={c.body} />
      {accessory === "leaf" && <FrogAccessorySvg kind="leaf" />}
      {accessory === "beret" && <FrogAccessorySvg kind="beret" />}
      {accessory === "crown" && <FrogAccessorySvg kind="crown" />}
      {accessory === "bow" && <FrogAccessorySvg kind="bow" />}
      {accessory === "flower" && <FrogAccessorySvg kind="flower" />}
      <circle cx="34" cy="34" r="9" fill="white" />
      <circle cx="66" cy="34" r="9" fill="white" />
      <motion.g
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.92, 0.95, 0.98, 1] }}
        style={{ transformOrigin: "50px 34px" }}
      >
        <circle cx="35" cy="35" r="4" fill="#1a1a1a" />
        <circle cx="65" cy="35" r="4" fill="#1a1a1a" />
        <circle cx="36.5" cy="33.5" r="1.4" fill="white" />
        <circle cx="66.5" cy="33.5" r="1.4" fill="white" />
      </motion.g>
      <circle cx="28" cy="52" r="4" fill={c.cheek} opacity="0.55" />
      <circle cx="72" cy="52" r="4" fill={c.cheek} opacity="0.55" />
      <path d={mouth} stroke="#3a2a2a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="82" rx="6" ry="3" fill={c.body} />
      <ellipse cx="60" cy="82" rx="6" ry="3" fill={c.body} />
      {accessory === "droplet" && <FrogAccessorySvg kind="droplet" />}
    </motion.svg>
  );
}
