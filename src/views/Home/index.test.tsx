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
  return screen
    .getAllByRole("button")
    .filter((el) => el.className.includes("ms-cell--open")).length;
}

beforeEach(() => {
  // a fixed seed so the board is the same board every run - see design.md section 8
  window.history.replaceState({}, "", "/?seed=20260903");
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("Home - playing with the mouse", () => {
  it("shows a beginner board, a stopped clock and all ten mines to find", () => {
    render(<Home />);
    expect(
      screen.getAllByRole("button").filter((el) => el.className.includes("ms-cell")),
    ).toHaveLength(81);
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
      .filter(
        (el) => el.getAttribute("tabindex") === "0" && el.className.includes("ms-cell"),
      );
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
    expect(
      screen.getAllByRole("button").filter((el) => el.className.includes("ms-cell")),
    ).toHaveLength(81);
    expect(screen.getByTestId("outcome").textContent).not.toBe("");
  });

  it("shows every mine when the board goes off", () => {
    const dialog = playUntilOver();
    if (dialog.querySelector(".ms-dialog-title")!.textContent !== "Nổ rồi") return;
    expect(
      screen.getAllByRole("button").some((el) => el.className.includes("ms-cell--boom")),
    ).toBe(true);
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

  it("dismisses on Esc and LEAVES the finished board standing", () => {
    // Esc used to start a new board, which swept away the result the player had just
    // earned - "Ủa, cái 5:08 của tôi đâu?" (p02-RR-01). Invariant #7 freezes the
    // board after a result, so leaving it on screen costs nothing.
    const dialog = playUntilOver();
    const openedBefore = openCount();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByTestId("result-dialog")).toBeNull();
    expect(openCount()).toBe(openedBefore);
    expect(openedBefore).toBeGreaterThan(0);
  });

  it("dismisses from the close button too, without touching the board", () => {
    playUntilOver();
    const openedBefore = openCount();
    fireEvent.click(screen.getByTestId("result-close"));
    expect(screen.queryByTestId("result-dialog")).toBeNull();
    expect(openCount()).toBe(openedBefore);
  });

  it("says how long the board took even when it was lost", () => {
    playUntilOver();
    expect(screen.getByTestId("result-time").textContent).toMatch(/\d/);
  });

  it("puts focus on the new-game button so the keyboard is not stranded", () => {
    playUntilOver();
    expect(document.activeElement?.textContent).toContain("Bàn mới");
  });
});

describe("Home - settings", () => {
  it("starts on beginner, and says which board it is", () => {
    render(<Home />);
    expect(screen.getByTestId("difficulty-label").textContent).toBe("Dễ: 9×9, 10 mìn");
  });

  it("resizes the board when another difficulty is chosen", () => {
    render(<Home />);
    fireEvent.click(screen.getByTestId("open-settings"));
    fireEvent.click(screen.getByTestId("difficulty-expert"));

    expect(
      screen.getAllByRole("button").filter((el) => el.className.includes("ms-cell")),
    ).toHaveLength(480);
    expect(screen.getByTestId("difficulty-label").textContent).toBe("Khó: 30×16, 99 mìn");
    expect(screen.getByTestId("mine-counter").textContent).toBe("099");
  });

  it("remembers the difficulty across a reload", () => {
    const first = render(<Home />);
    fireEvent.click(screen.getByTestId("open-settings"));
    fireEvent.click(screen.getByTestId("difficulty-intermediate"));
    first.unmount();

    render(<Home />);
    expect(screen.getByTestId("difficulty-label").textContent).toBe(
      "Trung bình: 16×16, 40 mìn",
    );
  });

  it("asks before throwing away a board that is under way", () => {
    render(<Home />);
    fireEvent.click(cell(40));
    fireEvent.click(screen.getByTestId("open-settings"));
    fireEvent.click(screen.getByTestId("difficulty-expert"));

    // still the beginner board until the question is answered
    expect(screen.getByTestId("difficulty-label").textContent).toBe("Dễ: 9×9, 10 mìn");
    fireEvent.click(screen.getByTestId("abandon-confirm"));
    expect(screen.getByTestId("difficulty-label").textContent).toBe("Khó: 30×16, 99 mìn");
  });

  it("puts an explicit theme on the document and keeps it across a reload", () => {
    const first = render(<Home />);
    // nothing stamped while the choice is "system": the media query answers
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);

    fireEvent.click(screen.getByTestId("theme-toggle"));
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    first.unmount();

    render(<Home />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("keeps question marks out of the flag cycle until they are switched on", () => {
    render(<Home />);
    fireEvent.contextMenu(cell(0));
    fireEvent.contextMenu(cell(0));
    // flag -> hidden, not flag -> question mark
    expect(screen.getByTestId("mine-counter").textContent).toBe("010");
    expect(cell(0).textContent).toBe("");

    fireEvent.click(screen.getByTestId("open-settings"));
    fireEvent.click(screen.getByTestId("toggle-unsure"));
    fireEvent.click(screen.getByTestId("settings-scrim"));

    fireEvent.contextMenu(cell(0));
    fireEvent.contextMenu(cell(0));
    expect(cell(0).textContent).toBe("?");
  });
});

describe("Home - a custom board is played but never ranked", () => {
  function pickCustom(cols: number, rows: number, mines: number) {
    fireEvent.click(screen.getByTestId("open-settings"));
    fireEvent.click(screen.getByTestId("difficulty-custom"));
    fireEvent.change(screen.getByTestId("custom-cols"), {
      target: { value: String(cols) },
    });
    fireEvent.change(screen.getByTestId("custom-rows"), {
      target: { value: String(rows) },
    });
    fireEvent.change(screen.getByTestId("custom-mines"), {
      target: { value: String(mines) },
    });
    fireEvent.click(screen.getByTestId("settings-scrim"));
  }

  it("builds the board that was asked for, and says it is not ranked", () => {
    render(<Home />);
    pickCustom(7, 6, 5);
    expect(
      screen.getAllByRole("button").filter((el) => el.className.includes("ms-cell")),
    ).toHaveLength(42);
    expect(screen.getByTestId("mine-counter").textContent).toBe("005");
    expect(screen.getByTestId("unranked-note")).toBeTruthy();
  });

  it("writes NO record when a custom board is cleared - ADR-0007", () => {
    // The one thing ADR-0007 said would be easy to get wrong in silence: a fast win
    // on a board the player built must not touch the beginner row.
    render(<Home />);
    pickCustom(5, 5, 1);
    for (let i = 0; i < 25; i += 1) {
      if (screen.queryByTestId("result-dialog")) break;
      fireEvent.click(cell(i));
    }
    expect(screen.getByTestId("result-dialog")).toBeTruthy();
    expect(screen.queryByTestId("result-record")).toBeNull();

    fireEvent.click(screen.getByTestId("open-settings"));
    for (const difficulty of ["beginner", "intermediate", "expert"]) {
      expect(screen.getByTestId(`record-${difficulty}`).textContent).toBe("—");
    }
  });

  it("goes back to a ranked board when a preset is chosen again", () => {
    render(<Home />);
    pickCustom(7, 6, 5);
    fireEvent.click(screen.getByTestId("open-settings"));
    fireEvent.click(screen.getByTestId("difficulty-beginner"));
    expect(screen.queryByTestId("unranked-note")).toBeNull();
    expect(screen.getByTestId("difficulty-label").textContent).toBe("Dễ: 9×9, 10 mìn");
  });
});
