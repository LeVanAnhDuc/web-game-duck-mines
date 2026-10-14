"use client";

import { useEffect, useState } from "react";

/** The floor from MASTER.md section 3: below this the numerals stop being readable. */
const MIN_CELL = 22;
const CELL_GAP = 2;
const BOARD_PADDING = 16;
const GUTTER = 32;

/**
 * True only in the narrow case worth interrupting for: the board does not fit the way
 * the phone is being held, but WOULD fit if it were turned - FR-17.
 *
 * The expert board is 30 columns; at 812px landscape that is 27px a cell and the whole
 * thing is visible with no panning at all. Saying so costs one line and removes the
 * problem outright for the commonest phone and the commonest big board.
 *
 * It stays quiet when rotating would not help (a 40-column custom board), when the
 * board already fits, and on anything with a real pointer - a desktop window does not
 * rotate.
 */
export function useRotateHint(cols: number): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const needed = cols * MIN_CELL + (cols - 1) * CELL_GAP + BOARD_PADDING + GUTTER;

    const check = () => {
      const touch = window.matchMedia("(hover: none)").matches;
      const short = Math.min(window.innerWidth, window.innerHeight);
      const long = Math.max(window.innerWidth, window.innerHeight);
      setShow(touch && window.innerWidth < needed && long >= needed && short < needed);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, [cols]);

  return show;
}
