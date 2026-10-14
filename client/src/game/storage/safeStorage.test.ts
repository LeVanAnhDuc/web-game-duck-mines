import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAvailable, readJson, remove, writeJson } from "./safeStorage";

const realStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");

/** Swaps in a stand-in whose methods can throw the way a real browser's does. */
function useStorage(stub: Partial<Storage>): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => stub as Storage,
  });
}

/** A browser with site data blocked throws on the property access itself. */
function useBlockedStorage(): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("access to storage is denied");
    },
  });
}

function restoreStorage(): void {
  if (realStorage) Object.defineProperty(globalThis, "localStorage", realStorage);
}

beforeEach(() => {
  restoreStorage();
  localStorage.clear();
});

afterEach(() => {
  restoreStorage();
});

describe("isAvailable", () => {
  it("is true when localStorage accepts a write", () => {
    expect(isAvailable()).toBe(true);
  });

  it("leaves no probe key behind", () => {
    isAvailable();
    expect(localStorage.length).toBe(0);
  });

  it("is false when reaching for localStorage throws", () => {
    useBlockedStorage();
    expect(isAvailable()).toBe(false);
  });

  it("is false when reads work but writes are over quota", () => {
    useStorage({
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => undefined,
    });
    expect(isAvailable()).toBe(false);
  });
});

describe("readJson", () => {
  it("returns what writeJson stored", () => {
    writeJson("k", { a: 1, b: ["x"] });
    expect(readJson("k", null)).toEqual({ a: 1, b: ["x"] });
  });

  it("returns the fallback when the key was never written", () => {
    expect(readJson("missing", "fallback")).toBe("fallback");
  });

  it("returns the fallback when the stored value is not valid JSON", () => {
    localStorage.setItem("k", "{not json at all");
    expect(readJson("k", "fallback")).toBe("fallback");
  });

  it("returns the fallback when the stored value is a literal null", () => {
    localStorage.setItem("k", "null");
    expect(readJson("k", "fallback")).toBe("fallback");
  });

  it("returns the fallback when getItem throws", () => {
    useStorage({
      getItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(readJson("k", "fallback")).toBe("fallback");
  });

  it("returns the fallback when reaching for localStorage throws", () => {
    useBlockedStorage();
    expect(readJson("k", "fallback")).toBe("fallback");
  });
});

describe("writeJson", () => {
  it("returns true and persists the value", () => {
    expect(writeJson("k", { a: 1 })).toBe(true);
    expect(localStorage.getItem("k")).toBe('{"a":1}');
  });

  it("returns false when setItem throws", () => {
    useStorage({
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    expect(writeJson("k", { a: 1 })).toBe(false);
  });

  it("returns false when reaching for localStorage throws", () => {
    useBlockedStorage();
    expect(writeJson("k", { a: 1 })).toBe(false);
  });

  it("returns false rather than throwing on a value JSON cannot represent", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(writeJson("k", circular)).toBe(false);
  });

  it('returns false rather than storing the string "undefined"', () => {
    expect(writeJson("k", undefined)).toBe(false);
    expect(localStorage.getItem("k")).toBeNull();
  });
});

describe("remove", () => {
  it("deletes the key", () => {
    writeJson("k", 1);
    remove("k");
    expect(localStorage.getItem("k")).toBeNull();
  });

  it("does not throw when removeItem throws", () => {
    useStorage({
      removeItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(() => remove("k")).not.toThrow();
  });

  it("does not throw when reaching for localStorage throws", () => {
    useBlockedStorage();
    expect(() => remove("k")).not.toThrow();
  });
});
