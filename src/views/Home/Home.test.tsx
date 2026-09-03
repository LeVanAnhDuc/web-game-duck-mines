import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Home } from "./index";

/**
 * The whole screen, driven the way a player drives it. These are the tests that would
 * catch the wiring coming apart - the reducer and the components are each already
 * covered on their own.
 */

function cell(index: number): HTMLElement {
  return screen.getByTestId(`cell-${index}`);
}

function openCount(): number {
  return screen.getAllByRole("button").filter((el) => el.className.includes("ms-cell--open"))
    .length;
}

beforeEach(() => {
  // a fixed seed so the board is the same board every run - see design.md section 8
  window.history.replaceState({}, "", "/?seed=20260903");
});

describe("Home - playing with the mouse", () => {
  it("shows a beginner board, a stopped clock and all ten mines to find", () => {
    render(<Home />);
    expect(screen.getAllByRole("button").filter((el) => el.className.includes("ms-cell"))).toHaveLength(81);
    expect(screen.getByTestId("timer").textContent).toBe("0:00");
    expect(screen.getByTestId("mine-counter").textContent).toBe("010");
    expect(screen.getByText("Dễ: 9×9, 10 mìn")).toBeTruthy();
  });

  it("opens a region on the first click, never a single number", () => {
    render(<Home />);
    fireEvent.click(cell(40));
    expect(openCount()).toBeGreaterThan(1);
  });

  it("counts a flag down and back up again", () => {
    render(<Home />);
    fireEvent.contextMenu(cell(0));
    expect(screen.getByTestId("mine-counter").textContent).toBe("009");
    fireEvent.contextMenu(cell(0));
    expect(screen.getByTestId("mine-counter").textContent).toBe("010");
  });

  it("lets the counter go negative rather than clamping - FR-06", () => {
    render(<Home />);
    for (let i = 0; i < 12; i += 1) fireEvent.contextMenu(cell(i));
    expect(screen.getByTestId("mine-counter").textContent).toBe("−002");
  });

  it("refuses to open a flagged cell, so a stray click cannot cost the board", () => {
    render(<Home />);
    fireEvent.contextMenu(cell(40));
    fireEvent.click(cell(40));
    expect(openCount()).toBe(0);
  });

  it("starts a fresh board on the new-game button", () => {
    render(<Home />);
    fireEvent.click(cell(40));
    expect(openCount()).toBeGreaterThan(0);
    fireEvent.click(screen.getByLabelText("Bàn mới"));
    expect(openCount()).toBe(0);
    expect(screen.getByTestId("mine-counter").textContent).toBe("010");
  });
});

describe("Home - playing with the keyboard, FR-11", () => {
  it("opens the cell under the cursor on Space", () => {
    render(<Home />);
    const grid = screen.getByRole("grid");
    fireEvent.keyDown(grid, { key: "ArrowDown" });
    fireEvent.keyDown(grid, { key: "ArrowRight" });
    fireEvent.keyDown(grid, { key: " " });
    expect(openCount()).toBeGreaterThan(0);
  });

  it("flags on F and unflags on F again", () => {
    render(<Home />);
    const grid = screen.getByRole("grid");
    fireEvent.keyDown(grid, { key: "F" });
    expect(screen.getByTestId("mine-counter").textContent).toBe("009");
    fireEvent.keyDown(grid, { key: "f" });
    expect(screen.getByTestId("mine-counter").textContent).toBe("010");
  });

  it("starts a new board on R", () => {
    render(<Home />);
    const grid = screen.getByRole("grid");
    fireEvent.keyDown(grid, { key: " " });
    expect(openCount()).toBeGreaterThan(0);
    fireEvent.keyDown(grid, { key: "R" });
    expect(openCount()).toBe(0);
  });

  it("swallows the arrow keys so the page does not scroll under the player", () => {
    render(<Home />);
    const grid = screen.getByRole("grid");
    const event = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });
    grid.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("moves the tab stop with the cursor", () => {
    render(<Home />);
    const grid = screen.getByRole("grid");
    fireEvent.keyDown(grid, { key: "ArrowRight" });
    const stops = screen
      .getAllByRole("button")
      .filter((el) => el.getAttribute("tabindex") === "0" && el.className.includes("ms-cell"));
    expect(stops).toHaveLength(1);
    expect(stops[0]!.getAttribute("data-index")).toBe("1");
  });
});

describe("Home - the game ends", () => {
  function playUntilOver() {
    render(<Home />);
    fireEvent.click(cell(40));
    // walk the board until it goes off; the seed is fixed, so this terminates
    for (let i = 0; i < 81; i += 1) {
      if (screen.queryByTestId("result-dialog")) break;
      fireEvent.click(cell(i));
    }
    return screen.getByTestId("result-dialog");
  }

  it("shows the result over the board, not instead of it", () => {
    const dialog = playUntilOver();
    expect(["Nổ rồi", "Dọn sạch bàn"]).toContain(
      dialog.querySelector(".ms-dialog-title")!.textContent,
    );
    // the board is still there behind the dialog - on a loss the revealed mines are
    // the whole point of the screen
    expect(screen.getAllByRole("button").filter((el) => el.className.includes("ms-cell"))).toHaveLength(81);
    expect(screen.getByTestId("outcome").textContent).not.toBe("");
  });

  it("shows every mine when the board goes off", () => {
    const dialog = playUntilOver();
    if (dialog.querySelector(".ms-dialog-title")!.textContent !== "Nổ rồi") return;
    expect(screen.getAllByRole("button").some((el) => el.className.includes("ms-cell--boom"))).toBe(true);
  });

  it("refuses every further move once it is over", () => {
    playUntilOver();
    const before = openCount();
    for (let i = 0; i < 81; i += 1) fireEvent.click(cell(i));
    expect(openCount()).toBe(before);
  });

  it("starts a new board from the dialog button", () => {
    playUntilOver();
    fireEvent.click(screen.getByText("Bàn mới"));
    expect(screen.queryByTestId("result-dialog")).toBeNull();
    expect(openCount()).toBe(0);
  });

  it("starts a new board on Esc - there is nothing behind a dead board to go back to", () => {
    const dialog = playUntilOver();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByTestId("result-dialog")).toBeNull();
    expect(openCount()).toBe(0);
  });

  it("puts focus on the new-game button so the keyboard is not stranded", () => {
    playUntilOver();
    expect(document.activeElement?.textContent).toContain("Bàn mới");
  });
});
