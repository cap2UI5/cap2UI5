// The plugin logs through cds.log, as CAP and every CAP plugin do: plain
// "[cap2ui5] - ..." lines in development (the other tests read those), and in
// production the JSON records CAP writes for itself, one per call, with the
// request's correlation_id.
//
// It used console.* before, and a production log was CAP's JSON with the
// plugin's plain text in between. A failed roundtrip was measured as a bare
// "[cap2ui5] roundtrip failed (<id>): Error: ..." followed by some twenty
// stack lines on stderr - each of them a record of its own in a log service,
// and none of them carrying the correlation id the client was answered with.
//
// One production boot against a database nobody deployed: the plugin starts
// (the draft store touches no table until a roundtrip), and the first
// roundtrip fails on the missing cap2ui5_Drafts table - a real failure, not a
// staged one.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { boot, post } from "./server.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cap2ui5-log-"));
let s;
before(async () => {
  s = await boot("production log", { env: {
    CDS_ENV: "production",
    CDS_REQUIRES_AUTH_KIND: "mocked",                          // production would want a real IdP
    CDS_REQUIRES_DB_CREDENTIALS_URL: path.join(dir, "empty.sqlite"),
  } });
});
after(() => { s?.kill(); fs.rmSync(dir, { recursive: true, force: true }); });

/** the log as records: every line that parses as a JSON object */
const records = () => s.out().split("\n").flatMap((l) => {
  try { const r = JSON.parse(l); return r && typeof r === "object" ? [r] : []; } catch { return []; }
});

test("in production the plugin writes CAP's JSON records, not text", () => {
  const mine = records().filter((r) => r.logger === "cap2ui5");
  assert.ok(mine.some((r) => r.level === "info" && r.msg.includes("drafts live in cap2ui5.Drafts")),
    `no cap2ui5 JSON record for the store:\n${s.out().slice(-1500)}`);
  assert.doesNotMatch(s.out(), /^\[cap2ui5\]/m, "a plain-text [cap2ui5] line in a production log");
});

test("a failed roundtrip is one error record with the correlation id the client got", async () => {
  const r = await post(s.url, { app: "ZCL_JS_HELLO", user: "alice" });
  assert.equal(r.status, 500, r.text.slice(0, 300));
  const [, id] = r.text.match(/^roundtrip failed \((.+)\)$/) ?? [];
  assert.ok(id, `no correlation id in the response: ${r.text}`);

  let rec;
  for (let i = 0; i < 20 && !rec; i++) {
    rec = records().find((x) => x.logger === "cap2ui5" && x.level === "error");
    if (!rec) await new Promise((ok) => setTimeout(ok, 100));
  }
  assert.ok(rec, `no cap2ui5 error record:\n${s.out().slice(-1500)}`);
  assert.equal(rec.correlation_id, id, JSON.stringify(rec).slice(0, 500));
  assert.match(rec.msg, /roundtrip failed/);
  assert.match(rec.msg, /no such table/, "the cause is not in the record");
  // the stack is inside the record, not a trail of plain lines after it
  assert.doesNotMatch(s.out(), /^\s+at /m, "stack lines outside the JSON record");
});
