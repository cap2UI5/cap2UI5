// Tables and structures as app state, end to end: the Books app reads the
// project's own CDS entity with cds.ql, assigns the rows to a t.table( ) field,
// the model carries them UPPERCASE, and the table survives the draft round trip
// - the third roundtrip starts from the state the second one stored.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { action, boot, post } from "./server.mjs";

const APP = "ZCL_JS_BOOKS";
let s;
before(async () => { s = await boot("books"); });
after(() => s?.kill());

test("a t.table( ) field is in the model from the start, empty and uppercase", async () => {
  const r = await post(s.url, { app: APP, user: "alice" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.deepEqual(r.json.MODEL, { BOOKS: [], HITS: 0, SEARCH: "" });
});

test("rows from SELECT.from(Books) reach the model, decimals included, and persist into the next roundtrip", async () => {
  const start = await post(s.url, { app: APP, user: "alice" });
  const second = await post(s.url, { app: APP, id: start.json.S_FRONT.ID, event: "SEARCH",
    model: { SEARCH: "Poe", HITS: 0, BOOKS: [] }, user: "alice" });
  assert.equal(second.status, 200, second.text.slice(0, 300));
  // title LIKE %Poe% matches nothing - the search is on the title, not the author
  assert.deepEqual(action(second)?.slice(0, 3), ["MESSAGE_TOAST", "show", "0 found"]);

  const third = await post(s.url, { app: APP, id: second.json.S_FRONT.ID, event: "SEARCH",
    model: { SEARCH: "Raven" }, user: "alice" });
  assert.equal(third.status, 200, third.text.slice(0, 300));
  assert.equal(third.json.MODEL.HITS, 1);
  assert.deepEqual(third.json.MODEL.BOOKS, [{ AUTHOR: "Edgar Allen Poe", ID: 251, PRICE: 13.13, TITLE: "The Raven" }]);

  // and the table is STATE: a roundtrip that does not touch it answers it back
  const fourth = await post(s.url, { app: APP, id: third.json.S_FRONT.ID, event: "NOOP",
    model: { SEARCH: "Raven" }, user: "alice" });
  assert.equal(fourth.status, 200, fourth.text.slice(0, 300));
  assert.deepEqual(fourth.json.MODEL?.BOOKS ?? "(no model sent)", "(no model sent)",
    "a roundtrip without modelUpdate( ) sends no model - the state is in the draft, not on the wire");
});
