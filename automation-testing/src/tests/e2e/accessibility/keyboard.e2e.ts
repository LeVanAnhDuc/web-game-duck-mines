import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";
import { countAround, neighbours } from "@/utils/grid";

// FR-11 · NFR-A11Y-02: the whole board without a pointer - arrows move, Space opens, F flags, Enter chords, R restarts.

test("mũi tên đi dọc một hàng và vòng focus đi theo, luôn nhìn thấy được", { tag: ["@TC-ACCESSIBILITY-001", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.focusBoard();
  for (let i = 0; i < 8; i += 1) await page.keyboard.press("ArrowRight");
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "8");
  await page.keyboard.press("ArrowDown");
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "17");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowUp");
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "7");
  // visible, not merely present
  expect(await gamePage.cellStyle(7, "outline-style")).not.toBe("none");
  expect(parseFloat(await gamePage.cellStyle(7, "outline-width"))).toBeGreaterThanOrEqual(2);
});

test("con trỏ dừng ở mép bàn, không quấn sang hàng khác", { tag: ["@TC-ACCESSIBILITY-002"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.focusBoard();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowUp");
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "0");

  await gamePage.cursorTo(80);
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "80");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowDown");
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "80");
});

test("Home và End nhảy tới đầu và cuối hàng", { tag: ["@TC-ACCESSIBILITY-003"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.cursorTo(40);
  await page.keyboard.press("End");
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "44");
  await page.keyboard.press("Home");
  await expect(gamePage.focusedCell()).toHaveAttribute("data-index", "36");
});

test("F cắm cờ, Space mở, R bắt đầu bàn mới", { tag: ["@TC-ACCESSIBILITY-004", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.focusBoard();
  await page.keyboard.press("f");
  await expect(gamePage.mineCounter()).toHaveText("009");
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.flagged(1, 1));

  await gamePage.cursorTo(40);
  await page.keyboard.press("Space");
  await expect(gamePage.cell(40)).toHaveAttribute("aria-label", copy.cell.empty(5, 5));

  await page.keyboard.press("r");
  expect(await gamePage.openCount()).toBe(0);
  await expect(gamePage.mineCounter()).toHaveText("010");
});

test("Enter trên ô số đã đủ cờ mở các ô xung quanh", { tag: ["@TC-ACCESSIBILITY-005"] }, async ({ page, gamePage }) => {
  const mines = await gamePage.learnMines(SEED, 40);
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  const size = await gamePage.size();
  const states = await gamePage.states();
  const target = states.findIndex(
    (c, i) =>
      c.state === "number" &&
      neighbours(i, size).some((n) => !mines.has(n) && states[n].state === "hidden") &&
      neighbours(i, size).every((n) => !mines.has(n) || states[n].state === "hidden"),
  );
  expect(target).toBeGreaterThanOrEqual(0);
  expect(countAround(target, mines, size)).toBe(states[target].n);
  for (const m of neighbours(target, size).filter((n) => mines.has(n))) await gamePage.flag(m);

  await gamePage.cursorTo(target);
  await page.keyboard.press("Enter");
  const after = await gamePage.states();
  for (const n of neighbours(target, size).filter((n) => !mines.has(n))) {
    expect(["empty", "number"], `cell ${n}`).toContain(after[n].state);
  }
});

test("phím mũi tên không cuộn trang khỏi bàn cờ", { tag: ["@TC-ACCESSIBILITY-006"] }, async ({ page, gamePage }) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  await gamePage.goto(SEED);
  await gamePage.focusBoard();
  const before = await page.evaluate(() => window.scrollY);
  for (let i = 0; i < 10; i += 1) await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Space");
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});

test("cả bàn cờ là một điểm dừng Tab duy nhất", { tag: ["@TC-ACCESSIBILITY-007"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  expect(await gamePage.tabbableCells()).toEqual([0]);
  await gamePage.focusBoard();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowDown");
  expect(await gamePage.tabbableCells()).toEqual([10]);
  // Tab leaves the board in one press instead of walking 81 cells
  await page.keyboard.press("Tab");
  await expect(gamePage.focusedCell()).toHaveCount(0);
});
