import { test, expect } from "@/fixtures";
import type { Locator } from "@playwright/test";
import { SEED } from "@/data/test-data";

// MASTER.md breakpoints · ADR-0009 · NFR-A11Y-03 (44px targets) · README "Built for a thumb" (HUD stays put).
// Desktop Chrome (a mouse: hover: hover) resized to each width the old suite covered, plus 320.

const WIDTHS = [320, 375, 768, 1024, 1440] as const;

for (const width of WIDTHS) {
  test(`trang không bao giờ cuộn ngang, kể cả bàn Khó (${width}px)`, { tag: ["@TC-RESPONSIVE-001", "@smoke"] }, async ({
    page,
    gamePage,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await gamePage.goto(SEED);
    expect(await gamePage.pageOverflowX()).toBeLessThanOrEqual(0);
    await gamePage.useDifficulty("expert");
    expect(await gamePage.pageOverflowX()).toBeLessThanOrEqual(0);
  });
}

for (const width of [1024, 1440] as const) {
  test(`màn rộng thì bàn Khó hiện trọn, không cần kéo (${width}px)`, { tag: ["@TC-RESPONSIVE-002"] }, async ({ page, gamePage }) => {
    await page.setViewportSize({ width, height: 900 });
    await gamePage.goto(SEED);
    await gamePage.useDifficulty("expert");
    expect((await gamePage.viewportScroll()).overflowX).toBeLessThanOrEqual(0);
  });
}

test("màn hẹp với bàn Khó: bộ đếm, đồng hồ và nút bàn mới vẫn nằm trong màn hình", { tag: ["@TC-RESPONSIVE-003", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  // pan the frame to its far end: the page must not have moved with it
  await gamePage.boardViewport().evaluate((el) => el.scrollTo(el.scrollWidth, el.scrollHeight));
  const inside = async (locator: Locator) => {
    const box = (await locator.boundingBox())!;
    return box.x >= 0 && box.y >= 0 && box.x + box.width <= 375 && box.y + box.height <= 720;
  };
  expect(await inside(gamePage.mineCounter())).toBe(true);
  expect(await inside(gamePage.timer())).toBe(true);
  expect(await inside(gamePage.newGameButton())).toBe(true);
  expect(await page.evaluate(() => window.scrollX)).toBe(0);
});

test("nút ở header rộng ít nhất 44px và không đè lên nhau ở 320px", { tag: ["@TC-RESPONSIVE-004"] }, async ({ page, gamePage }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await gamePage.goto(SEED);
  const theme = (await gamePage.themeToggle().boundingBox())!;
  const settings = (await gamePage.settingsButton().boundingBox())!;
  const word = (await gamePage.wordmark().boundingBox())!;
  for (const b of [theme, settings]) {
    expect(b.width).toBeGreaterThanOrEqual(44);
    expect(b.height).toBeGreaterThanOrEqual(44);
  }
  expect(theme.x + theme.width).toBeLessThanOrEqual(settings.x + 0.5);
  expect(word.x + word.width).toBeLessThanOrEqual(theme.x);
  const reset = (await gamePage.newGameButton().boundingBox())!;
  expect(reset.width).toBeGreaterThanOrEqual(44);
  expect(reset.height).toBeGreaterThanOrEqual(44);
});

test("cài đặt là tấm trượt từ đáy trên điện thoại, hộp thoại giữa màn từ 768px", { tag: ["@TC-RESPONSIVE-005"] }, async ({
  page,
  gamePage,
}) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  const sheet = (await gamePage.settings.dialog().boundingBox())!;
  expect(Math.abs(sheet.y + sheet.height - 720)).toBeLessThanOrEqual(1);
  await gamePage.settings.close();

  await page.setViewportSize({ width: 1024, height: 900 });
  await gamePage.openSettings();
  const dialog = (await gamePage.settings.dialog().boundingBox())!;
  expect(dialog.y).toBeGreaterThan(0);
  expect(dialog.y + dialog.height).toBeLessThan(900);
  expect(Math.abs(dialog.x + dialog.width / 2 - 512)).toBeLessThanOrEqual(2);
});

test("có chuột thì không có thanh Mở/Cờ và không có gợi ý xoay", { tag: ["@TC-RESPONSIVE-006"] }, async ({ page, gamePage }) => {
  // a narrow desktop window with an expert board: a phone would get both, a mouse needs neither
  await page.setViewportSize({ width: 390, height: 844 });
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  await expect(gamePage.modeBar()).toBeHidden();
  await expect(gamePage.rotateHint()).toHaveCount(0);
});

test("dialog kết quả neo ở đáy, bàn vừa xong vẫn nhìn thấy phía trên", { tag: ["@TC-RESPONSIVE-007"] }, async ({
  page,
  gamePage,
}) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await gamePage.learnMines(SEED, 40);
  await expect(gamePage.result.dialog()).toBeVisible();
  const panel = (await gamePage.result.newGameButton().boundingBox())!;
  expect(panel.y + panel.height, "anchored to the bottom half").toBeGreaterThan(720 / 2);
  // the mine that went off is the point of a loss: it is on screen and not under the panel
  const exploded = (await gamePage.states()).findIndex((c) => c.state === "exploded");
  expect(await gamePage.isCellUncovered(exploded)).toBe(true);
});
