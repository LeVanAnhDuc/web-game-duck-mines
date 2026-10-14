import { test, expect } from "@/fixtures";
import { copy } from "@/data/copy";
import { SEED, STORAGE } from "@/data/test-data";

// FR-10 · FR-18 · NFR-REL-03 · ADR-0008: the sheet itself, its switches, clearing records, and storage that is not there.

test("cài đặt đóng được bằng nút Đóng, phím Esc và bấm ra nền", { tag: ["@TC-SETTINGS-008"] }, async ({ page, gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await gamePage.settings.closeButton().click();
  await expect(gamePage.settings.dialog()).toHaveCount(0);

  await gamePage.openSettings();
  await expect(gamePage.settings.dialog()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(gamePage.settings.dialog()).toHaveCount(0);

  await gamePage.openSettings();
  await gamePage.settings.scrim().click({ position: { x: 5, y: 5 } });
  await expect(gamePage.settings.dialog()).toHaveCount(0);
});

test("dấu hỏi mặc định tắt, bật được và còn bật sau khi tải lại", { tag: ["@TC-SETTINGS-009"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await expect(gamePage.settings.unsureSwitch()).toHaveAttribute("aria-checked", "false");
  await gamePage.settings.unsureSwitch().click();
  await expect(gamePage.settings.unsureSwitch()).toHaveAttribute("aria-checked", "true");

  await gamePage.reload();
  await gamePage.openSettings();
  await expect(gamePage.settings.unsureSwitch()).toHaveAttribute("aria-checked", "true");
});

test("tiếng nổ mặc định tắt, bật được và còn bật sau khi tải lại", { tag: ["@TC-SETTINGS-010", "@smoke"] }, async ({
  gamePage,
}) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "false");
  await gamePage.settings.soundSwitch().click();
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "true");

  await gamePage.reload();
  await gamePage.openSettings();
  await expect(gamePage.settings.soundSwitch()).toHaveAttribute("aria-checked", "true");
});

test("Xoá kỷ lục đưa cả ba mức về chưa có kỷ lục", { tag: ["@TC-SETTINGS-011"] }, async ({ gamePage }) => {
  await gamePage.seedStorage({ [STORAGE.records]: { beginner: 12, intermediate: 80, expert: 300 } });
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await expect(gamePage.settings.record("beginner")).toHaveText("0:12");
  await expect(gamePage.settings.record("expert")).toHaveText("5:00");

  await gamePage.settings.clearRecordsButton().click();
  for (const d of ["beginner", "intermediate", "expert"] as const) {
    await expect(gamePage.settings.record(d)).toHaveText(copy.settings.noRecord);
  }
});

test.describe("localStorage không dùng được", () => {
  test.beforeEach(async ({ page }) => {
    // the way a privacy mode or a blocked-site-data policy looks to a page: touching localStorage throws
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
  });

  test("game vẫn chơi được đầy đủ và cài đặt nói rõ kỷ lục sẽ không được lưu", { tag: ["@TC-SETTINGS-012", "@smoke"] }, async ({
    gamePage,
  }) => {
    await gamePage.goto(SEED);
    await gamePage.reveal(40);
    expect(await gamePage.openCount()).toBeGreaterThan(1);
    await gamePage.flag(0);
    await expect(gamePage.mineCounter()).toHaveText("009");

    await gamePage.openSettings();
    await expect(gamePage.settings.storageOffNote()).toBeVisible();
    await gamePage.settings.pickDifficulty("expert");
    await gamePage.settings.abandonConfirmButton().click();
    await expect(gamePage.cells()).toHaveCount(480);
    // a line, not a blocking dialog
    await expect(gamePage.page.getByRole("alertdialog")).toHaveCount(0);
  });

  test("thắng khi không lưu được thì không khoe kỷ lục", { tag: ["@TC-SETTINGS-013"] }, async ({ gamePage }) => {
    const mines = await gamePage.learnMines(SEED, 40);
    await gamePage.goto(SEED);
    await gamePage.reveal(40);
    await gamePage.openAllSafe(mines);
    await expect(gamePage.result.dialog()).toHaveAccessibleName(copy.result.wonTitle);
    await expect(gamePage.result.recordNote()).toHaveCount(0);
  });
});

test("cài đặt nói thẳng rằng bàn có thể phải đoán ở nước cuối", { tag: ["@TC-SETTINGS-014"] }, async ({ gamePage }) => {
  await gamePage.goto(SEED);
  await gamePage.openSettings();
  await expect(gamePage.settings.rulesNote()).toHaveText(copy.settings.playRulesNote);
});

test.describe("tiếng nổ sinh bằng WebAudio", () => {
  test.beforeEach(async ({ page }) => {
    // count every AudioContext the page builds and every sound source it starts
    await page.addInitScript(() => {
      const Real = window.AudioContext;
      const audit = { contexts: 0, started: 0, decoded: 0 };
      (window as unknown as { __audio: typeof audit }).__audio = audit;
      // AudioBufferSourceNode declares its own start(), so patch it there, not on the base class
      const startOf = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args: Parameters<typeof startOf>) {
        audit.started += 1;
        return startOf.apply(this, args);
      };
      const decode = BaseAudioContext.prototype.decodeAudioData;
      BaseAudioContext.prototype.decodeAudioData = function (...args: Parameters<typeof decode>) {
        audit.decoded += 1;
        return decode.apply(this, args);
      };
      window.AudioContext = class extends Real {
        constructor(...args: ConstructorParameters<typeof Real>) {
          super(...args);
          audit.contexts += 1;
        }
      };
    });
  });

  const audio = (gamePage: { page: import("@playwright/test").Page }) =>
    gamePage.page.evaluate(() => (window as unknown as { __audio: { contexts: number; started: number; decoded: number } }).__audio);

  test("tiếng tắt (mặc định) thì thua cũng không phát âm nào", { tag: ["@TC-SETTINGS-015"] }, async ({ gamePage }) => {
    const mines = await gamePage.learnMines(SEED, 40);
    await expect(gamePage.result.dialog()).toBeVisible();
    expect(mines.size).toBe(10);
    expect(await audio(gamePage)).toEqual({ contexts: 0, started: 0, decoded: 0 });
  });

  test("bật tiếng thì thua phát tiếng nổ dựng bằng code", { tag: ["@TC-SETTINGS-016"] }, async ({ gamePage }) => {
    await gamePage.goto(SEED);
    await gamePage.openSettings();
    await gamePage.settings.soundSwitch().click();
    await gamePage.settings.close();
    await gamePage.learnMines(SEED, 40);
    await expect(gamePage.result.dialog()).toBeVisible();
    const used = await audio(gamePage);
    expect(used.contexts).toBe(1);
    expect(used.started).toBeGreaterThan(0);
    // synthesised in code: nothing was decoded from an audio file
    expect(used.decoded).toBe(0);
  });
});
