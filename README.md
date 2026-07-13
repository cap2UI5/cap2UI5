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

## Two projects

The repository is organized as **core + consumers**: the platform-neutral
framework package, and everything built on top of it.

| Project | What it is | Start here |
|---|---|---|
| [**`core/`**](core/) | **The framework** — the npm package `abap2UI5`: engine, transpiled classes, webapp and samples. Platform-neutral (no CAP, no express); every project below consumes it via `"abap2UI5": "file:../core"`. | [core/README.md](core/README.md) |
| [**`cap2UI5/`**](cap2UI5/) | The finished, deployable CAP app derived from the core — install it, run `cds watch`, and write your own UI5 apps as JavaScript classes. **This is what you want if you just want to use cap2UI5.** | [cap2UI5/README.md](cap2UI5/README.md) |
| [**`builder/`**](builder/) | The build machinery **and hand-written source** that generates `core/` and `cap2UI5/`: the ABAP→JS transpiler, the sync scripts that mirror upstream abap2UI5, the hand-maintained source in `builder/base/`, and the jest suite. **This is what you want to change how the code is produced.** | [builder/README.md](builder/README.md) |
| [**`adapter-cap/`**](adapter-cap/) | The thinnest possible CAP wrapper around the `abap2UI5/engine` seam — one CDS REST action, no database, no OData. Read this to understand how `cap2UI5/` (the full app) is wired. | [adapter-cap/README.md](adapter-cap/README.md) |
| [**`adapter-node/`**](adapter-node/) | The same framework on a bare `node:http` server — no CAP, no express. Proof of the platform-neutral `abap2UI5/engine` seam (roundtrip + bootstrap + injectable store/asset ports) that every adapter builds on. | [adapter-node/README.md](adapter-node/README.md) |
| [**`adapter-express/`**](adapter-express/) | The same framework mounted as express middleware — for embedding abap2UI5 into an existing express app. | [adapter-express/README.md](adapter-express/README.md) |
| [**`adapter-web/`**](adapter-web/) | The whole stack web-packed into a static site — no server: the roundtrip is answered in-browser by the bundled engine. | [adapter-web/README.md](adapter-web/README.md) |

> [!NOTE]
> **`core/` and `cap2UI5/` are generated build artifacts in this repository** —
> every build wipes and rewrites them from `builder/base/core/` resp.
> `builder/base/cap/` + the transpiled sources. If you are contributing here,
> edit the source in `builder/base/`, not the published folders, and re-run
> `npm run build_cap` in `builder/`. (Consumers who copy `core/` + `cap2UI5/`
> out and use them standalone can of course edit them freely — see
> [builder/README.md](builder/README.md).)

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

The [builder](builder/) mirrors the upstream abap2UI5 ABAP sources, transpiles
them to JavaScript, **assembles** the core package and the CAP app by
overlaying the generated trees on the hand-written source in `builder/base/`,
and **publishes** them 1:1 into `core/` and `cap2UI5/` — gated by the jest
suite. The full pipeline — transpiler, sync scripts and GitHub Actions — is
documented in [builder/README.md](builder/README.md).

## License

This project is licensed under the MIT License.
