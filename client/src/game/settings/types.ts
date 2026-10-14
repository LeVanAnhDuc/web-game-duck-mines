import type { DifficultySpec } from "@/game/core/constants";
import { DEFAULT_CUSTOM } from "@/game/core/custom";
import type { Difficulty } from "@/game/core/types";

export type ThemeChoice = "system" | "light" | "dark";

export type Settings = {
  /** which preset is selected. Still meaningful while a custom board is in play:
   * it is the row the record table highlights and the board `useCustom` toggles
   * back to. */
  difficulty: Difficulty;
  /** the board the player built. Never ranked - ADR-0007. */
  custom: DifficultySpec;
  useCustom: boolean;
  /** whether the mark cycle includes a question mark between flag and empty */
  allowUnsure: boolean;
  theme: ThemeChoice;
  /** the explosion sound. Off unless asked for - ADR-0008. */
  sound: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  difficulty: "beginner",
  custom: DEFAULT_CUSTOM,
  useCustom: false,
  allowUnsure: false,
  theme: "system",
  sound: false,
};
