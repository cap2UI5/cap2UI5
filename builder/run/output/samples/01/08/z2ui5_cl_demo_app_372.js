const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_372 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Menu Button`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MenuButton` });
    const vbox = page.vbox(`sapUiSmallMargin`);
    vbox.label(`Regular mode - the button only opens the menu:`);
    vbox.menu_button({ text: `File` })
      .menu()
      .menu_item({ text: `New`, icon: `sap-icon://create`, press: this.client._event(`MENU_ITEM`, [`\${$source>/text}`]) })
      .menu_item({ text: `Open`, icon: `sap-icon://open-folder`, press: this.client._event(`MENU_ITEM`, [`\${$source>/text}`]) })
      .menu_item({ text: `Save`, icon: `sap-icon://save`, press: this.client._event(`MENU_ITEM`, [`\${$source>/text}`]) });
    vbox.label({ text: `Split mode - the button fires a default action, the arrow opens the menu:`, class: `sapUiSmallMarginTop` });
    vbox.menu_button({ text: `Save`, buttonmode: `Split`, defaultaction: this.client._event(`DEFAULT_ACTION`) })
      .menu()
      .menu_item({ text: `Save`, icon: `sap-icon://save`, press: this.client._event(`MENU_ITEM`, [`\${$source>/text}`]) })
      .menu_item({ text: `Save As`, icon: `sap-icon://duplicate`, press: this.client._event(`MENU_ITEM`, [`\${$source>/text}`]) });
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `MENU_ITEM`:
        this.client.message_toast_display(`${this.client.get_event_arg(1)} selected`);
        break;
      case `DEFAULT_ACTION`:
        this.client.message_toast_display(`Default action pressed`);
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The menu button opens a menu with actions. In split mode the button itself triggers a default action while the arrow opens the menu.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_372;
