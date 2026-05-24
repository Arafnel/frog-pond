import type { FrogAccessory as AccessoryKind } from "@/game/frog-accessories";

export function FrogAccessorySvg({ kind }: { kind: AccessoryKind }) {
  switch (kind) {
    case "bow":
      return (
        <g transform="translate(50 20)">
          <ellipse cx="-7" cy="1" rx="6" ry="5" fill="oklch(0.78 0.16 350)" />
          <ellipse cx="7" cy="1" rx="6" ry="5" fill="oklch(0.78 0.16 350)" />
          <circle r="3.5" fill="oklch(0.65 0.14 350)" />
        </g>
      );
    case "flower":
      return (
        <g transform="translate(68 24)">
          <circle r="5" fill="oklch(0.92 0.12 95)" />
          <circle r="4" cx="-5" cy="2" fill="oklch(0.90 0.14 85)" />
          <circle r="4" cx="5" cy="2" fill="oklch(0.90 0.14 85)" />
          <circle r="2.5" fill="oklch(0.75 0.15 70)" />
        </g>
      );
    case "leaf":
      return (
        <g transform="translate(22 28) rotate(-25)">
          <path
            d="M0 0 Q8 -10 14 0 Q8 12 0 0"
            fill="oklch(0.62 0.14 145)"
          />
          <path d="M0 0 L0 14" stroke="oklch(0.50 0.12 150)" strokeWidth="1.2" />
        </g>
      );
    case "crown":
      return (
        <g transform="translate(50 16)">
          <path
            d="M-14 6 L-10 -4 L-4 2 L0 -6 L4 2 L10 -4 L14 6 Z"
            fill="oklch(0.88 0.12 90)"
            stroke="oklch(0.72 0.10 80)"
            strokeWidth="1"
          />
        </g>
      );
    case "scarf":
      return (
        <g>
          <path
            d="M32 48 Q50 56 68 48 L66 54 Q50 62 34 54 Z"
            fill="oklch(0.68 0.16 25)"
          />
          <path
            d="M58 54 L64 68 L54 66 Z"
            fill="oklch(0.62 0.14 25)"
          />
        </g>
      );
    case "droplet":
      return (
        <g transform="translate(50 72)">
          <path
            d="M0 -6 Q5 2 0 8 Q-5 2 0 -6"
            fill="oklch(0.78 0.10 230)"
            opacity="0.9"
          />
        </g>
      );
    case "spots":
      return (
        <g fill="oklch(0.55 0.10 150 / 0.35)">
          <circle cx="40" cy="55" r="3.5" />
          <circle cx="58" cy="62" r="2.5" />
          <circle cx="48" cy="70" r="2" />
        </g>
      );
    case "beret":
      return (
        <g transform="translate(50 22)">
          <ellipse rx="16" ry="6" fill="oklch(0.55 0.12 350)" />
          <ellipse rx="10" ry="4" cy="-2" fill="oklch(0.62 0.14 340)" />
        </g>
      );
  }
}
