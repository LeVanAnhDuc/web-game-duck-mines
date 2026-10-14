import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBoardCursor } from "./useBoardCursor";

describe("useBoardCursor on a 9x9 board", () => {
  it("starts at the top-left cell", () => {
    const { result } = renderHook(() => useBoardCursor(9, 9));
    expect(result.current.cursor).toBe(0);
  });

  it("moves one cell at a time", () => {
    const { result } = renderHook(() => useBoardCursor(9, 9));
    act(() => result.current.move(1, 0));
    expect(result.current.cursor).toBe(1);
    act(() => result.current.move(0, 1));
    expect(result.current.cursor).toBe(10);
  });

  it("clamps at the edges instead of wrapping", () => {
    // wrapping loses your place on a 30-wide board and nothing on screen explains
    // where the cursor went
    const { result } = renderHook(() => useBoardCursor(9, 9));
    act(() => result.current.move(-1, -1));
    expect(result.current.cursor).toBe(0);

    act(() => result.current.setCursor(80));
    act(() => result.current.move(1, 1));
    expect(result.current.cursor).toBe(80);
  });

  it("does not slide into the next row when running off the right edge", () => {
    const { result } = renderHook(() => useBoardCursor(9, 9));
    act(() => result.current.setCursor(8));
    act(() => result.current.move(1, 0));
    expect(result.current.cursor).toBe(8);
  });

  it("jumps to the ends of the current row", () => {
    const { result } = renderHook(() => useBoardCursor(9, 9));
    act(() => result.current.setCursor(13));
    act(() => result.current.moveToRowEdge("start"));
    expect(result.current.cursor).toBe(9);
    act(() => result.current.moveToRowEdge("end"));
    expect(result.current.cursor).toBe(17);
  });
});

describe("useBoardCursor on the expert board", () => {
  it("handles a non-square board without mixing up rows and columns", () => {
    const { result } = renderHook(() => useBoardCursor(30, 16));
    act(() => result.current.setCursor(0));
    act(() => result.current.move(0, 1));
    expect(result.current.cursor).toBe(30);
    act(() => result.current.moveToRowEdge("end"));
    expect(result.current.cursor).toBe(59);
  });
});
