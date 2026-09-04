import { readJson, writeJson } from "@/game/storage/safeStorage";
import type { Difficulty } from "@/game/core/types";
import { DEFAULT_SETTINGS, type Settings, type ThemeChoice } from "./types";

const SETTINGS_KEY = "minesweeper.settings.v1";

/**
 * Written as records rather than arrays so that adding a member to `Difficulty` or
 * `ThemeChoice` fails the typecheck here instead of silently letting the new value
 * be rejected as invalid at runtime.
 */
const DIFFICULTIES: Record<Difficulty, true> = {
  beginner: true,
  intermediate: true,
  expert: true,
};

const THEMES: Record<ThemeChoice, true> = {
  system: true,
  light: true,
  dark: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && Object.hasOwn(DIFFICULTIES, value);
}

function isTheme(value: unknown): value is ThemeChoice {
  return typeof value === "string" && Object.hasOwn(THEMES, value);
}

/**
 * Validates FIELD BY FIELD rather than trusting the stored shape. What comes back
 * may have been written by an older version, hand-edited in devtools, or left by a
 * different app on the same origin - none of which is a reason to crash or to throw
 * away the fields that are still good. One bad `theme` costs the player their theme,
 * not their difficulty.
 */
export function loadSettings(): Settings {
  const stored = readJson<unknown>(SETTINGS_KEY, null);
  if (!isRecord(stored)) return { ...DEFAULT_SETTINGS };
  return {
    difficulty: isDifficulty(stored.difficulty)
      ? stored.difficulty
      : DEFAULT_SETTINGS.difficulty,
    allowUnsure:
      typeof stored.allowUnsure === "boolean"
        ? stored.allowUnsure
        : DEFAULT_SETTINGS.allowUnsure,
    theme: isTheme(stored.theme) ? stored.theme : DEFAULT_SETTINGS.theme,
    sound: typeof stored.sound === "boolean" ? stored.sound : DEFAULT_SETTINGS.sound,
  };
}

/** False when the settings could not be persisted. The caller keeps playing anyway. */
export function saveSettings(settings: Settings): boolean {
  return writeJson(SETTINGS_KEY, settings);
}
