const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_224 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `Sample: Icon Tab Bar - Text Only`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.IconTabBar/sample/sap.m.sample.IconTabBarNoIcons` });
    const layout = page.icon_tab_bar({ id: `idIconTabBarNoIcons`, expanded: `{device>/isNoPhone}`, class: `sapUiResponsiveContentPadding` })
      .items()
      .icon_tab_filter({ text: `Info`, key: `info` })
      .text(`Info content goes here ...`)
      .get_parent()
      .icon_tab_filter({ text: `Attachments`, key: `attachments` })
      .text(`Attachments go here ...`)
      .get_parent()
      .icon_tab_filter({ text: `Notes`, key: `notes` })
      .text(`Notes go here ...`)
      .get_parent()
      .icon_tab_filter({ text: `People`, key: `people` })
      .text(`People content goes here ...`);
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_224;
