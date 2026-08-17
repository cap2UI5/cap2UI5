const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_473 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Menu - Full Path of the Selected Item` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The toast shows the full path of the selected menu item ` + `("Create New Site > Official Store"), not only its own text. ` + `$controller.textPath( ) walks the item's parent chain in the control tree ` + `and joins the texts - a walk no binding path can express. Everything happens ` + `on the client, the menu selection needs no roundtrip at all.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const menu_selected = this.client.follow_up_action(z2ui5_if_client.cs_event.control_global, [`MESSAGE_TOAST`, `show`, `Action triggered on item: {0}`, `$controller.textPath(\${$parameters>/item})`]);
    const menu = page.ele(`HBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .ele(`MenuButton`)
      .a({ n: `text`, v: `Actions` })
      .ele(`Menu`)
      .a({ n: `itemSelected`, v: menu_selected });
    menu.ele(`MenuItem`)
      .a({ n: `text`, v: `Create New Site` })
      .tag(`MenuItem`)
      .a({ n: `text`, v: `Official Store` })
      .tag(`MenuItem`)
      .a({ n: `text`, v: `Franchise Store` })
      .tag(`MenuItem`)
      .a({ n: `text`, v: `Pop-up Store` });
    menu.ele(`MenuItem`)
      .a({ n: `text`, v: `Manage Users` })
      .tag(`MenuItem`)
      .a({ n: `text`, v: `Add User` })
      .tag(`MenuItem`)
      .a({ n: `text`, v: `Remove User` });
    menu.tag(`MenuItem`).a({ n: `text`, v: `Log Out` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_473;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

