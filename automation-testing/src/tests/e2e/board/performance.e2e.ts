import { test, expect } from "@/fixtures";
import { SEED } from "@/data/test-data";

// NFR-PERF-06: from the touch to the painted board < 50ms on the expert board.
test("một nước trên bàn Khó vẽ xong trong 50ms", { tag: ["@TC-BOARD-014"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  // click to painted: two frames after the click is after the paint that shows it
  const ms = await gamePage.cell(240).evaluate(async (cell: HTMLElement) => {
    const start = performance.now();
    cell.click();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return performance.now() - start;
  });
  test.info().annotations.push({ type: "NFR-PERF-06", description: `${ms.toFixed(1)}ms` });
  expect(await gamePage.openCount()).toBeGreaterThan(1);
  expect(ms).toBeLessThan(50);
});
