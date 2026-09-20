# `@abap2ui5/runtime` — a stand-in

This directory is what abap2UI5 **would publish** if its `release.yaml` gained
one job: `npm publish` of the transpiled output. It is a stand-in so that the
`cap2ui5` plugin next door can depend on it by name, exactly as it would on the
real package.

Only `package.json` and this file are committed. The three content directories
are 20 MB of generated output that any checkout rebuilds; fill them with

```bash
scripts/assemble-runtime.sh <upstream checkout>     # or: --package X.Y.Z
```

| directory | copied from upstream | why the plugin needs it |
|---|---|---|
| `output/` | `node/output` after `npm run auto_downport && npm run auto_transpile` | the framework: `init.mjs` boots it, `cl_express_icf_shim.clas.mjs` is the HTTP adapter |
| `setup/` | `node/setup/setup.mjs` | `output/init.mjs` imports `../setup/setup.mjs` — the path is fixed by upstream's `abap_transpile.json`, so the hook ships with the output |
| `webapp/` | `app/webapp` | the UI5 shell, served as-is; same commit as the backend, so the wire protocol cannot drift |

The version is the framework's version: the package is a deterministic function
of the upstream tag, like the `X.Y.Z-702` tag `release.yaml` already cuts.
`cap2ui5` pins it exactly, which is what guarantees that frontend, backend and
`z2ui5_if_ui5_types=>c_protocol` come from one commit.

`setup.mjs` wires `@abaplint/database-sqlite` as the runtime's `DEFAULT`
connection. Measured (`examples/bookshop/bench.mjs`): with the plugin's CDS draft store
installed, 200 roundtrips send it **no SQL at all** — only `rollback` and
`endTransaction`, two per roundtrip. It stays because an ABAP app's own Open
SQL would go there; a CAP-backed `DatabaseClient` for those is a later step.

On the `claude/happy-turing-qt6ljo` branch of upstream, `release.yaml` has the
`runtime` job that packs exactly this from `node/package.json` — dry run:
1,307 files, 1.5 MB packed, 16.4 MB unpacked.
