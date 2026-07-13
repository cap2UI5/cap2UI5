# adapter-cap — abap2UI5 on a minimal CAP server

Same seam as [adapter-node](../adapter-node/) and
[adapter-express](../adapter-express/) — `require("abap2UI5/engine")` — but the
transport is CAP: the roundtrip is a CDS REST action
([srv/z2ui5-service.cds](srv/z2ui5-service.cds) /
[.js](srv/z2ui5-service.js)), and everything CDS can't express (GET bootstrap
page, HEAD csrf ack, statics) sits in the custom [server.js](server.js) on
CAP's `bootstrap` event.

This is the **thinnest possible CAP wrapper** — no database, no OData, drafts
in an in-memory `Map`. The [full CAP project](../../../cap2UI5/) is this same wiring
grown up: draft persistence in the `cap2ui5.z2ui5_t_01` table, the OData
`AdminService`, remote-service samples and deployment descriptors. Read this
adapter first to understand that project.

## Run

```bash
npm install     # links ../../core as the abap2UI5 package + @sap/cds
npm start       # → http://localhost:4404/z2ui5/webapp/index.html
                # (or: npx cds serve — server.js is a regular CAP custom server)
```

Start any bundled app via URL parameter, e.g.
`?app_start=z2ui5_cl_app_hello_world` or `?app_start=z2ui5_cl_demo_app_001`.

Drafts live in an in-memory `Map` — swap the `set_store` implementation for
anything durable. Samples that consume the CAP OData services (e.g.
`z2ui5_cl_app_read_odata`) need the [full CAP project](../../../cap2UI5/).
