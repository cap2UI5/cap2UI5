const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_file_ul extends z2ui5_if_app {
  ms_result = {};
  mv_path = ``;
  mv_value = ``;
  check_confirm_enabled = false;
  client = null;
  title = ``;
  question_text = ``;
  button_text_confirm = ``;
  button_text_cancel = ``;

  static factory({ i_text = `Choose the file to upload:`, i_title = `File Upload`, i_button_text_confirm = `OK`, i_button_text_cancel = `Cancel`, i_path } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_file_ul();
    r_result.title = i_title;
    r_result.question_text = i_text;
    r_result.button_text_confirm = i_button_text_confirm;
    r_result.button_text_cancel = i_button_text_cancel;
    r_result.mv_path = i_path;
    return r_result;
  }

  result() {
    let result = {};
    result = this.ms_result;
    return result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, afterclose: this.client._event(`BUTTON_CANCEL`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      .label(this.question_text)
      ._z2ui5()
      .file_uploader({ value: this.client._bind_edit(this.mv_value), path: this.client._bind_edit(this.mv_path), placeholder: `filepath here...`, upload: this.client._event(`UPLOAD`) })
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: this.button_text_cancel, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: this.button_text_confirm, press: this.client._event(`BUTTON_CONFIRM`), enabled: this.client._bind(this.check_confirm_enabled), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  async main(client) {
    let lv_data;
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    const lv_event = client.get().EVENT;
    switch (lv_event) {
      case `UPLOAD`:
        lv_data = z2ui5_cl_util.conv_get_xstring_by_data_uri(this.mv_value);
        this.ms_result.value = z2ui5_cl_util.conv_get_string_by_xstring(lv_data);
        this.check_confirm_enabled = true;
        this.mv_value = ``;
        this.mv_path = ``;
        client.popup_model_update();
        break;
      case `BUTTON_CONFIRM`:
      case `BUTTON_CANCEL`:
        this.ms_result.check_confirmed = (lv_event === `BUTTON_CONFIRM`);
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_file_ul;
