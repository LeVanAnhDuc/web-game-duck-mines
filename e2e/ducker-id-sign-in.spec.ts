import { expect, test, type Page } from "@playwright/test";

/**
 * Optional Ducker ID sign-in against the flag-ON export (pnpm build:e2e-auth), whose
 * issuer is the fake http://ducker.test - never resolved, every request is routed here
 * (ADR-0013). The flag-off build is covered by ducker-id-flag-off.spec.ts.
 */

const ISSUER = "http://ducker.test";
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
};

type Mode = "ok" | "deny" | "tamper";

async function fakeIssuer(page: Page, mode: Mode = "ok") {
  await page.route(`${ISSUER}/oauth/authorize**`, async (route) => {
    const url = new URL(route.request().url());
    const back = new URL(url.searchParams.get("redirect_uri")!);
    if (mode === "deny") {
      back.searchParams.set("error", "access_denied");
    } else {
      back.searchParams.set("code", "code-1");
    }
    back.searchParams.set("state", mode === "tamper" ? "tampered" : url.searchParams.get("state")!);
    await route.fulfill({ status: 302, headers: { location: back.toString() } });
  });
  await page.route(`${ISSUER}/oauth/token`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: CORS,
      body: JSON.stringify({ access_token: "at-1", token_type: "Bearer", expires_in: 900 }),
    }),
  );
  await page.route(`${ISSUER}/oauth/userinfo`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: CORS,
      body: JSON.stringify({ sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" }),
    }),
  );
}

/** Click sign-in and wait until the fake issuer has redirected us back and the page loaded. */
async function clickSignInAndReturn(page: Page) {
  const bounced = page.waitForResponse((r) => r.url().startsWith(`${ISSUER}/oauth/authorize`));
  await signInButton(page).click();
  await bounced;
  await page.waitForLoadState("load");
}

const signInButton = (page: Page) => page.getByRole("button", { name: "Đăng nhập" });
const account = (page: Page) => page.getByRole("button", { name: "Tài khoản Ducker ID" });

test("signs in, shows the account, keeps the URL clean and the game params, signs out", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await fakeIssuer(page);
  await page.goto("/?seed=20260903");
  await expect(page.locator("button.ms-cell")).toHaveCount(81);
  await signInButton(page).click();

  await expect(account(page)).toBeVisible();
  // Next writes its hydration URL back after the capture; settleCallbackUrl must win.
  await page.waitForTimeout(500);
  const search = await page.evaluate(() => window.location.search);
  expect(search).toContain("seed=20260903");
  expect(search).not.toMatch(/code=|state=/);
  await expect(page.locator("button.ms-cell")).toHaveCount(81);

  await account(page).click();
  await expect(page.getByText("Lê Văn Anh Đức")).toBeVisible();
  await expect(page.getByText("duc@ducker.id")).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Mở hồ sơ Ducker ID" })).toHaveAttribute(
    "href",
    `${ISSUER}/profile`,
  );

  await page.keyboard.press("Escape");
  await expect(page.getByTestId("account-menu")).toHaveCount(0);
  await expect(account(page)).toBeFocused();

  await account(page).click();
  await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
  await expect(signInButton(page)).toBeVisible();
  await expect(signInButton(page)).toBeFocused();

  expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
});

test("the game stays playable while signed in", async ({ page }) => {
  await fakeIssuer(page);
  await page.goto("/?seed=20260903");
  await signInButton(page).click();
  await expect(account(page)).toBeVisible();
  await expect(async () => {
    await page.getByTestId("cell-40").click();
    expect(await page.locator("button.ms-cell--open").count()).toBeGreaterThan(1);
  }).toPass({ timeout: 10_000 });
});

test("a reload is signed out again", async ({ page }) => {
  await fakeIssuer(page);
  await page.goto("/");
  await signInButton(page).click();
  await expect(account(page)).toBeVisible();
  await page.reload();
  await expect(signInButton(page)).toBeVisible();
});

test("a denied sign-in is signed out and the URL is clean", async ({ page }) => {
  await fakeIssuer(page, "deny");
  await page.goto("/?seed=20260903");
  await clickSignInAndReturn(page);
  await expect(signInButton(page)).toBeVisible();
  const search = await page.evaluate(() => window.location.search);
  expect(search).toContain("seed=20260903");
  expect(search).not.toMatch(/error|state=/);
});

test("a tampered state is signed out and never reaches the token endpoint", async ({ page }) => {
  let tokenCalls = 0;
  await fakeIssuer(page, "tamper");
  await page.route(`${ISSUER}/oauth/token`, (route) => {
    tokenCalls += 1;
    return route.abort();
  });
  await page.goto("/");
  await clickSignInAndReturn(page);
  await expect(signInButton(page)).toBeVisible();
  expect(await page.evaluate(() => window.location.search)).not.toMatch(/code=|state=/);
  expect(tokenCalls).toBe(0);
});

test("the sign-in button is at least 44px and does not overlap its neighbours", async ({ page }) => {
  await fakeIssuer(page);
  await page.goto("/");
  const box = await signInButton(page).boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  for (const id of ["theme-toggle", "open-settings"]) {
    const other = await page.getByTestId(id).boundingBox();
    const overlap =
      box!.x < other!.x + other!.width &&
      other!.x < box!.x + box!.width &&
      box!.y < other!.y + other!.height &&
      other!.y < box!.y + box!.height;
    expect(overlap, `overlaps ${id}`).toBe(false);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

for (const width of [320, 360, 375]) {
  test(`the open menu stays inside the viewport and does not move the header at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 720 });
    await fakeIssuer(page);
    await page.goto("/");
    const header = page.locator("header.ms-header");
    await signInButton(page).click();
    await expect(account(page)).toBeVisible();
    const before = await header.boundingBox();
    await account(page).click();
    const menu = page.getByTestId("account-menu");
    await expect(menu).toBeVisible();
    const box = (await menu.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(await header.boundingBox()).toEqual(before);
    expect(await menu.evaluate((el) => getComputedStyle(el).position)).toBe("absolute");
    test.info().annotations.push({ type: "menu-box", description: JSON.stringify(box) });
    console.log(`menu@${width}`, JSON.stringify(box), "header", JSON.stringify(before));
  });
}

test("the signed-out header fits at 320px: no overlap, no sideways scroll, 44px targets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await fakeIssuer(page);
  await page.goto("/");
  const boxes = [];
  for (const locator of [
    signInButton(page),
    page.getByTestId("theme-toggle"),
    page.getByTestId("open-settings"),
  ]) {
    const b = (await locator.boundingBox())!;
    expect(b.width).toBeGreaterThanOrEqual(44);
    expect(b.height).toBeGreaterThanOrEqual(44);
    boxes.push(b);
  }
  for (let i = 0; i < boxes.length - 1; i += 1) {
    expect(boxes[i].x + boxes[i].width).toBeLessThanOrEqual(boxes[i + 1].x + 0.5);
  }
  const word = (await page.locator(".ms-wordmark").boundingBox())!;
  expect(word.x + word.width).toBeLessThanOrEqual(boxes[0].x);
  expect(word.height).toBeLessThan(30);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
