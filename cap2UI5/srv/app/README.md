# cap2UI5 — Custom Apps

Hand-written z2ui5 apps for this project live here. Unlike `srv/z2ui5/`
(transpiled framework core, synced from upstream abap2UI5) and `srv/samples/`
(fully owned by the transpiler pipeline), this folder is **not touched by the
sync workflows** — it is the place to collect your own apps.

Currently included:

- `z2ui5_cl_app_read_odata.js` — table over remote Northwind OData data,
  fetched via CAP's `cds.connect.to` (see the walkthrough in the project README)

## Adding a custom app

Drop a `.js` file in this folder whose basename matches the class name it
exports (the RTTI lookup is name-based):

```js
// srv/app/z2ui5_cl_app_my_app.js
const z2ui5_if_app      = require("abap2UI5/z2ui5_if_app");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

class z2ui5_cl_app_my_app extends z2ui5_if_app {
  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_xml_view.factory()
        .Page({ title: "My App" })
        .Button({ text: "Hello" });
      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_app_my_app;
```

No registration needed — this folder is part of the framework's app search
path (see `_app_dirs()` in `srv/z2ui5/00/03/z2ui5_cl_util.js`), so the app is
immediately reachable via:

```
http://localhost:4004/z2ui5/webapp/index.html?app_start=z2ui5_cl_app_my_app
```

and via `client.nav_app_call()` from other apps.

Resolution order (first hit wins):

1. Framework built-ins (`srv/z2ui5/02/`, `srv/z2ui5/02/01/`)
2. Custom apps (`srv/app/` — this folder)
3. Bundled samples (`srv/samples/`)
4. Runtime-registered dirs (`register_app_dir(...)`)
5. `Z2UI5_APP_DIRS` env var (`PATH`-style colon-separated list)
