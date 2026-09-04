"use client";

import { useCallback, useEffect, useRef } from "react";
import { createAudioContext, playExplosion } from "@/game/audio/explosion";

/**
 * Sound is off by default (ADR-0008), so the AudioContext is built the first time it
 * is actually needed - not on mount. A context held open for a feature most players
 * never switch on is pure waste, and browsers suspend one created without a gesture
 * anyway.
 */
export function useSound(enabled: boolean) {
  const context = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      void context.current?.close();
      context.current = null;
    };
  }, []);

  return useCallback(() => {
    if (!enabled) return;
    context.current ??= createAudioContext();
    const ctx = context.current;
    if (!ctx) return;
    // A tab that was backgrounded comes back suspended; resume is a promise nobody
    // needs to wait on, because a sound that arrives late is better than a throw.
    if (ctx.state === "suspended") void ctx.resume();
    playExplosion(ctx);
  }, [enabled]);
}
