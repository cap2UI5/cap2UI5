// @abaplint/core is an OPTIONAL peer dependency: 8 MB of ABAP parser that
// only abap2js needs, and it used to be installed with every project that
// merely serves apps. Where it is missing, the two ways into abap2js - the
// command and require("@cap2ui5/cds-plugin").abap2js( ) - say how to add it,
// and serving apps does not notice. fixtures/hide-abaplint-core.cjs makes a
// process in which it is not installed.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { EXAMPLE } from "./server.mjs";

const require = createRequire(import.meta.url);
const { requireCore } = require("@cap2ui5/cds-plugin/lib/abaplint-core");
const HIDE = path.join(EXAMPLE, "test", "fixtures", "hide-abaplint-core.cjs");
const BIN = require.resolve("@cap2ui5/cds-plugin/bin/cap2ui5.js");
const ADD = /@abaplint\/core, which @cap2ui5\/cds-plugin does not install .* npm add -D @abaplint\/core/;

const without = (args) => spawnSync(process.execPath, ["-r", HIDE, ...args], { cwd: EXAMPLE, encoding: "utf8" });

test("the plugin declares @abaplint/core as an optional peer, not as a dependency", () => {
  const pkg = require("@cap2ui5/cds-plugin/package.json");
  assert.equal(pkg.dependencies["@abaplint/core"], undefined);
  assert.ok(pkg.peerDependencies["@abaplint/core"]);
  assert.equal(pkg.peerDependenciesMeta?.["@abaplint/core"]?.optional, true);
});

test("npx cap2ui5 abap2js without the parser says how to add it", () => {
  const r = without([BIN, "abap2js", "zcl_x.clas.abap"]);
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, ADD);
  assert.doesNotMatch(r.stderr, /at Module\._resolveFilename/, "no stack trace");
});

test("abap2js( ) without the parser says how to add it - and the rest of the package does not need it", () => {
  const r = without(["-e", `
    const plugin = require("@cap2ui5/cds-plugin");
    if (typeof plugin.defineApp !== "function") throw new Error("the package did not load");
    try { plugin.abap2js("CLASS zcl_x DEFINITION PUBLIC. ENDCLASS."); } catch (e) { console.log(e.message); }
  `]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, ADD);
});

test("requireCore( ) hands the parser over where it is installed, and passes other failures on as they are", () => {
  assert.equal(typeof requireCore().Registry, "function");
  const other = Object.assign(new Error("Cannot find module 'left-pad'"), { code: "MODULE_NOT_FOUND" });
  assert.throws(() => requireCore(() => { throw other; }), (e) => e === other);
});
