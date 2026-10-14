import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";

// FR-16 · US-05 · ADR-0007 (never ranked) · ADR-0011 (clamp on commit, not per keystroke).

test("bàn tuỳ chỉnh dựng đúng số cột, hàng, mìn đã đặt", { tag: ["@TC-CUSTOMBOARD-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useCustomBoard(7, 6, 5);
  await expect(gamePage.cells()).toHaveCount(42);
  expect(await gamePage.size()).toEqual({ cols: 7, rows: 6 });
  await expect(gamePage.mineCounter()).toHaveText("005");
  await expect(gamePage.difficultyLabel()).toHaveText(
    `${copy.boardLabel(copy.difficulty.custom, 7, 6, 5)} · ${copy.customUnranked}`,
  );
});

test("chọn Tuỳ chỉnh là thấy ngay bàn này không ghi kỷ lục, trước nước đầu", { tag: ["@TC-CUSTOMBOARD-002", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.pickCustom();
  await expect(gamePage.settings.customUnranked()).toHaveText(copy.settings.customNotRanked);
  await expect(gamePage.settings.difficultyOption("custom")).toHaveAttribute("aria-checked", "true");
  await gamePage.settings.close();
  await expect(gamePage.unrankedNote()).toBeVisible();
  await expect(gamePage.timer()).toHaveText("0:00");
});

test("trần mìn và mật độ hiện ngay lúc nhập", { tag: ["@TC-CUSTOMBOARD-003"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.pickCustom();
  // the default custom board is 16×16 with 40 mines: 247 at most, 16% dense
  await expect(gamePage.settings.customCeiling(247)).toBeVisible();
  await expect(gamePage.settings.customDensity()).toHaveText(copy.settings.customDensity(16));
  await expect(gamePage.settings.customMines()).toHaveAttribute("max", "247");

  await gamePage.settings.customCols().fill("5");
  await gamePage.settings.customRows().fill("5");
  await expect(gamePage.settings.customCeiling(16)).toBeVisible();
  await expect(gamePage.settings.customMines()).toHaveAttribute("max", "16");
});

test("số mìn vượt trần bị kẹp về cột × hàng − 9 khi rời ô", { tag: ["@TC-CUSTOMBOARD-004", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.pickCustom();
  await gamePage.settings.setCustom(5, 5, 900);
  await expect(gamePage.settings.customMines()).toHaveValue("16");
  await gamePage.settings.close();
  await expect(gamePage.mineCounter()).toHaveText("016");
});

test("gõ một số hai chữ số từng phím không bị sửa giữa chừng", { tag: ["@TC-CUSTOMBOARD-005"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.pickCustom();
  const cols = gamePage.settings.customCols();
  await cols.fill("");
  // "2" alone is under the floor of 5; clamping it then is what used to turn "24" into 40
  await cols.pressSequentially("2");
  await expect(cols).toHaveValue("2");
  await cols.pressSequentially("4");
  await expect(cols).toHaveValue("24");
  await cols.blur();
  await expect(cols).toHaveValue("24");
});

for (const [field, typed, expected] of [
  ["cột", "4", "5"],
  ["cột", "41", "40"],
  ["hàng", "4", "5"],
  ["hàng", "31", "30"],
  ["mìn", "0", "1"],
] as const) {
  test(`giá trị ngoài biên bị kẹp về biên khi rời ô (${field} ${typed} → ${expected})`, { tag: ["@TC-CUSTOMBOARD-006"] }, async ({
    gamePage,
  }) => {
    await gamePage.goto(SEED);
    await gamePage.openSettings();
    await gamePage.settings.pickCustom();
    const s = gamePage.settings;
    const input = field === "cột" ? s.customCols() : field === "hàng" ? s.customRows() : s.customMines();
    await input.fill(typed);
    await input.blur();
    await expect(input).toHaveValue(expected);
  });
}

test("ô để trống khi rời ô quay về một giá trị hợp lệ", { tag: ["@TC-CUSTOMBOARD-007"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.pickCustom();
  const rows = gamePage.settings.customRows();
  await rows.fill("");
  await rows.blur();
  const value = Number(await rows.inputValue());
  expect(value).toBeGreaterThanOrEqual(5);
  expect(value).toBeLessThanOrEqual(30);
  await gamePage.settings.close();
  expect((await gamePage.size()).rows).toBe(value);
});

test("bàn tuỳ chỉnh chơi được: nước đầu an toàn", { tag: ["@TC-CUSTOMBOARD-008"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useCustomBoard(12, 8, 30);
  await gamePage.reveal(4 * 12 + 6);
  expect((await gamePage.cellInfo(4 * 12 + 6)).state).toBe("empty");
  await expect(gamePage.outcome()).toHaveText("");
});

test("thắng bàn tuỳ chỉnh không ghi kỷ lục và không chúc mừng", { tag: ["@TC-CUSTOMBOARD-009", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.useCustomBoard(9, 9, 10);
  const mines = await gamePage.learnMines(SEED, 40);
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.openAllSafe(mines);
  await expect(gamePage.result.dialog()).toHaveAccessibleName(copy.result.wonTitle);
  await expect(gamePage.result.recordNote()).toHaveCount(0);

  await gamePage.result.closeButton().click();
  await gamePage.openSettings();
  for (const d of ["beginner", "intermediate", "expert"] as const) {
    await expect(gamePage.settings.record(d)).toHaveText(copy.settings.noRecord);
  }
});

test("bàn tuỳ chỉnh còn nguyên sau khi tải lại", { tag: ["@TC-CUSTOMBOARD-010"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.useCustomBoard(12, 8, 20);
  await expect(gamePage.cells()).toHaveCount(96);
  await gamePage.reload();
  await expect(gamePage.cells()).toHaveCount(96);
  await expect(gamePage.mineCounter()).toHaveText("020");
  await expect(gamePage.unrankedNote()).toBeVisible();
});

test("chuyển sang Tuỳ chỉnh giữa ván thì hỏi trước", { tag: ["@TC-CUSTOMBOARD-011"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await gamePage.openSettings();
  await gamePage.settings.pickCustom();
  await expect(gamePage.settings.abandonQuestion()).toContainText(copy.settings.abandonQuestion(copy.difficulty.custom));
  await expect(gamePage.cells()).toHaveCount(81);
  await gamePage.settings.abandonConfirmButton().click();
  await expect(gamePage.cells()).toHaveCount(256);
});

test("sửa cấu hình bàn tuỳ chỉnh giữa ván thì hỏi trước khi bỏ bàn", { tag: ["@TC-CUSTOMBOARD-012"] }, async ({ gamePage }) => {
  // BUG: defects/custom-board.md#bug-customboard-01
  test.fail();
  await gamePage.goto(SEED);
  await gamePage.useCustomBoard(10, 10, 10);
  await gamePage.reveal(55);
  const before = await gamePage.states();
  await gamePage.openSettings();
  await gamePage.settings.customCols().fill("12");
  await gamePage.settings.customCols().blur();
  // the question is asked, and the board under way is untouched until it is answered
  await expect(gamePage.settings.abandonQuestion()).toBeVisible({ timeout: 2_000 });
  expect(await gamePage.states()).toEqual(before);
});
