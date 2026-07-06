#!/usr/bin/env node
/**
 * copy-into-cap — step 5: takes the transpiled classes from output/ into the
 * CAP project. Pure copy with a safety gate, no transpiling here:
 *
 *   output/abap2UI5/**  → cap2UI5/srv/z2ui5/02/**   (app layer)
 *   output/samples/**   → cap2UI5/srv/samples/**
 *
 * Gate: a class whose transpile-report entry has TODOs never replaces an
 * existing file — the (working) current version is kept and the class is
 * reported. New files are written even with TODOs, marked for manual work.
 * Run the jest suite afterwards (the workflows do).
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const COPIES = [
  { name: "abap2UI5", from: path.join(root, "output", "abap2UI5"), to: path.join(root, "cap2UI5", "srv", "z2ui5", "02") },
  { name: "samples", from: path.join(root, "output", "samples"), to: path.join(root, "cap2UI5", "srv", "samples") },
];

let totalWritten = 0;
for (const { name, from, to } of COPIES) {
  const reportPath = path.join(from, "transpile-report.json");
  if (!fs.existsSync(reportPath)) {
    console.log(`output/${name}: no transpile-report.json — skipped (run \`npm run transpile_${name.toLowerCase()}\` first)`);
    continue;
  }
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  let written = 0;
  const kept = [];
  for (const entry of report) {
    const src = path.join(from, entry.path);
    const dest = path.join(to, entry.path);
    if (entry.todos > 0 && fs.existsSync(dest)) {
      kept.push(`${entry.class} (${entry.todos} TODOs — existing file kept)`);
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    written++;
    if (entry.todos > 0) console.log(`  written NEW with ${entry.todos} TODOs (manual work): ${path.relative(root, dest)}`);
  }
  totalWritten += written;
  console.log(`output/${name} -> ${path.relative(root, to)}: ${written} written, ${kept.length} kept`);
  for (const k of kept) console.log(`  kept: ${k}`);
}
console.log(`\n${totalWritten} files copied into cap2UI5`);
