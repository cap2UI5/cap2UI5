const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_122 extends z2ui5_if_app {
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
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Device - Frontend Info: UI5 Version, Theme, OS, Browser` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Reads frontend information from the client - UI5 version and theme plus device, ` + `OS and browser details - and shows each value in a read-only form.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Information` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `device_browser` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_browser) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_browser_version` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_browser_version) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_os` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_os) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_os_version` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_os_version) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_systemtype` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_systemtype) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_orientation` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_orientation) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_height` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_height) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_width` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_width) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_phone` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_phone) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_desktop` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_desktop) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_tablet` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_tablet) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_combi` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_combi) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_touch` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_touch) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_pointer` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_pointer) })
      .tag(`Label`)
      .a({ n: `text`, v: `device_retina` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.device_retina) })
      .tag(`Label`)
      .a({ n: `text`, v: `ui5_version` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.ui5_version) })
      .tag(`Label`)
      .a({ n: `text`, v: `ui5_theme` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.ui5_theme) })
      .tag(`Label`)
      .a({ n: `text`, v: `ui5_gav` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.ui5_gav) })
      .tag(`Label`)
      .a({ n: `text`, v: `ui5_build_timestamp` })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.ui5_build_timestamp) });
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

module.exports = z2ui5_cl_smp_app_122;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_types = require("abap2UI5/z2ui5_if_types");

