#!/usr/bin/env node
/**
 * copy-into-cap — step 6: plain copy of the prepared output/ folders into
 * their positions in the CAP project. No transpiling, no gates — output/ is
 * the single source of truth:
 *
 *   output/abap2UI5/**  → cap2UI5/srv/z2ui5/**        (whole backend tree)
 *   output/samples/**   → cap2UI5/srv/samples/**
 *   output/app/**       → cap2UI5/app/z2ui5/webapp/** (replaced 1:1)
 *
 * transpile-report.json files stay in output/ and are not copied.
 * Backend folders are copied over the destination (hand-written extras like
 * register-apps.js survive); the webapp is a full mirror and gets replaced.
 * Run the jest suite afterwards (the workflows do).
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const COPIES = [
  { name: "abap2UI5", from: path.join(root, "output", "abap2UI5"), to: path.join(root, "cap2UI5", "srv", "z2ui5"), replace: false },
  { name: "samples", from: path.join(root, "output", "samples"), to: path.join(root, "cap2UI5", "srv", "samples"), replace: false },
  { name: "app", from: path.join(root, "output", "app"), to: path.join(root, "cap2UI5", "app", "z2ui5", "webapp"), replace: true },
];

const skip = (p) => path.basename(p) === "transpile-report.json";

function copyTree(from, to) {
  let count = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      count += copyTree(src, dest);
    } else if (!skip(src)) {
      fs.mkdirSync(to, { recursive: true });
      fs.copyFileSync(src, dest);
      count++;
    }
  }
  return count;
}

let total = 0;
for (const { name, from, to, replace } of COPIES) {
  if (!fs.existsSync(from)) {
    console.log(`output/${name}: not found — skipped (run the transpile/prepare steps first)`);
    continue;
  }
  if (replace) fs.rmSync(to, { recursive: true, force: true });
  const count = copyTree(from, to);
  total += count;
  console.log(`output/${name} -> ${path.relative(root, to)}: ${count} files copied`);
}
console.log(`\n${total} files copied into cap2UI5`);
