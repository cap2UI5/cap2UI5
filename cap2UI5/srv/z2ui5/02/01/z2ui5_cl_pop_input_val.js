const z2ui5_if_app = require("../z2ui5_if_app");
const z2ui5_cl_xml_view = require("../z2ui5_cl_xml_view");

/**
 * Single-input popup — 1:1 port of abap2UI5 z2ui5_cl_pop_input_val.
 *
 * Usage:
 *   client.nav_app_call(z2ui5_cl_pop_input_val.factory({ val: `Default` }));
 *
 * Caller (next roundtrip, check_on_navigated):
 *   const prev = client.get_app_prev();
 *   const r = prev.result();   // { value, check_confirmed }
 */
class z2ui5_cl_pop_input_val extends z2ui5_if_app {

  client              = null;
  title               = ``;
  question_text       = ``;
  button_text_confirm = ``;
  button_text_cancel  = ``;

  // ms_result: { value: string, check_confirmed: bool }
  ms_result = { value: ``, check_confirmed: false };

  static factory({
    text                = `Enter New Value`,
    val                 = ``,
    title               = `Popup Input Value`,
    button_text_confirm = `OK`,
    button_text_cancel  = `Cancel`,
  } = {}) {
    const r_result = new z2ui5_cl_pop_input_val();
    r_result.title               = title;
    r_result.question_text       = text;
    r_result.button_text_confirm = button_text_confirm;
    r_result.button_text_cancel  = button_text_cancel;
    r_result.ms_result.value     = val;
    return r_result;
  }

  result() {
    return this.ms_result;
  }

  view_display() {
    const msResultBind = this.client._bind_edit(this.ms_result);
    const msResultPath = msResultBind.slice(1, -1);

    const popup = z2ui5_cl_xml_view.factory_popup()
      .Dialog({
        title:      this.title,
        afterClose: this.client._event(`BUTTON_CANCEL`),
      })
      .content()
        .VBox({ class: `sapUiMediumMargin` })
          .Label({ text: this.question_text })
          .Input({
            value:  `{${msResultPath}/value}`,
            submit: this.client._event(`BUTTON_CONFIRM`),
          })
        .get_parent()
      .get_parent()
      .buttons()
        .Button({
          text:  this.button_text_cancel,
          press: this.client._event(`BUTTON_CANCEL`),
        })
        .Button({
          text:  this.button_text_confirm,
          press: this.client._event(`BUTTON_CONFIRM`),
          type:  `Emphasized`,
        });

    this.client.popup_display(popup.stringify());
  }

  async main(client) {

    this.client = client;

    if (client.check_on_init()) {
      this.view_display();
      return;
    }

    switch (client.get().EVENT) {
      case `BUTTON_CONFIRM`:
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_CANCEL`:
        this.ms_result.check_confirmed = false;
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }

  }
}

module.exports = z2ui5_cl_pop_input_val;
