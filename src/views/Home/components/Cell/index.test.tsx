import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FLAGGED, HIDDEN, REVEALED, UNSURE, type Mark } from "@/game/core/types";
import { Cell, type CellProps } from "./index";

function draw(overrides: Partial<CellProps> = {}) {
  const onAct = vi.fn();
  const props: CellProps = {
    index: 12,
    row: 2,
    col: 3,
    mark: HIDDEN as Mark,
    adj: 0,
    isMine: false,
    exploded: false,
    wrongFlag: false,
    focused: false,
    aimed: false,
    onAct,
    ...overrides,
  };
  // scoped to this render, not `screen`: a couple of tests draw two cells and
  // compare them, and `screen` spans every container still mounted
  const { container } = render(<Cell {...props} />);
  const el = container.querySelector<HTMLElement>('[data-testid="cell-12"]')!;
  return { onAct, el };
}

/** RTL has no fireEvent.auxClick, so the middle button is dispatched by hand. */
function auxClick(el: HTMLElement, button: number) {
  el.dispatchEvent(new MouseEvent("auxclick", { button, bubbles: true, cancelable: true }));
}

describe("Cell drawing", () => {
  it("a hidden cell is a bordered tile and says so", () => {
    const { el } = draw();
    expect(el.className).toContain("ms-cell--tile");
    expect(el.className).not.toContain("ms-cell--open");
    expect(el.getAttribute("aria-label")).toBe("hàng 3, cột 4, chưa mở");
  });

  it("a revealed number is flat, carries its heat colour and reads out the count", () => {
    const { el } = draw({ mark: REVEALED as Mark, adj: 3 });
    expect(el.className).toContain("ms-cell--open");
    expect(el.className).toContain("ms-num-3");
    expect(el.textContent).toBe("3");
    expect(el.getAttribute("aria-label")).toBe("hàng 3, cột 4, 3 mìn xung quanh");
  });

  it("a revealed empty cell shows nothing and still reads out its position", () => {
    const { el } = draw({ mark: REVEALED as Mark, adj: 0 });
    expect(el.textContent).toBe("");
    expect(el.getAttribute("aria-label")).toBe("hàng 3, cột 4, trống");
  });

  it("a flag is an svg, never an emoji", () => {
    const { el } = draw({ mark: FLAGGED as Mark });
    expect(el.querySelectorAll("svg")).toHaveLength(1);
    expect(el.textContent).toBe("");
    expect(el.getAttribute("aria-label")).toBe("hàng 3, cột 4, đã cắm cờ");
  });

  it("a wrong flag adds the slash as a third path, inside the same svg", () => {
    const right = draw({ mark: FLAGGED as Mark });
    const wrong = draw({ mark: FLAGGED as Mark, wrongFlag: true, index: 12 });
    expect(right.el.querySelectorAll("path")).toHaveLength(2);
    expect(wrong.el.querySelectorAll("path")).toHaveLength(3);
    expect(wrong.el.getAttribute("aria-label")).toBe("hàng 3, cột 4, cờ cắm sai");
  });

  it("the exploded cell is the loudest thing on the board", () => {
    const { el } = draw({ mark: REVEALED as Mark, isMine: true, exploded: true });
    expect(el.className).toContain("ms-cell--boom");
    expect(el.getAttribute("aria-label")).toBe("hàng 3, cột 4, mìn đã nổ");
  });

  it("a question mark is a character, not an icon", () => {
    const { el } = draw({ mark: UNSURE as Mark });
    expect(el.textContent).toBe("?");
    expect(el.querySelectorAll("svg")).toHaveLength(0);
  });
});

describe("Cell input - the mouse path", () => {
  it("left click on a closed cell reveals", () => {
    const { onAct, el } = draw();
    fireEvent.click(el);
    expect(onAct).toHaveBeenCalledWith(12, "reveal");
  });

  it("left click on an OPEN number chords - the same gesture touch will use", () => {
    const { onAct, el } = draw({ mark: REVEALED as Mark, adj: 2 });
    fireEvent.click(el);
    expect(onAct).toHaveBeenCalledWith(12, "chord");
  });

  it("right click flags and suppresses the browser menu", () => {
    const { onAct, el } = draw();
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    expect(onAct).toHaveBeenCalledWith(12, "mark");
    expect(event.defaultPrevented).toBe(true);
  });

  it("middle click chords", () => {
    const { onAct, el } = draw({ mark: REVEALED as Mark, adj: 2 });
    auxClick(el, 1);
    expect(onAct).toHaveBeenCalledWith(12, "chord");
  });

  it("ignores a right-button auxclick, which the contextmenu handler already owns", () => {
    const { onAct, el } = draw();
    auxClick(el, 2);
    expect(onAct).not.toHaveBeenCalled();
  });
});

describe("Cell focus", () => {
  it("only the focused cell is a tab stop", () => {
    expect(draw({ focused: true }).el.getAttribute("tabindex")).toBe("0");
    expect(draw({ focused: false, index: 12 }).el.getAttribute("tabindex")).toBe("-1");
  });
});
