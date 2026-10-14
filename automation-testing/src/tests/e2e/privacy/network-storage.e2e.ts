import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { SEED, STORAGE } from "@/data/test-data";

// NFR-DATA-04 · NFR-REL-04 · NFR-PERF-08 · NFR-SEC-02: a static page that keeps everything on the player's device.
// The deployed build has Ducker ID sign-in off (ADR-0013); its flag-on exception is the ducker-id module.

/** A bit of everything a player does: a lost board, a flag, the settings sheet, a new board, a theme change. */
async function play(gamePage: GamePage) {
  await gamePage.learnMines(SEED, 40);
  await gamePage.result.closeButton().click();
  await gamePage.newGame();
  await gamePage.reveal(40);
  await gamePage.flag(0);
  await gamePage.openSettings();
  await gamePage.settings.soundSwitch().click();
  await gamePage.settings.themeOption("dark").click();
  await gamePage.settings.close();
}

test("tải và chơi không gửi một request nào ra ngoài site", { tag: ["@TC-PRIVACY-001", "@smoke"] }, async ({
  page,
  gamePage,
  baseURL,
}) => {
  const site = new URL(baseURL!).origin;
  const outside: string[] = [];
  page.on("request", (r) => {
    const url = r.url();
    if (!url.startsWith(site) && !url.startsWith("data:") && !url.startsWith("blob:")) outside.push(url);
  });
  await play(gamePage);
  expect(outside).toEqual([]);
});

test("sau khi tải xong, chơi không gọi mạng lần nào nữa", { tag: ["@TC-PRIVACY-002", "@smoke"] }, async ({ page, gamePage }) => {
  // BUG: defects/privacy.md#bug-privacy-01
  test.fail(process.platform === "win32", "reproduces on Windows Chromium; ubuntu CI Chromium already has the font at load");
  await gamePage.goto(SEED);
  await page.waitForLoadState("networkidle");
  const after: string[] = [];
  page.on("request", (r) => after.push(r.url()));
  await gamePage.reveal(40);
  await gamePage.flag(0);
  await gamePage.openSettings();
  await gamePage.settings.pickDifficulty("intermediate");
  await gamePage.settings.abandonConfirmButton().click();
  await gamePage.settings.close();
  await gamePage.newGame();
  expect(after).toEqual([]);
});

test("mất mạng sau lần tải đầu vẫn chơi tiếp được", { tag: ["@TC-PRIVACY-003", "@smoke"] }, async ({ context, gamePage }) => {
  await gamePage.goto(SEED);
  await context.setOffline(true);
  await gamePage.reveal(40);
  expect(await gamePage.openCount()).toBeGreaterThan(1);
  await gamePage.flag(0);
  await expect(gamePage.mineCounter()).toHaveText("009");
  await gamePage.newGame();
  await gamePage.openSettings();
  await gamePage.settings.pickDifficulty("expert");
  await gamePage.settings.close();
  await expect(gamePage.cells()).toHaveCount(480);
  await context.setOffline(false);
});

test("không có file âm thanh nào được tải, kể cả khi bật tiếng và thua", { tag: ["@TC-PRIVACY-004"] }, async ({
  page,
  gamePage,
}) => {
  const media: string[] = [];
  page.on("request", (r) => {
    if (r.resourceType() === "media" || /\.(mp3|wav|ogg|m4a|aac|flac|webm)(\?|$)/i.test(r.url())) media.push(r.url());
  });
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.soundSwitch().click();
  await gamePage.settings.close();
  await gamePage.learnMines(SEED, 40);
  await expect(gamePage.result.dialog()).toBeVisible();
  expect(media).toEqual([]);
});

test("không cookie nào được đặt", { tag: ["@TC-PRIVACY-005"] }, async ({ context, gamePage }) => {
  await play(gamePage);
  expect(await context.cookies()).toEqual([]);
});

test("máy người chơi chỉ giữ kỷ lục và cài đặt, không giữ gì về người chơi", { tag: ["@TC-PRIVACY-006", "@smoke"] }, async ({
  page,
  gamePage,
}) => {
  await play(gamePage);
  const stored = await page.evaluate(() => ({
    local: Object.keys(localStorage).sort(),
    session: Object.keys(sessionStorage),
    settings: localStorage.getItem("minesweeper.settings.v1"),
  }));
  expect(stored.local.every((k) => k === STORAGE.settings || k === STORAGE.records), stored.local.join(", ")).toBe(true);
  expect(stored.local).toContain(STORAGE.settings);
  expect(stored.session).toEqual([]);
  // preferences only - no name, email, id or timestamp of the player
  expect(Object.keys(JSON.parse(stored.settings ?? "{}")).sort()).toEqual(
    ["allowUnsure", "custom", "difficulty", "sound", "theme", "useCustom"].sort(),
  );
});

test("bản production không ghi gì ra console", { tag: ["@TC-PRIVACY-007"] }, async ({ page, gamePage }) => {
  const logged: string[] = [];
  page.on("console", (m) => logged.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => logged.push(`pageerror: ${e.message}`));
  await play(gamePage);
  expect(logged).toEqual([]);
});
