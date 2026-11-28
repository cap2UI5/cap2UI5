// examples/bookshop is what a reader copies from, and nothing else in the
// suite serves it - so it is started here, as a child of its own, and each of
// its apps is driven once. The apps the other tests drive are this project's
// fixtures; a change that breaks only the example fails here.
import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { TEST_PROJECT, boot, post, viewXml, action } from "./server.mjs";

const root = path.resolve(TEST_PROJECT, "..", "..", "examples", "bookshop");

test("examples/bookshop starts and every app in it answers", async () => {
  const s = await boot("examples/bookshop", { root });
  try {
    const P = (o) => post(s.url, { user: "alice", ...o });
    for (const [app, title] of [["ZCL_JS_HELLO", "JS app"], ["ZCL_JS_BOOKS", "Books"],
      ["ZCL_JS_BUILDER", "view builder"], ["ZCL_JS_PICK", "pick"]]) {
      const r = await P({ app });
      assert.equal(r.status, 200, `${app}: ${r.text.slice(0, 300)}`);
      assert.match(viewXml(r) ?? "", new RegExp(`cap2UI5 - ${title}`), app);
    }

    // the Books app reads the project's own entity
    const start = await P({ app: "ZCL_JS_BOOKS" });
    const hit = await P({ app: "ZCL_JS_BOOKS", id: start.json.S_FRONT.ID, event: "SEARCH", model: { SEARCH: "Raven" } });
    assert.equal(hit.json.MODEL.HITS, 1, hit.text.slice(0, 300));

    // and the hello app greets
    const hello = await P({ app: "ZCL_JS_HELLO" });
    const go = await P({ app: "ZCL_JS_HELLO", id: hello.json.S_FRONT.ID, event: "GO", model: { NAME: "Ada" } });
    assert.match(JSON.stringify(action(go)), /Hello Ada/);
  } finally {
    s.kill();
  }
});
