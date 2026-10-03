# AGENTS.md — cap2UI5

Guidance for AI agents and contributors. Read before making any change.

## What this is

abap2UI5 hosted in CAP. **There is no port here**: `plugin/` is ~570 lines of
hand-written JavaScript that boots upstream's transpiled runtime
(`@abap2ui5/node-runtime`), keeps its drafts in a CDS entity and lets apps be plain
JavaScript classes. Everything the framework does, upstream's ABAP does. The
decision and its evidence: `docs/adr/adr-008-host-not-port.md`.

## Layout, and what is generated

| path | hand-written? |
|---|---|
| `plugin/` | yes — the npm package `@cap2ui5/cds-plugin` (`cap2ui5` up to 0.2.0) |
| `plugin/lib/agent/vendor/` | **no — abap2UI5/mcp-server's `viewxml.mjs`, `snapshot.mjs`, `appclient.mjs`, vendored unchanged at the commit `source.json` records by `scripts/vendor-agent.mjs` (`npm run agent-vendor`), never edited.** `agent-vendor.test.mjs` fails on a hand edit; a fix goes upstream, then re-vendor. ADR-009. |
| `examples/bookshop/` | yes — a CAP project using it; **the test suite lives here** because the tests need a project. `srv/catalog-service.cds` is deliberately an ordinary CAP service that knows nothing about cap2UI5: it is what `coexistence.test.mjs` drives to prove the plugin is a guest in the project and not its host. |
| `runtime/package.json`, `runtime/README.md` | yes — the stand-in's manifest |
| `runtime/output/`, `runtime/setup/`, `runtime/downport/` | **no — upstream's transpiled output and the ABAP it came from, never edited, never committed.** `scripts/assemble-runtime.sh` fills them from the published package (`--package X.Y.Z`) or from an upstream build. |
| `docs/adr/`, `docs/transpiler-roadmap.md` | the decision records and the roadmap ADR-006 cites, moved here from `cap2UI5/builder-abap2UI5-js`, where they were made and which is being archived. They are the only copies this project keeps; historical paths in them refer to that repository. |

## Rules

- **"Unsupported" must say WHOSE limitation it is.** Nested structures were
  called a framework limitation in three documents; they were a guard in
  `defineApp`'s own type derivation, written when only scalars had been tried,
  and the framework had carried the whole tree all along. Before writing that
  something cannot be done, try it.
- **Never change behaviour without a test in `examples/bookshop/test/`.** The
  suite is the gate; there is no other.
- **The client IS `z2ui5_if_client`, by its own names - and stays it.** An
  app's `main( client )` gets every method of the interface under its ABAP
  name, a method's preferred parameter as its one positional argument and the
  parameters by name as one object with the ABAP names; the constants are the
  interface's (`client.cs_event`, `z2ui5_if_client.cs_event`), the view
  builder is `z2ui5_cl_ui5_view_builder`, called the same way. That is what
  lets an ABAP app port line by line and abap2UI5's documentation describe
  the JavaScript method. So: no JavaScript-only names, no renamed parameters,
  no defaults the ABAP signature does not have (`nest_view_display( )`'s
  `method_insert` is required because ABAP requires it). What JavaScript
  forces - a field bound by its NAME, a placeholder for what only resolves
  after `main( )` - is documented as a difference, not hidden behind a new
  name. `nav.test.mjs` holds the client's names to the interface's in both
  directions, so a method upstream adds fails the suite until it is wired.
  The constant groups are read from the runtime; a parameter is wired in
  `SIGNATURES` (`lib/define-app.js`), and one the runtime in use does not
  declare is refused. So a parameter upstream adds goes into `SIGNATURES`
  with a test that holds on the pinned runtime AND on upstream's main, which
  CI builds - as `view_display( )`'s `transition` does in `nav.test.mjs`.
- **A client method that composes view XML needs a BROWSER test, not only a
  wire test.** The wire tests play the frontend's part by hand, so they can
  feed an event argument the real page would never send — which is how
  event arguments were missing while `nav.test.mjs` was green and the browser
  was not. When the browser finds such a thing, add the assertion to the wire
  test as well, so the cheap test fails next time too.
- **Read `z2ui5_if_client`'s ABAP Doc before wiring one of its methods into the
  client.** Several are declared *"obsolete — does NOTHING"*
  (`view_model_update` and its popup/nest siblings) and do nothing here
  either, and the two lifecycle predicates answer different questions than
  their names suggest: `check_on_init( )` is the first roundtrip of *this
  instance*, `check_on_navigated( )` is also every return from a navigation
  or a value help, and it is the one to render in. `abi-gate.test.mjs` holds
  the no-ops to upstream's, so a change there re-opens the decision instead
  of passing silently.
- **Everything the plugin assumes about `@sap/cds` beyond its documentation
  goes into `cap-abi.test.mjs`.** `abi-gate.test.mjs` guards what the
  transpiler emits; this is the other surface. The one that matters is the
  SHAPE of `cds.middlewares.before`. The list is documented; what an entry is,
  is not. Measured: a function, or an array (`trace` and `ctx_model` answer an
  empty one when they are off), which express flattens away. The plugin spreads
  the list onto the route, so the gate asserts that every entry is a function
  or an array of functions, and that the auth middleware is one of those
  functions. It checks this across all six auth kinds (`mocked`, `basic`,
  `dummy`, `jwt`, `xsuaa`, `ias`). `@sap/xssec` is a devDependency of the
  example, so the production three are covered by the gate and not merely
  assumed. The one other assumption is `cds.app._app_links`, which CAP's
  start page reads to list the apps. It needs a served app, so its gate is
  the start-page test in `coexistence.test.mjs`; if it breaks, only that list
  is lost.
- **Access is decided and answered the way CAP does it for `@requires`.**
  The guard mirrors `check_roles` in CAP's HTTP adapter: one of the roles lets
  the user in, `any` lets everybody in, anonymous users get 401 and
  authenticated users without the role get 403. It only decides. The answer
  comes from `cds.middlewares.errors()`, mounted last on the route as CAP
  mounts it behind its protocol adapters, so the login challenge and the error
  body are CAP's. `auth.test.mjs` holds that behaviour; the plugin does not
  call `req._login()` or any other internal itself.
- **`z2ui5_cl_ui5_view_builder` renders nothing itself.** It records the
  app's chain and replays it after `main( )` against the transpiled
  `z2ui5_cl_ui5_view_builder`, so the view is upstream's, byte for byte, and
  there is no second copy of the builder to keep in step. Its `stringify( )`
  answers a thenable that renders after `main( )` for the same reason. The
  one piece of JavaScript of its own is `escape_literal( )`, which a
  synchronous chain cannot await. `view-builder.test.mjs` pins it to the ABAP
  method, and the replay to the same chain driven directly against the class.
- **`abap2js` refuses rather than guesses.** `plugin/lib/abap2js.js`
  translates the part of ABAP an abap2UI5 app is written in, and anything
  else throws an `Abap2jsError` with file, row and column. Widening it takes
  the construct, a case in `abap2js.test.mjs` (in the fixture if the
  construct is supported, among the refusals if not), and a run of the
  translated samples beside their transpiled originals: a translation that
  reads right is not the gate - one that behaves as the ABAP does is. The
  client's types come from the runtime's `downport/`, not from a list here.
- **Every new `abap.*` or `z2ui5_*$*` touchpoint in `plugin/lib/` goes into
  `abi-gate.test.mjs`.** The plugin couples to the transpiler's emission
  format (static `ATTRIBUTES`/`METHODS` maps, `constructor_( )`, `~` → `$`),
  which is not a published contract; that test is where a transpiler bump
  must fail.
- **The agent endpoint acts as the CAP user who calls, never as anybody
  else.** A tool call runs the route's own roundtrip handler in process,
  inside the MCP request, so `cds.context` - and with it the drafts' owner -
  is the caller's; there is no technical user and no HTTP hop. Every
  behaviour of it - opt-in, `confirm`/`forbidden`, handover, owner scoping,
  the audit row, the restore after a restart - has its test in the
  `agent*.test.mjs` files. ADR-009 records why it looks the way it does.
- `npm test` stays browserless. Browser tests are `*.e2e.mjs`, run by
  `npm run test:browser`.
- **A test about what the route answers serves the example in-process with
  `cds.test`** (`serve()` in `test/server.mjs`), the way a CAP project tests
  itself and the path a consumer's own suite takes through the plugin. **A
  test about the process boots it as a child** (`boot()`): a start that
  fails, a restart, a production profile, a setting only the environment can
  make, or what the log says while the server starts. `cds.test.log()`
  clears its capture before each test, so startup lines are only visible to
  a child.
- **The workspace cannot prove the PACKAGE.** Every test here runs with
  `@cap2ui5/cds-plugin` and `@abap2ui5/node-runtime` as workspace symlinks,
  so a missing entry in `files`, a `main` pointing at nothing, or a model
  contribution that only resolves relatively cannot fail - and all of them
  fail on `npm i @cap2ui5/cds-plugin`.
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

## Publishing

**The package is `@cap2ui5/cds-plugin`; the plugin's own names are
`cap2ui5`.** An app requires the package by its name, and so does what
abap2js writes. What a project configures - `cds.requires.cap2ui5`,
`cds add cap2ui5`, the command `cap2ui5`, the namespace of
`cap2ui5.Drafts`, the logger, the `"cap2ui5": { "apps" }` a package declares
its apps with - is the plugin's, and keeps its name. The unscoped `cap2ui5`
was withdrawn from npm; since 2026-09-30 the name holds a deprecated
placeholder of this project (`0.0.1-placeholder`), whose command only prints
where to go and fails. Docs, comments and messages still write the command
as `npx --no-install cap2ui5 abap2js`, which runs the project's own or
fails: a bare `npx cap2ui5` where the plugin is not installed downloads
whatever npm has under the name, and that is never the plugin.

Every change a user of the package would notice gets a line under
`Unreleased` in `plugin/CHANGELOG.md`, in the same pull request. The PR that
prepares a release bumps `plugin/package.json` and moves those lines under the
new version.

A tag `v<version>` publishes `plugin/` as the npm package
`@cap2ui5/cds-plugin` (`.github/workflows/release.yml`) by **trusted
publishing** - OIDC with
provenance, no token. The workflow refuses a tag that disagrees with
`plugin/package.json`, fills `runtime/` from the PUBLISHED `@abap2ui5/node-runtime`
(the version `plugin/package.json` pins, or the latest), and runs lint, the
suite and `consumer-test` on the tagged commit before it publishes. npm lets a
package be pointed at a workflow only once the package exists, so the first
version is published by hand once (`npm login`, then
`npm publish --workspace plugin --access public`) and the package's Settings →
Trusted Publisher on npmjs.com is pointed at this repository and
`release.yml` - or, from the command line,
`npx npm@11 trust github @cap2ui5/cds-plugin --file release.yml --repo cap2UI5/cap2UI5 --allow-publish`.
Both steps, one right after the other: v0.2.0 was tagged while `cap2ui5`
existed without a Trusted Publisher, and its release failed with
`ENEEDAUTH`. Until the package exists the publish step ends in a warning
naming that bootstrap; once `@cap2ui5/cds-plugin` exists on the registry, a
failed publish is an error. Publish only against a published `@abap2ui5/node-runtime` - never against the
stand-in, which no consumer can install.

## Running

See README.md. `npm run lint && npm test` before every push; `cold-test`,
`bench` and `test:browser` when the plugin or the runtime changed.
