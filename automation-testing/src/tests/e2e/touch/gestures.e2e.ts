import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { ENGAGE_MS, FLAG_MS, SEED } from "@/data/test-data";
import { neighbours } from "@/utils/grid";

// FR-12 · US-04 · ADR-0004 · NFR-A11Y-06. Runs on the app-touch project (Pixel 5): the gesture branches on pointerType,
// a mouse never takes this path. The finger's timing runs on page.clock (performance.now + requestAnimationFrame).

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

/** A board in play with the safe first move made by a tap, so later cells mean something. */
async function boardInPlay(gamePage: GamePage) {
  await gamePage.goto(SEED);
  await gamePage.cell(40).tap();
}

test("chạm vào ô là mở ô", { tag: ["@TC-TOUCH-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.cell(40).tap();
  await expect(gamePage.cell(40)).toHaveAttribute("aria-label", copy.cell.empty(5, 5));
  expect(await gamePage.openCount()).toBeGreaterThan(1);
});

test("thanh Mở/Cờ có trên màn cảm ứng, và ở chế độ Cờ chạm là cắm cờ", { tag: ["@TC-TOUCH-002", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await expect(gamePage.modeBar()).toBeVisible();
  await expect(gamePage.modeDig()).toHaveAttribute("aria-checked", "true");

  await gamePage.modeFlag().tap();
  await expect(gamePage.modeFlag()).toHaveAttribute("aria-checked", "true");
  await gamePage.cell(0).tap();
  await expect(gamePage.mineCounter()).toHaveText("009");
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.flagged(1, 1));
});

test("ở chế độ Cờ, chạm vào ô số đã mở vẫn mở quanh nó", { tag: ["@TC-TOUCH-003"] }, async ({ gamePage }) => {
  const mines = await gamePage.learnMines(SEED, 40);
  await boardInPlay(gamePage);
  const states = await gamePage.states();
  const size = await gamePage.size();
  const target = states.findIndex(
    (c, i) =>
      c.state === "number" &&
      neighbours(i, size).some((n) => !mines.has(n) && states[n].state === "hidden") &&
      neighbours(i, size).every((n) => !mines.has(n) || states[n].state === "hidden"),
  );
  expect(target).toBeGreaterThanOrEqual(0);

  await gamePage.modeFlag().tap();
  for (const m of neighbours(target, size).filter((n) => mines.has(n))) await gamePage.cell(m).tap();
  await gamePage.cell(target).tap();
  const after = await gamePage.states();
  for (const n of neighbours(target, size).filter((n) => !mines.has(n))) {
    expect(["empty", "number"], `cell ${n}`).toContain(after[n].state);
  }
});

test("giữ ngón: khung nhắm hiện phía trên ngón, giữ tiếp thì cắm cờ mà không cần nhấc", { tag: ["@TC-TOUCH-004", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await boardInPlay(gamePage);
  const target = (await gamePage.states()).findIndex((c) => c.state === "hidden");
  const at = await gamePage.cellCentre(target);

  await gamePage.finger("pointerdown", at);
  await page.clock.runFor(ENGAGE_MS + 50);
  await expect(gamePage.aimChip()).toBeVisible();
  const chip = await gamePage.aimChip().boundingBox();
  expect(chip!.y + chip!.height, "the chip sits above the finger").toBeLessThanOrEqual(at.y);

  await page.clock.runFor(FLAG_MS);
  await expect(gamePage.cell(target)).toHaveAttribute("aria-label", /đã cắm cờ$/);
  await expect(gamePage.mineCounter()).toHaveText("009");

  // the lift after a long press does not also open the cell
  await gamePage.finger("pointerup", at);
  await expect(gamePage.cell(target)).toHaveAttribute("aria-label", /đã cắm cờ$/);
});

test("nhắm sai thì trượt ngón sang ô đúng rồi nhấc: chỉ ô đúng được mở", { tag: ["@TC-TOUCH-005"] }, async ({
  page,
  gamePage,
}) => {
  const mines = await gamePage.learnMines(SEED, 40);
  await boardInPlay(gamePage);
  const hiddenSafe = (await gamePage.states()).flatMap((c, i) => (c.state === "hidden" && !mines.has(i) ? [i] : []));
  const wrong = hiddenSafe.find((i) => hiddenSafe.includes(i + 1) && (i + 1) % 9 !== 0)!;
  const right = wrong + 1;

  await gamePage.finger("pointerdown", await gamePage.cellCentre(wrong));
  await page.clock.runFor(ENGAGE_MS + 50);
  await expect(gamePage.aimChip()).toBeVisible();
  const to = await gamePage.cellCentre(right);
  await gamePage.finger("pointermove", to);
  await gamePage.finger("pointerup", to);

  expect((await gamePage.cellInfo(right)).state).not.toBe("hidden");
  expect((await gamePage.cellInfo(wrong)).state).toBe("hidden");
});

test("nhấc ngón ra ngoài bàn là huỷ: không ô nào mở, không cờ nào cắm", { tag: ["@TC-TOUCH-006", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await boardInPlay(gamePage);
  const before = await gamePage.states();
  const target = before.findIndex((c) => c.state === "hidden");

  await gamePage.finger("pointerdown", await gamePage.cellCentre(target));
  await page.clock.runFor(ENGAGE_MS + 50);
  await expect(gamePage.aimChip()).toBeVisible();
  const header = await gamePage.header().boundingBox();
  const outside = { x: header!.x + 4, y: header!.y + header!.height / 2 };
  await gamePage.finger("pointermove", outside);
  await gamePage.finger("pointerup", outside);

  expect(await gamePage.states()).toEqual(before);
  await expect(gamePage.aimChip()).toHaveCount(0);
});

test("ngón kéo đi trước khi dừng lại là kéo bàn, không mở ô", { tag: ["@TC-TOUCH-007"] }, async ({ gamePage }) => {
  await boardInPlay(gamePage);
  const before = await gamePage.states();
  const target = before.findIndex((c) => c.state === "hidden");
  const from = await gamePage.cellCentre(target);

  await gamePage.finger("pointerdown", from);
  // past the slop before ENGAGE_MS: the browser owns it as a pan
  const away = { x: from.x + 40, y: from.y };
  await gamePage.finger("pointermove", away);
  await gamePage.finger("pointerup", away);
  expect(await gamePage.states()).toEqual(before);
});
