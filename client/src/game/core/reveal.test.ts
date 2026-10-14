import { describe, expect, it } from "vitest";
import { chord, reveal } from "./reveal";
import { boardFrom, marksOf } from "./testBoard";
import { FLAGGED, REVEALED } from "./types";

describe("reveal", () => {
  it("opens a single cell when it has a number", () => {
    const board = boardFrom([".....", ".*...", ".....", ".....", "....."]);
    // index 12 = (2,2), adjacent to the mine at (1,1)
    const { board: next, exploded } = reveal(board, 12);
    expect(exploded).toBeNull();
    expect(next.marks[12]).toBe(REVEALED);
    expect([...next.marks].filter((m) => m === REVEALED)).toHaveLength(1);
  });

  it("spreads through the empty region and stops on the number rim", () => {
    const board = boardFrom([
      "....*",
      ".....",
      ".....",
      ".....",
      "*....",
    ]);
    // open the top-left corner: the empty region runs to the cells that touch a mine
    const { board: next } = reveal(board, 0);
    expect(marksOf(next)).toEqual([
      "oooo*",
      "ooooo",
      "ooooo",
      "ooooo",
      "*oooo",
    ]);
  });

  it("does not spread through a flagged cell", () => {
    const board = boardFrom([
      "...",
      ".f.",
      "...",
    ]);
    const { board: next } = reveal(board, 0);
    expect(next.marks[4]).toBe(FLAGGED);
    expect(marksOf(next)).toEqual(["ooo", "ofo", "ooo"]);
  });

  it("is a no-op on an already open cell, returning the same object", () => {
    const board = boardFrom(["oo.", "...", "..."]);
    expect(reveal(board, 0).board).toBe(board);
  });

  it("is a no-op on a flagged cell - a flag protects the cell from a stray click", () => {
    const board = boardFrom(["f..", "...", "..."]);
    expect(reveal(board, 0).board).toBe(board);
  });

  it("reports the mine and leaves the board untouched when it hits one", () => {
    const board = boardFrom([".*.", "...", "..."]);
    const result = reveal(board, 1);
    expect(result.exploded).toBe(1);
    expect(result.board).toBe(board);
  });

  it("opens a question-marked cell that is clicked, but never floods into one", () => {
    const clicked = reveal(boardFrom(["?..", "...", "..."]), 0);
    expect(clicked.board.marks[0]).toBe(REVEALED);

    const flooded = reveal(boardFrom(["...", ".?.", "..."]), 0);
    expect(marksOf(flooded.board)).toEqual(["ooo", "o?o", "ooo"]);
  });

  it("does nothing while the mines have not been planted", () => {
    const board = boardFrom(["...", "...", "..."]);
    const bare = { ...board, mines: null };
    expect(reveal(bare, 4).board).toBe(bare);
  });
});

describe("chord", () => {
  it("opens the un-flagged neighbours when the flags match the number", () => {
    // the 1 at (1,1) has its single mine flagged, so the rest is safe
    const board = boardFrom([
      "F..",
      ".o.",
      "...",
    ]);
    const { board: next, exploded } = chord(board, 4);
    expect(exploded).toBeNull();
    expect(marksOf(next)).toEqual(["Foo", "ooo", "ooo"]);
  });

  it("EXPLODES when the flag count matches but a flag is in the wrong place", () => {
    // the number is right, the flag is on a safe cell, the mine is still hidden
    const board = boardFrom([
      "f*.",
      ".o.",
      "...",
    ]);
    const result = chord(board, 4);
    expect(result.exploded).toBe(1);
  });

  it("does nothing when there are not enough flags", () => {
    const board = boardFrom(["*..", ".o.", "..."]);
    const result = chord(board, 4);
    expect(result.board).toBe(board);
    expect(result.exploded).toBeNull();
  });

  it("does nothing on a closed cell or on a zero", () => {
    const closed = boardFrom(["...", "...", "..."]);
    expect(chord(closed, 4).board).toBe(closed);

    const zero = boardFrom(["...", ".o.", "..."]);
    expect(chord(zero, 4).board).toBe(zero);
  });

  it("never opens the flagged cell itself", () => {
    const board = boardFrom(["F..", ".o.", "..."]);
    expect(chord(board, 4).board.marks[0]).toBe(FLAGGED);
  });
});
