// cap2UI5 is a GUEST in the CAP project, not a host.
//
// This is the claim the whole plugin rests on and the reason it exists at all:
// that you can go on building ordinary CAP services beside your abap2UI5 apps,
// on the same entities, the same database and the same authorization. It was
// asserted in three documents and demonstrated nowhere, so here it is as a
// service the tests drive.
//
// srv/catalog-service.cds is that service. It is as plain as a CAP service
// gets - one projection, @requires: 'authenticated-user' - and nothing in it
// knows cap2UI5 exists.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { boot, post } from "./server.mjs";

const APP = "ZCL_JS_BOOKS";
const basic = (u) => "Basic " + Buffer.from(`${u}:`).toString("base64");
let s;
before(async () => { s = await boot("coexistence"); });
after(() => s?.kill());

const odata = (path, { user, method = "GET", body } = {}) =>
  fetch(`http://127.0.0.1:${s.port}/odata/v4/catalog${path}`, {
    method,
    headers: {
      ...(user ? { Authorization: basic(user) } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

test("the OData service and the cap2UI5 route answer to the same authorization", async () => {
  assert.equal((await odata("/Books", { user: "alice" })).status, 200);
  assert.equal((await odata("/Books")).status, 401, "the plain CAP service refuses an anonymous read");

  const anon = await post(s.url, { app: APP });
  assert.equal(anon.status, 401, "and so does the z2ui5 route - one auth, two doors");
  const known = await post(s.url, { app: APP, user: "alice" });
  assert.equal(known.status, 200, known.text.slice(0, 200));
});

test("the plugin's own entity is NOT exposed by the project's service", async () => {
  // cap2ui5.Drafts is in the project's MODEL - cds deploy creates the table -
  // but a service only exposes what it projects. Session state leaking through
  // somebody's OData service would be the worst kind of surprise, so it is
  // asserted rather than assumed.
  const r = await odata("/Drafts", { user: "alice" });
  assert.equal(r.status, 404, "cap2ui5.Drafts must not be reachable through CatalogService");

  const meta = await (await odata("/$metadata", { user: "alice" })).text();
  assert.ok(!/Draft/i.test(meta), `the service metadata names a draft entity:\n${meta.slice(0, 400)}`);
});

test("a row written by a cap2UI5 app is there for the OData client, and the other way round", async () => {
  // --- the app writes, OData reads
  const start = await post(s.url, { app: APP, user: "alice" });
  const title = `written-by-the-app-${Date.now()}`;
  const added = await post(s.url, {
    app: APP, id: start.json.S_FRONT.ID, event: "ADD",
    model: { SEARCH: title, HITS: 0, BOOKS: [] }, user: "alice" });
  assert.equal(added.status, 200, added.text.slice(0, 300));

  const seen = await (await odata(`/Books?$filter=title eq '${title}'`, { user: "alice" })).json();
  assert.equal(seen.value?.length, 1, `OData does not see the app's row: ${JSON.stringify(seen).slice(0, 300)}`);
  assert.equal(seen.value[0].author, "the app");

  // --- OData writes, the app reads
  const mine = `written-by-odata-${Date.now()}`;
  const post_ = await odata("/Books", {
    user: "alice", method: "POST",
    body: { ID: 90000 + (Date.now() % 1000), title: mine, author: "odata", stock: 1, price: 2 },
  });
  assert.ok(post_.ok, `OData insert failed: ${post_.status} ${(await post_.text()).slice(0, 200)}`);

  const search = await post(s.url, {
    app: APP, id: added.json.S_FRONT.ID, event: "SEARCH",
    model: { SEARCH: mine }, user: "alice" });
  assert.equal(search.status, 200, search.text.slice(0, 300));
  assert.equal(search.json.MODEL.HITS, 1, "the app does not see the OData row");
  assert.equal(search.json.MODEL.BOOKS[0].AUTHOR, "odata");
});
