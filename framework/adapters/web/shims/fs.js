// fs shim for the browser bundle — the framework's fs paths (asset default
// provider, app-class disk discovery) must all no-op: assets come from the
// injected provider, app classes from the registry.
"use strict";
module.exports = {
  readFileSync() { throw new Error("fs not available in the browser bundle"); },
  existsSync() { return false; },
  readdirSync() { return []; },
  statSync() { throw new Error("fs not available in the browser bundle"); },
};
