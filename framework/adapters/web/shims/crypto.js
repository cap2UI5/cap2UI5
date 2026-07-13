// crypto shim for the browser bundle — the framework only needs randomUUID.
"use strict";
module.exports = {
  randomUUID: () => globalThis.crypto.randomUUID(),
};
