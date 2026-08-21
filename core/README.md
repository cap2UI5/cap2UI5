# abap2UI5 core — the platform-neutral framework package

This is the npm package `abap2UI5`: the engine, the transpiled framework
classes, the z2ui5 webapp and the bundled samples — **no CAP, no express, no
platform code**. Every platform consumes this one package:

| Consumer | How |
|---|---|
| [`cap2UI5`](https://github.com/cap2UI5/cap2UI5) | the full CAP app — `"abap2UI5": "file:./core"` (vendored copy of this package) |
| [`adapters/cap/`](../adapters/cap/) | minimal CAP wrapper |
| [`adapters/node/`](../adapters/node/) | bare `node:http` server |
| [`adapters/express/`](../adapters/express/) | express middleware |
| [`adapters/web/`](../adapters/web/) | serverless browser bundle |

> [!IMPORTANT]
> **This folder is a generated build artifact** — assembled from the
> hand-written source in [`src/`](../src/) plus the transpiled
> upstream [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources. Do not
> hand-edit it; edit `src/` and re-run `npm run build_core` at the
> [repo root](../).

## Using it in a CAP project

Two `using` lines and an install. The plugin does the rest — identity, the
draft store, app discovery, the bootstrap routes, the UI5 runtime mount and
the service implementation — because none of that is project-specific and
every consumer would otherwise copy the same ~160 lines and keep them in sync
by hand.

```jsonc
// package.json
{ "dependencies": { "abap2UI5": "..." } }
```

```cds
// db/schema.cds
using from 'abap2UI5/z2ui5-model';        // the draft table

// srv/service.cds
using from 'abap2UI5/z2ui5-service';      // the roundtrip endpoint
```

```js
// srv/app/my_app.js — your application
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class my_app extends z2ui5_if_app {
  name = "";
  main(client) {
    if (client.get_event() === "SEND") client.message_toast_display(`Hi ${this.name}`);
    client.view_display(/* ...view builder chain... */);
  }
}
module.exports = my_app;
```

Point the framework at your apps with `Z2UI5_APP_DIRS` (path-separated) or
`require("abap2UI5/register-apps")(__dirname)`, then `cds watch` and open
`/rest/root/z2ui5`.

The plugin is opt-outable, whole or piecewise, for a project that wants to
wire something itself:

```jsonc
// package.json
{ "cds": { "z2ui5": { "routes": false } } }   // or "activate": false
```

`abap2UI5/cap` exports the same `activate(options)` if you prefer to call it
explicitly — which is what the generated cap2UI5 app does, so the app's own
test suite exercises exactly the path an external consumer gets.

**TypeScript**: `types/index.d.ts` covers the app interface, the client, the
view-builder chain, the engine seam and the CAP entry point. The view builder
is the one that pays for itself — a fluent chain with no completion is a
guessing game.

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
