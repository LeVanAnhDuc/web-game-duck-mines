import { FLAGGED, HIDDEN, REVEALED, UNSURE, type Board } from "./types";

/**
 * hidden -> flagged -> hidden, or hidden -> flagged -> unsure -> hidden when the
 * player has switched question marks on. `allowUnsure` is a parameter rather than a
 * module-level flag so core/ holds no settings state.
 *
 * Returns the SAME board object when nothing changes, so the reducer can pass that
 * identity straight through and React skips the render.
 */
export function cycleMark(board: Board, index: number, allowUnsure: boolean): Board {
  const { marks } = board;
  if (index < 0 || index >= marks.length) return board;
  if (marks[index] === REVEALED) return board;

  const next = marks.slice();
  if (marks[index] === HIDDEN) next[index] = FLAGGED;
  else if (marks[index] === FLAGGED) next[index] = allowUnsure ? UNSURE : HIDDEN;
  else next[index] = HIDDEN;
  return { ...board, marks: next };
}
