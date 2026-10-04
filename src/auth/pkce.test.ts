import { describe, expect, it } from "vitest";
import { challengeOf, randomUrlSafeToken } from "./pkce";

describe("pkce", () => {
  it("matches the RFC 7636 appendix B vector", async () => {
    expect(await challengeOf("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")).toBe(
      "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    );
  });

  it("produces base64url without padding, and a verifier of at least 43 chars", async () => {
    const verifier = randomUrlSafeToken();
    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(await challengeOf(verifier)).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("gives a different token every call", () => {
    expect(new Set(Array.from({ length: 20 }, () => randomUrlSafeToken())).size).toBe(20);
  });
});
