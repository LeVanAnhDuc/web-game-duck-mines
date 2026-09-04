import type { Difficulty } from "@/game/core/types";

export type ThemeChoice = "system" | "light" | "dark";

export type Settings = {
  difficulty: Difficulty;
  /** whether the mark cycle includes a question mark between flag and empty */
  allowUnsure: boolean;
  theme: ThemeChoice;
  /** the explosion sound. Off unless asked for - ADR-0008. */
  sound: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  difficulty: "beginner",
  allowUnsure: false,
  theme: "system",
  sound: false,
};
