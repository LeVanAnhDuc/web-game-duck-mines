import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { SEED } from "@/data/test-data";

// FR-14 · US-03: light, dark, or whatever the system is doing - and an explicit choice that wins and is remembered.

/** The board colour under each system scheme with no stored choice: the two reference colours. */
async function referenceColours(gamePage: GamePage) {
  await gamePage.page.emulateMedia({ colorScheme: "light" });
  await gamePage.goto(SEED);
  const light = await gamePage.boardBackground();
  await gamePage.page.emulateMedia({ colorScheme: "dark" });
  const dark = await gamePage.boardBackground();
  return { light, dark };
}

test("mặc định giao diện theo hệ điều hành, và đổi ngay khi hệ đổi", { tag: ["@TC-THEME-001", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  const { light, dark } = await referenceColours(gamePage);
  expect(dark).not.toBe(light);

  await gamePage.openSettings();
  await expect(gamePage.settings.themeOption("system")).toHaveAttribute("aria-checked", "true");
  await gamePage.settings.close();

  // the system changes while the tab is open
  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(() => gamePage.boardBackground()).toBe(light);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect.poll(() => gamePage.boardBackground()).toBe(dark);
});

test("nút Đổi sáng / tối ghi đè hệ đang sáng, theo cả hai chiều", { tag: ["@TC-THEME-002", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  const { light, dark } = await referenceColours(gamePage);
  await page.emulateMedia({ colorScheme: "light" });

  await gamePage.themeToggle().click();
  await expect.poll(() => gamePage.boardBackground()).toBe(dark);
  await gamePage.themeToggle().click();
  await expect.poll(() => gamePage.boardBackground()).toBe(light);
});

test("trên hệ đang tối, lần bấm đầu tiên vào Đổi sáng / tối cũng đổi giao diện", { tag: ["@TC-THEME-003"] }, async ({
  page,
  gamePage,
}) => {
  // BUG: defects/theme.md#bug-theme-01
  test.fail();
  const { light } = await referenceColours(gamePage);
  await page.emulateMedia({ colorScheme: "dark" });
  await gamePage.themeToggle().click();
  await expect.poll(() => gamePage.boardBackground()).toBe(light);
});

test("lựa chọn rõ ràng thắng hệ điều hành và còn nguyên sau khi tải lại", { tag: ["@TC-THEME-004", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  const { light, dark } = await referenceColours(gamePage);
  await page.emulateMedia({ colorScheme: "light" });
  await gamePage.themeToggle().click();
  await gamePage.reload();
  await expect.poll(() => gamePage.boardBackground()).toBe(dark);

  // and the other direction: chosen light on a dark system
  await gamePage.openSettings();
  await gamePage.settings.themeOption("light").click();
  await gamePage.settings.close();
  await page.emulateMedia({ colorScheme: "dark" });
  await gamePage.reload();
  await expect.poll(() => gamePage.boardBackground()).toBe(light);
});

test("ba lựa chọn trong cài đặt: Theo hệ, Sáng, Tối", { tag: ["@TC-THEME-005"] }, async ({ page, gamePage }) => {
  const { light, dark } = await referenceColours(gamePage);
  await page.emulateMedia({ colorScheme: "light" });
  await gamePage.openSettings();
  const s = gamePage.settings;

  await s.themeOption("dark").click();
  await expect(s.themeOption("dark")).toHaveAttribute("aria-checked", "true");
  await expect(s.themeOption("system")).toHaveAttribute("aria-checked", "false");
  await expect.poll(() => gamePage.boardBackground()).toBe(dark);

  await s.themeOption("light").click();
  await expect(s.themeOption("light")).toHaveAttribute("aria-checked", "true");
  await expect.poll(() => gamePage.boardBackground()).toBe(light);

  await s.themeOption("system").click();
  await expect(s.themeOption("system")).toHaveAttribute("aria-checked", "true");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect.poll(() => gamePage.boardBackground()).toBe(dark);
});
