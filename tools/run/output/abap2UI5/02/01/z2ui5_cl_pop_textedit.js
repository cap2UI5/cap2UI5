const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_textedit extends z2ui5_if_app {
  mv_stretch_active = false;
  mv_title = ``;
  mv_check_editable = false;
  ms_result = {};
  client = null;

  static factory({ i_stretch_active = true, i_textarea, i_title = `Editor`, i_check_editable = false } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_textedit();
    r_result.mv_stretch_active = z2ui5_cl_util.abap_copy(i_stretch_active);
    r_result.ms_result.text = z2ui5_cl_util.abap_copy(i_textarea);
    r_result.mv_title = z2ui5_cl_util.abap_copy(i_title);
    r_result.mv_check_editable = z2ui5_cl_util.abap_copy(i_check_editable);
    return r_result;
  }

  display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ afterclose: this.client._event(`BUTTON_TEXTAREA_CANCEL`), stretch: this.mv_stretch_active, title: this.mv_title, icon: `sap-icon://edit` })
      .content()
      .text_area({ growing: true, editable: this.mv_check_editable, value: this.client._bind_edit(this.ms_result.text, { name: `ms_result-text` }) })
      .get_parent()
      .buttons()
      .button({ text: `Cancel`, press: this.client._event(`BUTTON_TEXTAREA_CANCEL`) })
      .button({ text: `Confirm`, press: this.client._event(`BUTTON_TEXTAREA_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.display();
      return;
    }
    switch (client.get().EVENT) {
      case `BUTTON_TEXTAREA_CONFIRM`:
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_TEXTAREA_CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }

  result() {
    let result = {};
    result = z2ui5_cl_util.abap_copy(this.ms_result);
    return result;
  }
}

module.exports = z2ui5_cl_pop_textedit;
