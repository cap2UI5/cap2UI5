const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_317 extends z2ui5_if_app {
  mt_tree = null;
  mt_node = [];

  async main(client) {
    if (client.check_on_init()) {
      this.mt_node = [{ id: `01`, id_parent: ``, text: `Machines` }, { id: `03`, id_parent: `01`, text: `Pumps` }, { id: `04`, id_parent: `03`, text: `Pump 001` }, { id: `05`, id_parent: `03`, text: `Pump 002` }, { id: `02`, id_parent: ``, text: `Paints` }, { id: `06`, id_parent: `02`, text: `Gloss paints` }, { id: `07`, id_parent: `06`, text: `Paint 001` }, { id: `08`, id_parent: `06`, text: `Paint 002` }];
      this.build_tree();
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `expand`:
        client.follow_up_action(`debugger; z2ui5.oView.byId( 'tree' ).expandToLevel(10);`);
        break;
      case `onDrop`:
        this.mt_node.find((row) => row.id === client.get_event_arg(1)).id_parent = client.get_event_arg(2);
        this.build_tree();
        this.view_display({ client: client });
        break;
    }
  }

  build_tree() {
    this.mt_tree = {};
    let sy_tabix = 0;
    for (const ls_node of this.mt_node) {
      sy_tabix++;
      if (!(!id_parent)) continue;
      const ls_root = ({ ...ls_node });
      this.mt_tree.push(ls_root);
    }
    let sy_tabix = 0;
    for (const lr_node of this.mt_tree) {
      sy_tabix++;
      let sy_tabix = 0;
      for (const ls_node of this.mt_node) {
        sy_tabix++;
        if (!(ls_node.id_parent === lr_node.id)) continue;
        const ls_root2 = ({ ...ls_node });
        lr_node.nodes.push(ls_root2);
      }
    }
    let sy_tabix = 0;
    for (const lr_node of this.mt_tree) {
      sy_tabix++;
      let sy_tabix = 0;
      for (const lr_node2 of lr_node.nodes) {
        sy_tabix++;
        let sy_tabix = 0;
        for (const ls_node of this.mt_node) {
          sy_tabix++;
          if (!(ls_node.id_parent === lr_node2.id)) continue;
          const ls_root3 = ({ ...ls_node });
          lr_node2.nodes.push(ls_root3);
        }
      }
    }
    let sy_tabix = 0;
    for (const lr_node of this.mt_tree) {
      sy_tabix++;
      let sy_tabix = 0;
      for (const lr_node2 of lr_node.nodes) {
        sy_tabix++;
        let sy_tabix = 0;
        for (const lr_node3 of lr_node2.nodes) {
          sy_tabix++;
          let sy_tabix = 0;
          for (const ls_node of this.mt_node) {
            sy_tabix++;
            if (!(ls_node.id_parent === lr_node3.id)) continue;
            const ls_root4 = ({ ...ls_node });
            lr_node3.nodes.push(ls_root4);
          }
        }
      }
    }
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory().page();
    page._generic({ name: `script`, ns: `html` })
      ._cc_plain_xml(`function myFunction() { z2ui5.oView.byId(\`tree\`).expandToLevel(5); }`);
    const tree = page.tree({ items: client._bind(this.mt_tree), id: `tree` });
    tree.items()
      .standard_tree_item({ title: `{TEXT}` })
      .get()
      .custom_data()
      .core_custom_data({ key: `ID`, value: `{ID}` });
    tree.drag_drop_config(``)
      .drag_drop_info({ sourceaggregation: `items`, targetaggregation: `items`, dragstart: `Horizontal`, drop: client._event(`onDrop`, [`${$parameters>/draggedControl/mAggregations/customData/0/mProperties/value}`, `${$parameters>/droppedControl/mAggregations/customData/0/mProperties/value}`]) });
    client.follow_up_action(`myFunction()`);
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_317;
