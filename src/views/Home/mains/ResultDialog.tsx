"use client";

import { useEffect, useRef } from "react";
import { Bomb, RotateCcw, Trophy } from "lucide-react";
import { formatElapsed } from "@/hooks/useTimer";
import { strings } from "@/lib/strings";
import type { GameStatus } from "@/game/core/types";

export type ResultDialogProps = {
  status: GameStatus;
  seconds: number;
  /** only then is the "slashed flags" line about something on screen */
  wrongFlags: boolean;
  onReset: () => void;
};

/**
 * Anchored to the bottom rather than centred, so the board stays visible behind it -
 * which matters most on a loss, where the revealed mines are the point.
 *
 * No confetti and no shake. Winning says the time; losing says where to look. The
 * best-time line belongs to settings-records, so it is absent rather than faked.
 */
export function ResultDialog({ status, seconds, wrongFlags, onReset }: ResultDialogProps) {
  const button = useRef<HTMLButtonElement>(null);
  const open = status === "won" || status === "lost";

  useEffect(() => {
    if (open) button.current?.focus();
  }, [open]);

  if (!open) return null;
  const won = status === "won";

  return (
    <div
      className="ms-scrim"
      role="dialog"
      aria-modal="false"
      aria-label={won ? strings.wonTitle : strings.lostTitle}
      data-testid="result-dialog"
      onKeyDown={(event) => {
        // Esc is the new board here: there is nothing to go back to, and a dialog
        // that traps you behind a dead board is worse than no dialog.
        if (event.key === "Escape") onReset();
      }}
    >
      <div className="ms-dialog">
        <div className="ms-dialog-head">
          {won ? (
            <Trophy className="ms-dialog-icon" aria-hidden="true" />
          ) : (
            <Bomb className="ms-dialog-icon ms-dialog-icon--boom" aria-hidden="true" />
          )}
          <span className="ms-dialog-title">{won ? strings.wonTitle : strings.lostTitle}</span>
        </div>

        {won ? (
          <span className="ms-dialog-time" data-testid="result-time">
            {formatElapsed(seconds)}
          </span>
        ) : null}
        {!won && wrongFlags ? (
          <span className="ms-dialog-note">{strings.lostHint}</span>
        ) : null}

        <button ref={button} type="button" className="ms-dialog-action" onClick={onReset}>
          <RotateCcw aria-hidden="true" />
          <span>{strings.newGame}</span>
        </button>
      </div>
    </div>
  );
}
