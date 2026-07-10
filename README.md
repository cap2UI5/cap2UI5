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

This repository is split into two independent npm projects. Pick the one that
matches what you want to do:

| Project | What it is | Start here |
|---|---|---|
| [**`cap2UI5/`**](cap2UI5/) | The finished, deployable CAP app — install it, run `cds watch`, and write your own UI5 apps as JavaScript classes. **This is what you want if you just want to use cap2UI5.** | [cap2UI5/README.md](cap2UI5/README.md) |
| [**`builder/`**](builder/) | The build machinery **and hand-written source** that generates `cap2UI5/`: the ABAP→JS transpiler, the sync scripts that mirror upstream abap2UI5, the hand-maintained source in `builder/base/`, and the jest suite. **This is what you want to change how the code is produced.** | [builder/README.md](builder/README.md) |

> [!NOTE]
> **`cap2UI5/` is a generated build artifact in this repository** — every build
> wipes and rewrites it from `builder/base/` + the transpiled sources. If you
> are contributing here, edit the source in `builder/base/`, not `cap2UI5/`, and
> re-run `npm run build_cap` in `builder/`. (Consumers who copy `cap2UI5/` out
> and use it standalone can of course edit it freely — see
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
them to JavaScript, **assembles** the complete app by overlaying the generated
trees on the hand-written source in `builder/base/`, and **publishes** it 1:1
into `cap2UI5/` — gated by the jest suite. The full pipeline — transpiler, sync
scripts and GitHub Actions — is documented in
[builder/README.md](builder/README.md).

## License

This project is licensed under the MIT License.
