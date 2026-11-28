# examples/bookshop

An ordinary CAP project with `@cap2ui5/cds-plugin` as a dependency. Everything
cap2UI5 adds is the dependency and the app modules in `srv/apps/`:

| file | shows |
|---|---|
| `srv/apps/hello.js` | the smallest app: one field, one event |
| `srv/apps/books.js` | an app that reads and writes the project's own entity with `cds.ql` |
| `srv/apps/builder.js` | a view built with `z2ui5_cl_ui5_view_builder`, as an ABAP app builds one |
| `srv/apps/pick.js` | navigation to another app and back, a popup, a nested view |

`srv/catalog-service.cds` is a plain CAP service on the same entity: what the
Books app adds, `/odata/v4/catalog/Books` returns.

```bash
npm start            # from the repository root
```

In development CAP's mocked users apply - log in as `alice`. The start page
lists the apps.

The test suite does not run here: it runs in `test/project`, whose apps are
fixtures for the tests. `test/project/test/example.test.mjs` starts this
project and drives each app once, so the example cannot quietly break.
