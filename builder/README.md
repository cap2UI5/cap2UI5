# builder/ — the cap2UI5 build project

[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)
[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

This is the **build project** — a self-contained npm project (its own
[`package.json`](package.json) / `package-lock.json`) that is **not** deployed
with the app. It generates the deployable [CAP project](../cap2UI5/) by
mirroring the upstream [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources,
transpiling the ABAP classes to JavaScript, and copying the result into
`cap2UI5/`.

> [!IMPORTANT]
> **Nothing in `cap2UI5/` is hand-written.** The entire codebase — backend
> framework, frontend, samples — is produced by this builder (AI + the sync
> pipeline below). Review and test before relying on it.

The repository holds **two separate projects**, each installed and run on its
own:

| Project | What it is | Run it |
|---|---|---|
| [`cap2UI5/`](../cap2UI5/) | the finished, deployable CAP app | `cd cap2UI5 && npm install && npx cds watch` |
| [`builder/`](.) (here) | the build machinery (transpiler + sync + tests) | `cd builder && npm install && npm test` |

## Install & run

The builder is a normal npm project — install and run it from **inside**
`builder/`:

```bash
cd builder
npm install        # dev deps: @abaplint/core, jest
npm test           # run the jest suite
```

> [!NOTE]
> The jest suite also loads runtime modules from the `cap2UI5/` project
> (`@sap/cds`, `@cap-js/sqlite`, …), so that project must have its deps
> installed too (`cd cap2UI5 && npm install`) before `npm test` passes.

## What the build does

The whole thing is one idea repeated for three streams: **mirror** an upstream
folder → **transpile / prepare** it → **copy** it into the CAP project, with
the jest suite gating the final copy. Each stream owns one folder under
`run/input/` and one under `run/output/`, and writes into one folder of
`cap2UI5/`:

```
                 mirror                 transpile / prepare            copy (jest-gated)
upstream  ─────────────────▶  run/input/  ─────────────────▶  run/output/  ─────────────────▶  cap2UI5/
abap2UI5 src/                 abap2UI5/src        abap2js      abap2UI5/            fill-in      srv/z2ui5/
abap2UI5 samples branch       samples/src         abap2js      samples/             overwrite    srv/app/samples/
abap2UI5 app/webapp           app/webapp          patch        app/                 replace 1:1  app/z2ui5/webapp/
```

All the `npm run …` commands below are the individual steps; the GitHub Actions
[sync pipelines](#sync-pipelines) just chain them on a schedule.

| Command | What it does |
|---|---|
| `npm test` | jest suite (backend units, sample apps, transpiler) — also needs `cap2UI5/` deps installed |
| `npm run transpile` | abap2js — transpile ABAP classes to JS (parser: [@abaplint/core](https://github.com/abaplint/abaplint)) |
| `npm run mirror_abap2ui5` / `mirror_app` / `mirror_samples` | snapshot upstream into one folder each under `run/input/` — `abap2UI5/` (backend `src/`), `app/` (frontend `webapp`), `samples/` (whole cloud branch); each folder is rewritten fresh on every run |
| `npm run transpile_abap2ui5` / `transpile_samples` | transpile `run/input/*/src` → `run/output/` |
| `npm run prepare_app` | `run/input/app/webapp` → `run/output/app` (+ patches) |
| `npm run copy_abap2ui5` / `copy_samples` / `copy_app` | copy one `run/output/` tree → cap2UI5 project (fill-in / overwrite / replace); `copy_into_cap` (no arg) does all three |
| `npm run snapshot_base` | refresh [`base/`](base/) — a copy of the hand-maintained cap2UI5 base project with the generated content stripped |

## Folder layout

| Path | What it is |
|---|---|
| `package.json` / `package-lock.json` | the builder manifest — dev deps (`@abaplint/core`, `jest`) and the `npm run …` scripts. |
| [`run/`](run/) | **Working area — transient generated files** (see below). |
| [`base/`](base/) | **The base skeleton** — the hand-maintained foundation the pipeline fills into (see below). |
| [`scripts/`](scripts/) | The Node scripts behind the npm commands (`abap2js.js`, `mirror-input.js`, `transpile-tree.js`, `prepare-app.js`, `copy-into-cap.js`, `snapshot-base.js`, `patch-frontend.js`, `smoke-apps.js`). |
| [`test/`](test/) | jest suite + fixtures/helpers. |
| `jest.config.js` | jest config (anchored at the repo root so it also loads `cap2UI5/` modules). |

### `run/` — the pipeline workbench

`run/` is scratch space. Nothing here is meant to be hand-edited — the next
pipeline run overwrites it:

- **`run/input/`** — snapshots mirrored 1:1 from upstream: `abap2UI5/` (the
  framework `src/`), `app/` (the frontend `webapp`) and `samples/` (the whole
  cloud branch). Each folder is wiped and re-mirrored on every run; the upstream
  commit is recorded in `run/input/<dir>/UPSTREAM_COMMIT`.
- **`run/output/`** — the transpiled / prepared result (ABAP → JS, patched
  frontend). This is exactly what gets copied into `cap2UI5/`.

### `base/` — the base skeleton

`base/` shows the hand-maintained cap2UI5 **base project** — the skeleton the
sync pipeline fills the generated files into, so the foundation everything is
built on is visible in one place. The generated content is left out:

- `app/z2ui5/webapp/` — omitted (fully generated by the frontend stream)
- `srv/app/samples/` — omitted (fully generated by the samples stream)
- `srv/z2ui5/` — **emptied** to a [placeholder](base/srv/z2ui5/README.md) (the
  framework classes are generated by the backend stream)

It is a **reference snapshot, not a runnable project** — because the framework
classes under `srv/z2ui5/` are stripped, `cds watch` would fail there. Refresh
it with `npm run snapshot_base`; see [Base project snapshot](#base-project-snapshot).

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

## Base project snapshot

`scripts/snapshot-base.js` takes `git ls-files cap2UI5` (so build artifacts and
`node_modules` are excluded) and leaves out the generated content:
`app/z2ui5/webapp/` and `srv/app/samples/` (fully generated) plus the whole
`srv/z2ui5/` tree (the framework classes transpiled from ABAP by the backend
stream). `srv/z2ui5/` is emptied down to a placeholder README, so the resulting
skeleton is reference-only and not runnable on its own. `base/` is wiped and
rewritten on every run.

## Frontend

The UI5 frontend in `cap2UI5/app/z2ui5/webapp` is a 1:1 mirror of the
`app/webapp` folder from abap2UI5, served by CAP at `/z2ui5/webapp`.

Only two values are cap2UI5-specific and get patched into `run/output/app` by
`scripts/patch-frontend.js` (no stored copies): the CDN bootstrap URL in
`index.html` and the `/rest/root/z2ui5` data source in `manifest.json`. Refresh
the whole frontend with:

```bash
npm run mirror_app && npm run prepare_app && npm run copy_into_cap
```

## Sync pipelines

GitHub Actions under `.github/workflows/` are organised into **three
independent nightly pipelines**, one per deployable stream. Each pipeline is
an orchestrator that chains reusable step workflows (invoked via
`workflow_call`, so their runs appear as jobs **inside** the orchestrator
run); every step is also runnable standalone via `workflow_dispatch`, and
the same steps run locally via the npm scripts. Each pipeline runs on its
own nightly `schedule` and carries its own `concurrency` group, so the three
never block one another. Every step commits with `GITHUB_TOKEN` and does
`git pull --rebase` before pushing, so concurrent commits to `main` are safe.

`trigger_update` (manual, `workflow_dispatch`) runs all three pipelines
back-to-back in order — update_samples → update_backend → update_frontend —
for a one-click full refresh; each pipeline also stays available on its own
nightly schedule.

| Pipeline (nightly) | Steps → npm scripts | What it refreshes |
|---|---|---|
| **update_samples** (03:00) | samples mirror → samples transpile → samples to CAP<br>(`mirror_samples`, `transpile_samples`, `copy_samples`) | `cap2UI5/srv/app/samples` from the abap2UI5/samples **whole cloud branch** |
| **update_backend** (04:00) | abap2UI5 mirror → abap2UI5 transpile → abap2UI5 to CAP<br>(`mirror_abap2ui5`, `transpile_abap2ui5`, `copy_abap2ui5`) | `cap2UI5/srv/z2ui5` from the abap2UI5 framework `src/` |
| **update_frontend** (05:00) | app mirror → app prepare → app to CAP<br>(`mirror_app`, `prepare_app`, `copy_app`) | `cap2UI5/app/z2ui5/webapp` from the abap2UI5 `app/webapp` |

**Per-tree copy policies** (`copy-into-cap.js <stream>`): the backend tree
`srv/z2ui5` is the hand-maintained CAP architecture adaptation, so transpiled
classes are only **added** there and never copied over an existing file
(promoting one is a deliberate manual step); `srv/app/samples` is fully owned
by the transpiler — existing files are overwritten and files gone upstream
are removed (the sibling `srv/app` custom apps are untouched); the webapp is
replaced 1:1. Transpiled files that do not parse are skipped and reported.
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
