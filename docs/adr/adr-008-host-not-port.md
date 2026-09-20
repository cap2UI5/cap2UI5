# ADR-008 — cap2UI5 becomes a host for abap2UI5's own runtime, not a port of it

**Status:** proposed — the code decision is made and proven under
`docs/prototypes/open-abap-cap/`; the repository decisions (below) need an
org owner, and one dependency needs upstream.
**Date:** 2026-09-19
**Supersedes:** ADR-007 (its topology is moot once there is no generated app),
the ADR-006 worklist items 1–3 (the port's wire drifts are not fixed but made
irrelevant), ADR-003's parked rename.

## Decision

cap2UI5 stops being a hand-written JavaScript port of abap2UI5 (12,588 lines
in `src/srv/z2ui5`, 4,286 in `scripts/abap2js.js`, 17 known wire drifts, a
hanging `build_core`) and becomes a **CAP plugin that hosts upstream's own
runtime**: the real ABAP, downported and transpiled by `@abaplint/transpiler`
over `open-abap-core`, which upstream already builds and serves itself.

Three packages, with the boundaries the product has:

| package | what | lines we write |
|---|---|---|
| `@abap2ui5/runtime` | `node/output` + `node/setup/setup.mjs` + `app/webapp`, published **by upstream** from its release | 0 |
| `cap2ui5` | `cds-plugin.js`, `index.cds` (the Drafts entity), `lib/define-app`, `lib/draft-store`, `lib/runtime` | **481** |
| the project | any CAP project: `npm i cap2ui5`, apps in `srv/apps/` | the apps |

## Evidence (all re-runnable: `.github/workflows/prototype.yml`)

- `npm i cap2ui5` is the installation: route, UI5 shell and `cap2ui5.Drafts`
  arrive through `cds-plugin.js`; the project's `server.js` is untouched.
- Drafts are a CDS entity, owner-scoped via `cds.context.user`, proven end to
  end (`auth.test.mjs`): alice's draft answers to alice and to nobody else.
- An app is a plain JavaScript class — scalars, structures, `t.table( )` —
  reading the project's own entities with `cds.ql` (`books.test.mjs`).
- State survives SIGKILL and a fresh process (`cold-test.mjs`).
- Three users interleaved in one process each get their own answer
  (`concurrency.test.mjs`).
- **It renders**: real Chromium, the framework's own GET page, UI5 booted, the
  hello app's MessageBox and the Books app's table on screen
  (`browser.e2e.mjs`).
- **14 ms per roundtrip** sequential over HTTP on SQLite (`bench.mjs`, 200
  roundtrips); the runtime's private SQLite sees **no SQL** once the store is
  installed, only transaction ends.
- The plugin's coupling to the transpiler's emission format is named
  touchpoint by touchpoint and gated (`abi-gate.test.mjs`).

## What is given up

- **The port's independence from the transpiler.** The port could, in
  principle, diverge from open-abap. The host cannot, and the ABI gate exists
  because that coupling is undocumented. This is the design's one hazard.
- **Runtime size.** 16 MB unpacked, 1,300 files, in `node_modules`.
- Nothing else: it renders (`browser.e2e.mjs`, real Chromium, the page the
  framework serves on GET), so the last "unproven" of the earlier rounds is
  gone.

## Repositories

Six become two. Archive, do not delete — the published-artefact history is
the record of what users were served.

| repo | becomes |
|---|---|
| `cap2UI5/cap2UI5` | **the plugin's source** (`cds-plugin.js`, `lib/`, `index.cds`, `examples/`, the docs build). Its history as the generated app is frozen as a tag first. |
| `cap2UI5/docs` | unchanged (or a folder in the plugin repo — taste, not architecture) |
| `cap2UI5/builder-abap2UI5-js` | archived. The port and `abap2js.js` are deleted; the conformance suite, the ADRs and the prototype move to the plugin repo first. |
| `cap2UI5/builder-cap2UI5` | archived — nothing to assemble |
| `cap2UI5/builder-cap2UI5-web` | archived — the site is a `deploy-pages` job in the plugin repo |
| `cap2UI5/web-cap2UI5-build` | archived — Pages deploys from the workflow, no key |

Nothing new is created. `@abap2ui5/runtime` is upstream's to publish
(`release.yaml`, job `runtime`, on the seams branch); a `cap2UI5/runtime`
repo that clones-and-publishes would recreate the builder pattern this ADR
removes, and is the fallback only if upstream declines.

## Cutover

1. Upstream merges the four seams and the `runtime` release job; the org
   stores an `NPM_TOKEN` for `@abap2ui5`; the next release publishes
   `@abap2ui5/runtime@X.Y.Z`. *(needs upstream, needs org)*
2. `prototype.yml` switches its ref to `main`; `runtime/` in the prototype
   becomes a dependency on the published package and the stand-in is deleted.
3. The prototype moves out of `docs/prototypes/` into `cap2UI5/cap2UI5` as
   `plugin/` + `examples/`; the old app repo is tagged and its workflows
   removed. *(needs org: default branch, Pages source)*
4. The four builder repos are archived. *(needs org)*
5. `builder-abap2UI5-js`'s `src/`, `core/`, `scripts/abap2js.js` and the
   generated trees are deleted in one commit; the repo is archived. *(needs org)*

Steps 2–3 are pull requests; nothing in 1, 4, 5 can be done from one.
