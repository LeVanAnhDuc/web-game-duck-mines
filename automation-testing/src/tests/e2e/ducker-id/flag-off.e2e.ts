import { test, expect } from "@/fixtures";
import { SEED } from "@/data/test-data";

// ADR-0013: the deployed build ships with the Ducker ID flag off - no button, no menu, no storage, no outside request.
// Runs on the "app" project, i.e. the normal (flag-off) export.

test("cờ tắt thì không có nút đăng nhập, không chạm storage, không request ra ngoài", { tag: ["@TC-DUCKERID-001", "@smoke"] }, async ({
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
  await gamePage.goto(SEED, "code=x&state=y");
  await expect(gamePage.cells()).toHaveCount(81);
  await expect(gamePage.account.signInButton()).toHaveCount(0);
  await expect(gamePage.account.trigger()).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  // with the flag off the URL is not read either: a stray ?code= is left exactly where it was
  expect(await page.evaluate(() => window.location.search)).toContain("code=x");
  expect(outside).toEqual([]);
});
