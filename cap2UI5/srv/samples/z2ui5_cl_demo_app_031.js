const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_031 extends z2ui5_if_app {
  mv_value = ``;
  client = null;
  app = { get: null, popup: `` };

  async main(client) {
    this.app.get = client.get();
    this.client = client;
    this.app.popup = ``;
    if (client.check_on_init()) {
      this.on_init();
    }
    if (this.app.get.event) {
      this.on_event();
    }
    this.view_display_main();
    this.popup_display_view();
    this.app.get = {};
  }

  on_event() {
    switch (this.app.get.event) {
      case `POPUP`:
        this.app.popup = `TEST`;
        break;
      case `DATA`:
        this.client.message_box_display(`Event raised value: ${this.mv_value}`);
        break;
      case `BACK`:
        this.client.nav_app_leave();
        break;
    }
  }

  on_init() {
    this.mv_value = `200`;
  }

  view_display_main() {
    const view = z2ui5_cl_xml_view.factory();
    const lv_xml = `<mvc:View ` + `\\n` + `xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"` + `\\n` + ` xmlns:form="sap.ui.layout.form">` + `\\n` + ` <form:SimpleForm editable="true" width="40rem">` + `\\n` + ` <Label text="Loading time" />` + `\\n` + ` <Input id="loadingMinSeconds" width="8rem" type="Number" description="seconds" value="` + this.client._bind(this.mv_value) + `"/>` + `\\n` + ` <Button text="BACK" type="Emphasized" press="` + this.client._event(`BACK`) + `"/>` + `\\n` + ` </form:SimpleForm> ` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Country-Specific Profit Margin" press="` + this.client._event(`POPUP`) + `"` + `\\n` + ` frameType="OneByHalf" subheader="Subtitle">` + `\\n` + ` <TileContent>` + `\\n` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title" press="` + this.client._event(`DATA`) + `"` + `\\n` + ` subheader="Subtitle" frameType= "TwoByHalf">` + `\\n` + ` <TileContent />` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type"` + `\\n` + ` subheader="Subtitle" press="press" frameType= "TwoByHalf">` + `\\n` + ` <TileContent unit="EUR" footer="Current Quarter">` + `\\n` + ` <ImageContent src="sap-icon://home-share" />` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Right click to open in new tab"` + `\\n` + ` subheader="Link tile" press="press" url="https://www.sap.com/">` + `\\n` + ` <TileContent>` + `\\n` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + `\\n` + ` subheader="Subtitle" press="press">` + `\\n` + ` <TileContent unit="EUR" footer="Current Quarter">` + `\\n` + ` <ImageContent src="sap-icon://home-share" />` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type"` + `\\n` + ` subheader="Subtitle" press="press">` + `\\n` + ` <TileContent>` + `\\n` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type With a Long Title Without an Icon"` + `\\n` + ` subheader="Subtitle Launch Tile" mode="HeaderMode" press="press">` + `\\n` + ` <TileContent unit="EUR" footer="Current Quarter" />` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Jessica D. Prince Senior Consultant"` + `\\n` + ` subheader="Department" press="press" appShortcut = "shortcut" systemInfo = "systeminfo">` + `\\n` + ` <TileContent>` + `\\n` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/ProfileImage_LargeGenTile.png" />` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + `\\n` + ` press="press" frameType= "OneByHalf">` + `\\n` + ` <TileContent unit="EUR" footer="Current Quarter">` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + `\\n` + ` press="press" frameType= "TwoByHalf">` + `\\n` + ` <TileContent unit="EUR" footer="Current Quarter">` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `\\n` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Jessica D. Prince Senior Consultant"` + `\\n` + ` subheader="Department" press="press" frameType="TwoByHalf">` + `\\n` + ` <TileContent>` + `\\n` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/ProfileImage_LargeGenTile.png" />` + `\\n` + ` </TileContent>` + `\\n` + ` </GenericTile>` + `\\n` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }

  popup_display_view() {
    if (this.app.popup === `TEST`) {
      const lv_xml = `<core:FragmentDefinition` + `\\n` + ` xmlns="sap.m"` + `\\n` + ` xmlns:core="sap.ui.core">` + `\\n` + ` <ViewSettingsDialog` + `\\n` + ` confirm="` + this.client._event_client(this.client.cs_event.popup_close) + `">` + `\\n` + ` <sortItems>` + `\\n` + ` <ViewSettingsItem text="Field 1" key="1" selected="true" />` + `\\n` + ` <ViewSettingsItem text="Field 2" key="2" />` + `\\n` + ` <ViewSettingsItem text="Field 3" key="3" />` + `\\n` + ` </sortItems>` + `\\n` + ` <groupItems>` + `\\n` + ` <ViewSettingsItem text="Field 1" key="1" selected="true" />` + `\\n` + ` <ViewSettingsItem text="Field 2" key="2" />` + `\\n` + ` <ViewSettingsItem text="Field 3" key="3" />` + `\\n` + ` </groupItems>` + `\\n` + ` <filterItems>` + `\\n` + ` <ViewSettingsFilterItem text="Field1" key="1">` + `\\n` + ` <items>` + `\\n` + ` <ViewSettingsItem text="Value A" key="1a" />` + `\\n` + ` <ViewSettingsItem text="Value B" key="1b" />` + `\\n` + ` <ViewSettingsItem text="Value C" key="1c" />` + `\\n` + ` </items>` + `\\n` + ` </ViewSettingsFilterItem>` + `\\n` + ` <ViewSettingsFilterItem text="Field2" key="2">` + `\\n` + ` <items>` + `\\n` + ` <ViewSettingsItem text="Value A" key="2a" />` + `\\n` + ` <ViewSettingsItem text="Value B" key="2b" />` + `\\n` + ` <ViewSettingsItem text="Value C" key="2c" />` + `\\n` + ` </items>` + `\\n` + ` </ViewSettingsFilterItem>` + `\\n` + ` <ViewSettingsFilterItem text="Field3" key="3">` + `\\n` + ` <items>` + `\\n` + ` <ViewSettingsItem text="Value A" key="3a" />` + `\\n` + ` <ViewSettingsItem text="Value B" key="3b" />` + `\\n` + ` <ViewSettingsItem text="Value C" key="3c" />` + `\\n` + ` </items>` + `\\n` + ` </ViewSettingsFilterItem>` + `\\n` + ` </filterItems>` + `\\n` + ` </ViewSettingsDialog>` + `\\n` + `</core:FragmentDefinition>`;
      this.client.popup_display(lv_xml);
    }
  }
}

module.exports = z2ui5_cl_demo_app_031;
