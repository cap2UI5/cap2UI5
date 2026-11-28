// Preloaded (NODE_OPTIONS=--require) by config.test.mjs: a process in which
// @cap2ui5/agent is not installed, as in a project that never added it - the
// workspace itself always has it.
const Module = require("node:module");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request === "@cap2ui5/agent" || request.startsWith("@cap2ui5/agent/")) {
    throw Object.assign(new Error(`Cannot find module '${request}'`), { code: "MODULE_NOT_FOUND" });
  }
  return resolve.call(this, request, ...rest);
};
