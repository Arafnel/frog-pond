import { useCallback, useState } from "react";
import { playPopSound, playWinSound } from "@/game/sounds";

const STORAGE_KEY = "frog-pond-sound";

function readEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

export function useGameAudio() {
  const [enabled, setEnabled] = useState(readEnabled);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const playPop = useCallback(() => {
    if (enabled) playPopSound();
  }, [enabled]);

  const playWin = useCallback(() => {
    if (enabled) playWinSound();
  }, [enabled]);

  return { enabled, toggle, playPop, playWin };
}
