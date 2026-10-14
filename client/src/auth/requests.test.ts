import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exchangeCode, fetchProfile } from "./requests";

const config = {
  issuer: "http://localhost:3000",
  clientId: "game-client",
  scope: "openid",
  profileUrl: "http://localhost:3000/profile",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("requests", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("posts the code exchange as a public client with a timeout signal", async () => {
    fetchMock.mockResolvedValue(json({ access_token: "at" }));
    await expect(exchangeCode(config, "c1", "v1")).resolves.toEqual({ accessToken: "at" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3000/oauth/token");
    expect(init.method).toBe("POST");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    const body = init.body as URLSearchParams;
    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("code")).toBe("c1");
    expect(body.get("code_verifier")).toBe("v1");
    expect(body.get("client_id")).toBe("game-client");
    expect(body.get("redirect_uri")).toBe(`${window.location.origin}/`);
    expect(body.has("client_secret")).toBe(false);
  });

  it("throws on a non-ok token response", async () => {
    fetchMock.mockResolvedValue(json({}, 400));
    await expect(exchangeCode(config, "c", "v")).rejects.toThrow("token_exchange_failed_400");
  });

  it("throws on a 200 without a string access_token", async () => {
    fetchMock.mockResolvedValue(json({ access_token: 5 }));
    await expect(exchangeCode(config, "c", "v")).rejects.toThrow();
    fetchMock.mockResolvedValue(json({}));
    await expect(exchangeCode(config, "c", "v")).rejects.toThrow();
  });

  it("sends the bearer to userinfo with a timeout signal and throws when not ok", async () => {
    fetchMock.mockResolvedValue(json({ sub: "u1" }));
    await expect(fetchProfile(config, "at")).resolves.toEqual({ sub: "u1" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3000/oauth/userinfo");
    expect(init.headers.Authorization).toBe("Bearer at");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    fetchMock.mockResolvedValue(json({}, 401));
    await expect(fetchProfile(config, "at")).rejects.toThrow("userinfo_failed_401");
  });

  it("rejects a malformed userinfo body", async () => {
    fetchMock.mockResolvedValue(json(null));
    await expect(fetchProfile(config, "at")).rejects.toThrow("userinfo_invalid");
    fetchMock.mockResolvedValue(json({ sub: "u1", name: 5 }));
    await expect(fetchProfile(config, "at")).rejects.toThrow("userinfo_invalid");
    fetchMock.mockResolvedValue(json({ sub: "" }));
    await expect(fetchProfile(config, "at")).rejects.toThrow("userinfo_invalid");
  });

  it("accepts a minimal profile", async () => {
    fetchMock.mockResolvedValue(json({ sub: "u1" }));
    await expect(fetchProfile(config, "at")).resolves.toEqual({ sub: "u1" });
  });
});
