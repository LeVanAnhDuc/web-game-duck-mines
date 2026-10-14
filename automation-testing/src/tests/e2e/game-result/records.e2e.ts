import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { SEED, STORAGE } from "@/data/test-data";

// FR-09 · US-01 · US-03: one best time per difficulty, kept on the player's device, strictly-better only.

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

/** Wins the seeded beginner board after `seconds` of (fake) play. */
async function winIn(gamePage: GamePage, seconds: number) {
  const mines = await gamePage.learnMines(SEED, 40);
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.page.clock.runFor(seconds * 1000);
  await gamePage.openAllSafe(mines);
  await expect(gamePage.result.dialog()).toHaveAccessibleName(copy.result.wonTitle);
}

test("thắng lần đầu ở một độ khó ghi kỷ lục cho đúng độ khó đó", { tag: ["@TC-GAMERESULT-009", "@smoke"] }, async ({
  gamePage,
}) => {
  await winIn(gamePage, 7);
  await expect(gamePage.result.recordNote()).toHaveText(copy.result.wonRecord);

  await gamePage.result.closeButton().click();
  await gamePage.openSettings();
  await expect(gamePage.settings.record("beginner")).toHaveText("0:07");
  await expect(gamePage.settings.record("intermediate")).toHaveText(copy.settings.noRecord);
  await expect(gamePage.settings.record("expert")).toHaveText(copy.settings.noRecord);
});

test("thắng chậm hơn hoặc bằng kỷ lục thì không ghi đè và không chúc mừng", { tag: ["@TC-GAMERESULT-010"] }, async ({
  gamePage,
}) => {
  await gamePage.seedStorage({ [STORAGE.records]: { beginner: 7, intermediate: null, expert: null } });
  // equal to the record: a tie is not a new best
  await winIn(gamePage, 7);
  await expect(gamePage.result.recordNote()).toHaveCount(0);
  await gamePage.result.closeButton().click();
  await gamePage.openSettings();
  await expect(gamePage.settings.record("beginner")).toHaveText("0:07");
});

test("thắng nhanh hơn kỷ lục cũ thì ghi đè kỷ lục", { tag: ["@TC-GAMERESULT-011"] }, async ({ gamePage }) => {
  await gamePage.seedStorage({ [STORAGE.records]: { beginner: 100, intermediate: 50, expert: null } });
  await winIn(gamePage, 6);
  await expect(gamePage.result.recordNote()).toHaveText(copy.result.wonRecord);
  await gamePage.result.closeButton().click();
  await gamePage.openSettings();
  await expect(gamePage.settings.record("beginner")).toHaveText("0:06");
  await expect(gamePage.settings.record("intermediate")).toHaveText("0:50");
});

test("kỷ lục còn nguyên sau khi tải lại trang", { tag: ["@TC-GAMERESULT-012"] }, async ({ gamePage }) => {
  await winIn(gamePage, 9);
  await gamePage.reload();
  await gamePage.openSettings();
  await expect(gamePage.settings.record("beginner")).toHaveText("0:09");
});
