import type { ActKind } from "@/game/core/types";

/**
 * The touch gesture, as a pure state machine. No DOM, no React, no timers of its
 * own - the caller feeds it events and a clock, exactly as the reducer takes its
 * timestamps from the outside.
 *
 * The problem it solves: on a phone, dragging has to mean BOTH "pan the board" and
 * "move my aim", and the two cannot both win. The split is by intent, measured
 * rather than guessed:
 *
 *   lift within ENGAGE_MS, barely moved   -> a tap. Act immediately.
 *   moved past SLOP_PX before ENGAGE_MS   -> a pan. The browser keeps it; we act on
 *                                            nothing at all.
 *   still held at ENGAGE_MS               -> aiming. Sliding now retargets, and the
 *                                            board stops panning until the lift.
 *   still held at FLAG_MS                 -> a flag, committed without a lift.
 *
 * That ordering is what lets a quick tap stay quick while a deliberate hold gets the
 * two-phase aim that ADR-0004 promises - the aim exists so a mis-tap can be corrected
 * BEFORE it becomes a move, which is the whole reason cells are allowed to be smaller
 * than the 44px in NFR-A11Y-03.
 */

/** How long a finger must stay down before sliding retargets instead of panning. */
export const ENGAGE_MS = 120;

/** How long before a hold becomes a flag, without waiting for the lift. */
export const FLAG_MS = 500;

/** Movement below this is a still finger, not a drag. */
export const SLOP_PX = 10;

export type Phase = "idle" | "pending" | "aiming" | "spent";

export type GestureState = {
  phase: Phase;
  /** the cell the finger is over, or null when it has left the board */
  index: number | null;
  startX: number;
  startY: number;
  startedAt: number;
};

export type Point = { x: number; y: number; index: number | null; time: number };

export type GestureEvent =
  | { type: "down"; at: Point }
  | { type: "move"; at: Point }
  | { type: "up"; at: Point }
  | { type: "cancel" }
  /** the caller's clock, so the machine never owns a timer */
  | { type: "tick"; time: number };

export type GestureAction =
  | { type: "commit"; index: number; kind: ActKind }
  /** vibrate, if the device can - a flag that fires without a lift needs to say so */
  | { type: "haptic" };

export type GestureResult = {
  state: GestureState;
  actions: GestureAction[];
};

export const IDLE: GestureState = {
  phase: "idle",
  index: null,
  startX: 0,
  startY: 0,
  startedAt: 0,
};

/** "Sticky mode" on the bottom bar: what a plain tap means. */
export type TapMode = "reveal" | "flag";

export type GestureConfig = {
  mode: TapMode;
  /** true when the cell under the finger is already open, so a tap is a chord */
  isOpen: (index: number) => boolean;
};

function moved(state: GestureState, at: Point): boolean {
  return Math.abs(at.x - state.startX) > SLOP_PX || Math.abs(at.y - state.startY) > SLOP_PX;
}

function tapKind(index: number, config: GestureConfig): ActKind {
  if (config.mode === "flag") return "mark";
  // An open number under the finger means chord - the same gesture the mouse uses on
  // an open cell, so the two input paths agree on what a tap there means.
  return config.isOpen(index) ? "chord" : "reveal";
}

export function gestureReducer(
  state: GestureState,
  event: GestureEvent,
  config: GestureConfig,
): GestureResult {
  const none = { state, actions: [] as GestureAction[] };

  switch (event.type) {
    case "down":
      return {
        state: {
          phase: "pending",
          index: event.at.index,
          startX: event.at.x,
          startY: event.at.y,
          startedAt: event.at.time,
        },
        actions: [],
      };

    case "move": {
      if (state.phase === "pending") {
        // A drag that starts before the finger has settled belongs to the browser:
        // it is a pan, and the gesture ends having done nothing.
        if (moved(state, event.at)) return { state: IDLE, actions: [] };
        return none;
      }
      if (state.phase === "aiming") {
        if (event.at.index === state.index) return none;
        return { state: { ...state, index: event.at.index }, actions: [] };
      }
      return none;
    }

    case "tick": {
      if (state.phase === "pending" && event.time - state.startedAt >= ENGAGE_MS) {
        return { state: { ...state, phase: "aiming" }, actions: [] };
      }
      if (state.phase === "aiming" && event.time - state.startedAt >= FLAG_MS) {
        // A long press flags whatever is under the finger and ends the gesture -
        // the lift must not then also open the cell.
        if (state.index === null) return { state: IDLE, actions: [] };
        return {
          state: { ...state, phase: "spent" },
          actions: [{ type: "commit", index: state.index, kind: "mark" }, { type: "haptic" }],
        };
      }
      return none;
    }

    case "up": {
      // Lifting off the board is how a mis-aim is thrown away. This is the escape
      // hatch the two-phase design is built around.
      if (state.phase === "spent" || event.at.index === null) {
        return { state: IDLE, actions: [] };
      }
      if (state.phase === "pending") {
        // Never engaged: a quick tap. It acts on where it started, not on where it
        // ended, so a shaky finger does not change the target.
        if (state.index === null || moved(state, event.at)) return { state: IDLE, actions: [] };
        return {
          state: IDLE,
          actions: [{ type: "commit", index: state.index, kind: tapKind(state.index, config) }],
        };
      }
      if (state.phase === "aiming" && state.index !== null) {
        return {
          state: IDLE,
          actions: [{ type: "commit", index: state.index, kind: tapKind(state.index, config) }],
        };
      }
      return { state: IDLE, actions: [] };
    }

    case "cancel":
      // The browser took the gesture for a scroll, or the pointer was lost. Either
      // way nothing is committed - a pan must never cost the player a cell.
      return { state: IDLE, actions: [] };

    default:
      return none;
  }
}

/** True while the board should stop panning and let the finger retarget instead. */
export function isAiming(state: GestureState): boolean {
  return state.phase === "aiming";
}
