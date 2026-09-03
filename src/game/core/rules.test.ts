import { describe, expect, it } from "vitest";
import {
  flagsPlaced,
  hasWrongFlag,
  isWon,
  isWrongFlag,
  minesRemaining,
  revealAllMines,
} from "./rules";
import { boardFrom, marksOf } from "./testBoard";
import { FLAGGED } from "./types";

describe("isWon", () => {
  it("is false when every mine is flagged but safe cells are still closed", () => {
    // this is the case clones get wrong: flags are not progress, open cells are
    const board = boardFrom([
      "F..",
      "...",
      "...",
    ]);
    expect(flagsPlaced(board)).toBe(1);
    expect(isWon(board)).toBe(false);
  });

  it("is true once every safe cell is open, even with no flags at all", () => {
    const board = boardFrom([
      "*oo",
      "ooo",
      "ooo",
    ]);
    expect(flagsPlaced(board)).toBe(0);
    expect(isWon(board)).toBe(true);
  });

  it("is false before the mines are planted", () => {
    const board = boardFrom(["...", "...", "..."]);
    expect(isWon({ ...board, mines: null })).toBe(false);
  });
});

describe("minesRemaining", () => {
  it("counts down as flags go in", () => {
    const board = boardFrom(["F*.", "...", "..."]);
    expect(minesRemaining(board)).toBe(1);
  });

  it("goes negative rather than clamping at zero - FR-06", () => {
    // one mine, three flags
    const board = boardFrom(["Ff.", "f..", "..."]);
    expect(minesRemaining(board)).toBe(-2);
  });
});

describe("revealAllMines", () => {
  it("shows every mine that is not under a flag", () => {
    const board = boardFrom([
      "*..",
      ".*.",
      "...",
    ]);
    expect(marksOf(revealAllMines(board))).toEqual(["O..", ".O.", "..."]);
  });

  it("keeps a correct flag as a flag - invariant #6", () => {
    const board = boardFrom(["F..", ".*.", "..."]);
    const next = revealAllMines(board);
    expect(next.marks[0]).toBe(FLAGGED);
  });

  it("keeps a WRONG flag as a flag, so the slash can be drawn - invariant #6", () => {
    const board = boardFrom(["f*.", "...", "..."]);
    const next = revealAllMines(board);
    expect(next.marks[0]).toBe(FLAGGED);
    expect(isWrongFlag(next, 0)).toBe(true);
    expect(isWrongFlag(next, 1)).toBe(false);
  });

  it("does nothing before the mines are planted", () => {
    const board = boardFrom(["...", "...", "..."]);
    const bare = { ...board, mines: null };
    expect(revealAllMines(bare)).toBe(bare);
  });
});

describe("hasWrongFlag", () => {
  it("is false when every flag is on a mine", () => {
    expect(hasWrongFlag(boardFrom(["F..", ".*.", "..."]))).toBe(false);
  });

  it("is true as soon as one flag sits on a safe cell", () => {
    expect(hasWrongFlag(boardFrom(["f*.", "...", "..."]))).toBe(true);
  });

  it("is false with no flags at all - there is nothing to point the player at", () => {
    expect(hasWrongFlag(boardFrom(["*..", "...", "..."]))).toBe(false);
  });
});
