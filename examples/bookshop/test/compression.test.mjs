// gzip on the route - what upstream asks the ICF for with SET_COMPRESSION,
// and the express shim has no method for. The middleware is the runtime
// package's compress( ) (@abap2ui5/node-runtime/compress), whose own behaviour
// - the page cache, the tags - abap2UI5's node/tests/compress.spec.js holds;
// what is held here is that the plugin's route answers through it.
//
// The UI5 frontend is a bundle of about 190 kB the page loads from the route
// (it was part of the page until abap2UI5 1.151.0), and a roundtrip carries
// the app's model; all of it went out uncompressed. What must hold besides the bytes:
// the conditional GET. The framework answers a browser that still has the
// page with a 304 itself, and it accepts the tag it sent and that tag with
// Apache's "-gzip" suffix - so the compressed page is tagged "x-gzip", and
// the browser that revalidates with it is answered 304.
//
// Raw node:http here, not fetch( ): fetch asks for gzip on its own and
// decodes the body, and these tests are about the bytes on the wire.
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import { test } from "node:test";
import zlib from "node:zlib";
import { boot, serve } from "./server.mjs";

const require = createRequire(import.meta.url);
const THRESHOLD = 1024;                                        // compress( )'s default
const { defineApp, t } = require("@cap2ui5/cds-plugin");

const AUTH = { Authorization: "Basic " + Buffer.from("alice:").toString("base64") };
const BROWSER = "gzip, deflate, br, zstd";                     // what Chromium sends
const s = serve();

/** One request, the body as the bytes that came over the wire. */
function raw(url, { method = "GET", headers = {}, body } = {}) {
  const h = { ...AUTH, ...headers };
  if (body) Object.assign(h, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method, headers: h }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on("error", reject);
    req.end(body);
  });
}
const page = (headers, url = s.url) => raw(`${url}?app_start=ZCL_JS_HELLO`, { headers });
const start = (app, headers) => raw(s.url, { method: "POST", headers, body: JSON.stringify({ value: { S_FRONT: {
  ID: "", APP: app, EVENT: "", T_EVENT_ARG: [], ORIGIN: "http://127.0.0.1", PATHNAME: "/rest/root/z2ui5",
  SEARCH: `?app_start=${app}`, HASH: "", CONFIG: {} } } }) });

test("the page goes out gzipped where the browser takes it, and decodes to the page", async () => {
  const plain = await page({});
  const gz = await page({ "Accept-Encoding": BROWSER });
  assert.equal(plain.status, 200);
  assert.equal(gz.status, 200);
  assert.equal(plain.headers["content-encoding"], undefined, "compressed for a client that did not ask");
  assert.equal(gz.headers["content-encoding"], "gzip");
  assert.equal(Number(gz.headers["content-length"]), gz.body.length);
  assert.ok(gz.body.length < plain.body.length / 2, `${gz.body.length} of ${plain.body.length} bytes`);
  assert.ok(zlib.gunzipSync(gz.body).equals(plain.body), "the gzip is not the page");
  // the page is the loader since abap2UI5 1.151.0: the UI5 component comes
  // as a bundle of its own from the same route, and that is where the bytes are
  const bundle = await raw(`${s.url}?z2ui5-bundle`, { headers: { "Accept-Encoding": BROWSER } });
  const bundlePlain = await raw(`${s.url}?z2ui5-bundle`);
  assert.equal(bundle.status, 200);
  assert.equal(bundle.headers["content-encoding"], "gzip");
  assert.ok(bundlePlain.body.length > 100_000, `the bundle is ${bundlePlain.body.length} bytes`);
  assert.ok(bundle.body.length < bundlePlain.body.length / 3, `${bundle.body.length} of ${bundlePlain.body.length} bytes`);
  assert.ok(zlib.gunzipSync(bundle.body).equals(bundlePlain.body), "the gzip is not the bundle");
  // a different representation, a different strong tag - the one the
  // framework's conditional GET accepts, Apache's
  assert.match(plain.headers.etag, /^"[^"]+"$/);
  assert.equal(gz.headers.etag, plain.headers.etag.replace(/"$/, '-gzip"'));
  // either way the answer depends on Accept-Encoding, and a cache has to know
  for (const r of [plain, gz]) assert.match(r.headers.vary ?? "", /accept-encoding/i);
  assert.equal(gz.headers["content-type"], plain.headers["content-type"]);
  assert.equal(gz.headers["cache-control"], "private, no-cache");
});

test("a browser that has the gzipped page revalidates it: the framework answers \"x-gzip\" with 304", async () => {
  const gz = await page({ "Accept-Encoding": BROWSER });
  assert.match(gz.headers.etag, /-gzip"$/);
  const again = await page({ "Accept-Encoding": BROWSER, "If-None-Match": gz.headers.etag });
  assert.equal(again.status, 304, again.body.toString().slice(0, 200));
  assert.equal(again.body.length, 0);
  assert.equal(again.headers["content-encoding"], undefined);
  // the 304 carries the tag and the Vary the 200 would have (RFC 9110 15.4.5) - it carried the
  // framework's own tag, which names the uncompressed page the browser does not have, and no Vary
  assert.equal(again.headers.etag, gz.headers.etag);
  assert.match(again.headers.vary ?? "", /accept-encoding/i);
  // and the tag of the uncompressed page, as before
  const plain = await page({});
  assert.equal((await page({ "Accept-Encoding": BROWSER, "If-None-Match": plain.headers.etag })).status, 304);
  const plainAgain = await page({ "If-None-Match": plain.headers.etag });
  assert.equal(plainAgain.status, 304);
  assert.equal(plainAgain.headers.etag, plain.headers.etag, "a client that takes no gzip keeps the plain tag");
  assert.match(plainAgain.headers.vary ?? "", /accept-encoding/i);
  // on the other route as well - it serves the same page under the same tag
  assert.equal((await page({ "If-None-Match": gz.headers.etag }, s.url.replace("/rest/root/z2ui5", "/sap/bc/z2ui5"))).status, 304);
});

test("a roundtrip's JSON goes out gzipped, and decodes to the same answer", async () => {
  // an app whose answer is well over the threshold: a table of 200 rows
  defineApp("ZCL_TEST_GZIP_ROWS", class {
    rows = t.table({ id: 0, title: "" });
    main(client) {
      if (client.check_on_init()) this.rows = Array.from({ length: 200 }, (_, i) => ({ id: i, title: `row ${i}` }));
      if (client.check_on_navigated()) {
        client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
          `<List items="${client._bind("rows")}"><StandardListItem title="{TITLE}"/></List></mvc:View>`);
      }
    }
  });
  const plain = await start("ZCL_TEST_GZIP_ROWS", {});
  const gz = await start("ZCL_TEST_GZIP_ROWS", { "Accept-Encoding": BROWSER });
  assert.equal(plain.status, 200, plain.body.toString().slice(0, 300));
  assert.equal(gz.status, 200);
  assert.equal(plain.headers["content-encoding"], undefined);
  assert.equal(gz.headers["content-encoding"], "gzip");
  assert.equal(gz.headers["cache-control"], "no-cache, no-store, must-revalidate");
  const a = JSON.parse(plain.body);
  const b = JSON.parse(zlib.gunzipSync(gz.body));
  assert.equal(a.MODEL.ROWS.length, 200);
  // two app starts: two drafts, the rest is the same answer
  assert.notEqual(a.S_FRONT.ID, b.S_FRONT.ID);
  delete a.S_FRONT.ID; delete b.S_FRONT.ID;
  assert.deepEqual(b, a);
});

test("gzip is sent only where it is accepted: q=0 refuses it, and so does naming only others", async () => {
  for (const refuses of ["gzip;q=0", "identity", "br", "deflate, br", "gzip;q=0, *", "*;q=0", "x-gzip;q=0.0"]) {
    const r = await page({ "Accept-Encoding": refuses });
    assert.equal(r.headers["content-encoding"], undefined, refuses);
  }
  for (const takes of ["GZIP;q=0.5", "br;q=1, gzip;q=0.1", "br, *;q=0.2", "x-gzip", "identity, gzip ; q=1"]) {
    assert.equal((await page({ "Accept-Encoding": takes })).headers["content-encoding"], "gzip", takes);
  }
  assert.equal((await page({ "Accept-Encoding": "*" })).headers["content-encoding"], "gzip");
});

test("a small answer and a HEAD go out as they are", async () => {
  const hello = await start("ZCL_JS_HELLO", { "Accept-Encoding": BROWSER });
  assert.equal(hello.status, 200);
  assert.ok(hello.body.length < THRESHOLD, `the hello start is ${hello.body.length} bytes - pick a smaller answer`);
  assert.equal(hello.headers["content-encoding"], undefined);
  assert.equal(hello.headers.vary, undefined);
  const head = await raw(s.url, { method: "HEAD", headers: { "Accept-Encoding": BROWSER } });
  assert.equal(head.headers["content-encoding"], undefined);
});

test("cds.requires.cap2ui5.compression: false - nothing is compressed", async () => {
  const off = await boot("compression off", { env: { CDS_REQUIRES_CAP2UI5_COMPRESSION: "false" } });
  try {
    const r = await page({ "Accept-Encoding": BROWSER }, off.url);
    assert.equal(r.status, 200);
    assert.equal(r.headers["content-encoding"], undefined);
    assert.equal(r.headers.vary, undefined);
    assert.doesNotMatch(r.headers.etag, /-gzip"$/, "the framework's own tag, as it sent it");
  } finally {
    off.kill();
  }
});
