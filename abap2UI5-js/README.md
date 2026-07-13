# abap2UI5-js/ — the framework project

[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)
[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

This is the **framework build project** — a self-contained npm project (its
own [`package.json`](package.json) / `package-lock.json`) that is **not**
deployed with the app. It **generates** the platform-neutral
[core package](core/) — the npm package `abap2UI5` — from two inputs: the
hand-maintained source in [`src/`](src/) and the upstream
[abap2UI5](https://github.com/abap2UI5/abap2UI5) sources (mirrored and
transpiled to JavaScript). It also hosts the four [platform
adapters](adapter/) that consume the core, and the jest suite that gates it
all. The full CAP app is built downstream by
[`cap-builder/`](../cap-builder/).

> [!IMPORTANT]
> **`core/` is a build artifact — do not hand-edit it.** Every build wipes and
> rewrites it. The hand-written source lives in [`src/`](src/); edit there
> and re-run the build.

The repository is organized as three projects:

| Project | What it is | Run it |
|---|---|---|
| [`abap2UI5-js/`](.) (here) | transpiler + sync scripts → generates [`core/`](core/); hosts the [adapters](adapters/) | `npm install && npm test` |
| [`cap-builder/`](../cap-builder/) | generates the full CAP app from its `src/` + the core webapp | `npm run build_cap` |
| [`cap2UI5/`](../cap2UI5/) | the finished, deployable CAP app (**generated**) | `cd cap2UI5 && npm install && npx cds watch` |

## Install & run

The builder is a normal npm project — install and run it from **inside**
`builder/`:

```bash
cd abap2UI5-js
npm install         # dev deps: @abaplint/core, jest
npm test            # run the jest suite

npm run build_core  # assemble + publish → regenerate core/
```

> [!NOTE]
> The assemble load-gate resolves third-party deps through the `cap2UI5/`
> project's `node_modules` (`@sap/cds`, …), so that project should have its
> deps installed too (`cd ../cap2UI5 && npm install`).

## What the build does

One idea, repeated for three upstream streams, then assembled and published:
**mirror** an upstream folder → **transpile / prepare** it → **assemble** the
core package by overlaying the generated trees on the hand-written `src/` →
**publish** it 1:1 into `core/`.

```
             mirror              transpile / prepare        assemble               publish
upstream ──────────────▶ run/input/ ──────────────▶ run/output/ ──┐
 abap2UI5 src/           abap2UI5/src     abap2js    abap2UI5/     │  base + overlays
 samples branch          samples/src      abap2js    samples/      ├─▶ run/output/core ──1:1──▶ core/
 app/webapp              app/webapp        patch      app/         │
                                                                   │
abap2UI5-js/src/  (hand-written framework: engine + ports + class ports) ──┘
```

The key move: **`src/` wins on every conflict.** The generated trees are
overlaid *under* the hand-written source, so a hand-adapted class always beats
the raw transpile. The result in `run/output/core` is exactly what `publish`
copies 1:1 into `core/` — the build never reads the state of the published
package. Downstream, [`cap-builder/`](../cap-builder/) assembles the full CAP
app from its own `src/` plus the webapp shipped in the published core.

| Command | What it does |
|---|---|
| `npm test` | jest suite (backend units, sample apps, transpiler, platform adapters) — also needs `cap2UI5/` deps installed; the adapter smokes (`test/adapters.test.js`) additionally need `npm install` in `adapter-node/`, `adapter-express/` and `adapter-web/` and are skipped with a warning otherwise |
| `npm run transpile` | abap2js — transpile ABAP classes to JS (parser: [@abaplint/core](https://github.com/abaplint/abaplint)) |
| `npm run mirror_abap2ui5` / `mirror_app` / `mirror_samples` | snapshot upstream into one folder each under `run/input/` — rewritten fresh on every run |
| `npm run transpile_abap2ui5` / `transpile_samples` | transpile `run/input/*/src` → `run/output/` |
| `npm run prepare_app` | `run/input/app/webapp` → `run/output/app` (+ frontend patches) |
| `npm run assemble_core` | `src/` + the `run/output/` trees → `run/output/core` (the complete package) |
| `npm run publish_core` | 1:1 copy `run/output/core` → `core/` (the very last step) |
| `npm run build_core` | `assemble_core` then `publish_core` |

## Folder layout

| Path | What it is |
|---|---|
| `package.json` / `package-lock.json` | the builder manifest — dev deps (`@abaplint/core`, `jest`) and the `npm run …` scripts. |
| [`src/`](src/) | **Hand-written SOURCE of the core package** (see below). |
| [`core/`](core/) | **The published package `abap2UI5`** — generated, do not hand-edit. |
| [`adapters/`](adapters/) | The four platform adapters (cap, node, express, web) — hand-written consumers of `core/`. |
| [`run/`](run/) | **Working area — transient generated files** (see below). |
| [`scripts/`](scripts/) | The Node scripts behind the npm commands (`abap2js.js`, `mirror-input.js`, `transpile-tree.js`, `prepare-app.js`, `assemble-cap.js`, `publish-cap.js`, `patch-frontend.js`, `smoke-apps.js`). |
| [`test/`](test/) | jest suite + fixtures/helpers. |
| `jest.config.js` | jest config for this project's suite (core, transpiler, adapters). |

### `src/` — the hand-written source

`src/` is the **source of truth** for everything hand-written in the
framework package: `package.json` (name `abap2UI5`, the `exports` map), the
engine + ports (`srv/z2ui5/engine.js`, `z2ui5_port.js`, `z2ui5_asset.js`) and
the hand-ported `srv/z2ui5/` classes. Published as `core/` minus the generated
fill-ins, samples and webapp.

To change a framework class, edit it **here** and re-run `npm run build_core`.

The CAP app's hand-written source lives in
[`cap-builder/src/`](../cap-builder/src/) — together with this source it forms
a fully functional minimal CAP project runnable without any generated
overlays; see [cap-builder/README.md](../cap-builder/README.md).

### `run/` — the pipeline workbench

`run/` is scratch space; nothing here is hand-edited — the next build overwrites
it:

- **`run/input/`** — snapshots mirrored 1:1 from upstream (`abap2UI5/`, `app/`,
  `samples/`); the upstream commit is recorded in `run/input/<dir>/UPSTREAM_COMMIT`.
- **`run/output/{abap2UI5,samples,app}`** — the transpiled / prepared trees.
- **`run/output/core`** — the assembled package (`src` + overlays).
  Gitignored staging; `publish_core` copies it 1:1 into `core/`.

## The transpiler (abap2js)

`scripts/abap2js.js` transpiles ABAP classes to JavaScript using the
[@abaplint/core](https://github.com/abaplint/abaplint) parser. Run it directly
on files or trees:

```bash
npm run transpile -- path/to/z2ui5_cl_my_app.clas.abap --stdout
npm run transpile -- path/to/abap2UI5/src -o out       # recursive, mirrors 02/01/... 1:1
npm run transpile -- --preferred-map path/to/z2ui5_cl_xml_view.clas.abap
```

Statements outside the supported subset are emitted as
`// TODO(abap2js): <original>` comments and reported on stderr — nothing is
dropped silently. Classes with `TODO(abap2js)` markers or `parseError` entries
are listed in `run/output/*/transpile-report.json` and need manual follow-up.

The sample-app smoke gate diffs actual startup results against
`test/apps-smoke.known-failures.json`; regenerate the list with
`node scripts/smoke-apps.js --json`.

## Assemble policies

`assemble-core.js` copies `src/` verbatim, then overlays the generated trees:

- **backend** (`run/output/abap2UI5` → `core/srv/z2ui5`): **fill-in / add-only**
  — only classes `src/` does not already have are added, so hand-ported
  adaptations always win. Added fill-ins are **load-gated**: each must actually
  `require()` (self-referencing `abap2UI5/*` via the assembled core's own
  `exports`, third-party via the CAP project's `node_modules`); ones that fail
  are dropped and reported. This is what keeps e.g. `z2ui5_cl_app_preload` —
  whose deps resolve to a path that does not exist — out of the published
  package.
- **samples** (`run/output/samples` → `core/srv/app/samples`): flattened (every
  class lands directly under `samples/`, keyed by bare class name) and
  overwritten; the hand-written `samples/README.md` from `src/` stays.
- **frontend** (`run/output/app` → `core/app/z2ui5/webapp`): replaced 1:1. The
  CAP app's webapp copy is made downstream by `cap-builder` from this published
  core, so the two cannot drift.

Transpiled `.js` that does not parse is skipped and reported; `publish` then
copies the result and the jest suite is the behavioral gate.

## Sync pipelines

GitHub Actions under `.github/workflows/` are organised into **three
independent nightly pipelines**, one per upstream stream. Each pipeline is an
orchestrator that chains reusable step workflows (invoked via `workflow_call`,
so their runs appear as jobs **inside** the orchestrator run); every step is
also runnable standalone via `workflow_dispatch`, and the same steps run
locally via the npm scripts. Each pipeline runs on its own nightly `schedule`
and carries its own `concurrency` group, so the three never block one another.
Every step commits with `GITHUB_TOKEN` and does `git pull --rebase` before
pushing, so concurrent commits to `main` are safe.

Each pipeline's final **… to CAP** step runs `npm run build_core` here and
`npm run build_cap` in `cap-builder/` — it regenerates the *whole*
`abap2UI5-js/core/` + `cap2UI5/` from the sources plus all three `run/output/`
trees, so only the diff caused by the freshly refreshed stream lands in the
commit. `trigger_update` (manual) runs all three pipelines
back-to-back — update_samples → update_backend → update_frontend — for a
one-click full refresh.

| Pipeline (nightly) | Steps → npm scripts | What it refreshes |
|---|---|---|
| **update_samples** (03:00) | samples mirror → samples transpile → build_cap<br>(`mirror_samples`, `transpile_samples`, `build_cap`) | `abap2UI5-js/core/srv/app/samples` from the abap2UI5/samples **whole cloud branch** |
| **update_backend** (04:00) | abap2UI5 mirror → abap2UI5 transpile → build_cap<br>(`mirror_abap2ui5`, `transpile_abap2ui5`, `build_cap`) | `abap2UI5-js/core/srv/z2ui5` from the abap2UI5 framework `src/` |
| **update_frontend** (05:00) | app mirror → app prepare → build_cap<br>(`mirror_app`, `prepare_app`, `build_cap`) | `abap2UI5-js/core/app/z2ui5/webapp` + `cap2UI5/app/z2ui5/webapp` from the abap2UI5 `app/webapp` |

Each `… to CAP` step runs jest and gates its commit — only a green suite is
pushed. `MIRROR_SOURCE=/path` lets the mirror steps use a local checkout
instead of cloning.

### Web deploy

Downstream web deploy (`trigger_web`) pushes the sha of the last commit
touching `abap2UI5-js/core/` or `cap2UI5/` to
[web-cap2UI5](https://github.com/cap2UI5/web-cap2UI5) (`UPSTREAM_HEAD`) via a
deploy key registered there with write access (private half: secret
`ACTION_KEY_WEB` here) — that push starts web-cap2UI5's **build web**
workflow, which rebuilds and redeploys the browser site. It is **manual only**
(`workflow_dispatch`): run it whenever a rebuild should be kicked off — e.g.
after a nightly sync (or a `trigger_update` run) updated `cap2UI5/`. If
`cap2UI5/` is unchanged since the last trigger, nothing is pushed and
web-cap2UI5 does not rebuild.

The static browser build (whole stack client-side, deployed to GitHub Pages)
lives in [web-cap2UI5](https://github.com/cap2UI5/web-cap2UI5) — it mirrors this
repo weekly and only relies on the two framework hooks
`z2ui5_cl_util.register_app_class()` and `z2ui5_cl_core_srv_draft.set_store()`.

## External wiring

Three paths are wired to external repositories: `builder/run/input/abap2UI5/`
(the abap2UI5 repo pushes snapshots into it via deploy key),
`builder/run/input/samples/` (refreshed by the pipeline from abap2UI5/samples),
and `cap2UI5/` (mirrored by web-cap2UI5). If these paths move, the external
deploy keys and pipelines that target them must be updated to match.
