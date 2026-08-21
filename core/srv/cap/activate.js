/**
 * activate — the whole CAP wiring for the abap2UI5 core, in one call.
 *
 * WHY THIS EXISTS
 * ---------------
 * Everything here used to live in the generated app's `srv/server.js`, which
 * meant the only way to get a working cap2UI5 project was to clone a repository
 * that is explicitly a build artifact ("do not hand-edit anything outside
 * .github/") and inherit ~160 lines of platform boilerplate you then had to
 * keep in sync by hand. There was no supported way to *start* a project.
 *
 * The boilerplate is not project-specific: identity, the draft store, app
 * discovery, the bootstrap routes and the UI5 runtime mount are the same in
 * every consumer. So they live here, and both entry points call this:
 *
 *   - `cds-plugin.js` at the package root, which CAP loads automatically for
 *     any project that depends on this package — `npm i` and nothing else;
 *   - the generated app's own `srv/server.js`, which calls it explicitly.
 *
 * The second one is what keeps this honest: the app's jest suite exercises
 * exactly the code path an external consumer gets.
 *
 * Everything is opt-outable through `options`, because a consumer that wants
 * one piece done differently should not have to give up the rest.
 */
"use strict";

/**
 * Resolve @sap/cds from the CONSUMER's tree, not ours.
 *
 * A plain `require("@sap/cds")` is wrong here and fails in the one case that
 * matters most. This package is normally a `file:` dependency (the generated
 * app vendors it at ./core; a project under development links a checkout), and
 * npm installs those as SYMLINKS. Node resolves from the *real* path of the
 * requiring file, so the lookup walks up from wherever the package actually
 * lives — outside the consumer's tree entirely — and throws. The plugin then
 * reports "@sap/cds not resolvable" while running inside a live CAP server,
 * which is exactly what the first end-to-end probe of this file hit.
 *
 * So ask from the consumer's directory explicitly, and keep the plain require
 * as the fallback for a normal (non-symlinked) install.
 */
function requireCds() {
  for (const paths of [[process.cwd()], null]) {
    try {
      return paths ? require(require.resolve("@sap/cds", { paths })) : require("@sap/cds");
    } catch {
      /* try the next strategy */
    }
  }
  return null;
}

/**
 * @param {object} [options]
 * @param {boolean} [options.identity=true]    bind sy-uname to the CDS user
 * @param {boolean} [options.store=true]       persist drafts in the CDS entity
 * @param {boolean} [options.routes=true]      GET/HEAD bootstrap routes
 * @param {boolean} [options.resources=true]   serve the bundled UI5 runtime
 * @param {boolean} [options.retention=true]   prune expired drafts hourly
 * @param {string}  [options.path]             endpoint path
 * @param {string}  [options.entity]           draft entity, `namespace.name`
 * @param {string[]} [options.appDirs]         extra folders to scan for apps
 */
function activate(options = {}) {
  const cds = options.cds || requireCds();
  if (!cds) return { active: false, reason: "@sap/cds not resolvable" };

  const {
    identity = true,
    store = true,
    routes = true,
    resources = true,
    retention = true,
    path: endpoint = "/rest/root/z2ui5",
    entity = "cap2ui5.z2ui5_t_01",
  } = options;

  const engine = require("../z2ui5/engine");
  const applied = [];

  // Identity: who the framework acts for. The core is platform-neutral and has
  // no ambient sy-uname, so CAP's request-scoped user is injected as a
  // provider — read PER USE, because cds.context is async-local and one
  // installed provider has to stay correct under concurrent requests.
  if (identity) {
    engine.set_identity(() => ({
      user: cds.context?.user?.id,
      tenant: cds.context?.tenant,
    }));
    applied.push("identity");
  }

  // Draft persistence. Every row is stamped with its owner and only ever
  // loaded back for that same owner: a draft id is a UUID but not a secret —
  // ids travel in request bodies, logs and browser history — so unguessability
  // is never the access control. The service projection enforces the same rule
  // independently; this path does not go through the service, so it checks for
  // itself.
  if (store) {
    const [namespace] = entity.split(".");
    const name = entity.slice(namespace.length + 1);
    const owner = () => cds.context?.user?.id || "anonymous";
    const target = () => {
      const e = cds.entities(namespace)?.[name];
      if (!e) throw new Error(`z2ui5: draft entity '${entity}' is not in the model`);
      return e;
    };
    engine.set_store({
      load: async (id) => SELECT.one.from(target()).where({ id, owner: owner() }),
      save: async (draft) => { await INSERT.into(target()).entries({ ...draft, owner: owner() }); },
    });
    applied.push("store");
  }

  // App discovery. Apps bundled inside the package are found without
  // registration; anything outside it has to be pointed at. Z2UI5_APP_DIRS is
  // the deployment-time knob (path-separated), `appDirs` the code-level one.
  const dirs = [
    ...(options.appDirs || []),
    ...String(process.env.Z2UI5_APP_DIRS || "").split(require("path").delimiter).filter(Boolean),
  ];
  for (const dir of dirs) engine.register_app_dir(dir);
  if (dirs.length) applied.push(`appDirs(${dirs.length})`);

  if (retention) {
    cds.on("served", () => {
      try {
        require("./retention").start({ cds, entity });
      } catch (e) {
        console.error("[z2ui5] draft retention could not start:", e.message);
      }
    });
    applied.push("retention");
  }

  if (routes || resources) {
    cds.on("bootstrap", (app) => {
      if (resources) mountResources(app, engine);
      if (routes) mountRoutes(app, engine, endpoint, cds);
    });
    applied.push(...[resources && "resources", routes && "routes"].filter(Boolean));
  }

  // Implement the action of whichever service carries it. Registered by
  // reacting to the service being served rather than by shipping a `.js` next
  // to the `.cds`, so it also binds when a consumer renames the service or
  // declares the action on their own.
  if (options.impl !== false) {
    cds.on("serving", (srv) => {
      if (!srv.definition?.actions?.z2ui5) return;
      srv.on("z2ui5", require("../z2ui5/02/z2ui5_cl_ui5_http_handler"));
    });
    applied.push("impl");
  }

  return { active: true, applied, endpoint, entity };
}

/**
 * Serve the bundled UI5 runtime at /resources. Registered before the CDS
 * services so the OData/REST routing cannot shadow it. The trailing handler
 * answers a plain 404 for files the dist does not ship (locale bundles UI5
 * probes for and then falls back on) instead of letting each miss bubble up as
 * a logged error.
 */
function mountResources(app, engine) {
  const dir = engine.ui5_resources_dir?.();
  if (!dir) {
    // Not fatal: a consumer may deliberately bootstrap UI5 from a CDN. Say so
    // once, clearly, rather than failing at the first blank page.
    console.warn("[z2ui5] openui5-dist not resolvable — /resources not served; bootstrap from a CDN instead");
    return;
  }
  const express = require("express");
  app.use("/resources", express.static(dir), (_req, res) => res.status(404).end());
}

function mountRoutes(app, engine, endpoint, cds) {
  const z2ui5_cl_util_http = require("../z2ui5/00/03/z2ui5_cl_util_http");

  // GET — the bootstrap shell. Public on purpose: it carries no user data and
  // keeping it open preserves the offline/dev flow. In BTP the approuter
  // authenticates before the frontend can reach it anyway.
  app.get(endpoint, (req, res) => {
    // bootstrap_html renders arbitrary app HTML — never let a failure escape
    // as an unhandled express error, i.e. a raw stack trace to the client.
    try {
      const reqInfo = z2ui5_cl_util_http.factory_cloud(req, res).get_req_info();
      const { html, headers } = engine.bootstrap_html(reqInfo);
      for (const h of headers) res.set(h.n, h.v);
      res.set("Content-Type", "text/html; charset=utf-8");
      res.status(200).send(html);
    } catch (e) {
      console.error(`[z2ui5] GET ${endpoint} bootstrap failed:`, e);
      res.status(500).set("Content-Type", "text/plain; charset=utf-8").send(`z2ui5 bootstrap failed: ${e.message}`);
    }
  });

  // HEAD serves two clients: the CSRF prefetch, and the beacon the webapp
  // sends on tab close (`sap-terminate: session`). That beacon is the only
  // signal a session is over, so it is where a sticky app's retained state is
  // released — otherwise it lingers until the store evicts it under pressure.
  app.head(endpoint, (req, res) => {
    if (String(req.get("sap-terminate") || "").toLowerCase() === "session") {
      // Registered on the bootstrap express app, ahead of the CDS middleware
      // chain, so cds.context is not established here and the key has to come
      // from whatever the request itself carries. When that is nobody we drop
      // NOTHING: releasing a guessed key would evict a stranger's session.
      const user = req.user?.id || cds.context?.user?.id;
      const session_id = engine.session_key_for({ user, tenant: cds.context?.tenant });
      if (session_id) {
        try {
          engine.drop_sticky({ session_id });
        } catch (e) {
          console.error("[z2ui5] sticky release failed:", e.message);
        }
      }
    }
    // The endpoint uses no token-based CSRF — it validates Origin/Referer
    // instead (z2ui5_cl_ui5_http_handler._check_csrf_rejected) — so "disabled"
    // is the accurate answer to a token prefetch, not an absence of protection.
    res.set("X-CSRF-Token", "disabled");
    res.status(200).end();
  });
}

module.exports = { activate, requireCds };
