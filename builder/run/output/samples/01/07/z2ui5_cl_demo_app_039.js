const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_039 extends z2ui5_if_app {
  mv_value = ``;
  client = null;
  app = { get: null };

  async main(client) {
    this.app.get = client.get();
    this.client = z2ui5_cl_util.abap_copy(client);
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
    if (this.client.check_on_event(`POPUP`)) {
      this.client.message_box_display(`Event raised value: ${this.mv_value}`);
    } else if (this.client.check_on_event(`BACK`)) {
      this.client.nav_app_leave();
    }
  }

  on_init() {
    this.mv_value = `200`;
  }

  view_display_main() {
    const lv_xml = `<mvc:View` + ` ` + `xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"` + ` ` + ` xmlns:form="sap.ui.layout.form">` + ` ` + ` <Page title="Extension - import xml view 2" showNavButton="true" navButtonPress="` + this.client._event(`BACK`) + `">` + ` ` + ` <form:SimpleForm editable="true" width="40rem">` + ` ` + ` <Label text="Loading time" />` + ` ` + ` <Input id="loadingMinSeconds" width="8rem" type="Number" description="seconds" value="-1"/>` + ` ` + ` <Button text="Start loading" type="Emphasized" press="onFormSubmit"/>` + ` ` + ` </form:SimpleForm> ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Country-Specific Profit Margin" press="onPress"` + ` ` + ` frameType="OneByHalf" subheader="Subtitle">` + ` ` + ` <TileContent>` + ` ` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + ` ` + ` subheader="Subtitle" press="press" frameType= "TwoByHalf">` + ` ` + ` <TileContent />` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type"` + ` ` + ` subheader="Subtitle" press="press" frameType= "TwoByHalf">` + ` ` + ` <TileContent unit="EUR" footer="Current Quarter">` + ` ` + ` <ImageContent src="sap-icon://home-share" />` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Right click to open in new tab"` + ` ` + ` subheader="Link tile" press="press" url="https://www.sap.com/">` + ` ` + ` <TileContent>` + ` ` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + ` ` + ` subheader="Subtitle" press="press">` + ` ` + ` <TileContent unit="EUR" footer="Current Quarter">` + ` ` + ` <ImageContent src="sap-icon://home-share" />` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type"` + ` ` + ` subheader="Subtitle" press="press">` + ` ` + ` <TileContent>` + ` ` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type With a Long Title Without an Icon"` + ` ` + ` subheader="Subtitle Launch Tile" mode="HeaderMode" press="press">` + ` ` + ` <TileContent unit="EUR" footer="Current Quarter" />` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Jessica D. Prince Senior Consultant"` + ` ` + ` subheader="Department" press="press" appShortcut = "shortcut" systemInfo = "systeminfo">` + ` ` + ` <TileContent>` + ` ` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/ProfileImage_LargeGenTile.png" />` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + ` ` + ` press="press" frameType= "OneByHalf">` + ` ` + ` <TileContent unit="EUR" footer="Current Quarter">` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + ` ` + ` press="press" frameType= "TwoByHalf">` + ` ` + ` <TileContent unit="EUR" footer="Current Quarter">` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` ` + ` <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Jessica D. Prince Senior Consultant"` + ` ` + ` subheader="Department" press="press" frameType="TwoByHalf">` + ` ` + ` <TileContent>` + ` ` + ` <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/ProfileImage_LargeGenTile.png" />` + ` ` + ` </TileContent>` + ` ` + ` </GenericTile>` + ` ` + ` </Page>` + ` ` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }

  popup_display_view() {
    this.client.popup_display(`<core:FragmentDefinition` + ` ` + ` xmlns="sap.m"` + ` ` + ` xmlns:core="sap.ui.core">` + ` ` + ` <ViewSettingsDialog` + ` ` + ` confirm="handleConfirm">` + ` ` + ` <sortItems>` + ` ` + ` <ViewSettingsItem text="Field 1" key="1" selected="true" />` + ` ` + ` <ViewSettingsItem text="Field 2" key="2" />` + ` ` + ` <ViewSettingsItem text="Field 3" key="3" />` + ` ` + ` </sortItems>` + ` ` + ` <groupItems>` + ` ` + ` <ViewSettingsItem text="Field 1" key="1" selected="true" />` + ` ` + ` <ViewSettingsItem text="Field 2" key="2" />` + ` ` + ` <ViewSettingsItem text="Field 3" key="3" />` + ` ` + ` </groupItems>` + ` ` + ` <filterItems>` + ` ` + ` <ViewSettingsFilterItem text="Field1" key="1">` + ` ` + ` <items>` + ` ` + ` <ViewSettingsItem text="Value A" key="1a" />` + ` ` + ` <ViewSettingsItem text="Value B" key="1b" />` + ` ` + ` <ViewSettingsItem text="Value C" key="1c" />` + ` ` + ` </items>` + ` ` + ` </ViewSettingsFilterItem>` + ` ` + ` <ViewSettingsFilterItem text="Field2" key="2">` + ` ` + ` <items>` + ` ` + ` <ViewSettingsItem text="Value A" key="2a" />` + ` ` + ` <ViewSettingsItem text="Value B" key="2b" />` + ` ` + ` <ViewSettingsItem text="Value C" key="2c" />` + ` ` + ` </items>` + ` ` + ` </ViewSettingsFilterItem>` + ` ` + ` <ViewSettingsFilterItem text="Field3" key="3">` + ` ` + ` <items>` + ` ` + ` <ViewSettingsItem text="Value A" key="3a" />` + ` ` + ` <ViewSettingsItem text="Value B" key="3b" />` + ` ` + ` <ViewSettingsItem text="Value C" key="3c" />` + ` ` + ` </items>` + ` ` + ` </ViewSettingsFilterItem>` + ` ` + ` </filterItems>` + ` ` + ` </ViewSettingsDialog>` + ` ` + `</core:FragmentDefinition>`);
  }
}

module.exports = z2ui5_cl_demo_app_039;
