const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_031 extends z2ui5_if_app {
  mv_value = ``;
  client = null;
  app = { get: null, popup: `` };

  async main(client) {
    this.app.get = client.get();
    this.client = z2ui5_cl_util.abap_copy(client);
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
    const lv_xml = `<mvc:View ` + `
` + `xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc"` + `
` + `       xmlns:form="sap.ui.layout.form">` + `
` + `       <form:SimpleForm editable="true" width="40rem">` + `
` + `       <Label text="Loading time" />` + `
` + `       <Input id="loadingMinSeconds" width="8rem" type="Number" description="seconds" value="` + this.client._bind(this.mv_value) + `"/>` + `
` + `       <Button text="BACK" type="Emphasized" press="` + this.client._event(`BACK`) + `"/>` + `
` + `   </form:SimpleForm>  ` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Country-Specific Profit Margin"  press="` + this.client._event(`POPUP`) + `"` + `
` + `       frameType="OneByHalf" subheader="Subtitle">` + `
` + `       <TileContent>` + `
` + `           <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title" press="` + this.client._event(`DATA`) + `"` + `
` + `       subheader="Subtitle" frameType= "TwoByHalf">` + `
` + `       <TileContent />` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type"` + `
` + `       subheader="Subtitle" press="press" frameType= "TwoByHalf">` + `
` + `       <TileContent unit="EUR" footer="Current Quarter">` + `
` + `           <ImageContent src="sap-icon://home-share" />` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Right click to open in new tab"` + `
` + `       subheader="Link tile" press="press" url="https://www.sap.com/">` + `
` + `       <TileContent>` + `
` + `           <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + `
` + `       subheader="Subtitle" press="press">` + `
` + `       <TileContent unit="EUR" footer="Current Quarter">` + `
` + `           <ImageContent src="sap-icon://home-share" />` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type"` + `
` + `       subheader="Subtitle" press="press">` + `
` + `       <TileContent>` + `
` + `           <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/SAPLogoLargeTile_28px_height.png" />` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Manage Activity Master Data Type With a Long Title Without an Icon"` + `
` + `       subheader="Subtitle Launch Tile" mode="HeaderMode" press="press">` + `
` + `       <TileContent unit="EUR" footer="Current Quarter" />` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Jessica D. Prince Senior Consultant"` + `
` + `       subheader="Department" press="press" appShortcut = "shortcut" systemInfo = "systeminfo">` + `
` + `       <TileContent>` + `
` + `           <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/ProfileImage_LargeGenTile.png" />` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + `
` + `       press="press" frameType= "OneByHalf">` + `
` + `       <TileContent unit="EUR" footer="Current Quarter">` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Sales Fulfillment Application Title"` + `
` + `       press="press" frameType= "TwoByHalf">` + `
` + `       <TileContent unit="EUR" footer="Current Quarter">` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `
` + `   <GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" header="Jessica D. Prince Senior Consultant"` + `
` + `       subheader="Department" press="press" frameType="TwoByHalf">` + `
` + `       <TileContent>` + `
` + `           <ImageContent src="test-resources/sap/m/demokit/sample/GenericTileAsLaunchTile/images/ProfileImage_LargeGenTile.png" />` + `
` + `       </TileContent>` + `
` + `   </GenericTile>` + `
` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }

  popup_display_view() {
    let lv_xml;
    if (this.app.popup === `TEST`) {
      lv_xml = `<core:FragmentDefinition` + `
` + `  xmlns="sap.m"` + `
` + `  xmlns:core="sap.ui.core">` + `
` + `  <ViewSettingsDialog` + `
` + `      confirm="` + this.client._event_client(this.client.cs_event.popup_close) + `">` + `
` + `      <sortItems>` + `
` + `          <ViewSettingsItem text="Field 1" key="1" selected="true" />` + `
` + `          <ViewSettingsItem text="Field 2" key="2" />` + `
` + `          <ViewSettingsItem text="Field 3" key="3" />` + `
` + `      </sortItems>` + `
` + `      <groupItems>` + `
` + `          <ViewSettingsItem text="Field 1" key="1" selected="true" />` + `
` + `          <ViewSettingsItem text="Field 2" key="2" />` + `
` + `          <ViewSettingsItem text="Field 3" key="3" />` + `
` + `      </groupItems>` + `
` + `      <filterItems>` + `
` + `          <ViewSettingsFilterItem text="Field1" key="1">` + `
` + `              <items>` + `
` + `                  <ViewSettingsItem text="Value A" key="1a" />` + `
` + `                  <ViewSettingsItem text="Value B" key="1b" />` + `
` + `                  <ViewSettingsItem text="Value C" key="1c" />` + `
` + `              </items>` + `
` + `          </ViewSettingsFilterItem>` + `
` + `          <ViewSettingsFilterItem text="Field2" key="2">` + `
` + `              <items>` + `
` + `                  <ViewSettingsItem text="Value A" key="2a" />` + `
` + `                  <ViewSettingsItem text="Value B" key="2b" />` + `
` + `                  <ViewSettingsItem text="Value C" key="2c" />` + `
` + `              </items>` + `
` + `          </ViewSettingsFilterItem>` + `
` + `          <ViewSettingsFilterItem text="Field3" key="3">` + `
` + `              <items>` + `
` + `                  <ViewSettingsItem text="Value A" key="3a" />` + `
` + `                  <ViewSettingsItem text="Value B" key="3b" />` + `
` + `                  <ViewSettingsItem text="Value C" key="3c" />` + `
` + `              </items>` + `
` + `          </ViewSettingsFilterItem>` + `
` + `      </filterItems>` + `
` + `  </ViewSettingsDialog>` + `
` + `</core:FragmentDefinition>`;
      this.client.popup_display(lv_xml);
    }
  }
}

module.exports = z2ui5_cl_demo_app_031;
