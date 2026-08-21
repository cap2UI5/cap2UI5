// The approuter routing contract.
//
// WHY THIS EXISTS
// ---------------
// mta.yaml has always defined an `abap2UI5-srv` destination pointing at the CAP
// module (~{srv-api/srv-url}, HTML5.ForwardAuthToken: true) — and xs-app.json
// never routed anything to it. Its last route is a catch-all
// (`^(.*)$` → html5-apps-repo-rt), so on a real BTP deployment the frontend's
// POST to /rest/root/z2ui5 went to the static HTML5 repository instead of the
// service. Every roundtrip — i.e. the entire application — would have failed,
// and nothing anywhere noticed: the jest suite runs against a local `cds`
// server that never sees the approuter, and deploy-check deliberately does not
// run `mbt build`.
//
// These tests pin the parts of that file the app cannot work without, so the
// next edit to xs-app.json cannot quietly re-open the hole.
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const XS_APP = JSON.parse(fs.readFileSync(path.join(ROOT, "app", "z2ui5", "xs-app.json"), "utf8"));
const MTA = fs.readFileSync(path.join(ROOT, "mta.yaml"), "utf8");

/** The first route whose source regex matches `url`, i.e. the one that wins. */
function routeFor(url) {
  return XS_APP.routes.find((r) => new RegExp(r.source).test(url));
}

describe("xs-app.json routes the backend, not just the static app", () => {
  test("the z2ui5 roundtrip reaches the CAP service", () => {
    const route = routeFor("/rest/root/z2ui5");
    expect(route).toBeDefined();
    expect(route.destination).toBe("abap2UI5-srv");
    // …and it must win over the catch-all, which is what it did not do before.
    expect(route.service).toBeUndefined();
  });

  test("the OData service reaches the CAP service", () => {
    const route = routeFor("/odata/v4/admin/z2ui5_t_01");
    expect(route).toBeDefined();
    expect(route.destination).toBe("abap2UI5-srv");
  });

  test("the roundtrip route is authenticated", () => {
    // The endpoint itself requires an authenticated user (see z2ui5-service.cds
    // `@(requires: 'authenticated-user')`); the approuter must supply the JWT
    // rather than pass the request through anonymously.
    expect(routeFor("/rest/root/z2ui5").authenticationType).toBe("xsuaa");
  });

  test("the roundtrip route disables approuter CSRF, deliberately", () => {
    // The webapp POSTs with no CSRF token and never fetches one
    // (app/z2ui5/webapp/core/Server.js). With the approuter's default
    // csrfProtection every roundtrip would 403 in the deployed app, so this
    // must stay false. CSRF is defended one layer down instead: the framework's
    // own Origin/Referer gate (z2ui5_cl_ui5_http_handler._check_csrf_rejected),
    // on a request that already carries a forwarded JWT. If the webapp ever
    // learns to fetch a token, delete this line and this test together.
    expect(routeFor("/rest/root/z2ui5").csrfProtection).toBe(false);
  });

  test("/health stays public for the CF readiness probe", () => {
    const route = routeFor("/health");
    expect(route.destination).toBe("abap2UI5-srv");
    expect(route.authenticationType).toBe("none");
  });

  test("the UI5 resource routes still come first", () => {
    // They are `authenticationType: none` and must not be shadowed by any
    // backend route added above them.
    expect(routeFor("/resources/sap-ui-core.js").destination).toBe("ui5");
    expect(routeFor("/test-resources/x.js").destination).toBe("ui5");
  });

  test("the catch-all is last and still serves the static app", () => {
    const last = XS_APP.routes[XS_APP.routes.length - 1];
    expect(last.source).toBe("^(.*)$");
    expect(last.service).toBe("html5-apps-repo-rt");
    expect(routeFor("/index.html").service).toBe("html5-apps-repo-rt");
  });
});

describe("every destination a route names is declared in mta.yaml", () => {
  test("no route points at a destination that does not exist", () => {
    const declared = new Set([...MTA.matchAll(/^\s*Name:\s*(\S+)\s*$/gm)].map((m) => m[1]));
    const missing = XS_APP.routes
      .map((r) => r.destination)
      .filter(Boolean)
      .filter((d) => !declared.has(d));
    expect(missing).toEqual([]);
  });

  test("the srv destination forwards the auth token", () => {
    // Without HTML5.ForwardAuthToken the JWT never reaches CAP and every
    // authenticated roundtrip answers 401 in the deployed app.
    expect(MTA).toMatch(/HTML5\.ForwardAuthToken:\s*true/);
  });
});
