#!/usr/bin/env node
/**
 * publish-cap — the very last build step: copy the assembled app 1:1 from
 * builder/run/output/cap2UI5 into the deployable cap2UI5/ project.
 *
 * cap2UI5/ is a pure build artifact — it is wiped and rewritten on every
 * publish, so nothing there should be hand-edited (edit builder/base/ instead).
 * Only `node_modules/` is preserved, to avoid a reinstall after each build.
 *
 *   npm run publish        (usually via `npm run build_cap` = assemble + publish)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..");
const src = path.join(root, "builder", "run", "output", "cap2UI5");
const dest = path.join(root, "cap2UI5");

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
  console.error("builder/run/output/cap2UI5 not found — run `npm run assemble` first");
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
console.log(`published ${count} files → cap2UI5/ (1:1 copy of run/output/cap2UI5)`);
