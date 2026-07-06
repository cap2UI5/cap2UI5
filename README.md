# cap2UI5 dev

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

## Sync workflows

GitHub Actions under `.github/workflows/` automate the same steps:

1. **1 mirror input** — snapshot abap2UI5 into `input/` (versioned, reviewable)
2. **2 mirror frontend** — `input/app/webapp` → `cap2UI5/app/z2ui5/webapp` + patches
3. **3 sync backend** — transpile `z2ui5_cl_app_*`/`z2ui5_cl_pop_*` from `input/src/02`;
   TODO-marked results never replace existing files, jest must pass before commit
4. **sync from abap2UI5** — runs 1→2→3 (dispatch or weekly)

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
