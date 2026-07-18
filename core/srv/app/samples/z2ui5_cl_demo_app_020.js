const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_020 extends z2ui5_if_app {
  text = ``;
  cancel_text = ``;
  cancel_event = ``;
  confirm_text = ``;
  confirm_event = ``;
  event = ``;

  static factory({ i_text, i_cancel_text, i_cancel_event, i_confirm_text, i_confirm_event } = {}) {
    let result = null;
    result = new z2ui5_cl_demo_app_020();
    result.text = z2ui5_cl_util.abap_tab_assign(result.text, z2ui5_cl_util.abap_copy(i_text));
    result.cancel_text = z2ui5_cl_util.abap_tab_assign(result.cancel_text, z2ui5_cl_util.abap_copy(i_cancel_text));
    result.cancel_event = z2ui5_cl_util.abap_tab_assign(result.cancel_event, z2ui5_cl_util.abap_copy(i_cancel_event));
    result.confirm_text = z2ui5_cl_util.abap_tab_assign(result.confirm_text, z2ui5_cl_util.abap_copy(i_confirm_text));
    result.confirm_event = z2ui5_cl_util.abap_tab_assign(result.confirm_event, z2ui5_cl_util.abap_copy(i_confirm_event));
    return result;
  }

  async main(client) {
    switch (client.get().EVENT) {
      case this.cancel_event:
      case this.confirm_event:
        this.event = z2ui5_cl_util.struct_lower_keys(client.get().EVENT);
        client.popup_destroy();
        client.nav_app_leave();
        return;
        break;
    }
    client.popup_display(z2ui5_cl_xml_view.factory_popup().dialog(`abap2UI5 - Popup to decide`).vbox().text(this.text).get_parent().buttons().button({ text: this.cancel_text, press: client._event(this.cancel_event) }).button({ text: this.confirm_text, press: client._event(this.confirm_event), type: `Emphasized` }).stringify());
  }
}

module.exports = z2ui5_cl_demo_app_020;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

