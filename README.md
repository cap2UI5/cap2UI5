# cap2UI5

**[abap2UI5](https://github.com/abap2UI5/abap2UI5) as a CAP plugin.** The real
framework — the ABAP, downported and transpiled by `@abaplint/transpiler` over
open-abap — runs inside your CAP server. Its drafts are a CDS entity in your
database, under your authorization. Your apps are plain JavaScript classes that
read your entities with `cds.ql`.

> [!IMPORTANT]
> **Status: pre-release.** The plugin works and is tested end to end (wire,
> restart, concurrency, browser), but it depends on four changes to abap2UI5
> that are on a branch and not yet merged, and on `@abap2ui5/runtime`, which
> upstream does not publish yet. Until then `runtime/` is a stand-in that
> `scripts/assemble-runtime.sh` fills from a build of that branch. See
> [docs/adr/adr-008-host-not-port.md](docs/adr/adr-008-host-not-port.md).

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
const cds = require("@sap/cds");
const { SELECT } = cds.ql;
const { defineApp, t } = require("cap2ui5");

defineApp("BOOKS", class {
  search = "";
  hits   = 0;
  books  = t.table({ ID: 0, title: "", author: "", price: t.packed(9, 2) });

  async main(c) {                       // async only because THIS app does I/O
    if (c.isInitial) {
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
      c.modelUpdate();
    }
  }
});
```

Open `/rest/root/z2ui5?app_start=BOOKS`. The full example is
[`examples/bookshop`](examples/bookshop).

**The app API:** `c.isInitial`, `c.eventName`, `c.bind(field)`,
`c.event(name)`, `c.view(xml)`, `c.modelUpdate()`, `c.messageBox(text)`,
`c.messageToast(text)`, `c.raw` (the transpiled `z2ui5_if_client`, async).
**State:** strings, numbers, booleans, `t.packed(l, d)`, `t.char(n)`, a plain
object (a structure), `t.table({ …one row… })`. Component names are UPPERCASE
in the model. ABAP apps transpiled with upstream run unchanged next to yours.

**Configuration** (`package.json#cds.cap2ui5`): `apps` (`srv/apps`), `routes`,
`webapp` (mount path of the UI5 shell), `requires` (`authenticated-user`;
`null` allows anonymous callers). Whatever `cds.requires.auth` is configured
to decides who gets in — the route runs behind CAP's own middlewares.

## This repository

```
plugin/              the npm package cap2ui5: cds-plugin.js, index.cds, lib/
examples/bookshop/   a CAP project using it - and the test suite
runtime/             @abap2ui5/runtime: only package.json + README are here, see runtime/README.md
scripts/             assemble-runtime.sh - fills runtime/ from an upstream build or the package
docs/adr/            the decisions, with the measurements that made them
```

```bash
# once, until @abap2ui5/runtime exists on npm:
git clone -b claude/happy-turing-qt6ljo https://github.com/abap2UI5/abap2UI5 /tmp/ref
(cd /tmp/ref && npm ci && npm run deps && npm run auto_downport && npm run auto_transpile)
scripts/assemble-runtime.sh /tmp/ref          # or: scripts/assemble-runtime.sh --package X.Y.Z

npm install
npm test                                       # ABI gate, auth, books, concurrency  (15 tests)
npm run cold-test                              # state through SIGKILL, ABAP control included
npm run bench -- 100                           # ms per roundtrip
npm run test:browser                           # real Chromium against the framework's own page
npm start                                      # http://localhost:4004/rest/root/z2ui5?app_start=ZCL_JS_BOOKS
```

## What it measures

| | |
|---|---|
| Hand-written framework code | **566 lines** (`plugin/`), against 16,874 in the JavaScript port this replaces |
| Roundtrip | **14 ms**, sequential, HTTP, SQLite |
| Drafts | a CDS entity, owner-scoped: alice's draft answers to alice and to nobody else |
| Restart | process A writes, is SIGKILLed, process B answers correctly |
| Concurrency | three users interleaved in one process, every answer to its owner |
| Browser | renders in Chromium — the page the framework serves on GET, UI5 booted, MessageBox and table on screen |

The one hazard of the design: the plugin couples to what the transpiler
*emits*, not to a published API. `examples/bookshop/test/abi-gate.test.mjs`
names every touchpoint and checks it against a class the transpiler itself
produced, so a bump fails there and not on the wire.

## License

MIT — see [LICENSE](LICENSE).
