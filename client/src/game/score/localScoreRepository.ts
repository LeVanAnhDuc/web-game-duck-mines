import { readJson, remove, writeJson } from "@/game/storage/safeStorage";
import type { Difficulty } from "@/game/core/types";
import type { BestTimes, ScoreRepository } from "./ScoreRepository";

const RECORDS_KEY = "minesweeper.records.v1";

/** A record, not an array, so a new `Difficulty` member breaks the typecheck here. */
const RANKED: Record<Difficulty, true> = {
  beginner: true,
  intermediate: true,
  expert: true,
};

const RANKED_DIFFICULTIES = Object.keys(RANKED) as Difficulty[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Rejects NaN, both infinities and negative times - none of them is a real game. */
function isTime(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function emptyBestTimes(): BestTimes {
  const times = {} as BestTimes;
  for (const difficulty of RANKED_DIFFICULTIES) times[difficulty] = null;
  return times;
}

/**
 * Reads every difficulty independently. A record hand-edited to `"expert": "fast"`
 * costs the player that one row, not the other two - the same field-by-field rule
 * the settings repository follows.
 */
function load(): BestTimes {
  const times = emptyBestTimes();
  const stored = readJson<unknown>(RECORDS_KEY, null);
  if (!isRecord(stored)) return times;
  for (const difficulty of RANKED_DIFFICULTIES) {
    const value = stored[difficulty];
    if (isTime(value)) times[difficulty] = value;
  }
  return times;
}

/**
 * Strictly better, so an equal time is not a new record: a player who ties their own
 * best has not beaten it, and returning true there would make the UI congratulate
 * them for standing still.
 *
 * Returns false when the write itself failed, because "it became the new best" is a
 * claim about what is stored, not about what was compared (NFR-REL-03).
 */
function saveIfBest(difficulty: Difficulty, seconds: number): boolean {
  if (!isTime(seconds)) return false;
  const times = load();
  const best = times[difficulty];
  if (best !== null && seconds >= best) return false;
  return writeJson(RECORDS_KEY, { ...times, [difficulty]: seconds });
}

function clear(): void {
  remove(RECORDS_KEY);
}

export const localScoreRepository: ScoreRepository = { load, saveIfBest, clear };
