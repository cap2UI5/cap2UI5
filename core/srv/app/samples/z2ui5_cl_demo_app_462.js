const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_462 extends z2ui5_if_app {
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
    switch (this.client.get().EVENT) {
      case `OPEN_POPUP`:
        this.popup_display();
        break;
      case `CLOSE_POPUP`:
        this.client.popup_destroy();
        break;
    }
  }

  popup_display() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog(`abap2UI5 - Tree in a dialog`);
    dialog.tree({ id: `treePopup`, headertext: `Documents`, items: this.client._bind(this.t_nodes) })
      .standard_tree_item({ title: `{TEXT}` });
    dialog._z2ui5().tree(`treePopup`);
    dialog.buttons().button({ text: `Close`, press: this.client._event(`CLOSE_POPUP`) });
    this.client.popup_display(popup.stringify());
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Tree - inside a popup`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The button opens a Dialog whose content is a sap.m.Tree over a nested ABAP ` + `table. Expand some nodes, close and reopen: the z2ui5.cc.Tree companion ` + `preserves the expand state across the roundtrips.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.vbox(`sapUiSmallMargin`)
      .button({ text: `Open tree popup`, icon: `sap-icon://tree`, press: this.client._event(`OPEN_POPUP`) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_462;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

