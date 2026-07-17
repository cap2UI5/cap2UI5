const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_222 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Icon Tab Bar - Text and Count`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.IconTabBar/sample/sap.m.sample.IconTabBarFiori2` });
    const layout = page.icon_tab_bar({ id: `idIconTabBarFiori2`, expanded: `{device>/isNoPhone}`, class: `sapUiResponsiveContentPadding` })
      .items()
      .icon_tab_filter({ text: `Info`, key: `info`, count: `3` })
      .text(`Info content goes here ...`)
      .get_parent()
      .icon_tab_filter({ text: `Attachments`, key: `attachments`, count: `4321` })
      .text(`Attachments go here ...`)
      .get_parent()
      .icon_tab_filter({ text: `Notes`, key: `notes`, count: `333` })
      .text(`Notes go here ...`)
      .get_parent()
      .icon_tab_filter({ text: `People`, key: `people`, count: `34` })
      .text(`People content goes here ...`);
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_222;
