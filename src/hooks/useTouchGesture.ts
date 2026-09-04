"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  IDLE,
  gestureReducer,
  isAiming,
  type GestureConfig,
  type GestureEvent,
  type GestureState,
  type TapMode,
} from "@/game/input/touchGesture";
import type { ActKind } from "@/game/core/types";

export type Aim = { index: number; x: number; y: number } | null;

/**
 * Binds the pure gesture machine to real pointer events.
 *
 * Everything decided here is decided in touchGesture.ts; this hook only supplies the
 * three things a pure machine cannot have - the clock, the element under the finger,
 * and the vibration.
 *
 * Mouse pointers are handed straight back: the mouse already has three buttons for
 * three actions and needs none of this. Branching on pointerType rather than on the
 * user agent is ADR-0004 - a 2-in-1 gets both paths in the same session.
 */
export function useTouchGesture(
  mode: TapMode,
  isOpen: (index: number) => boolean,
  onAct: (index: number, kind: ActKind) => void,
) {
  const state = useRef<GestureState>(IDLE);
  const frame = useRef<number | null>(null);
  /**
   * A tap also produces a synthetic click, so the cell's mouse handler would fire
   * on top of whatever the gesture just committed - the classic ghost click. The
   * timestamp of the last touch is what lets the board swallow it.
   */
  const lastTouchEnd = useRef(Number.NEGATIVE_INFINITY);
  const [aim, setAim] = useState<Aim>(null);
  const [aiming, setAiming] = useState(false);

  const config = useRef<GestureConfig>({ mode, isOpen });
  config.current = { mode, isOpen };

  const apply = useCallback(
    (event: GestureEvent) => {
      const result = gestureReducer(state.current, event, config.current);
      state.current = result.state;
      for (const action of result.actions) {
        if (action.type === "commit") onAct(action.index, action.kind);
        // A flag that fires without a lift has no visual cue of its own until the
        // board redraws; the buzz is what tells the finger it happened.
        else if (action.type === "haptic") navigator.vibrate?.(12);
      }
      setAiming(isAiming(result.state));
      if (result.state.phase === "idle") setAim(null);
      else if (result.state.index !== null && isAiming(result.state)) {
        setAim((current) =>
          current && current.index === result.state.index
            ? current
            : { index: result.state.index!, x: current?.x ?? 0, y: current?.y ?? 0 },
        );
      }
    },
    [onAct],
  );

  const stopTicking = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  // The machine owns no timer, so the clock is driven from here. A frame loop rather
  // than two setTimeouts: the deadlines are read from one clock, so they cannot fire
  // out of order after a slow frame.
  const startTicking = useCallback(() => {
    stopTicking();
    const step = () => {
      if (state.current.phase === "idle") {
        frame.current = null;
        return;
      }
      apply({ type: "tick", time: performance.now() });
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, [apply, stopTicking]);

  useEffect(() => stopTicking, [stopTicking]);

  const indexAt = (x: number, y: number): number | null => {
    const element = document.elementFromPoint(x, y);
    const cell = element instanceof Element ? element.closest("[data-index]") : null;
    const raw = cell?.getAttribute("data-index");
    return raw === null || raw === undefined ? null : Number.parseInt(raw, 10);
  };

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") return;
      const index = indexAt(event.clientX, event.clientY);
      if (index === null) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setAim({ index, x: event.clientX, y: event.clientY });
      apply({
        type: "down",
        at: { x: event.clientX, y: event.clientY, index, time: performance.now() },
      });
      startTicking();
    },
    [apply, startTicking],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" || state.current.phase === "idle") return;
      const index = indexAt(event.clientX, event.clientY);
      setAim((current) => (current ? { ...current, x: event.clientX, y: event.clientY } : current));
      apply({
        type: "move",
        at: { x: event.clientX, y: event.clientY, index, time: performance.now() },
      });
    },
    [apply],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" || state.current.phase === "idle") return;
      const index = indexAt(event.clientX, event.clientY);
      apply({
        type: "up",
        at: { x: event.clientX, y: event.clientY, index, time: performance.now() },
      });
      lastTouchEnd.current = performance.now();
      stopTicking();
      setAim(null);
    },
    [apply, stopTicking],
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") return;
      apply({ type: "cancel" });
      lastTouchEnd.current = performance.now();
      stopTicking();
      setAim(null);
    },
    [apply, stopTicking],
  );

  /** Eats the synthetic click a tap leaves behind, so a cell never acts twice. */
  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    // -Infinity, not 0: with 0 the first half-second of the page's life counts as
    // "a touch just ended", and every click in it gets eaten - on a desktop with no
    // touch screen at all.
    if (performance.now() - lastTouchEnd.current > 500) return;
    event.stopPropagation();
    event.preventDefault();
  }, []);

  return {
    aim,
    /** true while the board must stop panning so sliding can retarget instead */
    aiming,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
    },
  };
}
