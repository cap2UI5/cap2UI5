# Changelog

All notable changes to `cap2ui5` are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the version
starts with 0, a minor release may break the API.

## [Unreleased]

The plugin now follows the conventions of the plugins at
[cap.cloud.sap/docs/plugins](https://cap.cloud.sap/docs/plugins/) wherever
0.1.0 deviated from them.

### Changed

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
- `c.navBack({ data })` hands the data over typed - a structure, a table, a
  scalar - instead of as a JSON string. An ABAP caller can `ASSIGN` it; a
  JavaScript caller reads it as `c.eventData`, object keys lowercase, as ABAP
  names components.

### Added

- **`ViewBuilder`**: abap2UI5's `z2ui5_cl_ui5_view_builder` for JavaScript
  apps, with the same verbs (`ele`, `tag`, `a`, `end`). The chain is rendered
  by the upstream class in the runtime, so its XML and escaping are those of
  an ABAP app. `c.view`, `c.popup` and `c.nest` take a builder as well as XML
  text.
- `cds.requires.cap2ui5: false` switches the plugin off: no route, and no
  table in the model.
- The facade covers what apps use of `z2ui5_if_client` - measured against
  the 129 apps of abap2UI5's samples, where it covered 39 before. Each member
  maps to one method of the interface:
  - handlers: `c.eventNavBack()` (`_event_nav_app_leave( )`, a Page's back
    button with no branch in `main( )`), `c.eventFollowUpAction(action, args,
    { view })` (a front-end action wired into a control, no roundtrip), and
    `c.event(name, args, control)` with the options of `ty_s_event_control`:
    `preventDefault`, `preventDefaultExpr`, `argLiteral`, `queueLast`, `noBusy`.
  - `c.followUpAction(action, args, { view })`: the front-end actions of
    `cs_event` by name - `set_focus`, `open_new_tab`, `control_by_id`, … A name
    the runtime does not have is refused with the list.
  - `c.popover(xml, byId)` / `c.popoverClose()`, `c.nest2(…)` /
    `c.nest2Close()`, `c.viewClose()`.
  - `c.messageBox(text, options)` and `c.messageToast(text, options)` take the
    methods' options. A message box's text may be data - an object, an array -
    laid out as for an ABAP structure or table.
  - `c.bind(field, options)`: `path` for a bare path, `row` and `column` for
    one cell of a table, `omitInitial`, `omitInitialPaths`, `json` - and a
    dotted name for a component of a structure, `c.bind("order.customer")`,
    as `_bind( s_order-customer )` binds one.
  - `c.get()` (`client->get( )` as plain values), `c.eventData` (what a
    returning app handed over), `c.appStateHref`.
  - `c.navTo(app, fields)` presets a defineApp app's fields before it runs;
    `c.hashSet(hash)`, `c.hashReplace(hash)`, `c.appStateSetActive()`.
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

## [0.1.0] - 2026-09-27

The first release: abap2UI5 as a CAP plugin.
- It hosts `@abap2ui5/node-runtime` 1.145.0.
- The drafts live in the CDS entity `cap2ui5.Drafts`.
- Apps are plain JavaScript classes (`defineApp`).
- The user exit is available as `defineExit`.

[Unreleased]: https://github.com/cap2UI5/cap2UI5/compare/v0.1.0...HEAD
[0.1.0]: https://www.npmjs.com/package/cap2ui5/v/0.1.0
