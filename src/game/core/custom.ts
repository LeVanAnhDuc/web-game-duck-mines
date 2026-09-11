import type { DifficultySpec } from "./constants";

/**
 * Bounds for a board the player builds themselves.
 *
 * The upper bounds are not taste. 40 columns is what pan/zoom (ADR-0009) still makes
 * playable at the 22px floor; past that the board stops being navigable rather than
 * just big. The lower bound of 5 is the smallest board on which the first move can
 * still clear its 3x3 and leave anywhere to put a mine.
 */
export const CUSTOM_LIMITS = {
  cols: { min: 5, max: 40 },
  rows: { min: 5, max: 30 },
  minMines: 1,
} as const;

/**
 * The real ceiling on mines, and the reason it is not `cols * rows - 1`: the first
 * move excludes its own cell and all eight neighbours (ADR-0003), so those nine have
 * to be free for the board to be generatable at all. Asking for more is not a
 * preference the game can honour.
 */
export function maxMines(cols: number, rows: number): number {
  return Math.max(CUSTOM_LIMITS.minMines, cols * rows - 9);
}

function clampInt(value: number, min: number, max: number, fallback: number): number {
  // Only NaN needs the escape hatch. Infinity is a perfectly clear request - "as big
  // as it goes" - and Math.min answers it correctly; sending it to the fallback would
  // silently hand back 16 to someone who asked for the largest board there is.
  if (Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * Brings any input inside the bounds.
 *
 * Called when a value is COMMITTED, never on every keystroke - clamping mid-typing
 * made most of the range unreachable and answered with numbers nobody typed
 * (ADR-0011). The field keeps the half-typed string to itself and only sends a value
 * up once it is inside the bounds, or on blur. The limit still reaches the player
 * while typing, through `min`/`max` on the input and the help lines beneath it.
 */
export function clampCustom(input: Partial<DifficultySpec>): DifficultySpec {
  const cols = clampInt(
    input.cols ?? 16,
    CUSTOM_LIMITS.cols.min,
    CUSTOM_LIMITS.cols.max,
    16,
  );
  const rows = clampInt(
    input.rows ?? 16,
    CUSTOM_LIMITS.rows.min,
    CUSTOM_LIMITS.rows.max,
    16,
  );
  const mineCount = clampInt(
    input.mineCount ?? 40,
    CUSTOM_LIMITS.minMines,
    maxMines(cols, rows),
    Math.min(40, maxMines(cols, rows)),
  );
  return { cols, rows, mineCount };
}

/** Share of cells that hold a mine. Expert sits at 0.206, which is the number a
 * player is really comparing against when they build their own board. */
export function mineDensity(spec: DifficultySpec): number {
  return spec.mineCount / (spec.cols * spec.rows);
}

export const DEFAULT_CUSTOM: DifficultySpec = { cols: 16, rows: 16, mineCount: 40 };
