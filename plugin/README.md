# cap2ui5

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
npm i cap2ui5
cds add cap2ui5      # optional: a first app in srv/apps/hello.js
```

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
import { defineApp, t } from "cap2ui5";

const { SELECT } = cds.ql;

defineApp("BOOKS", class {
  search = "";
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(c) {                       // async only because THIS app does I/O
    if (c.isDisplay) {
      c.view(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
        <Page title="Books">
          <SearchField value="${c.bind("search")}" search="${c.event("SEARCH")}"/>
          <Table items="${c.bind("books")}"> … <Text text="{TITLE}"/> … </Table>
        </Page></mvc:View>`);
      return;
    }
    if (c.eventName === "SEARCH") {
      const { Books } = cds.entities("my.bookshop");
      this.books = await SELECT.from(Books).where`title like ${"%" + this.search + "%"}`;
      c.messageToast(`${this.books.length} found`);
    }
  }
});
```

`cds watch` prints the address of every app, and the user to log in as:

```
[cap2ui5] - BOOKS  http://localhost:4004/sap/bc/z2ui5?app_start=BOOKS
[cap2ui5] - development login: alice (empty password)
```

Only in development; a production profile prints neither. CAP's start page
at `/` lists the same addresses under "Web Applications".

A project from `cds init` + `cds add nodejs` is an ES module project, hence
`import`. In a CommonJS project, or in a `.cjs` file, `require("cap2ui5")`
returns the same names.

| | |
|---|---|
| lifecycle | `c.isFirstRun` (seed once), `c.isDisplay` (render), `c.canGoBack`, `c.eventName`, `c.eventArg(i)`, `c.prevApp`, `c.eventData`, `c.get()`, `c.appStateHref` |
| binding | `c.bind(field, {path, row, column, omitInitial, omitInitialPaths, json})`, `c.bind("field.component")` |
| handlers | `c.event(name, [args], {preventDefault, argLiteral, queueLast, noBusy, …})`, `c.eventNavBack()`, `c.eventFollowUpAction(action, [args], {view})` |
| screen | `c.view(xml)` / `c.viewClose()`, `c.popup(xml)` / `c.popupClose()`, `c.popover(xml, byId)` / `c.popoverClose()`, `c.nest(…)` / `c.nestClose()`, `c.nest2(…)` / `c.nest2Close()`, `c.messageBox(text, {…})`, `c.messageToast(text, {…})`, `c.followUpAction(action, [args], {view})` — `xml` is XML text or a `ViewBuilder` |
| navigation | `c.navTo(app, fields)`, `c.navBack({event, data, app})`, `c.hashSet(hash)`, `c.hashReplace(hash)`, `c.appStateSetActive()` |
| escape hatch | `c.raw` — the transpiled `z2ui5_if_client`, async |

**`isDisplay`, not `isFirstRun`, is the render branch.** `isFirstRun` is the
first roundtrip of *this app instance*; `isDisplay` is also true every time the
app gets the screen back — a called app leaving, a value help closing, a
bookmark restored.

**State:** strings, numbers, booleans, `t.packed(l, d)`, `t.char(n)`, a plain
object (a structure), `t.table({ …one row… })` — and those nest, up to 8
levels. Component names are UPPERCASE in the model. The whole instance is
persisted to `cap2ui5.Drafts` after every roundtrip and rebuilt before the
next, so state survives a restart.

**Types:** the package ships TypeScript declarations (`index.d.ts`). In a
JavaScript app, annotate the client for completion and checked field names:
`/** @param {import("cap2ui5").Client<{ search: string }>} c */`.

## Building a view with `ViewBuilder`

A view can also be built the way an ABAP app builds one, with abap2UI5's own
`z2ui5_cl_ui5_view_builder`, which uses the same verbs:

```js
const { defineApp, ViewBuilder } = require("cap2ui5");

defineApp("HELLO", class {
  name = "";

  main(c) {
    if (c.isDisplay) {
      const view = ViewBuilder.factory();
      view.ele("View", "mvc")
              .a("xmlns", "sap.m")
              .a("xmlns:mvc", "sap.ui.core.mvc")
          .ele("Page")
              .a("title", "Hello")
              .tag("Input")
                  .a("value", c.bind("name"))
              .tag("Text")
                  .a("text", { t: "{shown as typed}" })
              .tag("Button")
                  .a("text", "Go")
                  .a("press", c.event("GO"));
      c.view(view);
      return;
    }
    if (c.eventName === "GO") c.messageBox(`Hello ${this.name}`);
  }
});
```

| | |
|---|---|
| `ViewBuilder.factory()` | an empty root; open the `mvc:View` and declare its `xmlns` yourself |
| `ele(name, ns)` | add a child element and descend into it |
| `tag(name, ns)` | add a child element and stay: the form for a leaf |
| `a(name, value)` | an attribute on the element the chain points at: the child just added, or the node itself while it has none. A string or number is written as it is (bindings, events, constant text), a boolean renders `true`/`false`, and `{ t: text }` renders text literally, so a `{` in user input is shown rather than read as a binding |
| `end()` | ascend to the parent |
| `ViewBuilder.escapeLiteral(text)` | the literal escaping of `t`, for one part of a value that also carries a binding |

The chain is recorded while `main( )` runs and rendered after it, by the
transpiled `z2ui5_cl_ui5_view_builder` the runtime carries. The XML, its
escaping and its refusals (an `end()` past the root, a duplicate attribute, an
invalid name) are therefore exactly those of the same chain in an ABAP app. A
refusal answers the roundtrip with the framework's error, naming the app.
`await view.stringify()` returns the XML outside an app.

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
