# cap2UI5

[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)
[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

Bringing the [abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to
CAP/Node.js: write complete UI5 apps as plain JavaScript classes in your
CAP backend — views, data binding and event handling included, no separate
frontend project needed.

> [!IMPORTANT]
> Everything in this project is generated automatically — by AI (Claude)
> and by a sync pipeline that mirrors and transpiles the upstream
> [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources. Review and test
> before relying on it. Details: [builder/development.md](builder/development.md).

## Features

* **XML View Generation** — create UI5 views programmatically in your backend
* **Data Binding & Exchange** — seamless two-way data binding between frontend and backend
* **Session Management** — built-in persistence and session handling (optional)

## Getting Started

Prerequisites: Node.js ≥ 20 and internet access (the frontend loads SAPUI5
from the CDN). No database setup is needed — CAP deploys an in-memory
SQLite automatically on startup.

> [!NOTE]
> GitHub Codespaces and VS Code Dev Containers pick up the Node 20 image
> from [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json)
> automatically. If you are on an older container (e.g. Node 16, where
> `cds watch` aborts with *"Node.js version 20 or higher is required"*),
> switch with `nvm install 20 && nvm use 20` — the pinned version lives in
> [`.nvmrc`](.nvmrc).

```bash
# from the repository root
cd cap2UI5
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
| `http://localhost:4004/z2ui5/webapp/index.html?app_start=z2ui5_cl_app_hello_world` | start a specific app class via the `app_start` parameter (works for every sample, e.g. `z2ui5_cl_demo_app_001`) |
| `http://localhost:4004/rest/root/z2ui5` | the roundtrip endpoint the frontend talks to |

For a one-off run without file watching use `npm start` (`cds-serve`).

## Writing your first app

An app is a single JavaScript class with a `main(client)` method: build the
view with the fluent view API, bind data with `client._bind_edit(...)`,
react to events with `client._event(...)` — the framework handles the
roundtrip.

Create the file in **`cap2UI5/srv/app/`** — the folder that collects this
project's custom apps, scanned by the framework when resolving
`?app_start=<class>`. The file's basename must match the class name, and the
class must export itself:

```js
// cap2UI5/srv/app/z2ui5_cl_app_my_first_app.js
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_my_first_app extends z2ui5_if_app {
  name = ``;

  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_xml_view.factory()
        .shell()
        .page(`abap2UI5 - Hello World`)
        .simple_form({ editable: true })
        .content(`form`)
        .label(`Name`)
        .input(client._bind_edit(this.name))
        .button({ text: `Send`, press: client._event(`BUTTON_POST`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`BUTTON_POST`)) {
      client.message_box_display(`Your name is ${this.name}`);
    }
  }
}

module.exports = z2ui5_cl_app_my_first_app;
```

`cds watch` picks the new file up automatically — open

```
http://localhost:4004/z2ui5/webapp/index.html?app_start=z2ui5_cl_app_my_first_app
```

`cap2UI5/srv/app/` is the place for your own apps — it sits outside the
transpiled framework tree and is never touched by the sync pipeline (see the
[custom apps README](cap2UI5/srv/app/README.md)). Don't put your own apps into
`cap2UI5/srv/app/samples/` or `cap2UI5/srv/z2ui5/` — both are owned by the sync
pipeline and get overwritten on every sync. To keep your apps in a separate
repo entirely, put them in any folder and register it via the
`Z2UI5_APP_DIRS` environment variable (`PATH`-style list) or
`require("abap2UI5/register-apps")(dir)` — see the
[discovery API](cap2UI5/srv/app/samples/README.md#discovery-api).

### Calling a remote OData service

A remote service is already preconfigured in
[`cap2UI5/package.json`](cap2UI5/package.json) — the public Northwind demo
service:

```json
"northwind": {
  "kind": "odata-v2",
  "model": "srv/external/northwind",
  "credentials": {
    "url": "https://services.odata.org/V2/Northwind/Northwind.svc/"
  }
}
```

Consume it inside an app with the standard CAP APIs (`cds.connect.to`,
`SELECT`) and show the result in a table. One thing to know: the client
model uppercases all property names, so the table cells bind
`{COMPANYNAME}` — not `{CompanyName}`:

```js
// cap2UI5/srv/app/z2ui5_cl_app_read_odata.js — ships with the project
const cds = require("@sap/cds");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_read_odata extends z2ui5_if_app {
  customers = [];

  async main(client) {
    if (client.check_on_init()) {
      const northwind = await cds.connect.to(`northwind`);
      this.customers = await northwind.run(
        SELECT.from(`Customers`).columns(`CompanyName`, `ContactName`).limit(20)
      );

      const view = z2ui5_cl_xml_view.factory();
      const tab = view.shell()
        .page(`abap2UI5 - Table with Data Fetched via Remote OData`)
        .table({ items: client._bind_edit(this.customers) });
      tab.columns()
        .column().text(`CompanyName`).get_parent()
        .column().text(`ContactName`);
      tab.items()
        .column_list_item()
        .cells()
        .input({ value: `{COMPANYNAME}`, enabled: true })
        .input({ value: `{CONTACTNAME}`, enabled: true });
      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_app_read_odata;
```

This app ships with the project, so you can try it right away:

```
http://localhost:4004/z2ui5/webapp/index.html?app_start=z2ui5_cl_app_read_odata
```

The full app-developer guide — more worked examples, project layout,
deployment — lives in the CAP project:
**[cap2UI5/README.md](cap2UI5/README.md)**.

## Samples

Around 345 demo apps transpiled from
[abap2UI5/samples](https://github.com/abap2UI5/samples) ship with the
project — tables, popups, layouts, drafts and more. Browse them under
[`cap2UI5/srv/app/samples/`](cap2UI5/srv/app/samples/) (details in the
[samples README](cap2UI5/srv/app/samples/README.md)), start any of them via
`?app_start=<class>`, or try them without installing anything in the
[browser version](https://github.com/cap2UI5/web-cap2UI5).

## Repository layout

The repository holds **two separate npm projects**, each installed and run on
its own:

| Path | What it is |
|---|---|
| [`cap2UI5/`](cap2UI5/) | **the CAP project** — the finished, deployable app; install, run and develop your apps here (`cd cap2UI5 && npm install && npx cds watch`) |
| [`builder/`](builder/) | **the builder project** — ABAP→JS transpiler, sync scripts, jest suite; its own `package.json` (`cd builder && npm install && npm test`) |
| [`docs/`](docs/) | internals documentation |
| `builder/run/input/`, `builder/run/output/` | artifacts of the sync pipeline (mirrored upstream sources and transpiled output) |

## How this repository is built

The codebase is not written by hand: an automated pipeline mirrors the
upstream [abap2UI5](https://github.com/abap2UI5/abap2UI5) ABAP sources,
transpiles them to JavaScript and copies the result into the CAP project,
gated by the jest suite. How the pipeline, the transpiler and the dev
tooling work is documented in [builder/development.md](builder/development.md).

## Workflows

**Continuous integration**

[![test](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/test.yml)

**Nightly sync pipelines** — each runs on its own schedule (see
[Sync pipelines](builder/development.md#sync-pipelines)):

[![update_samples](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_samples.yml)
[![update_backend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_backend.yml)
[![update_frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/update_frontend.yml)

**Manual triggers** (`workflow_dispatch`)

[![trigger update](https://github.com/cap2UI5/cap2UI5/actions/workflows/trigger_update.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/trigger_update.yml)
[![trigger web](https://github.com/cap2UI5/cap2UI5/actions/workflows/trigger_web.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/trigger_web.yml)

**Reusable pipeline steps** — invoked via `workflow_call` from the
pipelines above, so these badges stay grey unless a step is dispatched
standalone:

_samples_ &nbsp;
[![samples mirror](https://github.com/cap2UI5/cap2UI5/actions/workflows/samples_mirror.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/samples_mirror.yml)
[![samples transpile](https://github.com/cap2UI5/cap2UI5/actions/workflows/samples_transpile.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/samples_transpile.yml)
[![samples to CAP](https://github.com/cap2UI5/cap2UI5/actions/workflows/samples_to_cap.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/samples_to_cap.yml)

_backend_ &nbsp;
[![abap2UI5 mirror](https://github.com/cap2UI5/cap2UI5/actions/workflows/abap2ui5_mirror.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/abap2ui5_mirror.yml)
[![abap2UI5 transpile](https://github.com/cap2UI5/cap2UI5/actions/workflows/abap2ui5_transpile.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/abap2ui5_transpile.yml)
[![abap2UI5 to CAP](https://github.com/cap2UI5/cap2UI5/actions/workflows/abap2ui5_to_cap.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/abap2ui5_to_cap.yml)

_frontend_ &nbsp;
[![app mirror](https://github.com/cap2UI5/cap2UI5/actions/workflows/app_mirror.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/app_mirror.yml)
[![app to CAP](https://github.com/cap2UI5/cap2UI5/actions/workflows/app_to_cap.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/app_to_cap.yml)

## License

This project is licensed under the MIT License.
