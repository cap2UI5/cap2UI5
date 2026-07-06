# cap2UI5 dev

[![sync pipeline](https://github.com/cap2UI5/dev/actions/workflows/sync.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/sync.yml)
[![1 mirror abap2UI5](https://github.com/cap2UI5/dev/actions/workflows/1_mirror_abap2ui5.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/1_mirror_abap2ui5.yml)
[![2 mirror samples](https://github.com/cap2UI5/dev/actions/workflows/2_mirror_samples.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/2_mirror_samples.yml)
[![3 transpile abap2UI5](https://github.com/cap2UI5/dev/actions/workflows/3_transpile_abap2ui5.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/3_transpile_abap2ui5.yml)
[![4 transpile samples](https://github.com/cap2UI5/dev/actions/workflows/4_transpile_samples.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/4_transpile_samples.yml)
[![5 copy backend](https://github.com/cap2UI5/dev/actions/workflows/5_copy_backend.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/5_copy_backend.yml)
[![6 copy frontend](https://github.com/cap2UI5/dev/actions/workflows/6_copy_frontend.yml/badge.svg)](https://github.com/cap2UI5/dev/actions/workflows/6_copy_frontend.yml)

Development repository for [cap2UI5](cap2UI5/) — bringing the
[abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js.

The CAP project lives in [`cap2UI5/`](cap2UI5/), see its README for details.

## Dev tooling (repo root)

Everything that is not deployed with the CAP project lives up here:

| | |
|---|---|
| `npm test` | jest suite (backend units, sample apps, transpiler) |
| `npm run transpile` | abap2js — transpile abap2UI5 app classes to JS (parser: [@abaplint/core](https://github.com/abaplint/abaplint)) |
| `npm run mirror_input` | snapshot abap2UI5 (src/ + app/webapp) into `input/` |
| `npm run mirror_frontend` | `input/app/webapp` → `cap2UI5/app/z2ui5/webapp` (+ patches) |
| `npm run sync_backend` | transpile the app layer from `input/src` into `cap2UI5/srv` |
| `scripts/`, `test/`, `jest.config.js` | sources of the above |

```
npm run transpile -- path/to/z2ui5_cl_my_app.clas.abap --stdout
npm run transpile -- path/to/abap2UI5/src -o out       # recursive, mirrors 02/01/... 1:1
npm run transpile -- --preferred-map path/to/z2ui5_cl_xml_view.clas.abap
```

Statements outside the supported subset are emitted as
`// TODO(abap2js): <original>` comments and reported on stderr — nothing is
dropped silently. The core engine (handler, binding, model, draft) is a
hand-maintained architecture adaptation and is not a transpile target.

## Sync pipeline

GitHub Actions under `.github/workflows/` — each step runs standalone via
dispatch, `sync.yml` chains 1→6 (dispatch or weekly). The same steps run
locally via the npm scripts.

| # | Workflow | npm script | What it does |
|---|---|---|---|
| 1 | 1 mirror abap2UI5 | `mirror_abap2ui5` | snapshot abap2UI5 (src/ + app/webapp) → `input/abap2UI5/` |
| 2 | 2 mirror samples | `mirror_samples` | snapshot abap2UI5/samples (src/) → `input/samples/` |
| 3 | 3 transpile abap2UI5 | `transpile_abap2ui5` | app layer (`z2ui5_cl_app_*`, `z2ui5_cl_pop_*`) → `output/abap2UI5/` + report |
| 4 | 4 transpile samples | `transpile_samples` | all sample classes → `output/samples/` + report |
| 5 | 5 copy backend | `copy_backend` | `output/` → `cap2UI5/srv` — TODO-gate + jest must pass |
| 6 | 6 copy frontend | `copy_frontend` | `input/abap2UI5/app/webapp` → `cap2UI5/app/z2ui5/webapp` + patches |
| 7 | — manual | — | see `output/*/transpile-report.json`: TODO-gated classes, core-engine drift, embedded frontend (GET route) |

Safety gates in step 5: a transpile result with `TODO(abap2js)` markers never
replaces an existing file (kept + reported), and the jest suite must pass
before anything is committed. `MIRROR_SOURCE=/path` lets the mirror steps use
a local checkout instead of cloning.

## Frontend

The UI5 frontend in `cap2UI5/app/z2ui5/webapp` is a 1:1 mirror of the
`app/webapp` folder from abap2UI5, served by CAP at `/z2ui5/webapp`.

Only two values are cap2UI5-specific and get patched in place after each
mirror run by `scripts/patch-frontend.js` (no stored copies):
the CDN bootstrap URL in `index.html` and the `/rest/root/z2ui5` data
source in `manifest.json`. Refresh the mirror with:

```bash
npm run mirror_input && npm run mirror_frontend
```
