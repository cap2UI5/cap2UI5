const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_104 extends z2ui5_if_app {
  mo_app_sub = null;
  classname = ``;
  t_tab = [];
  t_tab2 = [];
  mv_layout = ``;
  mv_title = ``;
  mv_check_enabled_01 = true;
  mv_check_enabled_02 = false;
  mo_grid_sub = null;
  lo_view_nested = null;
  client = null;

  on_event_sub() {
    let sy_subrc = 0;
    let fs_fs = null;
    let _fs$fs_fs = null;
    if (this.mo_app_sub != null) {
      // TODO(abap2js): ASSIGN mo_app_sub->(`MO_VIEW_PARENT`) TO FIELD-SYMBOL(<fs>).
      fs_fs = this.mo_grid_sub;
      if (_fs$fs_fs) _fs$fs_fs.o[_fs$fs_fs.k] = fs_fs;
      // TODO(abap2js): CALL METHOD mo_app_sub->(`Z2UI5_IF_APP~MAIN`) EXPORTING client = client.
    }
  }

  on_init_sub() {
    let sy_subrc = 0;
    let fs_fs = null;
    let _fs$fs_fs = null;
    this.classname = this.classname.toUpperCase();
    this.mo_app_sub = (() => { const _n = String(this.classname); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
    // TODO(abap2js): ASSIGN mo_app_sub->(`MO_VIEW_PARENT`) TO FIELD-SYMBOL(<fs>).
    fs_fs = this.mo_grid_sub;
    if (_fs$fs_fs) _fs$fs_fs.o[_fs$fs_fs.k] = fs_fs;
    // TODO(abap2js): CALL METHOD mo_app_sub->(`Z2UI5_IF_APP~MAIN`) EXPORTING client = client.
  }

  view_display_detail() {
    this.lo_view_nested = z2ui5_cl_xml_view.factory();
    const page = this.lo_view_nested.page(`Nested View`);
    this.mo_grid_sub = page.grid(`L12 M12 S12`).content(`layout`);
  }

  view_display_master() {
    const page = z2ui5_cl_xml_view.factory()
      .page({ title: `abap2UI5 - Master Detail Page with Nested View`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true });
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
      this.t_tab = [{ title: `Class 1`, info: `z2ui5_cl_demo_app_105`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Class 2`, info: `z2ui5_cl_demo_app_112`, descr: `this is a description`, icon: `sap-icon://account` }];
      this.mv_layout = `OneColumn`;
      this.view_display_master();
      this.view_display_detail();
    }
    switch (client.get().EVENT) {
      case `SELCHANGE`:
        lt_sel = this.t_tab;
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (row.selected === false) lt_sel.splice(_i, 1); }
        ls_sel = {};
        {
          const _t = lt_sel;
          const _i = (1) - 1;
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) ls_sel = _t[_i];
        }
        this.t_tab2.push(ls_sel);
        if (this.classname) {
          this.view_display_master();
        }
        this.classname = ls_sel.info;
        this.mv_layout = `TwoColumnsMidExpanded`;
        client.view_model_update();
        this.view_display_detail();
        this.on_init_sub();
        client.nest_view_display(this.lo_view_nested.stringify(), `test`, `addMidColumnPage`, `removeAllMidColumnPages`);
        break;
    }
    this.on_event_sub();
  }
}

module.exports = z2ui5_cl_demo_app_104;
