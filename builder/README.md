# builder/ — the cap2UI5 build project

[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)
[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

This is the **build project** — a self-contained npm project (its own
[`package.json`](package.json) / `package-lock.json`) that is **not** deployed
with the app. It **generates** the deployable [CAP project](../cap2UI5/) from
two inputs: the hand-maintained source in [`base/`](base/) and the upstream
[abap2UI5](https://github.com/abap2UI5/abap2UI5) sources (mirrored and
transpiled to JavaScript).

> [!IMPORTANT]
> **`cap2UI5/` is a build artifact — do not hand-edit it.** Every build wipes
> and rewrites it. The hand-written source lives in [`base/`](base/); edit there
> and re-run the build. (Your own apps go in `base/srv/app/` or an external
> `Z2UI5_APP_DIRS` folder — never in `cap2UI5/srv/app/`, which is regenerated.)

The repository holds **two separate projects**, each installed and run on its
own:

| Project | What it is | Run it |
|---|---|---|
| [`cap2UI5/`](../cap2UI5/) | the finished, deployable CAP app (**generated**) | `cd cap2UI5 && npm install && npx cds watch` |
| [`builder/`](.) (here) | the build machinery + hand-written source | `cd builder && npm install && npm test` |

## Install & run

The builder is a normal npm project — install and run it from **inside**
`builder/`:

```bash
cd builder
npm install        # dev deps: @abaplint/core, jest
npm test           # run the jest suite

npm run build_cap  # assemble + publish → regenerate ../cap2UI5
```

> [!NOTE]
> The jest suite and the assemble load-gate use runtime modules from the
> `cap2UI5/` project (`@sap/cds`, `@cap-js/sqlite`, …), so that project must
> have its deps installed too (`cd cap2UI5 && npm install`).

## What the build does

One idea, repeated for three upstream streams, then assembled and published:
**mirror** an upstream folder → **transpile / prepare** it → **assemble** the
complete app by overlaying the generated trees on the hand-written `base/` →
**publish** it 1:1 into `cap2UI5/`.

```
             mirror              transpile / prepare        assemble               publish
upstream ──────────────▶ run/input/ ──────────────▶ run/output/ ──┐
 abap2UI5 src/           abap2UI5/src     abap2js    abap2UI5/     │  base + overlays
 samples branch          samples/src      abap2js    samples/      ├─▶ run/output/cap2UI5 ──1:1──▶ cap2UI5/
 app/webapp              app/webapp        patch      app/         │
                                                                   │
builder/base/  (hand-written source: skeleton + srv/z2ui5 ports + custom apps) ──┘
```

The key move: **`base/` wins on every conflict.** The generated trees are
overlaid *under* the hand-written source, so a hand-adapted class always beats
the raw transpile. The result in `run/output/cap2UI5` is exactly what
`publish` copies 1:1 into `cap2UI5/` — the build never reads the state of the
published project.

| Command | What it does |
|---|---|
| `npm test` | jest suite (backend units, sample apps, transpiler) — also needs `cap2UI5/` deps installed |
| `npm run transpile` | abap2js — transpile ABAP classes to JS (parser: [@abaplint/core](https://github.com/abaplint/abaplint)) |
| `npm run mirror_abap2ui5` / `mirror_app` / `mirror_samples` | snapshot upstream into one folder each under `run/input/` — rewritten fresh on every run |
| `npm run transpile_abap2ui5` / `transpile_samples` | transpile `run/input/*/src` → `run/output/` |
| `npm run prepare_app` | `run/input/app/webapp` → `run/output/app` (+ frontend patches) |
| `npm run assemble` | `base/` + the `run/output/` trees → `run/output/cap2UI5` (the complete app) |
| `npm run publish` | 1:1 copy `run/output/cap2UI5` → `cap2UI5/` (the very last step) |
| `npm run build_cap` | `assemble` then `publish` |

## Folder layout

| Path | What it is |
|---|---|
| `package.json` / `package-lock.json` | the builder manifest — dev deps (`@abaplint/core`, `jest`) and the `npm run …` scripts. |
| [`base/`](base/) | **Hand-written SOURCE of the CAP project** (see below). |
| [`run/`](run/) | **Working area — transient generated files** (see below). |
| [`scripts/`](scripts/) | The Node scripts behind the npm commands (`abap2js.js`, `mirror-input.js`, `transpile-tree.js`, `prepare-app.js`, `assemble-cap.js`, `publish-cap.js`, `patch-frontend.js`, `smoke-apps.js`). |
| [`test/`](test/) | jest suite + fixtures/helpers. |
| `jest.config.js` | jest config (anchored at the repo root so it also loads `cap2UI5/` modules). |

### `base/` — the hand-written source

`base/` is the **source of truth** for everything hand-written in the CAP
project: the skeleton (`server.js`, `z2ui5-service.*`, `db/`, `package.json`,
`mta.yaml`, `srv/external/`), the hand-ported `srv/z2ui5/` framework classes,
the bundled custom app `srv/app/z2ui5_cl_app_read_odata.js`, and the docs. It
holds everything that is **not** produced by generation — i.e. `cap2UI5/` minus:

- `app/z2ui5/webapp/` — generated by the frontend stream
- `srv/app/samples/*.js` — generated by the samples stream
- the `srv/z2ui5/` classes that are byte-identical to the raw transpile (pure
  fill-ins, added by the backend stream)

To change a framework class or the skeleton, edit it **here** and re-run
`npm run build_cap`.

`base/` is itself a fully functional minimal CAP project — the starting
point of cap2UI5 with the same basic setup as abap2UI5: a mini frontend
(`app/index.html`), the http service (`POST /rest/root/z2ui5`) and the
draft persistence (`cap2ui5.z2ui5_t_01`). Run and test it standalone
without any generated overlays:

```bash
cd builder/base
npm install
npx cds watch      # → http://localhost:4004/index.html
npm test           # jest: boots the server via cds.test(), asserts all three layers
```

See the [minimal base section](base/README.md#the-minimal-base) in the
base README for details.

### `run/` — the pipeline workbench

`run/` is scratch space; nothing here is hand-edited — the next build overwrites
it:

- **`run/input/`** — snapshots mirrored 1:1 from upstream (`abap2UI5/`, `app/`,
  `samples/`); the upstream commit is recorded in `run/input/<dir>/UPSTREAM_COMMIT`.
- **`run/output/{abap2UI5,samples,app}`** — the transpiled / prepared trees.
- **`run/output/cap2UI5`** — the assembled complete app (`base` + overlays).
  Gitignored staging; `publish` copies it 1:1 into `cap2UI5/`.

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

`assemble-cap.js` copies `base/` verbatim, then overlays the three generated
trees:

- **backend** (`run/output/abap2UI5` → `srv/z2ui5`): **fill-in / add-only** —
  only classes `base/` does not already have are added, so hand-ported
  adaptations always win. Added fill-ins are **load-gated**: each must actually
  `require()` in the CAP runtime (self-referencing `abap2UI5/*` via the
  assembled project's own `exports`, third-party via the CAP project's
  `node_modules`); ones that fail are dropped and reported. This is what keeps
  e.g. `z2ui5_cl_app_preload` — whose deps resolve to a path that does not
  exist — out of the published project.
- **samples** (`run/output/samples` → `srv/app/samples`): flattened (every class
  lands directly under `samples/`, keyed by bare class name) and overwritten;
  the hand-written `samples/README.md` from `base/` stays.
- **frontend** (`run/output/app` → `app/z2ui5/webapp`): replaced 1:1.

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
publish) — it regenerates the *whole* `cap2UI5/` from `base/` plus all three
`run/output/` trees, so only the diff caused by the freshly refreshed stream
lands in the commit. `trigger_update` (manual) runs all three pipelines
back-to-back — update_samples → update_backend → update_frontend — for a
one-click full refresh.

| Pipeline (nightly) | Steps → npm scripts | What it refreshes |
|---|---|---|
| **update_samples** (03:00) | samples mirror → samples transpile → build_cap<br>(`mirror_samples`, `transpile_samples`, `build_cap`) | `cap2UI5/srv/app/samples` from the abap2UI5/samples **whole cloud branch** |
| **update_backend** (04:00) | abap2UI5 mirror → abap2UI5 transpile → build_cap<br>(`mirror_abap2ui5`, `transpile_abap2ui5`, `build_cap`) | `cap2UI5/srv/z2ui5` from the abap2UI5 framework `src/` |
| **update_frontend** (05:00) | app mirror → app prepare → build_cap<br>(`mirror_app`, `prepare_app`, `build_cap`) | `cap2UI5/app/z2ui5/webapp` from the abap2UI5 `app/webapp` |

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
