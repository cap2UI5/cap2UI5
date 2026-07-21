const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_189 extends z2ui5_if_app {
  one = ``;
  two = ``;
  three = ``;
  client = null;

  dispatch() {
    switch (this.client.get().EVENT) {
      case `one_enter`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`IdTwo`]);
        break;
      case `two_enter`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`IdThree`]);
        break;
    }
    this.client.view_model_update();
  }

  render() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Focus II`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Pressing Enter in an input field jumps the cursor to the next one via the set_focus follow-up action.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.simple_form({ editable: true })
      .content(`form`)
      .label(`One (Press Enter)`)
      .input({ id: `IdOne`, value: this.client._bind(this.one), submit: this.client._event(`one_enter`) })
      .label(`Two`)
      .input({ id: `IdTwo`, value: this.client._bind(this.two), submit: this.client._event(`two_enter`) })
      .label(`Three`)
      .input({ id: `IdThree`, value: this.client._bind(this.three) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.render();
      client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`IdOne`]);
    }
    this.dispatch();
  }
}

module.exports = z2ui5_cl_demo_app_189;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

