const { execFileSync } = require("child_process");
const path = require("path");

/**
 * Smoke gate over all bundled sample apps — every class in
 * cap2UI5/srv/samples is started through the real core handler
 * (`?app_start=<class>`, same code path the browser hits) by
 * tools/scripts/smoke-apps.js in a child process.
 *
 * The result is diffed against tools/test/apps-smoke.known-failures.json:
 *   - an app that fails but is not on the list is a REGRESSION → test fails
 *   - an app on the list that now starts is an IMPROVEMENT → test fails too,
 *     so the list stays honest: remove the entry (regenerate via
 *     `node tools/scripts/smoke-apps.js --json`)
 */
describe("sample apps smoke", () => {
  jest.setTimeout(300000);

  test("every sample app starts, except the known failures", () => {
    const out = execFileSync(
      process.execPath,
      [path.join(__dirname, "..", "scripts", "smoke-apps.js"), "--json"],
      { encoding: "utf8", timeout: 280000, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] }
    );
    const report = JSON.parse(out);
    const known = new Set(require("./apps-smoke.known-failures.json").map((f) => f.name));

    const failing = new Set(report.results.filter((r) => r.verdict !== "ok").map((r) => r.name));

    const regressions = [...failing].filter((n) => !known.has(n));
    const fixed = [...known].filter((n) => !failing.has(n));

    expect({ regressions, fixedButStillListed: fixed }).toEqual({ regressions: [], fixedButStillListed: [] });
    // sanity floor: guard against an empty / mis-copied samples folder. The
    // exact count drifts as upstream adds/removes samples (currently ~241),
    // so this is a loose lower bound, not a pin.
    expect(report.total).toBeGreaterThan(200);
  });
});
