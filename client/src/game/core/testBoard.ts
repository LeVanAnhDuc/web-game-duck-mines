import { countAdjacent } from "./board";
import { FLAGGED, HIDDEN, REVEALED, UNSURE, type Board, type Mark } from "./types";

const MARKS: Record<string, Mark> = {
  ".": HIDDEN,
  "*": HIDDEN,
  o: REVEALED,
  O: REVEALED,
  F: FLAGGED,
  f: FLAGGED,
  "?": UNSURE,
};

/**
 * Builds a board from an ASCII picture, so a test reads like the board it describes.
 *
 *   mines:  '*' and 'O' and 'F' (uppercase = there is a mine under it)
 *   marks:  '.' hidden · 'o'/'O' revealed · 'f'/'F' flagged · '?' unsure
 *
 * Only used by tests, but it lives in src/ so it type-checks with everything else.
 */
export function boardFrom(picture: string[]): Board {
  const rows = picture.length;
  const cols = picture[0]!.length;
  const size = cols * rows;
  const mines = new Uint8Array(size);
  const marks = new Uint8Array(size);
  let mineCount = 0;

  picture.forEach((line, r) => {
    if (line.length !== cols) throw new Error("test board rows must be the same width");
    [...line].forEach((ch, c) => {
      const i = r * cols + c;
      const isMine = ch === "*" || ch === "O" || ch === "F";
      if (isMine) {
        mines[i] = 1;
        mineCount += 1;
      }
      const mark = MARKS[ch];
      if (mark === undefined) throw new Error(`unknown cell '${ch}' in test board`);
      marks[i] = mark;
    });
  });

  return countAdjacent({ cols, rows, mineCount, mines, adj: new Uint8Array(size), marks });
}

export function marksOf(board: Board): string[] {
  const out: string[] = [];
  for (let r = 0; r < board.rows; r += 1) {
    let line = "";
    for (let c = 0; c < board.cols; c += 1) {
      const i = r * board.cols + c;
      const mine = board.mines?.[i] === 1;
      const mark = board.marks[i];
      if (mark === REVEALED) line += mine ? "O" : "o";
      else if (mark === FLAGGED) line += mine ? "F" : "f";
      else if (mark === UNSURE) line += "?";
      else line += mine ? "*" : ".";
    }
    out.push(line);
  }
  return out;
}
