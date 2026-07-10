const z2ui5_if_app      = require("../z2ui5_if_app");
const z2ui5_cl_xml_view = require("../z2ui5_cl_xml_view");

/**
 * z2ui5_cl_pop_file_ul — JS port of abap2UI5 z2ui5_cl_pop_file_ul.
 *
 * File-upload dialog. The user picks a file via the z2ui5.FileUploader
 * custom control; on UPLOAD the data URI is base64-decoded and exposed via
 * result().value (UTF-8 string).
 *
 * Usage:
 *   const pop = z2ui5_cl_pop_file_ul.factory();
 *   client.nav_app_call(pop);
 *   // ...later:
 *   const r = pop.result();
 *   if (r.check_confirmed) { ...r.value... }
 */
class z2ui5_cl_pop_file_ul extends z2ui5_if_app {

  client = null;
  title               = `File Upload`;
  question_text       = `Choose the file to upload:`;
  button_text_confirm = `OK`;
  button_text_cancel  = `Cancel`;

  mv_path  = ``;
  mv_value = ``;
  check_confirm_enabled = false;
  ms_result = { value: ``, check_confirmed: false };

  static factory({
    i_text                = `Choose the file to upload:`,
    i_title               = `File Upload`,
    i_button_text_confirm = `OK`,
    i_button_text_cancel  = `Cancel`,
    i_path                = ``,
  } = {}) {
    const r_result = new z2ui5_cl_pop_file_ul();
    r_result.title               = i_title;
    r_result.question_text       = i_text;
    r_result.button_text_confirm = i_button_text_confirm;
    r_result.button_text_cancel  = i_button_text_cancel;
    r_result.mv_path             = i_path;
    return r_result;
  }

  result() { return this.ms_result; }

  view_display() {
    const c = this.client;
    const popup = z2ui5_cl_xml_view.factory_popup()
      .Dialog({
        title:      this.title,
        afterClose: c._event(`BUTTON_CANCEL`),
      })
      .content()
        .VBox({ class: `sapUiMediumMargin` })
          .Label({ text: this.question_text });

    popup._z2ui5().file_uploader({
      value:       c._bind_edit(this.mv_value),
      path:        c._bind_edit(this.mv_path),
      placeholder: `filepath here...`,
      upload:      c._event(`UPLOAD`),
    });

    popup.get_parent().get_parent()
      .buttons()
        .Button({
          text:  this.button_text_cancel,
          press: c._event(`BUTTON_CANCEL`),
        })
        .Button({
          text:    this.button_text_confirm,
          press:   c._event(`BUTTON_CONFIRM`),
          enabled: c._bind(this.check_confirm_enabled),
          type:    `Emphasized`,
        });

    c.popup_display(popup.stringify());
  }

  async main(client) {
    this.client = client;

    if (client.check_on_init()) {
      this.view_display();
      return;
    }

    switch (client.get().EVENT) {
      case `UPLOAD`: {
        // mv_value contains a data URI like "data:text/csv;base64,VGV4dC4uLg=="
        const v = String(this.mv_value || ``);
        const commaIdx = v.indexOf(`,`);
        const b64 = commaIdx >= 0 ? v.slice(commaIdx + 1) : v;
        try {
          // Convert base64 → UTF-8 string. Mirrors abap conv_decode_x_base64
          // followed by conv_get_string_by_xstring.
          this.ms_result.value = Buffer.from(b64, `base64`).toString(`utf-8`);
        } catch {
          this.ms_result.value = ``;
        }
        this.check_confirm_enabled = true;
        this.mv_value = ``;
        this.mv_path  = ``;
        client.popup_model_update();
        break;
      }
      case `BUTTON_CONFIRM`:
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_file_ul;
