"use client";

import { useEffect, useRef, useState } from "react";
import { Bomb, RotateCcw, Trophy, X } from "lucide-react";
import { formatElapsed } from "@/hooks/useTimer";
import { strings } from "@/lib/strings";
import type { GameStatus } from "@/game/core/types";

export type ResultDialogProps = {
  status: GameStatus;
  seconds: number;
  /** true when this run just became the best time for its difficulty */
  isRecord: boolean;
  /** only then is the "slashed flags" line about something on screen */
  wrongFlags: boolean;
  onReset: () => void;
};

/**
 * Anchored to the bottom rather than centred, so the board stays visible behind it -
 * which matters most on a loss, where the revealed mines are the point.
 *
 * No confetti and no shake. Winning says the time, and says so plainly when that
 * time is the new best; losing says where to look - and how long it took, because
 * that number is the only thing a player carries out of a board they lost.
 *
 * Closing and starting over are two different things. They used to be one: the only
 * control was "Bàn mới" and Esc reset the board too, so there was no way to sit and
 * look at the board you had just finished. "Ủa, cái 5:08 của tôi đâu?" (p02-RR-01)
 * and "không có chỗ nào để quay lui" (p06-blind). Dismissing now leaves the finished
 * board on screen; invariant #7 keeps it frozen, so there is nothing to protect it
 * from.
 */
export function ResultDialog({
  status,
  seconds,
  isRecord,
  wrongFlags,
  onReset,
}: ResultDialogProps) {
  const button = useRef<HTMLButtonElement>(null);
  const settled = status === "won" || status === "lost";
  /** Dismissed by the player. Cleared whenever a new result arrives. */
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (settled) {
      setDismissed(false);
      button.current?.focus();
    }
  }, [settled, status, seconds]);

  if (!settled || dismissed) return null;
  const won = status === "won";

  return (
    <div
      className="ms-scrim ms-scrim--result"
      role="dialog"
      aria-modal="false"
      aria-label={won ? strings.wonTitle : strings.lostTitle}
      data-testid="result-dialog"
      onKeyDown={(event) => {
        // Esc dismisses, the way Esc dismisses everywhere else. It used to start a
        // new board, which threw away the result the player had just earned.
        if (event.key === "Escape") setDismissed(true);
      }}
    >
      <div className="ms-dialog">
        <div className="ms-dialog-head">
          {won ? (
            <Trophy className="ms-dialog-icon" aria-hidden="true" />
          ) : (
            <Bomb className="ms-dialog-icon ms-dialog-icon--boom" aria-hidden="true" />
          )}
          <span className="ms-dialog-title">
            {won ? strings.wonTitle : strings.lostTitle}
          </span>
          <button
            type="button"
            className="ms-iconbtn ms-dialog-close"
            data-testid="result-close"
            aria-label={strings.close}
            onClick={() => setDismissed(true)}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <span className="ms-dialog-time" data-testid="result-time">
          {formatElapsed(seconds)}
        </span>
        {won && isRecord ? (
          <span className="ms-dialog-note" data-testid="result-record">
            {strings.wonRecord}
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
