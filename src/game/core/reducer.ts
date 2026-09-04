import { createBoard, plantMines } from "./board";
import { cycleMark } from "./mark";
import { chord, reveal } from "./reveal";
import { isWon, revealAllMines } from "./rules";
import type { Action, BoardSpec, GameState } from "./types";

export function initialState(spec: BoardSpec): GameState {
  return {
    ranked: spec.ranked,
    board: createBoard(spec),
    status: "idle",
    startedAt: null,
    endedAt: null,
    explodedIndex: null,
  };
}

/**
 * Pure. No Date.now, no Math.random, no DOM - both the timestamp and the seed arrive
 * in the action instead (invariants #1, #3, #5).
 *
 * idle --reveal--> playing --hits a mine--> lost
 *                     `--all safe cells open--> won
 * won/lost --anything but reset--> the SAME state object (invariant #7)
 */
export function reducer(state: GameState, action: Action): GameState {
  if (action.type === "reset") {
    // The whole spec rides on the action rather than being kept from the old state:
    // "new board" and "new board at another size" are the same move, and having two
    // ways to express it is how they drift apart.
    return initialState(action.spec);
  }

  // Once the game is over it is over: no further move, and the clock stops because
  // status is no longer "playing". Returning `state` itself keeps React from
  // re-rendering as well.
  if (state.status === "won" || state.status === "lost") return state;

  if (action.type === "mark") {
    const board = cycleMark(state.board, action.index, action.allowUnsure);
    return board === state.board ? state : { ...state, board };
  }

  if (action.type === "chord") {
    // Nothing to chord against before the first move: there is no number on screen.
    if (state.status !== "playing") return state;
    const result = chord(state.board, action.index);
    return settle(state, result.board, result.exploded, action.at, state.startedAt);
  }

  // action.type === "reveal"
  let board = state.board;
  let startedAt = state.startedAt;
  if (state.status === "idle") {
    board = plantMines(board, action.seed, action.index);
    startedAt = action.at;
  }
  const result = reveal(board, action.index);
  return settle(state, result.board, result.exploded, action.at, startedAt);
}

/**
 * Turns the outcome of a reveal or a chord into the next state: lost, won, or still
 * playing. Kept in one place so the two callers cannot drift apart on when the clock
 * stops or when the mines come out.
 */
function settle(
  state: GameState,
  board: GameState["board"],
  exploded: number | null,
  at: number,
  startedAt: number | null,
): GameState {
  if (exploded !== null) {
    return {
      ...state,
      board: revealAllMines(board),
      status: "lost",
      startedAt,
      endedAt: at,
      explodedIndex: exploded,
    };
  }

  const started = state.status === "idle";
  if (board === state.board && !started) return state;

  if (isWon(board)) {
    return { ...state, board, status: "won", startedAt, endedAt: at, explodedIndex: null };
  }
  return { ...state, board, status: "playing", startedAt, endedAt: null, explodedIndex: null };
}
