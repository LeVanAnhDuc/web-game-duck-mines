"use client";

import { useCallback, useState } from "react";

/**
 * Where the keyboard is pointing. UI state, not game state - it never belongs in
 * GameState, and it survives nothing: a new board resets it.
 *
 * Only ONE cell carries tabIndex 0 (roving tabindex). 480 tab stops would be
 * "accessible" on paper and unusable in practice.
 */
export function useBoardCursor(cols: number, rows: number) {
  const [cursor, setCursor] = useState(0);

  const move = useCallback(
    (dCol: number, dRow: number) => {
      setCursor((current) => {
        const col = current % cols;
        const row = (current - col) / cols;
        // clamped, deliberately not wrapping: wrapping loses your place on a 30-wide
        // board, and nothing on screen explains where the cursor went
        const nextCol = Math.min(cols - 1, Math.max(0, col + dCol));
        const nextRow = Math.min(rows - 1, Math.max(0, row + dRow));
        return nextRow * cols + nextCol;
      });
    },
    [cols, rows],
  );

  const moveToRowEdge = useCallback(
    (edge: "start" | "end") => {
      setCursor((current) => {
        const col = current % cols;
        const row = (current - col) / cols;
        return row * cols + (edge === "start" ? 0 : cols - 1);
      });
    },
    [cols],
  );

  return { cursor, setCursor, move, moveToRowEdge };
}
