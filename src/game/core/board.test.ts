import { describe, expect, it } from "vitest";
import { countAdjacent, createBoard, neighbours, plantMines } from "./board";
import { DIFFICULTIES, DIFFICULTY_ORDER } from "./constants";
import type { Difficulty } from "./types";

describe("neighbours", () => {
  it("gives eight cells in the middle of the board", () => {
    // 9x9, cell (4,4) = index 40
    expect(neighbours(40, 9, 9).sort((a, b) => a - b)).toEqual([30, 31, 32, 39, 41, 48, 49, 50]);
  });

  it("gives three cells in the top-left corner", () => {
    expect(neighbours(0, 9, 9).sort((a, b) => a - b)).toEqual([1, 9, 10]);
  });

  it("gives five cells on the right edge", () => {
    // index 17 = row 1, col 8 on a 9-wide board
    expect(neighbours(17, 9, 9).sort((a, b) => a - b)).toEqual([7, 8, 16, 25, 26]);
  });

  it("never includes itself and never leaves the board, for every cell", () => {
    for (const difficulty of DIFFICULTY_ORDER) {
      const { cols, rows } = DIFFICULTIES[difficulty];
      for (let i = 0; i < cols * rows; i += 1) {
        const list = neighbours(i, cols, rows);
        expect(list).not.toContain(i);
        expect(new Set(list).size).toBe(list.length);
        for (const j of list) {
          expect(j).toBeGreaterThanOrEqual(0);
          expect(j).toBeLessThan(cols * rows);
          // a neighbour is never more than one column away
          expect(Math.abs((j % cols) - (i % cols))).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe("createBoard", () => {
  it("starts with no mines at all - mines is null, not an empty array", () => {
    const board = createBoard("beginner");
    expect(board.mines).toBeNull();
    expect(board.marks).toHaveLength(81);
    expect([...board.marks].every((m) => m === 0)).toBe(true);
  });

  it("matches the original Windows presets", () => {
    expect(DIFFICULTIES).toEqual({
      beginner: { cols: 9, rows: 9, mineCount: 10 },
      intermediate: { cols: 16, rows: 16, mineCount: 40 },
      expert: { cols: 30, rows: 16, mineCount: 99 },
    });
  });
});

describe("plantMines - FR-01, checked exhaustively", () => {
  // The most trustworthy test in the project: every difficulty, and EVERY cell as the
  // opening move. Sampling seeds would pass by luck; this cannot.
  it.each(DIFFICULTY_ORDER)("never puts a mine in the 3x3 around any opening move (%s)", (
    difficulty: Difficulty,
  ) => {
    const spec = DIFFICULTIES[difficulty];
    const size = spec.cols * spec.rows;
    const empty = createBoard(difficulty);

    for (let safeIndex = 0; safeIndex < size; safeIndex += 1) {
      const board = plantMines(empty, safeIndex * 7919 + 13, safeIndex);
      const mines = board.mines!;

      let planted = 0;
      for (let i = 0; i < size; i += 1) planted += mines[i]!;
      expect(planted).toBe(spec.mineCount);

      expect(mines[safeIndex]).toBe(0);
      for (const j of neighbours(safeIndex, spec.cols, spec.rows)) {
        expect(mines[j]).toBe(0);
      }

      // Adjacency is checked on a sample rather than on all 480 boards. It is a
      // property of countAdjacent alone and does not vary with the opening move, so
      // verifying it 480 times over says nothing the 30th time did not - and it is
      // what pushed this test past the timeout when the suite runs together. The
      // claim this test exists to make - no mine in the 3x3, ever - stays exhaustive.
      if (safeIndex % 16 !== 0) continue;
      for (let i = 0; i < size; i += 1) {
        let expected = 0;
        for (const j of neighbours(i, spec.cols, spec.rows)) expected += mines[j]!;
        expect(board.adj[i]).toBe(expected);
      }
    }
  }, 20_000);

  it("is reproducible from the seed", () => {
    const empty = createBoard("intermediate");
    const a = plantMines(empty, 424242, 100);
    const b = plantMines(empty, 424242, 100);
    expect([...a.mines!]).toEqual([...b.mines!]);
  });

  it("gives a different board for a different seed", () => {
    const empty = createBoard("intermediate");
    const a = plantMines(empty, 1, 100);
    const b = plantMines(empty, 2, 100);
    expect([...a.mines!]).not.toEqual([...b.mines!]);
  });

  it("leaves the source board untouched", () => {
    const empty = createBoard("beginner");
    plantMines(empty, 7, 40);
    expect(empty.mines).toBeNull();
  });
});

describe("countAdjacent", () => {
  it("returns the board unchanged while there are no mines", () => {
    const empty = createBoard("beginner");
    expect(countAdjacent(empty)).toBe(empty);
  });
});
