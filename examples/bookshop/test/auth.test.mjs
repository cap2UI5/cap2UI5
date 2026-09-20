// The owner binding, end to end: a draft belongs to the CAP user who created
// it, and anybody else gets the same "not found" a missing draft gets.
//
// This test exists because the first plugin got it wrong without noticing:
// the route was mounted straight on express, cds.context never existed there,
// and every draft was stored as "anonymous" - alice's draft answered to bob.
// cds.middlewares.before on the route is what fixes it; this is the proof.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import cds from "@sap/cds";
import { action, boot, post } from "./server.mjs";

const APP = "ZCL_JS_HELLO";
let s;
let draftId;                       // created by alice below, checked in the database last
before(async () => { s = await boot("auth"); });
after(() => s?.kill());

test("without credentials the route asks for a login", async () => {
  const r = await post(s.url, { app: APP });
  assert.equal(r.status, 401);
});

test("a draft answers to its creator and to nobody else", async () => {
  const start = await post(s.url, { app: APP, user: "alice" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  const id = draftId = start.json.S_FRONT.ID;
  assert.match(id, /^[0-9A-F]{32}$/);

  // bob, with alice's draft id: the framework must not find it.
  const bob = await post(s.url, { app: APP, id, event: "GO", model: { NAME: "Ada" }, user: "bob" });
  assert.ok(!bob.text.includes("Hello Ada"), "bob was served alice's draft");
  assert.match(bob.text, /NO_DRAFT_ENTRY_OF_PREVIOUS_REQUEST_FOUND/);

  // alice herself: the draft is there and the app answers.
  const alice = await post(s.url, { app: APP, id, event: "GO", model: { NAME: "Ada" }, user: "alice" });
  assert.equal(alice.status, 200, alice.text.slice(0, 300));
  assert.deepEqual(action(alice)?.slice(0, 3), ["MESSAGE_BOX", "show", "Hello Ada"]);
});

test("a draft whose owner column is empty belongs to nobody, not to everybody", async () => {
  // The ownership checks used to read `if (r.owner && r.owner !== who())`, so a
  // row with an empty owner passed all three of them and was served to whoever
  // presented its id. Measured before this test existed: bob sent alice's id
  // against a blanked row and was answered "Hello Ada".
  //
  // An empty owner is not hypothetical. `?? ` catches null and undefined but
  // not "", and cds.User permits an empty id; and cap2ui5.Drafts is an ordinary
  // entity in the project's model, so rows can also arrive from a seed, a
  // migration or another handler with no owner at all.
  const start = await post(s.url, { app: APP, user: "alice" });
  const id = start.json.S_FRONT.ID;

  await cds.connect.to("db");
  await cds.run("UPDATE cap2ui5_Drafts SET owner = '' WHERE id = ?", [id]);
  const [blanked] = await cds.run("SELECT owner FROM cap2ui5_Drafts WHERE id = ?", [id]);
  assert.equal(blanked.owner, "", "the row under test is not the one that was blanked");

  const bob = await post(s.url, { app: APP, id, event: "GO", model: { NAME: "Ada" }, user: "bob" });
  assert.ok(!bob.text.includes("Hello Ada"), "bob was served a draft with an empty owner");
  assert.match(bob.text, /NO_DRAFT_ENTRY_OF_PREVIOUS_REQUEST_FOUND/);

  // and alice does not get it back either: the row is nobody's now, which is
  // the point - an ownerless draft is refused, not shared.
  const alice = await post(s.url, { app: APP, id, event: "GO", model: { NAME: "Ada" }, user: "alice" });
  assert.match(alice.text, /NO_DRAFT_ENTRY_OF_PREVIOUS_REQUEST_FOUND/);
});

test("the stored owner is the CAP user, not 'anonymous'", async () => {
  assert.ok(draftId, "no draft was created above");
  await cds.connect.to("db");
  const rows = await cds.run("SELECT owner FROM cap2ui5_Drafts WHERE id = ?", [draftId]);
  assert.deepEqual(rows.map((r) => r.owner), ["alice"]);
});
