const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_191 extends z2ui5_if_app {
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
    this.mt_t002 = [{ id: `1`, class: `Z2UI5_CL_DEMO_APP_190`, count: `10`, table: `Z2UI5_T_11` }, { id: `2`, class: `Z2UI5_CL_DEMO_APP_190`, count: `20`, table: `Z2UI5_T_12` }, { id: `3`, class: `Z2UI5_CL_DEMO_APP_190`, count: `30`, table: `Z2UI5_T_11` }, { id: `4`, class: `Z2UI5_CL_DEMO_APP_190`, count: `40`, table: `Z2UI5_T_12` }];
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
      lo_items.icon_tab_filter({ text: line.class_, count: line.count, key: line.id });
      lo_items.icon_tab_separator();
    }
    this.mo_main_page = lo_items;
  }

  render_sub_app() {
    // TODO(abap2js): FIELD-SYMBOLS <view_display> TYPE any.
    // TODO(abap2js): READ TABLE mt_t002 REFERENCE INTO DATA(t002) WITH KEY id = mv_selectedkey.
    if (sy_subrc !== 0) {
      return;
    }
    switch (this.mv_selectedkey) {
      default:
        if (this.mv_selectedkey !== this.mv_selectedkey_tmp) {
          this.mo_app = null; // TODO(abap2js): CREATE OBJECT mo_app TYPE (t002->class).
        }
        try {
          // TODO(abap2js): CALL METHOD mo_app->(`SET_APP_DATA`) EXPORTING count = t002->count table = t002->table.
          this.view_display();
          // TODO(abap2js): ASSIGN mo_app->(`MO_PARENT_VIEW`) TO FIELD-SYMBOL(<view>).
          if (view != null) {
            view = this.mo_main_page;
          }
          // TODO(abap2js): CALL METHOD mo_app->(`Z2UI5_IF_APP~MAIN`) EXPORTING client = client.
        } catch (error) {
          return;
        }
        break;
    }
    this.client.view_model_update();
    // TODO(abap2js): ASSIGN mo_app->(`MV_VIEW_DISPLAY`) TO <view_display>.
    if (view_display === true) {
      view_display = false;
      this.client.view_display(this.mo_main_page.stringify());
    }
    if (this.mv_selectedkey !== this.mv_selectedkey_tmp) {
      this.client.view_display(this.mo_main_page.stringify());
      this.mv_selectedkey_tmp = this.mv_selectedkey;
    }
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
}

module.exports = z2ui5_cl_demo_app_191;
