#!/usr/bin/env node
/**
 * assemble-cap — build the TWO publishable artifacts under builder/run/output/
 * by overlaying the generated trees on top of the hand-maintained base/ source:
 *
 *   core   (the platform-neutral npm package `abap2UI5`)
 *     base/core/**             →  run/output/core/**             (verbatim — the source)
 *     run/output/abap2UI5/**   →  core/srv/z2ui5/**              (fill-in: only files base lacks)
 *     run/output/samples/**    →  core/srv/app/samples/*.js      (flattened, overwrite)
 *     run/output/app/**        →  core/app/z2ui5/webapp/**       (replace)
 *
 *   cap2UI5  (the full CAP app — consumes core via `"abap2UI5": "file:../core"`)
 *     base/cap/**              →  run/output/cap2UI5/**          (verbatim — the source)
 *     run/output/app/**        →  cap2UI5/app/z2ui5/webapp/**    (replace — served by CDS
 *                                 statics and zipped by the mta html5 module; same build
 *                                 output as the core copy, so the two cannot drift)
 *
 * base/ wins on every conflict, so the hand-written adaptations override the
 * raw transpile. The result is exactly what `publish-cap` then copies 1:1 into
 * core/ and cap2UI5/. Nothing here reads or writes the published folders — the
 * build never depends on the state of the published projects.
 *
 * Transpiled .js that does not parse is skipped and reported; the jest suite
 * (run after publish) is the behavioral gate.
 *
 *   npm run assemble
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..", "..");
const base = path.join(root, "builder", "base");
const outRoot = path.join(root, "builder", "run", "output");
const destCore = path.join(outRoot, "core");
const destCap = path.join(outRoot, "cap2UI5");

const OVERLAYS = [
  { name: "abap2UI5", from: path.join(outRoot, "abap2UI5"), to: path.join(destCore, "srv", "z2ui5"), clobber: false, parseCheck: true },
  { name: "samples", from: path.join(outRoot, "samples"), to: path.join(destCore, "srv", "app", "samples"), clobber: true, parseCheck: true, flatten: true },
  { name: "app (core)", from: path.join(outRoot, "app"), to: path.join(destCore, "app", "z2ui5", "webapp"), clobber: true, parseCheck: false },
  { name: "app (cap)", from: path.join(outRoot, "app"), to: path.join(destCap, "app", "z2ui5", "webapp"), clobber: true, parseCheck: false },
];

const skip = (p) => path.basename(p) === "transpile-report.json";

function parses(file) {
  try { new vm.Script(fs.readFileSync(file, "utf8"), { filename: file }); return true; }
  catch { return false; }
}

// Local-only artifacts that may exist in base/ when it was run standalone
// (npm install, cds watch, mbt build) — never part of the published app.
const COPY_IGNORE = new Set(["node_modules", "gen", "resources", "mta_archives", "@cds-models"]);

// Recursive verbatim copy (used for base → dest).
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (COPY_IGNORE.has(entry.name) || entry.name.endsWith(".sqlite") || entry.name.endsWith(".log")) continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

// Overlay copy with add-only / overwrite / flatten + parse-gate semantics.
function overlay(from, to, opts, stats) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    if (entry.isDirectory()) { overlay(src, opts.flatten ? to : path.join(to, entry.name), opts, stats); continue; }
    if (skip(src)) continue;
    const dst = path.join(to, entry.name);
    const isNew = !fs.existsSync(dst);
    if (!opts.clobber && !isNew) { stats.kept++; continue; }
    if (opts.parseCheck && src.endsWith(".js") && !parses(src)) { stats.invalid.push(path.relative(root, src)); continue; }
    fs.mkdirSync(to, { recursive: true });
    fs.copyFileSync(src, dst);
    stats.copied++;
    if (isNew && dst.endsWith(".js")) { stats.added++; stats.addedFiles.push(dst); }
  }
}

/**
 * Backend fill-ins must not just parse but also LOAD (self-referencing
 * `abap2UI5/*` requires resolve via the assembled core's own package.json
 * exports; third-party deps resolve through the CAP project's node_modules
 * via NODE_PATH). Files that fail are removed and the rest re-checked, since
 * fill-ins may require each other. It is what keeps e.g. z2ui5_cl_app_preload
 * (whose deps map to a path that does not exist) out of the published package.
 */
function loadGate(files, stats) {
  let candidates = [...files];
  const env = { ...process.env, NODE_PATH: path.join(root, "cap2UI5", "node_modules") };
  for (let round = 0; round < 5 && candidates.length; round++) {
    const res = execFileSync(process.execPath, [
      "-e",
      `const out=[];for(const f of ${JSON.stringify(candidates)}){try{require(f)}catch(e){out.push([f,String(e.message).split("\\n")[0]])}}console.log(JSON.stringify(out));`,
    ], { cwd: destCore, encoding: "utf8", env });
    const failed = JSON.parse(res.trim().split("\n").pop());
    if (!failed.length) return;
    for (const [f, msg] of failed) {
      fs.rmSync(f, { force: true });
      candidates = candidates.filter((c) => c !== f);
      stats.copied--;
      stats.unloadable.push(`${path.relative(destCore, f)}: ${msg}`);
    }
  }
}

for (const [dir, what] of [[path.join(base, "core"), "builder/base/core"], [path.join(base, "cap"), "builder/base/cap"]]) {
  if (!fs.existsSync(dir)) {
    console.error(`${what} not found — it is the hand-maintained source`);
    process.exit(1);
  }
}

fs.rmSync(destCore, { recursive: true, force: true });
fs.rmSync(destCap, { recursive: true, force: true });
copyDir(path.join(base, "core"), destCore);
copyDir(path.join(base, "cap"), destCap);
console.log(`base/core → run/output/core, base/cap → run/output/cap2UI5 (source skeletons copied)`);

let broken = 0;
for (const { name, from, to, clobber, parseCheck, flatten } of OVERLAYS) {
  if (!fs.existsSync(from)) {
    console.log(`run/output/${name}: not found — skipped (run the transpile/prepare step first)`);
    continue;
  }
  const stats = { copied: 0, kept: 0, added: 0, addedFiles: [], invalid: [], unloadable: [] };
  overlay(from, to, { clobber, parseCheck, flatten }, stats);
  // Only the backend fill-ins are load-gated (they run inside the consumers).
  if (name === "abap2UI5" && stats.addedFiles.length) loadGate(stats.addedFiles, stats);
  broken += stats.invalid.length + stats.unloadable.length;
  const parts = [`${stats.copied} files (${stats.added} new)`];
  if (stats.kept) parts.push(`${stats.kept} base files kept`);
  if (stats.invalid.length) parts.push(`${stats.invalid.length} skipped (parse error)`);
  if (stats.unloadable.length) parts.push(`${stats.unloadable.length} skipped (load error)`);
  console.log(`  overlay ${name} → ${path.relative(outRoot, to)}: ${parts.join(", ")}`);
  for (const f of stats.invalid) console.error(`    SKIPPED (does not parse): ${f}`);
  for (const f of stats.unloadable) console.error(`    SKIPPED (does not load): ${f}`);
}

console.log(`\nassembled → ${path.relative(root, destCore)} + ${path.relative(root, destCap)}`);
if (broken) console.error(`WARNING: ${broken} transpiled file(s) skipped (parse/load error) — fix builder/scripts/abap2js.js`);
