// The runtime's accelerations: accelerate( ) of @abap2ui5/node-runtime, which
// the releases after 1.145.0 bring and the plugin calls once after the boot.
//
// An app with one table of n rows costs the transpiled framework time in n²
// - a LOOP ... WHERE over a sorted primary key and CP, both in
// @abaplint/runtime - and accelerate( ) replaces those two with fast paths.
// The plugin does not copy that code; it finds the function in the runtime
// package it booted, and calls it. The runtime this repository pins has none,
// so these tests boot stand-ins of the package: the real output/ and setup/,
// with a manifest and srv/ of their own - the "./accelerate" entry the next
// release declares, a main entry that exports the function, 1.145.0's main
// entry without it, one that is broken.
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import cds from "@sap/cds";

const require = createRequire(import.meta.url);
const { locate, boot, accelerations, findAccelerate } = require("@cap2ui5/cds-plugin/lib/runtime");
const real = locate();

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cap2ui5-accelerate-"));
after(() => fs.rmSync(ROOT, { recursive: true, force: true }));

// What the stand-ins' accelerate( ) records: each call, and whether the
// framework was up when it came - it replaces parts of the running runtime.
const calls = (globalThis.__cap2ui5AccelerateCalls = []);
const ACCELERATE = (answer = true) => `
export function accelerate(...args) {
  globalThis.__cap2ui5AccelerateCalls.push({ args, booted: typeof globalThis.abap?.Classes?.Z2UI5_CL_UI5_SRV_DRAFT === "function" });
  return ${answer};
}
`;
// the shape of 1.145.0's srv/host.mjs: it imports what the boot loaded, and defines functions
const HOST = `import { initializeABAP } from "../output/init.mjs";
import { cl_express_icf_shim } from "../output/cl_express_icf_shim.clas.mjs";
export const HANDLER_CLASS = "ZCL_SICF";
export function initialize() { return initializeABAP(); }
export function createHandler() { return (req, res) => cl_express_icf_shim.run({ req, res, class: HANDLER_CLASS }); }
`;

let n = 0;
/** A stand-in of the runtime package - its manifest's `exports` and the files under srv/. */
function standIn(exports, files) {
  const dir = path.join(ROOT, `rt${n++}`);
  fs.mkdirSync(path.join(dir, "srv"), { recursive: true });
  for (const d of ["output", "setup"]) fs.symlinkSync(path.join(real.dir, d), path.join(dir, d), "dir");
  const version = `${real.version}-standin.${n}`;
  fs.writeFileSync(path.join(dir, "package.json"),
    JSON.stringify({ name: "@abap2ui5/node-runtime", version, type: "module", exports }));
  for (const [file, src] of Object.entries(files)) fs.writeFileSync(path.join(dir, "srv", file), src);
  return { ...real, dir, version, init: path.join(dir, "output", "init.mjs"),
    shim: path.join(dir, "output", "cl_express_icf_shim.clas.mjs") };
}

/** What the plugin logged at info and at debug while fn ran. */
async function logged(fn) {
  const LOG = cds.log("cap2ui5");
  const level = LOG.level;
  const [info, debug] = [LOG.info, LOG.debug];
  const lines = { info: [], debug: [] };
  cds.log("cap2ui5", "debug");
  LOG.info = (...a) => lines.info.push(a.join(" "));
  LOG.debug = (...a) => lines.debug.push(a.join(" "));
  try {
    return { result: await fn(), ...lines };
  } finally {
    Object.assign(LOG, { info, debug });
    cds.log("cap2ui5", level);
  }
}

// The next release's shape: a "./accelerate" entry, and the main entry
// exporting the same function - to be called once, not once per entry.
const NEXT = { ".": "./srv/host.mjs", "./package.json": "./package.json", "./output/*": "./output/*",
  "./setup/*": "./setup/*", "./accelerate": "./srv/accelerate.mjs" };
let booted;
before(async () => {
  const rt = standIn(NEXT, { "accelerate.mjs": ACCELERATE(), "host.mjs": `${HOST}export { accelerate } from "./accelerate.mjs";\n` });
  booted = await logged(() => boot(rt));
});

test("boot( ) calls the runtime's accelerate( ) once, after the runtime is up, and says so", () => {
  assert.equal(calls.length, 1, "called once - and not again for the main entry that exports it too");
  assert.deepEqual(calls[0], { args: [], booted: true });
  assert.equal(typeof booted.result?.cl_express_icf_shim?.run, "function", "boot( ) still answers the shim");
  assert.deepEqual(booted.info.filter((l) => /accelerat/.test(l)), ["runtime accelerations active"]);
});

test("the main entry's accelerate( ) is found where there is no \"./accelerate\" entry", async () => {
  calls.length = 0;
  const abap = globalThis.abap;
  const rt = standIn({ ".": "./srv/host.mjs" }, { "host.mjs": HOST + ACCELERATE() });
  assert.equal(await accelerations(rt), true);
  assert.equal(calls.length, 1);
  assert.equal(globalThis.abap, abap, "importing the main entry replaced the running ABAP runtime");
  // and in the conditional form of exports
  const conditional = standIn({ ".": { types: "./srv/host.d.ts", import: "./srv/host.mjs" } }, { "host.mjs": HOST + ACCELERATE() });
  assert.equal(typeof await findAccelerate(conditional), "function");
});

test("on a runtime without it - 1.145.0, and the workspace's stand-in - nothing happens, and only debug says so", async () => {
  calls.length = 0;
  const published = standIn({ ".": "./srv/host.mjs", "./package.json": "./package.json", "./output/*": "./output/*" },
    { "host.mjs": HOST });
  // The workspace's runtime is the stand-in or a published release without
  // accelerate( ) - unless scripts/assemble-runtime.sh built it from an
  // upstream checkout that ships one (the CI job that builds upstream's
  // main). Then it is no runtime WITHOUT it, and abi-gate.test.mjs holds
  // that the plugin finds it.
  const workspaceShipsIt = (await findAccelerate(real)) !== null;
  for (const rt of workspaceShipsIt ? [published] : [published, real]) {
    const { result, info, debug } = await logged(() => accelerations(rt));
    assert.equal(result, false, rt.dir);
    assert.deepEqual(info, [], "a runtime without accelerations is not worth an info line");
    assert.match(debug.join("\n"), /has no accelerate\( \) - running without runtime accelerations/);
  }
  assert.equal(calls.length, 0);
});

test("cds.requires.cap2ui5.accelerate: false leaves them off; an accelerate( ) that declines is not active", async () => {
  calls.length = 0;
  const rt = standIn({ "./accelerate": "./srv/accelerate.mjs" }, { "accelerate.mjs": ACCELERATE() });
  const off = await logged(() => accelerations(rt, { enabled: false }));
  assert.equal(off.result, false);
  assert.equal(calls.length, 0, "called although switched off");
  assert.match(off.debug.join("\n"), /switched off: cds\.requires\.cap2ui5\.accelerate is false/);

  const declines = standIn({ "./accelerate": "./srv/accelerate.mjs" }, { "accelerate.mjs": ACCELERATE(false) });
  const no = await logged(() => accelerations(declines));
  assert.equal(no.result, false);
  assert.equal(calls.length, 1);
  assert.deepEqual(no.info, []);
  assert.match(no.debug.join("\n"), /accelerate\( \) declined/);
});

test("a runtime that declares the entry and cannot load it fails the start, as a runtime that does not load does", async () => {
  const missing = standIn({ "./accelerate": "./srv/accelerate.mjs" }, {});
  await assert.rejects(accelerations(missing), { code: "ERR_MODULE_NOT_FOUND" });
  const broken = standIn({ "./accelerate": "./srv/accelerate.mjs" }, { "accelerate.mjs": "throw new Error('broken on import');" });
  await assert.rejects(accelerations(broken), /broken on import/);
  const second = standIn({ ".": "./srv/host.mjs" }, { "host.mjs": "globalThis.abap = {};" });
  const abap = globalThis.abap;
  try {
    await assert.rejects(accelerations(second), /started a second ABAP runtime/);
  } finally {
    globalThis.abap = abap;
  }
});

test("cds.requires.cap2ui5.accelerate is on unless it is false", () => {
  const { config } = require("@cap2ui5/cds-plugin/lib/config.js");
  assert.equal(config({ requires: { cap2ui5: {} } }).accelerate, true);
  assert.equal(config({ requires: { cap2ui5: { accelerate: false } } }).accelerate, false);
});
