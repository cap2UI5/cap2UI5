// The start waits for the apps, as CAP waits for a service implementation.
// CAP awaits 'served' handlers - and only those - before it listens, and the
// plugin loads the runtime and the apps inside one.
//
// Before, the runtime booted beside the server's own start. The server
// listened first, a broken app module was one log line, and every roundtrip
// afterwards answered 500. Measured with an app module that throws on load.
import assert from "node:assert/strict";
import { test } from "node:test";
import { boot, post } from "./server.mjs";

test("an app module that cannot load fails the start, as a broken service implementation does", async () => {
  await assert.rejects(
    boot("broken apps", { env: { CDS_REQUIRES_CAP2UI5_APPS: "test/fixtures/broken-apps" } }),
    (e) => {
      assert.match(e.message, /died/, "the server did not stop");
      assert.match(e.message, /this app module is broken on purpose/, "the cause is not in the output");
      assert.doesNotMatch(e.message, /server listening/, "the server listened with an app missing");
      return true;
    },
  );
});

test("an app module may read the model while it loads", async () => {
  // The apps load once CAP has served the model, not while it is still
  // loading it - so cds.entities( ) at the top of an app module answers, as it
  // does at the top of a service implementation.
  const s = await boot("model at load", { env: { CDS_REQUIRES_CAP2UI5_APPS: "test/fixtures/model-at-load" } });
  try {
    const r = await post(s.url, { app: "ZCL_JS_MODEL_AT_LOAD", user: "alice" });
    assert.equal(r.status, 200, r.text.slice(0, 300));
    assert.equal(r.json.MODEL.ENTITY, "my.bookshop.Books");
  } finally {
    s.kill();
  }
});

test("the user exit is installed, not discovered - once, and before the server listens", async () => {
  const s = await boot("exit at start");
  try {
    // The apps and the exit load inside CAP's 'served' phase, which CAP awaits
    // before it listens - so the line is in the log by the time boot( ) returns,
    // ahead of "server listening". It used to race with the listen and land on
    // either side of it run to run (measured: both orders), which is why this
    // test once had to send a request before it could look.
    const out = s.out();
    assert.equal(out.match(/\[cap2ui5\] - user exit installed/g)?.length, 1, out.slice(-1500));
    assert.ok(out.indexOf("user exit installed") < out.indexOf("server listening"), "the server listened before the exit was bound");
    const r = await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" });
    assert.equal(r.status, 200, r.text.slice(0, 200));
  } finally {
    s.kill();
  }
});
