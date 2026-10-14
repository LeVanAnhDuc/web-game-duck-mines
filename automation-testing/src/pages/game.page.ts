import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { copy } from "@/data/copy";

export type CellState = "hidden" | "flagged" | "unsure" | "empty" | "number" | "mine" | "exploded" | "wrongFlag";

export interface CellInfo {
  state: CellState;
  /** the numeral on an open number cell, 0 otherwise */
  n: number;
}

export type Difficulty = "beginner" | "intermediate" | "expert";

/** Reads a cell's state from its aria-label, the only per-cell state the game exposes (NFR-A11Y-04). */
export function parseCellLabel(label: string): CellInfo {
  const tail = label.replace(/^hàng \d+, cột \d+, /, "");
  const num = tail.match(/^(\d) mìn xung quanh$/);
  if (num) return { state: "number", n: Number(num[1]) };
  const states: Record<string, CellState> = {
    "chưa mở": "hidden",
    "đã cắm cờ": "flagged",
    "đánh dấu chưa chắc": "unsure",
    trống: "empty",
    mìn: "mine",
    "mìn đã nổ": "exploded",
    "cờ cắm sai": "wrongFlag",
  };
  const state = states[tail];
  if (!state) throw new Error(`Unrecognised cell label "${label}"`);
  return { state, n: 0 };
}

/**
 * The game is one screen: header, HUD, board, mode bar, and two overlays (settings sheet, result dialog).
 * Every URL is relative ("./…") so the same object works under GitHub Pages' /web-game-duck-mines/ base path.
 */
export class GamePage extends BasePage {
  readonly settings: SettingsSheet;
  readonly result: ResultDialog;
  readonly account: AccountMenu;

  constructor(page: Page) {
    super(page);
    this.settings = new SettingsSheet(page);
    this.result = new ResultDialog(page);
    this.account = new AccountMenu(page);
  }

  // ── navigation ──────────────────────────────────────────────────────────

  /** Opens the game, optionally on a fixed board (?seed=), and waits until React has hydrated the board. */
  async goto(seed?: number, extraQuery = ""): Promise<void> {
    const query = [seed === undefined ? "" : `seed=${seed}`, extraQuery].filter(Boolean).join("&");
    await this.page.goto(query ? `./?${query}` : "./");
    await this.waitHydrated();
  }

  /** Puts values in localStorage before any page script runs, on every navigation of this page. */
  async seedStorage(entries: Record<string, unknown>): Promise<void> {
    await this.page.addInitScript((items) => {
      for (const [key, value] of Object.entries(items)) localStorage.setItem(key, JSON.stringify(value));
    }, entries);
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitHydrated();
  }

  /**
   * A click that lands before hydration is lost (no listener yet). React marks every hydrated DOM node with a
   * __reactFiber$… key, so its presence on the first cell is the moment the board starts answering.
   */
  async waitHydrated(): Promise<void> {
    await this.grid().waitFor();
    await this.page.waitForFunction(() => {
      const cell = document.querySelector('[data-testid="cell-0"]');
      return !!cell && Object.keys(cell).some((k) => k.startsWith("__reactFiber"));
    });
  }

  // ── locators ────────────────────────────────────────────────────────────

  grid(): Locator {
    return this.page.getByRole("grid", { name: copy.board.grid });
  }
  boardViewport(): Locator {
    return this.page.getByTestId("board-viewport");
  }
  cells(): Locator {
    return this.grid().getByRole("button");
  }
  cell(index: number): Locator {
    return this.page.getByTestId(`cell-${index}`);
  }
  focusedCell(): Locator {
    return this.grid().locator("button:focus");
  }
  mineCounter(): Locator {
    return this.page.getByTestId("mine-counter");
  }
  timer(): Locator {
    return this.page.getByTestId("timer");
  }
  newGameButton(): Locator {
    return this.page.locator(".ms-hud").getByRole("button", { name: copy.hud.newGame });
  }
  difficultyLabel(): Locator {
    return this.page.getByTestId("difficulty-label");
  }
  unrankedNote(): Locator {
    return this.page.getByTestId("unranked-note");
  }
  rotateHint(): Locator {
    return this.page.getByTestId("rotate-hint");
  }
  /** The screen-reader-only live region that announces a win or a loss. */
  outcome(): Locator {
    return this.page.getByTestId("outcome");
  }
  header(): Locator {
    return this.page.locator("header.ms-header");
  }
  wordmark(): Locator {
    return this.page.locator(".ms-wordmark");
  }
  themeToggle(): Locator {
    return this.page.getByRole("button", { name: copy.header.theme });
  }
  settingsButton(): Locator {
    return this.page.getByRole("button", { name: copy.header.settings, exact: true });
  }
  modeBar(): Locator {
    return this.page.getByRole("radiogroup", { name: copy.touch.modeSwitch });
  }
  modeDig(): Locator {
    return this.modeBar().getByRole("radio", { name: copy.touch.modeDig });
  }
  modeFlag(): Locator {
    return this.modeBar().getByRole("radio", { name: copy.touch.modeFlag });
  }
  aimChip(): Locator {
    return this.page.getByTestId("aim-chip");
  }
  hints(): Locator {
    return this.page.locator(".ms-hints");
  }

  // ── reading the board ───────────────────────────────────────────────────

  async size(): Promise<{ cols: number; rows: number }> {
    const [cols, rows] = await Promise.all([
      this.grid().getAttribute("aria-colcount"),
      this.grid().getAttribute("aria-rowcount"),
    ]);
    return { cols: Number(cols), rows: Number(rows) };
  }

  /** Every cell's state, in index order, in one round trip. */
  async states(): Promise<CellInfo[]> {
    const labels = await this.cells().evaluateAll((els) => els.map((el) => el.getAttribute("aria-label") ?? ""));
    return labels.map(parseCellLabel);
  }

  async cellInfo(index: number): Promise<CellInfo> {
    return parseCellLabel((await this.cell(index).getAttribute("aria-label")) ?? "");
  }

  async openCount(): Promise<number> {
    return (await this.states()).filter((c) => c.state === "empty" || c.state === "number").length;
  }

  // ── acting ──────────────────────────────────────────────────────────────

  async reveal(index: number): Promise<void> {
    await this.cell(index).click();
  }
  async flag(index: number): Promise<void> {
    await this.cell(index).click({ button: "right" });
  }
  /**
   * Fires the native contextmenu event a right click produces and reports whether the game suppressed the browser
   * menu (defaultPrevented). The event itself is what flags the cell.
   */
  async contextMenu(index: number): Promise<boolean> {
    return this.cell(index).evaluate(
      (el) => !el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 })),
    );
  }
  async chordWithMiddleClick(index: number): Promise<void> {
    await this.cell(index).click({ button: "middle" });
  }
  async newGame(): Promise<void> {
    await this.newGameButton().click();
  }
  async openSettings(): Promise<void> {
    await this.settingsButton().click();
    await this.settings.dialog().waitFor();
  }

  /** Opens settings, picks a preset, closes. Only for a board nobody has played yet (no abandon question). */
  async useDifficulty(difficulty: Difficulty): Promise<void> {
    await this.openSettings();
    await this.settings.pickDifficulty(difficulty);
    await this.settings.close();
  }

  /** Opens settings, builds a custom board, closes. */
  async useCustomBoard(cols: number, rows: number, mines: number): Promise<void> {
    await this.openSettings();
    await this.settings.pickCustom();
    await this.settings.setCustom(cols, rows, mines);
    await this.settings.close();
  }

  /**
   * Learns where the mines are on the board `seed` produces after `firstMove`, the black-box way: play it, open
   * hidden cells in order until one explodes, and read the mines the loss reveals. Reloading the same seed and
   * making the same first move rebuilds the same board (REQ-BOARD-08), so a test can then play it knowingly.
   * Leaves the page on the lost board.
   */
  async learnMines(seed: number, firstMove: number): Promise<Set<number>> {
    await this.goto(seed);
    await this.reveal(firstMove);
    await this.page.evaluate(async () => {
      // a macrotask, so React has committed the click; MessageChannel is not faked by page.clock
      const nextTask = () =>
        new Promise((r) => {
          const ch = new MessageChannel();
          ch.port1.onmessage = () => r(null);
          ch.port2.postMessage(0);
        });
      const outcome = () => document.querySelector('[data-testid="outcome"]')?.textContent ?? "";
      const cells = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="grid"] button'));
      for (const cell of cells) {
        if (outcome()) break;
        if (!/chưa mở$/.test(cell.getAttribute("aria-label") ?? "")) continue;
        cell.click();
        await nextTask();
      }
    });
    const states = await this.states();
    const mines = new Set<number>();
    states.forEach((c, i) => {
      if (c.state === "mine" || c.state === "exploded" || c.state === "flagged") mines.add(i);
    });
    return mines;
  }

  /** Opens every cell that is not a mine, the fast way (in-page clicks), which wins the board. */
  async openAllSafe(mines: ReadonlySet<number>): Promise<void> {
    await this.page.evaluate(async (mineList) => {
      const nextTask = () =>
        new Promise((r) => {
          const ch = new MessageChannel();
          ch.port1.onmessage = () => r(null);
          ch.port2.postMessage(0);
        });
      const skip = new Set(mineList);
      const cells = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="grid"] button'));
      for (const [i, cell] of cells.entries()) {
        if (skip.has(i) || !/chưa mở$/.test(cell.getAttribute("aria-label") ?? "")) continue;
        cell.click();
        await nextTask();
      }
    }, [...mines]);
  }
}

/** Bottom sheet on a phone, centred dialog from 768px up. Only this page has it. */
export class SettingsSheet {
  constructor(private readonly page: Page) {}

  dialog(): Locator {
    return this.page.getByRole("dialog", { name: copy.settings.title });
  }
  scrim(): Locator {
    return this.page.getByTestId("settings-scrim");
  }
  closeButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.settings.close });
  }
  difficultyGroup(): Locator {
    return this.dialog().getByRole("radiogroup", { name: copy.settings.sectionDifficulty });
  }
  difficultyOption(difficulty: Difficulty | "custom"): Locator {
    return this.page.getByTestId(`difficulty-${difficulty}`);
  }
  abandonQuestion(): Locator {
    return this.dialog().getByRole("alertdialog", { name: copy.settings.abandonConfirm });
  }
  abandonConfirmButton(): Locator {
    return this.abandonQuestion().getByRole("button", { name: copy.settings.abandonConfirm });
  }
  abandonCancelButton(): Locator {
    return this.abandonQuestion().getByRole("button", { name: copy.settings.abandonCancel });
  }
  customCols(): Locator {
    return this.page.getByTestId("custom-cols");
  }
  customRows(): Locator {
    return this.page.getByTestId("custom-rows");
  }
  customMines(): Locator {
    return this.page.getByTestId("custom-mines");
  }
  customFields(): Locator {
    return this.page.getByTestId("custom-fields");
  }
  customDensity(): Locator {
    return this.page.getByTestId("custom-density");
  }
  customUnranked(): Locator {
    return this.page.getByTestId("custom-unranked");
  }
  unsureSwitch(): Locator {
    return this.dialog().getByRole("switch", { name: copy.settings.unsureLabel });
  }
  soundSwitch(): Locator {
    return this.dialog().getByRole("switch", { name: copy.settings.soundLabel });
  }
  themeOption(value: "system" | "light" | "dark"): Locator {
    return this.page.getByTestId(`theme-${value}`);
  }
  record(difficulty: Difficulty): Locator {
    return this.page.getByTestId(`record-${difficulty}`);
  }
  clearRecordsButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.settings.clearRecords });
  }
  storageOffNote(): Locator {
    return this.dialog().getByText(copy.settings.recordsStorageOff);
  }
  rulesNote(): Locator {
    return this.page.getByTestId("play-rules-note");
  }

  async pickDifficulty(difficulty: Difficulty): Promise<void> {
    await this.difficultyOption(difficulty).click();
  }
  async pickCustom(): Promise<void> {
    await this.difficultyOption("custom").click();
  }
  /** Types each field and leaves it, which is when the game commits (and clamps) the value - ADR-0011. */
  async setCustom(cols: number, rows: number, mines: number): Promise<void> {
    for (const [field, value] of [
      [this.customCols(), cols],
      [this.customRows(), rows],
      [this.customMines(), mines],
    ] as const) {
      await field.fill(String(value));
      await field.blur();
    }
  }
  async close(): Promise<void> {
    await this.closeButton().click();
    await this.dialog().waitFor({ state: "detached" });
  }
}

/** Win/lose panel, anchored to the bottom so the finished board stays visible behind it. */
export class ResultDialog {
  constructor(private readonly page: Page) {}

  dialog(): Locator {
    return this.page.getByTestId("result-dialog");
  }
  time(): Locator {
    return this.page.getByTestId("result-time");
  }
  recordNote(): Locator {
    return this.page.getByTestId("result-record");
  }
  wrongFlagHint(): Locator {
    return this.dialog().getByText(copy.result.lostHint);
  }
  newGameButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.hud.newGame });
  }
  closeButton(): Locator {
    return this.dialog().getByRole("button", { name: copy.result.close });
  }
}

/** Ducker ID sign-in button + account menu (only rendered when the feature flag is on - ADR-0013). */
export class AccountMenu {
  constructor(private readonly page: Page) {}

  signInButton(): Locator {
    return this.page.getByRole("button", { name: copy.account.signIn });
  }
  trigger(): Locator {
    return this.page.getByRole("button", { name: copy.account.menuLabel });
  }
  menu(): Locator {
    return this.page.getByTestId("account-menu");
  }
  profileLink(): Locator {
    return this.page.getByRole("menuitem", { name: copy.account.openProfile });
  }
  signOutItem(): Locator {
    return this.page.getByRole("menuitem", { name: copy.account.signOut });
  }
}
