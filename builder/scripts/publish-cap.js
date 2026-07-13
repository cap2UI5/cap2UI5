#!/usr/bin/env node
/**
 * publish-cap — the very last build step: copy the assembled artifacts 1:1
 *
 *   builder/run/output/core     →  core/       (the npm package `abap2UI5`)
 *   builder/run/output/cap2UI5  →  cap2UI5/    (the full CAP app)
 *
 * Both targets are pure build artifacts — wiped and rewritten on every
 * publish, so nothing there should be hand-edited (edit builder/base/core/
 * resp. builder/base/cap/ instead). Only `node_modules/` is preserved, to
 * avoid a reinstall after each build.
 *
 *   npm run publish        (usually via `npm run build_cap` = assemble + publish)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..");

const TARGETS = [
  { src: path.join(root, "builder", "run", "output", "core"), dest: path.join(root, "core"), label: "core/" },
  { src: path.join(root, "builder", "run", "output", "cap2UI5"), dest: path.join(root, "cap2UI5"), label: "cap2UI5/" },
];

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

for (const { src } of TARGETS) {
  if (!fs.existsSync(src)) {
    console.error(`${path.relative(root, src)} not found — run \`npm run assemble\` first`);
    process.exit(1);
  }
}

for (const { src, dest, label } of TARGETS) {
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
  console.log(`published ${count} files → ${label} (1:1 copy of ${path.relative(root, src)})`);
}
