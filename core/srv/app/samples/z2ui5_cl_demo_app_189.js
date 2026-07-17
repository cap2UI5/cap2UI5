const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_189 extends z2ui5_if_app {
  one = ``;
  two = ``;
  three = ``;
  client = null;

  dispatch() {
    switch (this.client.get().EVENT) {
      case `one_enter`:
        this.client.follow_up_action({ val: z2ui5_if_client.cs_event.set_focus, t_arg: [`IdTwo`] });
        break;
      case `two_enter`:
        this.client.follow_up_action({ val: z2ui5_if_client.cs_event.set_focus, t_arg: [`IdThree`] });
        break;
    }
    this.client.view_model_update();
  }

  render() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Focus II`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.simple_form()
      .content(`form`)
      .label(`One (Press Enter)`)
      .input({ id: `IdOne`, value: this.client._bind_edit(this.one), submit: this.client._event(`one_enter`) })
      .label(`Two`)
      .input({ id: `IdTwo`, value: this.client._bind_edit(this.two), submit: this.client._event(`two_enter`) })
      .label(`Three`)
      .input({ id: `IdThree`, value: this.client._bind_edit(this.three) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.render();
      client.follow_up_action({ val: z2ui5_if_client.cs_event.set_focus, t_arg: [`IdOne`] });
    }
    this.dispatch();
  }
}

module.exports = z2ui5_cl_demo_app_189;
