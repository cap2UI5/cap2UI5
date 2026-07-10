# Developing cap2UI5

[![sync pipeline](https://github.com/cap2UI5/cap2UI5/actions/workflows/sync.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/sync.yml)

> [!IMPORTANT]
> **Everything in this project is generated automatically.** The entire
> codebase, all documentation, and the
> [web version](https://github.com/cap2UI5/web-cap2UI5) were created by AI
> (Claude) and by the automated [sync pipeline](#sync-pipeline) that mirrors
> and transpiles the upstream
> [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources — nothing here is
> hand-written. Review and test before relying on it.

This document covers how the repository itself is built and kept in sync
with upstream. If you just want to **use** cap2UI5, start with the
[root README](../README.md) and the [CAP project](../cap2UI5/README.md).

## Repository roles

The repo root is the development harness; the deployable CAP project lives
in [`cap2UI5/`](../cap2UI5/). The static browser build (whole stack
client-side, deployed to GitHub Pages) lives in
[web-cap2UI5](https://github.com/cap2UI5/web-cap2UI5) — it mirrors this
repo weekly and only relies on the two framework hooks
`z2ui5_cl_util.register_app_class()` and
`z2ui5_cl_core_srv_draft.set_store()`.

Three paths are wired to external repositories and must never be moved:
`input/abap2UI5/` (the abap2UI5 repo pushes snapshots into it via deploy
key), `input/samples/` (refreshed by the pipeline from abap2UI5/samples),
and `cap2UI5/` (mirrored by web-cap2UI5).

## Dev tooling

Everything that is not deployed with the CAP project lives under
[`tools/`](../tools/):

| | |
|---|---|
| `npm test` | jest suite (backend units, sample apps, transpiler) |
| `npm run transpile` | abap2js — transpile ABAP classes to JS (parser: [@abaplint/core](https://github.com/abaplint/abaplint)) |
| `npm run mirror_abap2ui5` / `mirror_samples` | snapshot upstream into `input/` |
| `npm run transpile_abap2ui5` / `transpile_samples` | transpile `input/*/src` → `output/` |
| `npm run prepare_app` | `input/abap2UI5/app/webapp` → `output/app` (+ patches) |
| `npm run copy_into_cap` | copy `output/*` → cap2UI5 project (backend fill-in, samples overwrite, app replace) |
| `tools/scripts/`, `tools/test/`, `tools/jest.config.js` | sources of the above |

```
npm run transpile -- path/to/z2ui5_cl_my_app.clas.abap --stdout
npm run transpile -- path/to/abap2UI5/src -o out       # recursive, mirrors 02/01/... 1:1
npm run transpile -- --preferred-map path/to/z2ui5_cl_xml_view.clas.abap
```

Statements outside the supported subset are emitted as
`// TODO(abap2js): <original>` comments and reported on stderr — nothing is
dropped silently.

The sample-app smoke gate diffs actual startup results against
`tools/test/apps-smoke.known-failures.json`; regenerate the list with
`node tools/scripts/smoke-apps.js --json`.

## Sync pipeline

GitHub Actions under `.github/workflows/` — each step runs standalone via
dispatch, `sync.yml` chains 1→6. The badge above reflects the chained
`sync.yml` runs; the step workflows are invoked via `workflow_call`, so
their runs (and status) appear as jobs **inside** each sync run — they only
get runs of their own when dispatched standalone, which is why per-step
badges would stay grey. It runs on every upstream update: the
`trigger_cap` workflow in [abap2UI5](https://github.com/abap2UI5/abap2UI5)
(push to `main`) refreshes `input/abap2UI5/` and pushes it here via a
deploy key registered on this repository with write access (private half:
secret `ACTION_KEY_CAP` in abap2UI5) — that push starts the pipeline. The
`trigger_cap` workflow in [samples](https://github.com/abap2UI5/samples)
(after the `cloud` branch is rebuilt) sends a `repository_dispatch`
(`upstream-update`) — it needs a token with write access here (secret
`ACTION_TOKEN_CAP` in the samples repo). Manual dispatch and a weekly cron
(safety net) also work. The same steps run locally via the npm scripts.

The pipeline propagates downstream the same way it is triggered from
upstream: step 7 (`7_trigger_web`) pushes the sha of the last commit
touching `cap2UI5/` to
[web-cap2UI5](https://github.com/cap2UI5/web-cap2UI5) (`UPSTREAM_HEAD`)
via a deploy key registered there with write access (private half: secret
`ACTION_KEY_WEB` here) — that push starts web-cap2UI5's **build web**
workflow, which rebuilds and redeploys the browser site. The step also
runs on direct pushes to `cap2UI5/**` on `main`, so every change to the
CAP project reaches the site, not just pipeline runs.

| # | Workflow | npm script | What it does |
|---|---|---|---|
| 1 | 1 mirror abap2UI5 | `mirror_abap2ui5` | snapshot abap2UI5 (src/ + app/webapp) → `input/abap2UI5/` |
| 2 | 2 mirror samples | `mirror_samples` | snapshot abap2UI5/samples (src/, `cloud` branch) → `input/samples/` |
| 3 | 3 transpile abap2UI5 | `transpile_abap2ui5` | all abap2UI5 classes (whole `src/` tree) → `output/abap2UI5/` + report |
| 4 | 4 transpile samples | `transpile_samples` | all sample classes → `output/samples/` + report |
| 5 | 5 prepare app | `prepare_app` | `input/abap2UI5/app/webapp` + patches → `output/app/` |
| 6 | 6 copy into cap | `copy_into_cap` | `output/abap2UI5` → `cap2UI5/srv/z2ui5` (fill-in only), `output/samples` → `cap2UI5/srv/app/samples` (overwrite), `output/app` → `cap2UI5/app/z2ui5/webapp` (replace) |
| 7 | 7 trigger web | — | push `UPSTREAM_HEAD` to [web-cap2UI5](https://github.com/cap2UI5/web-cap2UI5) via deploy key → starts its **build web** workflow |

After step 5 the `output/` folder holds the three deployable pieces —
`abap2UI5/`, `samples/`, `app/`. Step 6 applies them with per-tree policies:
the backend tree `srv/z2ui5` is the hand-maintained CAP architecture
adaptation, so transpiled classes are only **added** there and never copied
over an existing file (promoting one is a deliberate manual step);
`srv/app/samples` is fully owned by the transpiler — existing files are
overwritten and files gone upstream are removed (the sibling `srv/app`
custom apps are untouched); the webapp is replaced
1:1. Transpiled files that do not parse are skipped and
reported. Classes with `TODO(abap2js)` markers or `parseError` entries are
listed in `output/*/transpile-report.json` and need manual follow-up. Jest
runs after the copy and gates the sync commit — only a green suite is
pushed. `MIRROR_SOURCE=/path` lets the mirror steps use a local checkout
instead of cloning.

## Frontend

The UI5 frontend in `cap2UI5/app/z2ui5/webapp` is a 1:1 mirror of the
`app/webapp` folder from abap2UI5, served by CAP at `/z2ui5/webapp`.

Only two values are cap2UI5-specific and get patched into `output/app` by
`tools/scripts/patch-frontend.js` (no stored copies): the CDN bootstrap URL
in `index.html` and the `/rest/root/z2ui5` data source in `manifest.json`.
Refresh with:

```bash
npm run mirror_abap2ui5 && npm run prepare_app && npm run copy_into_cap
```
