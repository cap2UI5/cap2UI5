#!/usr/bin/env node
/**
 * copy-into-cap — step 6: copy the prepared output/ folders into their
 * positions in the CAP project:
 *
 *   output/abap2UI5/**  → cap2UI5/srv/z2ui5/**        (fill-in: new files only)
 *   output/samples/**   → cap2UI5/srv/samples/*.js    (flattened, overwrite)
 *   output/app/**       → cap2UI5/app/z2ui5/webapp/** (replaced 1:1)
 *
 * Policies:
 * - The backend tree under srv/z2ui5 contains the hand-maintained CAP
 *   architecture adaptation (CDS/SQLite, native JSON core) — transpiled
 *   classes are only ADDED for files that do not exist yet, never copied
 *   over an existing file. Promoting a transpiled class over a hand-written
 *   one is a deliberate manual step.
 * - srv/samples is fully owned by the transpiler: existing files are
 *   overwritten and files that no longer exist in output/samples are
 *   removed (upstream deletions must propagate). Files whose transpiled
 *   source does not parse keep their previous version in place.
 *   The samples tree is FLATTENED: the mirror keeps the upstream ABAP
 *   package folders (output/samples/01/03/<class>.js), but the transpiled
 *   sample classes require each other as siblings (require("./z2ui5_cl_…"))
 *   and the runtime keys apps by bare class name, so every sample lands
 *   directly under srv/samples/. Class names are globally unique, so the
 *   flatten can never collide.
 * - Every transpiled .js file must parse; files that don't are skipped and
 *   reported (the jest run afterwards is the behavioral gate).
 *
 * transpile-report.json files stay in output/ and are not copied.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..", "..");

const COPIES = [
  { name: "abap2UI5", from: path.join(root, "output", "abap2UI5"), to: path.join(root, "cap2UI5", "srv", "z2ui5"), replace: false, clobber: false, parseCheck: true },
  { name: "samples", from: path.join(root, "output", "samples"), to: path.join(root, "cap2UI5", "srv", "samples"), replace: false, clobber: true, prune: true, parseCheck: true, flatten: true },
  { name: "app", from: path.join(root, "output", "app"), to: path.join(root, "cap2UI5", "app", "z2ui5", "webapp"), replace: true, clobber: true, parseCheck: false },
];

const skip = (p) => path.basename(p) === "transpile-report.json";

function parses(file) {
  try {
    new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
    return true;
  } catch (e) {
    return false;
  }
}

// When opts.flatten is set the source folder structure is discarded and every
// file lands directly under the top-level `to` — used for srv/samples, whose
// classes reference each other as siblings and are keyed by bare class name.
function copyTree(from, to, opts, stats) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyTree(src, opts.flatten ? to : dest, opts, stats);
    } else if (!skip(src)) {
      const isNew = !fs.existsSync(dest);
      if (!opts.clobber && !isNew) {
        stats.kept++;
        continue;
      }
      if (opts.parseCheck && src.endsWith(".js") && !parses(src)) {
        stats.invalid.push(path.relative(root, src));
        continue;
      }
      fs.mkdirSync(to, { recursive: true });
      fs.copyFileSync(src, dest);
      stats.copied++;
      if (isNew && dest.endsWith(".js")) stats.added.push(dest);
    }
  }
}

// Remove .js files under `to` that no longer exist in `from` — used for
// trees fully owned by the transpiler, so upstream deletions propagate.
// Only .js files are pruned (hand-maintained docs like README.md stay);
// emptied directories are removed as well.
function pruneTree(from, to, stats) {
  if (!fs.existsSync(to)) return;
  for (const entry of fs.readdirSync(to, { withFileTypes: true })) {
    const dest = path.join(to, entry.name);
    const src = path.join(from, entry.name);
    if (entry.isDirectory()) {
      pruneTree(src, dest, stats);
      if (!fs.readdirSync(dest).length) fs.rmdirSync(dest);
    } else if (entry.name.endsWith(".js") && !fs.existsSync(src)) {
      fs.rmSync(dest);
      stats.pruned++;
    }
  }
}

// Flatten variant: `to` holds every class as a flat `<name>.js`, so a file is
// pruned when its basename is absent anywhere in the (nested) `from` tree.
// Stray subdirectories left over from an earlier non-flat copy are removed.
function pruneFlat(from, to, stats) {
  if (!fs.existsSync(to)) return;
  const keep = new Set();
  (function collect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(p);
      else if (entry.name.endsWith(".js") && !skip(p)) keep.add(entry.name);
    }
  })(from);
  for (const entry of fs.readdirSync(to, { withFileTypes: true })) {
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(dest, { recursive: true, force: true });
    } else if (entry.name.endsWith(".js") && !keep.has(entry.name)) {
      fs.rmSync(dest);
      stats.pruned++;
    }
  }
}

/**
 * Backend fill-ins must not just parse but also load (unresolved requires,
 * stubbed superclasses of missing classes, ...). Files are checked in a
 * child process from the CAP project root; failing ones are removed and the
 * remaining set is re-checked, since fill-ins may require each other.
 */
function loadGate(files, stats) {
  let candidates = [...files];
  for (let round = 0; round < 5 && candidates.length; round++) {
    const result = execFileSync(process.execPath, [
      "-e",
      `const out = [];
       for (const f of ${JSON.stringify(candidates)}) {
         try { require(f); } catch (e) { out.push([f, String(e.message).split("\\n")[0]]); }
       }
       console.log(JSON.stringify(out));`,
    ], { cwd: path.join(root, "cap2UI5"), encoding: "utf8" });
    const failed = JSON.parse(result.trim().split("\n").pop());
    if (!failed.length) return;
    for (const [f, msg] of failed) {
      fs.rmSync(f, { force: true });
      candidates = candidates.filter((c) => c !== f);
      stats.copied--;
      stats.unloadable.push(`${path.relative(root, f)}: ${msg}`);
    }
  }
}

let total = 0;
let broken = 0;
for (const { name, from, to, replace, clobber, prune, parseCheck, flatten } of COPIES) {
  if (!fs.existsSync(from)) {
    console.log(`output/${name}: not found — skipped (run the transpile/prepare steps first)`);
    continue;
  }
  if (replace) fs.rmSync(to, { recursive: true, force: true });
  const stats = { copied: 0, kept: 0, pruned: 0, invalid: [], added: [], unloadable: [] };
  copyTree(from, to, { clobber, parseCheck, flatten }, stats);
  if (prune) (flatten ? pruneFlat : pruneTree)(from, to, stats);
  if (name === "abap2UI5" && stats.added.length) loadGate(stats.added, stats);
  total += stats.copied;
  broken += stats.invalid.length + stats.unloadable.length;
  const parts = [`${stats.copied} files copied`];
  if (stats.kept) parts.push(`${stats.kept} hand-maintained files kept`);
  if (stats.pruned) parts.push(`${stats.pruned} removed (gone upstream)`);
  if (stats.invalid.length) parts.push(`${stats.invalid.length} skipped (parse error)`);
  if (stats.unloadable.length) parts.push(`${stats.unloadable.length} skipped (load error)`);
  console.log(`output/${name} -> ${path.relative(root, to)}: ${parts.join(", ")}`);
  for (const f of stats.invalid) console.error(`  SKIPPED (does not parse): ${f}`);
  for (const f of stats.unloadable) console.error(`  SKIPPED (does not load): ${f}`);
}
console.log(`\n${total} files copied into cap2UI5`);
if (broken) {
  // not fatal: the previous version stays in place and jest gates the sync —
  // the transpile-report.json parseError entries track the follow-up work
  console.error(`WARNING: ${broken} file(s) skipped because they do not parse or load — fix tools/scripts/abap2js.js`);
}
