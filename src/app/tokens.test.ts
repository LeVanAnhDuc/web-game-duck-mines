import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * NFR-A11Y-01 guards itself from here.
 *
 * The ratios in MASTER.md were measured once, by hand, with a script. That is worth
 * exactly nothing the next time somebody nudges a hex - so the numbers are measured
 * again on every test run, against the theme they actually belong to.
 */

const CSS = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "globals.css"),
  "utf8",
);

function block(source: string, from: number): Record<string, string> {
  const open = source.indexOf("{", from);
  let depth = 0;
  let end = open;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = source.slice(open + 1, end);
  const out: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out[name!] = value!.trim().replace(/\s*\/\*.*$/, "");
  }
  return out;
}

function themes(): { light: Record<string, string>; dark: Record<string, string> } {
  const light = block(CSS, CSS.indexOf(":root"));
  const darkMedia = CSS.indexOf("@media (prefers-color-scheme: dark)");
  const dark = block(CSS, CSS.indexOf(":root", darkMedia));
  return { light, dark: { ...light, ...dark } };
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const clean = hex.trim().replace("#", "");
  const r = channel(Number.parseInt(clean.slice(0, 2), 16));
  const g = channel(Number.parseInt(clean.slice(2, 4), 16));
  const b = channel(Number.parseInt(clean.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const NUMERALS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `--num-${n}`);

describe.each(["light", "dark"] as const)("%s theme tokens", (name) => {
  const tokens = themes()[name];

  it("defines every token the board draws with", () => {
    for (const token of [
      ...NUMERALS,
      "--bg-page",
      "--bg-board",
      "--bg-cell-open",
      "--bg-cell-tile",
      "--edge-cell-tile",
      "--fg-default",
      "--fg-muted",
      "--fg-flag",
      "--fg-mine",
      "--bg-mine-boom",
      "--fg-mine-boom",
      "--fg-flag-wrong",
      "--ring-focus",
    ]) {
      expect(tokens[token], `${name} is missing ${token}`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it.each(NUMERALS)("%s clears 4.5:1 on the revealed cell", (token) => {
    const ratio = contrast(tokens[token]!, tokens["--bg-cell-open"]!);
    expect(ratio, `${name} ${token} is only ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the eight numerals distinct from one another", () => {
    // colour is the reinforcing channel, the digit is the primary one - so this only
    // asserts they are not literally the same value, which would be a copy/paste slip
    expect(new Set(NUMERALS.map((t) => tokens[t]!.toLowerCase())).size).toBe(8);
  });

  it("carries the hidden/revealed distinction on the tile border - invariant #8", () => {
    // 3:1 for a non-text boundary, WCAG 1.4.11. Lightness alone measured 1.45:1 and
    // 1.38:1, which is why the state lives in the border at all.
    const ratio = contrast(tokens["--edge-cell-tile"]!, tokens["--bg-cell-open"]!);
    expect(ratio, `${name} border is only ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
  });

  it("keeps flags, mines and the wrong-flag slash readable", () => {
    expect(contrast(tokens["--fg-flag"]!, tokens["--bg-cell-tile"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens["--fg-qmark"]!, tokens["--bg-cell-tile"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens["--fg-flag-wrong"]!, tokens["--bg-cell-tile"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens["--fg-mine"]!, tokens["--bg-cell-open"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens["--fg-mine-boom"]!, tokens["--bg-mine-boom"]!)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps body and muted text readable on the page", () => {
    expect(contrast(tokens["--fg-default"]!, tokens["--bg-page"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens["--fg-muted"]!, tokens["--bg-page"]!)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the focus ring visible against the board", () => {
    expect(contrast(tokens["--ring-focus"]!, tokens["--bg-cell-open"]!)).toBeGreaterThanOrEqual(3);
  });
});

describe("motion", () => {
  it("switches the reveal cascade off entirely under reduced motion - NFR-A11Y-05", () => {
    const reduce = CSS.indexOf("@media (prefers-reduced-motion: reduce)");
    expect(reduce).toBeGreaterThan(-1);
    const tokens = block(CSS, CSS.indexOf(":root", reduce));
    // off, not halved
    expect(tokens["--motion-cascade-max"]).toBe("0ms");
    expect(tokens["--motion-ring-stagger"]).toBe("0ms");
    expect(tokens["--motion-ui"]).toBe("0ms");
  });
});

describe("no colour literal escapes globals.css - invariant #9", () => {
  it("finds no hex colour in any .ts or .tsx source", () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), "..");
    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.tsx?$/.test(entry.name)) continue;
        const source = readFileSync(full, "utf8")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/(^|[^:])\/\/.*$/gm, "$1");
        if (/#[0-9a-fA-F]{3,8}/.test(source)) offenders.push(full);
      }
    };

    walk(root);
    expect(offenders).toEqual([]);
  });
});
