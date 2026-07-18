const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_217 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Placing a Title in OverflowToolbar/Toolbar`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.OverflowToolbar/sample/sap.m.sample.TitleToolBar` });
    const layout = page.overflow_toolbar({ design: `Transparent`, height: `3rem` }).title(`Title Only`);
    page.overflow_toolbar({ design: `Transparent`, height: `3rem` })
      .title(`Title and Actions`)
      .toolbar_spacer()
      .button({ icon: `sap-icon://group-2` })
      .button({ icon: `sap-icon://action-settings` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_217;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

