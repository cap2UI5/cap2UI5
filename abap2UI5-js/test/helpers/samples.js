"use strict";

/**
 * Dynamic discovery of the bundled sample apps under core/srv/app/samples.
 *
 * The samples folder is mirrored + transpiled from the upstream
 * abap2UI5/samples repo on every sync run, so its exact set of classes
 * (names, numbering, additions/removals) drifts over time. Tests must not
 * pin to a hardcoded snapshot of that set — they read what is actually on
 * disk here instead.
 *
 * The mirror mirrors the upstream `cloud` branch `src/` 1:1, which keeps the
 * ABAP package folders (e.g. srv/app/samples/01/03/<class>.js). Discovery must
 * therefore recurse — the same way the runtime's register_app_dir walk
 * (z2ui5_cl_util._walkClassFiles) and builder/scripts/smoke-apps.js already do.
 * A flat samples folder is just the depth-0 case of the same walk.
 */

const fs = require("fs");
const path = require("path");

const samplesDir = path.join(__dirname, "..", "..", "core", "srv", "app", "samples");

// Walk the samples tree and return a { className -> absolute file path } map
// for every sample class on disk, regardless of how deep the mirror nests it.
function sampleFileMap() {
  const map = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".js")) {
        const name = path.basename(entry.name, ".js");
        if (/^z2ui5_cl_/.test(name)) map.set(name, full);
      }
    }
  };
  walk(samplesDir);
  return map;
}

// All sample app class names present on disk, sorted, matching the framework
// naming convention.
function sampleClassNames() {
  return [...sampleFileMap().keys()].sort();
}

function requireSample(name) {
  const file = sampleFileMap().get(name);
  if (!file) throw new Error(`sample ${name} not found under ${samplesDir}`);
  return require(file);
}

// A stable, representative sample app used to exercise generic behavior
// (serialization, rtti lookup, file resolution). The first class on disk
// that loads cleanly as a z2ui5_if_app subclass — deterministic across runs,
// while skipping samples with unresolved transpile deps or bundled non-app
// helper classes so those can't spuriously break the generic tests.
function firstSampleName() {
  const z2ui5_if_app = require(path.join(__dirname, "..", "..", "core", "srv", "z2ui5", "02", "z2ui5_if_app"));
  for (const name of sampleClassNames()) {
    let AppClass;
    try {
      AppClass = requireSample(name);
    } catch {
      continue;
    }
    if (typeof AppClass === "function" && AppClass.prototype instanceof z2ui5_if_app) {
      return name;
    }
  }
  throw new Error(`no loadable sample app found under ${samplesDir}`);
}

module.exports = { samplesDir, sampleClassNames, requireSample, firstSampleName };
