const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_122_0 extends z2ui5_if_app {
  ui5_version = ``;
  ui5_theme = ``;
  ui5_gav = ``;
  device_systemtype = ``;
  device_os = ``;
  device_browser = ``;
  device_phone = false;
  device_desktop = false;
  device_tablet = false;
  device_combi = false;
  device_height = ``;
  device_width = ``;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    this.client.view_display(view.shell().page({ title: `abap2UI5`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })._z2ui5().info_frontend({ finished: this.client._event(`INFO_FINISHED`), device_browser: this.client._bind_edit(this.device_browser), device_os: this.client._bind_edit(this.device_os), device_systemtype: this.client._bind_edit(this.device_systemtype), ui5_gav: this.client._bind_edit(this.ui5_gav), ui5_theme: this.client._bind_edit(this.ui5_theme), ui5_version: this.client._bind_edit(this.ui5_version), device_phone: this.client._bind_edit(this.device_phone), device_desktop: this.client._bind_edit(this.device_desktop), device_tablet: this.client._bind_edit(this.device_tablet), device_combi: this.client._bind_edit(this.device_combi), device_height: this.client._bind_edit(this.device_height), device_width: this.client._bind_edit(this.device_width) }).simple_form({ title: `Information`, editable: true }).content(`form`).label(`device_browser`).input(this.client._bind_edit(this.device_browser)).label(`device_os`).input(this.client._bind_edit(this.device_os)).label(`device_systemtype`).input(this.client._bind_edit(this.device_systemtype)).label(`ui5_gav`).input(this.client._bind_edit(this.ui5_gav)).label(`ui5_theme`).input(this.client._bind_edit(this.ui5_theme)).label(`ui5_version`).input(this.client._bind_edit(this.ui5_version)).label(`device_phone`).input(this.client._bind_edit(this.device_phone)).label(`device_desktop`).input(this.client._bind_edit(this.device_desktop)).label(`device_tablet`).input(this.client._bind_edit(this.device_tablet)).label(`device_combi`).input(this.client._bind_edit(this.device_combi)).label(`device_height`).input(this.client._bind_edit(this.device_height)).label(`device_width`).input(this.client._bind_edit(this.device_width)).stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    }
  }
}

module.exports = z2ui5_cl_demo_app_122_0;
