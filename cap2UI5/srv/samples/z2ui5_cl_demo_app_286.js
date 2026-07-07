const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_286 extends z2ui5_if_app {
  lt_o_model = [];
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Standard List Item - Info State Inverted`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.StandardListItem/sample/sap.m.sample.StandardListItemInfoStateInverted` });
    page.list({ id: `myList`, mode: `MultiSelect`, headertext: `Inverted Info State`, items: client._bind(this.lt_o_model) })
      .items()
      .standard_list_item({ title: `{TITLE}`, description: `{DESC}`, icon: `{ICON}`, iconinset: false, highlight: `{HIGHLIGHT}`, info: `{INFO}`, infostate: `{HIGHLIGHT}`, infostateinverted: true });
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This sample demonstrates the inverted rendering behavior of the info text and the info state of the StandardListItem control.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.lt_o_model = [{ title: `Title text`, desc: `Description text`, icon: `sap-icon://favorite`, highlight: `Success`, info: `Completed` }, { title: `Title text`, desc: `Description text`, icon: `sap-icon://employee`, highlight: `Error`, info: `Incomplete` }, { title: `Title text`, icon: `sap-icon://accept`, highlight: `Information`, info: `Information` }, { title: `Title text`, icon: `sap-icon://activities`, highlight: `None`, info: `None` }, { title: `Title text`, desc: `Description text`, icon: `sap-icon://badge`, highlight: `Warning`, info: `Warning` }];
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_286;
