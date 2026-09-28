// c.bind( ) with _bind( )'s options. Without options a binding is resolved
// before main( ) runs; with them the framework has to register it, so it is a
// placeholder until main( ) returns - these tests check what each option does
// to the view AND to the model, which is where omitInitial and json act. The
// fixture is srv/apps/binds.js.
import assert from "node:assert/strict";
import { test } from "node:test";
import { post, serve } from "./server.mjs";

const APP = "ZCL_JS_BINDS";
const s = serve();
const P = (o) => post(s.url, { user: "alice", ...o });
const mainView = (r) => (r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? [])
  .find((a) => a[0] === "VIEW_SLOTS" && a[2] === "MAIN")?.[3] ?? "";

test("{ path: true } is the bare path a composed binding needs", async () => {
  const r = await P({ app: APP });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.match(mainView(r), /items="\{path: '\/ROWS', templateShareable: false\}"/);
});

test("the bare path the facade derives is the one _bind( path = abap_true ) answers", async () => {
  // Without other options the facade strips the braces off the binding it
  // resolved before main( ) - finalize_path( ) adds nothing else. With one,
  // the framework answers itself. Both forms, one field: they must agree.
  const xml = mainView(await P({ app: APP }));
  const text = (id) => xml.match(new RegExp(`<Text id="${id}" text="([^"]*)"`))?.[1];
  assert.equal(text("bare"), "/OMITTED");
  assert.equal(text("bare"), text("bare_abap"));
});

test("row and column bind one cell, and an edit of it reaches the table", async () => {
  const r = await P({ app: APP });
  assert.match(mainView(r), /<Input id="cell" value="\{\/ROWS\/1\/TITLE\}"\/>/);

  // the browser writes the cell back into the model it was bound in
  const rows = r.json.MODEL.ROWS.map((row, i) => (i === 1 ? { ...row, TITLE: "edited" } : row));
  const saved = await P({ app: APP, id: r.json.S_FRONT.ID, event: "SAVE", model: { ROWS: rows } });
  assert.equal(saved.json.MODEL.SAVED, "first,edited");
});

test("omitInitial leaves initial values out of the model, omitInitialPaths only the named ones", async () => {
  const r = await P({ app: APP });
  assert.deepEqual(r.json.MODEL.OMITTED, [
    { LABEL: "no max" },
    { LABEL: "max 3", MAXVALUE: 3, NOTE: "rated" },
  ]);
  assert.deepEqual(r.json.MODEL.SOME_OMITTED, [
    { LABEL: "no max", NOTE: "" },
    { LABEL: "max 3", MAXVALUE: 3, NOTE: "rated" },
  ]);
});

test("{ json: true } splices the string into the model as the JSON it holds", async () => {
  const r = await P({ app: APP });
  assert.deepEqual(r.json.MODEL.CONFIG, { title: "From JSON", "sap.app": { id: "z2ui5.demo" } });
  assert.match(mainView(r), /<Text id="json" text="\{\/CONFIG\/title\}"\/>/);
});

test("the options stay registered on a roundtrip that does not render", async () => {
  const r = await P({ app: APP });
  const again = await P({ app: APP, id: r.json.S_FRONT.ID, event: "SAVE" });
  assert.equal(again.status, 200, again.text.slice(0, 300));
  assert.equal(mainView(again), "", "SAVE renders nothing");
  assert.deepEqual(again.json.MODEL.OMITTED?.[0], { LABEL: "no max" });
  assert.equal(typeof again.json.MODEL.CONFIG, "object");
});
