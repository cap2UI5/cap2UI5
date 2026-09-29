# cap2UI5

**[abap2UI5](https://github.com/abap2UI5/abap2UI5) as a CAP plugin.** The real
framework — the ABAP, downported and transpiled by `@abaplint/transpiler` over
open-abap — runs inside your CAP server. Its drafts are a CDS entity in your
database, under your authorization. Your apps are plain JavaScript classes that
read your entities with `cds.ql`.

> [!IMPORTANT]
> **Status: pre-release, on npm.** The plugin works and is tested end to end
> (wire, restart, concurrency, browser). The four abap2UI5 seams it needs
> shipped in abap2UI5 1.144.1. The plugin is on npm as `@cap2ui5/cds-plugin`
> (up to 0.2.0 `cap2ui5`, which is withdrawn), next to `@cap2ui5/samples` -
> abap2UI5's samples as a package a project adds - and the runtime it pins,
> `@abap2ui5/node-runtime@1.145.0`, which abap2UI5 builds and publishes
> itself. In this repository `runtime/` is
> still a workspace stand-in for that package, which
> `scripts/assemble-runtime.sh` fills from the published one or from an
> upstream build. The package was drafted upstream as `@abap2ui5/runtime` and
> renamed before it was ever published; the ADRs keep the old name as the
> record of their time. See
> [docs/adr/adr-008-host-not-port.md](docs/adr/adr-008-host-not-port.md).

## Using it

```bash
npm i @cap2ui5/cds-plugin    # contributing to the plugin itself: the workspace, see below
cds add cap2ui5              # optional: a first app in srv/apps/hello.js
npm i -D @cap2ui5/samples    # optional: abap2UI5's samples beside your apps, in development
```

Requires Node.js 22+ and `@sap/cds` 9 or 10. That is the installation. On the next `cds serve` the roundtrip route
(`/rest/root/z2ui5`, `/sap/bc/z2ui5`) exists and `cds deploy` creates
`cap2ui5.Drafts` next to your own entities. Your `server.js`, if you have one,
is untouched.

An app is a file in `srv/apps/` - and it reads like an abap2UI5 app, because
the client its `main( )` receives is abap2UI5's `z2ui5_if_client`, by its own
method names:

```js
import cds from "@sap/cds";
import { defineApp, t } from "@cap2ui5/cds-plugin";

const { SELECT } = cds.ql;

defineApp("BOOKS", class {
  search = "";
  hits   = 0;
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(client) {                  // async only because THIS app does I/O
    if (client.check_on_navigated()) {
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
        <Page title="Books">
          <SearchField value="${client._bind("search")}" search="${client._event("SEARCH")}"/>
          <Table items="${client._bind("books")}"> … <Text text="{TITLE}"/> … </Table>
          <Text text="${client._bind("hits")} hits"/>
        </Page></mvc:View>`);
    } else if (client.check_on_event("SEARCH")) {
      const { Books } = cds.entities("my.bookshop");
      this.books = await SELECT.from(Books).where`title like ${"%" + this.search + "%"}`;
      this.hits = this.books.length;
      client.message_toast_display(`${this.hits} found`);
    }
  }
});
```

`cds init` + `cds add nodejs` create an ES module project (`"type": "module"`),
so an app file imports. In a CommonJS project - or as a `.cjs` file in an ES
module one - `require("@cap2ui5/cds-plugin")` gives the same names; the
plugin loads `.js`, `.mjs` and `.cjs` alike.

`cds watch` prints the address of every app, and the user to log in as:

```
[cap2ui5] BOOKS  http://localhost:4004/sap/bc/z2ui5?app_start=BOOKS
[cap2ui5] development login: alice (empty password)
```

Only in development; a production profile prints neither. The full example is
[`examples/bookshop`](examples/bookshop).

**The app API is abap2UI5's.** `client->check_app_prev_stack( )` is
`client.check_app_prev_stack()`: every method of `z2ui5_if_client`, under its
name, a method's preferred parameter as its one positional argument and the
parameters by name as one object - ``client->_event( val = `GO` t_arg = … )`` is
`client._event({ val: "GO", t_arg: [ … ] })`. The constants are the
interface's, `z2ui5_if_client.cs_event.set_title`, and the view builder is
`z2ui5_cl_ui5_view_builder`, its methods called the same way:

```js
const view = z2ui5_cl_ui5_view_builder.factory()
    .ele({ n: "View", ns: "mvc" })
        .a({ n: "xmlns", v: "sap.m" })
        .a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" });
view.ele("Page")
        .a({ n: "title", v: "Hello" })
    .tag("Button")
        .a({ n: "text", v: "Go" })
        .a({ n: "press", v: client._event("GO") });
client.view_display(view.stringify());
```

So an ABAP app ports line by line, and abap2UI5's documentation of a method is
the documentation of the JavaScript one - and the package does the porting:
`npx --no-install cap2ui5 abap2js zcl_my_app.clas.abap` writes `srv/apps/zcl_my_app.js`,
and refuses with file, row and column what it does not know
([plugin/README.md](plugin/README.md#an-abap-app-translated-cap2ui5-abap2js)). What JavaScript changes: a field is
bound by its NAME (`client._bind("s_order-customer")`), since ABAP's `_bind( )`
finds it by reference; what only an asynchronous framework call can produce -
an event's wire, `view.stringify()` - is resolved after `main( )`, so embed
what the client returns as it is; `client.get_app( id )` can be written, not
read. [`plugin/README.md`](plugin/README.md) has the table, and the rendering
and escaping of a view are upstream's, byte for byte.

**The user exit** — the CSP, the security headers, the UI5 bootstrap URL, the
theme, the draft expiry, the CSRF gate — is `defineExit({ onPage, onRoundtrip })`,
one per project, from a file in the apps directory. It is *registered*, not
discovered: upstream finds the exit by asking the class repository which
classes implement `z2ui5_if_ui5_exit`, and open-abap has no such repository,
so under the transpiled runtime that lookup answers nothing. Measured before
this existed: every value on that list was unreachable from a CAP project.

> **`check_on_navigated( )`, not `check_on_init( )`, is the render branch.**
> `check_on_init( )` is the first roundtrip of *this app instance* and nothing
> else; `check_on_navigated( )` is also true every time the app gets the
> screen back — a called app leaving, a value help closing, a bookmark
> restored. An app that renders only on `check_on_init( )` works until
> something navigates back into it, and then leaves the previous screen
> standing with no error anywhere.
>
> The names of cap2ui5 0.1.0 (`c.isDisplay`, `c.bind( )`, `c.navBack( )`, …)
> are gone and throw an error naming the method that replaces each.

**State:** strings, numbers, booleans, `t.packed(l, d)`, `t.char(n)`, a plain
object (a structure), `t.table({ …one row… })` — and those nest: a structure
inside a structure, a table inside a structure, up to 8 levels. Component names
are UPPERCASE in the model. A field that carries no ABAP type (`null`, an empty
array, a cycle) is reported by its path and left out; the app runs without it. ABAP apps transpiled with upstream run unchanged next to yours.

**Configuration** (`cds.requires.cap2ui5`, as with SAP's own plugins):
- `apps` (default `srv/apps`)
- `routes`
- `roles` (default `["authenticated-user"]`): a role or a list of roles, as
  with CAP's `@requires`; `any` or `null` allows anonymous callers
- `body_parser.limit` (CAP's `cds.server.body_parser.limit`, else `10mb`)
- `compression` (default `true`): gzip for the page and the roundtrips;
  `false` leaves it to a proxy in front

`false` switches the plugin off. The route runs behind CAP's own middlewares
and answers like a CAP service: 401 with the login challenge of
`cds.requires.auth`'s strategy, 403 for a user without the role, 413 for a
body over the limit.

## This repository

```
plugin/              the npm package @cap2ui5/cds-plugin: cds-plugin.js, index.cds, lib/
examples/bookshop/   a CAP project using it: a plain CAP service, the apps, the test suite
runtime/             @abap2ui5/node-runtime: only package.json + README are here, see runtime/README.md
scripts/             assemble-runtime.sh - fills runtime/ from an upstream build or the package
docs/adr/            the decisions, with the measurements that made them (ADR-001 to -008)
```

```bash
# once per checkout: fill runtime/ from the published runtime the plugin pins
scripts/assemble-runtime.sh --package 1.145.0
# ...or, to try an unreleased upstream, from an upstream build:
#   git clone https://github.com/abap2UI5/abap2UI5 /tmp/ref
#   (cd /tmp/ref && npm ci && npm run deps && npm run auto_downport && npm run auto_transpile)
#   scripts/assemble-runtime.sh /tmp/ref

npm install
npm test                                       # ABI gates, auth, config, books, concurrency, nesting, the exit, the start
npm run cold-test                              # state AND the app stack through SIGKILL, ABAP control included
npm run bench -- 100                           # ms per roundtrip
npm run bench -- --rows 2000                   # one table of 2000 rows: time and wire size per roundtrip
npm run consumer-test                          # pack both packages, install them into a throwaway CAP project, drive a roundtrip
npm run test:browser                           # real Chromium against the framework's own page
npm start                                      # http://localhost:4004/rest/root/z2ui5?app_start=ZCL_JS_BOOKS
```

## What it measures

| | |
|---|---|
| Hand-written framework code | **589 lines** of code (`plugin/`, 968 with comments), against 16,874 in the JavaScript port this replaces |
| Roundtrip | **14 ms**, sequential, HTTP, SQLite |
| Drafts | a CDS entity, owner-scoped: alice's draft answers to alice and to nobody else, deleted on the clock the user exit sets |
| Restart | process A writes, is SIGKILLed, process B answers correctly |
| **A guest, not a host** | a plain CAP OData service runs beside the apps on the same entities: one authorization for both doors, rows written by an app are there for the OData client and back, and `cap2ui5.Drafts` is not reachable through it (`coexistence.test.mjs`) |
| Restart mid-navigation | A is killed **inside a called app**; B, which never built the stack, unwinds it and carries the picked value home — the whole app stack is in the draft, not in memory |
| Concurrency | three users interleaved in one process, every answer to its owner |
| Navigation | `navTo` / `navBack` carrying a result, popups and nested views — on the wire and in the browser |
| **As published** | both packages packed, installed into a CAP project that has never heard of this repository, and driven through a roundtrip - the plugin found as a cds-plugin from `node_modules`, `index.cds` in the project's model, the runtime the plugin pins, the type declarations and changelog in the package, 401 for an anonymous caller (`scripts/consumer-test.mjs`) |
| CAP versions | the suite and the consumer test on `@sap/cds` 9 and 10, Node 22 and 24 (the CI matrix) |
| Browser | renders in Chromium — the page the framework serves on GET, UI5 booted; MessageBox, table, a `sap.m.Dialog` popup, and a navigation round trip that comes back with the choice |

The one hazard of the design: the plugin couples to what the transpiler
*emits*, not to a published API. `examples/bookshop/test/abi-gate.test.mjs`
names every touchpoint and checks it against a class the transpiler itself
produced, so a bump fails there and not on the wire.

## License

MIT — see [LICENSE](LICENSE).
