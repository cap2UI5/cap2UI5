const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_file_dl extends z2ui5_if_app {
  mv_name = ``;
  mv_type = ``;
  mv_size = ``;
  mv_value = ``;
  mv_check_download = false;
  check_confirmed = false;
  client = null;
  title = ``;
  question_text = ``;
  button_text_confirm = ``;
  button_text_cancel = ``;

  static factory({ i_text = `Choose the file to download:`, i_title = `File Download`, i_button_text_confirm = `Download`, i_button_text_cancel = `Cancel`, i_file, i_type = `data:text/csv;base64,`, i_name } = {}) {
    let r_result = null;
    let lv_size_kb = 0;
    r_result = new z2ui5_cl_pop_file_dl();
    r_result.title = z2ui5_cl_util.abap_copy(i_title);
    r_result.question_text = z2ui5_cl_util.abap_copy(i_text);
    r_result.button_text_confirm = z2ui5_cl_util.abap_copy(i_button_text_confirm);
    r_result.button_text_cancel = z2ui5_cl_util.abap_copy(i_button_text_cancel);
    r_result.mv_type = z2ui5_cl_util.abap_copy(i_type);
    r_result.mv_name = z2ui5_cl_util.abap_copy(i_name);
    r_result.mv_value = z2ui5_cl_util.abap_copy(i_file);
    lv_size_kb = z2ui5_cl_util.abap_div(i_file.length, 1000);
    r_result.mv_size = (lv_size_kb).trim();
    return r_result;
  }

  result() {
    let result = false;
    result = z2ui5_cl_util.abap_copy(this.check_confirmed);
    return result;
  }

  view_display() {
    let lv_csv_x;
    let lv_base64;
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, afterclose: this.client._event(`BUTTON_CANCEL`) })
      .content();
    if ((this.mv_check_download === true || this.mv_check_download === `X`)) {
      lv_csv_x = z2ui5_cl_util.conv_get_xstring_by_string(this.mv_value);
      lv_base64 = z2ui5_cl_util.conv_encode_x_base64(lv_csv_x);
      popup._generic({ ns: `html`, name: `iframe`, t_prop: [{ n: `src`, v: this.mv_type + lv_base64 }, { n: `hidden`, v: `hidden` }] });
      popup._z2ui5().timer(this.client._event(`CALLBACK_DOWNLOAD`));
    }
    popup.vbox(`sapUiMediumMargin`)
      .label(`Name`)
      .input({ value: this.mv_name, enabled: false })
      .label(`Type`)
      .input({ value: this.mv_type, enabled: false })
      .label(`Size`)
      .input({ value: this.mv_size, enabled: false })
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
    switch (client.get().EVENT) {
      case `CALLBACK_DOWNLOAD`:
        this.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_CONFIRM`:
        this.mv_check_download = true;
        this.view_display();
        break;
      case `BUTTON_CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_file_dl, {
  factory: { preferred: `i_file`, params: [`i_text`, `i_title`, `i_button_text_confirm`, `i_button_text_cancel`, `i_file`, `i_type`, `i_name`] },
});

module.exports = z2ui5_cl_pop_file_dl;
