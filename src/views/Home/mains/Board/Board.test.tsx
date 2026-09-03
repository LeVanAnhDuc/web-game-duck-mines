import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { boardFrom } from "@/game/core/testBoard";
import { Board } from "./index";
import { cellRenderCount } from "./Cell";

const noop = () => undefined;

function view(overrides: Partial<Parameters<typeof Board>[0]> = {}) {
  const board = boardFrom(["*..", ".o.", "..."]);
  return render(
    <Board
      board={board}
      status="playing"
      explodedIndex={null}
      cursor={0}
      onAct={noop}
      onKeyDown={noop}
      {...overrides}
    />,
  );
}

describe("Board", () => {
  it("renders one button per cell and announces its shape", () => {
    view();
    const grid = screen.getByRole("grid");
    expect(grid.getAttribute("aria-rowcount")).toBe("3");
    expect(grid.getAttribute("aria-colcount")).toBe("3");
    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("gives exactly one cell a tab stop - roving tabindex", () => {
    view({ cursor: 4 });
    const stops = screen
      .getAllByRole("button")
      .filter((el) => el.getAttribute("tabindex") === "0");
    expect(stops).toHaveLength(1);
    expect(stops[0]!.getAttribute("data-index")).toBe("4");
  });

  it("only re-renders the two cells the cursor moved between - invariant #4", () => {
    // The point of the whole Uint8Array board shape. If memo breaks, this reads 9
    // instead of 2 - and nothing else in the suite would ever notice.
    const { rerender } = view({ cursor: 0 });
    const board = boardFrom(["*..", ".o.", "..."]);

    cellRenderCount.value = 0;
    rerender(
      <Board
        board={board}
        status="playing"
        explodedIndex={null}
        cursor={1}
        onAct={noop}
        onKeyDown={noop}
      />,
    );
    expect(cellRenderCount.value).toBe(2);
  });

  it("re-renders nothing when given the same props again", () => {
    const board = boardFrom(["*..", ".o.", "..."]);
    const props = {
      board,
      status: "playing" as const,
      explodedIndex: null,
      cursor: 0,
      onAct: noop,
      onKeyDown: noop,
    };
    const { rerender } = render(<Board {...props} />);
    cellRenderCount.value = 0;
    rerender(<Board {...props} />);
    expect(cellRenderCount.value).toBe(0);
  });

  it("marks a wrong flag only once the game is lost", () => {
    const board = boardFrom(["f*.", "...", "..."]);
    const { rerender } = render(
      <Board
        board={board}
        status="playing"
        explodedIndex={null}
        cursor={0}
        onAct={noop}
        onKeyDown={noop}
      />,
    );
    expect(screen.getByTestId("cell-0").getAttribute("aria-label")).toContain("đã cắm cờ");

    rerender(
      <Board
        board={board}
        status="lost"
        explodedIndex={1}
        cursor={0}
        onAct={noop}
        onKeyDown={noop}
      />,
    );
    expect(screen.getByTestId("cell-0").getAttribute("aria-label")).toContain("cờ cắm sai");
  });

  it("passes keyboard events up to the page", () => {
    const onKeyDown = vi.fn();
    view({ onKeyDown });
    screen.getByRole("grid").dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(onKeyDown).toHaveBeenCalled();
  });
});
