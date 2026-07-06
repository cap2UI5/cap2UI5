const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_041 extends z2ui5_if_app {
  screen = { step_val_01: `4`, step_val_02: `10` };

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Step Input Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
    layout.label(`StepInput`)
      .step_input({ value: client._bind_edit(this.screen.step_val_01), step: `2`, min: `0`, max: `20` })
      .step_input({ value: client._bind_edit(this.screen.step_val_02), step: `10`, min: `0`, max: `100` })
      .button({ text: `OK`, press: client._event(`POST`) });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POST`)) {
      client.message_box_display(`success - values sent to the server`);
    }
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_041;
