// THE CAP ABI GATE - the plugin's coupling surface to @sap/cds, made explicit.
//
// abi-gate.test.mjs guards what the TRANSPILER emits. This file guards what
// the plugin assumes about @sap/cds beyond what CAP's documentation states.
//
// The assumption that matters most is the SHAPE of `cds.middlewares.before`.
// The list itself is documented ("cds.middlewares" in CAP's node.js docs):
// CAP mounts it in front of every protocol adapter, and cds-plugin.js spreads
// it onto the roundtrip route for the same reason - without it there is no
// cds.context, and without cds.context the draft store cannot see a user at
// all. What the docs do not state is what an ENTRY is. Measured: a function,
// or an ARRAY - trace( ) and ctx_model( ) answer an empty array when they are
// off - and express flattens arrays among route handlers, so an empty one
// simply vanishes. (An earlier version of this file called those entries
// "{ factory } objects": they are arrays that carry a `factory` property,
// which is how cds.middlewares.add( ) finds them by name.)
//
// So what must hold is:
//
//   (a) every entry is a function or an array of functions - what express
//       accepts as route handlers - and
//   (b) the AUTH middleware is one of those functions, exactly once.
//
// If a cds release broke (b), the spread would mount no authentication and
// the guard would answer 401 for everybody - a DEAD ROUTE rather than a leak,
// but it must fail HERE, on a named assertion, and not in production on a
// blank screen.
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
    const fn = (x) => x.name || "anonymous";
    console.log(JSON.stringify({
      entries: b.map((x) => typeof x === "function" ? { fn: fn(x) }
        : Array.isArray(x) ? { array: x.map((y) => typeof y === "function" ? { fn: fn(y) } : { other: typeof y }) }
        : { other: typeof x, keys: Object.keys(x ?? {}) }),
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

/** the entries as express will see them: arrays flattened */
const flat = (entries) => entries.flatMap((e) => e.array ?? [e]);

test("the auth middleware is a plain FUNCTION in cds.middlewares.before, for every auth kind", (t) => {
  // Say so rather than silently covering half: @sap/xssec is a devDependency
  // of this example precisely so the production three are in the gate, and a
  // run without it is a weaker run, not an equal one.
  if (KINDS.length === DEV_KINDS.length) {
    t.diagnostic(`@sap/xssec not resolvable - ${PROD_KINDS.join(", ")} NOT covered by this run`);
  }
  for (const kind of KINDS) {
    const { entries } = chainFor(kind);
    const authFns = flat(entries).filter((e) => e.fn && /auth/i.test(e.fn)).map((e) => e.fn);
    assert.equal(
      authFns.length, 1,
      `auth kind "${kind}": expected exactly one auth middleware as a plain function in ` +
        `cds.middlewares.before, found ${JSON.stringify(entries)}. The roundtrip route mounts ` +
        `this list as it stands - without the auth function in it, the route runs with no ` +
        `authentication.`,
    );
  }
});

test("every entry of the chain is a function or an array of functions - what express mounts", () => {
  for (const kind of KINDS) {
    const { entries } = chainFor(kind);
    const odd = flat(entries).filter((e) => !e.fn);
    assert.deepEqual(
      odd, [],
      `auth kind "${kind}": cds.middlewares.before has entries express cannot mount as route ` +
        `handlers: ${JSON.stringify(entries)}. cds-plugin.js spreads the list onto the route, so ` +
        `it has to resolve such an entry first.`,
    );
  }
});

test("cds.User.is( ) - what the route guard decides on - answers as the guard reads it", () => {
  const u = new cds.User({ id: "alice", roles: ["admin"] });
  assert.equal(typeof u.is, "function");
  assert.equal(u.is("admin"), true);
  assert.equal(u.is("no-such-role"), false);
  // the pseudo roles: every authenticated user is "authenticated-user", which
  // is how the guard tells a 401 (log in) from a 403 (lacking the role); and
  // "any" is everybody, the anonymous user included
  assert.equal(u.is("authenticated-user"), true);
  assert.equal(cds.User.anonymous.is("authenticated-user"), false);
  assert.equal(cds.User.anonymous.is("any"), true);
  // ONE role per call - a list answers false, which is why the guard asks
  // role by role (it once passed the list and let nobody in)
  assert.equal(u.is(["admin", "support"]), false);
});

test("cds.User permits an EMPTY id - which is what who( ) in draft-store guards against", () => {
  // If this ever stops being true the guard in who( ) becomes dead code, and
  // the comment explaining it should go with it. Until then it is reachable:
  // an empty owner is what made an ownerless draft everybody's (see §20).
  assert.equal(new cds.User({ id: "" }).id, "");
  assert.equal(new cds.User({}).id, undefined);
});
