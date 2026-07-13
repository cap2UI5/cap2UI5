#!/usr/bin/env node
/**
 * adapter-web test server — serves dist/ as the static site it is, plus
 * resources/ from the local openui5-dist so no CDN is needed. Any static
 * host (GitHub Pages, S3, nginx) serves dist/ the same way.
 */
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 4304);
const DIST = path.join(__dirname, "dist");
const UI5 = path.join(
  path.dirname(require.resolve("openui5-dist/package.json", { paths: [path.join(__dirname, "node_modules/abap2UI5")] })),
  "dist",
  "resources",
);

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8", ".properties": "text/plain; charset=utf-8",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".map": "application/json",
};

http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = p.startsWith("/resources/")
    ? path.join(UI5, p.slice("/resources/".length))
    : path.join(DIST, p === "/" ? "index.html" : p.slice(1));
  if (!file.startsWith(UI5) && !file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, () => console.log(`adapter-web static site — http://localhost:${PORT}/index.html`));
