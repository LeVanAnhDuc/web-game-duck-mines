import { FLAGGED, REVEALED, type Board } from "./types";

/**
 * Counts OPEN cells, not flags. Planting all 99 flags correctly while safe cells are
 * still closed is NOT a win - a clone that ends the game there is counting the wrong
 * thing (journeys.md US-01, "what can go wrong").
 */
export function isWon(board: Board): boolean {
  if (!board.mines) return false;
  const safe = board.cols * board.rows - board.mineCount;
  let revealed = 0;
  for (let i = 0; i < board.marks.length; i += 1) {
    if (board.marks[i] === REVEALED) revealed += 1;
  }
  return revealed === safe;
}

export function flagsPlaced(board: Board): number {
  let flags = 0;
  for (let i = 0; i < board.marks.length; i += 1) {
    if (board.marks[i] === FLAGGED) flags += 1;
  }
  return flags;
}

/** mineCount minus flags placed. Goes NEGATIVE on purpose (FR-06): a negative
 * counter tells the player they have certainly misplaced a flag somewhere. */
export function minesRemaining(board: Board): number {
  return board.mineCount - flagsPlaced(board);
}

/**
 * Shows every mine that is not under a flag.
 *
 * It must NOT clear any flag - invariant #6. Flags are what makes the wrong-flag
 * slash drawable, and a player who cannot see where they went wrong learns nothing
 * from losing. Nothing in the test suite catches this if it regresses, which is
 * exactly why it is an invariant.
 */
export function revealAllMines(board: Board): Board {
  const { mines, marks } = board;
  if (!mines) return board;
  const next = marks.slice();
  for (let i = 0; i < next.length; i += 1) {
    if (mines[i] === 1 && next[i] !== FLAGGED) next[i] = REVEALED;
  }
  return { ...board, marks: next };
}

/** True when a flag sits on a safe cell. Only meaningful once the game is lost. */
export function isWrongFlag(board: Board, index: number): boolean {
  const { mines, marks } = board;
  if (!mines) return false;
  return marks[index] === FLAGGED && mines[index] === 0;
}
