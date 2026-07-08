const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_error extends z2ui5_if_app {
  client = null;
  error = null;
  title = ``;

  static factory({ x_root, i_title = `Error` } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_error();
    r_result.error = z2ui5_cl_util.abap_copy(x_root);
    r_result.title = z2ui5_cl_util.abap_copy(i_title);
    return r_result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, afterclose: this.client._event(`BUTTON_CONFIRM`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      .text(this.error.get_text())
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: `OK`, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
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

module.exports = z2ui5_cl_pop_error;
