const { execFileSync } = require("child_process");
const path = require("path");

/**
 * Upstream unit-test gate — the self-healing loop's ratchet.
 *
 * The upstream abap2UI5 testclasses encode the EXPECTED behavior of every
 * framework class. scripts/transpile-tests.js transpiles them with abap2js,
 * scripts/run-units.js executes them against the published cap2UI5 code
 * (AUnit semantics), and this test diffs the outcome against
 * test/upstream-units.known-failures.json:
 *
 *   - a test that fails but is not on the list is a REGRESSION → red
 *   - a listed test that now passes must be delisted → red (keeps the list
 *     honest; regenerate via `node scripts/run-units.js --json`)
 *
 * So the baseline is the transpiler/port bug WORKLIST and it can only
 * shrink. Every emitter improvement must delist what it fixes; every
 * upstream sync re-arms the gate against the fresh sources.
 */
describe("upstream unit tests (transpiled testclasses)", () => {
  jest.setTimeout(300000);

  test("every transpiled upstream unit test passes, except the known failures", () => {
    execFileSync(process.execPath, [path.join(__dirname, "..", "scripts", "transpile-tests.js")], { stdio: "pipe" });
    const out = execFileSync(
      process.execPath,
      [path.join(__dirname, "..", "scripts", "run-units.js"), "--json"],
      { encoding: "utf8", timeout: 280000, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] }
    );
    const report = JSON.parse(out);
    const known = new Set(require("./upstream-units.known-failures.json").map((f) => f.name));
    const failing = new Set(Object.keys(report.failures));

    const regressions = [...failing].filter((n) => !known.has(n)).map((n) => `${n}: ${report.failures[n]}`);
    const fixedButStillListed = [...known].filter((n) => !failing.has(n));

    expect({ regressions, fixedButStillListed }).toEqual({ regressions: [], fixedButStillListed: [] });
    // sanity floor — guards against an empty/mis-generated tests folder
    expect(report.total).toBeGreaterThan(200);
  });
});
