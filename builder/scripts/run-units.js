#!/usr/bin/env node
/**
 * run-units — the runner half of the self-healing loop (see
 * transpile-tests.js for the generator and the loop description).
 *
 * Executes every transpiled upstream unit test with ABAP AUnit semantics —
 * fresh instance per test method, setup() before / teardown() after each,
 * class_setup()/class_teardown() once per class — and reports pass/fail.
 *
 *   node scripts/run-units.js            human-readable summary
 *   node scripts/run-units.js --json     { total, passed, failures: {name: reason} }
 *
 * builder/test/upstream-units.test.js diffs this report against
 * test/upstream-units.known-failures.json; regenerate that baseline after a
 * transpiler/port improvement by copying the --json failures.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "run", "output", "tests");
const jsonMode = process.argv.includes("--json");

(async () => {
  const report = JSON.parse(fs.readFileSync(path.join(OUT, "units-report.json"), "utf8"));
  const failures = {};
  let total = 0;

  for (const entry of report) {
    if (entry.error) {
      failures[`${entry.main}::__transpile`] = String(entry.error).slice(0, 180);
      continue;
    }
    let mod;
    try {
      mod = require(path.join(OUT, `${entry.main}.units.js`));
    } catch (e) {
      failures[`${entry.main}::__load`] = String(e?.message || e).slice(0, 180);
      continue;
    }
    for (const [ltcl, methods] of Object.entries(mod.__tests)) {
      const Cls = mod.__classes[ltcl];
      try {
        if (typeof Cls?.class_setup === "function") await Cls.class_setup();
      } catch (e) {
        for (const m of methods) failures[`${entry.main}::${ltcl}::${m}`] = `class_setup: ${String(e?.message || e).slice(0, 160)}`;
        continue;
      }
      for (const m of methods) {
        const name = `${entry.main}::${ltcl}::${m}`;
        if (typeof Cls?.prototype?.[m] !== "function") {
          failures[name] = "method not emitted";
          continue;
        }
        total++;
        try {
          const inst = new Cls();
          if (typeof inst.setup === "function") await inst.setup();
          await Promise.race([
            Promise.resolve(inst[m]()),
            new Promise((_, rej) => setTimeout(() => rej(new Error("timeout (5s)")), 5000).unref?.()),
          ]);
          if (typeof inst.teardown === "function") await inst.teardown();
        } catch (e) {
          failures[name] = String(e?.message || e).slice(0, 180);
        }
      }
      try {
        if (typeof Cls?.class_teardown === "function") await Cls.class_teardown();
      } catch { /* teardown failures don't flip verdicts */ }
    }
  }

  const failed = Object.keys(failures).length;
  if (jsonMode) {
    console.log(JSON.stringify({ total, passed: total - Object.keys(failures).filter((k) => !k.includes("::__")).length, failures }, null, 2));
  } else {
    for (const [n, r] of Object.entries(failures)) console.log(`FAIL ${n}  (${r})`);
    console.log(`\n${total} tests run, ${failed} failing entries`);
  }
  process.exit(0); // pass/fail is decided by the jest diff against the known-failures baseline
})();
