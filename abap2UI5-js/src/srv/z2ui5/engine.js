/**
 * abap2UI5/engine — the platform-neutral seam of the framework.
 *
 * abap2UI5's whole platform surface is tiny: one POST roundtrip
 * (request JSON → response JSON), one GET bootstrap page, static webapp
 * assets, and a handful of injectable ports. This module is that surface —
 * every adapter (CAP, express, bare node, browser bundle) wires its
 * transport to these functions and injects its ports; nothing below this
 * file knows which platform it runs on.
 *
 *   const engine = require("abap2UI5/engine");
 *   engine.set_store({ load, save });          // draft persistence port
 *   engine.register_app_dir("/my/apps");       // or register_app_class(Cls)
 *   http POST  →  await engine.roundtrip(body, reqInfo)   → JSON string
 *   http GET   →  engine.bootstrap_html(reqInfo)          → { html, headers }
 *   statics    →  engine.WEBAPP_DIR (+ engine.ui5_resources_dir())
 *
 * The CAP project itself is one consumer of this seam (srv/server.js and
 * srv/z2ui5/02/z2ui5_cl_http_handler.js delegate here).
 */
"use strict";

const z2ui5_cl_core_handler   = require("./01/02/z2ui5_cl_core_handler");
const z2ui5_cl_core_srv_draft = require("./01/01/z2ui5_cl_core_srv_draft");
const z2ui5_cl_exit           = require("./02/z2ui5_cl_exit");
const z2ui5_cl_app_index_html = require("./01/03/z2ui5_cl_app_index_html");
const z2ui5_cl_util           = require("./00/03/z2ui5_cl_util");
const z2ui5_port              = require("./z2ui5_port");
const z2ui5_asset             = require("./z2ui5_asset");

// Sticky-handler slot — same semantics as abap CLASS-DATA so_sticky_handler:
// an app that sets check_sticky keeps its handler (and app state) across
// roundtrips instead of being re-hydrated from the draft store.
let _sticky_handler = null;

/**
 * The z2ui5 roundtrip — mirrors abap _http_post.
 *
 * @param oBody   parsed request body (object) or raw JSON string
 * @param reqInfo optional { method, body, path, t_params:[{n,v}] } — passed to
 *                cl_exit so user exits see the request; omit for defaults.
 * @returns response JSON as string (the exact wire payload)
 */
async function roundtrip(oBody, reqInfo) {
  if (reqInfo) z2ui5_cl_exit.init_context(reqInfo);

  let oHandler;
  if (_sticky_handler) {
    oHandler = _sticky_handler;
    oHandler.mv_request_json = typeof oBody === `string` ? oBody : JSON.stringify(oBody ?? {});
  } else {
    oHandler = new z2ui5_cl_core_handler(oBody);
  }

  const responseJson = await oHandler.main();

  // Refresh the sticky slot from the app's check_sticky flag.
  try {
    const li_app = oHandler?.mo_action?.mo_app?.mo_app;
    _sticky_handler = li_app?.check_sticky === true ? oHandler : null;
  } catch {
    _sticky_handler = null;
  }

  return responseJson;
}

/**
 * The GET bootstrap page — mirrors abap _http_get: init the exit context,
 * resolve the http-get config, emit the index HTML plus security headers.
 *
 * @param reqInfo optional request info (see roundtrip)
 * @returns { html: string, headers: Array<{n,v}> }
 */
function bootstrap_html(reqInfo) {
  z2ui5_cl_exit.init_context(reqInfo || { method: `GET`, body: ``, path: ``, t_params: [] });
  const cfg = z2ui5_cl_exit.get_instance().set_config_http_get(undefined, {});
  return {
    html: z2ui5_cl_app_index_html.get_source(cfg),
    headers: cfg.t_security_header || [],
  };
}

/** Directory of the local UI5 runtime (openui5-dist), or null when absent. */
function ui5_resources_dir() {
  try {
    const path = require("path");
    // Resolve from the consumer project first (cwd — where npm hoisted the
    // dependency), then from this package's own tree. This package is linked
    // via file:../core, so a plain require.resolve would only see the core's
    // real path and miss the consumer's node_modules.
    const pkg = require.resolve("openui5-dist/package.json", { paths: [process.cwd(), __dirname] });
    return path.join(path.dirname(pkg), "dist", "resources");
  } catch {
    return null;
  }
}

module.exports = {
  roundtrip,
  bootstrap_html,

  // ---- ports ----
  /** Draft persistence: { load(id), save({id,id_prev,data}) } (may be async). */
  set_store: (store) => z2ui5_cl_core_srv_draft.set_store(store),
  /** OpenSQL store behind z2ui5_port.db() (transpiled SELECT/MODIFY/DELETE). */
  set_db_store: (store) => z2ui5_port.set_store(store),
  /** Webapp asset provider: (relPath) → string|null (browser builds). */
  set_assets: (provider) => z2ui5_asset.set_provider(provider),

  // ---- app registry ----
  register_app_class: (name, cls) =>
    typeof name === `function`
      ? z2ui5_cl_util.register_app_class(name.name, name)
      : z2ui5_cl_util.register_app_class(name, cls),
  register_app_dir: (dir) => z2ui5_cl_util.register_app_dir(dir),

  // ---- static assets ----
  WEBAPP_DIR: z2ui5_asset.WEBAPP_DIR,
  ui5_resources_dir,

  /** Test-only — clear the sticky-handler slot between test cases. */
  _reset_sticky: () => { _sticky_handler = null; },
};
