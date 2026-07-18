const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_267 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: MultiInput - Value States`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MultiInput/sample/sap.m.sample.MultiInputValueStates` });
    page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .label({ text: `MultiInput with value state 'Warning'`, labelfor: `multiInput` })
      .multi_input({ id: `multiInput`, valuestate: `Warning`, showsuggestion: false, showvaluehelp: false, width: `70%` })
      .get_parent()
      .label({ text: `MultiInput with value state 'Error'`, labelfor: `multiInput1` })
      .multi_input({ id: `multiInput1`, valuestate: `Error`, showsuggestion: `false`, showvaluehelp: false, width: `70%` })
      .get_parent()
      .label({ text: `MultiInput with value state 'Success'`, labelfor: `multiInput2` })
      .multi_input({ id: `multiInput2`, valuestate: `Success`, showsuggestion: false, showvaluehelp: false, width: `70%` })
      .get_parent()
      .label({ text: `MultiInput with value state 'Information'`, labelfor: `multiInput3` })
      .multi_input({ id: `multiInput3`, valuestate: `Information`, showsuggestion: `false`, showvaluehelp: false, width: `70%` });
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This sample illustrates the different value states of the sap.m.MultiInput control.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_267;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

