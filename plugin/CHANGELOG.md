# Changelog

All notable changes to `@cap2ui5/cds-plugin` - `cap2ui5` up to 0.2.0 - are
recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the version
starts with 0, a minor release may break the API.

## [Unreleased]

### Security

- The documentation writes the command as `npx --no-install cap2ui5 abap2js`,
  which runs the project's own `cap2ui5` or fails. The unscoped package name
  `cap2ui5` has not been this package's since 0.3.0, and a plain
  `npx cap2ui5` where the plugin is not installed - outside the project,
  before `npm add` - downloads and runs whatever npm has under it.
- **Only a field the app binds is part of the model.** Every field used to
  be bound before `main( )` - to learn its path - so every field was sent to
  the browser, and the browser could overwrite every field: a MODEL with
  `PRICE: 0, IS_ADMIN: true` for fields no view shows was taken as if a
  control had sent it. Now a field is sent and written back once the app
  binds it (`_bind( )`, `_bind_edit( )`, `_bind_path( )`, a component or a
  cell), and stays bound, as the framework does for an ABAP app. Every field
  is still kept in the draft. An app that read an unbound field in the
  browser - or a test that read it off the wire - binds it now.

### Changed

- A camelCase field - `isAdmin = false` - is refused by `defineApp( )`,
  naming the snake_case it wants (`is_admin`). The runtime reads an attribute
  by its lower-case name, so such a field made every roundtrip of the app
  fail with a 500 BINDING_ERROR, bound or not. Components of a structure may
  still be camelCase.
- A `#private` member used in `main( )` or a method it calls is refused with
  what to write instead. It threw V8's bare "Cannot read private member"
  TypeError, and a `#field` was never kept in the draft.
- `defineApp( )` refuses a name the runtime already has a class of - the
  framework's, one of its apps, the plugin's own. `defineApp("Z2UI5_CL_UTIL")`
  replaced the framework's utility class and broke every roundtrip. A name
  `defineApp( )` registered before may still be registered again.

### Fixed

- `t.float( )` and a fractional field (`ratio = 0.5`) read as numbers. They
  read as open-abap's external format, `"5,0000000000000000E-01"`, so
  `ratio * 2` was `NaN`.
- `t.char(n)` reads without its padding (`"ab"`, not `"ab   "`).
- `t.bool( )` reads as a boolean and takes one; it read `" "` - truthy - or
  `"X"`, and `this.flag = true` threw `value.get is not a function`.
- A field cleared to its initial value stays cleared: `name = "Alice"` set to
  `""`, `count = 5` set to `0`, `flag = true` set to `false` came back as the
  initializer on the next roundtrip. The initializer is applied once, when the
  app is created, not on every draft restore. A table row that leaves a
  column out has it initial, not the value the declaring row gave it.
- `this.constructor`, `` `${this}` ``, `this.hasOwnProperty( )` in `main( )`
  work - they threw `box.get is not a function` - and `client._bind("toString")`
  is refused as no field instead of answering the function's source.
- A placeholder from an earlier roundtrip - `_event( )` kept in a field and
  embedded later - is refused. It went to the browser as
  `press="z2ui5evt_…"`, a button that did nothing.
- `defineExit( )`: a table of `cfg` changed in place -
  `cfg.t_security_header.push( … )`, an entry's `v` changed - reaches the
  framework. The hook got a shallow copy, so the change also changed what it
  was compared against, and it was dropped without a word.

## [0.3.1] - 2026-09-29

`cds add cap2ui5` writes a first app that starts in the ES module project
`cds init --nodejs` creates. Still `^0.3.0`, so `@cap2ui5/samples` 0.1.0 keeps
installing beside it.

### Added

- `client.view_display({ val, transition, transition_back })` and
  `cs_transition` - abap2UI5's page transitions - where the runtime has them:
  the abap2UI5 releases after 1.145.0. The runtime this version pins, 1.145.0,
  has neither.

### Changed

- The constant groups are read from the runtime, which groups there are
  included: a group upstream adds is on the client and on `z2ui5_if_client`
  without a change here. A fixed list of four was what failed the suite
  against abap2UI5's main when upstream added `cs_transition`.
- A parameter the runtime in use does not declare is refused, naming the
  runtime, instead of being dropped unseen by the transpiled method.

### Fixed

- `cds add cap2ui5` writes its first app in the project's module format: an
  ES module (`import`) where the package.json nearest to the apps directory
  says `"type": "module"` - what `cds init --nodejs` writes - and CommonJS
  otherwise, as `npx cap2ui5 abap2js` already decided it. It always wrote
  `require( )`, which fails the start of an ES module project.

## [0.3.0] - 2026-09-29

The plugin is `@cap2ui5/cds-plugin` now, published by the npm organisation
`cap2ui5` next to `@cap2ui5/samples`: abap2UI5's samples as a package a
project adds, which needs this version. It is the first version on npm since
0.1.0 - 0.2.0 was tagged, but its release had no Trusted Publisher to publish
with and never reached the registry, so its changes come with this one.

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
- **Apps from a package.** A dependency whose `package.json` says
  `"cap2ui5": { "apps": "srv/apps" }` brings its apps: they are served beside
  the project's own, and the package is found as CAP finds its plugins -
  `dependencies`, and `devDependencies` outside production. An app of a name
  the project has already stays the project's, with a warning; a directory
  outside the package, or missing from it, is skipped with one.

### Changed

- **The package is `@cap2ui5/cds-plugin`.** A project installs it with
  `npm add @cap2ui5/cds-plugin`, and an app module requires or imports
  `@cap2ui5/cds-plugin`, which is also what abap2js writes. What a project
  configures keeps its name: `cds.requires.cap2ui5`, `cds add cap2ui5`, the
  command `npx cap2ui5 abap2js`, the table `cap2ui5.Drafts` and the log
  `cap2ui5`. The unscoped package `cap2ui5` is withdrawn from npm.
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

[Unreleased]: https://github.com/cap2UI5/cap2UI5/compare/v0.3.1...HEAD
[0.3.1]: https://www.npmjs.com/package/@cap2ui5/cds-plugin/v/0.3.1
[0.3.0]: https://www.npmjs.com/package/@cap2ui5/cds-plugin/v/0.3.0
[0.2.0]: https://github.com/cap2UI5/cap2UI5/tree/v0.2.0
[0.1.0]: https://github.com/cap2UI5/cap2UI5/pull/77
