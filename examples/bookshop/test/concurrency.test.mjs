// Several users at once, in ONE process. The transpiled framework keeps
// CLASS-DATA in JavaScript statics, which on Node are process-global and
// shared between requests that interleave at every await - on an ABAP server
// each request had a session of its own. The per-request buffer in
// z2ui5_cl_ui5_app_cont is the obvious candidate. This runs three users'
// roundtrips concurrently, twice, and checks every answer went to its owner.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { action, boot, post } from "./server.mjs";

const APP = "ZCL_JS_HELLO";
const USERS = ["alice", "bob", "carol"];
let s;
before(async () => { s = await boot("concurrency"); });
after(() => s?.kill());

test("three users' roundtrips interleaved in one process each get their own answer", async () => {
  for (let round = 0; round < 2; round++) {
    const starts = await Promise.all(USERS.map((user) => post(s.url, { app: APP, user })));
    const ids = starts.map((r, i) => {
      assert.equal(r.status, 200, `${USERS[i]} start: ${r.text.slice(0, 200)}`);
      return r.json.S_FRONT.ID;
    });
    assert.equal(new Set(ids).size, USERS.length, "every user got a draft of their own");

    const answers = await Promise.all(USERS.map((user, i) =>
      post(s.url, { app: APP, id: ids[i], event: "GO", model: { NAME: user }, user })));
    answers.forEach((r, i) => {
      assert.equal(r.status, 200, `${USERS[i]} event: ${r.text.slice(0, 200)}`);
      assert.deepEqual(action(r)?.slice(0, 3), ["MESSAGE_BOX", "show", `Hello ${USERS[i]}`], USERS[i]);
    });
  }
});
