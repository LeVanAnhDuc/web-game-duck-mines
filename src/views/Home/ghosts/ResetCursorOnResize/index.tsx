"use client";

// libs
import { useEffect } from "react";

/**
 * The cursor is a position on THIS board; a different size has no such position.
 */
export function ResetCursorOnResize({
  cols,
  rows,
  onReset,
}: {
  cols: number;
  rows: number;
  onReset: (index: number) => void;
}) {
  useEffect(() => onReset(0), [cols, rows, onReset]);

  return null;
}
