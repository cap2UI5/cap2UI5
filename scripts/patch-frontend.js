#!/usr/bin/env node
/**
 * patch-frontend — applies the few cap2UI5-specific changes to a freshly
 * mirrored abap2UI5 frontend, so no stored copies ("backup" files) are
 * needed and everything else keeps flowing 1:1 from upstream:
 *
 *   index.html    bootstrap src:  resources/sap-ui-core.js  →  UI5 CDN
 *                 (the CAP server does not ship UI5 itself)
 *   manifest.json dataSources.http.uri:  /sap/bc/z2ui5  →  /rest/root/z2ui5
 *                 (the CDS REST action instead of the abap ICF path)
 *   core/DebugTool.js
 *                 getViewContent(): on UI5 ≥ ~1.136 "viewContent" is a
 *                 special setting, not a property — getProperty() throws and
 *                 the debug tool's View tab shows nothing. Read the stashed
 *                 mProperties slot as fallback (upstream bug; drop this patch
 *                 once fixed upstream).
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

// core/DebugTool.js — make getViewContent survive UI5 releases where
// "viewContent" is a special setting (getProperty throws). XMLView.create
// stashes the definition in mProperties, so read that as fallback.
const debugToolPath = path.join(webapp, "core", "DebugTool.js");
if (fs.existsSync(debugToolPath)) {
  const debugTool = fs.readFileSync(debugToolPath, "utf8");
  const upstream =
`    function getViewContent(view) {
      return view?.getProperty("viewContent");
    }`;
  const patched =
`    function getViewContent(view) {
      // cap2UI5 patch: "viewContent" is a special setting on current UI5
      // releases — getProperty() throws. XMLView.create stashes the view
      // definition in mProperties, read it from there as fallback.
      try {
        return view?.getProperty("viewContent");
      } catch {
        return view?.mProperties?.viewContent;
      }
    }`;
  if (debugTool.includes(upstream)) {
    fs.writeFileSync(debugToolPath, debugTool.replace(upstream, patched));
    console.log("DebugTool.js:  getViewContent patched (viewContent special-setting fallback)");
  } else if (debugTool.includes("mProperties?.viewContent")) {
    console.log("DebugTool.js:  getViewContent already patched");
  } else {
    console.warn("DebugTool.js:  upstream getViewContent not found — check if the upstream fixed it (then drop this patch) or adjust it");
  }
}
