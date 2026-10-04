import { expect, test } from "@playwright/test";

/**
 * The deployed build ships with the Ducker ID flag off (ADR-0013): no button, no
 * account menu, and still not one request that leaves the site (NFR "no network after
 * load" - the exception only applies once the flag is on and the player clicks).
 */
test("flag off: no sign-in button and no outside request", async ({ page, baseURL }) => {
  const outside: string[] = [];
  page.on("request", (r) => {
    const url = r.url();
    if (!url.startsWith(baseURL!) && !url.startsWith("data:") && !url.startsWith("blob:")) {
      outside.push(url);
    }
  });
  await page.goto("/?seed=20260903");
  await expect(page.locator("button.ms-cell")).toHaveCount(81);
  await expect(page.getByRole("button", { name: "Đăng nhập" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Tài khoản Ducker ID" })).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(outside).toEqual([]);
});
