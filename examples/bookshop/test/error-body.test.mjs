// What a 500 body may carry of the request: nothing the backend did not
// validate. abap2UI5/protocol decided it (spec/open-questions.md, question 3):
// a backend MUST NOT reflect request data it did not validate into the error
// body - the URL is stripped to safe characters, as the class name already is.
//
// A 500 on this route has two authors, and each half of this file holds one:
//
//   - cap2UI5's own catch in cds-plugin.js `roundtrip`, which answers
//     "roundtrip failed (<ref>)" when an app's JavaScript throws. The ref is
//     the correlation id, which CAP takes from the request's x-correlation-id
//     header - client data, so it is stripped before it reaches the body.
//   - the framework's handler (z2ui5_cl_ui5_handler->request_context_info),
//     whose first frame names the client's url (S_FRONT PATHNAME + SEARCH).
//     That is upstream's ABAP, transpiled into @abap2ui5/node-runtime, and
//     fixed in abap2UI5 core; this file holds the runtime to it, as a todo
//     while the runtime in use predates the fix.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { serve } from "./server.mjs";

const require = createRequire(import.meta.url);
const { defineApp } = require("@cap2ui5/cds-plugin");
const RUNTIME = require("@abap2ui5/node-runtime/package.json").version;

const s = serve();
const EVIL = `<script>"'`;
const ALICE = "Basic " + Buffer.from("alice:").toString("base64");

/** a roundtrip with the S_FRONT fields given and extra headers */
async function roundtrip(front, headers = {}) {
  const body = { value: { S_FRONT: {
    ID: "", APP: "", EVENT: "", T_EVENT_ARG: [], ORIGIN: "http://127.0.0.1",
    PATHNAME: "/rest/root/z2ui5", SEARCH: "", HASH: "", CONFIG: {}, ...front },
    XX: {}, MODEL: {} } };
  const r = await fetch(`${s.url}?x=${EVIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: ALICE, ...headers },
    body: JSON.stringify(body),
  });
  return { status: r.status, headers: r.headers, text: await r.text() };
}

/** a.b.c compared as numbers */
const older = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split(/[.-]/).map((n) => Number.parseInt(n, 10) || 0));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i];
  return false;
};

// defined in the first test that needs it: the runtime is up only once
// cds.test has served the project
let defined = false;
const throwingApp = () => {
  if (!defined) defineApp("ZCL_JS_ERROR_BODY", class {
    main() { throw new Error("the app failed"); }
  });
  defined = true;
};

test("cap2UI5's own 500 does not reflect a crafted correlation id", async () => {
  throwingApp();
  const r = await roundtrip({ APP: "ZCL_JS_ERROR_BODY", SEARCH: "?app_start=ZCL_JS_ERROR_BODY" },
    { "x-correlation-id": EVIL });
  assert.equal(r.status, 500, r.text.slice(0, 300));
  assert.match(r.headers.get("content-type"), /^text\/plain/);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.ok(!r.text.includes(EVIL), `the header is reflected: ${r.text}`);
  assert.doesNotMatch(r.text, /[<>"']/, r.text);
  assert.equal(r.text, "roundtrip failed (script)", "the id, stripped to what an id is made of");
});

test("a well-formed correlation id still comes back unchanged, so the log can be searched for it", async () => {
  throwingApp();
  const id = "4f1c2a9e-7b3d-4e8f-9a1b-2c3d4e5f6a7b";
  const r = await roundtrip({ APP: "ZCL_JS_ERROR_BODY", SEARCH: "?app_start=ZCL_JS_ERROR_BODY" },
    { "x-correlation-id": id });
  assert.equal(r.status, 500, r.text.slice(0, 300));
  assert.equal(r.text, `roundtrip failed (${id})`);
});

// The framework's part. Until the runtime carries the core fix this is a
// todo, not a skip: it runs, and its failure is reported as todo.
//   fix:   abap2UI5 core, z2ui5_cl_ui5_handler->request_context_info strips the
//          url to safe characters (abap2UI5/protocol spec/open-questions.md,
//          question 3, decision (a))
//   lands: from the @abap2ui5/node-runtime release after 1.146.0 - which the
//          plugin's pin (plugin/package.json) and the release workflow's
//          `assemble-runtime.sh --package` then bring in. CI's runtime job
//          builds upstream's main, so it sees the fix as soon as it merges.
// On a runtime newer than 1.146.0 the assertion is no todo any more: a
// release without the fix fails here.
const FIXED_AFTER = "1.146.0";
test("the framework's 500 does not reflect the client's url",
  { todo: older(FIXED_AFTER, RUNTIME) ? false
    : `@abap2ui5/node-runtime ${RUNTIME} predates the core fix of request_context_info (protocol open question 3)` },
  async () => {
    // an event on a draft that does not exist: the framework's own 500,
    // its first frame naming the url
    const r = await roundtrip({ ID: "NO_SUCH_DRAFT", EVENT: "GO", SEARCH: `?x=${EVIL}` });
    assert.equal(r.status, 500, r.text.slice(0, 300));
    assert.match(r.headers.get("content-type"), /^text\/plain/i);
    assert.ok(!r.text.includes(EVIL), `the url is reflected:\n${r.text.slice(0, 600)}`);
  });
