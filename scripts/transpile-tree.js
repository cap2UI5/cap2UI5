#!/usr/bin/env node
/**
 * transpile-tree — transpiles ABAP classes from input/<name>/src into
 * output/<name>/ (folder structure mirrored 1:1) and writes a
 * transpile-report.json with the TODO count per class. The copy step
 * (copy-into-cap.js) uses that report as its safety gate.
 *
 *   node scripts/transpile-tree.js abap2UI5   → app layer only:
 *                                               z2ui5_cl_app_* / z2ui5_cl_pop_* under src/02
 *                                               (core engine + view builder stay hand-maintained)
 *   node scripts/transpile-tree.js samples    → every class
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { transpileFile } = require("./abap2js");

const TARGETS = {
  abap2UI5: { base: ["src", "02"], filter: (f) => /^z2ui5_cl_(app|pop)_/.test(f) },
  samples: { base: ["src"], filter: () => true },
};

const name = process.argv[2];
const cfg = TARGETS[name];
if (!cfg) {
  console.error(`usage: node scripts/transpile-tree.js <${Object.keys(TARGETS).join("|")}>`);
  process.exit(1);
}

const root = path.join(__dirname, "..");
const srcBase = path.join(root, "input", name, ...cfg.base);
const outBase = path.join(root, "output", name);

if (!fs.existsSync(srcBase)) {
  console.error(`${path.relative(root, srcBase)} not found — run \`npm run mirror_${name.toLowerCase()}\` first`);
  process.exit(1);
}

const targets = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".clas.abap") && !entry.name.includes(".testclasses.") && cfg.filter(entry.name)) {
      targets.push({ file: full, relDir: path.relative(srcBase, dir) });
    }
  }
})(srcBase);

fs.rmSync(outBase, { recursive: true, force: true });
const report = [];
const failed = [];
for (const { file, relDir } of targets) {
  try {
    const { code, todos, name: className } = transpileFile(file);
    const relPath = path.join(relDir, `${className}.js`);
    const outPath = path.join(outBase, relPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, code);
    report.push({ class: className, path: relPath, todos: todos.length, todoDetails: todos });
  } catch (e) {
    failed.push(`${path.basename(file)}: ${e.message}`);
  }
}
report.sort((a, b) => a.path.localeCompare(b.path));
fs.mkdirSync(outBase, { recursive: true });
fs.writeFileSync(path.join(outBase, "transpile-report.json"), JSON.stringify(report, null, 2) + "\n");

const clean = report.filter((r) => r.todos === 0).length;
console.log(`output/${name}: ${report.length} classes transpiled (${clean} clean, ${report.length - clean} with TODOs), ${failed.length} failed`);
for (const f of failed) console.error(`  FAILED: ${f}`);
if (failed.length) process.exit(1);
