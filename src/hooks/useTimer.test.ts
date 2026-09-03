import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatElapsed, useTimer } from "./useTimer";

const T0 = 1_700_000_000_000;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T0);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTimer", () => {
  it("sits at zero before the first move", () => {
    const { result } = renderHook(() => useTimer(null, null, "idle"));
    expect(result.current).toBe(0);
  });

  it("counts up while the game is being played", () => {
    const { result, rerender } = renderHook(() => useTimer(T0, null, "playing"));
    act(() => {
      vi.advanceTimersByTime(65_000);
    });
    rerender();
    expect(result.current).toBe(65);
  });

  it("stops the moment the game ends and reports the frozen span", () => {
    const { result } = renderHook(() => useTimer(T0, T0 + 41_000, "won"));
    act(() => {
      vi.advanceTimersByTime(50_000);
    });
    expect(result.current).toBe(41);
  });

  it("survives a throttled background tab, because it subtracts two instants", () => {
    // A tick counter would run slow here and records would be settable by switching
    // tabs. ADR-0005 is the reason this passes.
    const { result, rerender } = renderHook(() => useTimer(T0, null, "playing"));
    act(() => {
      // the wall clock jumped five minutes while setInterval barely fired: exactly
      // what a throttled background tab looks like
      vi.setSystemTime(T0 + 300_000);
    });
    rerender();
    expect(result.current).toBe(300);
  });
});

describe("formatElapsed", () => {
  it("reads m:ss", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(7)).toBe("0:07");
    expect(formatElapsed(65)).toBe("1:05");
    expect(formatElapsed(600)).toBe("10:00");
  });

  it("does not stop at 999 - that was a three-digit LED, not a rule", () => {
    expect(formatElapsed(3661)).toBe("61:01");
  });
});
