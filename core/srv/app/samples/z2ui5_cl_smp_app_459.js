const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_459 extends z2ui5_if_app {
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
    switch (this.client.get_event()) {
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
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:dnd`, v: `sap.ui.core.dnd` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Table - Drag and Drop Rows` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Drag a row and drop it between two others: the dnd:DragDropInfo drop event ` + `sends the dragged/drop indexes and the drop position to the backend, ABAP ` + `reorders the table and the refreshed model updates the list.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tab = page.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_products) })
      .a({ n: `id`, v: `reorderTable` });
    tab.ele(`dragDropConfig`)
      .ele({ n: `DragDropInfo`, ns: `dnd` })
      .a({ n: `sourceAggregation`, v: `items` })
      .a({ n: `targetAggregation`, v: `items` })
      .a({ n: `dropPosition`, v: `Between` })
      .a({ n: `drop`, v: this.client._event(`REORDER`, [`\${$parameters>/draggedControl/oParent}.indexOfItem(\${$parameters>/draggedControl})`, `\${$parameters>/droppedControl/oParent}.indexOfItem(\${$parameters>/droppedControl})`, `\${$parameters>/dropPosition}`]) });
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Product` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Category` })
      .end();
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{NAME}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{CATEGORY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_459;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

