# AGENTS.md — cap2UI5

Guidance for AI agents and contributors. Read before making any change. The
rules say what holds and why in one sentence; the incident behind each one is
in `plugin/CHANGELOG.md` and `docs/adr/`.

## What this is

abap2UI5 hosted in CAP. **There is no port here**: `plugin/` is hand-written
JavaScript that boots upstream's transpiled runtime (`@abap2ui5/node-runtime`),
keeps its drafts in a CDS entity and lets apps be plain JavaScript classes.
Everything the framework does, upstream's ABAP does
(`docs/adr/adr-008-host-not-port.md`). The agent endpoint and the translator
are packages of their own beside it, which the plugin does not depend on.
Count lines again before quoting a number.

## Layout, and what is generated

| path | hand-written? |
|---|---|
| `plugin/` | yes — `@cap2ui5/cds-plugin`. `lib/app/` is `defineApp`'s client: `before.js` (asked before `main( )`), `client.js` (the facade), `flush.js` (after `main( )`), over `types.js`, `interface.js`, `proxy.js`, `timeout.js` |
| `abap2js/` | yes — `@cap2ui5/abap2js`: the translator and the `cap2ui5` command, with `@abaplint/core` as its dependency |
| `agent/` | yes — `@cap2ui5/agent`: the MCP endpoint, `cap2ui5.AgentLog`, `purgeAgentLog( )`. The plugin loads it only where `cds.requires.cap2ui5.agent` is set |
| `agent/lib/vendor/` | **no — abap2UI5/mcp-server's files at the commit `source.json` records (`npm run agent-vendor`), never edited.** A fix goes upstream, then re-vendor. ADR-009 |
| `examples/bookshop/` | yes — the example to read. No tests run in it; `example.test.mjs` starts it |
| `test/project/` | yes — the CAP project **the suite runs in**; its `srv/apps/` are fixtures. `srv/catalog-service.cds` knows nothing about cap2UI5 on purpose (`coexistence.test.mjs`) |
| `runtime/package.json`, `runtime/README.md` | yes — the stand-in's manifest |
| `runtime/output/`, `setup/`, `downport/`, `srv/` | **no — upstream's, never edited, never committed.** `scripts/assemble-runtime.sh` fills them |
| `docs/adr/`, `docs/transpiler-roadmap.md` | the decision records, moved from the archived `cap2UI5/builder-abap2UI5-js`; historical paths in them refer to that repository |

## Rules

### The gate

- **Never change behaviour without a test in `test/project/test/`.** The suite
  is the gate; there is no other.
- `npm test` stays browserless; browser tests are `*.e2e.mjs`
  (`npm run test:browser`). **A client method that composes view XML needs a
  browser test too**: the wire tests feed the frontend's part by hand and can
  send what the real page never would. What the browser finds goes into the
  wire test as well.
- **A test about what the route answers serves the project in-process**
  (`serve()`, `cds.test`); **a test about the process boots a child**
  (`boot()`): a failing start, a restart, a production profile, the startup
  log.
- **The suite runs on PostgreSQL too** (`npm run test:postgres`, the
  `postgres` job). Tests reach the database through `cds.ql`, never SQL text.
  A test that only holds on SQLite goes on the exclusion list in
  `test/project/package.json`, with the reason.
- **The workspace cannot prove the PACKAGE.** `npm run consumer-test` packs
  every package as `npm publish` would and drives a roundtrip in a throwaway
  project. Run it after anything that touches `files`, `main`, `exports`,
  `index.cds` or how a package is located.
- `no-undef` stays an error; CAP's `SELECT` etc. come from `cds.ql`.

### The coupling to upstream and to CAP

- **The host layer is the runtime package's.** Booting, one request at a time,
  stateful sessions and gzip are `@abap2ui5/node-runtime`'s exports
  (`srv/host.d.ts`); what every host needs and is missing there is a change
  upstream. What stays here is what only CAP has: the user, the tenant, the
  database, the model.
- **Every `abap.*` or `z2ui5_*$*` touchpoint in `plugin/lib/`, `agent/lib/` or
  `abap2js/lib/` goes into `abi-gate.test.mjs`.** The transpiler's emission
  format is not a published contract; that test is where a bump must fail.
- **Everything assumed about `@sap/cds` beyond its documentation goes into
  `cap-abi.test.mjs`** - above all the shape of `cds.middlewares.before`,
  across all six auth kinds.
- **The wire the tests read is protocol 3**, through the helpers in
  `test/server.mjs` only.
- **Not everything upstream does works here - boot the runtime and check
  before documenting it.** Where upstream reaches for the ABAP system it finds
  nothing (the user exit is discovered via the class repository, which
  open-abap lacks; `defineExit` binds it instead).
- **A host-side implementation of a framework interface follows the shipped
  one**, method by method - not only the interface's declaration.
- **"Unsupported" says WHOSE limitation it is.** Try it before writing that
  something cannot be done.

### The client

- **The client IS `z2ui5_if_client`, by its own names.** Every method under
  its ABAP name, the preferred parameter positional, the rest by name; the
  constants and the parameter signatures are read from the runtime
  (`lib/app/interface.js`), never listed here. No JavaScript-only names, no
  renamed parameters, no defaults ABAP does not have. What JavaScript forces
  (a field bound by its NAME, a placeholder resolved after `main( )`) is
  documented as a difference. `nav.test.mjs` holds the names in both
  directions, so a method upstream adds or removes fails the suite until it
  is wired.
- **Read `z2ui5_if_client`'s ABAP Doc before wiring a method.**
  `check_on_init( )` is this instance's first roundtrip; `check_on_navigated( )`
  is also every return, and the one to render in.
- **A QUERY answers inside a synchronous `main( )`, so it is asked BEFORE
  `main( )`** (`lib/app/before.js`) or kept by the client; **a CALL is
  recorded and made after it** (`lib/app/flush.js`).
- **`z2ui5_cl_ui5_view_builder` renders nothing itself**: it replays the app's
  chain against the transpiled class after `main( )`. Its one piece of own
  JavaScript, `escape_literal( )`, is pinned to the ABAP method.
- **`abap2js` refuses rather than guesses.** Widening it takes the construct,
  a case in `abap2js.test.mjs`, and a run of the translated samples beside
  their transpiled originals: the gate is behaving as the ABAP does.

### Security and the roundtrip

- **An authorization check compares PRESENCE, never truthiness.**
  `r.owner && r.owner !== who()` made an ownerless draft everybody's; `??`
  does not catch `""`, and `who( )` refuses an empty user id.
- **Access is decided the way CAP decides `@requires`**, and answered by
  `cds.middlewares.errors()`, so the challenge and the error body are CAP's.
  The guard goes **in front of** the body parser; the route stays **behind**
  `cds.middlewares.before`, without which every draft is `anonymous`.
- **The agent endpoint acts as the CAP user who calls, never as anybody
  else**: a tool call runs the route's own roundtrip in process. Every
  behaviour of it has its test in `agent*.test.mjs`.
- **A roundtrip is never abandoned inside the framework** - per-request state
  lives in statics, one at a time per process. The only place a limit may cut
  is around an app's `main( )` (`lib/app/timeout.js`, `timeout.test.mjs`).
- **A switch that silently does nothing is worse than none.** A setting the
  plugin does not know, or one whose package is missing, fails the start.

- Commit messages say why. The history of this project is its evidence.

## Publishing

**The packages are `@cap2ui5/cds-plugin`, `@cap2ui5/abap2js` and
`@cap2ui5/agent`; the plugin's own names are `cap2ui5`** - `cds.requires.cap2ui5`,
`cds add cap2ui5`, the command, the `cap2ui5.*` entities, the logger. The
unscoped npm name `cap2ui5` is a deprecated placeholder; write the command as
`npx --no-install cap2ui5 abap2js`, never a bare `npx cap2ui5`.

Every change a user would notice gets a line under `Unreleased` in that
package's `CHANGELOG.md`, in the same pull request. **The packages are
versioned in lockstep** (`packages.test.mjs`): the release PR bumps all three
`package.json` files and moves the lines under the new version.

A tag `v<version>` publishes all three (`.github/workflows/release.yml`) by
trusted publishing - OIDC with provenance, no token - after lint, the suite
and `consumer-test` ran against the PUBLISHED runtime the plugin pins. npm
lets a package be pointed at a workflow only once it exists, so a package's
first version is published by hand (`npm publish --workspace <dir> --access
public`) and its Trusted Publisher set right after - the commands are in the
header of `release.yml`. Until then its publish step only warns. Never
publish against the runtime stand-in.

## Running

See README.md. `npm run lint && npm test` before every push; `cold-test`,
`bench`, `test:browser` and `consumer-test` when a package or the runtime
changed.
