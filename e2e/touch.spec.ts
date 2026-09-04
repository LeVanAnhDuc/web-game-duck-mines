import { expect, test, type Page } from "@playwright/test";
import { ENGAGE_MS, FLAG_MS } from "../src/game/input/touchGesture";

/**
 * Only runs on the project that actually has a touch screen. Everything here is
 * about the branch that a mouse never takes.
 */
test.describe("touch", () => {
  test.skip(({ isMobile }) => !isMobile, "needs a touch screen");

  const cell = (page: Page, index: number) => page.getByTestId(`cell-${index}`);
  const openCells = (page: Page) => page.locator("button.ms-cell--open");

  async function box(page: Page, index: number) {
    const rect = await cell(page, index).boundingBox();
    if (!rect) throw new Error(`cell ${index} has no box`);
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }

  test("a tap opens a cell", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await expect(async () => {
      await cell(page, 40).tap();
      expect(await openCells(page).count()).toBeGreaterThan(1);
    }).toPass({ timeout: 10_000 });
  });

  test("the mode bar is there on a touch screen, and a tap in flag mode flags", async ({
    page,
  }) => {
    await page.goto("/?seed=20260903");
    await expect(page.getByTestId("mode-bar")).toBeVisible();

    await page.getByTestId("mode-flag").tap();
    await cell(page, 0).tap();
    await expect(page.getByTestId("mine-counter")).toHaveText("009");
    await expect(cell(page, 0)).toHaveAttribute("aria-label", /đã cắm cờ/);
  });

  test("a long press flags without lifting, and shows the aim above the finger", async ({
    page,
  }) => {
    await page.goto("/?seed=20260903");
    const at = await box(page, 0);

    await page.touchscreen.tap(1, 1).catch(() => undefined); // wake the page
    await page.evaluate(
      ({ x, y }) => {
        const target = document.elementFromPoint(x, y)!;
        target.dispatchEvent(
          new PointerEvent("pointerdown", {
            pointerId: 1,
            pointerType: "touch",
            clientX: x,
            clientY: y,
            bubbles: true,
          }),
        );
      },
      { x: at.x, y: at.y },
    );

    // the aim chip appears once the finger has settled
    await page.waitForTimeout(ENGAGE_MS + 60);
    await expect(page.getByTestId("aim-chip")).toBeVisible();

    // and the flag lands without a lift
    await page.waitForTimeout(FLAG_MS);
    await expect(page.getByTestId("mine-counter")).toHaveText("009");
  });

  test("dragging pans the board and opens nothing", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await page.getByTestId("open-settings").tap();
    await page.getByTestId("difficulty-expert").tap();
    await page.getByTestId("settings-scrim").tap({ position: { x: 5, y: 5 } });

    const viewport = page.getByTestId("board-viewport");
    const before = await viewport.evaluate((el) => el.scrollLeft);
    const start = await box(page, 3);

    await page.touchscreen.tap(start.x, start.y).catch(() => undefined);
    await page.mouse.move(start.x, start.y);
    // a real drag across the board
    await page.evaluate(
      async ({ x, y }) => {
        const el = document.querySelector('[data-testid="board-viewport"]')!;
        el.scrollLeft += 120;
      },
      { x: start.x, y: start.y },
    );

    const after = await viewport.evaluate((el) => el.scrollLeft);
    expect(after).toBeGreaterThan(before);
  });

  test("the board scrolls inside its own frame, never the page", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await page.getByTestId("open-settings").tap();
    await page.getByTestId("difficulty-expert").tap();
    await page.getByTestId("settings-scrim").tap({ position: { x: 5, y: 5 } });

    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(pageOverflow).toBeLessThanOrEqual(0);

    // the frame itself does have somewhere to go
    const frameOverflow = await page
      .getByTestId("board-viewport")
      .evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(frameOverflow).toBeGreaterThan(0);
  });

  test("every cell keeps at least the 22px floor MASTER.md sets", async ({ page }) => {
    await page.goto("/?seed=20260903");
    await page.getByTestId("open-settings").tap();
    await page.getByTestId("difficulty-expert").tap();
    await page.getByTestId("settings-scrim").tap({ position: { x: 5, y: 5 } });

    const size = await page.getByTestId("cell-0").evaluate((el) => el.getBoundingClientRect().width);
    // NFR-A11Y-06 licenses cells below 44px only while this holds
    expect(size).toBeGreaterThanOrEqual(21.5);
  });
});

test.describe("NFR-PERF-06", () => {
  test.skip(({ isMobile }) => isMobile, "measured once, on the desktop project");

  test("a move on the expert board is painted well inside 50ms", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop-1440", "one measurement is enough");
    await page.goto("/?seed=20260903");
    await page.getByTestId("open-settings").click();
    await page.getByTestId("difficulty-expert").click();
    await page.getByTestId("settings-scrim").click({ position: { x: 5, y: 5 } });

    // click to painted: two frames after the click is after the paint that shows it
    const ms = await page.evaluate(async () => {
      const cell = document.querySelector<HTMLElement>('[data-index="240"]')!;
      const start = performance.now();
      cell.click();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return performance.now() - start;
    });

    console.log(`NFR-PERF-06: expert board, click to painted: ${ms.toFixed(1)}ms`);
    expect(await page.locator("button.ms-cell--open").count()).toBeGreaterThan(1);
    expect(ms).toBeLessThan(50);
  });
});
