import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";

// FR-13 · FR-17 · US-04 · ADR-0009 (pan, never shrink past 22px) · NFR-A11Y-06. Pixel 5: 393×851 portrait.

test("bàn Khó trên điện thoại cuộn trong khung riêng, trang không bao giờ cuộn ngang", { tag: ["@TC-TOUCH-008", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  expect(await gamePage.pageOverflowX()).toBeLessThanOrEqual(0);
  expect((await gamePage.viewportScroll()).overflowX).toBeGreaterThan(0);
});

test("mọi ô giữ được cạnh tối thiểu 22px", { tag: ["@TC-TOUCH-009", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  for (const i of [0, 239, 479]) {
    const box = await gamePage.cell(i).boundingBox();
    expect(box!.width, `cell ${i}`).toBeGreaterThanOrEqual(21.5);
    expect(box!.height, `cell ${i}`).toBeGreaterThanOrEqual(21.5);
  }
});

test("kéo ngón trên bàn thì bàn trượt theo mà không ô nào mở", { tag: ["@TC-TOUCH-010", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  const before = await gamePage.viewportScroll();
  const box = await gamePage.boardViewport().boundingBox();
  const y = box!.y + Math.min(box!.height / 2, 120);
  await gamePage.drag({ x: box!.x + box!.width - 30, y }, { x: box!.x + 30, y });

  await expect.poll(async () => (await gamePage.viewportScroll()).left).toBeGreaterThan(before.left);
  expect(await gamePage.openCount()).toBe(0);
  await expect(gamePage.mineCounter()).toHaveText("099");
});

test("bàn tuỳ chỉnh lớn nhất pan được theo cả hai chiều", { tag: ["@TC-TOUCH-011"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useCustomBoard(40, 30, 99);
  const frame = await gamePage.viewportScroll();
  expect(frame.overflowX).toBeGreaterThan(0);
  expect(frame.overflowY).toBeGreaterThan(0);
  expect(await gamePage.pageOverflowX()).toBeLessThanOrEqual(0);
});

test("thanh Mở/Cờ không che hàng ô cuối", { tag: ["@TC-TOUCH-012"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  for (const i of [450, 465, 479]) expect(await gamePage.isCellUncovered(i), `cell ${i}`).toBe(true);
});

test("bàn không vừa chiều dọc mà vừa khi xoay ngang thì gợi ý xoay ngang", { tag: ["@TC-TOUCH-013"] }, async ({
  page,
  gamePage,
}) => {
  // a 390×844 phone: 30 expert columns need 766px - more than 390, less than 844
  await page.setViewportSize({ width: 390, height: 844 });
  await gamePage.goto(SEED);
  await expect(gamePage.rotateHint()).toHaveCount(0);

  await gamePage.useDifficulty("expert");
  await expect(gamePage.rotateHint()).toHaveText(copy.touch.rotateHint);

  // turned: the whole expert board fits at 844px, nothing left to suggest
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(gamePage.rotateHint()).toHaveCount(0);
});

test("không gợi ý xoay khi xoay cũng không vừa", { tag: ["@TC-TOUCH-014"] }, async ({ page, gamePage }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gamePage.goto(SEED);
  // 40 columns need 40×22 + 39×2 + 48 = 1006px: wider than the phone either way round
  await gamePage.useCustomBoard(40, 10, 20);
  await expect(gamePage.rotateHint()).toHaveCount(0);
});

test("chạm hai lần nhanh không phóng to trang, kéo bàn không kéo theo trang", { tag: ["@TC-TOUCH-015"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  // touch-action does not inherit, it intersects up the tree: the board's "manipulation" is what switches double-tap
  // zoom off under every cell; the frame keeps its overscroll to itself (no pull-to-refresh)
  expect(await gamePage.grid().evaluate((el) => getComputedStyle(el).touchAction)).toBe("manipulation");
  expect(
    await gamePage.boardViewport().evaluate((el) => getComputedStyle(el).getPropertyValue("overscroll-behavior-y")),
  ).toBe("contain");
});
