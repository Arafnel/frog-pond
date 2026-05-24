import { createFileRoute } from "@tanstack/react-router";
import { Pond } from "@/components/Pond";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Frog Pond — Cozy Puzzle Game" },
      {
        name: "description",
        content:
          "A cozy mobile puzzle game. Drag kawaii frogs onto lily pads and match their wishes.",
      },
    ],
  }),
});

function Index() {
  return <Pond />;
}
