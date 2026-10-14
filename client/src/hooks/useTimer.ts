"use client";

import { useEffect, useState } from "react";
import type { GameStatus } from "@/game/core/types";

/**
 * The clock lives here, NOT in GameState - ADR-0005. A tick per second inside the
 * reducer would build a new GameState every second and re-render all 480 cells, with
 * nothing in the test suite turning red.
 *
 * It computes the DIFFERENCE between two instants rather than counting ticks:
 * setInterval gets throttled in a background tab, and a tick counter would then run
 * slow, which would make records settable by switching tabs.
 */
export function useTimer(
  startedAt: number | null,
  endedAt: number | null,
  status: GameStatus,
): number {
  const [, setTick] = useState(0);
  const running = status === "playing" && startedAt !== null;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, [running]);

  if (startedAt === null) return 0;
  const until = endedAt ?? (running ? Date.now() : startedAt);
  return Math.max(0, Math.floor((until - startedAt) / 1000));
}

/** m:ss, and it does not stop at 999 - that was a three-digit LED, not a rule. */
export function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
