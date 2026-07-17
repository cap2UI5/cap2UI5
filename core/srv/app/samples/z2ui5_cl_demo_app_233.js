const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_233 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `Sample: MultiComboBox - Suggestions wrapping`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MultiComboBox/sample/sap.m.sample.MultiComboBoxWrapping` });
    const layout = page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` });
    layout.label({ text: `Product`, labelfor: `wrappingMultiComboBox` });
    layout.multi_combobox({ id: `wrappingMultiComboBox`, width: `350px` })
      .item({ key: `1`, text: `Wireless DSL/ Repeater and Print Server Lorem ipsum dolar st amet, consetetur sadipscing elitr, ` + `sed diam nonumy eirmod tempor incidunt ut labore et dolore magna aliquyam erat, diam nonumy eirmod tempor individunt ` + `ut labore et dolore magna aliquyam erat, sed justo et ea rebum.` })
      .item({ key: `2`, text: `7" Widescreen Portable DVD Player w MP3, consetetur sadipscing, sed diam nonumy eirmod tempor ` + `invidunt ut labore et dolore et dolore magna aliquyam erat, sed diam voluptua. ` + `At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergen, no sea takimata. ` + `Tortor pretium viverra suspendisse potenti nullam. Congue quisque egestas diam in arcu cursus. ` + `Rutrum tellus pellentesque eu tincidunt tortor. Nec tincidunt praesent semper feugiat nibh sed.` })
      .item({ key: `3`, text: `Portable DVD Player with 9" LCD Monitor` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_233;
