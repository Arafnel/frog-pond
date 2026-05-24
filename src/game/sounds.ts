import popSrc from "../../sounds/pop.mp3";
import winSrc from "../../sounds/win.mp3";

const VOLUME = 0.75;

function playClip(src: string) {
  if (typeof window === "undefined") return;
  const audio = new Audio(src);
  audio.volume = VOLUME;
  void audio.play().catch(() => {});
}

export function playPopSound() {
  playClip(popSrc);
}

export function playWinSound() {
  playClip(winSrc);
}
