/**
 * adapter-node — abap2UI5 on a bare node:http server.
 *
 * Proof of the engine seam: no CAP, no express — just node:http wired to
 * require("abap2UI5/engine") plus an in-memory draft store. Endpoints mirror
 * the CAP wiring so the unchanged upstream webapp works 1:1:
 *
 *   GET  /rest/root/z2ui5      bootstrap HTML (engine.bootstrap_html)
 *   HEAD /rest/root/z2ui5      CSRF prefetch ack
 *   POST /rest/root/z2ui5      the roundtrip — body { value: <oBody> }
 *   GET  /z2ui5/webapp/*       the bundled webapp (engine.WEBAPP_DIR)
 *   GET  /resources/*          local UI5 runtime (openui5-dist)
 *
 * Start:  npm install && npm start   →  http://localhost:4104/z2ui5/webapp/index.html
 * Apps:   ?app_start=z2ui5_cl_app_hello_world (all bundled samples work)
 */
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("abap2UI5/engine");

const PORT = Number(process.env.PORT || 4104);

// ---- draft persistence: in-memory store (the StorePort) ----------------
// Swap for anything durable (file, sqlite, redis) — the contract is just
// load(id) / save({id, id_prev, data}).
const drafts = new Map();
engine.set_store({
  load: (id) => drafts.get(id) || null,
  save: (entry) => { drafts.set(entry.id, entry); },
});

// ---- static file serving ------------------------------------------------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".properties": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json",
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function serveStatic(res, rootDir, relPath) {
  const file = path.join(rootDir, relPath);
  // path-traversal guard: the resolved file must stay inside rootDir
  if (!file.startsWith(rootDir + path.sep) && file !== rootDir) {
    res.writeHead(403).end();
    return;
  }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "max-age=3600",
    });
    fs.createReadStream(file).pipe(res);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// reqInfo for the exit context — same shape z2ui5_cl_util_http.get_req_info()
// produces on CAP: { method, body, path, t_params: [{n, v}] }.
function reqInfo(req, body) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  return {
    method: req.method,
    body: body || ``,
    path: url.pathname,
    t_params: [...url.searchParams].map(([n, v]) => ({ n, v })),
  };
}

// ---- the server ----------------------------------------------------------
const UI5_RESOURCES = engine.ui5_resources_dir();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const p = url.pathname;

  // the roundtrip endpoint
  if (p === "/rest/root/z2ui5") {
    if (req.method === "HEAD") {
      res.writeHead(200, { "X-CSRF-Token": "disabled" }).end();
      return;
    }
    if (req.method === "GET") {
      const { html, headers } = engine.bootstrap_html(reqInfo(req, ``));
      const h = { "Content-Type": "text/html; charset=utf-8" };
      for (const s of headers) h[s.n] = s.v;
      res.writeHead(200, h).end(html);
      return;
    }
    if (req.method === "POST") {
      const raw = await readBody(req);
      let oBody;
      try {
        const parsed = JSON.parse(raw);
        oBody = parsed?.value ?? parsed; // webapp wraps in {value}, accept raw too
      } catch {
        res.writeHead(400, { "Content-Type": "text/plain" }).end("invalid JSON");
        return;
      }
      try {
        const json = await engine.roundtrip(oBody, reqInfo(req, raw));
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" }).end(json);
      } catch (x) {
        const text = x?.get_text?.() || x?.message || String(x);
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }).end(`abap2UI5 Error:${text}`);
      }
      return;
    }
    res.writeHead(405).end();
    return;
  }

  // statics
  if (req.method === "GET" || req.method === "HEAD") {
    if (p === "/" || p === "/index.html") {
      res.writeHead(302, { Location: "/z2ui5/webapp/index.html" }).end();
      return;
    }
    if (p.startsWith("/z2ui5/webapp/")) {
      serveStatic(res, engine.WEBAPP_DIR, p.slice("/z2ui5/webapp/".length));
      return;
    }
    if (UI5_RESOURCES && p.startsWith("/resources/")) {
      serveStatic(res, UI5_RESOURCES, p.slice("/resources/".length));
      return;
    }
  }

  res.writeHead(404).end();
});

server.listen(PORT, () => {
  console.log(`abap2UI5 on bare node:http — http://localhost:${PORT}/z2ui5/webapp/index.html`);
  if (!UI5_RESOURCES) {
    console.warn("openui5-dist not found — /resources/* will 404; install it or bootstrap UI5 from a CDN");
  }
});
