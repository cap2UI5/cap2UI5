const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_211 extends z2ui5_if_app {
  mv_selectedkey = ``;
  mv_selectedkey_tmp = ``;
  mt_t002 = [];
  mo_app = null;
  mo_main_page = null;
  client = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `ONSELECTICONTABBAR`:
        switch (this.mv_selectedkey) {
          case ``:
            break;
          default:
            break;
        }
        break;
    }
  }

  on_init() {
    this.mt_t002 = [{ class: `Z2UI5_CL_DEMO_APP_212`, id: `1`, count: `5`, table: `Z2UI5_T003`, descr: `Table 01`, icon: `sap-icon://add` }, { class: `Z2UI5_CL_DEMO_APP_212`, id: `3`, count: `15`, table: `Z2UI5_T004`, descr: `Table 02`, icon: `sap-icon://accept` }];
    this.mv_selectedkey = `1`;
  }

  view_display() {
    let sy_tabix = 0;
    let text;
    let with_icon;
    const view = z2ui5_cl_xml_view.factory().shell();
    const page = view.page({ id: `page_main`, title: `Customizing`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const lo_items = page.icon_tab_bar({ class: `sapUiResponsiveContentPadding`, selectedkey: this.client._bind_edit(this.mv_selectedkey), select: this.client._event(`ONSELECTICONTABBAR`) })
      .items();
    sy_tabix = 0;
    for (const line of this.mt_t002) {
      sy_tabix++;
      text = line.descr;
      with_icon = line.icon;
      lo_items.icon_tab_filter({ icon: line.icon, iconcolor: `Positive`, count: line.count, text, key: line.id, showall: with_icon });
      lo_items.icon_tab_separator();
    }
    this.mo_main_page = lo_items;
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    }
    this.on_event();
    this.render_sub_app();
  }

  render_sub_app() {
    let sy_subrc = 0;
    let fs_view = null;
    let _fs$fs_view = null;
    let fs_view_display = null;
    let _fs$fs_view_display = null;
    let fs_view_update = null;
    let _fs$fs_view_update = null;
    let t002 = {};
    {
      const _t = this.mt_t002;
      const _i = _t.findIndex((_r) => _r.id === this.mv_selectedkey);
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      if (sy_subrc === 0) t002 = _t[_i];
    }
    if (sy_subrc !== 0) {
      return;
    }
    switch (this.mv_selectedkey) {
      default:
        if (this.mv_selectedkey !== this.mv_selectedkey_tmp) {
          this.mo_app = (() => { const _n = String(t002.class); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
        }
        try {
          // TODO(abap2js): CALL METHOD mo_app->(`SET_APP_DATA`) EXPORTING table = t002->table.
          this.view_display();
          // TODO(abap2js): ASSIGN mo_app->(`MO_PARENT_VIEW`) TO FIELD-SYMBOL(<view>).
          if (fs_view != null) {
            fs_view = this.mo_main_page;
            if (_fs$fs_view) _fs$fs_view.o[_fs$fs_view.k] = fs_view;
          }
          // TODO(abap2js): CALL METHOD mo_app->(`Z2UI5_IF_APP~MAIN`) EXPORTING client = client.
        } catch (error) {
          return;
        }
        break;
    }
    // TODO(abap2js): ASSIGN mo_app->(`MV_VIEW_DISPLAY`) TO FIELD-SYMBOL(<view_display>).
    if (fs_view_display === true) {
      fs_view_display = false;
      if (_fs$fs_view_display) _fs$fs_view_display.o[_fs$fs_view_display.k] = fs_view_display;
      this.client.view_display(this.mo_main_page.stringify());
    }
    // TODO(abap2js): ASSIGN mo_app->(`MV_VIEW_MODEL_UPDATE`) TO FIELD-SYMBOL(<view_update>).
    if (fs_view_update === true) {
      fs_view_update = false;
      if (_fs$fs_view_update) _fs$fs_view_update.o[_fs$fs_view_update.k] = fs_view_update;
      this.client.view_model_update();
    }
    if (this.mv_selectedkey !== this.mv_selectedkey_tmp) {
      this.client.view_display(this.mo_main_page.stringify());
      this.mv_selectedkey_tmp = this.mv_selectedkey;
    }
  }
}

module.exports = z2ui5_cl_demo_app_211;
