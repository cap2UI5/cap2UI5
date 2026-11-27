# `@abap2ui5/node-runtime` — a stand-in

This directory is the workspace's place for what abap2UI5 publishes as
`@abap2ui5/node-runtime`: the transpiled framework and its entry point. It is a stand-in so that the
plugin next door, `@cap2ui5/cds-plugin`, resolves it by name, exactly as it
does the real package, whether the content came from npm or from a build of
upstream's `main`.

Only `package.json` and this file are committed. The content directories
are 20 MB of generated output that any checkout rebuilds; fill them with

```bash
scripts/assemble-runtime.sh <upstream checkout>     # or: --package X.Y.Z
```

| directory | in the package | why the plugin needs it |
|---|---|---|
| `srv/` | the entry point `srv/host.mjs` and what it exports | the plugin boots through it: `initialize( )`, `exclusive( )`, `withSession( )`, `compress( )` (`plugin/lib/runtime.js`, `plugin/cds-plugin.js`) |
| `output/` | the transpiled framework | what `srv/host.mjs` loads; `cl_express_icf_shim.clas.mjs` is the HTTP adapter the route calls |
| `setup/` | `setup.mjs` | `output/init.mjs` imports `../setup/setup.mjs` — the path is fixed by upstream's `abap_transpile.json`, so the hook ships with the output |
| `downport/` | the ABAP the output was transpiled from | `abap2js` (plugin/lib/abap2js.js) reads `z2ui5_if_client`'s types there, so an app's translation knows what `client->get( )` answers |

The version is the framework's version: the package is a deterministic function
of the upstream tag, like the `X.Y.Z-702` tag `release.yaml` already cuts.
`@cap2ui5/cds-plugin` pins it exactly, which is what guarantees that frontend,
backend and `z2ui5_if_ui5_types=>c_protocol` come from one commit.

`setup.mjs` wires `@abaplint/database-sqlite` as the runtime's `DEFAULT`
connection. Measured (`examples/bookshop/bench.mjs`): with the plugin's CDS draft store
installed, 200 roundtrips send it **no SQL at all** — only `rollback` and
`endTransaction`, two per roundtrip. It stays because an ABAP app's own Open
SQL would go there; a CAP-backed `DatabaseClient` for those is a later step.

Upstream packs this as `@abap2ui5/node-runtime` (`npm run pack:node-runtime`, manifest
`node/setup/npm.package.json`) at the end of `backend-prebuilt.yaml`, and
publishes it by trusted publishing with every release.
`scripts/assemble-runtime.sh` fills this directory with that package, unpacked:
`--package X.Y.Z` takes it from npm, a path to an upstream checkout has that
checkout pack it with the same `pack:node-runtime` - so both ways this
directory holds what a consumer's `node_modules` would, the manifest with its
`exports` included, and nothing here re-assembles the package by hand.

`plugin/package.json` depends on the published package by its exact version,
and the committed stand-in's `version` is kept at that pin: npm links a
workspace only where its version satisfies the dependency, and installs the
registry's copy under `plugin/node_modules` otherwise - the suite would then
run against that copy and not against what was assembled here. The stand-in
stays for one reason, the CI job that builds upstream's `main`: a runtime that
is not published yet has to come from somewhere.
