// THE BROWSER TEST - the one thing every earlier round said it had not done.
//
// A real Chromium opens the page the framework itself serves on GET (the
// ABAP-generated index with the inlined webapp modules), UI5 bootstraps, the
// JS app renders, the user types and clicks, and the answer comes back as a
// MessageBox / as table rows. Everything below the browser is the same stack
// the wire tests exercise; this proves the two halves - upstream's webapp and
// upstream's backend, from one commit - actually fit.
//
// UI5 comes from the CDN the page names (sdk.openui5.org). Where there is no
// CDN - the sandbox this was written in - set UI5_DIST to the `resources`
// directory of an openui5-dist install and the CDN requests are answered from
// disk; the page itself is not touched.
//
// Runs only when asked (`npm run test:browser`) - it needs a browser - which is
// why the file is *.e2e.mjs and not *.test.mjs: `npm test` must stay browserless.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, test } from "node:test";
import { URL } from "node:url";
import { chromium } from "playwright";
import { boot } from "./server.mjs";

const DIST = process.env.UI5_DIST;
const SHOTS = process.env.SHOTS ?? path.join(path.dirname(new URL(import.meta.url).pathname), "..", "screenshots");
const MIME = { ".js": "application/javascript", ".css": "text/css", ".json": "application/json",
  ".properties": "text/plain", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf",
  ".png": "image/png", ".svg": "image/svg+xml", ".html": "text/html", ".xml": "application/xml" };

let s, browser, context;
before(async () => {
  s = await boot("browser");
  // PW_CHROMIUM: a Chromium to use instead of the one this playwright version
  // would download - for sandboxes that ship one and block the download.
  browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  context = await browser.newContext({ httpCredentials: { username: "alice", password: "" } });
  if (DIST) {
    await context.route("https://sdk.openui5.org/**", async (route) => {
      const p = new URL(route.request().url()).pathname.replace(/^\/resources\/sap-ui-cachebuster\//, "/resources/");
      const file = path.join(DIST, "..", p);
      if (!fs.existsSync(file)) return route.fulfill({ status: 404 });
      return route.fulfill({ path: file, contentType: MIME[path.extname(file)] ?? "application/octet-stream" });
    });
  }
  fs.mkdirSync(SHOTS, { recursive: true });
});
after(async () => { await browser?.close(); s?.kill(); });

const open = async (app) => {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${s.port}/rest/root/z2ui5?app_start=${app}`, { waitUntil: "domcontentloaded" });
  return { page, errors };
};

test("the JS hello app renders, takes input and answers with a MessageBox", async () => {
  const { page, errors } = await open("ZCL_JS_HELLO");
  const input = page.locator("input.sapMInputBaseInner").first();
  await input.waitFor({ timeout: 60_000 });                      // UI5 booted, view rendered
  await input.fill("Ada");
  await page.getByRole("button", { name: "Go" }).click();
  const box = page.locator(".sapMMessageBox, .sapMDialog").filter({ hasText: "Hello Ada" });
  await box.waitFor({ timeout: 30_000 });
  await page.screenshot({ path: path.join(SHOTS, "hello.png") });
  assert.deepEqual(errors, [], "page errors");
});

test("the Books app renders a t.table( ) filled from cds.ql", async () => {
  const { page, errors } = await open("ZCL_JS_BOOKS");
  const search = page.locator(".sapMSFI").first();                // the SearchField's input
  await search.waitFor({ timeout: 60_000 });
  await search.fill("Raven");
  await search.press("Enter");
  const rows = page.locator(".sapMListTbl tbody tr.sapMListTblRow");   // tbody: the header row is one too
  await rows.filter({ hasText: "The Raven" }).waitFor({ timeout: 30_000 });
  await page.getByText("1 hits").waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(SHOTS, "books.png") });
  assert.equal(await rows.count(), 1);
  assert.deepEqual(errors, [], "page errors");
});
