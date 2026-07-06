#!/usr/bin/env node
/**
 * patch-frontend — applies the two (and only two) cap2UI5-specific changes to
 * a freshly mirrored abap2UI5 frontend, so no stored copies ("backup" files)
 * are needed and everything else keeps flowing 1:1 from upstream:
 *
 *   index.html    bootstrap src:  resources/sap-ui-core.js  →  UI5 CDN
 *                 (the CAP server does not ship UI5 itself)
 *   manifest.json dataSources.http.uri:  /sap/bc/z2ui5  →  /rest/root/z2ui5
 *                 (the CDS REST action instead of the abap ICF path)
 *
 * Idempotent — running it on an already patched webapp changes nothing.
 *
 * Usage: node scripts/patch-frontend.js <path/to/webapp>
 */
"use strict";

const fs = require("fs");
const path = require("path");

const UI5_CDN = "https://sapui5.hana.ondemand.com/1.147.1/resources/sap-ui-core.js";
const DATA_SOURCE_URI = "/rest/root/z2ui5";

const webapp = process.argv[2];
if (!webapp || !fs.existsSync(path.join(webapp, "index.html"))) {
  console.error("usage: node scripts/patch-frontend.js <path/to/webapp>");
  process.exit(1);
}

// index.html — point the bootstrap at the CDN
const indexPath = path.join(webapp, "index.html");
const index = fs.readFileSync(indexPath, "utf8");
const patchedIndex = index.replace(/src="(?:https:\/\/[^"]*\/)?resources\/sap-ui-core\.js"/, `src="${UI5_CDN}"`);
if (patchedIndex !== index) fs.writeFileSync(indexPath, patchedIndex);
console.log(`index.html:    bootstrap src ${patchedIndex !== index ? "patched" : "already patched"} -> ${UI5_CDN}`);

// manifest.json — point the data source at the CDS REST endpoint
const manifestPath = path.join(webapp, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const http = manifest["sap.app"]?.dataSources?.http;
if (!http) {
  console.error("manifest.json: sap.app/dataSources/http not found — upstream structure changed, adjust this script");
  process.exit(1);
}
const already = http.uri === DATA_SOURCE_URI;
http.uri = DATA_SOURCE_URI;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest.json: dataSource uri ${already ? "already patched" : "patched"} -> ${DATA_SOURCE_URI}`);
