// types
import type { DuckerConfig, DuckerProfile } from "./types";

// others
import { redirectUri } from "./duckerAuth";

/** IdP treo thì đừng để nút "Đang đăng nhập…" khoá mãi - hết hạn thì về signed-out. */
const REQUEST_TIMEOUT_MS = 15_000;

/** Đổi code lấy token. Public client - không có client_secret. */
export async function exchangeCode(
  config: DuckerConfig,
  code: string,
  verifier: string,
): Promise<{ accessToken: string }> {
  const response = await fetch(new URL("/oauth/token", config.issuer), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri(),
      client_id: config.clientId,
    }),
  });
  if (!response.ok) throw new Error(`token_exchange_failed_${response.status}`);
  const data = (await response.json()) as { access_token?: unknown };
  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("token_exchange_no_access_token");
  }
  return { accessToken: data.access_token };
}

const optionalString = (value: unknown): boolean =>
  value === undefined || value === null || typeof value === "string";

/** A malformed userinfo must never reach rendering. */
function isProfile(value: unknown): value is DuckerProfile {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.sub === "string" &&
    v.sub !== "" &&
    optionalString(v.name) &&
    optionalString(v.email) &&
    optionalString(v.picture) &&
    (v.email_verified === undefined || typeof v.email_verified === "boolean")
  );
}

export async function fetchProfile(
  config: DuckerConfig,
  accessToken: string,
): Promise<DuckerProfile> {
  const response = await fetch(new URL("/oauth/userinfo", config.issuer), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`userinfo_failed_${response.status}`);
  const data: unknown = await response.json();
  if (!isProfile(data)) throw new Error("userinfo_invalid");
  return data;
}
