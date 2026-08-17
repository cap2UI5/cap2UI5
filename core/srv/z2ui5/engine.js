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
 * srv/z2ui5/02/z2ui5_cl_ui5_http_handler.js delegate here).
 */
"use strict";

const z2ui5_cl_ui5_handler   = require("./01/02/z2ui5_cl_ui5_handler");
const z2ui5_cl_ui5_srv_draft = require("./01/01/z2ui5_cl_ui5_srv_draft");
const z2ui5_cl_ui5_user_exit           = require("./01/04/z2ui5_cl_ui5_user_exit");
const z2ui5_cl_ui5f_index_html = require("./01/03/z2ui5_cl_ui5f_index_html");
const z2ui5_cl_util           = require("./00/03/z2ui5_cl_util");
const z2ui5_port              = require("./z2ui5_port");
const z2ui5_asset             = require("./z2ui5_asset");
const z2ui5_identity          = require("./z2ui5_identity");

// Sticky-handler store — same intent as abap CLASS-DATA so_sticky_handler:
// an app that sets check_sticky keeps its handler (and app state) across
// roundtrips instead of being re-hydrated from the draft store. A sticky
// handler holds full app state, so a SINGLE process-global slot would leak
// one user's state into every other user's request in a multi-user
// deployment. It is therefore keyed per session and bounded.
//
// The key comes from the identity port (set_identity) — reqInfo.session_id
// only overrides it when an adapter computes the key itself. With no identity
// provider installed (the single-user demo adapters, tests) everything shares
// one key, which is the historic behaviour and safe there because there is
// exactly one user. Deployments that serve more than one user MUST install a
// provider; see z2ui5_identity.
const STICKY_MAX = 500;
const _sticky_handlers = new Map();

function _sticky_key(reqInfo) {
  return reqInfo?.session_id
    || z2ui5_identity.session_key()
    || reqInfo?.tenant
    || `__global__`;
}

function _sticky_set(key, handler) {
  _sticky_handlers.delete(key);
  if (handler) {
    _sticky_handlers.set(key, handler);
    // Bound the store — evict the oldest session (insertion order) when full.
    while (_sticky_handlers.size > STICKY_MAX) {
      _sticky_handlers.delete(_sticky_handlers.keys().next().value);
    }
  }
}

/**
 * The z2ui5 roundtrip — mirrors abap _http_post.
 *
 * @param oBody   parsed request body (object) or raw JSON string
 * @param reqInfo optional { method, body, path, t_params:[{n,v}], session_id }
 *                — passed to cl_exit so user exits see the request; session_id
 *                (when present) isolates sticky app state per user/tenant.
 * @returns response JSON as string (the exact wire payload)
 */
async function roundtrip(oBody, reqInfo) {
  // Isolate the exit's request context per async execution so interleaved
  // roundtrips can't clobber each other's context.
  return z2ui5_cl_ui5_user_exit.run_in_request(async () => {
    if (reqInfo) z2ui5_cl_ui5_user_exit.init_context(reqInfo);

    const stickyKey = _sticky_key(reqInfo);
    let oHandler = _sticky_handlers.get(stickyKey);
    if (oHandler) {
      oHandler.mv_request_json = typeof oBody === `string` ? oBody : JSON.stringify(oBody ?? {});
    } else {
      oHandler = new z2ui5_cl_ui5_handler(oBody);
    }

    const responseJson = await oHandler.main();

    // Refresh the sticky slot for this session from the app's check_sticky flag.
    try {
      const li_app = oHandler?.mo_action?.mo_app?.mo_app;
      _sticky_set(stickyKey, li_app?.check_sticky === true ? oHandler : null);
    } catch {
      _sticky_set(stickyKey, null);
    }

    return responseJson;
  });
}

/**
 * The GET bootstrap page — mirrors abap _http_get: init the exit context,
 * resolve the http-get config, emit the index HTML plus security headers.
 *
 * @param reqInfo optional request info (see roundtrip)
 * @returns { html: string, headers: Array<{n,v}> }
 */
function bootstrap_html(reqInfo) {
  z2ui5_cl_ui5_user_exit.init_context(reqInfo || { method: `GET`, body: ``, path: ``, t_params: [] });
  const cfg = z2ui5_cl_ui5_user_exit.get_instance().set_config_http_get(undefined, {});
  return {
    html: z2ui5_cl_ui5f_index_html.get_source(cfg),
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
  set_store: (store) => z2ui5_cl_ui5_srv_draft.set_store(store),
  /** OpenSQL store behind z2ui5_port.db() (transpiled SELECT/MODIFY/DELETE). */
  set_db_store: (store) => z2ui5_port.set_store(store),
  /** Webapp asset provider: (relPath) → string|null (browser builds). */
  set_assets: (provider) => z2ui5_asset.set_provider(provider),
  /**
   * Identity: () → { user, tenant }, read per use from the host's
   * request context. Drives sy-uname, the draft owner binding and the
   * per-session isolation of the sticky store. Required for multi-user
   * deployments — see z2ui5_identity.
   */
  set_identity: (provider) => z2ui5_identity.set_provider(provider),
  /** Session key for an explicit identity — see z2ui5_identity.key_for. */
  session_key_for: (identity) => z2ui5_identity.key_for(identity),

  // ---- app registry ----
  register_app_class: (name, cls) =>
    typeof name === `function`
      ? z2ui5_cl_util.register_app_class(name.name, name)
      : z2ui5_cl_util.register_app_class(name, cls),
  register_app_dir: (dir) => z2ui5_cl_util.register_app_dir(dir),

  // ---- static assets ----
  WEBAPP_DIR: z2ui5_asset.WEBAPP_DIR,
  ui5_resources_dir,

  /**
   * Release the sticky handler of one session — the server-side half of the
   * frontend's `sap-terminate: session` beacon (sent when the tab closes).
   * Without it a sticky app's full state lingers until STICKY_MAX evicts it.
   * Pass the same reqInfo the roundtrip used, or nothing to drop the session
   * identified by the current identity context.
   */
  drop_sticky: (reqInfo) => _sticky_handlers.delete(_sticky_key(reqInfo)),

  /** Test-only — clear the sticky-handler store between test cases. */
  _reset_sticky: () => { _sticky_handlers.clear(); },
};
