import { readFileSync } from "node:fs";

/**
 * Enforces NFR-SEC-05 - "no vulnerability at high or above" - exactly as written.
 *
 * `yarn audit` cannot do this on its own: yarn 1 returns a bitmask covering EVERY
 * severity it found, so a moderate advisory fails the build too. Gating on that
 * would be stricter than the threshold says, and a gate nobody agreed to is a gate
 * people start bypassing.
 *
 *   yarn audit --json | node scripts/check-audit.mjs
 *
 * It also refuses to report a pass it cannot justify. Yarn 1's audit endpoint can
 * answer with a summary that describes NOTHING - all-zero counts and
 * `devDependencies: 0` on a project that declares 22 of them - while still exiting
 * 0. A checker that only counts `auditAdvisory` lines then prints a green tick
 * forever. A security gate that cannot fail is worse than no gate, because people
 * trust it.
 */
const BLOCKING = new Set(["high", "critical"]);

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

const advisories = new Map();
let summary = null;

for (const line of raw.split("\n")) {
  if (!line.trim()) continue;
  let entry;
  try {
    entry = JSON.parse(line);
  } catch {
    continue; // yarn interleaves non-JSON lines
  }
  if (entry.type === "auditSummary") {
    summary = entry.data;
    continue;
  }
  if (entry.type !== "auditAdvisory") continue;
  const a = entry.data.advisory;
  advisories.set(a.id, {
    severity: a.severity,
    module: a.module_name,
    vulnerable: a.vulnerable_versions,
    patched: a.patched_versions,
    title: a.title,
    path: entry.data.resolution?.path ?? "",
  });
}

// Sanity check BEFORE reporting anything. "No advisories" is only evidence of a
// clean tree if the audit actually looked at the tree.
if (advisories.size === 0) {
  const counted = summary?.dependencies ?? 0;
  const countedDev = summary?.devDependencies ?? 0;
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const declaredDev = Object.keys(pkg.devDependencies ?? {}).length;

  const reasons = [];
  if (!summary) reasons.push("yarn printed no auditSummary at all");
  if (counted === 0) reasons.push("the summary counted 0 dependencies");
  if (declaredDev > 0 && countedDev === 0) {
    reasons.push(
      `the summary counted 0 devDependencies while package.json declares ${declaredDev}`,
    );
  }

  if (reasons.length > 0) {
    console.error("NFR-SEC-05 could not be checked - the audit did not really run.");
    console.error("");
    for (const reason of reasons) console.error(`  - ${reason}`);
    console.error("");
    console.error("Yarn 1's audit endpoint answers with an empty summary and exit code 0, so a");
    console.error("checker that only counts advisories reports a pass forever. Treat this as");
    console.error("UNKNOWN, not clean.");
    console.error("");
    console.error("Pull requests are covered by the dependency-review job in ci.yml, which reads");
    console.error("GitHub's advisory database instead of yarn's endpoint.");
    process.exit(1);
  }
}

const all = [...advisories.values()];
const blocking = all.filter((a) => BLOCKING.has(a.severity));
const rest = all.filter((a) => !BLOCKING.has(a.severity));

if (rest.length > 0) {
  console.log(`${rest.length} advisory(ies) below high, not blocking:`);
  for (const a of rest) console.log(`  ${a.severity.padEnd(8)} ${a.module}  ${a.title}`);
  console.log("");
}

if (blocking.length === 0) {
  console.log(
    `NFR-SEC-05: no high or critical advisory (${all.length} total, ` +
      `${summary?.dependencies ?? "?"} dependencies scanned).`,
  );
  process.exit(0);
}

console.error(`NFR-SEC-05 violated: ${blocking.length} advisory(ies) at high or above\n`);
for (const a of blocking) {
  console.error(`  ${a.severity.toUpperCase()}  ${a.module} ${a.vulnerable}`);
  console.error(`    ${a.title}`);
  console.error(`    via ${a.path}`);
  console.error(`    fixed in ${a.patched}\n`);
}
console.error("Fix it, or add a resolutions entry in package.json pinning the patched range.");
process.exit(1);
