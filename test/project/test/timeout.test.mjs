// One slow roundtrip is everybody's. Roundtrips run one at a time per process
// (cds-plugin.js, roundtrip( )), so a main( ) that awaits holds every other
// user's roundtrip behind it - and one that never settled held the process
// for good, with nothing in the log to say why every app stood still.
//
//   - an async main( ) may take cds.requires.cap2ui5.timeout milliseconds;
//     then its roundtrip is given up with a 504 and the next one runs;
//   - a roundtrip that waited a second or more for its turn says so in the log.
//
// A child process: the timeout is a setting only the environment can make.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { action, boot, post } from "./server.mjs";

const SLOW = "ZCL_JS_SLOW";
const HELLO = "ZCL_JS_HELLO";
let s;
before(async () => { s = await boot("timeout", { env: { CDS_REQUIRES_CAP2UI5_TIMEOUT: "1500" } }); });
after(() => s?.kill());

const start = async (app, user) => {
  const r = await post(s.url, { app, user });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  return r.json.S_FRONT.ID;
};

test("a roundtrip that waited behind a slow main( ) is answered - and the log names the wait", async () => {
  const slow = await start(SLOW, "alice");
  const hello = await start(HELLO, "bob");
  const waiting = post(s.url, { app: SLOW, id: slow, event: "WAIT", model: { MS: 1200 }, user: "alice" });
  const t0 = Date.now();
  const behind = await post(s.url, { app: HELLO, id: hello, event: "GO", model: { NAME: "bob" }, user: "bob" });
  assert.equal(behind.status, 200, behind.text.slice(0, 300));
  assert.deepEqual(action(behind)?.slice(0, 3), ["MESSAGE_BOX", "show", "Hello bob"]);
  assert.ok(Date.now() - t0 >= 1000, "bob's roundtrip ran after alice's, not inside it");
  const first = await waiting;
  assert.equal(first.status, 200, "within the limit, a slow main( ) is only slow");
  assert.deepEqual(action(first)?.slice(0, 3), ["MESSAGE_TOAST", "show", "waited 1200"]);
  assert.match(s.out(), /a roundtrip waited \d+ ms behind 1 other\(s\)/);
});

test("a main( ) over the limit is given up with a 504, and the next roundtrip runs", async () => {
  const slow = await start(SLOW, "alice");
  const hello = await start(HELLO, "bob");
  const t0 = Date.now();
  const late = post(s.url, { app: SLOW, id: slow, event: "WAIT", model: { MS: 20000 }, user: "alice" });
  const behind = post(s.url, { app: HELLO, id: hello, event: "GO", model: { NAME: "bob" }, user: "bob" });
  const r = await late;
  assert.equal(r.status, 504, r.text.slice(0, 300));
  assert.match(r.text, /^roundtrip timed out \([A-Za-z0-9._:-]+\)$/);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  const b = await behind;
  assert.equal(b.status, 200, b.text.slice(0, 300));
  assert.deepEqual(action(b)?.slice(0, 3), ["MESSAGE_BOX", "show", "Hello bob"]);
  assert.ok(Date.now() - t0 < 10000, "nobody waited for the 20 seconds main( ) asked for");
  assert.match(s.out(), /ZCL_JS_SLOW: main\( \) did not finish within 1500 ms/);

  // the draft of the roundtrip that was given up was never written: alice
  // carries on from the screen she had
  const again = await post(s.url, { app: SLOW, id: slow, event: "WAIT", model: { MS: 1 }, user: "alice" });
  assert.equal(again.status, 200, again.text.slice(0, 300));
  assert.deepEqual(action(again)?.slice(0, 3), ["MESSAGE_TOAST", "show", "waited 1"]);
});
