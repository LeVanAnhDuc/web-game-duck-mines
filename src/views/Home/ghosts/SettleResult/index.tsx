"use client";

// libs
import { useEffect, useRef } from "react";

// types
import type { Difficulty, GameStatus } from "@/game/core/types";

/**
 * Settle the end of a board exactly once.
 *
 * Watching `status` without remembering what it was would fire again on any unrelated
 * re-render, and record the same win twice. The `settled` ref is that memory, and it
 * lives INSIDE this ghost with the effect it guards - split the two apart and the
 * duplicate-record bug comes straight back, with the tests still green.
 */
export function SettleResult({
  status,
  startedAt,
  endedAt,
  ranked,
  onLost,
  onRecord,
  onSettled,
}: {
  status: GameStatus;
  startedAt: number | null;
  endedAt: number | null;
  /** `null` for a board the player built - never recorded, however fast it was cleared. */
  ranked: Difficulty | null;
  onLost: () => void;
  /** Returns true when the time is a new best. */
  onRecord: (ranked: Difficulty, seconds: number) => boolean;
  onSettled: (isRecord: boolean) => void;
}) {
  const settled = useRef<GameStatus>("idle");

  useEffect(() => {
    if (status === settled.current) return;
    settled.current = status;

    if (status !== "won") {
      if (status === "lost") onLost();
      onSettled(false);
      return;
    }
    if (startedAt === null || endedAt === null) return;
    // This is the one line ADR-0007 warned would be easy to get wrong in silence, so
    // the decision reads off the board itself rather than off the settings.
    if (ranked === null) {
      onSettled(false);
      return;
    }
    // Seconds come from the two instants, never from what the clock happens to be
    // showing - ADR-0005.
    const seconds = Math.floor((endedAt - startedAt) / 1000);
    onSettled(onRecord(ranked, seconds));
  }, [status, startedAt, endedAt, ranked, onLost, onRecord, onSettled]);

  return null;
}
