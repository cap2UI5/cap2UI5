# @cap2ui5/cds-plugin

**[abap2UI5](https://github.com/abap2UI5/abap2UI5) as a CAP plugin.** Build
SAPUI5 apps inside your CAP backend, as plain JavaScript classes — no frontend
project, no `manifest.json`, no second build pipeline.

The framework underneath is not a port: it is abap2UI5's own ABAP, downported
and transpiled by `@abaplint/transpiler` over open-abap and published by
abap2UI5 as `@abap2ui5/node-runtime`. Its drafts are a CDS entity in your database, under your
authorization; your apps read your entities with `cds.ql`.

> **Pre-release.** The plugin is tested end to end (wire, restart, concurrency,
> browser) but the API can still move before 1.0.

## Install

```bash
npm i @cap2ui5/cds-plugin
cds add cap2ui5      # optional: a first app in srv/apps/hello.js
```

Up to 0.2.0 the package was called `cap2ui5`. A project that has it swaps
it - `npm rm cap2ui5 && npm add @cap2ui5/cds-plugin` - and its app modules
require `@cap2ui5/cds-plugin`; everything it configured keeps its name.

Requires Node.js 22 or later and `@sap/cds` 9 or 10 (CI tests both, on
Node 22 and 24).

That is the installation. On the next `cds serve` the roundtrip route
(`/rest/root/z2ui5`, `/sap/bc/z2ui5`) exists - its page carries the whole UI5
frontend - and
`cds deploy` creates `cap2ui5.Drafts` next to your own entities. Your
`server.js`, if you have one, is untouched.

## An app is one file

```js
// srv/apps/books.js
import cds from "@sap/cds";
import { defineApp, t } from "@cap2ui5/cds-plugin";

const { SELECT } = cds.ql;

defineApp("BOOKS", class {
  search = "";
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(client) {                  // async only because THIS app does I/O
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
        <Page title="Books">
          <SearchField value="${client._bind("search")}" search="${client._event("SEARCH")}"/>
          <Table items="${client._bind("books")}"> … <Text text="{TITLE}"/> … </Table>
        </Page></mvc:View>`);
    } else if (client.check_on_event("SEARCH")) {
      const { Books } = cds.entities("my.bookshop");
      this.books = await SELECT.from(Books).where`title like ${"%" + this.search + "%"}`;
      client.message_toast_display(`${this.books.length} found`);
    }
  }
});
```

`cds watch` prints the address of every app of the project, one line for
each package that brings apps (see [Apps from a package](#apps-from-a-package)),
and the user to log in as:

```
[cap2ui5] - BOOKS             http://localhost:4004/sap/bc/z2ui5?app_start=BOOKS
[cap2ui5] - @cap2ui5/samples  71 apps - listed on CAP's start page, http://localhost:4004/
[cap2ui5] - development login: alice (empty password)
```

Only in development; a production profile prints neither. CAP's start page
at `/` lists the same addresses under "Web Applications".

A project from `cds init` + `cds add nodejs` is an ES module project, hence
`import`. In a CommonJS project, or in a `.cjs` file,
`require("@cap2ui5/cds-plugin")` returns the same names.

## The client is `z2ui5_if_client`, by its own names

`main( client )` receives what an ABAP app's `z2ui5_if_app~main( client )`
receives, spelled the JavaScript way: `client->check_app_prev_stack( )` is
`client.check_app_prev_stack()`. A method's preferred parameter is its one
positional argument, and parameters by name are one object with the ABAP
names. The constants are there too. So an ABAP app ports line by line, and
[abap2UI5's documentation](https://abap2ui5.github.io/docs/) of a method is
the documentation of the JavaScript one.

| ABAP | JavaScript |
|---|---|
| `client->check_on_navigated( )` | `client.check_on_navigated()` |
| ``client->check_on_event( `GO` )`` | `client.check_on_event("GO")` |
| `client->get_event_arg( 1 )` | `client.get_event_arg(1)` |
| `client->_bind( name )`, `_bind( s_order-customer )` | `client._bind("name")`, `client._bind("s_order-customer")` |
| `client->_bind( val = t_tab path = abap_true )` | `client._bind({ val: "t_tab", path: true })` |
| ``client->_event( val = `GO` t_arg = VALUE #( ( `x` ) ) )`` | `client._event({ val: "GO", t_arg: ["x"] })` |
| `client->follow_up_action( val = z2ui5_if_client=>cs_event-set_title t_arg = … )` | `client.follow_up_action({ val: z2ui5_if_client.cs_event.set_title, t_arg: [ … ] })` |
| `client->view_display( view->stringify( ) )` | `client.view_display(view.stringify())` |
| ``client->message_box_display( text = … type = `error` )`` | `client.message_box_display({ text: …, type: "error" })` |
| `client->nav_app_call( NEW zcl_other( ) )` | `client.nav_app_call("ZCL_OTHER")` |
| `client->nav_app_leave( event = … r_data = … )` | `client.nav_app_leave({ event, r_data })` |
| `client->get( )-r_event_data` | `client.get().r_event_data` |

Every method of the interface is there under its name - `nav.test.mjs` holds
the client to the interface, so none is missing and none is invented. The
constants are read from the runtime, and so is which of them there are:
abap2UI5's page transitions - `cs_transition`, and `view_display( )`'s
`transition` and `transition_back` - come with the abap2UI5 releases after
1.145.0, and on the runtime this version pins (1.145.0) a call that sets one
is refused, naming the runtime, rather than dropped unseen:

```js
client.view_display({ val: view.stringify(), transition: client.cs_transition.slide });
```

What is JavaScript's own, and why:

- **A field is bound by its name**, `client._bind("name")`: ABAP's `_bind( )`
  finds the attribute by reference, which a JavaScript value cannot carry. A
  cell of a table is `{ val: column, tab: "t_tab", tab_index: 2 }`.
- **Some answers come after `main( )`.** The framework's calls are
  asynchronous here, so `main( )` stays synchronous by resolving what it can
  before it runs and the rest after it: what `_event( )`, a `_bind( )` with
  options, and `follow_up_action( )` in a view attribute return is a
  placeholder that becomes the wire after `main( )` - embed it as it is. An
  `async main` works as well, for an app that does I/O.
- **`client.get_app( id )`** answers the app behind a draft id as a handle
  whose fields can be written - `app.backend_event = "…"`, then
  `client.nav_app_leave(app)` - but not read: it is loaded after `main( )`.
  Reading the other app is `client.get_app_prev( )`, as plain values.
- **`client.nav_app_call( app, fields )`** presets the called app's fields,
  what an ABAP app does between `NEW` and `nav_app_call( )`.
- `client.set_session_stateful( )` is not supported and throws; the
  interface's obsolete `*_model_update( )` do nothing, as they do in ABAP.
  `client.raw` is the transpiled `z2ui5_if_client` itself, asynchronous.

**`check_on_navigated( )`, not `check_on_init( )`, is the render branch.**
`check_on_init( )` is the first roundtrip of *this app instance*;
`check_on_navigated( )` is also true every time the app gets the screen back
— a called app leaving, a value help closing, a bookmark restored.

**State:** strings, numbers, booleans, `t.packed(l, d)`, `t.char(n)`, `t.numc(n)`, `t.date()`, `t.time()`, a plain
object (a structure), `t.table({ …one row… })` — and those nest, up to 8
levels. Component names are UPPERCASE in the model. The whole instance is
persisted to `cap2ui5.Drafts` after every roundtrip and rebuilt before the
next, so state survives a restart. As in ABAP, only what the app **binds** is
part of the model: a field goes to the browser, and the browser can write it,
once `main( )` has bound it with `client._bind( )` (or `_bind_edit( )`,
`_bind_path( )`, a component or a cell of it) - and stays bound for the rest
of the session. A field no view binds - a price, a role flag, a counter -
stays on the server, in the draft; a MODEL the browser sends for it is
ignored. A helper that needs the client gets it as an ABAP app does,
`this.client = client` in `main( )`, without declaring it as a field.

A field is an ABAP attribute, so **its name is lower case** - `is_admin`, not
`isAdmin`, which `defineApp( )` refuses: ABAP names are not case-sensitive and
the runtime reads the attribute by its lower-case name. A structure's
components and the app's methods may be camelCase. `main( )` and its helpers
run on a proxy that reads the fields as plain values, which a `#private`
member does not reach - using one is refused with a message; a plain field
is private enough, as it is not sent to the browser unless it is bound.
`t.bool( )` reads as a boolean, `t.char(n)` without its padding and
`t.float( )` as a number, as the plain `true`, `""` and `0.5` do.

**Types:** the package ships TypeScript declarations (`index.d.ts`). In a
JavaScript app, annotate the client for completion and checked field names:
`/** @param {import("@cap2ui5/cds-plugin").Client<{ search: string }>} client */`.

## Building a view with `z2ui5_cl_ui5_view_builder`

A view is built the way an ABAP app builds one, with abap2UI5's own view
builder, under its own name and called as the client is:

```js
const { defineApp, z2ui5_cl_ui5_view_builder } = require("@cap2ui5/cds-plugin");

defineApp("HELLO", class {
  name = "";

  main(client) {

    if (client.check_on_navigated()) {

      const view = z2ui5_cl_ui5_view_builder.factory()
          .ele({ n: "View", ns: "mvc" })
              .a({ n: "xmlns", v: "sap.m" })
              .a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" })

              .ele("Shell")
                  .ele("Page")
                      .a({ n: "title", v: "Hello" })

                      .tag("Input")
                          .a({ n: "value", v: client._bind("name") })
                      .tag("Text")
                          .a({ n: "text", t: "{shown as typed}" })
                      .tag("Button")
                          .a({ n: "text", v: "Go" })
                          .a({ n: "press", v: client._event("GO") });

      client.view_display(view.stringify());

    } else if (client.check_on_event("GO")) {

      client.message_box_display(`Hello ${this.name}`);

    }

  }
});
```

| | |
|---|---|
| `z2ui5_cl_ui5_view_builder.factory()` | an empty root; open the `mvc:View` and declare its `xmlns` yourself |
| `ele(n)`, `ele({ n, ns })` | add a child element and descend into it |
| `tag(n)`, `tag({ n, ns })` | add a child element and stay: the form for a leaf |
| `a({ n, v })`, `a({ n, b })`, `a({ n, t })` | an attribute on the element the chain points at: the child just added, or the node itself while it has none. Exactly one of `v` (written as it is: bindings, events, constant text), `b` (a boolean, rendered `true`/`false`) and `t` (text rendered literally, so a `{` in user input is shown rather than read as a binding) |
| `end()` | ascend to the parent |
| `stringify()` | the XML - rendered after `main( )`, so hand it to `view_display( )` as it is; outside an app, `await` it |
| `z2ui5_cl_ui5_view_builder.escape_literal(val)` | the literal escaping of `t`, for one part of a value that also carries a binding |

The chain is recorded while `main( )` runs and rendered after it, by the
transpiled `z2ui5_cl_ui5_view_builder` the runtime carries. The XML, its
escaping and its refusals (an `end()` past the root, a duplicate attribute, an
invalid name) are therefore exactly those of the same chain in an ABAP app. A
refusal answers the roundtrip with the framework's error, naming the app.
`ViewBuilder` is the same class, for code that prefers a JavaScript name.

<!-- the section's anchor while it was titled `npx cap2ui5 abap2js`: the
published README of @cap2ui5/samples 0.1.0 links to it -->
<a id="an-abap-app-translated-npx-cap2ui5-abap2js"></a>

## An ABAP app, translated: `cap2ui5 abap2js`

Because the client and the view builder are abap2UI5's own, an abap2UI5 app
class translates into a cap2UI5 app line for line - and the package does it:

```bash
npm add -D @abaplint/core      # once: the ABAP parser it reads with
npx --no-install cap2ui5 abap2js src/z2ui5_cl_my_app.clas.abap --out srv/apps
```

The parser, `@abaplint/core`, is an optional peer dependency of the plugin:
8 MB that only translating needs, so a project that serves apps does not
install it. Without it the command, and `abap2js( )` in code, say how to add
it.

`--no-install` makes npx run the `cap2ui5` of the project's
`@cap2ui5/cds-plugin` or fail - never download one. Without it, `npx cap2ui5`
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
  anything but an attribute or its component is refused.
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

In code, `abap2js(source, { file, lib, origin, format })` answers
`{ name, code }` and throws an `Abap2jsError` with `file`, `row` and `col`.
How far "line for line" goes was measured on abap2UI5's samples: each
translated sample served beside its original, transpiled, in one cap2UI5
server, and every roundtrip compared - view, model and actions.

## Apps from a package

A package can bring apps with it: add it to the project, and its apps run
beside the project's own - as abap2UI5's samples run in the system they are
pulled into. `npm add @cap2ui5/samples` does exactly that with abap2UI5's
samples.

The package says where its app modules are, in its `package.json`, and names
the plugin as a peer dependency, so that its apps and the project's run on
the same one:

```json
"cap2ui5": { "apps": "srv/apps" },
"peerDependencies": { "@cap2ui5/cds-plugin": "^0.3.0" }
```

The range moves in lockstep with the plugin's minor version, and stays that
narrow on purpose: `^0.3.0` is 0.3.x only, and while the plugin is 0.x a
minor release may break the API an app is written against (the CHANGELOG
says so, and the release after 0.3.1 does: only bound fields are sent to
the browser, and a camelCase field is refused). A range like `>=0.3.0 <1` would let npm install
a plugin the package's apps have never run on, and they would break where
they are used instead of at `npm install`. So a package with apps publishes
a release for each plugin minor, with the range that names it; from 1.0 on,
`^1.0.0` is the range to use. A range the project's plugin does not satisfy
makes npm refuse the install or bring a second, nested copy of the plugin -
which the log names.

The plugin finds such a package the way CAP finds its plugins: among the
project's `dependencies`, and outside production (`NODE_ENV` other than
`production`) among its `devDependencies` too - so `npm add -D` brings a
package's apps to development only. Its directory is loaded like the
project's own apps directory, after it, and the log names every package it
loaded apps from. An app of a name the project has already stays the
project's, and the log says so. A directory outside the package, or one the
installed package does not have - a `files` entry forgotten - is skipped with
a warning.

## Configure

Under `cds.requires.cap2ui5` - in `package.json`, a `.cdsrc.json`, a profile or
`CDS_REQUIRES_CAP2UI5_*` environment variables, like any CAP setting:

```json
"cds": {
  "requires": {
    "cap2ui5": { "roles": ["admin"], "body_parser": { "limit": "20mb" } }
  }
}
```

| key | default | |
|---|---|---|
| `apps` | `srv/apps` | the directory scanned for app modules |
| `roles` | `["authenticated-user"]` | who may call: a role, or a list of roles any one of which lets the user in, as with CAP's `@requires`; `any` or `null` allows anonymous callers |
| `routes` | `/sap/bc/z2ui5`, `/rest/root/z2ui5` | where the roundtrip answers |
| `body_parser.limit` | CAP's `cds.server.body_parser.limit`, else `10mb` | the largest roundtrip body; a larger one gets 413 |
| `compression` | `true` | gzip for the page and the roundtrips, where the browser accepts it; `false` leaves compressing to a proxy in front |
| `accelerate` | `true` | calls the runtime's `accelerate( )` where it has one - the releases after 1.145.0; `false` runs the runtime's own code |

`"cap2ui5": false` switches the plugin off: no route, and no `cap2ui5.Drafts`
table in the model.

The route runs behind CAP's own middlewares and answers like a CAP service.
Whatever `cds.requires.auth` is configured to identifies the user. A caller who
is not logged in gets 401 with that strategy's login challenge. A user who
lacks the role gets 403.

0.1.0 read its settings from a top-level `cds.cap2ui5`, with `requires` for the
roles. Those settings still apply, and the log names the new place.

Everything the *framework* decides about a response — the
Content-Security-Policy, the security headers, the UI5 bootstrap URL, the
theme, the draft expiry, the CSRF gate — comes from the user exit,
`defineExit({ onPage, onRoundtrip })`, one per project.

## In production

- **Who may call:** set `roles` to the roles your identity provider grants
  (XSUAA scopes, IAS groups). The default, `authenticated-user`, is CAP's own
  default for production.
- **Behind the approuter:** route the paths in `routes` to the CAP backend
  with the approuter's authentication, like the service paths. The approuter
  protects routes with an X-CSRF-Token by default (`csrfProtection`).
  `@abap2ui5/node-runtime` 1.145.0, the runtime this version pins, does not
  fetch that token yet, so set `"csrfProtection": false` on these routes. The
  framework runs its own CSRF check: it compares `Origin`/`Referer` with the
  host, and the user exit configures it. The token handshake comes with the
  abap2UI5 release after 1.145.0
  ([abap2UI5#2802](https://github.com/abap2UI5/abap2UI5/pull/2802)).
- **Body size:** a roundtrip carries the app's whole model.
  `cds.server.body_parser.limit`, CAP's global limit, applies here too;
  `body_parser.limit` above overrides it for this route.
- **Compression:** the route gzips what it answers where the browser accepts
  gzip - the page and every roundtrip of 1 kB or more - as the framework asks
  the ICF to on an ABAP system. Behind an approuter or an ingress that
  compresses too, nothing is compressed twice: it finds `Content-Encoding`
  set and passes the body on. `"compression": false` leaves the work to it
  and saves the CPU here.
- **Logs:** the plugin logs through `cds.log('cap2ui5')`, so production gets
  JSON records with the request's correlation id. Set the level with
  `cds.log.levels.cap2ui5`.
- **Database:** `cap2ui5.Drafts` is part of the model, so `cds deploy` and
  `cds build --production` create it like any other table (`.hdbtable` for
  SAP HANA). A draft is deleted after the user exit's
  `draft_exp_time_in_hours`, 4 hours unless the exit changes it.
- **Multitenancy (MTX):** not tested yet. The draft store reads and writes
  through `cds.run`, which follows `cds.context`. The drafts should therefore
  land in each tenant's database like any other row, but no test proves it.

## Documentation

**[cap2ui5.github.io/docs](https://cap2ui5.github.io/docs/)** — the guide, the
API reference, the examples and the architecture, including why the exit is
registered rather than discovered and where UI5 itself comes from.

## Support

Bugs and questions: [github.com/cap2UI5/cap2UI5/issues](https://github.com/cap2UI5/cap2UI5/issues).
What changed between versions: [CHANGELOG.md](CHANGELOG.md).

## License

MIT
