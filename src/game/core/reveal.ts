import { neighbours } from "./board";
import { FLAGGED, HIDDEN, REVEALED, type Board } from "./types";

export type RevealResult = {
  board: Board;
  /** index of the mine that went off, or null */
  exploded: number | null;
};

/**
 * Opens `index`, spreading through the empty region when it has no adjacent mines.
 *
 * The flood uses an explicit stack, and its stop condition `next[k] !== HIDDEN`
 * blocks three things with one comparison: already-open cells, flagged cells and
 * question-marked cells. The flagged case is the one clones forget.
 *
 * The clicked cell itself opens whether it is hidden or question-marked - that is
 * the original behaviour. The flood never expands into either mark.
 */
export function reveal(board: Board, index: number): RevealResult {
  const { cols, rows, mines, marks, adj } = board;
  if (!mines) return { board, exploded: null };
  if (index < 0 || index >= marks.length) return { board, exploded: null };
  if (marks[index] === REVEALED || marks[index] === FLAGGED) {
    return { board, exploded: null };
  }
  if (mines[index] === 1) return { board, exploded: index };

  const next = marks.slice();
  next[index] = REVEALED;
  const stack: number[] = adj[index] === 0 ? neighbours(index, cols, rows) : [];
  while (stack.length > 0) {
    const k = stack.pop()!;
    if (next[k] !== HIDDEN) continue;
    next[k] = REVEALED;
    if (adj[k] === 0) {
      for (const j of neighbours(k, cols, rows)) if (next[j] === HIDDEN) stack.push(j);
    }
  }
  return { board: { ...board, marks: next }, exploded: null };
}

/**
 * Opens every un-flagged neighbour of an already-open number when the flags around
 * it match that number.
 *
 * It EXPLODES when the flag count matches but a flag sits in the wrong place. That
 * is deliberate: a chord is the claim "I know these are mines", so being wrong has
 * to cost something. Making it harmless turns chord into a free probe.
 */
export function chord(board: Board, index: number): RevealResult {
  const { cols, rows, mines, marks, adj } = board;
  if (!mines) return { board, exploded: null };
  if (index < 0 || index >= marks.length) return { board, exploded: null };
  if (marks[index] !== REVEALED || adj[index] === 0) return { board, exploded: null };

  const around = neighbours(index, cols, rows);
  let flags = 0;
  for (const j of around) if (marks[j] === FLAGGED) flags += 1;
  if (flags !== adj[index]) return { board, exploded: null };

  let current = board;
  let exploded: number | null = null;
  for (const j of around) {
    if (current.marks[j] !== HIDDEN) continue;
    const result = reveal(current, j);
    current = result.board;
    if (result.exploded !== null && exploded === null) exploded = result.exploded;
  }
  return { board: current, exploded };
}
