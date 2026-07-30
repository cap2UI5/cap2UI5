const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_473 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Menu Item Path`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The toast shows the full path of the selected menu item ` + `("Create New Site > Official Store"), not only its own text. ` + `$controller.textPath( ) walks the item's parent chain in the control tree ` + `and joins the texts - a walk no binding path can express. Everything happens ` + `on the client, the menu selection needs no roundtrip at all.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const menu_selected = this.client._event_client(z2ui5_if_client.cs_event.control_global, [`MESSAGE_TOAST`, `show`, `Action triggered on item: {0}`, `$controller.textPath(\${$parameters>/item})`]);
    const menu = page.hbox({ class: `sapUiSmallMargin` })
      .menu_button({ text: `Actions` })
      .menu({ itemselected: menu_selected });
    menu._generic({ name: `MenuItem`, t_prop: [{ n: `text`, v: `Create New Site` }] })
      .menu_item({ text: `Official Store` })
      .menu_item({ text: `Franchise Store` })
      .menu_item({ text: `Pop-up Store` });
    menu._generic({ name: `MenuItem`, t_prop: [{ n: `text`, v: `Manage Users` }] })
      .menu_item({ text: `Add User` })
      .menu_item({ text: `Remove User` });
    menu.menu_item({ text: `Log Out` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_473;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

