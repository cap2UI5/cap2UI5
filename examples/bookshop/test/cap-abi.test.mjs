// THE CAP ABI GATE - the plugin's coupling surface to @sap/cds, made explicit.
//
// abi-gate.test.mjs guards what the TRANSPILER emits. This file guards the
// other undocumented surface the plugin stands on: @sap/cds internals that are
// not part of its published API and can move in a minor release.
//
// The one that matters most is `cds.middlewares.before`. cds-plugin.js spreads
// it onto the roundtrip route, because CAP mounts its middlewares per SERVICE
// PATH and a route mounted straight on express never gets cds.context - and
// without cds.context the draft store cannot see a user at all. But that array
// is MIXED: two of its four entries are `{ factory }` OBJECTS, not functions.
// The plugin gets away with passing them to app.all only because
//
//   (a) the AUTH middleware is a plain function, so it really does run, and
//   (b) the objects are inert - their factory answers an empty array.
//
// Neither is documented. If a cds release turned auth into a `{ factory }`
// entry, the spread would hand express an inert object and the route would run
// with no authentication: the guard answers 401 for everybody then, so the
// symptom is a DEAD ROUTE rather than a leak - but it must fail HERE, on a
// named assertion, and not in production on a blank screen.
//
// Measured across every auth kind on 2026-09-20 (cds 9.9.3): mocked, basic,
// dummy, jwt, xsuaa and ias all put the auth middleware in as a plain function
// (basic_auth / dummy_auth / jwt_auth / ias_auth). The production three need
// @sap/xssec and a service binding, which is why they are exercised through a
// fake, structurally complete binding below - only the chain's SHAPE is under
// test here, never token validation.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { test } from "node:test";
import cds from "@sap/cds";
import { EXAMPLE } from "./server.mjs";

const require = createRequire(import.meta.url);
const has = (m) => { try { require.resolve(m, { paths: [EXAMPLE] }); return true; } catch { return false; } };

// Obviously fake, structurally complete - enough for cds to BUILD the strategy.
// Nothing here is a credential; no request is ever made with it.
const FAKE_BINDING = JSON.stringify({
  xsuaa: [{ name: "uaa", label: "xsuaa", tags: ["xsuaa"], credentials: {
    clientid: "sb-not-a-real-app!t1", clientsecret: "not-a-secret-structural-placeholder",
    url: "https://example.invalid", identityzone: "test",
    identityzoneid: "00000000-0000-0000-0000-000000000000",
    tenantid: "00000000-0000-0000-0000-000000000000", tenantmode: "dedicated",
    sburl: "https://example.invalid", uaadomain: "example.invalid",
    verificationkey: "-----BEGIN PUBLIC KEY-----\nNOTAKEY\n-----END PUBLIC KEY-----",
    xsappname: "not-a-real-app!t1", apiurl: "https://example.invalid",
  } }],
  identity: [{ name: "ias", label: "identity", tags: ["identity"], credentials: {
    clientid: "not-a-real-client", url: "https://example.invalid",
    domains: ["example.invalid"], domain: "example.invalid",
    certificate: "-----BEGIN CERTIFICATE-----\nNOTACERT\n-----END CERTIFICATE-----",
    key: "-----BEGIN PRIVATE KEY-----\nNOTAKEY\n-----END PRIVATE KEY-----",
  } }],
});

/** The shape of cds.middlewares.before for one auth kind, read in a CHILD
 *  process: the strategy is chosen once per module load, so one process can
 *  only ever answer for one kind. */
function chainFor(kind) {
  const src = `
    const cds = require("@sap/cds");
    const b = cds.middlewares.before || [];
    console.log(JSON.stringify({
      entries: b.map((x) => typeof x === "function"
        ? { fn: x.name || "anonymous" }
        : { keys: Object.keys(x), factoryAnswers: (() => { try { return JSON.stringify(x.factory()); } catch { return "threw"; } })() }),
    }));`;
  const out = execFileSync(process.execPath, ["-e", src], {
    cwd: EXAMPLE,
    env: { ...process.env, CDS_REQUIRES_AUTH_KIND: kind, VCAP_SERVICES: FAKE_BINDING },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  return JSON.parse(out.trim().split("\n").pop());
}

const DEV_KINDS = ["mocked", "basic", "dummy"];
const PROD_KINDS = ["jwt", "xsuaa", "ias"];
const KINDS = has("@sap/xssec") ? [...DEV_KINDS, ...PROD_KINDS] : DEV_KINDS;

test("the auth middleware is a plain FUNCTION in cds.middlewares.before, for every auth kind", (t) => {
  // Say so rather than silently covering half: @sap/xssec is a devDependency
  // of this example precisely so the production three are in the gate, and a
  // run without it is a weaker run, not an equal one.
  if (KINDS.length === DEV_KINDS.length) {
    t.diagnostic(`@sap/xssec not resolvable - ${PROD_KINDS.join(", ")} NOT covered by this run`);
  }
  for (const kind of KINDS) {
    const { entries } = chainFor(kind);
    const authFns = entries.filter((e) => e.fn && /auth/i.test(e.fn)).map((e) => e.fn);
    assert.equal(
      authFns.length, 1,
      `auth kind "${kind}": expected exactly one auth middleware as a plain function in ` +
        `cds.middlewares.before, found ${JSON.stringify(entries)}. If it has become a ` +
        `{ factory } entry, cds-plugin.js must call the factory instead of spreading the ` +
        `array - otherwise the roundtrip route runs with no authentication.`,
    );
  }
});

test("the non-function entries of the chain are inert, which is why spreading them is safe", () => {
  for (const kind of KINDS) {
    const { entries } = chainFor(kind);
    for (const e of entries.filter((x) => !x.fn)) {
      assert.deepEqual(e.keys, ["factory"], `auth kind "${kind}": unexpected entry ${JSON.stringify(e)}`);
      assert.equal(
        e.factoryAnswers, "[]",
        `auth kind "${kind}": a { factory } entry of cds.middlewares.before no longer answers an ` +
          `empty array. express rejects a non-function handler, so cds-plugin.js can no longer ` +
          `spread the array as it stands - resolve the factories first.`,
      );
    }
  }
});

test("cds.context.user.is( ) - what the route guard decides on - exists", () => {
  const u = new cds.User({ id: "alice", roles: ["authenticated-user"] });
  assert.equal(typeof u.is, "function");
  assert.equal(u.is("authenticated-user"), true);
  assert.equal(u.is("no-such-role"), false);
  assert.equal(cds.User.anonymous.is("authenticated-user"), false);
});

test("cds.User permits an EMPTY id - which is what who( ) in draft-store guards against", () => {
  // If this ever stops being true the guard in who( ) becomes dead code, and
  // the comment explaining it should go with it. Until then it is reachable:
  // an empty owner is what made an ownerless draft everybody's (see §20).
  assert.equal(new cds.User({ id: "" }).id, "");
  assert.equal(new cds.User({}).id, undefined);
});
