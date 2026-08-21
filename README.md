[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)
[![update cap](https://github.com/cap2UI5/builder-cap2UI5/actions/workflows/update_cap.yml/badge.svg?branch=main)](https://github.com/cap2UI5/builder-cap2UI5/actions/workflows/update_cap.yml)

# 🚀 cap2UI5

Bringing the [abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js.

> [!IMPORTANT]
> **Everything in this project is generated automatically.** The entire
> codebase, all documentation, and the
> [web version](https://github.com/cap2UI5/builder-cap2UI5-web) were created by AI
> (Claude) and by an automated sync pipeline that mirrors and transpiles the
> upstream [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources — nothing
> here is hand-written. See
> [builder-abap2UI5-js](https://github.com/cap2UI5/builder-abap2UI5-js) and
> [builder-cap2UI5](https://github.com/cap2UI5/builder-cap2UI5) for how the
> pipeline works. Review and test before relying on it.

📖 **Documentation:** [cap2UI5/docs](https://github.com/cap2UI5/docs)

#### Features
* XML View Generation - Create UI5 views programmatically in your backend
* Data Binding & Exchange - Seamless two-way data binding between frontend and backend
* Session Management - Built-in persistence and session handling (optional)

#### Benefits
* Security
* Speed

## Using cap2UI5 in your own project

This repository is the **demo**, not the delivery mechanism. It is generated on
every sync, so it is a place to look, not a place to build. To use the
framework in a CAP project of your own, install the package and add two lines:

```cds
using from 'abap2UI5/z2ui5-model';      // db/schema.cds — the draft table
using from 'abap2UI5/z2ui5-service';    // srv/service.cds — the endpoint
```

The package's `cds-plugin` does the rest — identity, draft persistence, app
discovery, the bootstrap routes, the UI5 runtime and the roundtrip
implementation — so there is no server boilerplate to copy. Point it at your
apps with `Z2UI5_APP_DIRS`, run `cds watch`, open `/rest/root/z2ui5`.

Everything is opt-outable through `"cds": { "z2ui5": { … } }` in your
package.json if you want to wire a piece yourself.

## Getting Started

Prerequisites: Node.js ≥ 22 (see `.nvmrc`). The whole stack runs offline —
the UI5 runtime is served locally from the pinned `openui5-dist` dependency,
and CAP deploys an in-memory SQLite database automatically on startup.

```bash
npm install

# start the server (restarts on file changes)
npx cds watch
# or: start and open the app in the browser right away
npm run watch-z2ui5
```

The server listens on [http://localhost:4004](http://localhost:4004):

| URL | What you get |
|---|---|
| `http://localhost:4004/z2ui5/webapp/index.html` | the app — without a parameter the startup app is shown |
| `http://localhost:4004/z2ui5/webapp/index.html?app_start=z2ui5_cl_ui5_app_hi_world` | start a specific app class via the `app_start` parameter (works for every sample, e.g. `z2ui5_cl_smp_app_004`) |
| `http://localhost:4004/index.html` | the [minimal starter page](#the-minimal-base) — one roundtrip through all three layers |
| `http://localhost:4004/rest/root/z2ui5` | the roundtrip endpoint the frontend talks to |
| `http://localhost:4004/odata/v4/admin/z2ui5_t_01` | the draft table (session persistence) via OData |

For a one-off run without file watching use `npm start` (`cds-serve`).

## The minimal base

### What it is

The **base** is the starting point of cap2UI5: a small but complete CAP
project that works on its own, before any generated code is added. It
brings the same basic setup as abap2UI5 — a frontend that talks JSON to a
single http endpoint, and a draft table that persists the app state between
roundtrips — reduced to the minimum:

| Layer | Where | What it does |
|---|---|---|
| (1) mini frontend | [`app/index.html`](app/index.html) | a single self-contained UI5 page that POSTs one roundtrip, renders the returned view XML and shows the draft id + row count |
| (2) http service | [`srv/z2ui5-service.cds`](srv/z2ui5-service.cds) / [`.js`](srv/z2ui5-service.js) + [`srv/server.js`](srv/server.js) | `rootService.z2ui5` — the REST action at `POST /rest/root/z2ui5` (plus `GET` bootstrap HTML), same wire format as the abap2UI5 ICF endpoint |
| (3) persistence | [`db/schema.cds`](db/schema.cds) | entity `cap2ui5.z2ui5_t_01` — one draft row per roundtrip, chained via `id_prev` (the abap2UI5 table `Z2UI5_T_01`) |

The base is hand-maintained in
[builder-cap2UI5's `src/`](https://github.com/cap2UI5/builder-cap2UI5/tree/main/src)
and published 1:1 into this repository. The framework itself — the engine, the
transpiled classes, the z2ui5 frontend and the ~105 bundled samples — lives in
the platform-neutral **core package** ([`core/`](core/), vendored here and
linked as the npm dependency `abap2UI5` via `file:./core`) and is generated
by the sync pipeline in
[builder-abap2UI5-js](https://github.com/cap2UI5/builder-abap2UI5-js). All
commands below work in both places: in builder-cap2UI5's `src/` (source only)
and in this repository (base + the vendored core + the generated webapp
overlay).

### Minimal setup

A regular CAP project with the [standard layout](https://cap.cloud.sap/docs/get-started/):

```
base/
├── app/              # UI content
│   └── index.html    #   the mini frontend (starter page)
├── db/               # domain model
│   └── schema.cds    #   cap2ui5.z2ui5_t_01 — the draft table
├── srv/              # services and implementation
│   ├── z2ui5-service.cds   # AdminService (OData) + rootService (REST)
│   ├── z2ui5-service.js    # wires POST /rest/root/z2ui5 → the engine roundtrip
│   ├── server.js           # GET bootstrap HTML, /resources, draft store + app dir ports
│   ├── app/                # custom apps (z2ui5_cl_app_read_odata, your own)
│   └── external/           # imported remote service model (Northwind)
├── test/             # jest: starter integration test + view builder test
└── package.json      # @sap/cds ^10, "abap2UI5": file-link to the vendored core/, Node ≥ 22
```

The z2ui5 runtime itself is not hand-written in this project — it comes from
the vendored [core package](core/) (`require("abap2UI5/engine")`), which `srv/server.js`
wires to CAP: the draft store port to the CDS entity `cap2ui5.z2ui5_t_01`,
the app-discovery port to this project's `srv/app/`.

There is nothing to configure: the UI5 runtime is served locally from the
pinned `openui5-dist` dependency (works offline) and CAP deploys an
in-memory SQLite database automatically on startup.

### Start it

```bash
npm install
npx cds watch     # → http://localhost:4004/index.html
```

Open [http://localhost:4004/index.html](http://localhost:4004/index.html):
every click on **POST /rest/root/z2ui5** runs one full roundtrip — the
backend app class builds the view, the response's draft id is the new row
key in `cap2ui5.z2ui5_t_01`, and the row count (read back via the
AdminService OData endpoint) increases by one.

Or exercise the service from the command line:

```bash
curl -s -X POST http://localhost:4004/rest/root/z2ui5 \
  -H "Content-Type: application/json" \
  -d '{"value":{"S_FRONT":{"ORIGIN":"http://localhost:4004","PATHNAME":"/index.html","SEARCH":"","HASH":""}}}'

curl -s http://localhost:4004/odata/v4/admin/z2ui5_t_01/\$count
```

### Test it

```bash
npm test
```

runs the jest suite: [`test/starter.test.js`](test/starter.test.js) boots the
real server via `cds.test()` and asserts all three layers end-to-end
(starter page + bootstrap HTML, roundtrip returning view XML, draft row
persisted per roundtrip), and
[`test/view-builder-namespaces.test.js`](test/view-builder-namespaces.test.js)
covers the view builder.

## Security model

**Role-restricted by default.** Both services carry
`@(requires: 'User')` ([`srv/z2ui5-service.cds`](srv/z2ui5-service.cds)),
`package.json` binds `cds.requires.auth` to `xsuaa` in the production profile
and to mocked users in development, and [`xs-security.json`](xs-security.json)
declares the `$XSAPPNAME.User` scope with the matching role template CAP maps
that name onto. Authentication alone is not enough: a user of the subaccount
who was never granted the role gets a 403, not a session.

What is authenticated, and what is not:

| Endpoint | Access |
|---|---|
| `POST /rest/root/z2ui5` (the roundtrip) | authenticated |
| `/odata/v4/admin/*` (draft table, Northwind) | authenticated |
| `GET/HEAD /rest/root/z2ui5` (bootstrap shell, CSRF ack) | public |
| `/resources/*` (UI5 runtime), `/health` | public |

The GET/HEAD routes are public on purpose: they serve the static UI5 bootstrap
shell and carry no user data, which keeps the offline/dev flow working. In BTP
the approuter authenticates before the frontend reaches them anyway.

**Isolation between users.** A draft row holds the complete serialized state
of a session, so it is bound to its owner in two independent places: the OData
projection is read-only and filtered (`where: 'owner = $user'`), and the draft
store filters on the owner again when loading — a draft id travels in request
bodies, logs and browser history, so it is not treated as a secret. Retained
sticky app state is keyed per session through the framework's identity port
(`engine.set_identity` in [`srv/server.js`](srv/server.js)).
[`test/isolation.test.js`](test/isolation.test.js) holds the regression net for
all of it.

**Hardening applied here** (each of these was a gap until 2026-08, and each
has a regression test in [`test/security.test.js`](test/security.test.js)):

- the services require the declared `User` role, not merely
  `authenticated-user` -- the scope had been declared and never referenced, so
  every authenticated subaccount user passed regardless of role assignment;
- the framework's CSRF gate is **on** by default (it was opt-in, and nothing
  opted in), rejecting a POST whose `Origin`/`Referer` does not match the
  application host. With neither header present it allows, matching upstream:
  the cross-site form vector is closed a layer up, since CDS accepts an action
  call only as `application/json` and the approuter forwards a JWT;
- the roundtrip and the OData entities answer with `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy` and `Cache-Control: no-store` -- only
  the bootstrap page carried headers before;
- the request body is capped explicitly (`Z2UI5_MAX_BODY`, default 2mb) rather
  than relying on the express default applying by accident;
- draft retention follows the framework's own expiry instead of disagreeing
  with it, runs on one instance rather than all of them, and the two columns it
  and the owner filter scan (`createdAt`, `owner`) are indexed
  ([`db/src/`](db/src)).

**Before going productive**, two properties are still worth knowing. The
`GET`/`HEAD` bootstrap routes are public by design (see the table above). And
retained *sticky* app state lives in the serving process, so it is neither
shared between instances nor restored after a restart -- scale beyond one
instance and a sticky session can land on an instance that never saw it. The
draft chain itself is durable in the database and unaffected; `mta.yaml`
therefore declares a single instance until session affinity or a shared sticky
store exists.

## Transpiling from ABAP

App classes can be transpiled automatically from the abap2UI5 ABAP sources —
the transpiler and all other dev tooling live in
[builder-abap2UI5-js](https://github.com/cap2UI5/builder-abap2UI5-js).

## Samples
All samples demonstrate complete view definition and data exchange handled entirely by the CAP server, using the same and static frontend from abap2UI5.

Each app is a single `.js` file whose basename matches the class name it
exports (`module.exports`).

**Where to put your own apps depends on what this repository is to you.**
This has been ambiguous — the README used to say "put your own apps into
`srv/app/`" while AGENTS.md said `srv/app/` is overwritten on every publish —
so, plainly:

| You are… | Put apps in | Why |
|---|---|---|
| **using cap2UI5 in your own CAP project** (the supported path) | anywhere in your project | Install the package, add the two `using` lines, and point at your folder with `Z2UI5_APP_DIRS` or `require("abap2UI5/register-apps")(__dirname)`. Nothing here can overwrite it. |
| exploring this repository, or running the demo | `srv/app/` | Scanned automatically when resolving `?app_start=<class>` (see the [custom apps README](srv/app/README.md)). **Overwritten on every publish** — this repo is a generated artifact, so treat anything you leave here as disposable. |
| changing the demo app itself | `builder-cap2UI5:src/srv/app/` | That is the source this folder is generated from. |

The bundled samples and the framework classes live in the vendored core package
([`core/`](core/)), which is owned by the sync pipeline — never edit them.

#### 1. Hello World
###### App
```js
// z2ui5_cl_ui5_app_hi_world.js — ships with the core package
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_ui5_app_hi_world extends z2ui5_if_app {
  name = ``;

  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: `View`, ns: `mvc` })
        .a({ n: `xmlns`, v: `sap.m` })
        .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
        .a({ n: `xmlns:core`, v: `sap.ui.core` })
        // SimpleForm and its content aggregation live in sap.ui.layout.form,
        // not in the default sap.m namespace — an unprefixed <SimpleForm>
        // resolves to sap.m.SimpleForm, which does not exist, and the view
        // fails to LOAD rather than to render.
        .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });

      const form = view
        .ele({ n: `Shell` })
        .ele({ n: `Page` })
        .a({ n: `title`, v: `abap2UI5 - Hello World` })
        .ele({ n: `SimpleForm`, ns: `form` })
        .a({ n: `editable`, b: true })
        .ele({ n: `content`, ns: `form` });

      form
        .tag({ n: `Title`, ns: `core` })
        .a({ n: `text`, v: `Enter a value and send it to the server...` })
        .tag({ n: `Label` })
        .a({ n: `text`, v: `Name` })
        .tag({ n: `Input` })
        .a({ n: `value`, v: client._bind_edit(this.name) })
        .tag({ n: `Button` })
        .a({ n: `text`, v: `Send` })
        .a({ n: `press`, v: client._event(`BUTTON_POST`) });

      client.view_display(view.stringify());
    } else if (client.check_on_event(`BUTTON_POST`)) {
      client.message_box_display(`Your name is ${this.name}`);
    }
  }
}

module.exports = z2ui5_cl_ui5_app_hi_world;
```

The view builder writes raw XML: `ele()` opens an element and descends into
it, `tag()` adds a leaf and stays put, `a()` sets an attribute on whatever
was last opened, and `end()` climbs back to the parent. Nothing is mapped
for you — every element names its namespace and every attribute is spelled
exactly as UI5 expects it (`showIcon`, not `showicon`).
###### Demo
<img width="500" height="393" alt="image" src="https://github.com/user-attachments/assets/3acd8c43-3733-40b0-a6f9-27ae6beba6e7" />


####  2. Fetch Data via Remote Odata
###### Package.json
```json
      "northwind": {
        "kind": "odata-v2",
        "model": "srv/external/northwind",
        "credentials": {
          "url": "https://services.odata.org/V2/Northwind/Northwind.svc/"
        }
      }
```
###### App
```js
// srv/app/z2ui5_cl_app_read_odata.js — ships with the project
const cds = require("@sap/cds");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_read_odata extends z2ui5_if_app {
  customers = [];

  // Table, Column, ColumnListItem, Text and Input all live in sap.m, so they
  // ride the default namespace declared on the root.
  _view() {
    return z2ui5_cl_ui5_view_builder
      .factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` });
  }

  async main(client) {
    if (client.check_on_init()) {
      // The remote demo service may be unreachable (offline, proxy, service
      // down) — show the error in the UI instead of breaking the app init.
      try {
        const northwind = await cds.connect.to(`northwind`);
        this.customers = await northwind.run(
          SELECT.from(`Customers`).columns(`CompanyName`, `ContactName`).limit(20)
        );
      } catch (e) {
        const view = this._view();
        view
          .ele({ n: `Shell` })
          .ele({ n: `Page` })
          .a({ n: `title`, v: `abap2UI5 - Table with Data Fetched via Remote OData` })
          .tag({ n: `MessageStrip` })
          .a({ n: `text`, v: `Remote Northwind service not reachable: ${e.message}` })
          .a({ n: `type`, v: `Error` })
          .a({ n: `showIcon`, b: true })
          .a({ n: `class`, v: `sapUiSmallMargin` });
        client.view_display(view.stringify());
        client.message_box_display(`Remote Northwind service not reachable: ${e.message}`, `error`);
        return;
      }

      const view = this._view();
      const tab = view
        .ele({ n: `Shell` })
        .ele({ n: `Page` })
        .a({ n: `title`, v: `abap2UI5 - Table with Data Fetched via Remote OData` })
        .ele({ n: `Table` })
        .a({ n: `items`, v: client._bind_edit(this.customers) });

      const columns = tab.ele({ n: `columns` });
      columns.ele({ n: `Column` }).tag({ n: `Text` }).a({ n: `text`, v: `CompanyName` });
      columns.ele({ n: `Column` }).tag({ n: `Text` }).a({ n: `text`, v: `ContactName` });

      tab
        .ele({ n: `items` })
        .ele({ n: `ColumnListItem` })
        .ele({ n: `cells` })
        .tag({ n: `Input` })
        .a({ n: `value`, v: `{COMPANYNAME}` })
        .a({ n: `enabled`, b: true })
        .tag({ n: `Input` })
        .a({ n: `value`, v: `{CONTACTNAME}` })
        .a({ n: `enabled`, b: true });

      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_app_read_odata;
```

Note: the client model uppercases all property names — the cells bind
`{COMPANYNAME}`, not `{CompanyName}`.
##### Demo
![alt text](_media/image.png)

#### 3. Display a Server Side XML
###### View1.view.xml
```xml
<mvc:View
	controllerName="Quickstart.App"
	displayBlock="true"
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:l="sap.ui.layout"
	xmlns:core="sap.ui.core"
	xmlns:tnt="sap.tnt"
	xmlns="sap.m">
	<App id="app">
		<Page title="Create Enterprise-ready Web Apps with Ease">
			<l:BlockLayout background="Light">
				<l:BlockLayoutRow>
					<l:BlockLayoutCell>
						<core:Icon color="#1873B4" src="sap-icon://sap-ui5" size="5rem" class="sapUiSmallMarginBottom" width="100%"/>
						<Title level="H1" titleStyle="H1" text="This is UI5!" width="100%" textAlign="Center"/>
					</l:BlockLayoutCell>
				</l:BlockLayoutRow>
				<l:BlockLayoutRow>
					<l:BlockLayoutCell>
						<FlexBox items="{/features}" justifyContent="Center" wrap="Wrap" class="sapUiSmallMarginBottom">
							<tnt:InfoLabel text="{}" class="sapUiSmallMarginTop sapUiSmallMarginEnd"/>
						</FlexBox>
					</l:BlockLayoutCell>
				</l:BlockLayoutRow>
				<l:BlockLayoutRow>
					<l:BlockLayoutCell>
						<Panel headerText="Are you ready?" expandable="true">
							<Switch change=".onChange" customTextOn="yes" customTextOff="no"/>
							<l:HorizontalLayout id="ready" visible="false" class="sapUiSmallMargin">
								<Text text="Ok, let's get you started!" class="sapUiTinyMarginEnd"/>
								<Link text="Learn more" href="https://openui5.hana.ondemand.com/"/>
							</l:HorizontalLayout>
						</Panel>
					</l:BlockLayoutCell>
				</l:BlockLayoutRow>
			</l:BlockLayout>
		</Page>
	</App>
</mvc:View>
```
###### z2ui5_cl_app_read_view
```js
// z2ui5_cl_app_read_view.js — ships with the core package
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_read_view extends z2ui5_if_app {
  async main(client) {
    const fs = require("fs");
    const path = require("path");
    const viewPath = path.join(__dirname, "View1.view.xml");
    const viewContent = fs.readFileSync(viewPath, "utf8");
    client.view_display(viewContent);
  }
}

module.exports = z2ui5_cl_app_read_view;
```
###### Demo
![alt text](_media/image-1.png)

### Contribution
Contributions are welcome! Feel free to fork the project, submit issues, or create pull requests.

### License
This project is licensed under the MIT License.
