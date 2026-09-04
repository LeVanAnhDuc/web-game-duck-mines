import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { presetSpec } from "./constants";
import { initialState } from "./reducer";

/**
 * The three invariants nothing else can catch. Violating any of them leaves the code
 * running and the tests green, so they are turned into tests here rather than left
 * to a code reviewer's memory. See docs/03-design/invariants.md.
 */

const CORE_DIR = dirname(fileURLToPath(import.meta.url));

const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  { pattern: /from\s+["']react["']/, why: "invariant #1: core/ must not import React" },
  { pattern: /from\s+["']next/, why: "invariant #1: core/ must not import next" },
  { pattern: /\bDate\.now\b/, why: "invariant #1: the timestamp arrives in the action" },
  { pattern: /\bMath\.random\b/, why: "invariant #5: all randomness goes through rng.ts" },
  { pattern: /\bdocument\./, why: "invariant #1: core/ must not touch the DOM" },
  { pattern: /\bwindow\./, why: "invariant #1: core/ must not touch the DOM" },
];

function sourceFiles(): string[] {
  return readdirSync(CORE_DIR)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => !f.endsWith(".test.ts"))
    .filter((f) => f !== "testBoard.ts");
}

/**
 * Comments have to come off first. The rule is about what the code DOES, and these
 * files explain in prose why they never call Date.now - which would otherwise trip
 * the check on the very comment documenting the rule.
 */
function codeOnly(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

describe("src/game/core stays framework-free", () => {
  it("has source files to check (a passing test over zero files proves nothing)", () => {
    expect(sourceFiles().length).toBeGreaterThanOrEqual(7);
  });

  it.each(sourceFiles())("%s does not reach outside core/", (file) => {
    const source = codeOnly(readFileSync(join(CORE_DIR, file), "utf8"));
    for (const { pattern, why } of FORBIDDEN) {
      expect(pattern.test(source), `${file} - ${why}`).toBe(false);
    }
  });
});

describe("the clock is not in GameState - invariant #3", () => {
  it("has no elapsed/seconds/now/tick field", () => {
    // one per second would make a new GameState every second and re-render 480 cells
    // with nothing turning red
    const keys = Object.keys(initialState(presetSpec("beginner")));
    const offenders = keys.filter((k) => /elapsed|seconds|now|tick/i.test(k));
    expect(offenders).toEqual([]);
  });

  it("keeps only the two timestamps it needs", () => {
    const state = initialState(presetSpec("beginner"));
    expect(state.startedAt).toBeNull();
    expect(state.endedAt).toBeNull();
  });
});
