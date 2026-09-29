// defineExit( ) from a second copy of the plugin.
//
// An app package whose peer range the project's plugin does not satisfy gets
// a nested copy of @cap2ui5/cds-plugin, and its modules load that copy. The
// exit used to be registered in a variable of the module, so an exit
// registered through the nested copy sat there while the copy CAP runs had
// nothing to install - the CSP, the headers and the draft expiry stayed the
// framework's defaults, and nothing said so. A second module instance of the
// same file is that situation in miniature.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { locate } = require("@cap2ui5/cds-plugin/lib/runtime");
const FILE = require.resolve("@cap2ui5/cds-plugin/lib/define-exit");

/** a fresh instance of define-exit.js, as a second installed copy loads one */
const copy = () => {
  delete require.cache[FILE];
  return require(FILE);
};
const first = require(FILE);

before(async () => {
  const { initializeABAP } = await import(pathToFileURL(locate().init).href);
  await initializeABAP();
});
after(() => first.resetExit());

test("an exit registered through another copy is the one this copy installs", () => {
  const nested = copy();
  assert.notEqual(nested.defineExit, first.defineExit, "two instances of the module");
  const exit = { onRoundtrip(cfg) { cfg.draft_exp_time_in_hours = 12; } };
  nested.defineExit(exit);
  const Cls = first.installExit();
  assert.ok(Cls, "the copy that boots the runtime found no exit to install");
  assert.ok(abap.Classes.Z2UI5_CL_UI5_USER_EXIT.gi_user_exit.get() instanceof Cls);
  // and it is still one exit, whichever copy is asked
  assert.throws(() => first.defineExit({ onPage() {} }), /defineExit was called twice/);
  first.resetExit();
});

test("a copy of the plugin from another directory says so in the log", () => {
  const COPY = Symbol.for("cap2ui5.pluginCopy");
  const was = globalThis[COPY];
  const warned = [];
  const warn = console.warn;
  globalThis[COPY] = "/elsewhere/node_modules/@cap2ui5/cds-plugin";
  console.warn = (...a) => warned.push(a.join(" "));
  try {
    copy();
  } finally {
    console.warn = warn;
    globalThis[COPY] = was;
  }
  assert.match(warned.join("\n"),
    /a second copy of @cap2ui5\/cds-plugin is loaded, from .* beside the one in \/elsewhere\/node_modules\/@cap2ui5\/cds-plugin/);
});
