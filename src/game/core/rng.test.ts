import { describe, expect, it } from "vitest";
import { mulberry32 } from "./rng";

describe("mulberry32", () => {
  it("gives the same sequence for the same seed", () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const left = Array.from({ length: 100 }, () => a());
    const right = Array.from({ length: 100 }, () => b());
    expect(left).toEqual(right);
  });

  it("gives a different sequence for a different seed", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(Array.from({ length: 20 }, () => a())).not.toEqual(
      Array.from({ length: 20 }, () => b()),
    );
  });

  it("stays inside [0, 1)", () => {
    const rand = mulberry32(99);
    for (let i = 0; i < 5000; i += 1) {
      const value = rand();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("is not obviously biased across ten buckets", () => {
    const rand = mulberry32(7);
    const buckets = new Array<number>(10).fill(0);
    for (let i = 0; i < 100000; i += 1) buckets[Math.floor(rand() * 10)]! += 1;
    for (const count of buckets) {
      expect(count).toBeGreaterThan(9000);
      expect(count).toBeLessThan(11000);
    }
  });
});
