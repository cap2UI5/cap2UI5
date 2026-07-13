const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_292 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Breadcrumbs sample with current page link`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Breadcrumbs/sample/sap.m.sample.BreadcrumbsWithCurrentPageLink` });
    page.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .title(`Breadcrumbs with current page aggregation set`)
      .breadcrumbs({ id: `idBreadcrumbs`, separatorstyle: `{/selected}`, currentlocationtext: `Page 7` })
      .link({ text: `Home`, press: client._event(`onPress`, [`\${$source>/text}`]) })
      .link({ text: `Page 1`, press: client._event(`onPress`, [`\${$source>/text}`]) })
      .link({ text: `Page 2`, press: client._event(`onPress`, [`\${$source>/text}`]) })
      .link({ text: `Page 3`, press: client._event(`onPress`, [`\${$source>/text}`]) })
      .link({ text: `Page 4`, press: client._event(`onPress`, [`\${$source>/text}`]) })
      .link({ text: `Page 5`, press: client._event(`onPress`, [`\${$source>/text}`]) })
      .link({ text: `Page 6`, press: client._event(`onPress`, [`\${$source>/text}`]) })
      .get_parent()
      .get_parent();
    page.hbox({ alignitems: `Center` })
      .label({ labelfor: `idSeparatorSelect`, text: `Change separator style` })
      .select({ class: `sapUiSmallMarginBegin`, id: `idSeparatorSelect`, selectedkey: `{/selected}`, change: `onChange` })
      .item({ key: `Slash`, text: `Slash` })
      .item({ key: `BackSlash`, text: `BackSlash` })
      .item({ key: `DoubleSlash`, text: `DoubleSlash` })
      .item({ key: `DoubleBackSlash`, text: `DoubleBackSlash` })
      .item({ key: `GreaterThan`, text: `GreaterThan` })
      .item({ key: `DoubleGreaterThan`, text: `DoubleGreaterThan` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `onPress`:
        client.message_toast_display(`${client.get_event_arg(1)} has been clicked`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Breadcrumbs sample with current page set as aggregation, resulting in a link` });
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

module.exports = z2ui5_cl_demo_app_292;
