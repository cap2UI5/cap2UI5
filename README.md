[![mirror frontend](https://github.com/cap2UI5/cap2UI5/actions/workflows/mirror_frontend.yml/badge.svg)](https://github.com/cap2UI5/cap2UI5/actions/workflows/mirror_frontend.yml)

# 🚀 cap2UI5

Bringing the [abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js.

#### Features
* XML creation in the backend
* Data binding and exchange
* Persistence and session handling

#### Quick Demo

Run the following command to start the project:
``` 
npx cds w
```

## Example 1 : Hello World
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
##### Demo
![alt text](media/image-2.png)

### Example 2 : Fetch Data via Remote Odata
##### Package.json
```json
      "northwind": {
        "kind": "odata-v2",
        "model": "srv/external/northwind",
        "credentials": {
          "url": "https://services.odata.org/V2/Northwind/Northwind.svc/"
        }
      }
```
##### App
```js
class z2ui5_cl_app_read_odata {

  async main(client) {
    this.client = client;
    await this.fetchData();
    this.displayView(client);
  }

  async fetchData() {
    const northwindAPI = await cds.connect.to("northwind");
    this.aCustomers = await northwindAPI.run(SELECT.from("Customers"));
  }

  displayView(client) {
    const Z2UI5_CL_XML_VIEW = require("../abap2ui5/02/z2ui5_cl_xml_view");
    var oView = new Z2UI5_CL_XML_VIEW();
    var oPage = oView.Page({ title: "abap2UI5 - Table with Data Fetched via remote OData" });

    var oTab = oPage.Table({ items: client._bind_edit(this.aCustomers) });
    var oColumns = oTab.columns();
    oColumns.Column().Text({ text: `CompanyName` });
    oColumns.Column().Text({ text: `ContactName` });

    oTab
      .items()
      .ColumnListItem()
      .cells()
      .Input({ value: `{CompanyName}`, enabled: true })
      .Input({ value: `{ContactName}`, enabled: true });

    client.display_view(oView.stringify());
  }
}
```
##### Demo
![alt text](media/image.png)

### Example 3 : Display a Server Side XML
##### View1.view.xml
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
class z2ui5_cl_app_read_view {

  async main(client) {

    this.client = client;
    const fs = require("fs");
    const path = require("path");
    const viewPath = path.join(__dirname, "View1.view.xml");
    const viewContent = fs.readFileSync(viewPath, "utf8");
    client.display_view(viewContent);
  }
}

module.exports = z2ui5_cl_app_read_view;

```
##### Demo
![alt text](media/image-1.png)

### Contribution
Contributions are welcome! Feel free to fork the project, submit issues, or create pull requests.

### License
This project is licensed under the MIT License.
