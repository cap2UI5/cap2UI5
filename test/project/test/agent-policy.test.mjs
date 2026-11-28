// Who an agent may operate, and what it may fire (@cap2ui5/agent, agent/lib/policy.js),
// read without a server: defineApp( )'s option agent, the project's
// settings, and the rule that the stricter of the two wins. agent.test.mjs is
// the same on the wire.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { before, test } from "node:test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { locate } = require("@cap2ui5/cds-plugin/lib/runtime");
const { defineApp } = require("@cap2ui5/cds-plugin");
const { agentConfig, appOption, checkApps, reachable, reachableApps, classify } = require("@cap2ui5/agent/lib/policy");

before(async () => {
  const { initializeABAP } = await import(pathToFileURL(path.join(locate().dir, "output", "init.mjs")).href);
  await initializeABAP();
  defineApp("ZCL_AG_OPEN", class { main() {} }, { agent: true });
  defineApp("ZCL_AG_RULES", class { main() {} }, { agent: { events: { SAVE: "confirm", "DELETE*": "forbidden", "*": "allowed" } } });
  defineApp("ZCL_AG_NEVER", class { main() {} }, { agent: false });
  defineApp("ZCL_AG_SILENT", class { main() {} });
});

const ROUTES = ["/sap/bc/z2ui5", "/rest/root/z2ui5"];
const conf = (agent) => agentConfig({ apps: [], ...agent }, ROUTES);

test("an app opts in with defineApp( )'s option; one that says nothing is not reachable", () => {
  assert.deepEqual(reachable("zcl_ag_open", conf()), { ok: true, source: "app", description: undefined });
  assert.equal(reachable("ZCL_AG_SILENT", conf()).ok, false);
  assert.match(reachable("ZCL_AG_SILENT", conf()).reason, /is not opted in/);
  assert.equal(reachable("ZCL_AG_SILENT", conf({ apps: ["ZCL_AG_S*"] })).source, "config", "the project may opt it in");
});

test("agent: false is the app's never - no setting overrides it, and app_list leaves it out", () => {
  const all = conf({ apps: ["*"] });
  assert.match(reachable("ZCL_AG_NEVER", all).reason, /says agents may never operate it/);
  const listed = reachableApps(all).map((a) => a.app);
  assert.ok(!listed.includes("ZCL_AG_NEVER"));
  assert.ok(listed.includes("ZCL_AG_SILENT") && listed.includes("Z2UI5_CL_UI5_APP_HI_WORLD"), "* opts in every app, transpiled ones too");
  assert.ok(listed.every((a) => !a.includes("-")), "no local class of a class pool");
});

test("a class that is no app is never reachable, whatever the settings say", () => {
  // a class the pinned runtime and abap2UI5's main both have - Z2UI5_CL_UTIL,
  // asked here before, is gone from main, where "no app" was true of nothing
  assert.ok(abap.Classes["Z2UI5_CL_UI5_UTIL_CONTEXT"], "the runtime has no Z2UI5_CL_UI5_UTIL_CONTEXT");
  assert.match(reachable("Z2UI5_CL_UI5_UTIL_CONTEXT", conf({ apps: ["*"] })).reason, /is no app of this server/);
  assert.ok(!reachableApps(conf({ apps: ["*"] })).some((a) => a.app === "Z2UI5_CL_UI5_UTIL_CONTEXT"));
});

test("the app classifies its events - an exact name before a pattern, * for the rest", () => {
  const c = conf();
  assert.deepEqual(classify({ app: "ZCL_AG_RULES", event: "SAVE" }, c), { policy: "confirm", source: "the app ZCL_AG_RULES classifies it confirm" });
  assert.equal(classify({ app: "ZCL_AG_RULES", event: "DELETE_ALL" }, c).policy, "forbidden");
  assert.equal(classify({ app: "ZCL_AG_RULES", event: "delete_all" }, c).policy, "forbidden", "events compare as ABAP's CP does: without case");
  assert.equal(classify({ app: "ZCL_AG_RULES", event: "SEARCH" }, c).policy, "allowed");
  assert.deepEqual(classify({ app: "ZCL_AG_OPEN", event: "SAVE" }, c), { policy: "allowed", source: "default" });
});

test("the project classifies on top - for the app on the screen and the app the session started with; the stricter wins", () => {
  const c = conf({ confirm: ["ZCL_AG_OPEN:SAVE", "POST"], forbidden: ["ZCL_AG_RULES:SAVE"] });
  assert.equal(classify({ app: "ZCL_AG_OPEN", event: "SAVE" }, c).policy, "confirm");
  assert.equal(classify({ app: "ZCL_ANY", event: "POST" }, c).policy, "confirm", "an EVENT rule is every app's");
  const strict = classify({ app: "ZCL_AG_RULES", event: "SAVE" }, c);
  assert.deepEqual(strict, { policy: "forbidden", source: 'cds.requires.cap2ui5.agent.forbidden has "ZCL_AG_RULES:SAVE"' });
  // a popup the app called answers on the screen - the rules for the app that called it still hold
  assert.equal(classify({ app: "Z2UI5_CL_POP_TO_CONFIRM", start: "ZCL_AG_OPEN", event: "SAVE" }, c).policy, "confirm");
  // and a project's confirm does not soften the app's forbidden
  assert.equal(classify({ app: "ZCL_AG_RULES", event: "DELETE" }, conf({ confirm: ["DELETE"] })).policy, "forbidden");
});

test("a wrong option is refused when the endpoint reads it - naming the app", () => {
  // defineApp( ) of the plugin keeps the option as it is given: the plugin
  // needs nothing of this package. The endpoint reads every app's option once
  // the apps are loaded (checkApps( )), so a wrong one fails the start.
  assert.throws(() => appOption("ZCL_AG_BAD1", { events: { SAVE: "forbiden" } }),
    /defineApp\(ZCL_AG_BAD1\): option agent\.events\.SAVE: "forbiden" - an event is allowed, confirm, forbidden/);
  assert.throws(() => appOption("ZCL_AG_BAD2", { event: {} }), /event - it knows events and description/);
  assert.throws(() => appOption("ZCL_AG_BAD3", "yes"), /is true, false or \{ events, description \}/);
  assert.throws(() => appOption("ZCL_AG_BAD4", { events: ["SAVE"] }), /maps an event/);
  defineApp("ZCL_AG_BAD5", class { main() {} }, { agent: { events: { SAVE: "forbiden" } } });
  try {
    assert.throws(() => checkApps(), /defineApp\(ZCL_AG_BAD5\): option agent\.events\.SAVE: "forbiden"/);
  } finally {
    delete abap.Classes.ZCL_AG_BAD5;
  }
  assert.doesNotThrow(() => checkApps());
});

// ---- the settings, cds.requires.cap2ui5.agent ---------------------------------

test("agent: off unless switched on; true is the default path under /rest/root/z2ui5", () => {
  for (const off of [undefined, null, false]) assert.equal(agentConfig(off, ROUTES), null);
  const on = agentConfig(true, ROUTES);
  assert.equal(on.path, "/rest/root/z2ui5/mcp");
  assert.equal(on.route, "/rest/root/z2ui5", "the UI route the endpoint stands for: the one its path lies under");
  assert.deepEqual([on.apps, on.confirm, on.forbidden], [[], [], []]);
  assert.equal(on.retention, 90, "the audit log keeps 90 days unless the project says otherwise");
  const own = agentConfig({ path: "/agents", apps: "ZCL_*", confirm: ["ZCL_A:SAVE"], forbidden: "DELETE*" }, ROUTES);
  assert.equal(own.route, "/sap/bc/z2ui5", "a path under no route stands for the first");
  assert.deepEqual(own.apps.map((a) => a.text), ["ZCL_*"]);
  assert.deepEqual(own.confirm.map((r) => r.text), ["ZCL_A:SAVE"]);
  assert.deepEqual(own.forbidden.map((r) => r.text), ["DELETE*"]);
});

test("agent: a setting it does not know, a malformed rule or a route's path is refused, not ignored", () => {
  assert.throws(() => agentConfig({ forbiden: ["DELETE"] }, ROUTES), /forbiden - not a setting of the agent endpoint/);
  assert.throws(() => agentConfig("yes", ROUTES), /is true, false or \{ path, apps, confirm, forbidden, retention \}/);
  assert.throws(() => agentConfig({ forbidden: [":DELETE"] }, ROUTES), /names no app/);
  assert.throws(() => agentConfig({ confirm: ["ZCL_A:"] }, ROUTES), /names no event/);
  assert.throws(() => agentConfig({ apps: [42] }, ROUTES), /agent\.apps takes names/);
  assert.throws(() => agentConfig({ path: "/sap/bc/z2ui5" }, ROUTES), /is a roundtrip route already/);
  assert.throws(() => agentConfig({ path: "mcp" }, ROUTES), /a path starting with \//);
});

test("agent.retention: days an audit row is kept - 0 or false keeps every row, anything else is refused", () => {
  const retention = (v) => agentConfig({ retention: v }, ROUTES).retention;
  assert.equal(retention(undefined), 90);
  assert.equal(retention(null), 90);
  assert.equal(retention(30), 30);
  assert.equal(retention(0.5), 0.5, "a fraction of a day is a number of days too");
  assert.equal(retention(0), 0);
  assert.equal(retention(false), 0, "false is forever, as 0 is");
  for (const wrong of ["90", "90d", -1, true, Number.NaN, Infinity, [30], { days: 30 }]) {
    assert.throws(() => retention(wrong), /agent\.retention is the number of days an audit row is kept/, String(wrong));
  }
  assert.throws(() => agentConfig({ retenton: 30 }, ROUTES),
    /retenton - not a setting of the agent endpoint; it knows path, apps, confirm, forbidden and retention/);
});
