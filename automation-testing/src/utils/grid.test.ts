import { test, expect } from "@playwright/test";
import { countAround, neighbours, rowCol } from "./grid";

const SIZE = { cols: 9, rows: 9 };

test("rowCol is row-major", () => {
  expect(rowCol(0, SIZE)).toEqual({ row: 0, col: 0 });
  expect(rowCol(40, SIZE)).toEqual({ row: 4, col: 4 });
  expect(rowCol(17, SIZE)).toEqual({ row: 1, col: 8 });
});

test("a corner has three neighbours, an edge five, the middle eight", () => {
  expect(neighbours(0, SIZE).sort((a, b) => a - b)).toEqual([1, 9, 10]);
  expect(neighbours(4, SIZE)).toHaveLength(5);
  expect(neighbours(40, SIZE)).toHaveLength(8);
});

test("neighbours never wrap across a row edge", () => {
  // index 9 is row 1 col 0: index 8 (row 0, col 8) is not next to it
  expect(neighbours(9, SIZE)).not.toContain(8);
  expect(neighbours(17, SIZE)).not.toContain(18);
});

test("countAround counts only mines among the neighbours", () => {
  expect(countAround(40, new Set([30, 31, 0]), SIZE)).toBe(2);
});
