import { describe, expect, it } from "vitest";
import { neighbours } from "./board";
import { initialState, reducer } from "./reducer";
import { isWon } from "./rules";
import { FLAGGED, REVEALED, type GameState } from "./types";

const T0 = 1_700_000_000_000;

function openFirst(seed: number, index: number, at = T0): GameState {
  return reducer(initialState("beginner"), { type: "reveal", index, at, seed });
}

describe("reducer - the first move", () => {
  it("plants the mines, starts the clock and never explodes", () => {
    // 50 seeds x the centre cell: if first-move safety were wrong this would catch it
    for (let seed = 1; seed <= 50; seed += 1) {
      const state = openFirst(seed, 40);
      expect(state.status).toBe("playing");
      expect(state.board.mines).not.toBeNull();
      expect(state.startedAt).toBe(T0);
      expect(state.endedAt).toBeNull();
      expect(state.explodedIndex).toBeNull();
      expect(state.board.mines![40]).toBe(0);
      for (const j of neighbours(40, 9, 9)) expect(state.board.mines![j]).toBe(0);
    }
  });

  it("always opens a region rather than a lone number", () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const state = openFirst(seed, 40);
      const open = [...state.board.marks].filter((m) => m === REVEALED).length;
      expect(open).toBeGreaterThan(1);
    }
  });

  it("does not start the clock on a flag", () => {
    const state = reducer(initialState("beginner"), {
      type: "mark",
      index: 0,
      allowUnsure: false,
    });
    expect(state.status).toBe("idle");
    expect(state.startedAt).toBeNull();
    expect(state.board.marks[0]).toBe(FLAGGED);
  });

  it("ignores a chord before the first move - there is no number to chord against", () => {
    const start = initialState("beginner");
    expect(reducer(start, { type: "chord", index: 40, at: T0 })).toBe(start);
  });
});

describe("reducer - losing", () => {
  function loseAt(seed: number): GameState {
    let state = openFirst(seed, 40);
    const mines = state.board.mines!;
    const mine = [...mines].findIndex((m) => m === 1);
    state = reducer(state, { type: "reveal", index: mine, at: T0 + 5000, seed: 1 });
    return state;
  }

  it("marks the exploded cell, shows the other mines and stops the clock", () => {
    const state = loseAt(3);
    expect(state.status).toBe("lost");
    expect(state.explodedIndex).not.toBeNull();
    expect(state.endedAt).toBe(T0 + 5000);
    expect(state.board.mines![state.explodedIndex!]).toBe(1);

    const mines = state.board.mines!;
    for (let i = 0; i < mines.length; i += 1) {
      if (mines[i] === 1) expect(state.board.marks[i]).toBe(REVEALED);
    }
  });

  it("freezes: every action but reset returns the SAME state object - invariant #7", () => {
    const lost = loseAt(3);
    expect(reducer(lost, { type: "reveal", index: 0, at: T0 + 9000, seed: 1 })).toBe(lost);
    expect(reducer(lost, { type: "chord", index: 40, at: T0 + 9000 })).toBe(lost);
    expect(reducer(lost, { type: "mark", index: 0, allowUnsure: false })).toBe(lost);
  });
});

describe("reducer - winning", () => {
  it("recognises the win, stops the clock and needs no flags to do it", () => {
    let state = openFirst(11, 40);
    const mines = state.board.mines!;
    // open every safe cell one by one
    for (let i = 0; i < mines.length; i += 1) {
      if (mines[i] === 1) continue;
      if (state.status !== "playing") break;
      state = reducer(state, { type: "reveal", index: i, at: T0 + 1000, seed: 1 });
    }
    expect(state.status).toBe("won");
    expect(isWon(state.board)).toBe(true);
    expect(state.endedAt).toBe(T0 + 1000);
    expect(state.startedAt).toBe(T0);
  });

  it("freezes after the win too", () => {
    let state = openFirst(11, 40);
    const mines = state.board.mines!;
    for (let i = 0; i < mines.length; i += 1) {
      if (mines[i] === 1) continue;
      if (state.status !== "playing") break;
      state = reducer(state, { type: "reveal", index: i, at: T0 + 1000, seed: 1 });
    }
    expect(reducer(state, { type: "mark", index: 0, allowUnsure: false })).toBe(state);
  });
});

describe("reducer - reset", () => {
  it("goes back to idle with an unplanted board", () => {
    const played = openFirst(7, 40);
    const fresh = reducer(played, { type: "reset", difficulty: "beginner" });
    expect(fresh.status).toBe("idle");
    expect(fresh.board.mines).toBeNull();
    expect(fresh.startedAt).toBeNull();
    expect(fresh.endedAt).toBeNull();
    expect(fresh.explodedIndex).toBeNull();
    expect(fresh.difficulty).toBe("beginner");
  });

  it("switches size when the reset asks for another difficulty", () => {
    const played = openFirst(7, 40);
    const bigger = reducer(played, { type: "reset", difficulty: "expert" });
    expect(bigger.difficulty).toBe("expert");
    expect(bigger.board.cols).toBe(30);
    expect(bigger.board.rows).toBe(16);
    expect(bigger.board.mineCount).toBe(99);
    expect(bigger.board.marks).toHaveLength(480);
  });

  it("works from a finished game", () => {
    let state = openFirst(3, 40);
    const mine = [...state.board.mines!].findIndex((m) => m === 1);
    state = reducer(state, { type: "reveal", index: mine, at: T0 + 1, seed: 1 });
    expect(state.status).toBe("lost");
    expect(reducer(state, { type: "reset", difficulty: "beginner" }).status).toBe("idle");
  });
});

describe("reducer - no-ops keep the identity so React can skip the render", () => {
  it("returns the same object when a reveal changes nothing", () => {
    const state = openFirst(7, 40);
    const openIndex = [...state.board.marks].findIndex((m) => m === REVEALED);
    expect(reducer(state, { type: "reveal", index: openIndex, at: T0 + 1, seed: 1 })).toBe(state);
  });

  it("returns the same object when a mark changes nothing", () => {
    const state = openFirst(7, 40);
    const openIndex = [...state.board.marks].findIndex((m) => m === REVEALED);
    expect(reducer(state, { type: "mark", index: openIndex, allowUnsure: false })).toBe(state);
  });
});
