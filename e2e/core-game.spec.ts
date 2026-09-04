import { expect, test, type Page } from "@playwright/test";

/**
 * These run against the exported static site, so they check the thing that ships.
 * The unit suite already covers the rules; this covers the wiring, the keyboard and
 * the two claims that only mean anything in a real browser.
 */

const cell = (page: Page, index: number) => page.getByTestId(`cell-${index}`);
const openCells = (page: Page) => page.locator("button.ms-cell--open");

test.describe("the board loads", () => {
  test("shows 81 cells, a stopped clock and ten mines to find", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await expect(page.locator("button.ms-cell")).toHaveCount(81);
    await expect(page.getByTestId("timer")).toHaveText("0:00");
    await expect(page.getByTestId("mine-counter")).toHaveText("010");
  });

  test("never scrolls the page sideways at 375px", async ({ page }) => {
    await page.goto("/?seed=20260903");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("FR-01: the first move never explodes", () => {
  // twenty different boards. If first-move safety were wrong, one of these would go
  // off - which is the whole point of doing it twenty times rather than once.
  for (let seed = 1; seed <= 20; seed += 1) {
    test(`seed ${seed} opens a region instead of a mine`, async ({ page }) => {
      await page.goto(`/?seed=${seed}`);
      // A click that lands before React has hydrated is simply lost - no listener
      // exists yet - so retry until one takes. The board is still unplanted either
      // way, so a retry cannot change what the first move means.
      await expect(async () => {
        await cell(page, 40).click();
        expect(await openCells(page).count()).toBeGreaterThan(1);
      }).toPass({ timeout: 10_000 });
      // the outcome line is a permanent sr-only region, so absence is read off the
      // dialog: no dialog means the board is still in play
      await expect(page.getByTestId("result-dialog")).toHaveCount(0);
    });
  }
});

test.describe("the clock", () => {
  test("starts on the first move, not on page load", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await page.waitForTimeout(1500);
    await expect(page.getByTestId("timer")).toHaveText("0:00");

    await cell(page, 40).click();
    await expect(page.getByTestId("timer")).not.toHaveText("0:00", { timeout: 3000 });
  });
});

test.describe("FR-11: the board is playable from the keyboard", () => {
  test("arrow keys walk a row and the focus ring follows", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await cell(page, 0).focus();

    for (let i = 0; i < 8; i += 1) await page.keyboard.press("ArrowRight");
    const focused = page.locator("button.ms-cell:focus");
    await expect(focused).toHaveAttribute("data-index", "8");

    // the ring has to be visible, not merely present - NFR-A11Y-02
    const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
  });

  test("F flags, Space opens, R starts over", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await cell(page, 0).focus();

    await page.keyboard.press("f");
    await expect(page.getByTestId("mine-counter")).toHaveText("009");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Space");
    expect(await openCells(page).count()).toBeGreaterThan(0);

    await page.keyboard.press("r");
    await expect(openCells(page)).toHaveCount(0);
    await expect(page.getByTestId("mine-counter")).toHaveText("010");
  });

  test("arrow keys do not scroll the page out from under the player", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await cell(page, 0).focus();
    const before = await page.evaluate(() => window.scrollY);
    for (let i = 0; i < 10; i += 1) await page.keyboard.press("ArrowDown");
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });
});

test.describe("flags", () => {
  test("right click flags without opening the browser menu", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await cell(page, 0).click({ button: "right" });
    await expect(page.getByTestId("mine-counter")).toHaveText("009");
    await expect(cell(page, 0)).toHaveAttribute("aria-label", /đã cắm cờ/);
  });

  test("a flagged cell survives a stray left click", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await cell(page, 40).click({ button: "right" });
    await cell(page, 40).click();
    await expect(openCells(page)).toHaveCount(0);
  });
});

test.describe("NFR-A11Y-07: the digit carries the information, colour only helps", () => {
  test("every numeral is still readable with the colour removed", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await cell(page, 40).click();
    await page.addStyleTag({ content: "html { filter: grayscale(1); }" });

    const numerals = await page
      .locator("button.ms-cell--open")
      .evaluateAll((els) => els.map((el) => el.textContent ?? "").filter((t) => t !== ""));

    // the digits are text nodes, so they survive grayscale by construction - this
    // asserts the board is not drawing its numbers as colour-only marks
    expect(numerals.length).toBeGreaterThan(0);
    for (const text of numerals) expect(text).toMatch(/^[1-8]$/);
  });
});

test.describe("the same seed gives the same board", () => {
  test("two loads of ?seed= play out identically", async ({ page }) => {
    const fingerprint = async () => {
      await page.goto("/?seed=777");
      await cell(page, 40).click();
      return page
        .locator("button.ms-cell")
        .evaluateAll((els) => els.map((el) => el.textContent ?? "").join("|"));
    };
    expect(await fingerprint()).toBe(await fingerprint());
  });
});

test.describe("the result dialog", () => {
  test("covers the board without replacing it, and starts the next one", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await expect(async () => {
      await cell(page, 40).click();
      expect(await openCells(page).count()).toBeGreaterThan(1);
    }).toPass({ timeout: 10_000 });

    // walk the board until it ends; the seed is fixed so this terminates
    for (let i = 0; i < 81; i += 1) {
      if ((await page.getByTestId("result-dialog").count()) > 0) break;
      await cell(page, i).click({ force: true });
    }

    const dialog = page.getByTestId("result-dialog");
    await expect(dialog).toHaveCount(1);
    // the board is still there behind it - on a loss the revealed mines are the point
    await expect(page.locator("button.ms-cell")).toHaveCount(81);
    // and the keyboard is not stranded
    await expect(page.locator(".ms-dialog-action")).toBeFocused();

    await page.locator(".ms-dialog-action").click();
    await expect(dialog).toHaveCount(0);
    await expect(openCells(page)).toHaveCount(0);
  });
});

test.describe("settings", () => {
  test("changes the board, and remembers it across a reload", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await page.getByTestId("open-settings").click();
    await page.getByTestId("difficulty-expert").click();

    await expect(page.locator("button.ms-cell")).toHaveCount(480);
    await expect(page.getByTestId("mine-counter")).toHaveText("099");

    await page.reload();
    await expect(page.locator("button.ms-cell")).toHaveCount(480);
  });

  test("asks before throwing away a board that is under way", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await expect(async () => {
      await page.getByTestId("cell-40").click();
      expect(await page.locator("button.ms-cell--open").count()).toBeGreaterThan(1);
    }).toPass({ timeout: 10_000 });

    await page.getByTestId("open-settings").click();
    await page.getByTestId("difficulty-intermediate").click();
    // still 81 cells: the question has not been answered
    await expect(page.locator("button.ms-cell")).toHaveCount(81);

    await page.getByTestId("abandon-confirm").click();
    await expect(page.locator("button.ms-cell")).toHaveCount(256);
  });

  test("an explicit theme wins over the system preference, in both directions", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/?seed=20260903");
    const boardBg = () =>
      page.locator(".ms-board").evaluate((el) => getComputedStyle(el).backgroundColor);
    const light = await boardBg();

    await page.getByTestId("theme-toggle").click();
    const dark = await boardBg();
    expect(dark).not.toBe(light);

    // and it survives a reload rather than snapping back to the system choice
    await page.reload();
    expect(await boardBg()).toBe(dark);
  });

  test("sound is off until it is asked for - ADR-0008", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await page.getByTestId("open-settings").click();
    await expect(page.getByTestId("toggle-sound")).toHaveAttribute("aria-checked", "false");
    await page.getByTestId("toggle-sound").click();
    await expect(page.getByTestId("toggle-sound")).toHaveAttribute("aria-checked", "true");
  });

  test("ships no audio file at all - NFR-PERF-08", async ({ page }) => {
    const media: string[] = [];
    page.on("request", (r) => {
      if (/\.(mp3|wav|ogg|m4a|aac)(\?|$)/i.test(r.url())) media.push(r.url());
    });
    await page.goto("/?seed=20260903");
    await page.getByTestId("cell-40").click();
    expect(media).toEqual([]);
  });
});
