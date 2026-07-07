const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_301 extends z2ui5_if_app {
  lt_o_data = [];
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Expandable Text`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ExpandableText/sample/sap.m.sample.ExpandableText` });
    page_01.table({ mode: `MultiSelect`, items: client._bind(this.lt_o_data), autopopinmode: true })
      .columns()
      .column()
      .text(`Product`)
      .get_parent()
      .column()
      .text(`Attribute 1`)
      .get_parent()
      .column()
      .text(`Attribute 2`)
      .get_parent()
      .column()
      .text(`Status`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .text(`{NAME}`)
      .expandable_text({ class: `sapUiTinyMarginBottom sapUiTinyMarginTop`, text: `{ATTRIBUTE_1}`, overflowmode: `{OVERFLOW_MODE}` })
      .get_parent()
      .text(`{ATTRIBUTE_2}`)
      .get_parent()
      .text(`{STATUS}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent();
    client.view_display(page_01.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The ExpandableText control can be used to display larger texts inside a table, list or form.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.set_data();
    }
    this.on_event({ client: client });
  }

  set_data() {
    this.lt_o_data = {};
    this.lt_o_data = [{ name: `Product 1`, attribute_1: `The full text is displayed in place. Lorem ipsum dolor sit amet, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore ` + `et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr`, attribute_2: `Attribute related to label`, status: `Some status`, overflow_mode: `InPlace` }, { name: `Product 2`, attribute_1: `The full text is displayed in a popover. Lorem ipsum dolor sit amet, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore ` + `et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr`, attribute_2: `Attribute related to label`, status: `Some status`, overflow_mode: `Popover` }, { name: `Product 3`, attribute_1: `The full text is displayed in place. Lorem ipsum dolor sit amet, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore ` + `et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr`, attribute_2: `Attribute related to label`, status: `Some status`, overflow_mode: `InPlace` }, { name: `Product 4`, attribute_1: `The full text is displayed in a popover. Lorem ipsum dolor sit amet, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore ` + `et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr`, attribute_2: `Attribute related to label`, status: `Some status`, overflow_mode: `Popover` }];
  }
}

module.exports = z2ui5_cl_demo_app_301;
