// How long cap2ui5.AgentLog keeps a row: cds.requires.cap2ui5.agent.retention
// days, 90 unless set, 0 or false for ever (config.test.mjs holds the
// setting). The endpoint deletes what is older on the way of an agent call -
// the way the draft store deletes expired drafts on an app start - at most
// once an hour per process and tenant; purgeAgentLog( ) is the same DELETE
// for a project's own scheduled job.
//
// The example switches the endpoint on with a retention of 30 days, so the
// rows on either side of the cutoff are the setting's and not the default's.
// The suite shares one database across processes that run at the same time,
// so the rows here have an owner of their own, and none is older than the
// 90 days another process's endpoint would delete.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import cds from "@sap/cds";
import { mcp, serve, toolCall } from "./server.mjs";

// before the plugin is required: what it requires reads cds.env, which CAP
// computes once
process.env.CDS_REQUIRES_CAP2UI5_AGENT = JSON.stringify({ apps: [], retention: 30 });

const require = createRequire(import.meta.url);
const { purgeAgentLog } = require("@cap2ui5/cds-plugin");
const audit = require("@cap2ui5/cds-plugin/lib/agent/audit.js");

const s = serve();
const url = () => s.url.replace(/\/rest\/root\/z2ui5$/, "/rest/root/z2ui5/mcp");
const OWNER = `retention-${process.pid}`;
const DAY = 24 * 3600 * 1000;

/** A log row of OWNER's, `days` old, marked `tag` in its message. */
async function row(tag, days) {
  const { AgentLog } = cds.entities("cap2ui5");
  await cds.run(cds.ql.INSERT.into(AgentLog).entries({
    ID: cds.utils.uuid(), owner: OWNER, tool: "app_list", outcome: "ok", message: tag,
    createdAt: new Date(Date.now() - days * DAY).toISOString(),
  }));
}

/** OWNER's rows that are left, by tag. */
async function left() {
  const { AgentLog } = cds.entities("cap2ui5");
  const rows = await cds.run(cds.ql.SELECT.from(AgentLog).columns("message").where({ owner: OWNER }));
  return rows.map((r) => r.message).sort();
}

test("retention 0 or false keeps every row - purgeAgentLog( ) deletes nothing", async () => {
  await cds.connect.to("db");
  await row("40 days", 40);
  assert.equal(await purgeAgentLog({ days: 0 }), 0);
  assert.equal(await purgeAgentLog({ days: false }), 0);
  await audit.sweep(0);                   // what an agent call runs with "retention": 0 (or false)
  assert.deepEqual(await left(), ["40 days"]);
  await assert.rejects(purgeAgentLog({ days: "30" }), /agent\.retention is the number of days/,
    "a job passing a wrong value is told so, as the setting is");
});

test("an agent call deletes the rows older than the retention and keeps the newer ones", async () => {
  await row("31 days", 31);
  await row("29 days", 29);
  await row("1 day", 1);
  // the first agent call of this process: it sweeps - every user's rows, as
  // the draft cleanup deletes every user's expired drafts
  const r = await mcp(url(), toolCall("app_list"), { user: "alice" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.ok(r.tool && !r.tool.error, r.text.slice(0, 300));
  assert.deepEqual(await left(), ["1 day", "29 days"], "31 and 40 days are past 30, 29 and 1 are not");
  assert.match(s.out(), /agent: [1-9]\d* audit rows? older than 30 days deleted/);
});

test("at most once an hour: the next call leaves an old row for the next sweep - or for purgeAgentLog( )", async () => {
  await row("35 days", 35);
  const r = await mcp(url(), toolCall("app_list"), { user: "alice" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.deepEqual(await left(), ["1 day", "29 days", "35 days"], "a second sweep within the hour");

  // the scheduled job's form: the retention of the setting unless it says another
  assert.ok(await purgeAgentLog() >= 1);
  assert.deepEqual(await left(), ["1 day", "29 days"]);
  // counted back from `now`: two days later the 29-day-old row is 31 days old
  assert.ok(await purgeAgentLog({ now: new Date(Date.now() + 2 * DAY) }) >= 1);
  assert.deepEqual(await left(), ["1 day"]);
  assert.ok(await purgeAgentLog({ days: 0.5 }) >= 1, "a fraction of a day counts");
  assert.deepEqual(await left(), []);
});
