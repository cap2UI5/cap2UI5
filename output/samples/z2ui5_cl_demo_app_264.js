const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_264 extends z2ui5_if_app {
  lt_a_data = [];
  ls_a_data = {};
  s_text = ``;
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Step Input - Value States`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.StepInput/sample/sap.m.sample.StepInputValueState` });
    page.flex_box({ items: client._bind(this.lt_a_data), direction: `Column` })
      .vbox(`sapUiTinyMargin`)
      .label({ text: `{LABEL}`, labelfor: `SI` })
      .step_input({ id: `SI`, width: `100%`, value: `5`, valuestate: `{VALUE_STATE}` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `hint_icon` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This example shows different StepInput value states.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    let sy_tabix = 0;
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.s_text = `StepInput with valueState `;
      this.lt_a_data = [{ value_state: `None` }, { value_state: `Information` }, { value_state: `Success` }, { value_state: `Warning` }, { value_state: `Error` }];
      sy_tabix = 0;
      for (const fs_fs_a_data of this.lt_a_data) {
        sy_tabix++;
        fs_fs_a_data.label = this.s_text + ` ` + fs_fs_a_data.value_state;
      }
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_264;
