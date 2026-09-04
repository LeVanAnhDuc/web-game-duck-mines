import { describe, expect, it } from "vitest";
import { plantMines, createBoard, neighbours } from "./board";
import { CUSTOM_LIMITS, DEFAULT_CUSTOM, clampCustom, maxMines, mineDensity } from "./custom";

describe("maxMines", () => {
  it("leaves the nine cells the first move needs", () => {
    // ADR-0003: the opening click clears itself and its eight neighbours, so those
    // nine can never hold a mine and the board has to be generatable without them.
    expect(maxMines(9, 9)).toBe(81 - 9);
    expect(maxMines(30, 16)).toBe(480 - 9);
  });

  it("never drops below one, even on the smallest board", () => {
    expect(maxMines(3, 3)).toBe(1);
  });
});

describe("clampCustom", () => {
  it("keeps a board that is already legal", () => {
    expect(clampCustom({ cols: 12, rows: 9, mineCount: 20 })).toEqual({
      cols: 12,
      rows: 9,
      mineCount: 20,
    });
  });

  it("pulls each dimension inside its bounds", () => {
    expect(clampCustom({ cols: 999, rows: 0, mineCount: 5 })).toMatchObject({
      cols: CUSTOM_LIMITS.cols.max,
      rows: CUSTOM_LIMITS.rows.min,
    });
  });

  it("caps the mines against the board that was actually asked for", () => {
    // 5x5 is 25 cells, nine of which the first move reserves
    expect(clampCustom({ cols: 5, rows: 5, mineCount: 900 }).mineCount).toBe(16);
  });

  it("refuses zero and negative mines - a board with no mines is not a game", () => {
    expect(clampCustom({ cols: 10, rows: 10, mineCount: 0 }).mineCount).toBe(1);
    expect(clampCustom({ cols: 10, rows: 10, mineCount: -5 }).mineCount).toBe(1);
  });

  it("survives NaN and Infinity rather than producing a board of NaN cells", () => {
    const fromNaN = clampCustom({ cols: Number.NaN, rows: Number.NaN, mineCount: Number.NaN });
    expect(Number.isInteger(fromNaN.cols)).toBe(true);
    expect(Number.isInteger(fromNaN.rows)).toBe(true);
    expect(Number.isInteger(fromNaN.mineCount)).toBe(true);

    const fromInfinity = clampCustom({
      cols: Number.POSITIVE_INFINITY,
      rows: Number.NEGATIVE_INFINITY,
      mineCount: Number.POSITIVE_INFINITY,
    });
    expect(fromInfinity.cols).toBe(CUSTOM_LIMITS.cols.max);
    expect(fromInfinity.rows).toBe(CUSTOM_LIMITS.rows.min);
  });

  it("rounds a fractional count instead of building a board of 9.5 columns", () => {
    expect(clampCustom({ cols: 9.6, rows: 9.2, mineCount: 10.5 })).toEqual({
      cols: 10,
      rows: 9,
      mineCount: 11,
    });
  });
});

describe("mineDensity", () => {
  it("reports expert at the number a player is really comparing against", () => {
    expect(Math.round(mineDensity({ cols: 30, rows: 16, mineCount: 99 }) * 100)).toBe(21);
  });
});

describe("every clamped board is actually generatable", () => {
  it("plants the full mine count on the extremes, leaving the opening 3x3 clear", () => {
    const extremes = [
      { cols: 999, rows: 999, mineCount: 99999 },
      { cols: 0, rows: 0, mineCount: 0 },
      { cols: 5, rows: 5, mineCount: 900 },
      { cols: 40, rows: 30, mineCount: 1 },
      { cols: 7, rows: 21, mineCount: 130 },
    ];

    for (const input of extremes) {
      const spec = clampCustom(input);
      const board = plantMines({ ...createBoard({ ...spec, ranked: null }) }, 4242, 0);
      const mines = board.mines!;

      let planted = 0;
      for (let i = 0; i < mines.length; i += 1) planted += mines[i]!;
      expect(planted, JSON.stringify(spec)).toBe(spec.mineCount);

      expect(mines[0]).toBe(0);
      for (const j of neighbours(0, spec.cols, spec.rows)) expect(mines[j]).toBe(0);
    }
  });
});

describe("the default custom board", () => {
  it("is a legal board, so the fields never open on an invalid state", () => {
    expect(clampCustom(DEFAULT_CUSTOM)).toEqual(DEFAULT_CUSTOM);
  });
});
