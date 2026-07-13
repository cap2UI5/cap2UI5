# cap2UI5

[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)
[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

Bringing the [abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to
CAP/Node.js: write complete UI5 apps as plain JavaScript classes in your CAP
backend — views, data binding and event handling included, no separate frontend
project needed.

> [!IMPORTANT]
> Everything in this project is generated automatically — by AI (Claude) and by
> a sync pipeline that mirrors and transpiles the upstream
> [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources. Review and test
> before relying on it.

## Three projects

The repository is organized as three projects, from framework to finished app:

| Project | What it is | Start here |
|---|---|---|
| [**`abap2UI5-js/`**](abap2UI5-js/) | **abap2UI5 ported to JavaScript**: the ABAP→JS transpiler and sync scripts that generate the platform-neutral core package, plus the platform adapters that consume it. | [abap2UI5-js/README.md](abap2UI5-js/README.md) |
| ├─ [`abap2UI5-js/core/`](abap2UI5-js/core/) | the generated npm package `abap2UI5` — engine, transpiled classes, webapp, samples. Everything below consumes it via a `file:` link. | [core/README.md](abap2UI5-js/core/README.md) |
| └─ [`abap2UI5-js/adapters/`](abap2UI5-js/adapters/) | the four platform adapters: [`cap`](abap2UI5-js/adapters/cap/) (thinnest CAP wrapper), [`node`](abap2UI5-js/adapters/node/) (bare `node:http`), [`express`](abap2UI5-js/adapters/express/) (middleware), [`web`](abap2UI5-js/adapters/web/) (serverless browser bundle). | each adapter's README |
| [**`cap-builder/`**](cap-builder/) | **The CAP app build project**: generates the full CAP app from its hand-written `src/` plus the core package. | [cap-builder/README.md](cap-builder/README.md) |
| [**`cap2UI5/`**](cap2UI5/) | **The finished, deployable CAP app** — install it, run `cds watch`, and write your own UI5 apps as JavaScript classes. **This is what you want if you just want to use cap2UI5.** | [cap2UI5/README.md](cap2UI5/README.md) |

> [!NOTE]
> **`abap2UI5-js/core/` and `cap2UI5/` are generated build artifacts in this
> repository** — every build wipes and rewrites them from `abap2UI5-js/src/`
> resp. `cap-builder/src/` + the transpiled sources. If you are contributing
> here, edit the sources in the `src/` folders, not the published ones, and
> re-run `npm run build_core` (abap2UI5-js) / `npm run build_cap` (cap-builder).
> (Consumers who copy `abap2UI5-js/core/` + `cap2UI5/` out and use them
> standalone can of course edit them freely.)

### Use it

```bash
cd cap2UI5
npm install
npx cds watch      # http://localhost:4004/z2ui5/webapp/index.html
```

Then write your first app — see the [cap2UI5 README](cap2UI5/README.md) for a
full walkthrough, worked examples and the ~345 bundled samples. You can also try
the samples without installing anything in the
[browser version](https://github.com/cap2UI5/web-cap2UI5).

### How it's built

[abap2UI5-js/](abap2UI5-js/) mirrors the upstream abap2UI5 ABAP sources, transpiles
them to JavaScript, **assembles** the core package by overlaying the generated
trees on the hand-written source in `abap2UI5-js/src/`, and **publishes** it 1:1
into `abap2UI5-js/core/`; [cap-builder/](cap-builder/) then derives the full CAP
app from its own `src/` + that core — everything gated by the jest suites.
The full pipeline — transpiler, sync scripts and GitHub Actions — is documented
in [abap2UI5-js/README.md](abap2UI5-js/README.md).

## License

This project is licensed under the MIT License.
