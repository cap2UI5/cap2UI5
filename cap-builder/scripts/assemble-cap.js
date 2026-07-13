#!/usr/bin/env node
/**
 * assemble-cap — build the full CAP app under cap-builder/run/output/cap2UI5
 * from two inputs:
 *
 *   src/**                                 →  run/output/cap2UI5/**  (verbatim — the source)
 *   ../abap2UI5-js/core/app/z2ui5/webapp/**  →  app/z2ui5/webapp/**    (replace — the webapp
 *                                             copy served by CDS statics and zipped by the
 *                                             mta html5 module; taken from the PUBLISHED core
 *                                             package, so run the abap2UI5-js build first)
 *
 * The framework itself is NOT copied — the app consumes it as the npm
 * dependency `abap2UI5` (file:../abap2UI5-js/core).
 *
 * src/ is one directory deeper than the published cap2UI5/, so the relative
 * `abap2UI5` dependency path differs between the two locations. The copy
 * rewrites `file:../../abap2UI5-js/core` → `file:../abap2UI5-js/core` in
 * package.json and package-lock.json — the only transformation in the build.
 *
 *   npm run assemble
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");          // cap-builder/
const repo = path.join(root, "..");
const base = path.join(root, "src");
const dest = path.join(root, "run", "output", "cap2UI5");
const webappSrc = path.join(repo, "abap2UI5-js", "core", "app", "z2ui5", "webapp");

// the source is at cap-builder/src/, the published app at cap2UI5/ — one level
// less deep, so the file: link to the core package loses one "../".
const DEP_BASE = "file:../../abap2UI5-js/core";
const DEP_PUBLISHED = "file:../abap2UI5-js/core";
const REWRITE = new Set(["package.json", "package-lock.json"]);

// Local-only artifacts that may exist in src/ when it was run standalone
// (npm install, cds watch, mbt build) — never part of the published app.
const COPY_IGNORE = new Set(["node_modules", "gen", "resources", "mta_archives", "@cds-models"]);

function copyDir(from, to, topLevel) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (COPY_IGNORE.has(entry.name) || entry.name.endsWith(".sqlite") || entry.name.endsWith(".log")) continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dst, false);
    } else if (topLevel && REWRITE.has(entry.name)) {
      fs.writeFileSync(dst, fs.readFileSync(src, "utf8").split(DEP_BASE.replace("file:", "")).join(DEP_PUBLISHED.replace("file:", "")));
    } else {
      fs.copyFileSync(src, dst);
    }
  }
}

if (!fs.existsSync(base)) {
  console.error("cap-builder/src not found — it is the hand-maintained source of the CAP app");
  process.exit(1);
}
if (!fs.existsSync(webappSrc)) {
  console.error("abap2UI5-js/core/app/z2ui5/webapp not found — run the abap2UI5-js build first (`npm run build_core` in abap2UI5-js/)");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
copyDir(base, dest, true);
console.log(`src → run/output/cap2UI5 (source skeleton copied, core dep path rewritten)`);

const webappDest = path.join(dest, "app", "z2ui5", "webapp");
fs.rmSync(webappDest, { recursive: true, force: true });
copyDir(webappSrc, webappDest, false);
const count = (function walk(d) {
  let n = 0;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) n += e.isDirectory() ? walk(path.join(d, e.name)) : 1;
  return n;
})(webappDest);
console.log(`  overlay webapp (from abap2UI5-js/core) → app/z2ui5/webapp: ${count} files`);

console.log(`\nassembled → run/output/cap2UI5`);
