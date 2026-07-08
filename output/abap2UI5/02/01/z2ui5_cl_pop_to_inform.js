const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_to_inform extends z2ui5_if_app {
  client = null;
  title = ``;
  icon = ``;
  question_text = ``;
  button_text_confirm = ``;

  static factory({ i_text, i_title = `Information`, i_icon = `sap-icon://information`, i_button_text = `OK` } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_to_inform();
    r_result.title = z2ui5_cl_util.abap_copy(i_title);
    r_result.icon = z2ui5_cl_util.abap_copy(i_icon);
    r_result.question_text = z2ui5_cl_util.abap_copy(i_text);
    r_result.button_text_confirm = z2ui5_cl_util.abap_copy(i_button_text);
    return r_result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, icon: this.icon, afterclose: this.client._event(`BUTTON_CONFIRM`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      .text(this.question_text)
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: this.button_text_confirm, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (client.check_on_event(`BUTTON_CONFIRM`)) {
      client.popup_destroy();
      client.nav_app_leave();
    }
  }
}

module.exports = z2ui5_cl_pop_to_inform;
