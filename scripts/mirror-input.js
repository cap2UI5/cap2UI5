#!/usr/bin/env node
/**
 * mirror-input — snapshots an upstream repository into input/<name>/ so the
 * transpile/copy steps work on a versioned, reviewable copy.
 *
 *   node scripts/mirror-input.js abap2UI5   → input/abap2UI5/ (src + app/webapp)
 *   node scripts/mirror-input.js samples    → input/samples/  (src)
 *
 * The upstream commit is recorded in input/<name>/UPSTREAM_COMMIT.
 * Set MIRROR_SOURCE=/path/to/checkout to use a local copy instead of cloning.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SOURCES = {
  abap2UI5: { url: "https://github.com/abap2UI5/abap2UI5", paths: ["src", "app/webapp"] },
  samples: { url: "https://github.com/abap2UI5/samples", paths: ["src"] },
};

const name = process.argv[2];
const cfg = SOURCES[name];
if (!cfg) {
  console.error(`usage: node scripts/mirror-input.js <${Object.keys(SOURCES).join("|")}>`);
  process.exit(1);
}

const root = path.join(__dirname, "..");
const dest = path.join(root, "input", name);
const tmp = path.join(root, ".mirror_tmp");

let source = process.env.MIRROR_SOURCE;
if (!source) {
  fs.rmSync(tmp, { recursive: true, force: true });
  execSync(`git clone --depth 1 ${cfg.url} ${JSON.stringify(tmp)}`, { stdio: "inherit" });
  source = tmp;
}

const commit = execSync("git rev-parse HEAD", { cwd: source }).toString().trim();

fs.rmSync(dest, { recursive: true, force: true });
for (const p of cfg.paths) {
  const from = path.join(source, p);
  if (!fs.existsSync(from)) {
    console.error(`upstream path not found: ${p} — repository structure changed?`);
    process.exit(1);
  }
  fs.cpSync(from, path.join(dest, p), { recursive: true });
}
fs.writeFileSync(path.join(dest, "UPSTREAM_COMMIT"), commit + "\n");

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`input/${name} updated from ${name}@${commit.slice(0, 12)} (${source === tmp ? cfg.url : source})`);
