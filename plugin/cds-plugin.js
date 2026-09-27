// cap2ui5 - the CAP plugin.
//
// CAP loads this file from every dependency that has one, so `npm i cap2ui5`
// is the whole installation: on the next cds serve the roundtrip route exists,
// the UI5 shell is served, and cds deploy creates cap2ui5.Drafts next to the
// project's own entities (index.cds, contributed through package.json#cds).
// The project's own server.js, if it has one, is untouched.
//
// The runtime underneath is upstream's own - the real ABAP, downported and
// transpiled by @abaplint/transpiler, published as @abap2ui5/node-runtime. There is
// no port, no transpiler of our own, no hand-maintained framework class.
const cds = require("@sap/cds");
const express = require("express");
const { locate, boot, loadApps } = require("./lib/runtime");
const { definedApps } = require("./lib/define-app");
const { startupHints } = require("./lib/hints");
const { config } = require("./lib/config");

// One logger, as every CAP module and plugin has: plain `[cap2ui5] - ...` lines
// in development, and in production the JSON records CAP writes for itself,
// with the request's correlation_id - so the plugin's lines land in the same
// log search as everything else instead of as loose text on stdout.
const LOG = cds.log("cap2ui5");

cds.on("bootstrap", (app) => {
  const conf = config();                      // cds.requires.cap2ui5 - see lib/config.js
  if (!conf) return LOG.debug("switched off: cds.requires.cap2ui5 is false");
  const rt = locate();
  LOG.info(`@abap2ui5/node-runtime ${rt.version} from ${rt.dir}`);

  // The runtime and the draft store boot NOW, alongside CAP loading the model.
  // The apps load once CAP has served it, as CAP loads a service
  // implementation, so an app module may use cds.entities( ) while it loads.
  //
  // CAP awaits 'served' handlers - and only those - before it listens. So the
  // server listens once every app can answer, and a runtime or an app module
  // that fails to load fails the start, as a service implementation that
  // throws does. It used to be logged while the server listened anyway and
  // answered every roundtrip with a 500.
  let served;
  const ready = Promise.all([boot(rt), new Promise((resolve) => (served = resolve))])
    .then(async ([shim]) => { await loadApps(conf); return shim; });
  ready.catch(() => {});                 // it fails the start below; nothing else awaits it yet
  cds.once("served", () => { served(); return ready; });

  // Where to click, once there is something to click. Not in production -
  // there the addresses and a login hint are noise, and the login hint would
  // name a development user.
  cds.once("listening", ({ url }) => {
    ready.then(() => {
      const lines = startupHints({
        apps: definedApps(),
        url,
        route: conf.routes[0],
        appsDir: conf.apps,
        auth: cds.env.requires?.auth,
        roles: conf.roles,
        production: cds.env.profiles?.includes("production"),
      });
      for (const line of lines) LOG.info(line);
    }, () => {});
  });

  // No static frontend route: the page the roundtrip route answers a GET
  // with embeds the whole UI5 component - every module, view and stylesheet,
  // from the runtime's own commit - so the browser needs no files from here.

  // Who may call, decided the way CAP decides it for a service annotated with
  // @requires (check_roles in CAP's HTTP adapter): any one of the roles lets
  // the user in, so a list means one of them; an anonymous user is asked to
  // log in (401); an authenticated user without the role is refused (403).
  // The auth strategy of cds.requires.auth - mocked in development, xsuaa or
  // ias in production - has run by then, in the chain below. "any" is CAP's
  // pseudo role for everybody, anonymous included, and no roles (null) let
  // anybody in as well.
  //
  // The guard only decides. CAP's own error middleware, last on the route,
  // answers - so the login challenge, the status and the error body are the
  // ones CAP sends for its own services. It used to answer by itself: 401 and
  // a fresh login challenge to an authenticated user who lacked the role, and
  // 401 to everybody once requires was a list, because cds.User.is( ) takes
  // one role, not an array.
  const { roles } = conf;
  const guard = (req, res, next) => {
    const user = cds.context?.user;
    if (!roles.length || roles.some((role) => user?.is(role))) return next();
    if (!user?.is("authenticated-user")) return next(401);
    next(new cds.error(403, `User '${user.id}' is lacking required roles: [${roles}]`));
  };

  // What a CAP protocol adapter does with an error before the final handler
  // sees it: a status, the code CAP derives from it, the message - and nothing
  // of the body parser's internals. Measured on a CAP service: a body over the
  // limit answers {"error":{"message":"request entity too large","code":"413"}};
  // passed on raw, the same 413 also carried expected, length, limit and type.
  const normalize = (err, req, res, next) => {
    if (typeof err === "number") return next(err);                 // 401: the login challenge
    const status = err.status ?? err.statusCode ?? 500;
    next(Object.assign(new cds.error(status, err.message), { code: String(status) }));
  };

  // The roundtrip endpoint. cl_express_icf_shim is upstream's own adapter and
  // reads plain express fields (req.method, req.body, headers, url) - so CAP,
  // whose handlers expose the raw express request, can hand it the same objects
  // an express app would. That is the whole reason this plugin is short.
  //
  // cds.middlewares.before is NOT optional. cds.context - and with it
  // cds.context.user - exists only where CAP's own middlewares ran, and CAP
  // mounts them per service path, never globally. A route mounted straight on
  // express does not get them: the draft store then sees every caller as
  // "anonymous", a draft created by alice answers to bob, and the owner
  // binding z2ui5_if_ui5_draft_store promises is void. Measured before this
  // line existed: two authenticated roundtrips, both stored as "anonymous".
  //
  // guard BEFORE the body parser: it reads cds.context and nothing else, and
  // behind the parser an unauthenticated caller could make the server buffer
  // a whole body - up to the limit - before the 401 was even decided.
  //
  // cds.middlewares.errors( ) LAST, as CAP mounts it behind every protocol
  // adapter, with normalize in front of it as the adapter's own error step: it
  // answers what the guard and the body parser pass on (401, 403, 413) in
  // CAP's format. The roundtrip handler answers its own failures.
  app.all(
    conf.routes,
    ...cds.middlewares.before.filter(Boolean),
    guard,
    express.raw({ type: "*/*", limit: conf.limit }),
    async (req, res) => {
      try {
        const { cl_express_icf_shim } = await ready;
        if (!req.body || !Buffer.isBuffer(req.body)) req.body = Buffer.alloc(0);
        await cl_express_icf_shim.run({ req, res, class: "ZCL_SICF" });
      } catch (e) {
        // The detail goes to the log, not to the caller: CDS and driver messages
        // carry entity names, SQL fragments and deployment paths, none of which
        // a roundtrip client needs and all of which are free reconnaissance.
        const ref = cds.context?.id ?? "-";
        LOG.error(`roundtrip failed (${ref}):`, e);
        if (!res.headersSent) res.status(500).type("text/plain").send(`roundtrip failed (${ref})`);
      }
    },
    normalize,
    cds.middlewares.errors(),
  );
});
