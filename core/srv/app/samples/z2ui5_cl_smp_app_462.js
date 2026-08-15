const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_462 extends z2ui5_if_app {
  t_nodes = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_nodes = z2ui5_cl_util.abap_tab_assign(this.t_nodes, [{ text: `Sales`, nodes: [{ text: `Orders`, nodes: [{ text: `4711 - Notebook Basic` }, { text: `4712 - Ergo Screen` }] }, { text: `Quotations`, nodes: [{ text: `Q-001 - ITelO Vault` }] }] }, { text: `Purchasing`, nodes: [{ text: `Suppliers`, nodes: [{ text: `Very Best Screens` }] }] }]);
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get_event()) {
      case `OPEN_POPUP`:
        this.popup_display();
        break;
      case `CLOSE_POPUP`:
        this.client.popup_destroy();
        break;
    }
  }

  popup_display() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const dialog = popup.ele(`Dialog`).a({ n: `title`, v: `abap2UI5 - Tree in a dialog` });
    dialog.ele(`Tree`)
      .a({ n: `id`, v: `treePopup` })
      .a({ n: `items`, v: this.client._bind(this.t_nodes) })
      .a({ n: `headerText`, v: `Documents` })
      .tag(`StandardTreeItem`)
      .a({ n: `title`, v: `{TEXT}` });
    dialog.tag({ n: `Tree`, ns: `z2ui5` });
    dialog.ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CLOSE_POPUP`) })
      .a({ n: `text`, v: `Close` });
    this.client.popup_display(popup.stringify());
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
      .a({ n: `title`, v: `abap2UI5 - Tree - Inside a Dialog` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The button opens a Dialog whose content is a sap.m.Tree over a nested ABAP ` + `table. Expand some nodes, close and reopen: the z2ui5.cc.Tree companion ` + `preserves the expand state across the roundtrips.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`OPEN_POPUP`) })
      .a({ n: `text`, v: `Open tree popup` })
      .a({ n: `icon`, v: `sap-icon://tree` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_462;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

