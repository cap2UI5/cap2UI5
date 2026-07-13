#!/usr/bin/env node
/**
 * smoke-apps — start every bundled sample app through the real core handler
 * (the same code path a browser hits via `?app_start=<class>`) and report
 * whether it starts.
 *
 *   node builder/scripts/smoke-apps.js             human-readable progress + summary
 *   node builder/scripts/smoke-apps.js --json      machine-readable report on stdout
 *   node builder/scripts/smoke-apps.js <class>...  only the given classes
 *
 * Verdicts per app:
 *   ok             app started and rendered a view
 *   error-popup    app crashed in main() — handler answered with the
 *                  "UNCAUGHT EXCEPTION" pop_error popup
 *   not-started    rtti lookup/instantiation failed — handler fell back to
 *                  the startup app
 *   no-view        app started but produced no main view XML
 *   crashed        handler.main() itself rejected
 *   timeout        roundtrip did not finish within TIMEOUT_MS
 *
 * The draft DB is stubbed (no CDS runtime here) — exactly like the jest
 * handler tests. builder/test/apps-smoke.test.js runs this script and diffs the
 * result against builder/test/apps-smoke.known-failures.json.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..");
const samplesDir = path.join(root, "cap2UI5", "srv", "app", "samples");

// stub the async DB layer before anything pulls in the handler
const DB = require(path.join(root, "cap2UI5", "srv", "z2ui5", "01", "01", "z2ui5_cl_core_srv_draft"));
DB.loadApp = async () => null;
DB.saveApp = async () => "smoke-uuid";
DB.loadPreviousApp = async () => null;

const Handler = require(path.join(root, "cap2UI5", "srv", "z2ui5", "01", "02", "z2ui5_cl_core_handler"));

const TIMEOUT_MS = 10000;
const jsonMode = process.argv.includes("--json");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));

// Helper classes (e.g. z2ui5_cl_sample_context) live next to the apps but
// implement no main() — only classes that can actually be started are smoked.
function isApp(file) {
  try {
    const Cls = require(file);
    return typeof Cls?.prototype?.main === "function";
  } catch {
    return true; // cannot tell — smoke it and let the handler surface the failure
  }
}

function listAppClasses() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".js") && isApp(p)) out.push(path.basename(entry.name, ".js"));
    }
  };
  walk(samplesDir);
  return out.sort();
}

function makeRequest(appName) {
  return {
    S_FRONT: {
      EVENT: "",
      ID: "",
      CONFIG: {},
      ORIGIN: "http://localhost:4004",
      PATHNAME: "/z2ui5/webapp/index.html",
      SEARCH: `?app_start=${appName}`,
      VIEW: "",
      HASH: "",
      T_EVENT_ARG: [],
    },
    XX: {},
  };
}

async function smokeOne(name) {
  const handler = new Handler();
  let raw;
  try {
    raw = await Promise.race([
      handler.main(makeRequest(name)),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), TIMEOUT_MS).unref?.()),
    ]);
  } catch (e) {
    return { name, verdict: e.message === "timeout" ? "timeout" : "crashed", detail: String(e.message).slice(0, 200) };
  }
  let res;
  try {
    res = JSON.parse(raw);
  } catch {
    return { name, verdict: "crashed", detail: `non-JSON response: ${String(raw).slice(0, 120)}` };
  }
  const rawStr = typeof raw === "string" ? raw : JSON.stringify(raw);
  if (rawStr.includes("UNCAUGHT EXCEPTION")) {
    // the cause sits behind the framework prefix inside the pop_error text
    const m = rawStr.match(/UNCAUGHT EXCEPTION - Please Restart App:(?:\\n)?([^"]*)/);
    return { name, verdict: "error-popup", detail: (m ? m[1] : "").replace(/\\+$/, "").slice(0, 200) };
  }
  const started = (res.S_FRONT?.APP || "").toLowerCase();
  if (started !== name.toLowerCase()) {
    return { name, verdict: "not-started", detail: `handler answered with ${started || "?"}` };
  }
  if (!res.S_FRONT?.PARAMS?.S_VIEW?.XML) {
    return { name, verdict: "no-view", detail: "started but no main view XML" };
  }
  return { name, verdict: "ok", detail: "" };
}

(async () => {
  const classes = (only.length ? only : listAppClasses()).filter((n) => /^z2ui5_cl_/.test(n));
  const results = [];
  for (const name of classes) {
    const r = await smokeOne(name);
    results.push(r);
    if (!jsonMode) console.log(`${r.verdict.padEnd(12)} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  }
  const byVerdict = {};
  for (const r of results) (byVerdict[r.verdict] ??= []).push(r.name);
  if (jsonMode) {
    console.log(JSON.stringify({ total: results.length, byVerdict, results }, null, 2));
  } else {
    console.log(`\n${results.length} apps:`);
    for (const [v, names] of Object.entries(byVerdict).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${v.padEnd(12)} ${names.length}`);
    }
  }
  // reporting tool — CI pass/fail is decided by builder/test/apps-smoke.test.js
  process.exit(0);
})();
