// The CDS draft store's counts, and when the framework cleans up.
//
// count_entries( ) and count_entries_total( ) are what the framework's start
// page shows, the caller's drafts and the size of the store. They loaded
// every id to take the length of the list; the database counts now, in one
// row, as the shipped store's SELECT COUNT( * ) does.
//
// cleanup( ) is the framework's to call, and it calls it on an app START
// (z2ui5_cl_ui5_handler->main_begin) - not on every roundtrip, as a comment
// in the store claimed. This pins what the store's comment now says.
//
// The example's database is shared by the test files running beside this
// one, so the owners here are this run's own, and the total is compared with
// a count of the same snapshot.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { test } from "node:test";
import cds from "@sap/cds";
import { post, serve } from "./server.mjs";

const require = createRequire(import.meta.url);
const { ZCL_CDS_DRAFT_STORE } = require("@cap2ui5/cds-plugin/lib/draft-store.js");
const { purgeDrafts } = require("@cap2ui5/cds-plugin");
const s = serve();

/** A draft store call as `user`, inside one transaction - one snapshot. */
const as = (user, fn) => cds.tx({ user: new cds.User({ id: user }) }, fn);

test("count_entries counts the caller's drafts and count_entries_total all of them - in the database", async () => {
  await cds.connect.to("db");
  const run = randomUUID().slice(0, 8);
  const [ann, ben] = [`ann-${run}`, `ben-${run}`];
  const rows = [ann, ann, ann, ben].map((owner, i) => ({
    id: `${run}${i}`.padEnd(32, "0"), owner, createdAt: new Date().toISOString(), data: "{}",
  }));
  const { Drafts } = cds.entities("cap2ui5");
  await cds.run(cds.ql.INSERT.into(Drafts).entries(rows));

  const store = await new ZCL_CDS_DRAFT_STORE().constructor_();
  const queries = [];
  const run_ = cds.run;
  cds.run = function (q, ...rest) { queries.push(q); return run_.call(this, q, ...rest); };
  try {
    const own = await as(ann, () => store.z2ui5_if_ui5_draft_store$count_entries());
    assert.ok(own instanceof abap.types.Integer, "the interface returns TYPE i");
    assert.equal(own.get(), 3);
    assert.equal((await as(ben, () => store.z2ui5_if_ui5_draft_store$count_entries())).get(), 1);
    assert.equal((await as(`nobody-${run}`, () => store.z2ui5_if_ui5_draft_store$count_entries())).get(), 0);

    const [total, counted] = await as(ann, async () => [
      (await store.z2ui5_if_ui5_draft_store$count_entries_total()).get(),
      (await run_.call(cds, cds.ql.SELECT.from(Drafts).columns("id"))).length,
    ]);
    assert.equal(total, counted, "count_entries_total is not the size of the store");
    assert.ok(total >= rows.length);
  } finally {
    cds.run = run_;
    await cds.run(cds.ql.DELETE.from(Drafts).where({ owner: { in: [ann, ben] } }));
  }
  // one row of one number per count, not a row per draft
  assert.equal(queries.length, 4);
  for (const q of queries) {
    assert.equal(q.SELECT?.one, true, JSON.stringify(q));
    assert.deepEqual(q.SELECT.columns.map((c) => c.func), ["count"], JSON.stringify(q.SELECT.columns));
  }
});

test("cleanup( ) runs when an app starts, not on the roundtrips of its events", async () => {
  const proto = ZCL_CDS_DRAFT_STORE.prototype;
  const cleanup = proto.z2ui5_if_ui5_draft_store$cleanup;
  let calls = 0;
  proto.z2ui5_if_ui5_draft_store$cleanup = function (...a) { calls++; return cleanup.apply(this, a); };
  try {
    const start = await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" });
    assert.equal(start.status, 200, start.text.slice(0, 300));
    assert.equal(calls, 1, "an app start did not clean up");
    const event = await post(s.url, { app: "ZCL_JS_HELLO", id: start.json.S_FRONT.ID, event: "GO",
      model: { NAME: "x" }, user: "alice" });
    assert.equal(event.status, 200, event.text.slice(0, 300));
    assert.equal(calls, 1, "an event cleaned up");
    await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" });
    assert.equal(calls, 2);
  } finally {
    proto.z2ui5_if_ui5_draft_store$cleanup = cleanup;
  }
});

// The framework cleans up when somebody opens an app, and only then. A
// project that wants the expired drafts gone on a schedule runs the same
// DELETE from a job of its own.
test("purgeDrafts( ) deletes the expired drafts, of every user, and answers how many", async () => {
  await cds.connect.to("db");
  const run = randomUUID().slice(0, 8);
  const { Drafts } = cds.entities("cap2ui5");
  const ago = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();
  const left = async () => (await cds.run(cds.ql.SELECT.from(Drafts).columns("id")
    .where({ owner: { in: [`ann-${run}`, `ben-${run}`] } }))).map((r) => r.id.slice(8)).sort();
  await cds.run(cds.ql.INSERT.into(Drafts).entries([
    { id: `${run}-ann-30h`, owner: `ann-${run}`, createdAt: ago(30), data: "{}" },
    { id: `${run}-ben-30h`, owner: `ben-${run}`, createdAt: ago(30), data: "{}" },
    { id: `${run}-ann-3h`, owner: `ann-${run}`, createdAt: ago(3), data: "{}" },
    { id: `${run}-ann-1h`, owner: `ann-${run}`, createdAt: ago(1), data: "{}" },
  ]));
  try {
    // no hours: the framework's expiry - the user exit's, which is 24 hours
    // in this project (srv/apps/exit.js) and 4 where no exit says otherwise
    assert.ok(await purgeDrafts() >= 2, "both thirty-hour-old drafts are counted");
    assert.deepEqual(await left(), ["-ann-1h", "-ann-3h"]);
    assert.equal(await purgeDrafts({ hours: 2 }), 1, "the three-hour-old draft, and nobody's younger one");
    assert.deepEqual(await left(), ["-ann-1h"]);
    for (const bad of [0, -1, "4", false]) {
      await assert.rejects(purgeDrafts({ hours: bad }), /purgeDrafts\( \{ hours \} \) takes the number of hours/);
    }
  } finally {
    await cds.run(cds.ql.DELETE.from(Drafts).where({ owner: { in: [`ann-${run}`, `ben-${run}`] } }));
  }
});

test("prune_chain( ) keeps a chain of drafts short: two rows per app session, however many clicks", async (t) => {
  // z2ui5_if_ui5_draft_store=>prune_chain, in the interface from abap2UI5
  // 1.151.0 on: the framework calls it after every save, and the store
  // deletes the one draft that fell out of the window - 2 by default
  // (the user exit's draft_keep_per_chain). Without it every click left a
  // row, a whole app state, until the expiry.
  if (!abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"].METHODS.PRUNE_CHAIN) return t.skip("no prune_chain( ) in this runtime's interface");
  await cds.connect.to("db");
  const { Drafts } = cds.entities("cap2ui5");
  const user = "erin";                                  // nobody else's drafts in the count
  const count = async () => Number((await cds.run(
    cds.ql.SELECT.one.from(Drafts).columns("count(*) as n").where({ owner: user }))).n);
  const before = await count();
  let r = await post(s.url, { app: "ZCL_JS_HELLO", user });
  const ids = [r.json.S_FRONT.ID];
  for (let i = 0; i < 5; i++) {
    r = await post(s.url, { app: "ZCL_JS_HELLO", id: r.json.S_FRONT.ID, event: "GO", model: { NAME: `n${i}` }, user });
    assert.equal(r.status, 200, r.text.slice(0, 300));
    ids.push(r.json.S_FRONT.ID);
  }
  assert.equal(await count() - before, 2, "six roundtrips of one app session left more than the window of two");
  const left = (await cds.run(cds.ql.SELECT.from(Drafts).columns("id").where({ owner: user, id: { in: ids } }))).map((d) => d.id);
  assert.deepEqual(left.sort(), ids.slice(-2).sort(), "the two kept are the newest two");
  // and the session goes on from the newest
  const next = await post(s.url, { app: "ZCL_JS_HELLO", id: ids.at(-1), event: "GO", model: { NAME: "Ada" }, user });
  assert.equal(next.status, 200);
});

test("a draft an app handed out a link to is kept: app_state_get_href( ) protects it from the pruning", async (t) => {
  // the other half of the test above. The link names this roundtrip's draft
  // and outlives the session, so the framework marks it (mt_draft_keep) -
  // when the APP asks for the link, not for the client's own up-front call
  if (!abap.Classes["Z2UI5_IF_UI5_DRAFT_STORE"].METHODS.PRUNE_CHAIN) return t.skip("no prune_chain( ) in this runtime's interface");
  await cds.connect.to("db");
  const { Drafts } = cds.entities("cap2ui5");
  const user = "frank";
  const P = (o) => post(s.url, { app: "ZCL_JS_HANDOVER", user, ...o });
  const start = await P({});
  const info = await P({ id: start.json.S_FRONT.ID, event: "INFO" });      // hands out the link
  assert.equal(info.status, 200, info.text.slice(0, 300));
  assert.match(info.json.MODEL.LINK, new RegExp(`z2ui5-xapp-state=${info.json.S_FRONT.ID}`));
  const later = [];
  let r = info;
  for (let i = 0; i < 4; i++) {
    r = await P({ id: r.json.S_FRONT.ID, event: "NOTHING" });
    later.push(r.json.S_FRONT.ID);
  }
  const left = (await cds.run(cds.ql.SELECT.from(Drafts).columns("id").where({ owner: user }))).map((d) => d.id);
  assert.ok(left.includes(info.json.S_FRONT.ID), "the draft the link names was pruned");
  // behind it the chain is pruned as ever: of the four that followed, the newest two are left
  assert.deepEqual(later.filter((id) => left.includes(id)), later.slice(-2));
});
