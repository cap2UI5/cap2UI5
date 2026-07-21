const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_122 extends z2ui5_if_app {
  ui5_version = ``;
  ui5_theme = ``;
  ui5_gav = ``;
  ui5_build_timestamp = ``;
  device_systemtype = ``;
  device_os = ``;
  device_os_version = ``;
  device_browser = ``;
  device_browser_version = ``;
  device_orientation = ``;
  device_phone = false;
  device_desktop = false;
  device_tablet = false;
  device_combi = false;
  device_touch = false;
  device_pointer = false;
  device_retina = false;
  device_height = ``;
  device_width = ``;
  client = null;

  read_frontend_info() {
    const ls_get = this.client.get();
    this.device_browser = z2ui5_cl_util.abap_tab_assign(this.device_browser, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.BROWSER.NAME));
    this.device_browser_version = z2ui5_cl_util.abap_tab_assign(this.device_browser_version, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.BROWSER.VERSION));
    this.device_os = z2ui5_cl_util.abap_tab_assign(this.device_os, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.OS.NAME));
    this.device_os_version = z2ui5_cl_util.abap_tab_assign(this.device_os_version, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.OS.VERSION));
    this.device_systemtype = z2ui5_cl_util.abap_tab_assign(this.device_systemtype, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.SYSTEM));
    this.device_orientation = z2ui5_cl_util.abap_tab_assign(this.device_orientation, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.ORIENTATION));
    this.device_height = (ls_get.S_DEVICE.RESIZE.HEIGHT);
    this.device_width = (ls_get.S_DEVICE.RESIZE.WIDTH);
    this.device_phone = (ls_get.S_DEVICE.SYSTEM === z2ui5_if_types.cs_device.system.phone);
    this.device_desktop = (ls_get.S_DEVICE.SYSTEM === z2ui5_if_types.cs_device.system.desktop);
    this.device_tablet = (ls_get.S_DEVICE.SYSTEM === z2ui5_if_types.cs_device.system.tablet);
    this.device_combi = (ls_get.S_DEVICE.SYSTEM === z2ui5_if_types.cs_device.system.combi);
    this.device_touch = z2ui5_cl_util.abap_tab_assign(this.device_touch, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.SUPPORT.TOUCH));
    this.device_pointer = z2ui5_cl_util.abap_tab_assign(this.device_pointer, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.SUPPORT.POINTER));
    this.device_retina = z2ui5_cl_util.abap_tab_assign(this.device_retina, z2ui5_cl_util.abap_copy(ls_get.S_DEVICE.SUPPORT.RETINA));
    this.ui5_version = z2ui5_cl_util.abap_tab_assign(this.ui5_version, z2ui5_cl_util.abap_copy(ls_get.S_UI5.VERSION));
    this.ui5_theme = z2ui5_cl_util.abap_tab_assign(this.ui5_theme, z2ui5_cl_util.abap_copy(ls_get.S_UI5.THEME));
    this.ui5_gav = z2ui5_cl_util.abap_tab_assign(this.ui5_gav, z2ui5_cl_util.abap_copy(ls_get.S_UI5.GAV));
    this.ui5_build_timestamp = z2ui5_cl_util.abap_tab_assign(this.ui5_build_timestamp, z2ui5_cl_util.abap_copy(ls_get.S_UI5.BUILD_TIMESTAMP));
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Reads frontend information from the client - UI5 version and theme plus device, ` + `OS and browser details - and shows each value in a read-only form.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.simple_form({ title: `Information`, editable: true })
      .content(`form`)
      .label(`device_browser`)
      .input({ value: this.client._bind(this.device_browser), enabled: false })
      .label(`device_browser_version`)
      .input({ value: this.client._bind(this.device_browser_version), enabled: false })
      .label(`device_os`)
      .input({ value: this.client._bind(this.device_os), enabled: false })
      .label(`device_os_version`)
      .input({ value: this.client._bind(this.device_os_version), enabled: false })
      .label(`device_systemtype`)
      .input({ value: this.client._bind(this.device_systemtype), enabled: false })
      .label(`device_orientation`)
      .input({ value: this.client._bind(this.device_orientation), enabled: false })
      .label(`device_height`)
      .input({ value: this.client._bind(this.device_height), enabled: false })
      .label(`device_width`)
      .input({ value: this.client._bind(this.device_width), enabled: false })
      .label(`device_phone`)
      .input({ value: this.client._bind(this.device_phone), enabled: false })
      .label(`device_desktop`)
      .input({ value: this.client._bind(this.device_desktop), enabled: false })
      .label(`device_tablet`)
      .input({ value: this.client._bind(this.device_tablet), enabled: false })
      .label(`device_combi`)
      .input({ value: this.client._bind(this.device_combi), enabled: false })
      .label(`device_touch`)
      .input({ value: this.client._bind(this.device_touch), enabled: false })
      .label(`device_pointer`)
      .input({ value: this.client._bind(this.device_pointer), enabled: false })
      .label(`device_retina`)
      .input({ value: this.client._bind(this.device_retina), enabled: false })
      .label(`ui5_version`)
      .input({ value: this.client._bind(this.ui5_version), enabled: false })
      .label(`ui5_theme`)
      .input({ value: this.client._bind(this.ui5_theme), enabled: false })
      .label(`ui5_gav`)
      .input({ value: this.client._bind(this.ui5_gav), enabled: false })
      .label(`ui5_build_timestamp`)
      .input({ value: this.client._bind(this.ui5_build_timestamp), enabled: false });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.read_frontend_info();
      this.view_display();
    }
  }
}

module.exports = z2ui5_cl_demo_app_122;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_types = require("abap2UI5/z2ui5_if_types");

