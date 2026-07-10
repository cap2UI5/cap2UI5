[![sync pipeline](https://github.com/cap2UI5/cap2UI5/actions/workflows/sync.yml/badge.svg?branch=main)](https://github.com/cap2UI5/cap2UI5/actions/workflows/sync.yml)

# 🚀 cap2UI5

Bringing the [abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js.

> [!IMPORTANT]
> **Everything in this project is generated automatically.** The entire
> codebase, all documentation, and the
> [web version](https://github.com/cap2UI5/web-cap2UI5) were created by AI
> (Claude) and by an automated sync pipeline that mirrors and transpiles the
> upstream [abap2UI5](https://github.com/abap2UI5/abap2UI5) sources — nothing
> here is hand-written. See
> [docs/development.md](https://github.com/cap2UI5/cap2UI5/blob/main/docs/development.md)
> for how the pipeline works. Review and test before relying on it.

#### Features
* XML View Generation - Create UI5 views programmatically in your backend
* Data Binding & Exchange - Seamless two-way data binding between frontend and backend
* Session Management - Built-in persistence and session handling (optional)

#### Benefits
* Security
* Speed

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

## Transpiling from ABAP

App classes can be transpiled automatically from the abap2UI5 ABAP sources —
the transpiler and all other dev tooling live in the repository's `tools/`
folder, see
[docs/development.md](https://github.com/cap2UI5/cap2UI5/blob/main/docs/development.md).

## Samples
All samples demonstrate complete view definition and data exchange handled entirely by the CAP server, using the same and static frontend from abap2UI5.

Each app is a single `.js` file whose basename matches the class name it
exports (`module.exports`). Put your own apps into `srv/app/` (scanned
automatically when resolving `?app_start=<class>`, see the
[custom apps README](srv/app/README.md)) or into any folder registered via
`Z2UI5_APP_DIRS` / `require("abap2UI5/register-apps")(dir)` — see the
[discovery API](srv/app/samples/README.md#discovery-api). Don't use
`srv/app/samples/` or `srv/z2ui5/`, both are owned by the sync pipeline.

#### 1. Hello World
###### App
```js
// srv/z2ui5/02/z2ui5_cl_app_hello_world.js — ships with the project
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_hello_world extends z2ui5_if_app {
  name = ``;

  async main(client) {
    if (client.check_on_init()) {
      const view = z2ui5_cl_xml_view.factory()
        .shell()
        .page(`abap2UI5 - Hello World`)
        .simple_form({ editable: true })
        .content(`form`)
        .title({ ns: `core`, text: `Enter a value and send it to the server...` })
        .label(`Name`)
        .input(client._bind_edit(this.name))
        .button({ text: `Send`, press: client._event(`BUTTON_POST`) });
      client.view_display(view.stringify());
    } else if (client.check_on_event(`BUTTON_POST`)) {
      client.message_box_display(`Your name is ${this.name}`);
    }
  }
}

module.exports = z2ui5_cl_app_hello_world;
```
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
// srv/z2ui5/02/z2ui5_cl_app_read_view.js
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
