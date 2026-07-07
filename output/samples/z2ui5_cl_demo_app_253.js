const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_253 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const css = `.equalColumns .columns {` + ` min-height: 200px;` + `}` + `` + `.equalColumns .columns .sapMFlexItem {` + ` padding: 0.5rem;` + `}`;
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `style`, ns: `html` })._cc_plain_xml(css).get_parent();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Flex Box - Equal Height Cols`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.FlexBox/sample/sap.m.sample.FlexBoxCols` });
    const layout = page.vertical_layout({ class: `sapUiContentPadding equalColumns`, width: `100%` })
      .flex_box({ class: `columns` })
      .text(`Although they have different amounts of text, both columns are of equal height.`)
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1`, basesize: `0`, backgrounddesign: `Solid`, styleclass: `sapUiTinyMargin` })
      .get_parent()
      .get_parent()
      .text(`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ` + `sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo hey nonny no duo dolores et ea rebum. ` + `Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ` + `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, ` + `sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ` + `Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`)
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1`, basesize: `0`, backgrounddesign: `Solid`, styleclass: `sapUiTinyMargin` })
      .get_parent();
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `You can create balanced areas with Flex Box, such as these columns with equal height regardless of content.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_253;
