# AGENTS.md — cap2UI5 (the deployable CAP app)

Guidance for AI agents and contributors. Read before making any change.

> [!IMPORTANT]
> **This repository is a generated build artifact.** It is published 1:1 by
> [builder-cap2UI5](https://github.com/cap2UI5/builder-cap2UI5) — every
> publish wipes and rewrites everything except `.git/` and `.github/`.
> **Do not hand-edit anything outside `.github/` here** (including this
> file, the README and the devcontainer — they ship from
> builder-cap2UI5:`src/`).

## Where changes belong

| You want to change… | Edit in |
|---|---|
| the app skeleton (`srv/server.js`, `z2ui5-service.*`, `db/`, `mta.yaml`, `test/`, README, devcontainer, this file) | [builder-cap2UI5](https://github.com/cap2UI5/builder-cap2UI5) → `src/` |
| the framework / core package (`core/` — engine, `core/srv/z2ui5/`, bundled samples, webapp) | [builder-abap2UI5-js](https://github.com/cap2UI5/builder-abap2UI5-js) → `src/` (or its transpiler pipelines) |
| this repo's CI (`.github/workflows/test.yml`, `trigger_web.yml`) | here — `.github/` is the only repo-owned folder |
| your own apps (as a **user** of cap2UI5) | `srv/app/` or any folder registered via `Z2UI5_APP_DIRS` / `require("abap2UI5/register-apps")(dir)` — note `srv/app/` is overwritten on every publish, so external folders are safer for real projects |

## Layout

- App at the repo root: `app/` (webapp + starter page), `db/` (draft table
  `cap2ui5.z2ui5_t_01`), `srv/` (service, server wiring, `srv/app/` custom
  apps, `srv/external/` Northwind model), `test/` (jest), `mta.yaml`
  (BTP deployment).
- `core/` — the **vendored** platform-neutral core package (npm name
  `abap2UI5`, linked via `"abap2UI5": "file:./core"`): engine, framework
  classes (`core/srv/z2ui5/`), ~185 bundled samples
  (`core/srv/app/samples/`), the z2ui5 webapp source. Its dependency tree is
  part of the app lock (under `core/node_modules/`), so **one** `npm ci` at
  the root installs everything.

## Run & test

```bash
npm install
npx cds watch          # http://localhost:4004/z2ui5/webapp/index.html
npm test               # jest: starter integration test + view builder test
```

## Pipeline context

builder-abap2UI5-js (nightly sync from upstream abap2UI5, rebuilds the core)
→ `trigger_cap` → builder-cap2UI5 `update_cap` (rebuild + jest gate +
publish **here** via deploy key `ACTION_KEY_APP`) → `trigger_web` here
(manual) kicks
[builder-cap2UI5-web](https://github.com/cap2UI5/builder-cap2UI5-web), which
bundles this repo into the static site
[web-cap2UI5-build](https://github.com/cap2UI5/web-cap2UI5-build)
(GitHub Pages: https://cap2ui5.github.io/web-cap2UI5-build/).
