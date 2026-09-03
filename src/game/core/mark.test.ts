import { describe, expect, it } from "vitest";
import { cycleMark } from "./mark";
import { boardFrom } from "./testBoard";
import { FLAGGED, HIDDEN, UNSURE } from "./types";

describe("cycleMark", () => {
  it("cycles hidden -> flagged -> hidden when question marks are off", () => {
    let board = boardFrom(["...", "...", "..."]);
    board = cycleMark(board, 0, false);
    expect(board.marks[0]).toBe(FLAGGED);
    board = cycleMark(board, 0, false);
    expect(board.marks[0]).toBe(HIDDEN);
  });

  it("cycles hidden -> flagged -> unsure -> hidden when they are on", () => {
    let board = boardFrom(["...", "...", "..."]);
    board = cycleMark(board, 0, true);
    expect(board.marks[0]).toBe(FLAGGED);
    board = cycleMark(board, 0, true);
    expect(board.marks[0]).toBe(UNSURE);
    board = cycleMark(board, 0, true);
    expect(board.marks[0]).toBe(HIDDEN);
  });

  it("leaves an unsure cell able to return to hidden even after the setting is turned off", () => {
    // switching the setting mid-board must not trap a cell in a state it cannot leave
    let board = boardFrom(["?..", "...", "..."]);
    board = cycleMark(board, 0, false);
    expect(board.marks[0]).toBe(HIDDEN);
  });

  it("is a no-op on an open cell, returning the same object", () => {
    const board = boardFrom(["o..", "...", "..."]);
    expect(cycleMark(board, 0, false)).toBe(board);
  });

  it("is a no-op outside the board", () => {
    const board = boardFrom(["...", "...", "..."]);
    expect(cycleMark(board, -1, false)).toBe(board);
    expect(cycleMark(board, 99, false)).toBe(board);
  });

  it("does not mutate the board it was given", () => {
    const board = boardFrom(["...", "...", "..."]);
    cycleMark(board, 0, false);
    expect(board.marks[0]).toBe(HIDDEN);
  });
});
