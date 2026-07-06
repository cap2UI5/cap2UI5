# cap2UI5 dev

[![sync pipeline](https://github.com/cap2UI5/dev/actions/workflows/sync.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/sync.yml)
[![1 mirror abap2UI5](https://github.com/cap2UI5/dev/actions/workflows/1_mirror_abap2ui5.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/1_mirror_abap2ui5.yml)
[![2 mirror samples](https://github.com/cap2UI5/dev/actions/workflows/2_mirror_samples.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/2_mirror_samples.yml)
[![3 transpile abap2UI5](https://github.com/cap2UI5/dev/actions/workflows/3_transpile_abap2ui5.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/3_transpile_abap2ui5.yml)
[![4 transpile samples](https://github.com/cap2UI5/dev/actions/workflows/4_transpile_samples.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/4_transpile_samples.yml)
[![5 prepare app](https://github.com/cap2UI5/dev/actions/workflows/5_prepare_app.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/5_prepare_app.yml)
[![6 copy into cap](https://github.com/cap2UI5/dev/actions/workflows/6_copy_into_cap.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/6_copy_into_cap.yml)

Development repository for [cap2UI5](cap2UI5/) — bringing the
[abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js.

The CAP project lives in [`cap2UI5/`](cap2UI5/), see its README for details.

## Dev tooling (repo root)

Everything that is not deployed with the CAP project lives up here:

| | |
|---|---|
| `npm test` | jest suite (backend units, sample apps, transpiler) |
| `npm run transpile` | abap2js — transpile ABAP classes to JS (parser: [@abaplint/core](https://github.com/abaplint/abaplint)) |
| `npm run mirror_abap2ui5` / `mirror_samples` | snapshot upstream into `input/` |
| `npm run transpile_abap2ui5` / `transpile_samples` | transpile `input/*/src` → `output/` |
| `npm run prepare_app` | `input/abap2UI5/app/webapp` → `output/app` (+ patches) |
| `npm run copy_into_cap` | copy `output/*` → cap2UI5 project (backend fill-in, samples overwrite, app replace) |
| `scripts/`, `test/`, `jest.config.js` | sources of the above |

```
npm run transpile -- path/to/z2ui5_cl_my_app.clas.abap --stdout
npm run transpile -- path/to/abap2UI5/src -o out       # recursive, mirrors 02/01/... 1:1
npm run transpile -- --preferred-map path/to/z2ui5_cl_xml_view.clas.abap
```

Statements outside the supported subset are emitted as
`// TODO(abap2js): <original>` comments and reported on stderr — nothing is
dropped silently.

## Sync pipeline

GitHub Actions under `.github/workflows/` — each step runs standalone via
dispatch, `sync.yml` chains 1→6. It runs on every upstream update: the
`trigger_cap` workflow in [abap2UI5](https://github.com/abap2UI5/abap2UI5)
(push to `main`) refreshes `input/abap2UI5/` and pushes it here via a
deploy key registered on this repository with write access (private half:
secret `ACTION_KEY_CAP` in abap2UI5) — that push starts the pipeline. The
`trigger_cap` workflow in [samples](https://github.com/abap2UI5/samples)
(after the `cloud` branch is rebuilt) sends a `repository_dispatch`
(`upstream-update`) — it needs a token with write access here (secret
`ACTION_TOKEN_CAP` in the samples repo). Manual dispatch and a weekly cron
(safety net) also work. The same steps run locally via the npm scripts.

| # | Workflow | npm script | What it does |
|---|---|---|---|
| 1 | 1 mirror abap2UI5 | `mirror_abap2ui5` | snapshot abap2UI5 (src/ + app/webapp) → `input/abap2UI5/` |
| 2 | 2 mirror samples | `mirror_samples` | snapshot abap2UI5/samples (src/, `cloud` branch) → `input/samples/` |
| 3 | 3 transpile abap2UI5 | `transpile_abap2ui5` | all abap2UI5 classes (whole `src/` tree) → `output/abap2UI5/` + report |
| 4 | 4 transpile samples | `transpile_samples` | all sample classes → `output/samples/` + report |
| 5 | 5 prepare app | `prepare_app` | `input/abap2UI5/app/webapp` + patches → `output/app/` |
| 6 | 6 copy into cap | `copy_into_cap` | `output/abap2UI5` → `cap2UI5/srv/z2ui5` (fill-in only), `output/samples` → `cap2UI5/srv/samples` (overwrite), `output/app` → `cap2UI5/app/z2ui5/webapp` (replace) |

After step 5 the `output/` folder holds the three deployable pieces —
`abap2UI5/`, `samples/`, `app/`. Step 6 applies them with per-tree policies:
the backend tree `srv/z2ui5` is the hand-maintained CAP architecture
adaptation, so transpiled classes are only **added** there and never copied
over an existing file (promoting one is a deliberate manual step);
`srv/samples` is fully owned by the transpiler — existing files are
overwritten and files gone upstream are removed; the webapp is replaced
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
`scripts/patch-frontend.js` (no stored copies): the CDN bootstrap URL in
`index.html` and the `/rest/root/z2ui5` data source in `manifest.json`.
Refresh with:

```bash
npm run mirror_abap2ui5 && npm run prepare_app && npm run copy_into_cap
```
