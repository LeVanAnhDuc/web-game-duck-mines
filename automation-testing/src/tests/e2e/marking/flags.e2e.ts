import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";

// FR-03 · FR-06 · US-02.

async function switchUnsure(gamePage: GamePage) {
  await gamePage.openSettings();
  await gamePage.settings.unsureSwitch().click();
  await gamePage.settings.close();
}

test("chuột phải cắm cờ mà không mở menu của trình duyệt", { tag: ["@TC-MARKING-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  expect(await gamePage.contextMenu(0)).toBe(true);
  await expect(gamePage.mineCounter()).toHaveText("009");
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.flagged(1, 1));
});

test("chuột phải lần nữa gỡ cờ khi dấu hỏi đang tắt", { tag: ["@TC-MARKING-002"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.flag(0);
  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.hidden(1, 1));
  await expect(gamePage.mineCounter()).toHaveText("010");
});

test("ô đã cắm cờ không mở khi lỡ bấm chuột trái", { tag: ["@TC-MARKING-003", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.flag(40);
  await gamePage.reveal(40);
  expect(await gamePage.openCount()).toBe(0);
  await expect(gamePage.cell(40)).toHaveAttribute("aria-label", copy.cell.flagged(5, 5));
  await expect(gamePage.timer()).toHaveText("0:00");
});

test("không cắm cờ được lên ô đã mở", { tag: ["@TC-MARKING-004"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.flag(40);
  await expect(gamePage.cell(40)).toHaveAttribute("aria-label", copy.cell.empty(5, 5));
  await expect(gamePage.mineCounter()).toHaveText("010");
});

test("bật dấu hỏi thì chu kỳ là cờ, dấu hỏi, rồi trống; dấu hỏi không trừ bộ đếm", { tag: ["@TC-MARKING-005"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await switchUnsure(gamePage);

  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.flagged(1, 1));
  await expect(gamePage.mineCounter()).toHaveText("009");
  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.unsure(1, 1));
  await expect(gamePage.mineCounter()).toHaveText("010");
  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.hidden(1, 1));
});

test("ô mang dấu hỏi vẫn mở được bằng chuột trái", { tag: ["@TC-MARKING-006"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await switchUnsure(gamePage);
  await gamePage.flag(40);
  await gamePage.flag(40);
  await expect(gamePage.cell(40)).toHaveAttribute("aria-label", copy.cell.unsure(5, 5));
  await gamePage.reveal(40);
  await expect(gamePage.cell(40)).toHaveAttribute("aria-label", copy.cell.empty(5, 5));
});

test("tắt dấu hỏi giữa ván không để ô nào kẹt ở trạng thái lạ", { tag: ["@TC-MARKING-007"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await switchUnsure(gamePage);
  await gamePage.flag(0);
  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.unsure(1, 1));

  await switchUnsure(gamePage);
  // the question mark stays until touched, then the two-state cycle resumes
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.unsure(1, 1));
  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.hidden(1, 1));
  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.flagged(1, 1));
  await gamePage.flag(0);
  await expect(gamePage.cell(0)).toHaveAttribute("aria-label", copy.cell.hidden(1, 1));
});

test("cắm nhiều cờ hơn số mìn thì bộ đếm xuống số âm", { tag: ["@TC-MARKING-008"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  for (let i = 0; i < 10; i += 1) await gamePage.flag(i);
  await expect(gamePage.mineCounter()).toHaveText("000");
  await gamePage.flag(10);
  // U+2212 MINUS SIGN, as the HUD draws it
  await expect(gamePage.mineCounter()).toHaveText("−001");
  await gamePage.flag(11);
  await expect(gamePage.mineCounter()).toHaveText("−002");
});
