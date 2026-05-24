import popSrc from "../../sounds/pop.mp3";
import winSrc from "../../sounds/win.mp3";

function play(src: string) {
  if (typeof window === "undefined") return;
  const audio = new Audio(src);
  audio.volume = 0.75;
  void audio.play().catch(() => {});
}

export function playPop() {
  play(popSrc);
}

export function playWin() {
  play(winSrc);
}
