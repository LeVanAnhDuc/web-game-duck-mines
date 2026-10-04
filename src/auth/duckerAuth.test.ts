import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureCallback,
  consumeCallback,
  resetCaptureForTests,
  resetLoginForTests,
  settleCallbackUrl,
  startLogin,
} from "./duckerAuth";

const config = {
  issuer: "http://localhost:3000",
  clientId: "game-client",
  scope: "openid profile email",
  profileUrl: "http://localhost:3000/profile",
};

const PENDING = (returnTo: string, state = "s1") =>
  JSON.stringify({ state, verifier: "v1", returnTo });

describe("consumeCallback", () => {
  beforeEach(() => sessionStorage.clear());

  it("returns null and leaves the URL alone when there is no callback", () => {
    window.history.replaceState(null, "", "/?seed=3");
    expect(consumeCallback()).toBeNull();
    expect(window.location.search).toBe("?seed=3");
  });

  it("returns code + verifier + returnTo when state matches, and strips only OAuth params", () => {
    sessionStorage.setItem("ducker.pkce", PENDING("/?seed=3"));
    window.history.replaceState(null, "", "/?seed=3&code=c1&state=s1&iss=x");
    expect(consumeCallback()).toEqual({ code: "c1", verifier: "v1", returnTo: "/?seed=3" });
    expect(window.location.search).toBe("?seed=3");
    expect(sessionStorage.getItem("ducker.pkce")).toBeNull();
  });

  it("reports state_mismatch when the state differs", () => {
    sessionStorage.setItem("ducker.pkce", PENDING("/"));
    window.history.replaceState(null, "", "/?code=c1&state=evil");
    expect(consumeCallback()).toEqual({ error: "state_mismatch" });
    expect(window.location.search).toBe("");
  });

  it("reports state_mismatch when there is no pending entry (other tab)", () => {
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    expect(consumeCallback()).toEqual({ error: "state_mismatch" });
  });

  it("passes the IdP error through, cleans the URL and still returns returnTo", () => {
    sessionStorage.setItem("ducker.pkce", PENDING("/?seed=3"));
    window.history.replaceState(null, "", "/?error=access_denied&error_description=no&state=s1");
    expect(consumeCallback()).toEqual({ error: "access_denied", returnTo: "/?seed=3" });
    expect(window.location.search).toBe("");
  });

  it("drops a returnTo containing a backslash", () => {
    sessionStorage.setItem("ducker.pkce", PENDING(String.raw`/\evil`));
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    expect(consumeCallback()).toEqual({ code: "c1", verifier: "v1", returnTo: undefined });
  });

  it("drops an unsafe returnTo", () => {
    sessionStorage.setItem("ducker.pkce", PENDING("//evil.example/x"));
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    expect(consumeCallback()).toEqual({ code: "c1", verifier: "v1", returnTo: undefined });
  });
});

describe("captureCallback", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetCaptureForTests();
  });

  it("restores returnTo once; a second call is a no-op", () => {
    sessionStorage.setItem("ducker.pkce", PENDING("/?seed=3"));
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    captureCallback();
    expect(window.location.search).toBe("?seed=3");
    window.history.replaceState(null, "", "/?other=1");
    captureCallback();
    expect(window.location.search).toBe("?other=1");
  });
});

describe("settleCallbackUrl", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetCaptureForTests();
  });

  it("restores the clean URL when something re-pollutes it after capture", () => {
    sessionStorage.setItem("ducker.pkce", PENDING("/?seed=3"));
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    captureCallback();
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    settleCallbackUrl();
    expect(window.location.search).toBe("?seed=3");
  });

  it("is one-shot: a second call is a no-op even if the URL changed meanwhile", () => {
    sessionStorage.setItem("ducker.pkce", PENDING("/?seed=3"));
    window.history.replaceState(null, "", "/?code=c1&state=s1");
    captureCallback();
    settleCallbackUrl();
    window.history.replaceState(null, "", "/?other=2");
    settleCallbackUrl();
    expect(window.location.search).toBe("?other=2");
  });

  it("is a no-op when there was no callback", () => {
    window.history.replaceState(null, "", "/?seed=3&x=1");
    captureCallback();
    window.history.replaceState(null, "", "/?other=2");
    settleCallbackUrl();
    expect(window.location.search).toBe("?other=2");
  });
});

describe("startLogin", () => {
  const assign = vi.fn();
  beforeEach(() => {
    sessionStorage.clear();
    assign.mockReset();
    resetLoginForTests();
    vi.stubGlobal("location", {
      ...window.location,
      assign,
      origin: "http://localhost:4301",
      pathname: "/",
      search: "?seed=2",
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("stores the pending entry and redirects to /oauth/authorize with PKCE", async () => {
    await startLogin(config);
    const pending = JSON.parse(sessionStorage.getItem("ducker.pkce")!);
    expect(pending.returnTo).toBe("/?seed=2");
    const url = new URL(assign.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe("http://localhost:3000/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("game-client");
    expect(url.searchParams.get("redirect_uri")).toBe("http://localhost:4301/");
    expect(url.searchParams.get("scope")).toBe("openid profile email");
    expect(url.searchParams.get("state")).toBe(pending.state);
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("code_challenge")).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("ignores a second quick call: one redirect", async () => {
    await Promise.all([startLogin(config), startLogin(config)]);
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("does not redirect when sessionStorage throws, and can be retried", async () => {
    const spy = vi.spyOn(window.sessionStorage, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    await startLogin(config);
    expect(assign).not.toHaveBeenCalled();
    spy.mockRestore();
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("removes the pending entry and re-arms when the login start throws", async () => {
    const spy = vi.spyOn(crypto.subtle, "digest").mockRejectedValue(new Error("boom"));
    await expect(startLogin(config)).rejects.toThrow("boom");
    expect(sessionStorage.getItem("ducker.pkce")).toBeNull();
    expect(assign).not.toHaveBeenCalled();
    spy.mockRestore();
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("can start again after the page is restored from bfcache", async () => {
    await startLogin(config);
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(1);
    const event = new Event("pageshow");
    Object.defineProperty(event, "persisted", { value: true });
    window.dispatchEvent(event);
    await startLogin(config);
    expect(assign).toHaveBeenCalledTimes(2);
  });
});
