# builder/ — the cap2UI5 build project

[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)
[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

This is the **build project** — a self-contained npm project (its own
[`package.json`](package.json) / `package-lock.json`) that is **not** deployed
with the app. It **generates** the two published artifacts — the
platform-neutral [core package](../core/) and the deployable
[CAP project](../cap2UI5/) — from two inputs: the hand-maintained source in
[`base/`](base/) and the upstream
[abap2UI5](https://github.com/abap2UI5/abap2UI5) sources (mirrored and
transpiled to JavaScript).

> [!IMPORTANT]
> **`core/` and `cap2UI5/` are build artifacts — do not hand-edit them.** Every
> build wipes and rewrites both. The hand-written source lives in
> [`base/core/`](base/core/) resp. [`base/cap/`](base/cap/); edit there and
> re-run the build. (Your own apps go in `base/cap/srv/app/` or an external
> `Z2UI5_APP_DIRS` folder — never in `cap2UI5/srv/app/`, which is regenerated.)

The repository holds **three separate npm projects**, each installed and run on
its own:

| Project | What it is | Run it |
|---|---|---|
| [`core/`](../core/) | the platform-neutral framework package `abap2UI5` (**generated**) | consumed via `file:../core` |
| [`cap2UI5/`](../cap2UI5/) | the finished, deployable CAP app (**generated**) | `cd cap2UI5 && npm install && npx cds watch` |
| [`builder/`](.) (here) | the build machinery + hand-written source | `cd builder && npm install && npm test` |

## Install & run

The builder is a normal npm project — install and run it from **inside**
`builder/`:

```bash
cd builder
npm install        # dev deps: @abaplint/core, jest
npm test           # run the jest suite

npm run build_cap  # assemble + publish → regenerate ../core + ../cap2UI5
```

> [!NOTE]
> The jest suite and the assemble load-gate use runtime modules from the
> `cap2UI5/` project (`@sap/cds`, `@cap-js/sqlite`, …), so that project must
> have its deps installed too (`cd cap2UI5 && npm install`).

## What the build does

One idea, repeated for three upstream streams, then assembled and published:
**mirror** an upstream folder → **transpile / prepare** it → **assemble** the
core package and the CAP app by overlaying the generated trees on the
hand-written `base/` → **publish** them 1:1 into `core/` and `cap2UI5/`.

```
             mirror              transpile / prepare          assemble              publish
upstream ──────────────▶ run/input/ ──────────────▶ run/output/ ──┐
 abap2UI5 src/           abap2UI5/src     abap2js    abap2UI5/     │  base/core + overlays
 samples branch          samples/src      abap2js    samples/      ├─▶ run/output/core ─────1:1──▶ core/
 app/webapp              app/webapp        patch      app/         │
                                                                   │  base/cap + webapp overlay
builder/base/core/  (hand-written framework: engine + ports + class ports) ──┘─▶ run/output/cap2UI5 ─1:1─▶ cap2UI5/
builder/base/cap/   (hand-written CAP app: skeleton + platform wiring + custom apps)
```

The key move: **`base/` wins on every conflict.** The generated trees are
overlaid *under* the hand-written source, so a hand-adapted class always beats
the raw transpile. The results in `run/output/{core,cap2UI5}` are exactly what
`publish` copies 1:1 into `core/` and `cap2UI5/` — the build never reads the
state of the published projects.

| Command | What it does |
|---|---|
| `npm test` | jest suite (backend units, sample apps, transpiler, platform adapters) — also needs `cap2UI5/` deps installed; the adapter smokes (`test/adapters.test.js`) additionally need `npm install` in `adapter-node/`, `adapter-express/` and `adapter-web/` and are skipped with a warning otherwise |
| `npm run transpile` | abap2js — transpile ABAP classes to JS (parser: [@abaplint/core](https://github.com/abaplint/abaplint)) |
| `npm run mirror_abap2ui5` / `mirror_app` / `mirror_samples` | snapshot upstream into one folder each under `run/input/` — rewritten fresh on every run |
| `npm run transpile_abap2ui5` / `transpile_samples` | transpile `run/input/*/src` → `run/output/` |
| `npm run prepare_app` | `run/input/app/webapp` → `run/output/app` (+ frontend patches) |
| `npm run assemble` | `base/` + the `run/output/` trees → `run/output/{core,cap2UI5}` (the two artifacts) |
| `npm run publish` | 1:1 copy `run/output/{core,cap2UI5}` → `core/` + `cap2UI5/` (the very last step) |
| `npm run build_cap` | `assemble` then `publish` |

## Folder layout

| Path | What it is |
|---|---|
| `package.json` / `package-lock.json` | the builder manifest — dev deps (`@abaplint/core`, `jest`) and the `npm run …` scripts. |
| [`base/`](base/) | **Hand-written SOURCE of the published projects** — `base/core/` (framework package) + `base/cap/` (CAP app), see below. |
| [`run/`](run/) | **Working area — transient generated files** (see below). |
| [`scripts/`](scripts/) | The Node scripts behind the npm commands (`abap2js.js`, `mirror-input.js`, `transpile-tree.js`, `prepare-app.js`, `assemble-cap.js`, `publish-cap.js`, `patch-frontend.js`, `smoke-apps.js`). |
| [`test/`](test/) | jest suite + fixtures/helpers. |
| `jest.config.js` | jest config (anchored at the repo root so it also loads `core/` and `cap2UI5/` modules). |

### `base/` — the hand-written source

`base/` is the **source of truth** for everything hand-written, split along the
same seam as the published artifacts:

- [`base/core/`](base/core/) — the framework package: `package.json` (name
  `abap2UI5`, the `exports` map), the engine + ports (`srv/z2ui5/engine.js`,
  `z2ui5_port.js`, `z2ui5_asset.js`) and the hand-ported `srv/z2ui5/` classes.
  Published as `core/` minus the generated fill-ins, samples and webapp.
- [`base/cap/`](base/cap/) — the CAP app: the skeleton (`server.js`,
  `z2ui5-service.*`, `db/`, `package.json`, `mta.yaml`, `srv/external/`), the
  platform wiring (draft store → CDS entity, app discovery → `srv/app/`), the
  bundled custom app `srv/app/z2ui5_cl_app_read_odata.js`, and the docs.
  Published as `cap2UI5/` minus the generated webapp overlay.

To change a framework class or the skeleton, edit it **here** and re-run
`npm run build_cap`.

`base/cap` + `base/core` together are a fully functional minimal CAP project —
the starting point of cap2UI5 with the same basic setup as abap2UI5: a mini
frontend (`app/index.html`), the http service (`POST /rest/root/z2ui5`) and the
draft persistence (`cap2ui5.z2ui5_t_01`). Run and test it standalone without
any generated overlays (`base/cap` links `base/core` via the same
`file:../core` relative path the published pair uses):

```bash
cd builder/base/cap
npm install
npx cds watch      # → http://localhost:4004/index.html
npm test           # jest: boots the server via cds.test(), asserts all three layers
```

See the [minimal base section](base/cap/README.md#the-minimal-base) in the
base README for details.

### `run/` — the pipeline workbench

`run/` is scratch space; nothing here is hand-edited — the next build overwrites
it:

- **`run/input/`** — snapshots mirrored 1:1 from upstream (`abap2UI5/`, `app/`,
  `samples/`); the upstream commit is recorded in `run/input/<dir>/UPSTREAM_COMMIT`.
- **`run/output/{abap2UI5,samples,app}`** — the transpiled / prepared trees.
- **`run/output/{core,cap2UI5}`** — the assembled artifacts (`base/core` resp.
  `base/cap` + overlays). Gitignored staging; `publish` copies them 1:1 into
  `core/` and `cap2UI5/`.

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

`assemble-cap.js` copies `base/core` and `base/cap` verbatim, then overlays the
generated trees:

- **backend** (`run/output/abap2UI5` → `core/srv/z2ui5`): **fill-in / add-only**
  — only classes `base/core` does not already have are added, so hand-ported
  adaptations always win. Added fill-ins are **load-gated**: each must actually
  `require()` (self-referencing `abap2UI5/*` via the assembled core's own
  `exports`, third-party via the CAP project's `node_modules`); ones that fail
  are dropped and reported. This is what keeps e.g. `z2ui5_cl_app_preload` —
  whose deps resolve to a path that does not exist — out of the published
  package.
- **samples** (`run/output/samples` → `core/srv/app/samples`): flattened (every
  class lands directly under `samples/`, keyed by bare class name) and
  overwritten; the hand-written `samples/README.md` from `base/core` stays.
- **frontend** (`run/output/app` → `core/app/z2ui5/webapp` **and**
  `cap2UI5/app/z2ui5/webapp`): replaced 1:1 in both — the core copy feeds the
  engine's asset port and the adapters, the CAP copy is served by CDS statics
  and zipped by the mta html5 module. Same build output, so they cannot drift.

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

Each pipeline's final **… to CAP** step runs `npm run build_cap` (assemble +
publish) — it regenerates the *whole* `core/` + `cap2UI5/` from `base/` plus
all three `run/output/` trees, so only the diff caused by the freshly refreshed
stream lands in the commit. `trigger_update` (manual) runs all three pipelines
back-to-back — update_samples → update_backend → update_frontend — for a
one-click full refresh.

| Pipeline (nightly) | Steps → npm scripts | What it refreshes |
|---|---|---|
| **update_samples** (03:00) | samples mirror → samples transpile → build_cap<br>(`mirror_samples`, `transpile_samples`, `build_cap`) | `core/srv/app/samples` from the abap2UI5/samples **whole cloud branch** |
| **update_backend** (04:00) | abap2UI5 mirror → abap2UI5 transpile → build_cap<br>(`mirror_abap2ui5`, `transpile_abap2ui5`, `build_cap`) | `core/srv/z2ui5` from the abap2UI5 framework `src/` |
| **update_frontend** (05:00) | app mirror → app prepare → build_cap<br>(`mirror_app`, `prepare_app`, `build_cap`) | `core/app/z2ui5/webapp` + `cap2UI5/app/z2ui5/webapp` from the abap2UI5 `app/webapp` |

Each `… to CAP` step runs jest and gates its commit — only a green suite is
pushed. `MIRROR_SOURCE=/path` lets the mirror steps use a local checkout
instead of cloning.

### Web deploy

Downstream web deploy (`trigger_web`) pushes the sha of the last commit
touching `cap2UI5/` to
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
