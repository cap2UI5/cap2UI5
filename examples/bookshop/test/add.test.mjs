// `cds add cap2ui5` - the first app, as other plugins offer theirs through
// cds add. The facet is a thin class over scaffold( ), which is what is
// tested here: cds-dk is not a dependency of this repository, and the class
// only exists while `cds add` runs.
//
// The last test serves what scaffold( ) wrote and plays it through: a first
// app that does not run would be worse than none.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { after, test } from "node:test";
import { EXAMPLE, action, boot, post } from "./server.mjs";

const { scaffold } = createRequire(import.meta.url)("cap2ui5/lib/add.js");

// inside the example, so the written app can require("cap2ui5") as a project's would
const scratch = fs.mkdtempSync(path.join(EXAMPLE, "test", "fixtures", ".add-"));
after(() => fs.rmSync(scratch, { recursive: true, force: true }));

test("writes srv/apps/hello.js into a project without apps", () => {
  const root = fs.mkdtempSync(path.join(scratch, "empty-"));
  assert.equal(scaffold(root, { apps: "srv/apps" }), path.join("srv", "apps", "hello.js"));
  assert.match(fs.readFileSync(path.join(root, "srv", "apps", "hello.js"), "utf8"), /defineApp\("HELLO"/);
});

test("leaves a project that has an app alone", () => {
  const root = fs.mkdtempSync(path.join(scratch, "has-app-"));
  fs.mkdirSync(path.join(root, "srv", "apps"), { recursive: true });
  fs.writeFileSync(path.join(root, "srv", "apps", "mine.js"), "// an app\n");
  assert.equal(scaffold(root, { apps: "srv/apps" }), null);
  assert.deepEqual(fs.readdirSync(path.join(root, "srv", "apps")), ["mine.js"]);
});

test("follows the configured apps directory", () => {
  const root = fs.mkdtempSync(path.join(scratch, "custom-"));
  assert.equal(scaffold(root, { apps: "app/js" }), path.join("app", "js", "hello.js"));
});

test("the app it writes runs: renders, and answers its event", async () => {
  const root = fs.mkdtempSync(path.join(scratch, "served-"));
  scaffold(root, { apps: "apps" });
  const s = await boot("scaffolded", { env: { CDS_REQUIRES_CAP2UI5_APPS: path.join(root, "apps") } });
  try {
    const start = await post(s.url, { app: "HELLO", user: "alice" });
    assert.equal(start.status, 200, start.text.slice(0, 300));
    assert.equal(start.json.MODEL.NAME, "World");
    const go = await post(s.url, { app: "HELLO", id: start.json.S_FRONT.ID, event: "SAY_HELLO",
      model: { NAME: "Ada" }, user: "alice" });
    assert.deepEqual(action(go)?.slice(0, 3), ["MESSAGE_TOAST", "show", "Hello Ada!"]);
  } finally {
    s.kill();
  }
});
