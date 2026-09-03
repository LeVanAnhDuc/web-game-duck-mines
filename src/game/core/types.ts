/**
 * Shapes only - no logic, no imports. See docs/specs/core-game/design.md section 2
 * for why the board is three flat Uint8Arrays rather than an array of cell objects.
 */

export type Difficulty = "beginner" | "intermediate" | "expert";

export type GameStatus = "idle" | "playing" | "won" | "lost";

export const HIDDEN = 0;
export const REVEALED = 1;
export const FLAGGED = 2;
export const UNSURE = 3;

export type Mark = typeof HIDDEN | typeof REVEALED | typeof FLAGGED | typeof UNSURE;

export type Board = {
  cols: number;
  rows: number;
  mineCount: number;
  /** null until the first move. A real state, not a missing value - ADR-0003. */
  mines: Uint8Array | null;
  /** adjacent mine count per cell; only meaningful once mines !== null */
  adj: Uint8Array;
  marks: Uint8Array;
};

export type GameState = {
  difficulty: Difficulty;
  board: Board;
  status: GameStatus;
  /** when the first move happened. The clock itself is NOT here - ADR-0005. */
  startedAt: number | null;
  endedAt: number | null;
  /** INDEX of the mine that went off, not a timestamp. Only used for drawing. */
  explodedIndex: number | null;
};

export type ActKind = "reveal" | "mark" | "chord";

/**
 * `at` and `seed` travel in the action because core/ may call neither Date.now nor
 * Math.random. `allowUnsure` travels the same way: it is a player setting, and
 * settings belong to the settings-records feature.
 *
 * The seed rides on `reveal` rather than living in GameState, and it is read only
 * when the board is still unplanted. That way there is no moment between mount and
 * a first click during which the seed is not settled yet - a window a fast player
 * could lose a move in.
 */
export type Action =
  | { type: "reveal"; index: number; at: number; seed: number }
  | { type: "mark"; index: number; allowUnsure: boolean }
  | { type: "chord"; index: number; at: number }
  | { type: "reset" };
