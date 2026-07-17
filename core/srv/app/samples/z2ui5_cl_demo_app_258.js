const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_258 extends z2ui5_if_app {
  selected_menu_entry = ``;
  client = null;

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `MENU_HOME`:
        client.message_toast_display(`Home Button pressed`);
        this.selected_menu_entry = `Home`;
        break;
      case `MENU_HOME_1`:
        client.message_toast_display(`Home Sub 1 Button pressed`);
        this.selected_menu_entry = `Home1`;
        break;
      case `MENU_HOME_2`:
        client.message_toast_display(`Home Sub 2 Button pressed`);
        this.selected_menu_entry = `Home2`;
        break;
      case `MENU_HOME_3`:
        client.message_toast_display(`Home Sub 3 Button pressed`);
        this.selected_menu_entry = `Home3`;
        break;
      case `MENU_CUSTOMER`:
        client.message_toast_display(`Customer Button pressed`);
        this.selected_menu_entry = `Customers`;
        break;
      case `MENU_SUPPLIER`:
        client.message_toast_display(`Supplier Button pressed`);
        this.selected_menu_entry = `Suppliers`;
        break;
      case `MENU_FIX1`:
        client.message_toast_display(`Fixed Button 1 pressed`);
        this.selected_menu_entry = `Fix1`;
        break;
      case `MENU_FIX2`:
        client.message_toast_display(`Fixed Button 2 pressed`);
        this.selected_menu_entry = `Fix2`;
        break;
      case `MENU_FIX3`:
        client.message_toast_display(`Fixed Button 3 pressed`);
        this.selected_menu_entry = `Fix3`;
        break;
    }
  }

  render_main_view({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ ns: `html`, name: `style` })
      ._cc_plain_xml(`.sapMPage>section { height: 100% }` + `#mainView--site_content { border-radius: 0.75em }`);
    const page = view.page({ title: `abap2UI5 - Sample: Side Navigation`, navbuttonpress: client._event_nav_app_leave(), enablescrolling: false, class: `sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer`, shownavbutton: client.check_app_prev_stack() });
    const content = page.flex_box({ width: `100%`, height: `90%`, alignitems: `Start` });
    const navlist = content.flex_box({ width: `100%`, height: `100%`, direction: `Column` })
      .layout_data()
      .flex_item_data({ growfactor: `1`, basesize: `0` })
      .get_parent()
      .side_navigation({ id: `sideNavigation`, class: `sapUiTinyMarginTop`, selectedkey: client._bind(this.selected_menu_entry) })
      .navigation_list();
    navlist.navigation_list_item({ text: `Home`, icon: `sap-icon://home`, select: client._event(`MENU_HOME`), key: `Home` })
      .get_child()
      .navigation_list_item({ text: `Home Sub 1`, select: client._event(`MENU_HOME_1`), key: `Home1` })
      .navigation_list_item({ text: `Home Sub 2`, select: client._event(`MENU_HOME_2`), key: `Home2` })
      .navigation_list_item({ text: `Home Sub 3`, select: client._event(`MENU_HOME_3`), key: `Home3` });
    navlist.navigation_list_item({ text: `Customers`, icon: `sap-icon://customer`, select: client._event(`MENU_CUSTOMER`), key: `Customers` });
    navlist.navigation_list_item({ text: `Suppliers`, icon: `sap-icon://supplier`, select: client._event(`MENU_SUPPLIER`), key: `Suppliers` });
    navlist.get_parent()
      .fixed_item()
      .navigation_list()
      .navigation_list_item({ text: `Fixed Entry 1`, icon: `sap-icon://heart`, select: client._event(`MENU_FIX1`), key: `Fix1` })
      .navigation_list_item({ text: `Fixed Entry 2`, icon: `sap-icon://flight`, select: client._event(`MENU_FIX2`), key: `Fix2` })
      .navigation_list_item({ text: `Fixed Entry 3`, icon: `sap-icon://email-read`, select: client._event(`MENU_FIX3`), key: `Fix3` })
      .navigation_list_item({ text: `Link`, icon: `sap-icon://chain-link`, href: `https://github.com/abap2UI5/abap2UI5` });
    const site_content = content.flex_box({ id: `site_content`, class: `sapUiTinyMarginTop sapUiTinyMarginBegin`, width: `100%`, height: `100%`, backgrounddesign: `Solid`, alignitems: `Center`, justifycontent: `Center` })
      .layout_data()
      .flex_item_data({ growfactor: `4`, backgrounddesign: `Solid` })
      .get_parent();
    this.render_site_content({ client, site_content });
    client.view_display(page.stringify());
  }

  render_site_content({ client, site_content } = {}) {
    switch (this.selected_menu_entry) {
      case `Home`:
        site_content.text(`Welcome to the Home Page`);
        break;
      case `Home1`:
        site_content.text(`Welcome to the Home Sub Page 1`);
        break;
      case `Home2`:
        site_content.text(`Welcome to the Home Sub Page 2`);
        break;
      case `Home3`:
        site_content.text(`Welcome to the Home Sub Page 3`);
        break;
      case `Customers`:
        site_content.text(`Welcome to the Customers Page`);
        break;
      case `Suppliers`:
        site_content.text(`Welcome to the Suppliers Page`);
        break;
      case `Fix1`:
        site_content.text(`Welcome to the first fixed Page`);
        break;
      case `Fix2`:
        site_content.text(`Welcome to the second fixed Page`);
        break;
      case `Fix3`:
        site_content.text(`Welcome to the third fixed Page`);
        break;
    }
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.selected_menu_entry = `Home`;
    }
    this.on_event({ client: client });
    this.render_main_view({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_258;
