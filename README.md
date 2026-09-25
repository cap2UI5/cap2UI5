# cap2UI5

**[abap2UI5](https://github.com/abap2UI5/abap2UI5) as a CAP plugin.** The real
framework — the ABAP, downported and transpiled by `@abaplint/transpiler` over
open-abap — runs inside your CAP server. Its drafts are a CDS entity in your
database, under your authorization. Your apps are plain JavaScript classes that
read your entities with `cds.ql`.

> [!IMPORTANT]
> **Status: pre-release.** The plugin works and is tested end to end (wire,
> restart, concurrency, browser). The four abap2UI5 seams it needs shipped in
> abap2UI5 1.144.1; the runtime package, `@abap2ui5/node`, is published by
> abap2UI5 from its next release on. Until it is on npm, `runtime/` is a
> stand-in that `scripts/assemble-runtime.sh` fills from an upstream build.
> The package was drafted upstream as `@abap2ui5/runtime` and renamed before
> it was ever published; the ADRs keep the old name as the record of their
> time. See [docs/adr/adr-008-host-not-port.md](docs/adr/adr-008-host-not-port.md).

## Using it

```bash
npm i cap2ui5            # once published; today: this workspace, see below
```

That is the installation. On the next `cds serve` the roundtrip route
(`/rest/root/z2ui5`, `/sap/bc/z2ui5`) exists and `cds deploy` creates
`cap2ui5.Drafts` next to your own entities. Your `server.js`, if you have one,
is untouched.

An app is a file in `srv/apps/`:

```js
import cds from "@sap/cds";
import { defineApp, t } from "cap2ui5";

const { SELECT } = cds.ql;

defineApp("BOOKS", class {
  search = "";
  hits   = 0;
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(c) {                       // async only because THIS app does I/O
    if (c.isDisplay) {
      c.view(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">
        <Page title="Books">
          <SearchField value="${c.bind("search")}" search="${c.event("SEARCH")}"/>
          <Table items="${c.bind("books")}"> … <Text text="{TITLE}"/> … </Table>
          <Text text="${c.bind("hits")} hits"/>
        </Page></mvc:View>`);
      return;
    }
    if (c.eventName === "SEARCH") {
      const { Books } = cds.entities("my.bookshop");
      this.books = await SELECT.from(Books).where`title like ${"%" + this.search + "%"}`;
      this.hits = this.books.length;
      c.messageToast(`${this.hits} found`);
    }
  }
});
```

`cds init` + `cds add nodejs` create an ES module project (`"type": "module"`),
so an app file imports. In a CommonJS project - or as a `.cjs` file in an ES
module one - `require("cap2ui5")` gives the same three names; the plugin loads
`.js`, `.mjs` and `.cjs` alike.

Open `/rest/root/z2ui5?app_start=BOOKS`. The full example is
[`examples/bookshop`](examples/bookshop).

**The app API:**

| | |
|---|---|
| lifecycle | `c.isFirstRun` (seed once), `c.isDisplay` (render), `c.canGoBack`, `c.eventName`, `c.eventArg(i)`, `c.prevApp` |
| binding | `c.bind(field)`, `c.event(name, [args])` |
| screen | `c.view(xml)`, `c.popup(xml)` / `c.popupClose()`, `c.nest(into, xml, {insert, clear})` / `c.nestClose()`, `c.messageBox(text)`, `c.messageToast(text)` |
| navigation | `c.navTo(app)`, `c.navBack({event, data, app})` |
| escape hatch | `c.raw` — the transpiled `z2ui5_if_client`, async |

**The user exit** — the CSP, the security headers, the UI5 bootstrap URL, the
theme, the draft expiry, the CSRF gate — is `defineExit({ onPage, onRoundtrip })`,
one per project, from a file in the apps directory. It is *registered*, not
discovered: upstream finds the exit by asking the class repository which
classes implement `z2ui5_if_ui5_exit`, and open-abap has no such repository,
so under the transpiled runtime that lookup answers nothing. Measured before
this existed: every value on that list was unreachable from a CAP project.

> **`isDisplay`, not `isFirstRun`, is the render branch.** `isFirstRun` is the
> first roundtrip of *this app instance* and nothing else; `isDisplay` is also
> true every time the app gets the screen back — a called app leaving, a value
> help closing, a bookmark restored. An app that renders only on `isFirstRun`
> works until something navigates back into it, and then leaves the previous
> screen standing with no error anywhere. `isFirstRun` implies `isDisplay`, so
> `if (c.isDisplay)` is the whole condition.
>
> Two names are gone and throw an error naming their replacement: `c.isInitial`
> (it was `check_on_navigated( )` under a name that reads like
> `check_on_init( )`) and `c.modelUpdate()` (`view_model_update( )` is
> documented obsolete and does nothing — changed bound data is pushed on its
> own, to an open popup and a nested view too).

**State:** strings, numbers, booleans, `t.packed(l, d)`, `t.char(n)`, a plain
object (a structure), `t.table({ …one row… })` — and those nest: a structure
inside a structure, a table inside a structure, up to 8 levels. Component names
are UPPERCASE in the model. A field that carries no ABAP type (`null`, an empty
array, a cycle) is reported by its path and left out; the app runs without it. ABAP apps transpiled with upstream run unchanged next to yours.

**Configuration** (`package.json#cds.cap2ui5`): `apps` (`srv/apps`), `routes`,
`webapp` (mount path of the UI5 shell), `requires` (`authenticated-user`;
`null` allows anonymous callers). Whatever `cds.requires.auth` is configured
to decides who gets in — the route runs behind CAP's own middlewares.

## This repository

```
plugin/              the npm package cap2ui5: cds-plugin.js, index.cds, lib/
examples/bookshop/   a CAP project using it: a plain CAP service, the apps, the test suite
runtime/             @abap2ui5/node: only package.json + README are here, see runtime/README.md
scripts/             assemble-runtime.sh - fills runtime/ from an upstream build or the package
docs/adr/            the decisions, with the measurements that made them
```

```bash
# once, until @abap2ui5/node exists on npm:
git clone https://github.com/abap2UI5/abap2UI5 /tmp/ref
(cd /tmp/ref && npm ci && npm run deps && npm run auto_downport && npm run auto_transpile)
scripts/assemble-runtime.sh /tmp/ref          # or: scripts/assemble-runtime.sh --package X.Y.Z

npm install
npm test                                       # ABI gates, auth, books, concurrency, nesting, the exit  (36 tests)
npm run cold-test                              # state AND the app stack through SIGKILL, ABAP control included
npm run bench -- 100                           # ms per roundtrip
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
| **As published** | both packages packed, installed into a CAP project that has never heard of this repository, and driven through a roundtrip - the plugin found as a cds-plugin from `node_modules`, `index.cds` in the project's model, the runtime resolved from the project, 401 for an anonymous caller (`scripts/consumer-test.mjs`, 17 checks) |
| Browser | renders in Chromium — the page the framework serves on GET, UI5 booted; MessageBox, table, a `sap.m.Dialog` popup, and a navigation round trip that comes back with the choice |

The one hazard of the design: the plugin couples to what the transpiler
*emits*, not to a published API. `examples/bookshop/test/abi-gate.test.mjs`
names every touchpoint and checks it against a class the transpiler itself
produced, so a bump fails there and not on the wire.

## License

MIT — see [LICENSE](LICENSE).
