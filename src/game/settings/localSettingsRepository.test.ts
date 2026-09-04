import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadSettings, saveSettings } from "./localSettingsRepository";
import { DEFAULT_SETTINGS, type Settings } from "./types";

const SETTINGS_KEY = "minesweeper.settings.v1";

const realStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

function useStorage(stub: Partial<Storage>): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => stub as Storage,
  });
}

function restoreStorage(): void {
  if (realStorage) Object.defineProperty(globalThis, "localStorage", realStorage);
}

function store(value: unknown): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
}

beforeEach(() => {
  restoreStorage();
  localStorage.clear();
});

afterEach(() => {
  restoreStorage();
});

describe("loadSettings", () => {
  it("returns the defaults when nothing has ever been saved", () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("defaults sound to off - ADR-0008", () => {
    expect(loadSettings().sound).toBe(false);
  });

  it("returns a fresh object, so mutating it cannot corrupt the defaults", () => {
    const loaded = loadSettings();
    loaded.difficulty = "expert";
    expect(DEFAULT_SETTINGS.difficulty).toBe("beginner");
  });

  it("returns the defaults when the stored value is not valid JSON", () => {
    localStorage.setItem(SETTINGS_KEY, "{ half a settings obj");
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("returns the defaults when the stored value is not an object at all", () => {
    store("expert");
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("returns the defaults when the stored value is an array", () => {
    store(["expert"]);
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("fills in only the fields a partial object is missing", () => {
    store({ difficulty: "expert", sound: true });
    expect(loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      difficulty: "expert",
      sound: true,
    });
  });

  it("defaults an unknown difficulty while keeping the other valid fields", () => {
    store({ difficulty: "impossible", allowUnsure: true, theme: "dark", sound: true });
    expect(loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      difficulty: "beginner",
      allowUnsure: true,
      theme: "dark",
      sound: true,
    });
  });

  it("defaults a theme of the wrong type while keeping the other valid fields", () => {
    store({ difficulty: "intermediate", allowUnsure: true, theme: 42, sound: true });
    expect(loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      difficulty: "intermediate",
      allowUnsure: true,
      theme: "system",
      sound: true,
    });
  });

  it('defaults booleans stored as strings - "false" is not a boolean', () => {
    store({ allowUnsure: "true", sound: "false" });
    expect(loadSettings().allowUnsure).toBe(false);
    expect(loadSettings().sound).toBe(false);
  });

  it("ignores fields it does not know about", () => {
    store({ difficulty: "expert", somethingElse: { deep: true } });
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, difficulty: "expert" });
  });

  it("returns the defaults without throwing when reading storage throws", () => {
    useStorage({
      getItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(() => loadSettings()).not.toThrow();
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});

describe("saveSettings", () => {
  it("round-trips every field", () => {
    const settings: Settings = {
      difficulty: "expert",
      allowUnsure: true,
      theme: "dark",
      sound: true,
      useCustom: false,
      custom: { cols: 16, rows: 16, mineCount: 40 },
    };
    expect(saveSettings(settings)).toBe(true);
    expect(loadSettings()).toEqual(settings);
  });

  it("overwrites the previous save rather than merging with it", () => {
    saveSettings({ ...DEFAULT_SETTINGS, difficulty: "expert", sound: true });
    saveSettings({ ...DEFAULT_SETTINGS, difficulty: "intermediate" });
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, difficulty: "intermediate" });
  });

  it("returns false without throwing when writing to storage throws", () => {
    useStorage({
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    expect(saveSettings(DEFAULT_SETTINGS)).toBe(false);
  });
});

describe("loadSettings - the custom board", () => {
  it("brings a stored custom board back inside the limits rather than discarding it", () => {
    // A board saved by a version with different bounds is still a board; the nearest
    // legal one is a better answer than throwing the player back to 16x16.
    store({ ...DEFAULT_SETTINGS, useCustom: true, custom: { cols: 999, rows: 1, mineCount: 0 } });
    const loaded = loadSettings();
    expect(loaded.useCustom).toBe(true);
    expect(loaded.custom.cols).toBe(40);
    expect(loaded.custom.rows).toBe(5);
    expect(loaded.custom.mineCount).toBeGreaterThanOrEqual(1);
  });

  it("falls back to the default board when the stored one is not an object", () => {
    store({ ...DEFAULT_SETTINGS, custom: "wide" });
    expect(loadSettings().custom).toEqual(DEFAULT_SETTINGS.custom);
  });
});
