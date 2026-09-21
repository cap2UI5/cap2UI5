# AGENTS.md — cap2UI5

Guidance for AI agents and contributors. Read before making any change.

## What this is

abap2UI5 hosted in CAP. **There is no port here**: `plugin/` is ~570 lines of
hand-written JavaScript that boots upstream's transpiled runtime
(`@abap2ui5/runtime`), keeps its drafts in a CDS entity and lets apps be plain
JavaScript classes. Everything the framework does, upstream's ABAP does. The
decision and its evidence: `docs/adr/adr-008-host-not-port.md`.

## Layout, and what is generated

| path | hand-written? |
|---|---|
| `plugin/` | yes — the npm package `cap2ui5` |
| `examples/bookshop/` | yes — a CAP project using it; **the test suite lives here** because the tests need a project. `srv/catalog-service.cds` is deliberately an ordinary CAP service that knows nothing about cap2UI5: it is what `coexistence.test.mjs` drives to prove the plugin is a guest in the project and not its host. |
| `runtime/package.json`, `runtime/README.md` | yes — the stand-in's manifest |
| `runtime/output/`, `runtime/setup/`, `runtime/webapp/` | **no — upstream's transpiled output, never edited, never committed.** `scripts/assemble-runtime.sh` fills them from an upstream build or, once it exists, from the published package (`--package X.Y.Z`). |
| `docs/adr/` | the decision records, copied from builder-abap2UI5-js where they were made; historical paths in them refer to that repository |

## Rules

- **"Unsupported" must say WHOSE limitation it is.** Nested structures were
  called a framework limitation in three documents; they were a guard in
  `defineApp`'s own type derivation, written when only scalars had been tried,
  and the framework had carried the whole tree all along. Before writing that
  something cannot be done, try it.
- **Never change behaviour without a test in `examples/bookshop/test/`.** The
  suite is the gate; there is no other.
- **A facade method that composes view XML needs a BROWSER test, not only a
  wire test.** The wire tests play the frontend's part by hand, so they can
  feed an event argument the real page would never send — which is how
  `c.event(name, args)` was missing while `nav.test.mjs` was green and the
  browser was not. When the browser finds such a thing, add the assertion to
  the wire test as well, so the cheap test fails next time too.
- **Read `z2ui5_if_client`'s ABAP Doc before wiring one of its methods into the
  facade.** Several are declared *"obsolete — does NOTHING"*
  (`view_model_update` and its popup/nest siblings), and the two lifecycle
  predicates answer different questions than their names suggest:
  `check_on_init( )` is the first roundtrip of *this instance*,
  `check_on_navigated( )` is also every return from a navigation or a value
  help, and it is the one to render in. The facade refuses the first group and
  renames the second to `isFirstRun` / `isDisplay`; `abi-gate.test.mjs` holds
  both decisions so a change upstream re-opens them instead of passing
  silently.
- **Every `@sap/cds` INTERNAL the plugin stands on goes into
  `cap-abi.test.mjs`.** `abi-gate.test.mjs` guards what the transpiler emits;
  this is the other undocumented surface. The one that matters is
  `cds.middlewares.before`, which is a MIXED array — two of its four entries
  are `{ factory }` objects, and the plugin gets away with spreading them onto
  the route only because the auth middleware is a plain function and the
  objects are inert. Measured across all six auth kinds (`mocked`, `basic`,
  `dummy`, `jwt`, `xsuaa`, `ias`); `@sap/xssec` is a devDependency of the
  example so the production three are in the gate and not merely assumed.
- **Every new `abap.*` or `z2ui5_*$*` touchpoint in `plugin/lib/` goes into
  `abi-gate.test.mjs`.** The plugin couples to the transpiler's emission
  format (static `ATTRIBUTES`/`METHODS` maps, `constructor_( )`, `~` → `$`),
  which is not a published contract; that test is where a transpiler bump
  must fail.
- `npm test` stays browserless. Browser tests are `*.e2e.mjs`, run by
  `npm run test:browser`.
- **The workspace cannot prove the PACKAGE.** Every test here runs with
  `cap2ui5` and `@abap2ui5/runtime` as workspace symlinks, so a missing entry
  in `files`, a `main` pointing at nothing, or a model contribution that only
  resolves relatively cannot fail - and all of them fail on `npm i cap2ui5`.
  `npm run consumer-test` packs both packages as `npm publish` would, installs
  the tarballs into a throwaway CAP project and drives a roundtrip. Run it
  before publishing and after anything that touches `files`, `main`,
  `exports`, `index.cds` or how the runtime is located. It is not in
  `npm test`: it installs from the network and takes about a minute.
- `no-undef` is an error and stays one: CAP's `SELECT` etc. are imported from
  `cds.ql`, not used as globals.
- **An authorization check compares PRESENCE, never truthiness.** The draft
  store's three owner checks read `if (r.owner && r.owner !== who())`, which
  made a row with a `NULL` or `""` owner readable and writable by everybody
  instead of by nobody — a security review found it and a proof of concept
  confirmed it: bob replayed alice's draft id against a blanked row and was
  served her app state. `&&` in front of a comparison in an access check is
  the bug: it turns a missing value into a wildcard. The same rule covers
  the identity side — `?? ` catches `null` and `undefined` but not `""`, and
  `cds.User` permits an empty id, so `who( )` refuses one rather than storing
  a draft under an owner it cannot tell from anybody else's.
- **The guard goes in FRONT of the body parser.** Behind it, an
  unauthenticated caller makes the server buffer the whole body before the
  401 is decided. The guard reads `cds.context` and nothing else, so nothing
  requires it to be later in the chain.
- The route must stay behind `cds.middlewares.before`. Without it
  `cds.context` does not exist and every draft is `anonymous` — the first
  version of the plugin got that wrong; `auth.test.mjs` is the proof it stays
  fixed.
- **Not everything upstream does works here — measure before believing it.**
  The runtime is real ABAP on open-abap, and where upstream reaches for the
  ABAP system it finds nothing. The user exit is the case in point: it is
  *discovered* in ABAP, by asking the class repository which classes implement
  `Z2UI5_IF_UI5_EXIT` (`SEO_INTERFACE_IMPLEM_GET_ALL`, XCO on cloud). open-abap
  has neither, the call raises, and the framework's own `CATCH cx_root` reads
  that as "no exit configured" — so the CSP, the security headers, the
  bootstrap URL and the draft expiry were silently unreachable, with no error
  anywhere. `defineExit` binds the exit to the same static
  `exit_instantiate( )` writes to. Before documenting a framework behaviour,
  boot the runtime and check it.
- **A host-side reimplementation of a framework contract follows the shipped
  one.** The CDS draft store's `cleanup( )` hard-coded four hours while
  upstream's store asks the user exit for `draft_exp_time_in_hours`; a project
  raising the expiry got drafts the framework would have resumed and the
  cleanup had already deleted. When reimplementing an interface, read what the
  shipped implementation does with each method, not only what the interface
  declares.
- Commit messages say why. The history of this project is its evidence.

## Running

See README.md. `npm run lint && npm test` before every push; `cold-test`,
`bench` and `test:browser` when the plugin or the runtime changed.
