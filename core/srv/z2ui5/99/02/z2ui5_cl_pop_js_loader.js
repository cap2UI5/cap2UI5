const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_js_loader extends z2ui5_if_app {
  mv_is_open_ui5 = false;
  ui5_gav = ``;
  client = null;
  js = ``;
  user_command = ``;
  check_open_ui5 = false;

  static factory({ i_js, i_result = `LOADED` } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_js_loader();
    r_result.js = z2ui5_cl_util.abap_tab_assign(r_result.js, z2ui5_cl_util.abap_copy(i_js));
    r_result.user_command = z2ui5_cl_util.abap_tab_assign(r_result.user_command, z2ui5_cl_util.abap_copy(i_result));
    return r_result;
  }

  static factory_check_open_ui5() {
    let r_result = null;
    r_result = new z2ui5_cl_pop_js_loader();
    r_result.check_open_ui5 = true;
    return r_result;
  }

  result() {
    let result = ``;
    result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(this.user_command));
    return result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup().dialog(`Setup UI...`).content();
    if (this.js) {
      popup._z2ui5()
        .timer(this.client._event(`TIMER_FINISHED`))
        ._generic({ ns: `html`, name: `script` })
        ._cc_plain_xml(this.js);
    }
    if ((this.check_open_ui5 === true || this.check_open_ui5 === `X`)) {
      popup._z2ui5()
        .info_frontend({ finished: this.client._event(`INFO_FINISHED`), ui5_gav: this.client._bind_edit(this.ui5_gav) });
    }
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    switch (client.get().EVENT) {
      case `INFO_FINISHED`:
        this.mv_is_open_ui5 = (String(this.ui5_gav).toLowerCase().includes(String(`OPEN`).toLowerCase()));
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `TIMER_FINISHED`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_js_loader;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_js_loader, {
  factory: { preferred: `i_js`, params: [`i_js`, `i_result`] },
});

