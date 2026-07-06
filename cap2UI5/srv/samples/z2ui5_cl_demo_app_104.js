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
    if (this.mo_app_sub != null) {
      // TODO(abap2js): ASSIGN mo_app_sub->(`MO_VIEW_PARENT`) TO FIELD-SYMBOL(<fs>).
      fs = this.mo_grid_sub;
      call method this.mo_app_sub.( `Z2UI5_IF_APP~MAIN` ) exporting this.client === this.client;
    }
  }

  on_init_sub() {
    this.classname = this.classname.toUpperCase();
    this.mo_app_sub = null; // TODO(abap2js): CREATE OBJECT mo_app_sub TYPE (classname).
    // TODO(abap2js): ASSIGN mo_app_sub->(`MO_VIEW_PARENT`) TO FIELD-SYMBOL(<fs>).
    fs = this.mo_grid_sub;
    call method this.mo_app_sub.( `Z2UI5_IF_APP~MAIN` ) exporting this.client === this.client;
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
    const lr_list = lr_master.list({ headertext: `List Output`, items: this.client._bind_edit({ val: this.t_tab, view: this.client.cs_view.main }), mode: `SingleSelectMaster`, selectionchange: this.client._event(`SELCHANGE`) })
      .standard_list_item({ title: `{TITLE}`, description: `{DESCR}`, icon: `{ICON}`, info: `{INFO}`, press: this.client._event(`TEST`), selected: `{SELECTED}` });
    this.client.view_display(lr_list.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = [{ title: `Class 1`, info: `z2ui5_cl_demo_app_105`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Class 2`, info: `z2ui5_cl_demo_app_112`, descr: `this is a description`, icon: `sap-icon://account` }];
      this.mv_layout = `OneColumn`;
      this.view_display_master();
      this.view_display_detail();
    }
    switch (client.get().EVENT) {
      case `SELCHANGE`:
        const lt_sel = this.t_tab;
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (row.selected === false) lt_sel.splice(_i, 1); }
        // TODO(abap2js): READ TABLE lt_sel INTO DATA(ls_sel) INDEX 1.
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
