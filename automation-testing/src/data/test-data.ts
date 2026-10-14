// Constants and generators for test input. No .env, no network: values only.

// A fixed board: ?seed= makes the mine layout reproducible (README "Nothing to install" — `?seed=`).
export const SEED = 20260903;

// Touch gesture timings, copied from ../client/src/game/input/touchGesture.ts (ENGAGE_MS, FLAG_MS).
// The aim chip shows after ENGAGE_MS of a still finger; a hold of FLAG_MS flags without lifting.
export const ENGAGE_MS = 120;
export const FLAG_MS = 500;
