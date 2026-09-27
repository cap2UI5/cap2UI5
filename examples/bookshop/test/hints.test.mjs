// The startup hints: after `npm add cap2ui5` and `cds watch`, the log names
// every app with the address that starts it and the development login - so
// the first screen needs no documentation. The text is a pure function
// (plugin/lib/hints.js) and is pinned here case by case; the last test boots
// the example and reads the log, because the timing is the part a pure test
// cannot see: the server listens BEFORE the apps have loaded, and a hint
// printed on "listening" alone would list none of them.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { setTimeout as sleep } from "node:timers/promises";
import { boot } from "./server.mjs";

const { startupHints, loginHint } = createRequire(import.meta.url)("cap2ui5/lib/hints.js");

const MOCKED = { kind: "mocked", users: { "*": true, alice: { roles: ["admin"] }, bob: {} } };
const base = {
  apps: ["HELLO", "ZCL_BOOKS"],
  url: "http://localhost:4004",
  route: "/sap/bc/z2ui5",
  appsDir: "srv/apps",
  auth: MOCKED,
  requires: "authenticated-user",
};

test("one line per app with the address that starts it, then the development login", () => {
  assert.deepEqual(startupHints(base), [
    "[cap2ui5] HELLO      http://localhost:4004/sap/bc/z2ui5?app_start=HELLO",
    "[cap2ui5] ZCL_BOOKS  http://localhost:4004/sap/bc/z2ui5?app_start=ZCL_BOOKS",
    "[cap2ui5] development login: alice (empty password)",
  ]);
});

test("nothing in production", () => {
  assert.deepEqual(startupHints({ ...base, production: true }), []);
});

test("no login line when the route lets anybody in, or the auth kind has no users to name", () => {
  assert.equal(startupHints({ ...base, requires: null }).some((l) => l.includes("login")), false);
  assert.equal(loginHint({ kind: "dummy" }), null);
  assert.equal(loginHint({ kind: "xsuaa" }), null);
  assert.equal(loginHint({ kind: "mocked", users: { "*": true } }), null);
});

test("a configured password is shown, the wildcard entry is not a user", () => {
  assert.equal(loginHint({ kind: "basic", users: { "*": true, dev: { password: "dev" } } }), "dev / dev");
});

test("without JavaScript apps the hint says where they go", () => {
  const [line] = startupHints({ ...base, apps: [] });
  assert.match(line, /no JavaScript apps yet - add one in srv\/apps\//);
  assert.match(line, /http:\/\/localhost:4004\/sap\/bc\/z2ui5/);
});

test("a trailing slash on the server URL does not double", () => {
  assert.match(startupHints({ ...base, url: "http://localhost:4004/" })[0], /4004\/sap\/bc\/z2ui5\?/);
});

let s;
after(() => s?.kill());

test("the booted example prints its apps and the login once they have loaded", async () => {
  s = await boot("hints");
  const want = [
    /\[cap2ui5\] ZCL_JS_HELLO\s+http:\/\/\S+\/sap\/bc\/z2ui5\?app_start=ZCL_JS_HELLO/,
    /\[cap2ui5\] ZCL_JS_BOOKS\s+http:\/\/\S+\/sap\/bc\/z2ui5\?app_start=ZCL_JS_BOOKS/,
    /\[cap2ui5\] development login: alice \(empty password\)/,
  ];
  for (let i = 0; i < 20 && !want.every((re) => re.test(s.out())); i++) await sleep(250);
  for (const re of want) assert.match(s.out(), re);
});
