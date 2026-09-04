"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { initialState, reducer } from "@/game/core/reducer";
import type { ActKind, Difficulty } from "@/game/core/types";

/**
 * The only place with side effects: it supplies Date.now and the seed, which the
 * reducer may not reach for itself (invariants #1, #5).
 */
export function useGame(difficulty: Difficulty, allowUnsure: boolean) {
  const [state, dispatch] = useReducer(reducer, difficulty, initialState);

  // Bumped on every new board so two boards in a row are never the same one.
  const round = useRef(0);

  /**
   * ?seed= is not a test-only back door: it stays on, and the side effect is that
   * two people can play the same board (design.md section 8). It is read at the
   * moment of the first click rather than on mount, so there is no window in which
   * the seed is still being settled.
   */
  const nextSeed = useCallback(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("seed");
    const parsed = fromUrl === null ? Number.NaN : Number.parseInt(fromUrl, 10);
    if (Number.isFinite(parsed)) return (parsed + round.current) >>> 0;
    return (Date.now() ^ 0x9e3779b9 ^ (round.current * 0x85ebca6b)) >>> 0;
  }, []);

  const act = useCallback(
    (index: number, kind: ActKind) => {
      if (kind === "mark") {
        dispatch({ type: "mark", index, allowUnsure });
        return;
      }
      if (kind === "chord") {
        dispatch({ type: "chord", index, at: Date.now() });
        return;
      }
      dispatch({ type: "reveal", index, at: Date.now(), seed: nextSeed() });
    },
    [allowUnsure, nextSeed],
  );

  const reset = useCallback(
    (next: Difficulty = difficulty) => {
      round.current += 1;
      dispatch({ type: "reset", difficulty: next });
    },
    [difficulty],
  );

  // Changing difficulty IS starting a new board - there is no such thing as the same
  // board at another size. It runs on mount too, which costs an untouched board.
  useEffect(() => {
    round.current += 1;
    dispatch({ type: "reset", difficulty });
  }, [difficulty]);

  return { state, act, reset };
}
