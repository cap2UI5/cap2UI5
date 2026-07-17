const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_214 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Standalone Icon Tab Header`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.IconTabHeader/sample/sap.m.sample.IconTabHeader` });
    const layout = page.icon_tab_header({ mode: `Inline` })
      .items()
      .icon_tab_filter({ key: `info`, text: `Info` })
      .get_parent()
      .icon_tab_filter({ key: `attachments`, text: `Attachments`, count: `3` })
      .get_parent()
      .icon_tab_filter({ key: `notes`, text: `Notes`, count: `12` })
      .get_parent()
      .icon_tab_filter({ key: `people`, text: `People` });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_214;
