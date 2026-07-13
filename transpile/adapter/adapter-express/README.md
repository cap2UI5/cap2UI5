# adapter-express — abap2UI5 as an express app

Same seam as [adapter-node](../adapter-node/) — `require("abap2UI5/engine")` —
but mounted on express middleware, showing what embedding abap2UI5 into an
existing express application looks like: two `express.static` mounts and the
three `/rest/root/z2ui5` methods (~60 lines, see [server.js](server.js)).

## Run

```bash
npm install     # links ../../core as the abap2UI5 package + express
npm start       # → http://localhost:4204/z2ui5/webapp/index.html
```

Start any bundled app via URL parameter, e.g.
`?app_start=z2ui5_cl_app_hello_world` or `?app_start=z2ui5_cl_demo_app_001`.

Drafts live in an in-memory `Map` — swap the `set_store` implementation for
anything durable. Samples that consume the CAP OData services (e.g.
`z2ui5_cl_app_read_odata`) need the [CAP project](../../../cap2UI5/).
