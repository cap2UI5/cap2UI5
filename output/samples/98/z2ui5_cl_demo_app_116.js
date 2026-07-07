const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_116 extends z2ui5_if_app {
  prodh_nodes = null;
  gv_user = ``;
  gv_date = null;
  mv_run_js = false;
  client = null;

  add_node({ p_prodh } = {}) {
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const symbol of this.prodh_nodes) {
      sy_tabix++;
      if (fs_fs1.prodh === p_prodh) {
        fs_fs1.counter = fs_fs1.counter + 1;
        break;
      } else {
        const _sy_tabix_1 = sy_tabix;
        sy_tabix = 0;
        for (const symbol of fs_fs1.nodes) {
          sy_tabix++;
          if (fs_fs2.prodh === p_prodh) {
            fs_fs2.counter = fs_fs2.counter + 1;
            break;
          } else {
            const _sy_tabix_2 = sy_tabix;
            sy_tabix = 0;
            for (const symbol of fs_fs2.nodes) {
              sy_tabix++;
              if (fs_fs3.prodh === p_prodh) {
                fs_fs3.counter = fs_fs3.counter + 1;
                break;
              }
            }
            sy_tabix = _sy_tabix_2;
          }
        }
        sy_tabix = _sy_tabix_1;
      }
    }
  }

  popover_display({ id } = {}) {
    const lo_popover = z2ui5_cl_xml_view.factory_popup();
    lo_popover.popover({ placement: `Right`, title: `SS` })
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `OK`, press: this.client._event(`POPOVER_OK`), type: `Emphasized` })
      .get_parent()
      .get_parent()
      .text(`TEST`);
    this.client.popover_display(lo_popover.stringify(), id);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.object_page_layout({ showtitleinheadercontent: true, uppercaseanchorbar: false });
    const header_title = page.header_title().object_page_dyn_header_title();
    header_title.expanded_heading().hbox().title(`PriceList`);
    const header_content = page.header_content(`uxap`);
    header_content.block_layout()
      .block_layout_row()
      .block_layout_cell({ backgroundcolorset: `ColorSet10`, backgroundcolorshade: `ShadeE` })
      .flex_box({ justifycontent: `SpaceBetween` })
      .hbox()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label({ design: `Bold`, text: `Something:` })
      .get_parent()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .text(`Other`)
      .get_parent()
      .get_parent()
      .hbox({ justifycontent: `End` })
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label({ design: `Bold`, text: `User:` })
      .label({ design: `Bold`, text: `Date:` })
      .get_parent()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .text(this.client._bind(this.gv_user))
      .text(this.client._bind(this.gv_date));
    const sections = page.sections();
    const cont = sections.object_page_section({ titleuppercase: false, id: `Sets`, title: `Sets` })
      .heading(`uxap`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `SETS`, title: `Sets` })
      .scroll_container({ vertical: true })
      .vbox()
      .tree_table({ id: `treeTable`, rows: `{path:'` + this.client._bind(this.prodh_nodes, { path: true }) + `', parameters: {arrayNames:['NODES']}}`, toggleopenstate: `saveState()` })
      .tree_columns()
      .tree_column(`Label`)
      .tree_template()
      .text(`{TEXT}`)
      .get_parent()
      .get_parent()
      .tree_column(`PRODH`)
      .tree_template()
      .text(`{PRODH}`)
      .get_parent()
      .get_parent()
      .tree_column(`Counter`)
      .tree_template()
      .link({ text: `{COUNTER}`, press: this.client._event(`POPOVER`, [`\${$source>/id}`]) })
      .get_parent()
      .get_parent()
      .tree_column(`ADD`)
      .tree_template()
      .button({ icon: `sap-icon://add`, press: this.client._event(`ROW_ADD`, [`\${PRODH}`]), tooltip: `ADD` })
      .get_parent()
      .get_parent();
    this.client.view_display(page.stringify());
  }

  on_init() {
    this.prodh_nodes = [{ text: `Machines`, prodh: `00100`, nodes: [{ text: `Pumps`, prodh: `0010000100`, nodes: [{ text: `Pump 001`, prodh: `001000010000000100` }, { text: `Pump 002`, prodh: `001000010000000105` }] }] }, { text: `Paints`, prodh: `00110`, nodes: [{ text: `Gloss paints`, prodh: `0011000105`, nodes: [{ text: `Paint 001`, prodh: `001100010500000100` }, { text: `Paint 002`, prodh: `001100010500000105` }] }] }];
    this.gv_user = sy_uname;
    this.gv_date = sy_datum;
  }

  async main(client) {
    let lv_save_state_js;
    let lv_reset_state_js;
    let lv_open_by_id;
    let lt_event_arg = [];
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      lv_save_state_js = `function saveState() {debugger;` + `\\n` + ` var treeTable = z2ui5.oView.byId("treeTable");` + `\\n` + ` z2ui5.treeState = treeTable.getBinding('rows')
        .getCurrentTreeState();` + `\\n` + ` }; `;
      lv_reset_state_js = `function setState() {debugger;` + `\\n` + ` var treeTable = z2ui5.oView.byId("treeTable");` + `\\n` + ` if( z2ui5.treeState == undefined ) {` + `\\n` + ` z2ui5.treeState = treeTable.getBinding('rows')
        .getCurrentTreeState();` + `\\n` + ` } else {` + `\\n` + ` treeTable.getBinding("rows")
        .setTreeState(z2ui5.treeState);` + `\\n` + ` treeTable.getBinding("rows")
        .refresh();` + `\\n` + ` z2ui5.treeState = treeTable.getBinding('rows')
        .getCurrentTreeState();` + `\\n` + ` };` + `\\n` + `};`;
      client.view_display(z2ui5_cl_xml_view.factory()._z2ui5().timer(client._event(`START`))._generic({ ns: `html`, name: `script` })._cc_plain_xml(lv_save_state_js).get_parent()._generic({ ns: `html`, name: `script` })._cc_plain_xml(lv_reset_state_js).stringify());
    }
    lt_event_arg = z2ui5_cl_util.struct_lower_keys(client.get().T_EVENT_ARG);
    switch (client.get().EVENT) {
      case `START`:
        this.view_display();
        break;
      case `CONTINUE`:
        client.popup_destroy();
        break;
      case `CANCEL`:
        client.popup_destroy();
        break;
      case `POPOVER`:
        lt_event_arg = z2ui5_cl_util.struct_lower_keys(client.get().T_EVENT_ARG);
        lv_open_by_id = lt_event_arg[(1) - 1];
        this.popover_display({ id: lv_open_by_id });
        break;
      case `ROW_ADD`:
        this.add_node({ p_prodh: lt_event_arg[(1) - 1] });
        this.mv_run_js = true;
        client.view_model_update();
        client.follow_up_action(`setState();`);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_116;
