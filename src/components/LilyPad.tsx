import { motion } from "framer-motion";
import { forwardRef } from "react";

interface Props {
  size?: number;
  highlight?: boolean;
  swapTarget?: boolean;
  occupied?: boolean;
  flower?: boolean;
}

export const LilyPad = forwardRef<HTMLDivElement, Props>(function LilyPad(
  { size = 110, highlight = false, swapTarget = false, occupied = false, flower = false },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      {highlight && (
        <span
          className="absolute inset-0 rounded-full animate-ripple"
          style={{
            background: swapTarget
              ? "oklch(0.88 0.12 85 / 0.65)"
              : "oklch(0.95 0.04 150 / 0.6)",
          }}
        />
      )}
      <motion.svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        animate={{ rotate: [0, 2, -2, 0], opacity: occupied ? 0.72 : 1 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 8px 10px oklch(0.30 0.10 200 / 0.30))" }}
      >
        {/* pad shadow under */}
        <ellipse cx="60" cy="68" rx="54" ry="50" fill="var(--lily-pad-dark)" opacity="0.85" />
        <ellipse cx="60" cy="62" rx="54" ry="50" fill="var(--lily-pad)" />
        {/* notch (classic lily pad cut) */}
        <path d="M60 62 L60 14 A48 48 0 0 1 96 36 Z" fill="var(--pond-mid)" opacity="0.95" />
        {/* veins */}
        <g stroke="var(--lily-pad-dark)" strokeWidth="1.2" fill="none" opacity="0.5">
          <path d="M60 62 L20 40" />
          <path d="M60 62 L18 70" />
          <path d="M60 62 L40 104" />
          <path d="M60 62 L86 104" />
          <path d="M60 62 L104 80" />
        </g>
        {/* highlight sheen */}
        <ellipse cx="44" cy="48" rx="14" ry="5" fill="white" opacity="0.25" />
        {flower && (
          <g transform="translate(82 30)">
            <circle r="9" fill="var(--lily-flower)" />
            <circle r="9" cx="-6" cy="3" fill="var(--lily-flower)" opacity="0.9" />
            <circle r="9" cx="6" cy="3" fill="var(--lily-flower)" opacity="0.9" />
            <circle r="4" fill="var(--sun-glow)" />
          </g>
        )}
      </motion.svg>
    </div>
  );
});