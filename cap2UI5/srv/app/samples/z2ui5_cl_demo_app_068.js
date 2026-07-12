const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_068 extends z2ui5_if_app {
  prodh_nodes = null;
  client = null;

  popup_display_tree_select() {
    const dialog = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: `Choose Product here...`, contentheight: `50%`, contentwidth: `50%` });
    dialog.tree({ mode: `SingleSelectMaster`, items: this.client._bind_edit(this.prodh_nodes) })
      .items()
      .standard_tree_item({ selected: `{IS_SELECTED}`, title: `{TEXT}` });
    dialog.buttons()
      .button({ text: `Continue`, icon: `sap-icon://accept`, type: `Accept`, press: this.client._event(`CONTINUE`) })
      .button({ text: `Cancel`, icon: `sap-icon://decline`, type: `Reject`, press: this.client._event(`CANCEL`) });
    this.client.popup_display(dialog.stringify());
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Popup Tree select Entry`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    client.view_display(page.button({ text: `Open Popup here...`, press: client._event(`POPUP_TREE`) }).stringify());
  }

  on_init() {
    this.prodh_nodes = [{ text: `Machines`, prodh: `00100`, nodes: [{ text: `Pumps`, prodh: `0010000100`, nodes: [{ text: `Pump 001`, prodh: `001000010000000100` }, { text: `Pump 002`, prodh: `001000010000000105` }] }] }, { text: `Paints`, prodh: `00110`, nodes: [{ text: `Gloss paints`, prodh: `0011000105`, nodes: [{ text: `Paint 001`, prodh: `001100010500000100` }, { text: `Paint 002`, prodh: `001100010500000105` }] }] }];
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `POPUP_TREE`:
        this.popup_display_tree_select();
        break;
      case `CONTINUE`:
        client.popup_destroy();
        client.message_box_display(`Selected entry is set in the backend`);
        break;
      case `CANCEL`:
        client.popup_destroy();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_068;
