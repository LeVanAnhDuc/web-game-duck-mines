import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";

// FR-10 · US-03: three presets, the abandon question only once the clock runs, remembered choice.

test("cài đặt liệt kê ba mức kèm thông số và kỷ lục của từng mức", { tag: ["@TC-SETTINGS-001", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  const s = gamePage.settings;
  await expect(s.difficultyOption("beginner")).toContainText(copy.difficultySpec(9, 9, 10));
  await expect(s.difficultyOption("intermediate")).toContainText(copy.difficultySpec(16, 16, 40));
  await expect(s.difficultyOption("expert")).toContainText(copy.difficultySpec(30, 16, 99));
  await expect(s.difficultyOption("beginner")).toHaveAttribute("aria-checked", "true");
  await expect(s.difficultyOption("expert")).toHaveAttribute("aria-checked", "false");
  for (const d of ["beginner", "intermediate", "expert"] as const) {
    await expect(s.record(d)).toHaveText(copy.settings.noRecord);
  }
});

test("đổi mức khi chưa có nước nào thì đổi luôn, không hỏi", { tag: ["@TC-SETTINGS-002", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.pickDifficulty("intermediate");
  await expect(gamePage.settings.abandonQuestion()).toHaveCount(0);
  await expect(gamePage.cells()).toHaveCount(256);
  await expect(gamePage.mineCounter()).toHaveText("040");
  await expect(gamePage.difficultyLabel()).toHaveText(copy.boardLabel(copy.difficulty.intermediate, 16, 16, 40));
  await expect(gamePage.settings.difficultyOption("intermediate")).toHaveAttribute("aria-checked", "true");
});

test("chỉ cắm cờ, chưa mở ô nào, thì đổi mức không hỏi", { tag: ["@TC-SETTINGS-003"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.flag(0);
  await gamePage.openSettings();
  await gamePage.settings.pickDifficulty("expert");
  await expect(gamePage.settings.abandonQuestion()).toHaveCount(0);
  await expect(gamePage.cells()).toHaveCount(480);
  await expect(gamePage.mineCounter()).toHaveText("099");
});

test("đổi mức giữa ván thì hỏi trước, câu hỏi nhận focus, Bỏ bàn mới đổi", { tag: ["@TC-SETTINGS-004", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.openSettings();
  await gamePage.settings.pickDifficulty("intermediate");

  await expect(gamePage.settings.abandonQuestion()).toContainText(copy.settings.abandonQuestion(copy.difficulty.intermediate));
  await expect(gamePage.settings.abandonConfirmButton()).toBeFocused();
  await expect(gamePage.cells()).toHaveCount(81);

  await gamePage.settings.abandonConfirmButton().click();
  await expect(gamePage.cells()).toHaveCount(256);
  await expect(gamePage.mineCounter()).toHaveText("040");
  await expect(gamePage.timer()).toHaveText("0:00");
});

test("Giữ lại thì bàn đang chơi còn nguyên", { tag: ["@TC-SETTINGS-005"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.flag(0);
  const before = await gamePage.states();
  await gamePage.openSettings();
  await gamePage.settings.pickDifficulty("expert");
  await gamePage.settings.abandonCancelButton().click();
  await expect(gamePage.settings.abandonQuestion()).toHaveCount(0);
  await expect(gamePage.settings.difficultyOption("beginner")).toHaveAttribute("aria-checked", "true");
  await gamePage.settings.close();

  expect(await gamePage.states()).toEqual(before);
  await expect(gamePage.mineCounter()).toHaveText("009");
});

test("đóng cài đặt khi câu hỏi còn treo thì không đổi gì", { tag: ["@TC-SETTINGS-006"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  const before = await gamePage.states();
  await gamePage.openSettings();
  await gamePage.settings.pickDifficulty("expert");
  await gamePage.settings.close();
  expect(await gamePage.states()).toEqual(before);

  await gamePage.openSettings();
  await expect(gamePage.settings.abandonQuestion()).toHaveCount(0);
  await expect(gamePage.settings.difficultyOption("beginner")).toHaveAttribute("aria-checked", "true");
});

test("độ khó đã chọn còn nguyên ở lần tải trang sau", { tag: ["@TC-SETTINGS-007", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useDifficulty("expert");
  await expect(gamePage.cells()).toHaveCount(480);
  await gamePage.reload();
  await expect(gamePage.cells()).toHaveCount(480);
  await expect(gamePage.mineCounter()).toHaveText("099");
  await expect(gamePage.difficultyLabel()).toHaveText(copy.boardLabel(copy.difficulty.expert, 30, 16, 99));
});
