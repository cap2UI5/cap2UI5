#!/usr/bin/env node
/**
 * mirror-frontend — takes the frontend from input/app/webapp into the CAP
 * project (cap2UI5/app/z2ui5/webapp) and applies the two cap2UI5-specific
 * patches (see patch-frontend.js). Run `npm run mirror_input` first.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const src = path.join(root, "input", "abap2UI5", "app", "webapp");
const dest = path.join(root, "cap2UI5", "app", "z2ui5", "webapp");

if (!fs.existsSync(path.join(src, "index.html"))) {
  console.error("input/abap2UI5/app/webapp not found — run `npm run mirror_abap2ui5` first");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
execSync(`node ${JSON.stringify(path.join(__dirname, "patch-frontend.js"))} ${JSON.stringify(dest)}`, { stdio: "inherit" });
console.log(`cap2UI5/app/z2ui5/webapp updated from input/abap2UI5/app/webapp`);
