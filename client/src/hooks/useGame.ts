"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { initialState, reducer } from "@/game/core/reducer";
import type { ActKind, BoardSpec } from "@/game/core/types";

/**
 * The only place with side effects: it supplies Date.now and the seed, which the
 * reducer may not reach for itself (invariants #1, #5).
 */
export function useGame(spec: BoardSpec, allowUnsure: boolean) {
  const [state, dispatch] = useReducer(reducer, spec, initialState);

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

  const reset = useCallback(() => {
    round.current += 1;
    dispatch({ type: "reset", spec });
  }, [spec]);

  // Changing the board IS starting a new one - there is no such thing as the same
  // board at another size. The spec is compared by value, not by identity, so a
  // re-render that rebuilds an equal object does not throw the board away.
  const signature = `${spec.cols}x${spec.rows}x${spec.mineCount}:${spec.ranked ?? ""}`;
  useEffect(() => {
    round.current += 1;
    dispatch({ type: "reset", spec });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return { state, act, reset };
}
