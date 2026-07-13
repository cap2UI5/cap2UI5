# adapter-node — abap2UI5 on a bare `node:http` server

Proof that the framework's platform surface is tiny: this adapter runs the
complete abap2UI5 stack — hello world and all bundled samples — **without CAP
and without express**, on nothing but `node:http` and the
[`abap2UI5/engine`](../core/srv/z2ui5/engine.js) seam:

```js
const engine = require("abap2UI5/engine");

engine.set_store({ load, save });               // draft persistence port
POST  →  await engine.roundtrip(oBody, reqInfo) // the z2ui5 roundtrip
GET   →  engine.bootstrap_html(reqInfo)         // the bootstrap page
statics  engine.WEBAPP_DIR / engine.ui5_resources_dir()
```

Everything else in [`server.js`](server.js) is plain transport: a mime table,
a static-file streamer and the three `/rest/root/z2ui5` methods, mirroring the
CAP wiring so the unchanged upstream webapp works 1:1.

## Run

```bash
npm install     # links ../core as the abap2UI5 package
npm start       # → http://localhost:4104/z2ui5/webapp/index.html
```

Start any bundled app via URL parameter, e.g.

```
http://localhost:4104/z2ui5/webapp/index.html?app_start=z2ui5_cl_app_hello_world
http://localhost:4104/z2ui5/webapp/index.html?app_start=z2ui5_cl_demo_app_001
```

## What is (deliberately) different from the CAP project

| | cap2UI5 (CAP) | adapter-node |
|---|---|---|
| draft persistence | CDS entity `z2ui5_t_01` (SQLite/HANA) | in-memory `Map` (per process) |
| OData services | `/odata/v4/admin`, Northwind proxy | none |
| deploy tooling | mta / cf | none |

Drafts vanish on restart — swap the `set_store` implementation for a file,
sqlite or redis store if you need durability. Samples that consume the CAP
OData services (e.g. `z2ui5_cl_app_read_odata`) need the CAP project.
