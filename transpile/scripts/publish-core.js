#!/usr/bin/env node
/**
 * publish-core — the very last build step of the transpile project: copy the
 * assembled package 1:1 from transpile/run/output/core into transpile/core/,
 * the published npm package `abap2UI5`.
 *
 * transpile/core/ is a pure build artifact — it is wiped and rewritten on
 * every publish, so nothing there should be hand-edited (edit transpile/base/
 * instead). Only `node_modules/` is preserved, to avoid a reinstall after
 * each build.
 *
 *   npm run publish_core     (usually via `npm run build_core` = assemble + publish)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");          // transpile/
const src = path.join(root, "run", "output", "core");
const dest = path.join(root, "core");

// Local, non-published entries kept across a wipe (all gitignored).
const PRESERVE = new Set(["node_modules"]);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (!fs.existsSync(src)) {
  console.error("transpile/run/output/core not found — run `npm run assemble_core` first");
  process.exit(1);
}

// Wipe the target (except preserved local dirs), then copy the assembled tree in.
fs.mkdirSync(dest, { recursive: true });
for (const entry of fs.readdirSync(dest)) {
  if (PRESERVE.has(entry)) continue;
  fs.rmSync(path.join(dest, entry), { recursive: true, force: true });
}
copyDir(src, dest);

const count = (function walk(d) {
  let n = 0;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) n += e.isDirectory() ? walk(path.join(d, e.name)) : 1;
  return n;
})(src);
console.log(`published ${count} files → transpile/core/ (1:1 copy of run/output/core)`);
