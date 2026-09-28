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
// disk; the page itself is not touched. The one openui5-dist on npm that
// carries a `resources/` directory, 1.108.10, evaluates its library preloads
// as strings, which the page's own CSP (no 'unsafe-eval') refuses - UI5 never
// boots. UI5_BYPASS_CSP=1 lets such a build run by opening the context with
// Playwright's bypassCSP. It is a separate switch, off by default, so a run
// against the CDN or a current local build - CI's run among them - still has
// the CSP enforced and would catch a page that breaks it.
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
  context = await browser.newContext({
    httpCredentials: { username: "alice", password: "" },
    bypassCSP: process.env.UI5_BYPASS_CSP === "1",
  });
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

test("the pick app opens a popup, navigates, and comes back with the choice", async () => {
  const { page, errors } = await open("ZCL_JS_PICK");
  await page.getByText("chosen:", { exact: false }).waitFor({ timeout: 60_000 });

  // a popup is a real sap.m.Dialog on screen, and it closes again
  await page.getByRole("button", { name: "Help" }).click();
  const dialog = page.locator(".sapMDialog").filter({ hasText: "Choose picks a colour." });
  await dialog.waitFor({ timeout: 30_000 });
  await page.screenshot({ path: path.join(SHOTS, "popup.png") });
  await page.getByRole("button", { name: "Close" }).click();
  await dialog.waitFor({ state: "hidden", timeout: 30_000 });

  // navigate away, choose, and come back - the caller must have re-rendered
  await page.getByRole("button", { name: "Choose" }).click();
  await page.getByRole("button", { name: "red" }).waitFor({ timeout: 30_000 });
  await page.getByRole("button", { name: "red" }).click();
  await page.getByText("chosen: red").waitFor({ timeout: 30_000 });
  await page.getByText("picks: 1").waitFor({ timeout: 10_000 });
  await page.screenshot({ path: path.join(SHOTS, "pick.png") });
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

test("c.event( ) survives a view whose attributes were XML-escaped, arguments included", async () => {
  // ZCL_JS_ESCAPED escapes every attribute value as abap2UI5's view builder
  // does. Before the fix the placeholder did not survive that, a raw NUL went
  // out in the response and the page got no view at all.
  const { page, errors } = await open("ZCL_JS_ESCAPED");
  await page.getByRole("button", { name: "Go" }).waitFor({ timeout: 60_000 });
  await page.getByRole("button", { name: "Go" }).click();
  const box = (text) => page.locator(".sapMMessageBox, .sapMDialog").filter({ hasText: text });
  await box("escaped event arrived").waitFor({ timeout: 30_000 });
  await page.getByRole("button", { name: "OK" }).click();
  await box("escaped event arrived").waitFor({ state: "hidden", timeout: 30_000 });

  // an argument with a quote, angle brackets and an ampersand must reach the
  // app exactly - it only can if the wire string was escaped as an attribute
  await page.getByRole("button", { name: "Take" }).click();
  await box('took a "quoted" <arg> & more').waitFor({ timeout: 30_000 });
  await page.screenshot({ path: path.join(SHOTS, "escaped.png") });
  assert.deepEqual(errors, [], "page errors");
});

test("a view built with ViewBuilder renders, keeps literal text literal, and answers its event", async () => {
  // ZCL_JS_BUILDER builds its view with abap2UI5's own view builder, replayed
  // against the transpiled class after main( ) - so this is the browser's
  // word that upstream's rendering and cap2UI5's event placeholders fit.
  const { page, errors } = await open("ZCL_JS_BUILDER");
  const input = page.locator("input.sapMInputBaseInner").first();
  await input.waitFor({ timeout: 60_000 });
  // a( "text", { t } ): shown as typed, braces and all - not read as a binding
  await page.getByText("{shown as typed}", { exact: true }).waitFor({ timeout: 10_000 });
  await input.fill("Ada");
  await page.getByRole("button", { name: "Go" }).click();
  await page.locator(".sapMMessageBox, .sapMDialog").filter({ hasText: "Hello Ada" }).waitFor({ timeout: 30_000 });
  await page.screenshot({ path: path.join(SHOTS, "builder.png") });
  assert.deepEqual(errors, [], "page errors");
});

test("the handler expressions work in the browser: event options, a front-end action, the back button", async () => {
  const { page, errors } = await open("ZCL_JS_WIRES");
  // a view prefixes its control ids (<view>--search), hence the suffix match
  const search = page.locator("[id$='--search'] input").first();
  await search.waitFor({ timeout: 60_000 });

  // liveChange with queueLast: the wire runs, the argument is the typed value
  await search.fill("ab");
  await page.getByText("said: TYPED ab").waitFor({ timeout: 30_000 });

  // argLiteral: the argument arrives as written, not evaluated as a binding
  await page.getByRole("button", { name: "Literal" }).click();
  await page.getByText("said: TAKE ${not a binding}").waitFor({ timeout: 30_000 });

  // a front-end action wired into a button: no roundtrip, the focus moves
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await page.getByRole("button", { name: "Focus" }).click();
  await page.waitForFunction(() => globalThis.document.activeElement?.closest("[id$='--search']") !== null, null,
    { timeout: 30_000 });

  // c.eventNavBack( ): the called app's back button leaves it
  await page.getByRole("button", { name: "Call" }).click();
  await page.getByText("press back").waitFor({ timeout: 30_000 });
  await page.locator("[id$='-navButton']").first().click();
  await page.getByText("said: TAKE ${not a binding}").waitFor({ timeout: 30_000 });
  await page.screenshot({ path: path.join(SHOTS, "wires.png") });
  assert.deepEqual(errors, [], "page errors");
});

test("a popover opens by the control it names and closes again", async () => {
  const { page, errors } = await open("ZCL_JS_ACTIONS");
  await page.getByRole("button", { name: "More" }).waitFor({ timeout: 60_000 });
  await page.getByRole("button", { name: "More" }).click();
  const popover = page.locator(".sapMPopover").filter({ hasText: "the popover" });
  await popover.waitFor({ timeout: 30_000 });
  await page.screenshot({ path: path.join(SHOTS, "popover.png") });
  await popover.getByRole("button", { name: "Close" }).click();
  await popover.waitFor({ state: "hidden", timeout: 30_000 });
  assert.deepEqual(errors, [], "page errors");
});

test("bindings with options: a bare path in a composed binding, one table cell, a JSON node", async () => {
  const { page, errors } = await open("ZCL_JS_BINDS");
  await page.locator("[id$='--list']").getByText("second", { exact: true }).waitFor({ timeout: 60_000 });
  await page.getByText("From JSON", { exact: true }).waitFor({ timeout: 10_000 });

  // the cell input is row 2's title; an edit of it reaches the table
  const cell = page.locator("[id$='--cell'] input");
  assert.equal(await cell.inputValue(), "second");
  await cell.fill("edited");
  await cell.press("Tab");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByText("first,edited", { exact: true }).waitFor({ timeout: 30_000 });
  await page.screenshot({ path: path.join(SHOTS, "binds.png") });
  assert.deepEqual(errors, [], "page errors");
});
