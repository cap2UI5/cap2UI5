const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_355 extends z2ui5_if_app {
  wlan = false;
  flight = false;
  high_perf = false;
  battery = false;
  price = ``;
  address = ``;
  country = ``;
  volume = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    }
  }

  on_init() {
    this.wlan = true;
    this.flight = true;
    this.high_perf = true;
    this.price = `799`;
    this.address = `Main Rd, Manchester`;
    this.country = `GR`;
    this.volume = `7`;
    this.view_display();
  }

  view_display() {
    const xml = `<mvc:View displayBlock="true" height="100%" xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc">` + ` <Shell>` + ` <Page` + ` title="abap2UI5 - InputListItem"` + ` showNavButton="${this.client.check_app_prev_stack()}"` + ` navButtonPress="${this.client._event_nav_app_leave()}">` + ` <headerContent>` + ` <Link` + ` href="https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.InputListItem/sample/sap.m.sample.InputListItem"` + ` target="_blank"` + ` text="UI5 Demo Kit"/>` + ` </headerContent>` + ` <List headerText="Input">` + ` <InputListItem label="WLAN">` + ` <Switch state="${this.client._bind_edit(this.wlan)}"/>` + ` </InputListItem>` + ` <InputListItem label="Flight Mode">` + ` <CheckBox selected="${this.client._bind_edit(this.flight)}"/>` + ` </InputListItem>` + ` <InputListItem label="High Performance">` + ` <RadioButton groupName="GroupPerf" selected="${this.client._bind_edit(this.high_perf)}"/>` + ` </InputListItem>` + ` <InputListItem label="Battery Saving">` + ` <RadioButton groupName="GroupPerf" selected="${this.client._bind_edit(this.battery)}"/>` + ` </InputListItem>` + ` <InputListItem label="Price (EUR)">` + ` <Input placeholder="Price" type="Number" value="${this.client._bind_edit(this.price)}"/>` + ` </InputListItem>` + ` <InputListItem label="Address">` + ` <Input placeholder="Address" value="${this.client._bind_edit(this.address)}"/>` + ` </InputListItem>` + ` <InputListItem label="Country">` + ` <Select selectedKey="${this.client._bind_edit(this.country)}">` + ` <core:Item key="GR" text="Greece"/>` + ` <core:Item key="MX" text="Mexico"/>` + ` <core:Item key="NO" text="Norway"/>` + ` <core:Item key="NZ" text="New Zealand"/>` + ` <core:Item key="NL" text="Netherlands"/>` + ` </Select>` + ` </InputListItem>` + ` <InputListItem label="Volume">` + ` <HBox justifyContent="End">` + ` <Slider max="10" min="0" value="${this.client._bind_edit(this.volume)}" width="200px"/>` + ` </HBox>` + ` </InputListItem>` + ` </List>` + ` </Page>` + ` </Shell>` + `</mvc:View>`;
    this.client.view_display(xml);
  }
}

module.exports = z2ui5_cl_demo_app_355;
