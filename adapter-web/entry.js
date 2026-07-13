/**
 * adapter-web entry — the whole abap2UI5 stack running client-side.
 *
 * Bundled by build.js (esbuild) into dist/z2ui5-bundle.js and loaded by the
 * webapp's index.html BEFORE the UI5 bootstrap. There is no server: the
 * roundtrip the webapp fires against /rest/root/z2ui5 is intercepted here and
 * answered by engine.roundtrip() in the same browser tab.
 *
 * Ports injected for the browser:
 *   - draft store: in-memory Map (page lifetime)
 *   - app classes: register-all.generated.js (no filesystem discovery)
 *   - assets/fs/path/crypto: shimmed at bundle time (see shims/)
 */
"use strict";

const engine = require("abap2UI5/engine");
require("./register-all.generated.js");

// draft persistence: per-tab in-memory store
const drafts = new Map();
engine.set_store({
  load: (id) => drafts.get(id) || null,
  save: (entry) => { drafts.set(entry.id, entry); },
});

// intercept the webapp's roundtrip — no server behind it
const ROUNDTRIP = "/rest/root/z2ui5";
const origFetch = window.fetch.bind(window);

window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input?.url || "";
  const method = (init?.method || (typeof input === "object" && input?.method) || "GET").toUpperCase();

  if (url.split("?")[0].endsWith(ROUNDTRIP)) {
    if (method === "POST") {
      let oBody = {};
      try {
        const parsed = JSON.parse(init?.body ?? "{}");
        oBody = parsed?.value ?? parsed;
      } catch { /* keep {} */ }
      try {
        const json = await engine.roundtrip(oBody);
        return new Response(json, { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (x) {
        return new Response(`abap2UI5 Error:${x?.message || x}`, { status: 500, headers: { "Content-Type": "text/plain" } });
      }
    }
    if (method === "HEAD") {
      return new Response("", { status: 200, headers: { "X-CSRF-Token": "disabled" } });
    }
    if (method === "GET") {
      const { html } = engine.bootstrap_html();
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
  }
  return origFetch(input, init);
};

// console access + seam for user apps: window.abap2UI5.register_app_class(MyApp)
window.abap2UI5 = engine;
