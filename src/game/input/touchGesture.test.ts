import { describe, expect, it } from "vitest";
import {
  ENGAGE_MS,
  FLAG_MS,
  IDLE,
  SLOP_PX,
  gestureReducer,
  isAiming,
  type GestureAction,
  type GestureConfig,
  type GestureEvent,
  type GestureState,
} from "./touchGesture";

const T0 = 1000;

function config(overrides: Partial<GestureConfig> = {}): GestureConfig {
  return { mode: "reveal", isOpen: () => false, ...overrides };
}

/** Feeds a whole gesture through and collects everything it asked for. */
function run(events: GestureEvent[], cfg = config()) {
  let state: GestureState = IDLE;
  const actions: GestureAction[] = [];
  for (const event of events) {
    const result = gestureReducer(state, event, cfg);
    state = result.state;
    actions.push(...result.actions);
  }
  return { state, actions };
}

const down = (index: number | null, x = 0, y = 0, time = T0): GestureEvent => ({
  type: "down",
  at: { x, y, index, time },
});
const move = (
  index: number | null,
  x: number,
  y: number,
  time: number,
): GestureEvent => ({
  type: "move",
  at: { x, y, index, time },
});
const up = (index: number | null, x = 0, y = 0, time = T0): GestureEvent => ({
  type: "up",
  at: { x, y, index, time },
});
const tick = (time: number): GestureEvent => ({ type: "tick", time });

describe("a quick tap", () => {
  it("acts on lift, without waiting for anything", () => {
    const { actions } = run([down(12), up(12, 0, 0, T0 + 40)]);
    expect(actions).toEqual([{ type: "commit", index: 12, kind: "reveal" }]);
  });

  it("chords when the cell under the finger is already open", () => {
    const { actions } = run(
      [down(12), up(12, 0, 0, T0 + 40)],
      config({ isOpen: () => true }),
    );
    expect(actions).toEqual([{ type: "commit", index: 12, kind: "chord" }]);
  });

  it("flags instead when the sticky mode says flag", () => {
    const { actions } = run([down(12), up(12, 0, 0, T0 + 40)], config({ mode: "flag" }));
    expect(actions).toEqual([{ type: "commit", index: 12, kind: "mark" }]);
  });

  it("still chords an OPEN cell in flag mode - a flag there could never land anyway", () => {
    const { actions } = run(
      [down(12), up(12, 0, 0, T0 + 40)],
      config({ mode: "flag", isOpen: () => true }),
    );
    expect(actions).toEqual([{ type: "commit", index: 12, kind: "chord" }]);
  });

  it("acts on where it STARTED, so a shaky finger cannot change the target", () => {
    const { actions } = run([
      down(12, 100, 100),
      move(13, 100 + SLOP_PX - 2, 100, T0 + 20),
      up(13, 100 + SLOP_PX - 2, 100, T0 + 40),
    ]);
    expect(actions).toEqual([{ type: "commit", index: 12, kind: "reveal" }]);
  });
});

describe("a drag is a pan, and costs nothing", () => {
  it("gives up the gesture as soon as the finger travels", () => {
    const { state, actions } = run([
      down(12, 100, 100),
      move(40, 100 + SLOP_PX + 1, 100, T0 + 30),
      up(40, 200, 100, T0 + 300),
    ]);
    expect(actions).toEqual([]);
    expect(state).toEqual(IDLE);
  });

  it("commits nothing when the browser cancels the pointer for a scroll", () => {
    const { actions } = run([down(12), { type: "cancel" }, up(12, 0, 0, T0 + 300)]);
    expect(actions).toEqual([]);
  });
});

describe("holding engages the aim", () => {
  it("starts aiming once the finger has been still for long enough", () => {
    let state = IDLE;
    state = gestureReducer(state, down(12), config()).state;
    expect(isAiming(state)).toBe(false);
    state = gestureReducer(state, tick(T0 + ENGAGE_MS - 1), config()).state;
    expect(isAiming(state)).toBe(false);
    state = gestureReducer(state, tick(T0 + ENGAGE_MS), config()).state;
    expect(isAiming(state)).toBe(true);
  });

  it("retargets while aiming, and acts on where the finger ENDED", () => {
    const { actions } = run([
      down(12, 100, 100),
      tick(T0 + ENGAGE_MS),
      move(30, 160, 100, T0 + 200),
      move(31, 190, 100, T0 + 250),
      up(31, 190, 100, T0 + 300),
    ]);
    expect(actions).toEqual([{ type: "commit", index: 31, kind: "reveal" }]);
  });

  it("throws the whole thing away when the finger lifts off the board", () => {
    // the escape hatch the two-phase design exists for: a mis-aim is correctable
    // right up until the lift
    const { actions } = run([
      down(12, 100, 100),
      tick(T0 + ENGAGE_MS),
      move(null, 400, 900, T0 + 200),
      up(null, 400, 900, T0 + 260),
    ]);
    expect(actions).toEqual([]);
  });
});

describe("holding longer flags", () => {
  it("flags without waiting for a lift, and says so through the device", () => {
    const { actions } = run([down(12), tick(T0 + ENGAGE_MS), tick(T0 + FLAG_MS)]);
    expect(actions).toEqual([
      { type: "commit", index: 12, kind: "mark" },
      { type: "haptic" },
    ]);
  });

  it("does not then ALSO act on the lift", () => {
    const { actions } = run([
      down(12),
      tick(T0 + ENGAGE_MS),
      tick(T0 + FLAG_MS),
      up(12, 0, 0, T0 + 700),
    ]);
    expect(actions.filter((a) => a.type === "commit")).toHaveLength(1);
  });

  it("flags the cell it ended on, not the one it started on", () => {
    const { actions } = run([
      down(12, 100, 100),
      tick(T0 + ENGAGE_MS),
      move(30, 160, 100, T0 + 200),
      tick(T0 + FLAG_MS),
    ]);
    expect(actions[0]).toEqual({ type: "commit", index: 30, kind: "mark" });
  });

  it("flags nothing when the finger is off the board at the moment it fires", () => {
    const { actions } = run([
      down(12, 100, 100),
      tick(T0 + ENGAGE_MS),
      move(null, 400, 900, T0 + 200),
      tick(T0 + FLAG_MS),
    ]);
    expect(actions).toEqual([]);
  });

  it("still flags in flag mode - holding is not a second toggle", () => {
    const { actions } = run(
      [down(12), tick(T0 + ENGAGE_MS), tick(T0 + FLAG_MS)],
      config({ mode: "flag" }),
    );
    expect(actions[0]).toEqual({ type: "commit", index: 12, kind: "mark" });
  });
});

describe("the machine never gets stuck", () => {
  it("returns to idle after every ending", () => {
    for (const ending of [
      [down(12), up(12, 0, 0, T0 + 40)],
      [down(12), { type: "cancel" } as GestureEvent],
      [down(12), tick(T0 + ENGAGE_MS), tick(T0 + FLAG_MS), up(12, 0, 0, T0 + 700)],
      [down(null), up(null, 0, 0, T0 + 40)],
    ]) {
      expect(run(ending).state.phase).toBe("idle");
    }
  });

  it("ignores a tick that arrives with nothing in flight", () => {
    const result = gestureReducer(IDLE, tick(T0 + 9999), config());
    expect(result.state).toBe(IDLE);
    expect(result.actions).toEqual([]);
  });
});
