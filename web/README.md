# cap2UI5 web — the browser build

Runs the complete cap2UI5 stack **inside the browser**: the unchanged UI5
frontend plus the whole backend (framework core + samples) bundled into a
single JS file. Every roundtrip is answered in-process — no CAP server, no
Node.js, just static files.

This is the cap2UI5 twin of
[abap2UI5-web](https://github.com/abap2UI5/abap2UI5-web) (the build behind
[web-abap2ui5-samples](https://github.com/abap2UI5/web-abap2ui5-samples)),
which bundles the abaplint-transpiled ABAP sources with `@abaplint/runtime`
and a WASM SQLite. cap2UI5's backend is already plain JavaScript, so this
build gets away with much less: no ABAP runtime, no WASM database —
the bundle is ~1.2 MB instead of ~12 MB.

## How it works

```
Browser
├── index.html            unchanged UI5 shell (UI5 from CDN)
│   └── z2ui5-web.js      ← loaded BEFORE the UI5 bootstrap
├── Component.js, core/…  unchanged webapp (1:1 from cap2UI5/app/z2ui5)
│
│   the webapp still calls fetch("/rest/root/z2ui5", {method: "POST", …})
│   like it always does — but z2ui5-web.js has patched globalThis.fetch:
│
└── z2ui5-web.js (bundle)
    ├── fetch interceptor  POST/HEAD to */rest/root/z2ui5 → in-process call,
    │                      everything else → native fetch
    ├── z2ui5_cl_http_handler + core (srv/z2ui5, CAP-free)
    ├── all sample apps + built-ins (static registry, see below)
    └── in-memory draft store (Map — the tab IS the session)
```

Three substitutions make the backend browser-able, all of them additive
hooks in the framework:

| Node/CAP | Browser | Hook |
|---|---|---|
| app classes resolved by walking `srv/` directories + `require()` | static registry generated at build time | `z2ui5_cl_util.register_app_class()` |
| drafts in the CDS entity `z2ui5_t_01` | in-memory `Map` | `z2ui5_cl_core_srv_draft.set_store()` |
| `@sap/cds`, `fs`, `path`, `crypto` | build-time stubs (`stubs/`) — unreachable at runtime once the hooks above are installed | esbuild `alias` |

## Build

```bash
cd web
npm install
npm run build     # → web/dist (fully static site)
npm run serve     # local test server on http://localhost:8080
```

Or from CI: the **`7 build web`** workflow (`workflow_dispatch`) builds the
site and uploads it as the `cap2ui5-web` artifact; with the *deploy to
GitHub Pages* input checked it is published to Pages (repo settings →
Pages → source "GitHub Actions").

Start a specific app exactly like on the CAP server:
`index.html?app_start=z2ui5_cl_demo_app_001`.

## Files

| | |
|---|---|
| `entry.mjs` | browser entry: register classes, plug draft store, patch fetch |
| `gen-registry.mjs` | scans `srv/samples` + built-ins → `generated/registry.mjs` (smoke-requires every candidate, skips broken ones — same policy as the sync pipeline) |
| `build.mjs` | esbuild bundle + webapp copy + index.html patch → `dist/` |
| `draft-store.mjs` | in-memory Map store (FIFO-bounded) |
| `stubs/` | build-time stand-ins for `@sap/cds`, `fs`, `path`, `crypto` |
| `dev-server.mjs` | dependency-free static server for local testing |

`generated/` and `dist/` are build output (gitignored).

Two build details worth knowing:

- **`keepNames: true` is load-bearing.** Draft serialization keys on
  `oApp.constructor.name`; without it, minification renames classes and
  drafts cannot be restored.
- Samples that Node loads but esbuild's stricter scope analysis rejects
  (e.g. assignment to a `const`) are excluded from the registry
  automatically and reported in the build log.

## Limitations

- **Demo/playground artifact.** cap2UI5's security benefit — the view is
  built in the backend — obviously disappears when the backend ships to the
  client. Use it for live samples, docs, zero-install demos; not as a
  production topology.
- **Drafts live in the tab.** Reload = fresh session (matching the
  session-scoped draft design). Back-navigation depth is bounded by the
  store's FIFO limit.
- **Server-only features are off.** The Northwind externalservice sample
  needs a CORS-reachable endpoint; anything relying on CAP services,
  destinations or real persistence won't work.
- **UI5 comes from the CDN** (same as the CAP-served app) — the page needs
  internet access even though the backend doesn't.
