// @abaplint/core - the ABAP parser abap2js reads a class with - is an
// OPTIONAL peer dependency: 8 MB that the plugin's runtime path never loads,
// installed with every project that only serves apps. A project that
// translates ABAP adds it (`npm add -D @abaplint/core`); this is where its
// absence is turned into that sentence instead of a MODULE_NOT_FOUND stack.
//
// And where one of another major is: npm lets a project keep it
// (--legacy-peer-deps, or another package manager that only warns), and the
// translator, written against 2.x, then failed on the first call into it with
// "reg.getFirstObject is not a function" - a TypeError that named neither the
// package nor the version.
"use strict";

/** The major the translator is written against - the one the peer range
 *  in package.json names. */
const MAJOR = Number(/\d+/.exec(require("../package.json").peerDependencies["@abaplint/core"])[0]);

const HINT =
  "abap2js reads ABAP with @abaplint/core, which @cap2ui5/cds-plugin does not install - it is an optional " +
  "peer dependency, needed only to translate. Add it to the project: npm add -D @abaplint/core";

/** The version of the loaded parser, or null where it does not say. */
function versionOf(core, load) {
  try {
    const v = core?.Registry?.abaplintVersion?.();
    if (v) return String(v);
  } catch { /* the package.json below */ }
  try {
    return String(load("@abaplint/core/package.json").version);
  } catch {
    return null;
  }
}

/** @abaplint/core, or an Error that says how to get it - or which one the
 *  translator needs. `load` is require, replaceable for the tests that have
 *  to see it missing or of another major. */
function requireCore(load = require) {
  let core;
  try {
    core = load("@abaplint/core");
  } catch (e) {
    if (e?.code === "MODULE_NOT_FOUND" && String(e.message).includes("'@abaplint/core'")) {
      throw Object.assign(new Error(HINT), { code: "CAP2UI5_ABAPLINT_CORE_MISSING", cause: e });
    }
    throw e;
  }
  const version = versionOf(core, load);
  if (version !== null && Number(version.split(".")[0]) !== MAJOR) {
    throw Object.assign(new Error(
      `abap2js reads ABAP with @abaplint/core ${MAJOR}.x, and the project has @abaplint/core ${version} - ` +
        `a major the translator is not written for. Install the one it names as a peer: ` +
        `npm add -D @abaplint/core@${require("../package.json").peerDependencies["@abaplint/core"]}`,
    ), { code: "CAP2UI5_ABAPLINT_CORE_INCOMPATIBLE" });
  }
  return core;
}

module.exports = { requireCore };
