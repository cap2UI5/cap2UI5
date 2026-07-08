const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_html extends z2ui5_if_app {
  client = null;
  title = ``;
  icon = ``;
  html = ``;
  button_text_confirm = ``;

  static factory({ i_html, i_title = `HTML View`, i_icon = `sap-icon://hint`, i_button_text = `OK` } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_html();
    r_result.title = i_title;
    r_result.icon = i_icon;
    r_result.html = i_html;
    r_result.button_text_confirm = i_button_text;
    return r_result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, icon: this.icon, afterclose: this.client._event(`BUTTON_CONFIRM`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      .html(this.html)
      .get_parent()
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: this.button_text_confirm, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;
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

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_html, {
  factory: { preferred: `i_html`, params: [`i_html`, `i_title`, `i_icon`, `i_button_text`] },
});

module.exports = z2ui5_cl_pop_html;
