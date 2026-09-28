# Changelog

All notable changes to `cap2ui5` are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the version
starts with 0, a minor release may break the API.

## [Unreleased]

### Added

- **`npx cap2ui5 abap2js`: an abap2UI5 app class, translated into a cap2UI5
  app, line for line.** `abap2js(source, options)` in code. The client and
  the view builder being abap2UI5's own is what makes a translation that keeps
  every line possible; what the translation does not know - a field-symbol,
  `SELECT`, a `sy-` field - it refuses with file, row and column instead of
  guessing. Measured on abap2UI5's samples: the 69 its first tier covers
  behave as their transpiled ABAP originals on every roundtrip compared (view,
  model, actions). Its parser, `@abaplint/core`, is a dependency now and is
  loaded only when a translation runs.
- `t.numc(n)`, `t.date()`, `t.time()` - ABAP's N, D and T as fields, read and
  written as strings.

### Changed

- `scripts/assemble-runtime.sh` also copies the runtime's `downport/` - the
  ABAP its output was transpiled from, where abap2js reads the client's types.

## [0.2.0] - 2026-09-28

The client an app's `main( )` receives is abap2UI5's `z2ui5_if_client` by its
own names, and the view builder is `z2ui5_cl_ui5_view_builder`, called as ABAP
calls it - an ABAP app ports line by line. The plugin also follows the
conventions of the plugins at
[cap.cloud.sap/docs/plugins](https://cap.cloud.sap/docs/plugins/) wherever
0.1.0 deviated from them.

### Changed

- **The client an app's `main( )` receives is abap2UI5's `z2ui5_if_client`,
  by its own names.** `client->check_app_prev_stack( )` is
  `client.check_app_prev_stack()`: every method of the interface under its
  name, a method's preferred parameter as its one positional argument, the
  parameters by name as one object with the ABAP names -
  `client._event({ val: "GO", t_arg: ["x"] })` - and the constants as
  `client.cs_event.set_title`. So an ABAP app ports line by line, and
  abap2UI5's documentation of a method is the documentation of the JavaScript
  one. The names of 0.1.0 throw an error naming the method that replaces each:

  | 0.1.0 | now |
  |---|---|
  | `c.isFirstRun`, `c.isDisplay`, `c.canGoBack` | `client.check_on_init()`, `client.check_on_navigated()`, `client.check_app_prev_stack()` |
  | `c.eventName`, `c.eventArg(i)`, `c.prevApp` | `client.get_event()` or `client.check_on_event(name)`, `client.get_event_arg(i)`, `client.get_app_prev()` |
  | `c.bind(field)` | `client._bind(field)` |
  | `c.event(name, args)` | `client._event({ val: name, t_arg: args })` - one positional argument is `val` alone |
  | `c.view(xml)` | `client.view_display(xml)` |
  | `c.popup(xml)`, `c.popupClose()` | `client.popup_display(xml)`, `client.popup_destroy()` |
  | `c.nest(into, xml, { insert, clear })`, `c.nestClose()` | `client.nest_view_display({ val, id, method_insert, method_destroy })`, `client.nest_view_destroy()` |
  | `c.messageBox(text)`, `c.messageToast(text)` | `client.message_box_display(text)`, `client.message_toast_display(text)` |
  | `c.navTo(app)`, `c.navBack({ event, data })` | `client.nav_app_call(app)`, `client.nav_app_leave({ event, r_data })` |
- `nest_view_display( )` takes its parameters as the ABAP method does:
  `method_insert` is not optional, and without `method_destroy` nothing is
  cleared first. `c.nest( )` defaulted both.
- **The configuration moved to `cds.requires.cap2ui5`, and `requires` is now
  `roles`.** That is where SAP's own plugins keep their settings.
  `cds.cap2ui5` is still read and logs a deprecation warning.
- An authenticated user without the route's role gets **403** in CAP's error
  format. 0.1.0 answered 401 with a new login challenge. A list of roles now
  lets in anybody with one of them, as with `@requires`; `any` lets everybody
  in.
- Logging goes through `cds.log('cap2ui5')`. In production that means one
  JSON record per line, with the request's correlation id.
- The apps load in CAP's `served` phase, after the model, and the server
  listens only once they have loaded. A runtime or app module that fails to
  load fails the start.
- The largest roundtrip body follows `cds.server.body_parser.limit`.
  `cds.requires.cap2ui5.body_parser.limit` overrides it; the default is
  `10mb`, as before. A larger body gets 413 in CAP's error format.
- Requires Node.js 22 or later (`engines`), as the runtime and
  `@sap/cds` 10 already did.
- `express` is declared with CAP's own range, `^4.22.1 || ^5`.
- The runtime resolves as the plugin's own dependency, at the pinned version.
  Use npm `overrides` to load another version.
- `client.nav_app_leave({ r_data })` hands the data over typed - a
  structure, a table, a scalar - instead of as a JSON string. An ABAP caller
  can `ASSIGN` it; a JavaScript caller reads it as `client.get().r_event_data`,
  object keys lowercase, as ABAP names components.

### Added

- **`z2ui5_cl_ui5_view_builder`**: abap2UI5's view builder for JavaScript
  apps, under its own name and with its methods called as the client's are -
  `.ele({ n: "View", ns: "mvc" })`, `.a({ n: "title", v: "…" })`,
  `.tag("Input")`, `client.view_display(view.stringify())`. The chain is
  rendered by the upstream class in the runtime, so its XML and escaping are
  those of an ABAP app. `view_display( )`, `popup_display( )`,
  `popover_display( )` and the nested views take a builder or its
  `stringify( )` as well as XML text. Also exported as `ViewBuilder`.
- `z2ui5_if_client`: the interface's constants, as an ABAP app reads them -
  `z2ui5_if_client.cs_event.set_title`.
- `cds.requires.cap2ui5: false` switches the plugin off: no route, and no
  table in the model.
- The client covers `z2ui5_if_client` - every method of it, which
  `nav.test.mjs` holds it to; measured against the 129 apps of abap2UI5's
  samples, 0.1.0 covered what 39 of them use:
  - handlers: `_event_nav_app_leave( )` (a Page's back button with no branch
    in `main( )`), `follow_up_action( )` in both of its forms - in a view
    attribute a front-end action that runs in the browser, called on its own
    one that runs when the answer lands - and `_event( )` with `t_arg`, `arg`
    and `s_ctrl`, `ty_s_event_control`'s options by component name. A
    `cs_event` or `cs_view` value the runtime does not have is refused with
    the list.
  - `popover_display( )` / `popover_destroy( )`, `nest2_view_display( )` /
    `nest2_view_destroy( )`, `view_destroy( )`.
  - `message_box_display( )` and `message_toast_display( )` with their
    parameters. A message box's text may be data - an object, an array - laid
    out as for an ABAP structure or table.
  - `_bind( )` with `path`, `tab` and `tab_index` for one cell of a table,
    `omit_initial`, `omit_initial_paths`, `json` and `switch_default_model`,
    and a component of a structure by its ABAP name, `"s_order-customer"`.
  - `get( )` as plain values, `app_state_get_href( )`, and `get_app( id )`,
    whose answer takes field writes and goes to `nav_app_leave( )` - as
    abap2UI5's sample 025 uses it.
  - `nav_app_call( app, fields )` presets a defineApp app's fields before it
    runs; `hash_set( )`, `hash_replace( )`, `app_state_set_active( )`.
  - The interface's obsolete methods behave as there: the `*_model_update( )`
    do nothing, `_bind_edit( )` is `_bind( )` and `_event_client( )` the wired
    `follow_up_action( )`. `set_session_stateful( )` is not supported and
    throws.
- A helper method reaches the client as in an ABAP app: `this.client = client`
  in `main( )`, without declaring it as a field.
- TypeScript declarations (`index.d.ts`).
- `cds add cap2ui5` creates a first app in `srv/apps/`.
- In development, CAP's start page lists the apps under "Web Applications".
- Tested on `@sap/cds` 9 and 10, and on Node.js 22 and 24.

### Fixed

- An app module that reads the model while it loads, such as
  `cds.entities(...)` at its top, used to fail to load.
- A method that `main( )` calls reads the app's fields as plain values, as
  `main( )` does. It used to read the framework's ABAP boxes, and a write in
  it replaced the field's box, so the next render could not bind the field.
- Rows in a field initializer are the field's initial value: `rows = [{ … }]`,
  a table inside a structure, a table inside `t.struct({ … })`. They used to
  be dropped - the table was typed from its first row and then built empty.
- Assigning an object to a structure field replaces the structure:
  `this.s_result = {}` clears it, as `s_result = VALUE #( )` does, and a
  component the object leaves out is initial afterwards. The components it
  left out used to keep their old values.

## [0.1.0] - 2026-09-27

The first release: abap2UI5 as a CAP plugin.
- It hosts `@abap2ui5/node-runtime` 1.145.0.
- The drafts live in the CDS entity `cap2ui5.Drafts`.
- Apps are plain JavaScript classes (`defineApp`).
- The user exit is available as `defineExit`.

[Unreleased]: https://github.com/cap2UI5/cap2UI5/compare/v0.2.0...HEAD
[0.2.0]: https://www.npmjs.com/package/cap2ui5/v/0.2.0
[0.1.0]: https://www.npmjs.com/package/cap2ui5/v/0.1.0
