import type { BoardSpec, Difficulty } from "./types";

export type DifficultySpec = {
  cols: number;
  rows: number;
  mineCount: number;
};

/** The original Windows presets, unchanged. Custom boards are a Non-Goal. */
export const DIFFICULTIES: Record<Difficulty, DifficultySpec> = {
  beginner: { cols: 9, rows: 9, mineCount: 10 },
  intermediate: { cols: 16, rows: 16, mineCount: 40 },
  expert: { cols: 30, rows: 16, mineCount: 99 },
};

export const DIFFICULTY_ORDER: Difficulty[] = ["beginner", "intermediate", "expert"];

/** The three presets as board specs: playing one of them counts towards its record. */
export function presetSpec(difficulty: Difficulty): BoardSpec {
  return { ...DIFFICULTIES[difficulty], ranked: difficulty };
}
