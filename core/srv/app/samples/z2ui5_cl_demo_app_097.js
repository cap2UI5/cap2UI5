const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_097 extends z2ui5_if_app {
  t_tab = [];
  t_tab2 = [];
  mv_layout = ``;
  mv_check_enabled_01 = true;
  mv_check_enabled_02 = false;
  client = null;

  view_display_detail() {
    const lo_view_nested = z2ui5_cl_xml_view.factory();
    const page = lo_view_nested.page(`Nested View`);
    const tab = page.ui_table({ rows: this.client._bind_edit(this.t_tab2, { view: this.client.cs_view.nested }), editable: false, alternaterowcolors: true, rowactioncount: `1`, fixedcolumncount: `1`, selectionmode: `None`, sort: this.client._event(`SORT`), filter: this.client._event(`FILTER`), customfilter: this.client._event(`CUSTOMFILTER`) });
    tab.ui_extension().overflow_toolbar().title(`Products`);
    const lo_columns = tab.ui_columns();
    lo_columns.ui_column({ sortproperty: `TITLE`, filterproperty: `TITLE` })
      .text(`Index`)
      .ui_template()
      .text(`{TITLE}`);
    lo_columns.ui_column({ sortproperty: `DESCR`, filterproperty: `DESCR` })
      .text(`DESCR`)
      .ui_template()
      .text(`{DESCR}`);
    lo_columns.ui_column({ sortproperty: `INFO`, filterproperty: `INFO` }).text(`INFO`).ui_template().text(`{INFO}`);
    lo_columns.get_parent()
      .ui_row_action_template()
      .ui_row_action()
      .ui_row_action_item({ icon: `sap-icon://delete`, press: this.client._event(`ROW_DELETE`, [`\${UUID}`]) });
    this.client.nest_view_display(lo_view_nested.stringify(), `test`, `addMidColumnPage`, `removeAllMidColumnPages`);
  }

  view_display_master() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Master Detail Page with Nested View`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `A master-detail screen built with FlexibleColumnLayout: select a list row and its ` + `detail opens in a second column as a nested view with a table.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const col_layout = page.flexible_column_layout({ layout: this.client._bind_edit(this.mv_layout), id: `test` });
    const lr_master = col_layout.begin_column_pages();
    const lr_list = lr_master.list({ headertext: `List Output`, items: this.client._bind_edit(this.t_tab, { view: this.client.cs_view.main }), mode: `SingleSelectMaster`, selectionchange: this.client._event(`SELCHANGE`) })
      .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}`, press: this.client._event(`TEST`), selected: `{SELECTED}` });
    this.client.view_display(lr_list.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let lt_sel;
    let ls_sel;
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ title: `row_01`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_02`, info: `incompleted`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_03`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_04`, info: `working`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_05`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `row_06`, info: `completed`, descr: `this is a description`, icon: `sap-icon://account` }]);
      this.mv_layout = `OneColumn`;
      this.view_display_master();
      this.view_display_detail();
    }
    switch (client.get().EVENT) {
      case `ROW_DELETE`:
        for (let _i = this.t_tab2.length - 1; _i >= 0; _i--) { const row = this.t_tab2[_i]; if (row.uuid === client.get_event_arg()) this.t_tab2.splice(_i, 1); }
        client.nest_view_model_update();
        break;
      case `SELCHANGE`:
        lt_sel = z2ui5_cl_util.abap_copy(this.t_tab);
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (!(row.selected === true || row.selected === `X`)) lt_sel.splice(_i, 1); }
        ls_sel = {};
        {
          const _t = lt_sel;
          const _i = (1) - 1;
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) ls_sel = _t[_i];
        }
        ls_sel.uuid = z2ui5_cl_sample_context.uuid_get_c32();
        this.t_tab2.push(z2ui5_cl_util.abap_copy(ls_sel));
        this.mv_layout = `TwoColumnsMidExpanded`;
        client.nest_view_model_update();
        client.view_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_097;

const z2ui5_cl_sample_context = require("./z2ui5_cl_sample_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

