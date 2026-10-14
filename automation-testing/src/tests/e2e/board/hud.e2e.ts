import { test, expect } from "@/fixtures";
import { SEED } from "@/data/test-data";

// FR-06 · FR-07 · FR-08. Time is faked with page.clock: the clock is Date.now differences on a 250ms interval.

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test("đồng hồ đứng ở 0:00 tới nước đầu, dù trang đã mở bao lâu", { tag: ["@TC-BOARD-007", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await page.clock.runFor(5_000);
  await expect(gamePage.timer()).toHaveText("0:00");
});

test("đồng hồ chạy từ nước đầu và hiển thị phút:giây", { tag: ["@TC-BOARD-008", "@smoke"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await page.clock.runFor(65_000);
  await expect(gamePage.timer()).toHaveText("1:05");
});

test("đồng hồ không dừng ở 999 giây", { tag: ["@TC-BOARD-009"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await page.clock.runFor(1_000_000);
  await expect(gamePage.timer()).toHaveText("16:40");
});

test("Bàn mới giữa ván đưa bàn, đồng hồ và bộ đếm về đầu", { tag: ["@TC-BOARD-010", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.flag(0);
  await page.clock.runFor(3_000);
  await expect(gamePage.mineCounter()).toHaveText("009");

  await gamePage.newGame();
  expect((await gamePage.states()).every((c) => c.state === "hidden")).toBe(true);
  await expect(gamePage.timer()).toHaveText("0:00");
  await expect(gamePage.mineCounter()).toHaveText("010");
  await page.clock.runFor(3_000);
  await expect(gamePage.timer()).toHaveText("0:00");
});

test("sau Bàn mới, nước đầu tiếp theo vẫn an toàn và mở một vùng", { tag: ["@TC-BOARD-011"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.newGame();
  await gamePage.reveal(40);
  expect((await gamePage.cellInfo(40)).state).toBe("empty");
  await expect(gamePage.outcome()).toHaveText("");
});
