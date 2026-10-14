import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";

// FR-05 · US-01 · invariant #7 (a finished board is frozen). Clock faked so the times are exact.

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

/** Learns the seeded board, reloads it and makes the safe first move: the board is then in play, mines known. */
async function boardInPlay(gamePage: GamePage) {
  const mines = await gamePage.learnMines(SEED, 40);
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  return mines;
}

test("mở phải mìn thì thua: mọi mìn hiện ra, ô vừa nổ được đánh dấu", { tag: ["@TC-GAMERESULT-001", "@smoke"] }, async ({
  gamePage,
}) => {
  const mines = await boardInPlay(gamePage);
  const [boom, ...rest] = [...mines];
  await gamePage.reveal(boom);

  const states = await gamePage.states();
  expect(states[boom].state).toBe("exploded");
  for (const m of rest) expect(states[m].state, `mine ${m}`).toBe("mine");
  await expect(gamePage.result.dialog()).toBeVisible();
  await expect(gamePage.result.dialog()).toHaveAccessibleName(copy.result.lostTitle);
  await expect(gamePage.outcome()).toHaveText(copy.result.lostTitle);
  await expect(gamePage.result.newGameButton()).toBeFocused();
});

test("thua thì cờ cắm sai bị gạch chéo, cờ đúng giữ nguyên, và dialog nói chỗ sai", { tag: ["@TC-GAMERESULT-002"] }, async ({
  gamePage,
}) => {
  const mines = await boardInPlay(gamePage);
  const [boom, rightFlag] = [...mines];
  const wrongFlag = (await gamePage.states()).findIndex((c, i) => c.state === "hidden" && !mines.has(i));
  await gamePage.flag(rightFlag);
  await gamePage.flag(wrongFlag);
  await gamePage.reveal(boom);

  const states = await gamePage.states();
  expect(states[wrongFlag].state).toBe("wrongFlag");
  expect(states[rightFlag].state).toBe("flagged");
  await expect(gamePage.result.wrongFlagHint()).toBeVisible();
});

test("thua mà không cắm cờ sai thì dialog không nhắc cờ gạch chéo", { tag: ["@TC-GAMERESULT-003"] }, async ({ gamePage }) => {
  const mines = await boardInPlay(gamePage);
  await gamePage.reveal([...mines][0]);
  await expect(gamePage.result.dialog()).toBeVisible();
  await expect(gamePage.result.wrongFlagHint()).toHaveCount(0);
});

test("sau khi thua bàn đóng băng: không mở, không cắm cờ được, đồng hồ dừng", { tag: ["@TC-GAMERESULT-004", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  const mines = await boardInPlay(gamePage);
  await page.clock.runFor(4_000);
  await gamePage.reveal([...mines][0]);
  await gamePage.result.closeButton().click();
  const frozen = await gamePage.states();
  const time = await gamePage.timer().textContent();

  const hidden = frozen.findIndex((c, i) => c.state === "hidden" && !mines.has(i));
  await gamePage.reveal(hidden);
  await gamePage.flag(hidden);
  await page.clock.runFor(10_000);
  expect(await gamePage.states()).toEqual(frozen);
  await expect(gamePage.timer()).toHaveText(time ?? "");
  expect(time).toBe("0:04");
});

test("mở hết ô không có mìn thì thắng, kể cả khi chưa cắm cờ nào", { tag: ["@TC-GAMERESULT-005", "@smoke"] }, async ({
  gamePage,
}) => {
  const mines = await boardInPlay(gamePage);
  await gamePage.openAllSafe(mines);

  await expect(gamePage.result.dialog()).toHaveAccessibleName(copy.result.wonTitle);
  await expect(gamePage.outcome()).toHaveText(copy.result.wonTitle);
  await expect(gamePage.result.newGameButton()).toBeFocused();
  // no mine was opened on the way
  const states = await gamePage.states();
  for (const m of mines) expect(states[m].state, `mine ${m}`).not.toBe("exploded");
});

test("thắng thì mọi mìn còn lại tự hiện cờ và bộ đếm về 000", { tag: ["@TC-GAMERESULT-013"] }, async ({ gamePage }) => {
  // BUG: defects/game-result.md#bug-gameresult-01
  test.fail();
  const mines = await boardInPlay(gamePage);
  await gamePage.openAllSafe(mines);
  await expect(gamePage.result.dialog()).toHaveAccessibleName(copy.result.wonTitle);
  const states = await gamePage.states();
  for (const m of mines) expect(states[m].state, `mine ${m} flagged on a win`).toBe("flagged");
  await expect(gamePage.mineCounter()).toHaveText("000");
});

test("dialog kết quả nói ván đã mất bao lâu, và đồng hồ dừng ở đó", { tag: ["@TC-GAMERESULT-006"] }, async ({
  page,
  gamePage,
}) => {
  const mines = await boardInPlay(gamePage);
  await page.clock.runFor(7_000);
  await gamePage.openAllSafe(mines);
  await expect(gamePage.result.time()).toHaveText("0:07");
  await page.clock.runFor(5_000);
  await expect(gamePage.timer()).toHaveText("0:07");
});

test("đóng dialog bằng nút Đóng hoặc Esc giữ nguyên bàn vừa xong", { tag: ["@TC-GAMERESULT-007"] }, async ({ gamePage }) => {
  const mines = await boardInPlay(gamePage);
  await gamePage.reveal([...mines][0]);
  const finished = await gamePage.states();

  await gamePage.result.closeButton().click();
  await expect(gamePage.result.dialog()).toHaveCount(0);
  expect(await gamePage.states()).toEqual(finished);

  // a second finished board, dismissed with Esc this time
  const again = await boardInPlay(gamePage);
  await gamePage.reveal([...again][0]);
  await expect(gamePage.result.newGameButton()).toBeFocused();
  await gamePage.page.keyboard.press("Escape");
  await expect(gamePage.result.dialog()).toHaveCount(0);
  expect(await gamePage.states()).toEqual(finished);
});

test("dialog nằm trên bàn mà không thay bàn, và Bàn mới trên dialog bắt đầu ván mới", { tag: ["@TC-GAMERESULT-008"] }, async ({
  gamePage,
}) => {
  const mines = await boardInPlay(gamePage);
  await gamePage.reveal([...mines][0]);
  await expect(gamePage.result.dialog()).toBeVisible();
  await expect(gamePage.cells()).toHaveCount(81);
  await expect(gamePage.grid()).toBeVisible();

  await gamePage.result.newGameButton().click();
  await expect(gamePage.result.dialog()).toHaveCount(0);
  expect((await gamePage.states()).every((c) => c.state === "hidden")).toBe(true);
  await expect(gamePage.timer()).toHaveText("0:00");
});
