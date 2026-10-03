#!/usr/bin/env node
/**
 * conformance - run the abap2UI5 protocol's backend conformance suite
 * against THIS checkout of cap2UI5.
 *
 * The suite, its conformance apps and the CAP project that serves them all
 * belong to abap2UI5/protocol (`npm run conformance:cap2ui5` there). What
 * that project installs is the PUBLISHED @cap2ui5/cds-plugin; this script
 * swaps in the plugin and the runtime of this checkout instead, packed as
 * `npm publish` would pack them (the way consumer-test.mjs does), and then
 * runs the protocol's own runner - nothing of the suite is copied here.
 *
 *   node scripts/conformance.mjs <protocol checkout> [--profile core|ui5] [--json <file>]
 *
 * <protocol checkout>  a THROWAWAY clone of abap2UI5/protocol: this script
 *                      rewrites conformance/hosts/cap2ui5/package.json and
 *                      installs into that directory.
 * runtime/ has to be assembled first (scripts/assemble-runtime.sh).
 *
 * Exit code: the runner's - 0 when no MUST check failed, 1 when one did -
 * or 2 when the setup itself failed.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const [protocolArg, ...rest] = process.argv.slice(2);
const opt = (k) => {
  const i = rest.indexOf(k);
  return i >= 0 ? rest[i + 1] : undefined;
};
const fail = (msg) => {
  console.error(`conformance: ${msg}`);
  process.exit(2);
};
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

if (!protocolArg) fail("usage: node scripts/conformance.mjs <protocol checkout> [--profile core|ui5] [--json <file>]");
const PROTOCOL = path.resolve(protocolArg);
const HOST = path.join(PROTOCOL, "conformance", "hosts", "cap2ui5");
for (const f of [path.join(PROTOCOL, "scripts", "run-conformance.mjs"), path.join(HOST, "package.json")]) {
  if (!fs.existsSync(f)) fail(`${f} is missing - is ${PROTOCOL} a checkout of abap2UI5/protocol?`);
}
if (!fs.existsSync(path.join(ROOT, "runtime", "output", "init.mjs"))) {
  fail("runtime/ is not assembled - scripts/assemble-runtime.sh --package <version> (or an upstream build) first");
}

// --- this checkout's packages, packed as publish would ----------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cap2ui5-conformance-"));
const tarball = (pkg) => {
  const out = run("npm", ["pack", "--json", "--pack-destination", tmp], path.join(ROOT, pkg));
  return path.join(tmp, JSON.parse(out)[0].filename);
};
const plugin = tarball("plugin");
const runtime = tarball("runtime");
const runtimeVersion = JSON.parse(fs.readFileSync(path.join(ROOT, "runtime", "package.json"), "utf8")).version;

// --- the protocol's host, pointed at them -----------------------------------
// The runtime is a direct dependency AND an override: the plugin pins an
// exact @abap2ui5/node-runtime, and a runtime built from upstream's main can
// carry another version - npm would then nest the pinned one from the
// registry under the plugin, and the suite would test that instead of this
// checkout's runtime. The lock file pins the published plugin; it goes.
const manifest = JSON.parse(fs.readFileSync(path.join(HOST, "package.json"), "utf8"));
manifest.dependencies["@cap2ui5/cds-plugin"] = `file:${plugin}`;
manifest.dependencies["@abap2ui5/node-runtime"] = `file:${runtime}`;
manifest.overrides = { ...manifest.overrides, "@abap2ui5/node-runtime": "$@abap2ui5/node-runtime" };
fs.writeFileSync(path.join(HOST, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.rmSync(path.join(HOST, "package-lock.json"), { force: true });
fs.rmSync(path.join(HOST, "node_modules"), { recursive: true, force: true });
run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"], HOST);

// what the host will actually load - the point of the exercise
const fromHost = createRequire(path.join(HOST, "package.json"));
const pluginDir = path.dirname(fromHost.resolve("@cap2ui5/cds-plugin/package.json"));
const loaded = createRequire(path.join(pluginDir, "package.json")).resolve("@abap2ui5/node-runtime/package.json");
const loadedVersion = JSON.parse(fs.readFileSync(loaded, "utf8")).version;
const pluginVersion = JSON.parse(fs.readFileSync(path.join(pluginDir, "package.json"), "utf8")).version;
if (!fs.realpathSync(pluginDir).startsWith(fs.realpathSync(HOST))) fail(`the host resolves the plugin outside itself: ${pluginDir}`);
if (path.dirname(loaded) !== path.join(HOST, "node_modules", "@abap2ui5", "node-runtime") || loadedVersion !== runtimeVersion) {
  fail(`the plugin resolves @abap2ui5/node-runtime ${loadedVersion} at ${path.dirname(loaded)}, not this checkout's ${runtimeVersion}`);
}
console.log(`conformance: @cap2ui5/cds-plugin ${pluginVersion} (this checkout) on @abap2ui5/node-runtime ${loadedVersion} ` +
  `(runtime/), @sap/cds ${JSON.parse(fs.readFileSync(fromHost.resolve("@sap/cds/package.json"), "utf8")).version}, ` +
  `protocol ${PROTOCOL}`);

// --- the protocol's runner: start the host, run the suite, stop it ----------
const args = [path.join(PROTOCOL, "scripts", "run-conformance.mjs"), "cap2ui5", "--profile", opt("--profile") ?? "ui5"];
if (opt("--json")) args.push("--json", path.resolve(opt("--json")));
const r = spawnSync(process.execPath, args, { cwd: PROTOCOL, stdio: "inherit" });
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(r.status ?? 2);
