# builder-cap2UI5/ — the CAP app build project

This project **generates the deployable CAP app** [`cap2UI5/`](../cap2UI5/)
from the hand-maintained source in [`src/`](src/) plus the webapp shipped by
the published [core package](../builder-abap2UI5-js/core/).

> [!IMPORTANT]
> **`cap2UI5/` is a build artifact — do not hand-edit it.** Every build wipes
> and rewrites it. The hand-written source lives in [`src/`](src/); edit
> there and re-run the build. (Your own apps go in `src/srv/app/` or an
> external `Z2UI5_APP_DIRS` folder — never in `cap2UI5/srv/app/`, which is
> regenerated.)

## Build

```bash
# prerequisite: the core package must be published
cd ../builder-abap2UI5-js && npm install && npm run build_core

cd ../builder-cap2UI5
npm run build_cap    # assemble + publish → regenerate ../cap2UI5
```

No dependencies — the scripts are plain Node. What the build does:

| Step | What it does |
|---|---|
| `npm run assemble` | `base/` → `run/output/cap2UI5` (verbatim), then overlay `../builder-abap2UI5-js/core/app/z2ui5/webapp` → `app/z2ui5/webapp` (the copy served by CDS statics and zipped by the mta html5 module — taken from the published core, so the two cannot drift) |
| `npm run publish` | 1:1 copy `run/output/cap2UI5` → `../cap2UI5/` (the very last step) |
| `npm run build_cap` | `assemble` then `publish` |
| `npm test` | runs the CAP app's own jest suite (in `../cap2UI5`) |

The framework itself is **not** copied — the app consumes it as the npm
dependency `abap2UI5` (`file:../builder-abap2UI5-js/core`). The only transformation in
the build: `src/` is one directory deeper than the published `cap2UI5/`, so
the copy rewrites the relative dependency path
(`file:../../builder-abap2UI5-js/core` → `file:../builder-abap2UI5-js/core`) in `package.json` and
`package-lock.json`.

## `src/` — the hand-written source

`src/` is the **source of truth** for the CAP app: the skeleton (`server.js`,
`z2ui5-service.*`, `db/`, `package.json`, `mta.yaml`, `srv/external/`), the
platform wiring (draft store → CDS entity `cap2ui5.z2ui5_t_01`, app discovery
→ `srv/app/`), the bundled custom app `srv/app/z2ui5_cl_app_read_odata.js`,
and the docs. Published as `cap2UI5/` minus the generated webapp overlay.

`src/` is itself a fully functional minimal CAP project — the starting point
of cap2UI5 with the same basic setup as abap2UI5: a mini frontend
(`app/index.html`), the http service (`POST /rest/root/z2ui5`) and the draft
persistence. Run and test it standalone (it links the core via
`file:../../builder-abap2UI5-js/core`):

```bash
cd src
npm install
npx cds watch      # → http://localhost:4004/index.html
npm test           # jest: boots the server via cds.test(), asserts all three layers
```

See the [minimal base section](src/README.md#the-minimal-base) in the source
README for details.

## License

MIT.
