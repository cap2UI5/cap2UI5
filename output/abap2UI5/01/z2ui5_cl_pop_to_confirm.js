const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_to_confirm extends z2ui5_if_app {
  static cs_event = { confirmed: `z2ui5_cl_pop_to_confirm_confirmed`, canceled: `z2ui5_cl_pop_to_confirm_canceled` };

  client = null;
  title = ``;
  icon = ``;
  question_text = ``;
  button_text_confirm = ``;
  button_text_cancel = ``;
  check_result_confirmed = false;
  event_confirm = ``;
  event_canceled = ``;

  result() {
    let result = false;
    result = this.check_result_confirmed;
    return result;
  }

  static factory({ i_question_text, i_title = `Popup To Confirm`, i_icon = `sap-icon://question-mark`, i_button_text_confirm = `OK`, i_button_text_cancel = `Cancel`, i_event_confirm = z2ui5_cl_pop_to_confirm.cs_event.confirmed, i_event_cancel = z2ui5_cl_pop_to_confirm.cs_event.canceled } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_to_confirm();
    r_result.title = i_title;
    r_result.icon = i_icon;
    r_result.question_text = i_question_text;
    r_result.button_text_confirm = i_button_text_confirm;
    r_result.button_text_cancel = i_button_text_cancel;
    r_result.event_confirm = i_event_confirm;
    r_result.event_canceled = i_event_cancel;
    return r_result;
  }

  view_display() {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: this.title, icon: this.icon, afterclose: this.client._event(`BUTTON_CANCEL`) })
      .content()
      .vbox(`sapUiMediumMargin`)
      .text(this.question_text)
      .get_parent()
      .get_parent()
      .buttons()
      .button({ text: this.button_text_cancel, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: this.button_text_confirm, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
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
        this.check_result_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave({ app: client.get_app_prev(), event: this.event_confirm });
        break;
      case `BUTTON_CANCEL`:
        this.check_result_confirmed = false;
        client.popup_destroy();
        client.nav_app_leave({ app: client.get_app_prev(), event: this.event_canceled });
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_to_confirm;
