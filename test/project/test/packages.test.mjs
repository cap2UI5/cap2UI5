// What each package brings. @cap2ui5/cds-plugin serves apps; the ABAP parser
// abap2js reads with, @abaplint/core (8 MB), is a dependency of
// @cap2ui5/abap2js alone - a project that only serves apps never installs it,
// and the plugin never loads it. fixtures/hide-abaplint-core.cjs makes a
// process in which it is not installed.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { TEST_PROJECT } from "./server.mjs";

const require = createRequire(import.meta.url);
const HIDE = path.join(TEST_PROJECT, "test", "fixtures", "hide-abaplint-core.cjs");
const without = (args) => spawnSync(process.execPath, ["-r", HIDE, ...args], { cwd: TEST_PROJECT, encoding: "utf8" });

test("the plugin does not depend on @abaplint/core, and @cap2ui5/abap2js does", () => {
  const plugin = require("@cap2ui5/cds-plugin/package.json");
  for (const k of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    assert.equal(plugin[k]?.["@abaplint/core"], undefined, `@cap2ui5/cds-plugin ${k}`);
  }
  assert.equal(plugin.bin, undefined, "the cap2ui5 command is @cap2ui5/abap2js's");
  const translator = require("@cap2ui5/abap2js/package.json");
  assert.ok(translator.dependencies["@abaplint/core"]);
  assert.ok(translator.peerDependencies["@cap2ui5/cds-plugin"]);
  assert.deepEqual(translator.bin, { cap2ui5: "bin/cap2ui5.js" });
});

test("the plugin loads, and its API is whole, where @abaplint/core is not installed", () => {
  const r = without(["-e", `
    const plugin = require("@cap2ui5/cds-plugin");
    for (const k of ["defineApp", "defineExit", "z2ui5_cl_ui5_view_builder", "purgeDrafts"]) {
      if (!plugin[k]) throw new Error(k + " is missing");
    }
    if ("abap2js" in plugin) throw new Error("abap2js is @cap2ui5/abap2js's");
    console.log("ok");
  `]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), "ok");
});

test("abap2js translates against the runtime the plugin serves", () => {
  const { library } = require("@cap2ui5/abap2js");
  const served = path.dirname(require.resolve("@abap2ui5/node-runtime/package.json",
    { paths: [path.dirname(require.resolve("@cap2ui5/cds-plugin/package.json"))] }));
  assert.equal(library().frameworkDir, path.join(served, "downport"));
  assert.ok(library().model("z2ui5_if_client"), "z2ui5_if_client is read from there");
});

test("the packages are versioned in lockstep - release.yml publishes them under one tag", () => {
  const plugin = require("@cap2ui5/cds-plugin/package.json").version;
  assert.equal(require("@cap2ui5/abap2js/package.json").version, plugin);
});
