import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import pondBackground from "@/game/pond-background";
import { DIFFICULTY_LABEL } from "@/game/levels";
import { useGameAudio } from "@/hooks/use-game-audio";
import { usePondGame } from "@/hooks/use-pond-game";
import { Frog } from "./Frog";
import { SoundToggle } from "./SoundToggle";
import { FrogTray } from "./pond/FrogTray";
import { PondPlayfield } from "./pond/PondPlayfield";
import { WinOverlay } from "./pond/WinOverlay";

export function Pond() {
  const audio = useGameAudio();
  const game = usePondGame(audio);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <img src={pondBackground} alt="" className="h-full w-full object-cover" draggable={false} />
      </div>

      <div className="select-none-game relative z-10 mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden">
        <header className="relative z-20 flex items-start justify-between gap-3 px-5 pt-5">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/80 drop-shadow-sm">
              Level {game.level.id} · {DIFFICULTY_LABEL[game.level.difficulty]}
            </p>
            <h1 className="font-display truncate text-2xl font-bold text-foreground drop-shadow-md">
              {game.level.name}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <SoundToggle enabled={audio.enabled} onToggle={audio.toggle} />
            <button
              type="button"
              onClick={game.resetLevel}
              className="rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft active:scale-95 transition"
            >
              Reset
            </button>
          </div>
        </header>

        <p className="relative z-20 px-5 pt-1 text-sm text-foreground/90 drop-shadow-sm">
          {game.level.hint}
        </p>

        <PondPlayfield
          level={game.level}
          padById={game.padById}
          pondRef={game.pondRef}
          splashPadId={game.splashPadId}
          hoverPad={game.hoverPad}
          draggingId={game.draggingId}
          placedFrogs={game.placedFrogs}
          frogById={game.frogById}
          happiness={game.happiness}
          allPlaced={game.allPlaced}
          bindPadRef={game.bindPadRef}
          padOccupant={game.padOccupant}
          dragHandlers={game.dragHandlers}
        />

        <FrogTray
          trayRef={game.trayRef}
          frogs={game.trayFrogs}
          placedCount={game.placedFrogs.length}
          draggingId={game.draggingId}
          dragHandlers={game.dragHandlers}
        />

        {game.draggingFrog &&
          game.dragPoint &&
          createPortal(
            <div
              className="pointer-events-none fixed"
              style={{
                left: game.dragPoint.x,
                top: game.dragPoint.y,
                transform: "translate(-50%, -55%)",
                zIndex: 9999,
              }}
            >
              <Frog color={game.draggingFrog.color} name={game.draggingFrog.name} size={72} />
            </div>,
            document.body,
          )}

        <AnimatePresence>
          {game.won && (
            <WinOverlay
              levelName={game.level.name}
              onNext={game.nextLevel}
              onReplay={game.resetLevel}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
