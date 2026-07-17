const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_225 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Icon Tab Bar - Separator`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.IconTabBar/sample/sap.m.sample.IconTabSeparator` });
    const layout = page.label({ wrapping: `true`, text: `No icon(='') used as separator, the separator will be a vertical line.`, class: `sapUiSmallMargin` });
    layout.icon_tab_bar({ id: `idIconTabBarSeparatorNoIcon`, expanded: `false`, class: `sapUiResponsiveContentPadding` })
      .items()
      .icon_tab_filter({ key: `info`, icon: `sap-icon://hint`, iconcolor: `Neutral` })
      .text(`Info content goes here ...`)
      .get_parent()
      .icon_tab_separator({ icon: `` })
      .get_parent()
      .icon_tab_filter({ key: `attachments`, icon: `sap-icon://attachment`, iconcolor: `Neutral`, count: `3` })
      .text(`Attachments go here ...`)
      .get_parent()
      .icon_tab_filter({ key: `notes`, icon: `sap-icon://notes`, count: `12` })
      .text(`Notes go here ...`)
      .get_parent()
      .icon_tab_separator({ icon: `` })
      .get_parent()
      .icon_tab_filter({ key: `people`, icon: `sap-icon://group`, iconcolor: `Negative` })
      .text(`People content goes here ...`);
    layout.label({ wrapping: `true`, text: `Icon used as separator, you are free to choose an icon you want.`, class: `sapUiSmallMargin` });
    layout.icon_tab_bar({ id: `idIconTabBarSeparatorIcon`, expanded: `false`, class: `sapUiResponsiveContentPadding` })
      .items()
      .icon_tab_filter({ key: `info`, icon: `sap-icon://hint`, iconcolor: `Neutral` })
      .text(`Info content goes here ...`)
      .get_parent()
      .icon_tab_filter({ key: `attachments`, icon: `sap-icon://attachment`, iconcolor: `Neutral`, count: `3` })
      .text(`Attachments go here ...`)
      .get_parent()
      .icon_tab_separator({ icon: `sap-icon://process` })
      .get_parent()
      .icon_tab_filter({ key: `notes`, icon: `sap-icon://notes`, iconcolor: `Positive`, count: `12` })
      .text(`Notes go here ...`)
      .get_parent()
      .icon_tab_separator({ icon: `sap-icon://process` })
      .get_parent()
      .icon_tab_filter({ key: `people`, icon: `sap-icon://group`, iconcolor: `Negative` })
      .text(`People content goes here ...`);
    layout.label({ wrapping: `true`, text: `Different separators used.`, class: `sapUiSmallMargin` });
    layout.icon_tab_bar({ id: `idIconTabBarSeparatorMixed`, expanded: `false`, class: `sapUiResponsiveContentPadding` })
      .items()
      .icon_tab_filter({ key: `info`, icon: `sap-icon://hint`, iconcolor: `Critical` })
      .text(`Info content goes here ...`)
      .get_parent()
      .icon_tab_separator({ icon: `` })
      .get_parent()
      .icon_tab_filter({ key: `info`, icon: `sap-icon://attachment`, iconcolor: `Neutral`, count: `3` })
      .text(`Attachments go here ...`)
      .get_parent()
      .icon_tab_separator({ icon: `sap-icon://vertical-grip` })
      .get_parent()
      .icon_tab_filter({ key: `notes`, icon: `sap-icon://notes`, iconcolor: `Positive`, count: `12` })
      .text(`Notes go here ...`)
      .get_parent()
      .icon_tab_separator({ icon: `sap-icon://process` })
      .get_parent()
      .icon_tab_filter({ key: `people`, icon: `sap-icon://group`, iconcolor: `Negative` })
      .text(`People content goes here ...`);
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_225;
