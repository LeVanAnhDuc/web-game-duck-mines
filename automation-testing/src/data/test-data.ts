// Constants and generators for test input. No .env, no network: values only.

// A fixed board: ?seed= makes the mine layout reproducible (README "Nothing to install" — `?seed=`).
export const SEED = 20260903;

// Touch gesture timings, copied from ../client/src/game/input/touchGesture.ts (ENGAGE_MS, FLAG_MS).
// The aim chip shows after ENGAGE_MS of a still finger; a hold of FLAG_MS flags without lifting.
export const ENGAGE_MS = 120;
export const FLAG_MS = 500;

// localStorage keys the game owns: ../client/src/game/score/localScoreRepository.ts (RECORDS_KEY) and
// ../client/src/game/settings/localSettingsRepository.ts (SETTINGS_KEY). Records are whole seconds per difficulty.
export const STORAGE = {
  records: "minesweeper.records.v1",
  settings: "minesweeper.settings.v1",
} as const;
