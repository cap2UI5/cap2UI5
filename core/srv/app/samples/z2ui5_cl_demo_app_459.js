const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_459 extends z2ui5_if_app {
  t_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Notebook Basic 15`, category: `Laptops` }, { name: `Notebook Basic 17`, category: `Laptops` }, { name: `Ergo Screen E-I`, category: `Screens` }, { name: `Flat Basic`, category: `Screens` }, { name: `Comfort Easy`, category: `PDAs` }, { name: `ITelO Vault`, category: `PDAs` }]);
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let lv_from;
    let lv_to;
    let lv_pos;
    let ls_row;
    switch (this.client.get().EVENT) {
      case `REORDER`:
        try {
          lv_from = (this.client.get_event_arg()) + 1;
          lv_to = (this.client.get_event_arg(2)) + 1;
          lv_pos = this.client.get_event_arg(3);
          ls_row = z2ui5_cl_util.abap_copy(this.t_products[(lv_from) - 1]);
        } catch (error) {
          return;
        }
        if (lv_from === lv_to) {
          return;
        }
        // TODO(abap2js): DELETE t_products INDEX lv_from.
        if (lv_from < lv_to) {
          lv_to = lv_to - 1;
        }
        if (lv_pos === `Before`) {
          this.t_products.splice((lv_to) - 1, 0, z2ui5_cl_util.abap_copy(ls_row));
        } else {
          this.t_products.splice((lv_to + 1) - 1, 0, z2ui5_cl_util.abap_copy(ls_row));
        }
        this.client.view_model_update();
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Drag and Drop - Table reorder`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Drag a row and drop it between two others: the dnd:DragDropInfo drop event ` + `sends the dragged/drop indexes and the drop position to the backend, ABAP ` + `reorders the table, view_model_update refreshes the list.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const tab = page.table({ id: `reorderTable`, items: this.client._bind(this.t_products) });
    tab.drag_drop_config(``)
      ._generic({ name: `DragDropInfo`, ns: `dnd`, t_prop: [{ n: `sourceAggregation`, v: `items` }, { n: `targetAggregation`, v: `items` }, { n: `dropPosition`, v: `Between` }, { n: `drop`, v: this.client._event(`REORDER`, [`\${$parameters>/draggedControl/oParent}.indexOfItem(\${$parameters>/draggedControl})`, `\${$parameters>/droppedControl/oParent}.indexOfItem(\${$parameters>/droppedControl})`, `\${$parameters>/dropPosition}`]) }] });
    tab.columns().column().text(`Product`).get_parent().column().text(`Category`).get_parent();
    tab.items().column_list_item().cells().text(`{NAME}`).text(`{CATEGORY}`);
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_459;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

