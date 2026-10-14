import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED } from "@/data/test-data";

// NFR-A11Y-04 (labels) · NFR-A11Y-05 (reduced motion) · NFR-A11Y-07 (never colour alone) · invariant #8.

test("mỗi ô nói vị trí và trạng thái của nó cho trình đọc màn hình", { tag: ["@TC-ACCESSIBILITY-008", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await expect(gamePage.grid()).toHaveAttribute("aria-rowcount", "9");
  await expect(gamePage.grid()).toHaveAttribute("aria-colcount", "9");
  await expect(gamePage.cell(0)).toHaveAccessibleName(copy.cell.hidden(1, 1));
  await expect(gamePage.cell(80)).toHaveAccessibleName(copy.cell.hidden(9, 9));
  await gamePage.flag(10);
  await expect(gamePage.cell(10)).toHaveAccessibleName(copy.cell.flagged(2, 2));
  await gamePage.reveal(40);
  // every cell answers with one of the known states (parseCellLabel throws on anything else)
  const states = await gamePage.states();
  expect(states).toHaveLength(81);
  expect(states.some((c) => c.state === "number")).toBe(true);

  await gamePage.newGame();
  await gamePage.useDifficulty("expert");
  await expect(gamePage.grid()).toHaveAttribute("aria-rowcount", "16");
  await expect(gamePage.grid()).toHaveAttribute("aria-colcount", "30");
  await expect(gamePage.cell(479)).toHaveAccessibleName(copy.cell.hidden(16, 30));
});

test("bỏ hết màu thì mọi chữ số vẫn đọc được", { tag: ["@TC-ACCESSIBILITY-009"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  await page.addStyleTag({ content: "html { filter: grayscale(1); }" });
  const numbers = (await gamePage.states()).flatMap((c, i) => (c.state === "number" ? [{ i, n: c.n }] : []));
  expect(numbers.length).toBeGreaterThan(0);
  // the digit is a text node, so it survives grayscale by construction - not a colour-only mark
  for (const { i, n } of numbers) await expect(gamePage.cell(i)).toHaveText(String(n));
});

test("ô chưa mở và ô đã mở phân biệt bằng viền, không chỉ bằng độ sáng", { tag: ["@TC-ACCESSIBILITY-010"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.reveal(40);
  const closed = (await gamePage.states()).findIndex((c) => c.state === "hidden");
  expect(parseFloat(await gamePage.cellStyle(closed, "border-top-width"))).toBeGreaterThanOrEqual(1);
  expect(await gamePage.cellStyle(closed, "border-top-style")).toBe("solid");
  expect(parseFloat(await gamePage.cellStyle(40, "border-top-width"))).toBe(0);
});

test("người dùng muốn giảm chuyển động thì ô không còn hiệu ứng chuyển", { tag: ["@TC-ACCESSIBILITY-011"] }, async ({
  page,
  gamePage,
}) => {
  await gamePage.goto(SEED);
  const normal = await gamePage.cellStyle(0, "transition-duration");
  expect(normal.split(",").some((d) => parseFloat(d) > 0)).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reduced = await gamePage.cellStyle(0, "transition-duration");
  expect(reduced.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
  expect((await gamePage.cellStyle(0, "animation-duration")).split(",").every((d) => parseFloat(d) === 0)).toBe(true);
});

test("trang nói cách chơi bằng bàn phím, chuột phải và chord", { tag: ["@TC-ACCESSIBILITY-012"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await expect(gamePage.hints()).toContainText(copy.hints.keys);
  await expect(gamePage.hints()).toContainText(copy.hints.rightClick);
  await expect(gamePage.hints()).toContainText(copy.hints.chord);
});
