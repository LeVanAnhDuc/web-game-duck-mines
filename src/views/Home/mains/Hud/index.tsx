"use client";

import { RotateCcw } from "lucide-react";
import { formatElapsed } from "@/hooks/useTimer";
import { minesRemaining } from "@/game/core/rules";
import { strings } from "@/lib/strings";
import type { Board } from "@/game/core/types";

export type HudProps = {
  board: Board;
  /** seconds, owned by the page so the dialog cannot disagree with the readout */
  elapsed: number;
  onReset: () => void;
};

/**
 * One continuous strip, not three cards side by side: the two readouts are recessed
 * into it and the new-game button is the only thing that rises out of it
 * (MASTER.md section 6).
 */
export function Hud({ board, elapsed, onReset }: HudProps) {
  return (
    <div className="ms-hud">
      <MineCounter remaining={minesRemaining(board)} />
      <button type="button" className="ms-reset" aria-label={strings.newGame} onClick={onReset}>
        <RotateCcw aria-hidden="true" />
      </button>
      <Timer seconds={elapsed} />
    </div>
  );
}

export function MineCounter({ remaining }: { remaining: number }) {
  // U+2212 MINUS SIGN, not a hyphen: it has the same advance width as a digit in a
  // monospaced face, so the readout does not shift when the counter goes negative.
  const text = `${remaining < 0 ? "−" : ""}${String(Math.abs(remaining)).padStart(3, "0")}`;
  return (
    <div className="ms-readout" role="status" aria-label={strings.minesRemaining}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <path d="M4 22v-7" />
      </svg>
      <span data-testid="mine-counter">{text}</span>
    </div>
  );
}

export function Timer({ seconds }: { seconds: number }) {
  return (
    <div className="ms-readout" role="timer" aria-label={strings.elapsed}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M10 2h4" />
        <path d="M12 14v-4" />
        <circle cx="12" cy="14" r="8" />
      </svg>
      <span data-testid="timer">{formatElapsed(seconds)}</span>
    </div>
  );
}
