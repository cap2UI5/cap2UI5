#!/usr/bin/env node
/**
 * mirror-input — snapshots the abap2UI5 sources into input/ so the other
 * sync steps (mirror-frontend, sync-backend) work on a versioned, reviewable
 * copy instead of cloning themselves.
 *
 * Copies: src/ (ABAP sources) and app/webapp/ (frontend).
 * Records the upstream commit in input/UPSTREAM_COMMIT.
 *
 * Source: clones https://github.com/abap2UI5/abap2UI5 by default; set
 * MIRROR_SOURCE=/path/to/abap2UI5 to use a local checkout (offline/dev).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const input = path.join(root, "input");
const tmp = path.join(root, ".mirror_tmp");

let source = process.env.MIRROR_SOURCE;
if (!source) {
  fs.rmSync(tmp, { recursive: true, force: true });
  execSync(`git clone --depth 1 https://github.com/abap2UI5/abap2UI5 ${JSON.stringify(tmp)}`, { stdio: "inherit" });
  source = tmp;
}

const commit = execSync("git rev-parse HEAD", { cwd: source }).toString().trim();

fs.rmSync(input, { recursive: true, force: true });
fs.mkdirSync(path.join(input, "app"), { recursive: true });
fs.cpSync(path.join(source, "src"), path.join(input, "src"), { recursive: true });
fs.cpSync(path.join(source, "app", "webapp"), path.join(input, "app", "webapp"), { recursive: true });
fs.writeFileSync(path.join(input, "UPSTREAM_COMMIT"), commit + "\n");

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`input/ updated from abap2UI5@${commit.slice(0, 12)} (${source === tmp ? "cloned" : source})`);
