#!/usr/bin/env node
/**
 * mirror-input — snapshots an upstream repository into tools/run/input/<dir>/ so the
 * transpile/copy steps work on a versioned, reviewable copy.
 *
 *   node tools/scripts/mirror-input.js abap2UI5   → tools/run/input/abap2UI5/src    (backend)
 *   node tools/scripts/mirror-input.js app        → tools/run/input/app/webapp      (frontend)
 *   node tools/scripts/mirror-input.js samples    → tools/run/input/samples/        (whole cloud branch)
 *
 * Each stream owns exactly one top-level folder under tools/run/input/ and
 * rewrites it from scratch on every run, so upstream deletions propagate and the
 * three streams never clobber each other (backend and frontend both come from
 * the abap2UI5 repo but land in separate folders). samples comes from the cloud
 * branch (rebuilt by its auto_cloud workflow on every push to standard) — it
 * already excludes the on-premise-only apps under src/00, which cannot run in
 * the CAP/Node environment anyway.
 *
 * Wipe policy: tools/run/input/<dir>/ is always wiped first, then repopulated —
 *   - A source WITH `paths` copies each configured subtree (from → to).
 *   - A source WITHOUT `paths` mirrors its ENTIRE checkout (everything except .git).
 *
 * The upstream commit is recorded in tools/run/input/<dir>/UPSTREAM_COMMIT.
 * Set MIRROR_SOURCE=/path/to/checkout to use a local copy instead of cloning
 * (the checkout is used as-is; the branch config is not applied then).
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const A2U = "https://github.com/abap2UI5/abap2UI5";
const SOURCES = {
  // backend: the ABAP framework sources, transpiled into srv/z2ui5
  abap2UI5: { url: A2U, dir: "abap2UI5", paths: [{ from: "src", to: "src" }] },
  // frontend: the static UI5 webapp, prepared into the CAP app folder
  app: { url: A2U, dir: "app", paths: [{ from: "app/webapp", to: "webapp" }] },
  // samples: the whole cloud branch mirrored 1:1 (everything except .git)
  samples: { url: "https://github.com/abap2UI5/samples", dir: "samples", branch: "cloud" },
};

const name = process.argv[2];
const cfg = SOURCES[name];
if (!cfg) {
  console.error(`usage: node tools/scripts/mirror-input.js <${Object.keys(SOURCES).join("|")}>`);
  process.exit(1);
}

const root = path.join(__dirname, "..", "..");
const dest = path.join(root, "tools", "run", "input", cfg.dir);
const tmp = path.join(root, ".mirror_tmp");

let source = process.env.MIRROR_SOURCE;
if (!source) {
  fs.rmSync(tmp, { recursive: true, force: true });
  const branchArg = cfg.branch ? `--branch ${cfg.branch} ` : "";
  execSync(`git clone --depth 1 ${branchArg}${cfg.url} ${JSON.stringify(tmp)}`, { stdio: "inherit" });
  source = tmp;
}

const commit = execSync("git rev-parse HEAD", { cwd: source }).toString().trim();

// Wipe the stream's folder so upstream deletions propagate and it is rewritten fresh.
fs.rmSync(dest, { recursive: true, force: true });
if (cfg.paths) {
  // Copy each configured subtree from its upstream path to its slot under dest.
  for (const { from: fromRel, to: toRel } of cfg.paths) {
    const from = path.join(source, fromRel);
    if (!fs.existsSync(from)) {
      console.error(`upstream path not found: ${fromRel} — repository structure changed?`);
      process.exit(1);
    }
    const to = path.join(dest, toRel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true });
  }
} else {
  // Whole-checkout mirror: copy everything except .git.
  for (const p of fs.readdirSync(source).filter((e) => e !== ".git")) {
    fs.cpSync(path.join(source, p), path.join(dest, p), { recursive: true });
  }
}
fs.mkdirSync(dest, { recursive: true });
fs.writeFileSync(path.join(dest, "UPSTREAM_COMMIT"), commit + "\n");

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`tools/run/input/${cfg.dir} (${name}) updated from ${name}@${commit.slice(0, 12)} (${source === tmp ? cfg.url : source})`);
