// The user exit, over the wire.
//
// This is the extension point that decides the Content-Security-Policy, the
// security headers, the UI5 bootstrap URL, the theme, the draft expiry and the
// CSRF gate - so "is it reachable at all" is a security question, not a
// convenience one. Under the transpiled runtime it was NOT: upstream finds the
// exit by asking the class repository which classes implement
// Z2UI5_IF_UI5_EXIT, open-abap has no such repository, the lookup raises, and
// the CATCH cx_root around it turns that into "no exit configured". Measured
// before defineExit( ) existed: get_user_exit_class( ) answered the empty
// string with an exit class registered in abap.Classes.
//
// srv/apps/exit.js is the project's exit; these are its effects.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import cds from "@sap/cds";
import { boot, post } from "./server.mjs";

const AUTH = { Authorization: "Basic " + Buffer.from("alice:").toString("base64") };
let s;
before(async () => { s = await boot("exit"); });
after(() => s?.kill());

const page = (app) => fetch(`${s.url}?app_start=${app}`, { headers: AUTH });

test("the exit is installed, not discovered - and it says so once", async () => {
  assert.match(s.out(), /\[cap2ui5\] user exit installed/);
});

test("onPage changes what the bootstrap page carries", async () => {
  const r = await page("ZCL_JS_BOOKS");
  assert.equal(r.status, 200);
  const html = await r.text();
  assert.ok(html.includes("sap_horizon_dark"), "the exit's theme is not on the page");
});

test("the context is per request: the same exit answers differently per app", async () => {
  const html = await (await page("ZCL_JS_HELLO")).text();
  assert.ok(!html.includes("sap_horizon_dark"), "ZCL_JS_HELLO should have got the light theme");
  assert.ok(html.includes("sap_horizon"), "no theme at all on the page");
});

test("a header the exit ADDS rides along with the seven it did not touch", async () => {
  const r = await page("ZCL_JS_BOOKS");
  assert.equal(r.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
  // the framework's own defaults are still there - the exit appended, and the
  // wrapper writes back only what changed
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.equal(r.headers.get("x-frame-options"), "SAMEORIGIN");
});

test("the security headers are on the roundtrip response too, not only the page", async () => {
  const r = await fetch(s.url, {
    method: "POST",
    headers: { ...AUTH, "Content-Type": "application/json" },
    body: JSON.stringify({ value: { S_FRONT: { ID: "", APP: "ZCL_JS_HELLO", EVENT: "", T_EVENT_ARG: [],
      ORIGIN: "http://127.0.0.1", PATHNAME: "/rest/root/z2ui5", SEARCH: "?app_start=ZCL_JS_HELLO",
      HASH: "", CONFIG: {} }, XX: {}, MODEL: {} } }),
  });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
});

test("what the exit did NOT change keeps the framework's default - CSRF stays armed", async () => {
  const r = await fetch(s.url, {
    method: "POST",
    headers: { ...AUTH, "Content-Type": "application/json", Origin: "https://evil.example" },
    body: JSON.stringify({ value: { S_FRONT: { ID: "", APP: "ZCL_JS_HELLO", EVENT: "", T_EVENT_ARG: [],
      ORIGIN: "https://evil.example", PATHNAME: "/rest/root/z2ui5", SEARCH: "", HASH: "", CONFIG: {} },
      XX: {}, MODEL: {} } }),
  });
  assert.equal(r.status, 403, "a cross-origin POST was accepted");
});

test("the apps still run with an exit installed", async () => {
  const r = await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
});

// The cleanup deletes rows on the clock the exit sets, not on a hard-coded
// one. It used to be hard-coded at 4 hours: with this project's exit asking
// for 24, the framework would have RESUMED a 20-hour-old draft that the
// cleanup had already deleted. Rather than wait 4 hours, the test plants two
// rows with an old createdAt and watches which side of the line each falls on.
test("cleanup follows the exit's draft_exp_time_in_hours, not a fixed 4 hours", async () => {
  await cds.connect.to("db");
  const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();
  const expired = "T".repeat(32);          // 30h old: past a 24h expiry
  const alive = "U".repeat(32);            //  6h old: past 4h, inside 24h

  await cds.run("DELETE FROM cap2ui5_Drafts WHERE id IN (?, ?)", [expired, alive]);
  await cds.run(
    "INSERT INTO cap2ui5_Drafts (id, owner, createdAt, data) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
    [expired, "alice", hoursAgo(30), "{}", alive, "alice", hoursAgo(6), "{}"]);

  // any roundtrip runs cleanup( )
  await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" });
  await new Promise((r) => setTimeout(r, 500));

  const left = (await cds.run("SELECT id FROM cap2ui5_Drafts WHERE id IN (?, ?)", [expired, alive]))
    .map((r) => r.id);
  assert.ok(!left.includes(expired), "a 30-hour-old draft survived a 24-hour expiry");
  assert.ok(left.includes(alive), "a 6-hour-old draft was deleted - the cleanup is still on 4 hours");
});
