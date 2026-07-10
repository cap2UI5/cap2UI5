#!/usr/bin/env node
/**
 * prepare-app — step 5: builds the ready-to-serve frontend into tools/run/output/app.
 * Takes tools/run/input/abap2UI5/app/webapp 1:1 and applies the two cap2UI5-specific
 * patches (see patch-frontend.js). The copy step (copy-into-cap.js) then
 * just copies tools/run/output/app into the CAP project like the other output folders.
 *
 * Run `npm run mirror_abap2ui5` first.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..", "..");
const src = path.join(root, "tools", "run", "input", "abap2UI5", "app", "webapp");
const dest = path.join(root, "tools", "run", "output", "app");

if (!fs.existsSync(path.join(src, "index.html"))) {
  console.error("tools/run/input/abap2UI5/app/webapp not found — run `npm run mirror_abap2ui5` first");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
execSync(`node ${JSON.stringify(path.join(__dirname, "patch-frontend.js"))} ${JSON.stringify(dest)}`, { stdio: "inherit" });
console.log(`tools/run/output/app prepared from tools/run/input/abap2UI5/app/webapp`);
