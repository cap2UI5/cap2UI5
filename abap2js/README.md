# @cap2ui5/abap2js

An abap2UI5 app class, translated into a cap2UI5 app module for
[`@cap2ui5/cds-plugin`](https://www.npmjs.com/package/@cap2ui5/cds-plugin) -
line for line.

Because the client and the view builder are abap2UI5's own, an abap2UI5 app
class translates into a cap2UI5 app line for line - and this package does it:

```bash
npm add -D @cap2ui5/abap2js
npx --no-install cap2ui5 abap2js src/z2ui5_cl_my_app.clas.abap --out srv/apps
```

It is a package of its own, a devDependency next to `@cap2ui5/cds-plugin`: it
brings the ABAP parser, `@abaplint/core` (8 MB), which a project that only
serves apps never needs. It translates against the framework the plugin
serves - the `downport/` sources of the `@abap2ui5/node-runtime` the plugin
pins.

`--no-install` makes npx run the project's `cap2ui5` or fail - never
download one. Without it, `npx cap2ui5`
where the plugin is not installed fetches and runs whatever npm has under the
unscoped name `cap2ui5`, and that name is no longer this package's. In a
`package.json` script the command is `cap2ui5 abap2js …`, which runs the
installed one as well.

`z2ui5_cl_my_app.clas.abap` becomes `srv/apps/z2ui5_cl_my_app.js`, registered
as `Z2UI5_CL_MY_APP`, so `?app_start=` is the same on both sides. The module
starts where the ABAP statement starts and breaks where the ABAP breaks: a
view chain keeps one call per line, `VALUE #( )` one row per line, comments
come along and texts are never touched. A directory translates every class in
it.

| option | |
|---|---|
| `--out <dir>` | where the modules go, `srv/apps` by default |
| `--lib <dir>` | where other classes a class names are read from - `zcl_other=>ty_s_row` (repeatable; the inputs' directories by default) |
| `--origin <text>` | writes `// @origin <text> <input path>` into each module |
| `--esm`, `--cjs` | the module format; by default what the `package.json` nearest to `--out` declares |
| `--check` | writes nothing and exits 1 when a module is missing or would change - for CI |

It knows the part of ABAP an abap2UI5 app is written in - attributes and
`TYPES`, `VALUE #( )`, `COND`/`SWITCH`, string templates, `IF`/`CASE`/`DO`,
the client's and the view builder's calls - and **refuses everything else**
with file, row and column (`refused: z2ui5_cl_x.clas.abap:41:7 - LOOP AT ...
ASSIGNING / REFERENCE INTO writes through the row - not supported yet`)
rather than guess. What it writes where JavaScript differs from ABAP:

- `_bind( s_order-customer )` is `_bind("s_order-customer")`; a `_bind( )` of
  anything but an attribute or its component is refused. `window_bind_tab( )`
  takes the table by its name the same way, and its `total` by name where
  it is an attribute.
- `nav_app_call( NEW zcl_other( ) )` is `nav_app_call("ZCL_OTHER")`.
- `abap_bool` is a boolean; where ABAP turns it into a string - a string
  template, `CONV string( )`, a `t_arg` row - it is `"X"` or `""`, as ABAP
  prints it.
- `TYPE p`, `n`, `d`, `t` fields are `t.packed( )`, `t.numc( )`, `t.date( )`,
  `t.time( )`; a structure `TYPES` is a module constant, and `INCLUDE TYPE` of
  it that constant, spread.
- A local ABAP scopes to the method and JavaScript would scope to a block -
  declared in a `WHEN`, or used after the `IF`/`LOOP` that declares it - is
  declared on top of the method, starting with the value ABAP gives it.
- `CONV string( )` of a number is `String( )`, without ABAP's trailing sign
  position (`"0 "`).

In code:

```js
const { abap2js, Abap2jsError } = require("@cap2ui5/abap2js");
```

`abap2js(source, { file, lib, origin, format })` answers
`{ name, code }` and throws an `Abap2jsError` with `file`, `row` and `col`.
How far "line for line" goes was measured on abap2UI5's samples: each
translated sample served beside its original, transpiled, in one cap2UI5
server, and every roundtrip compared - view, model and actions.


## License

MIT
