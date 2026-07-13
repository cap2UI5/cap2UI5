# adapter-web — abap2UI5 web-packed, no server at all

The whole stack — engine, framework classes and all bundled samples — compiled
into a single browser bundle and served as a **static site**. The roundtrip
the webapp fires against `/rest/root/z2ui5` never leaves the tab: a `fetch`
interceptor (installed before UI5 boots) answers it in-page via
`engine.roundtrip()`.

```
build.js:  registry (205 app classes) → esbuild → dist/z2ui5-bundle.js (~1.3 MB)
           webapp copied 1:1 into dist/, index.html patched (bundle first)
entry.js:  set_store(in-memory Map) + fetch interceptor + window.abap2UI5
shims/:    fs (no-op), path (posix mini), crypto (globalThis.crypto)
```

Server-only classes (e.g. `z2ui5_cl_app_read_odata`, which needs `@sap/cds`)
are skipped at registry load with a console warning — everything else runs.

## Build & try

```bash
npm install    # links ../core + esbuild
npm run build  # → dist/
npm run serve  # → http://localhost:4304/index.html?app_start=z2ui5_cl_app_hello_world
```

`dist/` is a plain static site — GitHub Pages, S3 or nginx serve it as-is.
The UI5 runtime is expected under `resources/` next to it: the test server
maps that to the local `openui5-dist`; for real hosting either copy those
resources into `dist/` or point the bootstrap `src` in `index.html` at a UI5
CDN.

## Limits

- Drafts live in a per-tab in-memory `Map` — swap `set_store` in
  [entry.js](entry.js) for localStorage/IndexedDB for persistence.
- `Buffer`-based converters (`z2ui5_cl_util_api.conv_*_base64` etc.) are not
  polyfilled; samples using them will error when the conversion runs.
- Samples calling external HTTP/OData need a server (CORS + `@sap/cds`).
