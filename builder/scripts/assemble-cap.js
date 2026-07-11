#!/usr/bin/env node
/**
 * assemble-cap — build the COMPLETE CAP app under builder/run/output/cap2UI5 by
 * overlaying the generated trees on top of the hand-maintained base/ source:
 *
 *   base/**                  →  run/output/cap2UI5/**        (verbatim — the source)
 *   run/output/abap2UI5/**   →  srv/z2ui5/**                 (fill-in: only files base lacks)
 *   run/output/samples/**    →  srv/app/samples/*.js         (flattened, overwrite)
 *   run/output/app/**        →  app/z2ui5/webapp/**          (replace)
 *
 * base/ wins on every conflict, so the hand-written CAP adaptations override the
 * raw transpile. The result is exactly the tree that `publish-cap` then copies
 * 1:1 into cap2UI5/. Nothing here reads or writes cap2UI5/ — the build no longer
 * depends on the state of the published project.
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
const dest = path.join(outRoot, "cap2UI5");

const OVERLAYS = [
  { name: "abap2UI5", from: path.join(outRoot, "abap2UI5"), to: path.join(dest, "srv", "z2ui5"), clobber: false, parseCheck: true },
  { name: "samples", from: path.join(outRoot, "samples"), to: path.join(dest, "srv", "app", "samples"), clobber: true, parseCheck: true, flatten: true },
  { name: "app", from: path.join(outRoot, "app"), to: path.join(dest, "app", "z2ui5", "webapp"), clobber: true, parseCheck: false },
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
 * Backend fill-ins must not just parse but also LOAD in the CAP runtime
 * (self-referencing `abap2UI5/*` requires resolve via the assembled project's
 * own package.json exports; third-party deps like @sap/cds resolve through the
 * CAP project's node_modules via NODE_PATH). Files that fail are removed and
 * the rest re-checked, since fill-ins may require each other. Same gate the old
 * copy-into-cap ran — it is what keeps e.g. z2ui5_cl_app_preload (whose deps map
 * to a path that does not exist) out of the published project.
 */
function loadGate(files, stats) {
  let candidates = [...files];
  const env = { ...process.env, NODE_PATH: path.join(root, "cap2UI5", "node_modules") };
  for (let round = 0; round < 5 && candidates.length; round++) {
    const res = execFileSync(process.execPath, [
      "-e",
      `const out=[];for(const f of ${JSON.stringify(candidates)}){try{require(f)}catch(e){out.push([f,String(e.message).split("\\n")[0]])}}console.log(JSON.stringify(out));`,
    ], { cwd: dest, encoding: "utf8", env });
    const failed = JSON.parse(res.trim().split("\n").pop());
    if (!failed.length) return;
    for (const [f, msg] of failed) {
      fs.rmSync(f, { force: true });
      candidates = candidates.filter((c) => c !== f);
      stats.copied--;
      stats.unloadable.push(`${path.relative(dest, f)}: ${msg}`);
    }
  }
}

if (!fs.existsSync(base)) {
  console.error("builder/base not found — it is the hand-maintained source of the CAP project");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
copyDir(base, dest);
console.log(`base → run/output/cap2UI5 (source skeleton copied)`);

let broken = 0;
for (const { name, from, to, clobber, parseCheck, flatten } of OVERLAYS) {
  if (!fs.existsSync(from)) {
    console.log(`run/output/${name}: not found — skipped (run the transpile/prepare step first)`);
    continue;
  }
  const stats = { copied: 0, kept: 0, added: 0, addedFiles: [], invalid: [], unloadable: [] };
  overlay(from, to, { clobber, parseCheck, flatten }, stats);
  // Only the backend fill-ins are load-gated (they run inside the CAP process).
  if (name === "abap2UI5" && stats.addedFiles.length) loadGate(stats.addedFiles, stats);
  broken += stats.invalid.length + stats.unloadable.length;
  const parts = [`${stats.copied} files (${stats.added} new)`];
  if (stats.kept) parts.push(`${stats.kept} base files kept`);
  if (stats.invalid.length) parts.push(`${stats.invalid.length} skipped (parse error)`);
  if (stats.unloadable.length) parts.push(`${stats.unloadable.length} skipped (load error)`);
  console.log(`  overlay ${name} → ${path.relative(dest, to)}: ${parts.join(", ")}`);
  for (const f of stats.invalid) console.error(`    SKIPPED (does not parse): ${f}`);
  for (const f of stats.unloadable) console.error(`    SKIPPED (does not load): ${f}`);
}

console.log(`\nassembled → ${path.relative(root, dest)}`);
if (broken) console.error(`WARNING: ${broken} transpiled file(s) skipped (parse/load error) — fix builder/scripts/abap2js.js`);
