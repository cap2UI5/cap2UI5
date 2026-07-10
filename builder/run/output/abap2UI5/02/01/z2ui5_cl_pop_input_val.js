const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_input_val extends z2ui5_if_app {
  ms_result = {};
  client = null;
  title = ``;
  question_text = ``;
  button_text_confirm = ``;
  button_text_cancel = ``;

  static factory({ text = `Enter New Value`, val, title = `Popup Input Value`, button_text_confirm = `OK`, button_text_cancel = `Cancel` } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_input_val();
    r_result.title = z2ui5_cl_util.abap_copy(title);
    r_result.question_text = z2ui5_cl_util.abap_copy(text);
    r_result.button_text_confirm = z2ui5_cl_util.abap_copy(button_text_confirm);
    r_result.button_text_cancel = z2ui5_cl_util.abap_copy(button_text_cancel);
    r_result.ms_result.value = z2ui5_cl_util.abap_copy(val);
    return r_result;
  }

  result() {
    let result = {};
    result = z2ui5_cl_util.abap_copy(this.ms_result);
    return result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, afterclose: this.client._event(`BUTTON_CANCEL`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      .label(this.question_text)
      .input({ value: this.client._bind_edit(this.ms_result.value, { name: `ms_result-value` }), submit: this.client._event(`BUTTON_CONFIRM`) })
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: this.button_text_cancel, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: this.button_text_confirm, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    const lv_event = client.get().EVENT;
    switch (lv_event) {
      case `BUTTON_CONFIRM`:
      case `BUTTON_CANCEL`:
        this.ms_result.check_confirmed = (lv_event === `BUTTON_CONFIRM`);
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_input_val, {
  factory: { preferred: `val`, params: [`text`, `val`, `title`, `button_text_confirm`, `button_text_cancel`] },
});

module.exports = z2ui5_cl_pop_input_val;
