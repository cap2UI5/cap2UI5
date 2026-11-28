// Preloaded with `node -r` by packages.test.mjs: a process in which
// @abaplint/core is not installed, as in a project that only serves apps -
// the workspace itself always has it, as @cap2ui5/abap2js's dependency.
const Module = require("node:module");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request === "@abaplint/core" || request.startsWith("@abaplint/core/")) {
    throw Object.assign(new Error(`Cannot find module '${request}'`), { code: "MODULE_NOT_FOUND" });
  }
  return resolve.call(this, request, ...rest);
};
