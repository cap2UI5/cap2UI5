// Preloaded with `node -r` by abaplint-optional.test.mjs: a process in which
// the installed @abaplint/core is of the major in FAKE_ABAPLINT_CORE - as with
// --legacy-peer-deps, or a package manager that only warns about a peer range.
// Only its version is real; the translator would fail on the first call into it.
const Module = require("node:module");
const load = Module._load;
const version = process.env.FAKE_ABAPLINT_CORE;
Module._load = function (request, ...rest) {
  if (request === "@abaplint/core") return { Registry: class { static abaplintVersion() { return version; } } };
  if (request === "@abaplint/core/package.json") return { name: "@abaplint/core", version };
  return load.call(this, request, ...rest);
};
