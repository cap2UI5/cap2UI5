const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_287 extends z2ui5_if_app {
  lt_o_model = [];
  wrapping = false;
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Standard List Item - Wrapping`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.StandardListItem/sample/sap.m.sample.StandardListItemWrapping` });
    page.list({ id: `myList`, mode: `MultiSelect`, items: client._bind(this.lt_o_model) })
      .header_toolbar()
      .toolbar()
      .title(`Wrapping texts`)
      .toolbar_spacer()
      .toggle_button({ text: `Toggle Wrapping`, pressed: client._bind(this.wrapping) })
      .get_parent()
      .get_parent()
      .items()
      .standard_list_item({ title: `{TITLE}`, description: `{DESC}`, icon: `{ICON}`, iconinset: false, highlight: `{HIGHLIGHT}`, info: `{INFO}`, infostate: `{HIGHLIGHT}`, type: `Detail`, wrapping: client._bind(this.wrapping), wrapcharlimit: `{WRAPCHARLIMIT}` });
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This sample demonstrates the wrapping behavior of the title text and the description text. ` + `In desktop mode, the character limit is set to 300 characters, whereas in the phone mode, the character limit is set to 100 characters.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.lt_o_model = z2ui5_cl_util.abap_tab_assign(this.lt_o_model, [{ title: `Short title`, icon: `sap-icon://favorite`, highlight: `Success`, info: `Available` }, { title: `Short title with long info text`, icon: `sap-icon://employee`, highlight: `Error`, info: `This is a very long information status text that demonstrates truncation and wrapping behavior` }, { title: `wrapCharLimit is set to Default. Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.`, desc: `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.`, icon: `sap-icon://favorite`, highlight: `Success`, info: `Completed` }, { title: `wrapCharLimit is set to 100. Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`, desc: `Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`, icon: `sap-icon://employee`, highlight: `Error`, info: `Incomplete`, wrapcharlimit: 100 }, { title: `Title text`, desc: `Description text`, icon: `sap-icon://accept`, highlight: `Information`, info: `Information`, wrapcharlimit: 10 }]);
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_287;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

