# cap2ui5

**[abap2UI5](https://github.com/abap2UI5/abap2UI5) as a CAP plugin.** Build
SAPUI5 apps inside your CAP backend, as plain JavaScript classes — no frontend
project, no `manifest.json`, no second build pipeline.

The framework underneath is not a port: it is abap2UI5's own ABAP, downported
and transpiled by `@abaplint/transpiler` over open-abap and published by
abap2UI5 as `@abap2ui5/node`. Its drafts are a CDS entity in your database, under your
authorization; your apps read your entities with `cds.ql`.

> **Pre-release.** The plugin is tested end to end (wire, restart, concurrency,
> browser) but the API can still move before 1.0.

## Install

```bash
npm i cap2ui5
```

That is the installation. On the next `cds serve` the roundtrip route
(`/rest/root/z2ui5`, `/sap/bc/z2ui5`) exists, the UI5 shell is served, and
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

Open `/rest/root/z2ui5?app_start=BOOKS`.

A project from `cds init` + `cds add nodejs` is an ES module project, hence
`import`. In a CommonJS project, or in a `.cjs` file, `require("cap2ui5")`
returns the same names.

| | |
|---|---|
| lifecycle | `c.isFirstRun` (seed once), `c.isDisplay` (render), `c.canGoBack`, `c.eventName`, `c.eventArg(i)`, `c.prevApp` |
| binding | `c.bind(field)`, `c.event(name, [args])` |
| screen | `c.view(xml)`, `c.popup(xml)` / `c.popupClose()`, `c.nest(…)` / `c.nestClose()`, `c.messageBox(text)`, `c.messageToast(text)` |
| navigation | `c.navTo(app)`, `c.navBack({event, data, app})` |
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

## Configure

Under `cds.cap2ui5` in `package.json`, a `.cdsrc.json`, or a profile:

| key | default | |
|---|---|---|
| `apps` | `srv/apps` | the directory scanned for app modules |
| `requires` | `authenticated-user` | who may call; `null` allows anonymous callers |
| `routes` | `/sap/bc/z2ui5`, `/rest/root/z2ui5` | where the roundtrip answers |
| `webapp` | `/z2ui5/webapp` | where the UI5 shell is mounted |

The route runs behind CAP's own middlewares, so whatever `cds.requires.auth` is
configured to decides who gets in.

Everything the *framework* decides about a response — the
Content-Security-Policy, the security headers, the UI5 bootstrap URL, the
theme, the draft expiry, the CSRF gate — comes from the user exit,
`defineExit({ onPage, onRoundtrip })`, one per project.

## Documentation

**[cap2ui5.github.io/docs](https://cap2ui5.github.io/docs/)** — the guide, the
API reference, the examples and the architecture, including why the exit is
registered rather than discovered and where UI5 itself comes from.

## License

MIT
