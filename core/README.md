# abap2UI5 core — the platform-neutral framework package

This is the npm package `abap2UI5`: the engine, the transpiled framework
classes, the z2ui5 webapp and the bundled samples — **no CAP, no express, no
platform code**. Every platform consumes this one package:

| Consumer | How |
|---|---|
| [`cap2UI5/`](../cap2UI5/) | the full CAP app — `"abap2UI5": "file:../core"` |
| [`adapter-cap/`](../adapter-cap/) | minimal CAP wrapper |
| [`adapter-node/`](../adapter-node/) | bare `node:http` server |
| [`adapter-express/`](../adapter-express/) | express middleware |
| [`adapter-web/`](../adapter-web/) | serverless browser bundle |

> [!IMPORTANT]
> **This folder is a generated build artifact** — assembled from the
> hand-written source in [`builder/base/core/`](../builder/base/core/) plus
> the transpiled upstream [abap2UI5](https://github.com/abap2UI5/abap2UI5)
> sources. Do not hand-edit it; edit `builder/base/core/` and re-run
> `npm run build_cap` in [`builder/`](../builder/).

## The seam

The platform surface is tiny — see [`srv/z2ui5/engine.js`](srv/z2ui5/engine.js):

```js
const engine = require("abap2UI5/engine");
engine.set_store({ load, save });          // draft persistence port
engine.register_app_dir("/my/apps");       // or register_app_class(Cls)
http POST  →  await engine.roundtrip(body, reqInfo)   // → JSON string
http GET   →  engine.bootstrap_html(reqInfo)          // → { html, headers }
statics    →  engine.WEBAPP_DIR (+ engine.ui5_resources_dir())
```

Everything below the engine is platform-agnostic: without an injected draft
store a volatile in-memory fallback is used (fine for tests, wrong for
production — inject your own).

## Layout

| Path | What it is |
|---|---|
| `srv/z2ui5/` | the framework: `engine.js`, the ports (`z2ui5_port.js`, `z2ui5_asset.js`), the class trees `00/`–`99/` |
| `srv/app/samples/` | the bundled sample apps (transpiled from upstream) |
| `app/z2ui5/webapp/` | the z2ui5 frontend (mirrored + patched from upstream) |

The internal layout intentionally mirrors the historical CAP project paths so
the exports map, asset port and serialized draft references stay stable.

## License

MIT.
