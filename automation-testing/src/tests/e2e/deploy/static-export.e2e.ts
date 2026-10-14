import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";

// FR-15: a static export that works from any file host, including GitHub Pages' /<repo>/ sub-path.
// On dev the site sits at the root; on prd (ENV=prd) the same checks run under /web-game-duck-mines/.

test("trang tải trọn vẹn: mọi tài nguyên trả về thành công", { tag: ["@TC-DEPLOY-001", "@smoke"] }, async ({ page, gamePage }) => {
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  page.on("requestfailed", (r) => failed.push(`failed ${r.url()}`));
  await gamePage.goto();
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle(copy.appName);
  await expect(gamePage.cells()).toHaveCount(81);
  expect(failed).toEqual([]);
});

test("mọi tài nguyên của site nằm dưới đường dẫn gốc của nó", { tag: ["@TC-DEPLOY-002"] }, async ({ page, gamePage, baseURL }) => {
  const base = new URL(baseURL!);
  const strays: string[] = [];
  page.on("request", (r) => {
    const url = new URL(r.url());
    if (url.origin === base.origin && !url.pathname.startsWith(base.pathname)) strays.push(url.pathname);
  });
  await gamePage.goto();
  await page.waitForLoadState("networkidle");
  // the board is interactive, which means the scripts under the base path ran
  await gamePage.reveal(40);
  expect(await gamePage.openCount()).toBeGreaterThan(0);
  expect(strays).toEqual([]);
});
