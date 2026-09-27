// c.event( )'s placeholder has to survive what a view builder does to it.
//
// ZCL_JS_ESCAPED XML-escapes every attribute value before c.view( ), as
// abap2UI5's own Z2UI5_CL_UI5_VIEW_BUILDER does. The placeholder used to be
// the event as JSON between two NULs; the builder turned its quotes into
// &quot;, the substitution after main( ) no longer found it, and the raw NULs
// went out inside the response - which JSON.parse refuses, so the page got no
// view at all. These assertions hold the three halves of the fix: the token
// comes through escaping unchanged, the wire string that replaces it is itself
// escaped as an attribute value, and a token the app DID mangle is refused
// with an error naming c.event instead of being shipped.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { action, boot, post } from "./server.mjs";

let s;
before(async () => { s = await boot("escape"); });
after(() => s?.kill());

const P = (o) => post(s.url, { user: "alice", app: "ZCL_JS_ESCAPED", ...o });
const main = (r) => [
  ...(r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? []),
  ...(r.json?.S_FRONT?.S_ACTION?.T_CUSTOM ?? []),
].find((a) => a[0] === "VIEW_SLOTS" && a[1] === "display" && a[2] === "MAIN")?.[3];
const ARG = `a "quoted" <arg> & more`;

test("an escaped view still carries the real event, and the response is JSON", async () => {
  const start = await P({});
  assert.equal(start.status, 200, start.text.slice(0, 300));
  assert.ok(!start.text.includes("\u0000"), "a raw NUL shipped in the response");
  assert.doesNotThrow(() => JSON.parse(start.text), "the response is not valid JSON");
  const press = (main(start) ?? "").match(/press="[^"]*"/g) ?? [];
  assert.deepEqual(press, [
    `press=".eB(['GO'])"`,
    // the argument is escaped as an attribute value, as upstream's builder
    // escapes _event( )'s result - a raw quote would have ended the attribute
    `press=".eB(['TAKE'], 'a &quot;quoted&quot; &lt;arg&gt; &amp; more')"`,
  ]);
  assert.ok(!(main(start) ?? "").includes("z2ui5evt_"), "a placeholder was left in the view");

  const go = await P({ id: start.json.S_FRONT.ID, event: "GO" });
  assert.deepEqual(action(go)?.slice(0, 3), ["MESSAGE_BOX", "show", "escaped event arrived"]);
});

test("an argument with XML specials comes back as it was sent", async () => {
  const start = await P({});
  // what the browser sends once its XML parser has decoded the attribute
  const take = await P({ id: start.json.S_FRONT.ID, event: "TAKE", args: [ARG] });
  assert.equal(take.status, 200, take.text.slice(0, 300));
  assert.deepEqual(action(take)?.slice(0, 3), ["MESSAGE_BOX", "show", `took ${ARG}`]);
  assert.equal(take.json.MODEL.SAID, ARG);
});

test("a placeholder the app altered is refused, naming c.event, not shipped", async () => {
  const start = await P({});
  const broken = await P({ id: start.json.S_FRONT.ID, event: "BREAK" });
  assert.equal(broken.status, 500, broken.text.slice(0, 300));
  assert.ok(!broken.text.includes("z2ui5evt_"), "the placeholder reached the caller");
  assert.match(s.out(), /c\.event\( \): a placeholder it returned reached the view altered/);
});
