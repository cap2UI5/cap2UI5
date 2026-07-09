const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_178 extends z2ui5_if_app {
  prodh_nodes = null;
  client = null;

  popup_display_tree_select() {
    const dialog = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: `Choose Product here...`, contentheight: `50%`, contentwidth: `50%`, beforeopen: `setState()`, beforeclose: `saveState()` });
    dialog.tree({ id: `tree`, mode: `SingleSelectMaster`, items: this.client._bind_edit(this.prodh_nodes) })
      .items()
      .standard_tree_item({ selected: `{IS_SELECTED}`, title: `{TEXT}` });
    dialog.buttons()
      .button({ text: `Continue`, icon: `sap-icon://accept`, type: `Accept`, press: this.client._event(`CONTINUE`) })
      .button({ text: `Cancel`, icon: `sap-icon://decline`, type: `Reject`, press: this.client._event(`CANCEL`) });
    this.client.popup_display(dialog.stringify());
  }

  view_display() {
    const lv_save_state_js = `function saveState() {` + ` ` + ` var treeTable = z2ui5.oViewPopup.Fragment.byId("popupId","tree");` + ` ` + ` z2ui5.treeState = treeTable.getBinding('items')
      .getCurrentTreeState();` + ` ` + ` }; `;
    const lv_reset_state_js = `function setState() { ` + ` ` + ` var treeTable = z2ui5.oViewPopup.Fragment.byId("popupId","tree");` + ` ` + ` if( z2ui5.treeState == undefined ) {` + ` ` + ` z2ui5.treeState = treeTable.getBinding('items')
      .getCurrentTreeState();` + ` ` + ` } else {` + ` ` + ` treeTable.getBinding("items")
      .setTreeState(z2ui5.treeState);` + ` ` + ` treeTable.getBinding("items")
      .refresh();` + ` ` + ` };` + ` ` + `};`;
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ ns: `html`, name: `script` })._cc_plain_xml(lv_save_state_js);
    view._generic({ ns: `html`, name: `script` })._cc_plain_xml(lv_reset_state_js);
    const page = view.shell()
      .page({ title: `abap2UI5 - Tree - Open & Close Popup to see the control keeping expanded`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true });
    this.client.view_display(page.button({ text: `Open Popup here...`, press: this.client._event(`POPUP_TREE`) }).stringify());
  }

  on_init() {
    this.prodh_nodes = [{ text: `Machines`, prodh: `00100`, nodes: [{ text: `Pumps`, prodh: `0010000100`, nodes: [{ text: `Pump 001`, prodh: `001000010000000100` }, { text: `Pump 002`, prodh: `001000010000000105` }] }] }, { text: `Paints`, prodh: `00110`, nodes: [{ text: `Gloss paints`, prodh: `0011000105`, nodes: [{ text: `Paint 001`, prodh: `001100010500000100` }, { text: `Paint 002`, prodh: `001100010500000105` }] }] }];
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `POPUP_TREE`:
        this.popup_display_tree_select();
        break;
      case `CONTINUE`:
        client.popup_destroy();
        break;
      case `CANCEL`:
        client.popup_destroy();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_178;
