const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_372 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_event()) {
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
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.MenuButton/sample/sap.m.sample.MenuButton` });
    const toolbar = page.overflow_toolbar();
    toolbar.toolbar_spacer();
    toolbar.label(`In a toolbar`);
    toolbar.menu_button({ text: `File` })
      .menu()
      .menu_item({ text: `Edit`, icon: `sap-icon://edit`, press: this.client._event(`ITEM_PRESS`, [`\${$source>/text}`]) })
      .menu_item({ text: `Save`, icon: `sap-icon://save`, press: this.client._event(`ITEM_PRESS`, [`\${$source>/text}`]) })
      .menu_item({ text: `Open`, icon: `sap-icon://open-folder`, press: this.client._event(`ITEM_PRESS`, [`\${$source>/text}`]) });
    toolbar.toolbar_spacer();
    const vbox = page.vbox(`sapUiSmallMargin`);
    vbox.label(`Regular mode button`);
    this.file_menu_display({ menu_button: vbox.menu_button({ text: `File` }) });
    vbox.label(`Split mode button with associated last action`);
    this.file_menu_display({ menu_button: vbox.menu_button({ text: `File Menu`, buttonmode: `Split`, defaultaction: this.client._event(`DEFAULT_ACTION`) }) });
    vbox.label(`Split mode button with associated last action with initial icon`);
    this.file_menu_display({ menu_button: vbox.menu_button({ text: `File Menu`, buttonmode: `Split`, defaultaction: this.client._event(`DEFAULT_ACTION`) }) });
    vbox.label(`Split mode button with default action only`);
    this.file_menu_display({ menu_button: vbox.menu_button({ text: `File Menu`, buttonmode: `Split`, defaultaction: this.client._event(`DEFAULT_ACTION`) }) });
    vbox.label(`Split mode with type Accept and constant default action`);
    vbox.menu_button({ text: `Accept`, buttonmode: `Split`, type: `Accept`, defaultaction: this.client._event(`DEFAULT_ACTION_ACCEPT`) })
      .menu()
      .menu_item({ text: `Send the response now`, icon: `sap-icon://response`, press: this.client._event(`MENU_ACTION`, [`\${$source>/text}`]) })
      .menu_item({ text: `Edit the response before sending`, icon: `sap-icon://edit-outside`, press: this.client._event(`MENU_ACTION`, [`\${$source>/text}`]) })
      .menu_item({ text: `Do not send a response`, icon: `sap-icon://action`, press: this.client._event(`MENU_ACTION`, [`\${$source>/text}`]) });
    this.client.view_display(page.stringify());
  }

  file_menu_display({ menu_button } = {}) {
    menu_button.menu()
      .menu_item({ text: `Edit`, icon: `sap-icon://edit`, press: this.client._event(`MENU_ACTION`, [`\${$source>/text}`]) })
      .menu_item({ text: `Save`, icon: `sap-icon://save`, press: this.client._event(`MENU_ACTION`, [`\${$source>/text}`]) })
      .menu_item({ text: `Open`, icon: `sap-icon://open-folder`, press: this.client._event(`MENU_ACTION`, [`\${$source>/text}`]) });
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `ITEM_PRESS`:
        this.client.message_toast_display(`${this.client.get_event_arg()} Pressed`);
        break;
      case `MENU_ACTION`:
        this.client.message_toast_display(`Action triggered on item: ${this.client.get_event_arg()}`);
        break;
      case `DEFAULT_ACTION`:
        this.client.message_toast_display(`Default action triggered`);
        break;
      case `DEFAULT_ACTION_ACCEPT`:
        this.client.message_toast_display(`Accepted`);
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

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

