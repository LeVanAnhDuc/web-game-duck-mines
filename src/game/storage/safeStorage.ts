/**
 * The only place in the project that touches `localStorage`. Nothing above this
 * file may ever see a throw come out of storage.
 *
 * Reaching for `localStorage` is itself the dangerous part, not just parsing what
 * comes back: a private window, a browser configured to block site data, or a full
 * quota all make the property access throw. So every entry point re-reads the
 * property inside a try rather than caching a reference at module load - the answer
 * can change between two calls, and a cached reference captured at import time
 * would throw during import instead, taking the whole bundle down.
 *
 * NFR-REL-03: with storage gone the game stays fully playable and only saving is
 * lost, which is why the failure signal is a boolean and never an exception.
 */

const PROBE_KEY = "minesweeper.__probe";

function getStore(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Writes and deletes a throwaway key. A read-only check is not enough: over quota
 * reads keep working and only writes fail, and saving is the thing callers care about.
 */
export function isAvailable(): boolean {
  const store = getStore();
  if (!store) return false;
  try {
    store.setItem(PROBE_KEY, "1");
    store.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const store = getStore();
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    // a literal stored `null` carries no more information than a missing key, and
    // handing it back as T would be a lie the caller has no way to type-check
    if (parsed === null) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/** False when the value could not be persisted, for any reason at all. */
export function writeJson(key: string, value: unknown): boolean {
  const store = getStore();
  if (!store) return false;
  try {
    const raw = JSON.stringify(value);
    // stringify returns undefined for undefined, a function or a symbol; storing
    // that would write the string "undefined" and poison the next read
    if (raw === undefined) return false;
    store.setItem(key, raw);
    return true;
  } catch {
    return false;
  }
}

/** Silent on failure: a caller that cannot delete a key has no recovery to run. */
export function remove(key: string): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // intentionally ignored
  }
}
