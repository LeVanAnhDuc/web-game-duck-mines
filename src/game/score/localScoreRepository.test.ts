import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { localScoreRepository } from "./localScoreRepository";

const RECORDS_KEY = "minesweeper.records.v1";

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
  localStorage.setItem(RECORDS_KEY, JSON.stringify(value));
}

const EMPTY = { beginner: null, intermediate: null, expert: null };

beforeEach(() => {
  restoreStorage();
  localStorage.clear();
});

afterEach(() => {
  restoreStorage();
});

describe("load", () => {
  it("reports every difficulty as never won when nothing has been saved", () => {
    expect(localScoreRepository.load()).toEqual(EMPTY);
  });

  it("returns what saveIfBest stored", () => {
    localScoreRepository.saveIfBest("intermediate", 91);
    expect(localScoreRepository.load()).toEqual({ ...EMPTY, intermediate: 91 });
  });

  it("reports every difficulty as never won when the stored value is corrupt JSON", () => {
    localStorage.setItem(RECORDS_KEY, "{ beginner: 12");
    expect(localScoreRepository.load()).toEqual(EMPTY);
  });

  it("reports every difficulty as never won when the stored value is not an object", () => {
    store(12);
    expect(localScoreRepository.load()).toEqual(EMPTY);
  });

  it("keeps the valid rows of a partly corrupt record and drops the rest", () => {
    store({ beginner: 12, intermediate: "fast", expert: -4 });
    expect(localScoreRepository.load()).toEqual({ ...EMPTY, beginner: 12 });
  });

  it("ignores a key that is not one of the three ranked difficulties - ADR-0007", () => {
    store({ beginner: 12, custom: 3 });
    expect(localScoreRepository.load()).toEqual({ ...EMPTY, beginner: 12 });
  });

  it("reports every difficulty as never won without throwing when reading throws", () => {
    useStorage({
      getItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(() => localScoreRepository.load()).not.toThrow();
    expect(localScoreRepository.load()).toEqual(EMPTY);
  });
});

describe("saveIfBest", () => {
  it("stores the first win on a difficulty and reports it as a new best", () => {
    expect(localScoreRepository.saveIfBest("beginner", 42)).toBe(true);
    expect(localScoreRepository.load().beginner).toBe(42);
  });

  it("stores a faster time and reports it as a new best", () => {
    localScoreRepository.saveIfBest("beginner", 42);
    expect(localScoreRepository.saveIfBest("beginner", 30)).toBe(true);
    expect(localScoreRepository.load().beginner).toBe(30);
  });

  it("refuses an equal time - tying your best is not beating it", () => {
    localScoreRepository.saveIfBest("beginner", 42);
    expect(localScoreRepository.saveIfBest("beginner", 42)).toBe(false);
    expect(localScoreRepository.load().beginner).toBe(42);
  });

  it("refuses a slower time and leaves the stored best alone", () => {
    localScoreRepository.saveIfBest("beginner", 42);
    expect(localScoreRepository.saveIfBest("beginner", 43)).toBe(false);
    expect(localScoreRepository.load().beginner).toBe(42);
  });

  it("refuses NaN, both infinities and a negative time, and stores nothing", () => {
    for (const seconds of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      -1,
    ]) {
      expect(localScoreRepository.saveIfBest("beginner", seconds)).toBe(false);
    }
    expect(localScoreRepository.load()).toEqual(EMPTY);
  });

  it("leaves the other difficulties untouched", () => {
    localScoreRepository.saveIfBest("beginner", 42);
    localScoreRepository.saveIfBest("expert", 300);
    expect(localScoreRepository.load()).toEqual({
      beginner: 42,
      intermediate: null,
      expert: 300,
    });
  });

  it("compares against the stored best per difficulty, not across them", () => {
    localScoreRepository.saveIfBest("beginner", 42);
    expect(localScoreRepository.saveIfBest("expert", 300)).toBe(true);
  });

  it("reports false without throwing when writing to storage throws", () => {
    useStorage({
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    expect(localScoreRepository.saveIfBest("beginner", 42)).toBe(false);
  });
});

describe("clear", () => {
  it("empties every difficulty", () => {
    localScoreRepository.saveIfBest("beginner", 42);
    localScoreRepository.saveIfBest("intermediate", 91);
    localScoreRepository.saveIfBest("expert", 300);
    localScoreRepository.clear();
    expect(localScoreRepository.load()).toEqual(EMPTY);
  });

  it("does not throw when storage is unavailable", () => {
    useStorage({
      removeItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(() => localScoreRepository.clear()).not.toThrow();
  });
});
