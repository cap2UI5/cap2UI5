const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_279 extends z2ui5_if_app {
  text_input = ``;
  dirty = false;
  client = null;

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - data loss protection`, navbuttonpress: this.client._event(`BACK`), shownavbutton: this.client.check_app_prev_stack() });
    const box = page.flex_box({ direction: `Row`, alignitems: `Start`, class: `sapUiTinyMargin` });
    box.input({ id: `input`, value: this.client._bind_edit(this.text_input), submit: this.client._event(`submit`), width: `40rem`, placeholder: `Enter data, submit and navigate back to trigger data loss protection` });
    box.info_label({ text: `dirty`, colorscheme: `8`, icon: `sap-icon://message-success`, class: `sapUiSmallMarginBegin sapUiTinyMarginTop`, visible: this.client._bind(this.dirty) });
    box.button({ text: `Reset`, press: this.client._event(`reset`), class: `sapUiSmallMarginBegin`, visible: this.client._bind(this.dirty) });
    page._z2ui5().dirty(this.client._bind(this.dirty));
    this.client.view_display(page.stringify());
    this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`input`]);
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BACK`:
        if ((this.dirty === true || this.dirty === `X`)) {
          this.security_check_popup();
        } else {
          this.client.nav_app_leave();
        }
        break;
      case `submit`:
        this.dirty = (this.text_input);
        break;
      case `reset`:
        this.dirty = {};
        this.text_input = {};
        break;
    }
  }

  security_check_popup() {
    this.client.nav_app_call(z2ui5_cl_pop_to_confirm.factory({ i_question_text: `Your entries will be lost when you leave this page.`, i_title: `Warning`, i_icon: `sap-icon://status-critical`, i_button_text_confirm: `Leave Page`, i_button_text_cancel: `Cancel` }));
  }

  async main(client) {
    this.client = client;
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`)) {
      this.on_navigation();
    }
    this.on_event();
    if (client.check_on_init()) {
      this.view_display();
    } else {
      client.view_model_update();
    }
  }

  on_navigation() {
    let prev;
    let confirm_leave;
    try {
      prev = this.client.get_app(this.client.get().S_DRAFT.ID_PREV_APP);
      confirm_leave = (prev).result();
    } catch (error) {
    }
    if ((confirm_leave === true || confirm_leave === `X`)) {
      this.dirty = {};
      this.client.nav_app_leave();
    }
  }
}

module.exports = z2ui5_cl_demo_app_279;

const z2ui5_cl_pop_to_confirm = require("abap2UI5/z2ui5_cl_pop_to_confirm");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

