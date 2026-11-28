// What an app's read is checked against. The route lets in whoever holds one
// of cds.requires.cap2ui5.roles; what the app then reads is the app's
// business, as it is a handler's:
//
//   - through a CAP service (cds.connect.to), the service's authorization
//     applies to the roundtrip's user - the roundtrip runs behind CAP's
//     middlewares, so cds.context.user is the caller;
//   - straight from the database (cds.ql on cds.entities( )), no service's
//     authorization applies.
//
// The README says so; this is where it is measured. alice is an admin among
// CAP's mocked users, bob is not; AdminService requires `admin`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { action, post, serve } from "./server.mjs";

const APP = "ZCL_JS_VIA_SERVICE";
const s = serve();

const click = async (user, event) => {
  const start = await post(s.url, { app: APP, user });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  const r = await post(s.url, { app: APP, id: start.json.S_FRONT.ID, event, user });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  return action(r);
};

test("through a service, the service's @requires decides - for the user of the roundtrip", async () => {
  const admin = await click("alice", "SERVICE");
  assert.equal(admin[0], "MESSAGE_TOAST");
  assert.match(admin[2], /^\d+ through the service$/);
  assert.deepEqual((await click("bob", "SERVICE")).slice(0, 3),
    ["MESSAGE_BOX", "show", "You are not allowed to read the books"]);
});

test("straight from the database, no service is asked: whoever may open the app reads the table", async () => {
  for (const user of ["alice", "bob"]) {
    const a = await click(user, "DIRECT");
    assert.equal(a[0], "MESSAGE_TOAST", user);
    assert.match(a[2], /^\d+ from the database$/, user);
  }
});
