// Who an agent may operate, and what it may fire (plugin/lib/agent/policy.js),
// read without a server: defineApp( )'s option agent, the project's
// settings, and the rule that the stricter of the two wins. agent.test.mjs is
// the same on the wire.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { before, test } from "node:test";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { locate } = require("@cap2ui5/cds-plugin/lib/runtime");
const { defineApp } = require("@cap2ui5/cds-plugin");
const { agentConfig, reachable, reachableApps, classify } = require("@cap2ui5/cds-plugin/lib/agent/policy");

before(async () => {
  const { initializeABAP } = await import(pathToFileURL(locate().init).href);
  await initializeABAP();
  defineApp("ZCL_AG_OPEN", class { main() {} }, { agent: true });
  defineApp("ZCL_AG_RULES", class { main() {} }, { agent: { events: { SAVE: "confirm", "DELETE*": "forbidden", "*": "allowed" } } });
  defineApp("ZCL_AG_NEVER", class { main() {} }, { agent: false });
  defineApp("ZCL_AG_SILENT", class { main() {} });
});

const conf = (agent) => agentConfig({ apps: [], ...agent }, ["/sap/bc/z2ui5", "/rest/root/z2ui5"]);

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
  assert.match(reachable("Z2UI5_CL_UTIL", conf({ apps: ["*"] })).reason, /is no app of this server/);
  assert.ok(!reachableApps(conf({ apps: ["*"] })).some((a) => a.app === "Z2UI5_CL_UTIL"));
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

test("a wrong option is refused when the app is defined - and nothing is registered", () => {
  assert.throws(() => defineApp("ZCL_AG_BAD1", class { main() {} }, { agent: { events: { SAVE: "forbiden" } } }),
    /defineApp\(ZCL_AG_BAD1\): option agent\.events\.SAVE: "forbiden" - an event is allowed, confirm, forbidden/);
  assert.throws(() => defineApp("ZCL_AG_BAD2", class { main() {} }, { agent: { event: {} } }), /event - it knows events and description/);
  assert.throws(() => defineApp("ZCL_AG_BAD3", class { main() {} }, { agent: "yes" }), /is true, false or \{ events, description \}/);
  assert.throws(() => defineApp("ZCL_AG_BAD4", class { main() {} }, { agent: { events: ["SAVE"] } }), /maps an event/);
  for (const n of ["ZCL_AG_BAD1", "ZCL_AG_BAD2", "ZCL_AG_BAD3", "ZCL_AG_BAD4"]) assert.equal(abap.Classes[n], undefined);
});
