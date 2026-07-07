const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_018 extends z2ui5_if_app {
  quantity = ``;
  textarea = ``;
  client = null;

  on_init() {
    this.quantity = `500`;
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `SHOW_POPUP`:
        this.popup_input_display();
        break;
      case `POPUP_CONFIRM`:
        this.client.message_toast_display(`confirm`);
        this.client.popup_destroy();
        break;
      case `POPUP_CANCEL`:
        this.textarea = {};
        this.client.message_toast_display(`cancel`);
        this.client.popup_destroy();
        break;
      case `SHOW_VIEW_MAIN`:
        this.view_display();
        break;
      case `SHOW_VIEW_SECOND`:
        this.view_second_display();
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Template`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form({ title: `VIEW_MAIN`, editable: true })
      .content(`form`)
      .title(`Input`)
      .label(`quantity`)
      .input(this.client._bind_edit(this.quantity))
      .label(`text`)
      .input({ value: this.client._bind_edit(this.textarea), enabled: false })
      .button({ text: `show popup input`, press: this.client._event(`SHOW_POPUP`) })
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .overflow_toolbar_button({ text: `Clear`, press: this.client._event(`BUTTON_CLEAR`), type: `Reject`, icon: `sap-icon://delete` })
      .button({ text: `Go to View Second`, press: this.client._event(`SHOW_VIEW_SECOND`) });
    this.client.view_display(view.stringify());
  }

  view_second_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Template`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form(`VIEW_SECOND`)
      .content(`form`)
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .overflow_toolbar_button({ text: `Clear`, press: this.client._event(`BUTTON_CLEAR`), type: `Reject`, icon: `sap-icon://delete` })
      .button({ text: `Go to View Main`, press: this.client._event(`SHOW_VIEW_MAIN`) });
    this.client.view_display(view.stringify());
  }

  popup_input_display() {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.dialog({ title: `Title`, icon: `sap-icon://edit` })
      .content()
      .text_area({ height: `100%`, width: `100%`, value: this.client._bind_edit(this.textarea) })
      .button({ text: `Cancel`, press: this.client._event(`POPUP_CANCEL`) })
      .button({ text: `Confirm`, press: this.client._event(`POPUP_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_018;
