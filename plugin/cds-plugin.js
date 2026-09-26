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
const { locate, locateFrontend, boot } = require("./lib/runtime");
const { definedApps } = require("./lib/define-app");
const { startupHints } = require("./lib/hints");

cds.on("bootstrap", (app) => {
  const conf = cds.env.cap2ui5;               // defaults from package.json#cds, project overrides
  const rt = locate();
  const ready = boot(rt, conf);
  ready.catch((e) => console.error("[cap2ui5] runtime failed to boot:", e));

  // Where to click, once there is something to click: the server listens
  // before the apps have loaded (boot is async), so the hints wait for both.
  // Not in production - there the addresses and a login hint are noise, and
  // the login hint would name a development user.
  cds.once("listening", ({ url }) => {
    ready.then(() => {
      const lines = startupHints({
        apps: definedApps(),
        url,
        route: [].concat(conf.routes)[0],
        appsDir: conf.apps,
        auth: cds.env.requires?.auth,
        requires: conf.requires,
        production: cds.env.profiles?.includes("production"),
      });
      for (const line of lines) console.log(line);
    }, () => {});
  });
  console.log(`[cap2ui5] @abap2ui5/node-runtime ${rt.version} from ${rt.dir}`);

  // The UI5 frontend as files - only when the project installed
  // @abap2ui5/embed-control. The roundtrip route needs none: its GET page
  // embeds the whole component, from the runtime's own commit. Files are for
  // what loads the component by URL (a launchpad tile, a UI5 app placing
  // z2ui5.embed.Container), and the frontend's version is then the project's
  // to keep equal to the runtime's - the wire protocol says so when it is not.
  const fe = locateFrontend();
  if (fe && conf.webapp) {
    app.use(conf.webapp, express.static(fe.webapp, { maxAge: "1h" }));
    console.log(`[cap2ui5] @abap2ui5/embed-control ${fe.version} served at ${conf.webapp}`);
    if (fe.version !== rt.version) {
      console.warn(`[cap2ui5] @abap2ui5/embed-control ${fe.version} and @abap2ui5/node-runtime ${rt.version} differ - install the same version of both`);
    }
  }

  // Who may call. Whatever cds.requires.auth is configured to (mocked in
  // development, xsuaa/ias in production) has already run by the time this
  // executes - see the middleware chain below - so the check is one line, and
  // a project that wants anonymous access sets cds.cap2ui5.requires to null.
  const guard = (req, res, next) => {
    if (!conf.requires || cds.context?.user?.is(conf.requires)) return next();
    if (typeof req._login === "function") return req._login();   // basic auth: challenge
    return res.sendStatus(401);
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
  // 10 MB per request before the 401 was even decided.
  app.all(
    conf.routes,
    ...cds.middlewares.before.filter(Boolean),
    guard,
    express.raw({ type: "*/*", limit: "10mb" }),
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
        console.error(`[cap2ui5] roundtrip failed (${ref}):`, e);
        if (!res.headersSent) res.status(500).type("text/plain").send(`roundtrip failed (${ref})`);
      }
    },
  );
});
