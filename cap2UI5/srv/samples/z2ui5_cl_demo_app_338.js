const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_338 extends z2ui5_if_app {
  mv_selectedkey = ``;
  mv_selectedkey_tmp = ``;
  mt_t002 = [];
  mo_app = null;
  client = null;
  mo_main_page = null;

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
    this.mt_t002 = [{ id: `1`, class: `Z2UI5_CL_DEMO_APP_339`, table: `Z2UI5_T_01` }, { id: `2`, class: `Z2UI5_CL_DEMO_APP_342`, table: `Z2UI5_T_01` }, { id: `3`, class: `Z2UI5_CL_DEMO_APP_339`, table: `Z2UI5_T_01` }];
    this.mv_selectedkey = `1`;
  }

  view_display() {
    let sy_tabix = 0;
    const view = z2ui5_cl_xml_view.factory().shell();
    const page = view.page({ id: `page_main`, title: `Main App calling Subapps`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const lo_items = page.icon_tab_bar({ class: `sapUiResponsiveContentPadding`, selectedkey: this.client._bind_edit(this.mv_selectedkey), select: this.client._event(`ONSELECTICONTABBAR`) })
      .items();
    sy_tabix = 0;
    for (const line of this.mt_t002) {
      sy_tabix++;
      lo_items.icon_tab_filter({ text: line.class, count: line.count, key: line.id });
      lo_items.icon_tab_separator();
    }
    this.mo_main_page = z2ui5_cl_util.abap_copy(lo_items);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
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
            fs_view = z2ui5_cl_util.abap_copy(this.mo_main_page);
            if (_fs$fs_view) _fs$fs_view.o[_fs$fs_view.k] = fs_view;
          }
          // TODO(abap2js): CALL METHOD mo_app->(`Z2UI5_IF_APP~MAIN`) EXPORTING client = client.
        } catch (error) {
          return;
        }
        break;
    }
    this.client.view_model_update();
    // TODO(abap2js): ASSIGN mo_app->(`MV_VIEW_DISPLAY`) TO <view_display>.
    if ((fs_view_display === true || fs_view_display === `X`)) {
      fs_view_display = false;
      if (_fs$fs_view_display) _fs$fs_view_display.o[_fs$fs_view_display.k] = fs_view_display;
      this.client.view_display(this.mo_main_page.stringify());
    }
    if (this.mv_selectedkey !== this.mv_selectedkey_tmp) {
      this.client.view_display(this.mo_main_page.stringify());
      this.mv_selectedkey_tmp = z2ui5_cl_util.abap_copy(this.mv_selectedkey);
    }
    this.client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_338;
