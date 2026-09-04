import { describe, expect, it } from "vitest";
import { createBoard, plantMines } from "./board";
import { presetSpec } from "./constants";
import { reveal } from "./reveal";
import { HIDDEN } from "./types";

/**
 * NFR-PERF-05: computing the largest empty region on the expert board must stay
 * under 16ms - one frame. This is the only performance number that can be measured
 * without a browser; NFR-PERF-06 (touch to painted) is React reconciling 480 cells
 * and belongs to a Profiler run on the real app.
 */
describe("NFR-PERF-05", () => {
  it("reveals the largest region on a 30x16 board inside one frame", () => {
    // find the opening move that reveals the most cells across 200 boards, then time
    // that one - the worst case, not an average
    let worst = { seed: 0, index: 0, opened: 0 };
    for (let seed = 1; seed <= 200; seed += 1) {
      const board = plantMines(createBoard(presetSpec("expert")), seed, 240);
      for (let index = 0; index < board.marks.length; index += 8) {
        if (board.mines![index] === 1 || board.adj[index] !== 0) continue;
        const opened = [...reveal(board, index).board.marks].filter(
          (m) => m !== HIDDEN,
        ).length;
        if (opened > worst.opened) worst = { seed, index, opened };
      }
    }

    const board = plantMines(createBoard(presetSpec("expert")), worst.seed, 240);
    const runs = 50;
    const start = performance.now();
    for (let i = 0; i < runs; i += 1) reveal(board, worst.index);
    const perRun = (performance.now() - start) / runs;

    // eslint-disable-next-line no-console
    console.info(
      `NFR-PERF-05: worst region ${worst.opened} cells, ${perRun.toFixed(3)}ms per reveal`,
    );
    expect(worst.opened).toBeGreaterThan(50);
    expect(perRun).toBeLessThan(16);
  });
});
