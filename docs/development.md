# Developing cap2UI5

[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

> [!IMPORTANT]
> **Everything in this project is generated automatically.** The entire
> codebase, all documentation, and the
> [web version](https://github.com/cap2UI5/web-cap2UI5) were created by AI
> (Claude) and by the automated [sync pipelines](#sync-pipelines) that mirror
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
| `npm run mirror_abap2ui5` / `mirror_app` / `mirror_samples` | snapshot upstream into `input/` (backend `src/`, frontend `app/webapp`, whole samples cloud branch) |
| `npm run transpile_abap2ui5` / `transpile_samples` | transpile `input/*/src` → `output/` |
| `npm run prepare_app` | `input/abap2UI5/app/webapp` → `output/app` (+ patches) |
| `npm run copy_abap2ui5` / `copy_samples` / `copy_app` | copy one `output/` tree → cap2UI5 project (fill-in / overwrite / replace); `copy_into_cap` (no arg) does all three |
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

| Pipeline (nightly) | Steps → npm scripts | What it refreshes |
|---|---|---|
| **update_samples** (03:00) | samples mirror → samples transpile → samples to CAP<br>(`mirror_samples`, `transpile_samples`, `copy_samples`) | `cap2UI5/srv/app/samples` from the abap2UI5/samples **whole cloud branch** |
| **update_backend** (04:00) | abap2UI5 mirror → abap2UI5 transpile → abap2UI5 to CAP<br>(`mirror_abap2ui5`, `transpile_abap2ui5`, `copy_abap2ui5`) | `cap2UI5/srv/z2ui5` from the abap2UI5 framework `src/` |
| **update_frontend** (05:00) | app mirror → app to CAP<br>(`mirror_app`, `prepare_app` + `copy_app`) | `cap2UI5/app/z2ui5/webapp` from the abap2UI5 `app/webapp` |

Per-tree copy policies (`copy-into-cap.js <stream>`): the backend tree
`srv/z2ui5` is the hand-maintained CAP architecture adaptation, so transpiled
classes are only **added** there and never copied over an existing file
(promoting one is a deliberate manual step); `srv/app/samples` is fully owned
by the transpiler — existing files are overwritten and files gone upstream
are removed (the sibling `srv/app` custom apps are untouched); the webapp is
replaced 1:1. Transpiled files that do not parse are skipped and reported.
Classes with `TODO(abap2js)` markers or `parseError` entries are listed in
`output/*/transpile-report.json` and need manual follow-up. Each `… to CAP`
step runs jest and gates its commit — only a green suite is pushed.
`MIRROR_SOURCE=/path` lets the mirror steps use a local checkout instead of
cloning.

Downstream web deploy (`trigger_web`) pushes the sha of the last commit
touching `cap2UI5/` to
[web-cap2UI5](https://github.com/cap2UI5/web-cap2UI5) (`UPSTREAM_HEAD`) via a
deploy key registered there with write access (private half: secret
`ACTION_KEY_WEB` here) — that push starts web-cap2UI5's **build web**
workflow, which rebuilds and redeploys the browser site. It runs on direct
pushes to `cap2UI5/**` on `main` and via `workflow_dispatch`. Note that the
`update_*` pipelines commit with `GITHUB_TOKEN`, which does **not** fire
`push` events, so a nightly sync does not auto-trigger the web rebuild — run
`trigger_web` manually, or wire it into the `update_*` orchestrators, when a
bot-driven sync should redeploy the site.

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
