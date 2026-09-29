// @abaplint/core - the ABAP parser abap2js reads a class with - is an
// OPTIONAL peer dependency: 8 MB that the plugin's runtime path never loads,
// installed with every project that only serves apps. A project that
// translates ABAP adds it (`npm add -D @abaplint/core`); this is where its
// absence is turned into that sentence instead of a MODULE_NOT_FOUND stack.
"use strict";

const HINT =
  "abap2js reads ABAP with @abaplint/core, which @cap2ui5/cds-plugin does not install - it is an optional " +
  "peer dependency, needed only to translate. Add it to the project: npm add -D @abaplint/core";

/** @abaplint/core, or an Error that says how to get it. `load` is require,
 *  replaceable for the test that has to see it missing. */
function requireCore(load = require) {
  try {
    return load("@abaplint/core");
  } catch (e) {
    if (e?.code === "MODULE_NOT_FOUND" && String(e.message).includes("'@abaplint/core'")) {
      throw Object.assign(new Error(HINT), { code: "CAP2UI5_ABAPLINT_CORE_MISSING", cause: e });
    }
    throw e;
  }
}

module.exports = { requireCore };
