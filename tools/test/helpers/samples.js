"use strict";

/**
 * Dynamic discovery of the bundled sample apps under cap2UI5/srv/samples.
 *
 * The samples folder is mirrored + transpiled from the upstream
 * abap2UI5/samples repo on every sync run, so its exact set of classes
 * (names, numbering, additions/removals) drifts over time. Tests must not
 * pin to a hardcoded snapshot of that set — they read what is actually on
 * disk here instead.
 */

const fs = require("fs");
const path = require("path");

const samplesDir = path.join(__dirname, "..", "..", "..", "cap2UI5", "srv", "samples");

// All sample app class names present on disk, sorted, matching the framework
// naming convention.
function sampleClassNames() {
  return fs
    .readdirSync(samplesDir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => path.basename(f, ".js"))
    .filter((n) => /^z2ui5_cl_/.test(n))
    .sort();
}

function requireSample(name) {
  return require(path.join(samplesDir, `${name}.js`));
}

// A stable, representative sample app used to exercise generic behavior
// (serialization, rtti lookup, file resolution). The first class on disk
// that loads cleanly as a z2ui5_if_app subclass — deterministic across runs,
// while skipping samples with unresolved transpile deps or bundled non-app
// helper classes so those can't spuriously break the generic tests.
function firstSampleName() {
  const z2ui5_if_app = require(path.join(__dirname, "..", "..", "..", "cap2UI5", "srv", "z2ui5", "02", "z2ui5_if_app"));
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
