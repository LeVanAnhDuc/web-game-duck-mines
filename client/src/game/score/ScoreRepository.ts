import type { Difficulty } from "@/game/core/types";

/** Best time in seconds per difficulty; null means the difficulty has never been won. */
export type BestTimes = Record<Difficulty, number | null>;

/**
 * An interface rather than a bare module so the storage behind records can be
 * swapped later without touching the caller.
 *
 * It takes a `Difficulty` and nothing else on purpose: custom boards are playable
 * but never ranked (ADR-0007), so there is deliberately no key a custom board could
 * be filed under.
 */
export interface ScoreRepository {
  load(): BestTimes;
  /** True only when the time was stored as the new best. */
  saveIfBest(difficulty: Difficulty, seconds: number): boolean;
  clear(): void;
}
