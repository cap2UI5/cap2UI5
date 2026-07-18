const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_294 extends z2ui5_if_app {
  lt_a_data = [];
  s_text = ``;
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Date Picker - Value States`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.DatePicker/sample/sap.m.sample.DatePickerValueState` });
    page.flex_box({ items: client._bind(this.lt_a_data), direction: `Column` })
      .vbox(`sapUiTinyMargin`)
      .label({ text: `{LABEL}`, labelfor: `DP` })
      .date_picker({ id: `DP`, width: `100%`, valuestate: `{VALUE_STATE}`, valuestatetext: `{VALUE_STATE_TEXT}` })
      .get_parent()
      .get_parent();
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This example shows different DatePicker value states.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.set_data();
    }
    this.on_event({ client: client });
  }

  set_data() {
    this.s_text = {};
    this.lt_a_data = {};
    this.s_text = `DatePicker with valueState `;
    this.lt_a_data.push(z2ui5_cl_util.abap_copy({ label: this.s_text + `None`, value_state: `None`, value_state_text: `` }));
    this.lt_a_data.push(z2ui5_cl_util.abap_copy({ label: this.s_text + `Information`, value_state: `Information`, value_state_text: `` }));
    this.lt_a_data.push(z2ui5_cl_util.abap_copy({ label: this.s_text + `Success`, value_state: `Success`, value_state_text: `` }));
    this.lt_a_data.push(z2ui5_cl_util.abap_copy({ label: this.s_text + `Warning and long valueStateText`, value_state: `Warning`, value_state_text: `Warning message. This is an extra long text used as a warning message. ` + `It illustrates how the text wraps into two or more lines without truncation to show the full length of the message.` }));
    this.lt_a_data.push(z2ui5_cl_util.abap_copy({ label: this.s_text + `Error`, value_state: `Error`, value_state_text: `` }));
  }
}

module.exports = z2ui5_cl_demo_app_294;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

