import { spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";

/**
 * Builds the static export once more with Ducker ID sign-in switched ON against a
 * fake issuer, into ./out-auth, for e2e/ducker-id-sign-in.spec.ts.
 *
 * The normal `pnpm build` output (./out, flag off) is what every other e2e project
 * tests and is left exactly as it was: `out` is parked while the flag-on build runs
 * and put back afterwards. The issuer is never resolved - the spec routes every
 * request to it (ADR-0013).
 */
const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: "",
  NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN: "true",
  NEXT_PUBLIC_DUCKER_ISSUER: "http://ducker.test",
  NEXT_PUBLIC_DUCKER_CLIENT_ID: "e2e-client",
  NEXT_PUBLIC_DUCKER_SCOPE: "openid profile email",
  NEXT_PUBLIC_DUCKER_PROFILE_PATH: "/profile",
};

const hadOut = existsSync("out");
if (hadOut) {
  rmSync("out.keep", { recursive: true, force: true });
  renameSync("out", "out.keep");
}
// the flag is inlined at compile time, so a cache from the flag-off build is stale
rmSync(".next", { recursive: true, force: true });

const result = spawnSync("pnpm", ["exec", "next", "build"], {
  env,
  stdio: "inherit",
  shell: true,
});

rmSync("out-auth", { recursive: true, force: true });
if (existsSync("out")) renameSync("out", "out-auth");
if (hadOut) renameSync("out.keep", "out");
rmSync(".next", { recursive: true, force: true });

process.exit(result.status ?? 1);
