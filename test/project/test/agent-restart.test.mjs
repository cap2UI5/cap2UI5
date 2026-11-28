// What an agent session is after the server restarts - a test about the
// PROCESS, so the server is a child (boot( )), killed and booted again on
// the same database.
//
// The drafts are a CDS entity and survive; the app client's memory of a
// session - the views, the pending edits, the last answer - does not. A
// session this process does not know is restored from its draft, as the
// handover link restores it for a human: app_describe answers the restored
// screen under a new session id, app_act sends nothing and names it. Only
// for the user whose agent reached the session (the audit log says so).
import assert from "node:assert/strict";
import { test } from "node:test";
import { boot, mcp, toolCall } from "./server.mjs";

const env = { CDS_REQUIRES_CAP2UI5_AGENT: JSON.stringify({ apps: [] }) };
const call = async (server, name, args, user = "alice") => {
  const r = await mcp(server.url.replace(/z2ui5$/, "z2ui5/mcp"), toolCall(name, args), { user });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  return r.tool;
};

test("after a restart a session is restored from its draft - for its user, once, under a new id", async () => {
  let server = await boot("agent before restart", { env });
  let start, found, next;
  try {
    start = (await call(server, "app_start", { app: "ZCL_JS_BOOKS" })).json;
    found = (await call(server, "app_act", { session: start.session, values: { SEARCH: "Raven" }, event: "SEARCH" })).json;
    assert.equal(found.tables[0].rowCount, 1);
  } finally {
    server.kill();
  }

  server = await boot("agent after restart", { env, port: server.port });
  try {
    // bob's agent never reached it: unknown to him, as before the restart
    const bob = await call(server, "app_describe", { session: found.session }, "bob");
    assert.ok(bob.error);
    assert.match(bob.text, /^unknown session/);

    // alice's: restored - the screen the draft holds, the rows included
    const back = await call(server, "app_describe", { session: found.session });
    assert.ok(!back.error, back.text);
    assert.notEqual(back.json.session, found.session);
    assert.equal(back.json.app, "ZCL_JS_BOOKS");
    assert.equal(back.json.fields[0].value, "Raven");
    assert.deepEqual(back.json.tables[0].rows.map((r) => r.TITLE), ["The Raven"]);
    assert.equal(back.json.actions.find((a) => a.event === "ADD").policy, "confirm");
    assert.match(server.out(), /agent: session \w+ of alice restored from its draft/);

    // the old id is an earlier state now, and the session before it was one already
    const stale = await call(server, "app_act", { session: found.session, event: "SEARCH" });
    assert.match(stale.text, new RegExp(`earlier state.*'${back.json.session}'`));
    const older = await call(server, "app_describe", { session: start.session });
    assert.match(older.text, new RegExp(`earlier state.*'${found.session}'`));

    // and the restored one is a session like any other
    next = await call(server, "app_act", { session: back.json.session, values: { SEARCH: "Eleonora" }, event: "SEARCH" });
    assert.ok(!next.error, next.text);
    assert.deepEqual(next.json.tables[0].rows.map((r) => r.TITLE), ["Eleonora"]);
  } finally {
    server.kill();
  }

  server = await boot("agent after a second restart", { env, port: server.port });
  try {
    // app_act on a lost session restores it, but sends nothing: the screen the
    // agent chose its action on is not the one in front of it now
    const act = await call(server, "app_act", { session: next.json.session, values: { SEARCH: "x" }, event: "SEARCH" });
    assert.ok(act.error);
    const [, restored] = /restored from its draft as session '(\w+)'\. Nothing was sent/.exec(act.text) ?? [];
    assert.ok(restored, act.text);
    const screen = await call(server, "app_describe", { session: restored });
    assert.equal(screen.json.fields[0].value, "Eleonora", "the refused call's values were applied");
  } finally {
    server.kill();
  }
});
