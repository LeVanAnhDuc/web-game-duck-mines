import { test, expect } from "@/fixtures";
import type { Locator } from "@playwright/test";
import { copy } from "@/data/copy";
import { DUCKER, SEED } from "@/data/test-data";

// FR-19 · US-06 · ADR-0013 · invariant #10. Runs on the "app-auth" project: the flag-on export built by
// `pnpm build:e2e-auth` against the fake issuer http://ducker.test, served on :4391.

const urlSearch = (gamePage: { page: import("@playwright/test").Page }) => gamePage.page.evaluate(() => window.location.search);

test("đăng nhập: thấy tài khoản, URL sạch, tham số game còn nguyên; đăng xuất trả lại nút", { tag: ["@TC-DUCKERID-002", "@smoke"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await fakeIssuer();
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();

  await expect(gamePage.account.trigger()).toBeVisible();
  // Next writes its hydration URL back after the capture; the clean URL has to win and stay
  await expect.poll(() => urlSearch(gamePage)).toContain(`seed=${SEED}`);
  await expect.poll(() => urlSearch(gamePage)).not.toMatch(/code=|state=/);
  await expect(gamePage.cells()).toHaveCount(81);

  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toContainText(DUCKER.user.name);
  await expect(gamePage.account.menu()).toContainText(DUCKER.user.email);
  await expect(gamePage.account.profileLink()).toHaveAttribute("href", `${DUCKER.issuer}${DUCKER.profilePath}`);

  await gamePage.account.signOutItem().click();
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect(gamePage.account.signInButton()).toBeFocused();
  expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
});

test("Esc đóng menu tài khoản và trả focus về nút tài khoản", { tag: ["@TC-DUCKERID-003"] }, async ({ page, gamePage, fakeIssuer }) => {
  await fakeIssuer();
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(gamePage.account.menu()).toHaveCount(0);
  await expect(gamePage.account.trigger()).toBeFocused();
});

test("đã đăng nhập vẫn chơi được như thường", { tag: ["@TC-DUCKERID-004"] }, async ({ gamePage, fakeIssuer }) => {
  await fakeIssuer();
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();
  await gamePage.reveal(40);
  await expect(gamePage.cell(40)).toHaveAttribute("aria-label", copy.cell.empty(5, 5));
  await gamePage.flag(0);
  await expect(gamePage.mineCounter()).toHaveText("009");
});

test("hồ sơ chỉ nằm trong bộ nhớ: tải lại là chưa đăng nhập, storage không giữ gì", { tag: ["@TC-DUCKERID-005", "@smoke"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await fakeIssuer();
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
  expect(stored).not.toContain(DUCKER.user.email);
  expect(await page.evaluate((key) => sessionStorage.getItem(key), DUCKER.pkceKey)).toBeNull();

  await gamePage.reload();
  await expect(gamePage.account.signInButton()).toBeVisible();
});

test("từ chối ở Ducker ID thì về chưa đăng nhập, URL sạch, tham số game còn", { tag: ["@TC-DUCKERID-006"] }, async ({
  gamePage,
  fakeIssuer,
}) => {
  await fakeIssuer("deny");
  await gamePage.goto(SEED);
  await gamePage.account.signInRoundTrip(DUCKER.issuer);
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect.poll(() => urlSearch(gamePage)).toContain(`seed=${SEED}`);
  await expect.poll(() => urlSearch(gamePage)).not.toMatch(/error|state=/);
});

test("state bị sửa thì về chưa đăng nhập và không bao giờ gọi tới token", { tag: ["@TC-DUCKERID-007", "@smoke"] }, async ({
  gamePage,
  fakeIssuer,
}) => {
  const issuer = await fakeIssuer("tamper");
  await gamePage.goto();
  await gamePage.account.signInRoundTrip(DUCKER.issuer);
  await expect(gamePage.account.signInButton()).toBeVisible();
  await expect.poll(() => urlSearch(gamePage)).not.toMatch(/code=|state=/);
  expect(issuer.tokenCalls()).toBe(0);
});

test("issuer treo thì sau tối đa 15 giây về lại chưa đăng nhập", { tag: ["@TC-DUCKERID-008"] }, async ({ gamePage, fakeIssuer }) => {
  // AbortSignal.timeout(15s) is a native timer that page.clock cannot fast-forward: this one waits for real
  test.setTimeout(45_000);
  const issuer = await fakeIssuer("hang");
  await gamePage.goto(SEED);
  await gamePage.account.signInRoundTrip(DUCKER.issuer);
  await expect.poll(() => issuer.tokenCalls()).toBe(1);
  await expect(gamePage.account.signInButton()).toBeVisible({ timeout: 20_000 });
  await expect.poll(() => urlSearch(gamePage)).not.toMatch(/code=|state=/);
});

test("sessionStorage bị chặn thì bấm đăng nhập không đưa đi đâu cả", { tag: ["@TC-DUCKERID-009"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get() {
        throw new DOMException("The operation is insecure.", "SecurityError");
      },
    });
  });
  await fakeIssuer();
  const toIssuer: string[] = [];
  page.on("request", (r) => {
    if (r.url().startsWith(DUCKER.issuer)) toIssuer.push(r.url());
  });
  await gamePage.goto(SEED);
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.signInButton()).toBeEnabled();
  await expect(gamePage.account.signInButton()).toHaveAccessibleName(copy.account.signIn);
  expect(toIssuer).toEqual([]);
  expect(page.url()).toContain(`seed=${SEED}`);
});

test("nút đăng nhập rộng ít nhất 44px và không đè lên nút bên cạnh", { tag: ["@TC-DUCKERID-010"] }, async ({ gamePage, fakeIssuer }) => {
  await fakeIssuer();
  await gamePage.goto();
  const box = (await gamePage.account.signInButton().boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  for (const other of [gamePage.themeToggle(), gamePage.settingsButton()]) {
    const b = (await other.boundingBox())!;
    const overlap = box.x < b.x + b.width && b.x < box.x + box.width && box.y < b.y + b.height && b.y < box.y + box.height;
    expect(overlap).toBe(false);
  }
  // sits before the theme toggle in the header (US-06 step 1)
  expect(box.x + box.width).toBeLessThanOrEqual((await gamePage.themeToggle().boundingBox())!.x + 0.5);
  expect(await gamePage.pageOverflowX()).toBeLessThanOrEqual(0);
});

for (const width of [320, 360, 375]) {
  test(`menu tài khoản nằm trọn trong màn hình và không làm header nhảy (${width}px)`, { tag: ["@TC-DUCKERID-011"] }, async ({
    page,
    gamePage,
    fakeIssuer,
  }) => {
    await page.setViewportSize({ width, height: 720 });
    await fakeIssuer();
    await gamePage.goto();
    await gamePage.account.signInButton().click();
    await expect(gamePage.account.trigger()).toBeVisible();
    const before = await gamePage.header().boundingBox();
    await gamePage.account.trigger().click();
    await expect(gamePage.account.menu()).toBeVisible();
    const menu = (await gamePage.account.menu().boundingBox())!;
    expect(menu.x).toBeGreaterThanOrEqual(0);
    expect(menu.x + menu.width).toBeLessThanOrEqual(width);
    expect(await gamePage.header().boundingBox()).toEqual(before);
  });
}

test("header chưa đăng nhập vừa 320px: không đè, không cuộn ngang, nút 44px", { tag: ["@TC-DUCKERID-012"] }, async ({
  page,
  gamePage,
  fakeIssuer,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await fakeIssuer();
  await gamePage.goto();
  const buttons: Locator[] = [gamePage.account.signInButton(), gamePage.themeToggle(), gamePage.settingsButton()];
  const boxes = [];
  for (const b of buttons) {
    const box = (await b.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    boxes.push(box);
  }
  for (let i = 0; i < boxes.length - 1; i += 1) expect(boxes[i].x + boxes[i].width).toBeLessThanOrEqual(boxes[i + 1].x + 0.5);
  const word = (await gamePage.wordmark().boundingBox())!;
  expect(word.x + word.width).toBeLessThanOrEqual(boxes[0].x);
  expect(word.height, "the wordmark stays on one line").toBeLessThan(30);
  expect(await gamePage.pageOverflowX()).toBeLessThanOrEqual(0);
});
