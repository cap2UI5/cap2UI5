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

**What a read is checked against.** The app above reads the entity straight
from the database, as a service's own handler does: no service's `@requires`
or `@restrict` is asked, and whoever may open the app - the `roles` under
[Configure](#configure) - reads the table. Where a service guards the data,
read through the service, and CAP checks its authorization for the user of
the roundtrip, as for an OData call:

```js
const srv = await cds.connect.to("AdminService");          // @requires: 'admin'
try {
  this.books = await srv.run(SELECT.from(srv.entities.Books));
} catch (e) {
  if (Number(e.code ?? e.status) !== 403) throw e;
  client.message_box_display("You are not allowed to read the books");
}
```

Both are measured in `examples/bookshop/test/service.test.mjs`.

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
| `client->_bind( mr_tab->* )` (`mr_tab TYPE REF TO data`) | `client._bind("mr_tab->*")` (`mr_tab = t.ref(…)`) |
| `client->_bind( val = t_tab path = abap_true )` | `client._bind({ val: "t_tab", path: true })` |
| ``client->window_bind_tab( val = t_tab total = mv_total event = `ROWS` window = 50 )`` | `client.window_bind_tab({ val: "t_tab", total: "mv_total", event: "ROWS", window: 50 })` |
| ``client->nav_app_call( app = NEW zcl_other( ) tag = `detail` )`` | `client.nav_app_call({ app: "ZCL_OTHER", tag: "detail" })` |
| ``client->timer_set( event = `POLL` delay_ms = 5000 )`` | `client.timer_set({ event: "POLL", delay_ms: 5000 })` |
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
`transition` and `transition_back` - come with abap2UI5 1.146.0, so the
runtime this version pins (1.151.0) has them; on an older runtime (1.145.0,
by an `overrides`) a call that sets one is refused, naming the runtime,
rather than dropped unseen:

```js
client.view_display({ val: view.stringify(), transition: client.cs_transition.slide });
```

The same holds for a method: the client has exactly the methods the
interface of the hosted runtime has. abap2UI5 1.151.0, which this version
pins, added `check_on_nav_back( )`, `get_nav_tag( )`, `check_nav_pending( )`,
`get_start_param( )`, `timer_set( )` and `timer_stop( )`, and took
`window_get_row( )`, `_bind_edit( )` and the obsolete `*_model_update( )`
away - so the client has the six and lacks the others, as an ABAP app on
1.151.0 does.

**The windowed table** is the app's since 1.151.0: `window_bind_tab( )` binds
a LARGE result to a list control that the app loads a window at a time, the
way an OData service answers `$skip`, `$top`, `$orderby` and `$filter`. The
field holds the rows loaded so far, in the order the browser shows them, and
`total` says how many there are in all. When the list needs more rows, or
its columns are sorted or filtered, `main( )` runs with the event the bind
named and the request in `get( ).r_event_data`. The framework neither sorts
nor filters nor counts:

```js
rows = t.table({ id: 0, name: "", price: t.packed(9, 2) });   // the rows loaded so far
total = 0;                                                    // how many there are in all

async main(client) {
  if (client.check_on_event("ROWS")) {
    // { path, reason, skip, top, t_sort, t_filter } - reason: MORE, SORT or FILTER
    const { reason, skip, top, t_sort } = client.get().r_event_data;
    const more = await SELECT.from(Books).orderBy(…t_sort).limit(top, skip);
    this.rows = reason === client.cs_window_reason.more ? [...this.rows, ...more] : more;
  } else if (client.check_on_event("PRESS")) {
    // the rows ARE what the browser shows: "/ROWS/5" is this.rows[5]
    const row = this.rows[Number(client.get_event_arg(1).split("/").pop())];
    …
  } else if (client.check_on_navigated()) {
    client.view_display(`… <Table growing="true"
      items="${client.window_bind_tab({ val: "rows", total: "total", event: "ROWS", window: 50 })}"> …`);
  }
}
```

`t_sort` is `[{ path, descending }]` and `t_filter`
`[{ group, path, operator, value1, value2 }]`, as `ty_s_bind_tab_sort` and
`ty_s_bind_tab_filter` name their components; `path` is the column as the
model spells it, upper case. The conditions of one group are ORed, the
groups ANDed. `/__WINDOW/ROWS` in the model carries `TOTAL`, `COUNT` (the
rows loaded), `SIZE` and `EVENT`.

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
- **`window_bind_tab( )`'s `total` is a number, or the NAME of a number
  field.** ABAP passes the attribute, `total = mv_total`, and the framework
  reads it anew for every response - so an event that loads, sorts or
  filters only sets it and renders no view. A JavaScript value cannot carry
  that reference, so the field goes by its name, as for `_bind( )`; a number
  is the value of this render, as `total = lines( lt_all )` is in ABAP.
- **`client.get_start_param( name )`** answers the framework's own lookup -
  the URL query, the launchpad's startupParameters, the intent's query - for
  every name those three carry, asked before `main( )` runs.
- **`client.get_app( id )`** answers the app behind a draft id as a handle
  whose fields can be written - `app.backend_event = "…"`, then
  `client.nav_app_leave(app)` - but not read: it is loaded after `main( )`.
  Reading the other app is `client.get_app_prev( )`, as plain values.
- **`client.nav_app_call( app, fields )`** presets the called app's fields,
  what an ABAP app does between `NEW` and `nav_app_call( )`.
- `client.set_session_stateful( )` is not supported and throws.
  (A transpiled ABAP app can go stateful: its session is kept per CAP user,
  in the process - a restart or a second instance loses it.)
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
once `main( )` has bound it with `client._bind( )` (or `_bind_path( )`,
`window_bind_tab( )`, a component or a cell of it) - and stays bound for the rest
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
`t.float( )` as a number, as the plain `true`, `""` and `0.5` do. `t.date( )`
and `t.time( )` store and read `YYYYMMDD` and `HHMMSS`, as ABAP does, and
take a `cds.Date`'s `YYYY-MM-DD` and a `cds.Time`'s `HH:MM:SS` as well; the
model carries both as ISO, as the framework serializes a D and a T. `null` and
`undefined` clear a field, as `CLEAR` does; a value a field cannot take - a
text into a number, a string into a table, a JavaScript `Date` into a
`t.date( )` - is refused with the field's name.

**A field `TYPE REF TO data`** is `t.ref( … )` of the type it points to:
`mr_tab = t.ref(t.table({ id: 0, text: "" }))`, or `t.ref("start")` with an
initial value. The constructor creates the data, and inside `main( )` the
field reads and writes as that data - `mr_tab->*`. It is bound dereferenced,
as `_bind( mr_tab->* )` binds it: `client._bind("mr_tab->*")` answers
`{/MR_TAB/*}`, and `window_bind_tab( )` takes
`"mr_tab->*"` as `val`. The browser's edits come back at that node, and the
draft keeps the data behind the reference. A reference bound without
`->*`, and a component of the data behind one, are refused.

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

## Agents: the MCP endpoint

AI agents - Claude Code, any client that speaks the
[Model Context Protocol](https://modelcontextprotocol.io) over HTTP - can
operate the project's apps: read a screen as data, fill its fields, fire its
events. Through the app's own `main( )`, as the CAP user who calls, with that
user's drafts and roles; there is no second API and no technical user. It is
the same idea, the same four tools and the same answers as abap2UI5's
[MCP server](https://github.com/abap2UI5/mcp-server) (for the transpiled
backend in development) and abap2UI5's ABAP agent addon (inside an SAP
system).

**It is off** until the project switches it on:

```json
"cds": { "requires": { "cap2ui5": { "agent": true } } }
```

| key under `agent` | default | |
|---|---|---|
| `path` | `/rest/root/z2ui5/mcp` | where the endpoint answers |
| `apps` | none | apps the project opts in - names, or patterns with `*`; how a transpiled ABAP app opts in |
| `confirm` | none | events an agent hands to a human: `"EVENT"` for every app, `"APP:EVENT"` for one, `*` as a wildcard |
| `forbidden` | none | events an agent never fires, written the same way |
| `retention` | `90` | days a row of the audit log `cap2ui5.AgentLog` is kept; `0` or `false` keeps every row - see [Audit retention](#audit-retention) |

A key the endpoint does not know, or a value of the wrong type, is refused
at start - `"forbiden"` would otherwise leave the event open, and a
`"retention": "90d"` read as "forever" or as "now" would be a wrong guess
for an audit log either way. Any object switches the endpoint on, so
`CDS_REQUIRES_CAP2UI5_AGENT_RETENTION=30` alone does too.

**An app opts in** where it is defined, and classifies its events there:

```js
defineApp("ZCL_JS_BOOKS", class { /* ... */ }, {
  agent: { description: "Search the bookshop's books", events: { ADD: "confirm", "DELETE*": "forbidden" } },
});
```

`agent: true` opts in with every event allowed; `agent: false` keeps the app
out whatever `apps` says - for an app that administers something. An event is
`allowed`, `confirm` or `forbidden`; the app's word and the settings' are
both applied and the stricter wins, so a project can tighten what an app
allows but not loosen it. A setting `"APP:EVENT"` covers the app on the
screen and the app the session was started with, so a framework popup an app
calls (`z2ui5_cl_pop_to_confirm`) is covered by that app's rules.

**Connecting a client** - Claude Code, for one:

```sh
claude mcp add --transport http bookshop http://localhost:4004/rest/root/z2ui5/mcp \
  --header "Authorization: Basic $(printf '%s' 'alice:' | base64)"
```

In production the header is the token your identity provider issues (XSUAA,
IAS) - pass it as a header, CAP does not implement MCP's own authorization
discovery.

### The tools

| tool | input | answer |
|---|---|---|
| `app_list` | `filter?` | `{ count, apps: [{ app, source: "app" \| "config", description? }], hint }` |
| `app_start` | `app`, `values?`, `max_rows?` (0-200, default 20) | snapshot |
| `app_describe` | `session`, `max_rows?` | the snapshot of the last answer - no roundtrip |
| `app_act` | `session`, `values?`, `event?`, `args?`, `row?`, `max_rows?` | the next snapshot |

The answer is **agent snapshot v1**, specified in the MCP server's
[docs/agent-snapshot.md](https://github.com/abap2UI5/mcp-server/blob/main/docs/agent-snapshot.md):
`fields` (id, model path, label, kind, value, editable, choices), `actions`
(event, arguments, label, enabled, row scope), `tables` (columns, the first
rows, selection), `messages`, `texts`, `unsupported`, and `pending`. It is
not reimplemented here: the plugin carries the MCP server's own
`viewxml.mjs`, `snapshot.mjs` and `appclient.mjs`, vendored unchanged at a
recorded commit (`lib/agent/vendor/`, `npm run agent-vendor`), and adds one
key - an action an app or the settings classify `confirm` or `forbidden`
carries `"policy"`, as in the ABAP addon. `values` address a field by id,
model path or name, a table cell as `"<table>/<row>/<COLUMN>"`; `event` is an
event name or an action id; values without an event stay pending, as typing
does in the browser. Every refusal is a tool result with `isError` and a
sentence naming what is allowed, and a refused act sends nothing.

### Security model

- **Off by default**, and an app is reachable only when it opted in or the
  settings name it.
- **The real user, always.** The endpoint runs behind CAP's middlewares and
  the same `roles` guard as the roundtrip route: 401 with the auth
  strategy's challenge for anonymous callers, 403 for a user without the
  role. It admits authenticated users only, even where `roles` lets anybody
  into the UI. A tool call runs the route's own roundtrip handler in
  process, inside the MCP request, so the draft store binds every draft to
  that user, and the app's own checks see that user.
- **`confirm` and `forbidden` events are never fired by an agent.** A
  `confirm` refusal answers the link that hands the screen to a human:
  `<origin>/rest/root/z2ui5#/app/<APP>/<session>`. Opened in the browser by
  the same user, the framework restores the session's draft - the state the
  agent prepared - and the human checks it and presses the button. Anybody
  else gets a fresh app: the draft store serves a draft to its owner only.
  Values the agent left pending are not in the draft; the refusal lists them.
- **Sessions are owner-scoped.** Each user has a client of their own; a
  session id of another user's is "unknown", exactly as a missing one.
- **Audit:** every call writes a row to `cap2ui5.AgentLog` - time, user, the
  MCP client's User-Agent, tool, app, the session in and out, event,
  arguments, the outcome (`ok`, `refused`, `confirm`, `forbidden`, `error`)
  and the refusal. The *values* an agent entered are never stored, only which
  fields it filled. Like `cap2ui5.Drafts` the entity is in the model and in
  no service; to show it, expose it in a service of your own with a
  `@restrict` such as `where: 'owner = $user'`. Rows older than `retention`
  days are deleted - see below.
- **Browser-side abuse is refused:** a request whose `Origin` names another
  host gets 403, and only `Content-Type: application/json` is read (415), so
  a web page cannot drive the endpoint with a user's cookies.

### Sessions and restarts

A session is the app's draft - in `cap2ui5.Drafts`, owned by the user,
expiring with the draft expiry - plus what the client remembers of the
screen: the views in their slots, the pending edits, the last answer
`app_describe` reads. That memory is the process's (20 sessions per user),
and a restart loses it while the drafts survive. So a session the server no
longer knows is **restored from its draft**, the way the handover link
restores it for a human: the framework renders the app from the draft
(`check_on_navigated( )` is true). `app_describe` answers the restored screen,
under a new session id; `app_act` sends nothing and names the new id, since
the screen the agent chose its action on is not in front of it now. Edits
pending before the restart are lost, as a browser tab's are. Only a session
the audit log shows the same user's agent reached, which is the newest of
its line and whose draft has not expired, is restored.

### Audit retention

A row of `cap2ui5.AgentLog` is kept `retention` days - 90 unless the
setting says otherwise - and then deleted, the way the draft store expires
drafts: one `DELETE` of everything older than a cutoff, run on the way of an
ordinary request rather than by a timer of the plugin's own. The drafts are
swept on every app start; the log is swept by an agent call, **at most once
an hour per process and tenant**, so the endpoint pays for one `DELETE` an
hour. A sweep that fails is logged as a warning and tried again an hour
later; it never fails the agent's call.

`"retention": 0` (or `false`) keeps every row. A project that prefers a
scheduled job of its own sets that, so the endpoint leaves the log alone,
and runs the same `DELETE` from the job:

```js
const { purgeAgentLog } = require("@cap2ui5/cds-plugin");
const deleted = await purgeAgentLog({ days: 90 });   // without `days`: the setting's retention, else 90
```

It deletes every user's rows older than the cutoff and answers how many. It
runs in `cds.context`'s transaction where there is one - in a multitenant
application, call it per tenant inside `cds.tx({ tenant }, ...)` (the
endpoint's own sweep follows the caller's tenant).

A session is restored after a restart only from its audit rows, so a
retention shorter than the draft expiry (`draft_exp_time_in_hours`, 4 hours
unless the user exit changes it) would lose sessions whose drafts are still
there - which takes an expiry of weeks.

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
| `timeout` | `60000` | the milliseconds an app's async `main( )` may take. Roundtrips run one at a time per process, so a `main( )` that waits holds everybody else's; past the limit its roundtrip is given up with a 504, its draft is not written and the next one runs. `0` or `false` is no limit. A roundtrip that waited a second or more for its turn is logged as a warning |
| `agent` | off | the MCP endpoint for AI agents - `true` or `{ path, apps, confirm, forbidden, retention }`, see [Agents](#agents-the-mcp-endpoint) |

`"cap2ui5": false` switches the plugin off: no route, and no `cap2ui5.Drafts`
or `cap2ui5.AgentLog` table in the model.

The route runs behind CAP's own middlewares and answers like a CAP service.
Whatever `cds.requires.auth` is configured to identifies the user. A caller who
is not logged in gets 401 with that strategy's login challenge. A user who
lacks the role gets 403.

0.1.0 read its settings from a top-level `cds.cap2ui5`. That key is no longer
read, and a project that still sets it fails to start, with a message naming
`cds.requires.cap2ui5`.

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
  protects routes with an X-CSRF-Token by default (`csrfProtection`), and
  the routes work with it on: the frontend of `@abap2ui5/node-runtime`
  1.151.0, the runtime this version pins, answers the approuter's `403` with
  `x-csrf-token: Required` by fetching the token with a HEAD request and
  sending the roundtrip again with it
  ([abap2UI5#2802](https://github.com/abap2UI5/abap2UI5/pull/2802), in the
  runtime from 1.146.0 on). That is read from the frontend's code; this
  repository has no test against an approuter. Only a runtime older than
  1.146.0 - an `overrides` to 1.145.0 - sends no token and needs
  `"csrfProtection": false` on these routes. Beside the approuter's token
  the framework runs its own CSRF check: it compares `Origin`/`Referer` with
  the host, and the user exit configures it.
- **Scaling:** roundtrips run **one at a time per process** - the transpiled
  framework keeps per-request state where ABAP keeps it per work process. A
  roundtrip costs milliseconds, so that is rarely felt, but an app whose
  `main( )` awaits a slow query holds every other user's roundtrip for as
  long. So: keep I/O in `main( )` short, scale with instances - the drafts
  are in the database, so any instance answers any roundtrip - and watch the
  log, which warns when a roundtrip waited a second or more for its turn. An
  async `main( )` is given up after `timeout` (a minute) with a 504. The one
  thing that does not scale out is a *stateful* ABAP app
  (`set_session_stateful( )`): its session lives in the process, so it needs
  sticky routing and is lost in a restart.
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
- **Database:** `cap2ui5.Drafts` and `cap2ui5.AgentLog` are part of the
  model, so `cds deploy` and `cds build --production` create them like any
  other table (`.hdbtable` for SAP HANA). The agent log's table is there
  whether the endpoint is on or not - the database is built from the model
  where `cds build` runs, the endpoint is switched on where the server runs,
  often by an environment variable the build never sees; ADR-009 has the
  reasons. It is written only while the endpoint is on, and its rows are
  deleted after `agent.retention` days (90). A draft is deleted after the
  user exit's `draft_exp_time_in_hours`, 4 hours unless the exit changes it.
  The framework deletes the expired drafts when somebody opens an app, and
  only then; `await purgeDrafts()` from `@cap2ui5/cds-plugin` runs the same
  `DELETE` from a scheduled job of the project's own and answers how many
  rows went (`{ hours }` for another expiry; per tenant inside
  `cds.tx({ tenant }, ...)`).
- **Multitenancy (MTX):** not tested yet. The draft store reads and writes
  through `cds.run`, which follows `cds.context`. The drafts should therefore
  land in each tenant's database like any other row, but no test proves it.

## Performance

A roundtrip carries the app's model: the framework restores it from the
draft, runs the app and answers it whole. So what a roundtrip costs grows
with the model - one editable table of n rows, measured with
`npm run bench -- --rows <n>` in this repository (Node 22, a shared 4-core
machine; take the ratios, not the seconds):

| rows | answer, plain / gzip | start / edit one cell, 1.145.0 | 1.146.0 and later |
|---:|---|---|---|
| 500 | 45 / 6 kB | 2.7 s / 4.3 s | 0.9 s / 1.4 s |
| 1000 | 90 / 11 kB | 6.0 s / 12.1 s | 0.6 s / 1.4 s |
| 2000 | 181 / 21 kB | 19.6 s / 43.5 s | 1.6 s / 2.9 s |
| 8000 | 727 / 82 kB | - | 3.3 s / 16.4 s |

- **Linear since 1.146.0.** On 1.145.0 the time grows with n², not
  in abap2UI5's ABAP but in two places of `@abaplint/runtime`: a LOOP ...
  WHERE over a sorted primary key reads every row, and CP rescans the rest
  of the draft's XML for every token the parser reads.
  `@abap2ui5/node-runtime` worked around both from 1.146.0 on - the right
  column, measured then - and `@abaplint/runtime` 2.13.96 fixed them at the
  source, so the runtime this version pins is linear with nothing to switch
  on (the package's README, "Large tables").
- **Node 24 is recommended.** CAP keeps `cds.context` in an
  `AsyncLocalStorage`, and on Node 22 that costs the transpiled framework -
  which awaits at nearly every method call - about as much time again as its
  own work. Node 24 keeps it in the async context frame, which costs next to
  nothing. On Node 22.7 and later,
  `NODE_OPTIONS=--experimental-async-context-frame` does the same: measured
  back to back, it halved the times in the table, on the quadratic runtime and
  on the linear one (2000 rows, an edit on the latter: 3.4 s, then 2.0 s).
- **`NODE_COMPILE_CACHE`.** The runtime is about 800 transpiled modules, and
  importing them takes 0.7 s on every start. With `NODE_COMPILE_CACHE` set
  to a directory, Node keeps their compiled code there and the import takes
  0.5 s - worth it for `cds watch`, which restarts on every save.
- **Compression.** The UI5 frontend is a bundle of about 190 kB the page
  loads from the route - 50 kB gzipped - and the route gzips it and every roundtrip of 1 kB or more where
  the browser accepts gzip (see [In production](#in-production)).

## Documentation

**[cap2ui5.github.io/docs](https://cap2ui5.github.io/docs/)** — the guide, the
API reference, the examples and the architecture, including why the exit is
registered rather than discovered and where UI5 itself comes from.

## Support

Bugs and questions: [github.com/cap2UI5/cap2UI5/issues](https://github.com/cap2UI5/cap2UI5/issues).
What changed between versions: [CHANGELOG.md](CHANGELOG.md).

## License

MIT
