# cap2UI5

[![sync pipeline](https://github.com/cap2UI5/cap2UI5/actions/workflows/sync.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/sync.yml)

Bringing the [abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to
CAP/Node.js: write complete UI5 apps as plain JavaScript classes in your
CAP backend — views, data binding and event handling included, no separate
frontend project needed.

> [!IMPORTANT]
> Everything in this project is generated automatically — by AI (Claude)
> and by a sync pipeline that mirrors and transpiles the upstream
> [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources. Review and test
> before relying on it. Details: [docs/development.md](docs/development.md).

## Features

* **XML View Generation** — create UI5 views programmatically in your backend
* **Data Binding & Exchange** — seamless two-way data binding between frontend and backend
* **Session Management** — built-in persistence and session handling (optional)

## Getting Started

Prerequisites: Node.js ≥ 20 and internet access (the frontend loads SAPUI5
from the CDN). No database setup is needed — CAP deploys an in-memory
SQLite automatically on startup.

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
view with the fluent `oView` API, bind data with `client._bind_edit(...)`,
react to events with `client._event(...)` — the framework handles the
roundtrip.

```js
class z2ui5_cl_app_hello_world {
  async main(client) {

    this.NAME ??= 'test';

    client.oView
      .Page({ title: "abap2UI5 - Hello World" })
      .Title({ text: "Make an input here and send it to the server..." })
      .Input({
        value: client._bind_edit(this.NAME),
        enabled: true
      })
      .Button({
        press: client._event('BUTTON_POST'),
        text: "Post"
      });
    client.display_view(client.oView.stringify());

  }
}
```

Open it with `?app_start=<class name>` as shown above. The full
app-developer guide — more worked examples (remote OData, server-side XML
views), project layout, deployment — lives in the CAP project:
**[cap2UI5/README.md](cap2UI5/README.md)**.

## Samples

Around 345 demo apps transpiled from
[abap2UI5/samples](https://github.com/abap2UI5/samples) ship with the
project — tables, popups, layouts, drafts and more. Browse them under
[`cap2UI5/srv/samples/`](cap2UI5/srv/samples/) (details in the
[samples README](cap2UI5/srv/samples/README.md)), start any of them via
`?app_start=<class>`, or try them without installing anything in the
[browser version](https://github.com/cap2UI5/web-cap2UI5).

## Repository layout

| Path | What it is |
|---|---|
| [`cap2UI5/`](cap2UI5/) | **the CAP project** — install, run and develop your apps here |
| [`docs/`](docs/) | internals documentation |
| [`tools/`](tools/) | dev tooling: ABAP→JS transpiler, sync scripts, jest suite |
| `input/`, `output/` | artifacts of the sync pipeline (mirrored upstream sources and transpiled output) |

## How this repository is built

The codebase is not written by hand: an automated pipeline mirrors the
upstream [abap2UI5](https://github.com/abap2UI5/abap2UI5) ABAP sources,
transpiles them to JavaScript and copies the result into the CAP project,
gated by the jest suite. How the pipeline, the transpiler and the dev
tooling work is documented in [docs/development.md](docs/development.md).

## License

This project is licensed under the MIT License.
