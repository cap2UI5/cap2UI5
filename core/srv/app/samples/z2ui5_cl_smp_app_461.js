const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_461 extends z2ui5_if_app {
  t_nodes = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_nodes = z2ui5_cl_util.abap_tab_assign(this.t_nodes, [{ text: `Inbox`, nodes: [{ text: `Invoice.pdf` }, { text: `Contract.docx` }] }, { text: `Archive`, nodes: [{ text: `Old_Report.pdf` }] }, { text: `Trash` }]);
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let sy_subrc = 0;
    let fs_from = null;
    let _fs$fs_from = null;
    let fs_to = null;
    let _fs$fs_to = null;
    let lv_drag_lines;
    let lv_drop_lines;
    let lv_from_root;
    let lv_from_child;
    let lv_to_root;
    let ls_child;
    switch (this.client.get_event()) {
      case `MOVE_NODE`:
        let lt_drag = this.client.get_event_arg().split(`/`);
        let lt_drop = this.client.get_event_arg(2).split(`/`);
        lv_drag_lines = z2ui5_cl_util.abap_copy(lt_drag.length);
        lv_drop_lines = z2ui5_cl_util.abap_copy(lt_drop.length);
        if (lv_drag_lines < 4 || lv_drop_lines < 2 || (() => { try { return lt_drag[(lv_drag_lines - 1) - 1] ?? null; } catch { return null; } })() !== `NODES` || (() => { try { return lt_drag[(lv_drag_lines - 3) - 1] ?? null; } catch { return null; } })() !== `T_NODES` || (() => { try { return lt_drop[(lv_drop_lines - 1) - 1] ?? null; } catch { return null; } })() !== `T_NODES`) {
          this.client.message_toast_display(`drop a file onto a folder`);
          return;
        }
        try {
          lv_from_root = (lt_drag[(lv_drag_lines - 2) - 1]) + 1;
          lv_from_child = (lt_drag[(lv_drag_lines) - 1]) + 1;
          lv_to_root = (lt_drop[(lv_drop_lines) - 1]) + 1;
          ls_child = z2ui5_cl_util.abap_copy(this.t_nodes[(lv_from_root) - 1].nodes[(lv_from_child) - 1]);
        } catch (error) {
          return;
        }
        if (lv_from_root === lv_to_root) {
          return;
        }
        fs_from = this.t_nodes[(lv_from_root) - 1];
        _fs$fs_from = null;
        sy_subrc = 0;
        if (sy_subrc !== 0) {
          return;
        }
        fs_to = this.t_nodes[(lv_to_root) - 1];
        _fs$fs_to = null;
        sy_subrc = 0;
        if (sy_subrc !== 0) {
          return;
        }
        // TODO(abap2js): DELETE <from>-nodes INDEX lv_from_child.
        fs_to.nodes.push(z2ui5_cl_util.abap_copy(ls_child));
        this.view_display();
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
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` })
      .a({ n: `xmlns:dnd`, v: `sap.ui.core.dnd` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Tree - Drag and Drop Nodes` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Drag a file onto another folder: the drop event ships the binding context ` + `paths of both tree items, ABAP moves the node inside the nested table and ` + `redraws the view - the z2ui5.cc.Tree companion keeps the expanded nodes open.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tree = page.ele(`Tree`)
      .a({ n: `id`, v: `tree1` })
      .a({ n: `items`, v: this.client._bind(this.t_nodes) })
      .a({ n: `headerText`, v: `Folders` });
    tree.ele(`dragDropConfig`)
      .ele({ n: `DragDropInfo`, ns: `dnd` })
      .a({ n: `sourceAggregation`, v: `items` })
      .a({ n: `targetAggregation`, v: `items` })
      .a({ n: `dropPosition`, v: `On` })
      .a({ n: `drop`, v: this.client._event(`MOVE_NODE`, [`\${$parameters>/draggedControl}.getBindingContext().getPath()`, `\${$parameters>/droppedControl}.getBindingContext().getPath()`]) });
    tree.tag(`StandardTreeItem`).a({ n: `title`, v: `{TEXT}` });
    page.tag({ n: `Tree`, ns: `z2ui5` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_461;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

