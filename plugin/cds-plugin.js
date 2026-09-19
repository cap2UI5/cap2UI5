// cap2ui5 - the CAP plugin.
//
// CAP loads this file from every dependency that has one, so `npm i cap2ui5`
// is the whole installation: on the next cds serve the roundtrip route exists,
// the UI5 shell is served, and cds deploy creates cap2ui5.Drafts next to the
// project's own entities (index.cds, contributed through package.json#cds).
// The project's own server.js, if it has one, is untouched.
//
// The runtime underneath is upstream's own - the real ABAP, downported and
// transpiled by @abaplint/transpiler, published as @abap2ui5/runtime. There is
// no port, no transpiler of our own, no hand-maintained framework class.
const cds = require("@sap/cds");
const express = require("express");
const { locate, boot } = require("./lib/runtime");

cds.on("bootstrap", (app) => {
  const conf = cds.env.cap2ui5;               // defaults from package.json#cds, project overrides
  const rt = locate();
  const ready = boot(rt, conf);
  ready.catch((e) => console.error("[cap2ui5] runtime failed to boot:", e));
  console.log(`[cap2ui5] @abap2ui5/runtime ${rt.version} from ${rt.dir}`);

  // The UI5 shell, straight from the runtime package. Not mirrored, not
  // patched, not generated - the same directory upstream ships, from the same
  // commit as the backend, which is what removes frontend/backend drift.
  app.use(conf.webapp, express.static(rt.webapp, { maxAge: "1h" }));

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
  app.all(
    conf.routes,
    ...cds.middlewares.before.filter(Boolean),
    express.raw({ type: "*/*", limit: "10mb" }),
    guard,
    async (req, res) => {
      try {
        const { cl_express_icf_shim } = await ready;
        if (!req.body || !Buffer.isBuffer(req.body)) req.body = Buffer.alloc(0);
        await cl_express_icf_shim.run({ req, res, class: "ZCL_SICF" });
      } catch (e) {
        console.error("[cap2ui5] roundtrip failed:", e);
        if (!res.headersSent) res.status(500).type("text/plain").send(String(e?.message || e));
      }
    },
  );
});
