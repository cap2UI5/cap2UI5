#!/usr/bin/env node
/**
 * sync-backend — transpiles the abap2UI5 APP LAYER from input/src into the
 * CAP project. Run `npm run mirror_input` first.
 *
 * Scope: only z2ui5_cl_app_* and z2ui5_cl_pop_* classes under src/02 — the
 * layer that is supposed to be a 1:1 copy. The core engine (handler, binding,
 * model, draft), the view builder (z2ui5_cl_xml_view/_cc, which carries the
 * PREFERRED_PARAM shim) and the z2ui5_if_* interfaces are hand-maintained
 * adaptations and are never touched.
 *
 * Safety rule: a transpile result that contains TODO(abap2js) markers never
 * replaces an existing (working) file — it is reported instead, so incomplete
 * output cannot regress the project. Run the jest suite afterwards.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { transpileFile } = require("./abap2js");

const root = path.join(__dirname, "..");
const srcBase = path.join(root, "input", "src", "02");
const outBase = path.join(root, "cap2UI5", "srv", "z2ui5", "02");

if (!fs.existsSync(srcBase)) {
  console.error("input/src not found — run `npm run mirror_input` first");
  process.exit(1);
}

const targets = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/^z2ui5_cl_(app|pop)_.*\.clas\.abap$/.test(entry.name) && !entry.name.includes(".testclasses.")) {
      targets.push({ file: full, relDir: path.relative(srcBase, dir) });
    }
  }
})(srcBase);

let written = 0;
const skipped = [];
const failed = [];
for (const { file, relDir } of targets) {
  let result;
  try {
    result = transpileFile(file);
  } catch (e) {
    failed.push(`${path.basename(file)}: ${e.message}`);
    continue;
  }
  const outPath = path.join(outBase, relDir, `${result.name}.js`);
  if (result.todos.length && fs.existsSync(outPath)) {
    skipped.push(`${result.name} (${result.todos.length} TODOs — existing file kept)`);
    continue;
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, result.code);
  written++;
  console.log(`written: ${path.relative(root, outPath)}${result.todos.length ? `  (${result.todos.length} TODOs — new file)` : ""}`);
}

console.log(`\n${written} written, ${skipped.length} skipped, ${failed.length} failed of ${targets.length} classes`);
for (const s of skipped) console.log(`  skipped: ${s}`);
for (const f of failed) console.error(`  FAILED: ${f}`);
if (failed.length) process.exit(1);
