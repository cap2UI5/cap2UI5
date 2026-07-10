const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_136 extends z2ui5_if_app {
  mv_path = ``;
  mv_value = ``;
  mr_table = null;
  mv_check_edit = false;
  mv_check_download = false;
  client = null;

  on_event() {
    let lv_data2;
    let lv_ready;
    try {
      switch (this.client.get().EVENT) {
        case `START`:
        case `CHANGE`:
          this.view_display();
          break;
        case `UPLOAD`:
          let [lv_dummy, lv_data] = this.mv_value.split(`;`);
          [lv_dummy, lv_data] = lv_data.split(`,`);
          lv_data2 = z2ui5_cl_util.conv_decode_x_base64(lv_data);
          lv_ready = z2ui5_cl_util.conv_get_string_by_xstring(lv_data2);
          this.mr_table = z2ui5_cl_util.itab_get_itab_by_csv(lv_ready);
          this.client.message_box_display(`CSV loaded to table`);
          this.view_display();
          this.mv_value = {};
          this.mv_path = {};
          break;
      }
    } catch (x) {
      this.client.message_box_display(x.get_text(), `error`);
    }
  }

  view_display() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let tab;
    let lr_fields;
    let lo_cols;
    let lo_cells;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - CSV to ABAP internal Table`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    if (this.mr_table) {
      // TODO(abap2js): ASSIGN mr_table->* TO <tab>.
      tab = page.table(((this.mv_check_edit === true || this.mv_check_edit === `X`) ? this.client._bind_edit(fs_tab) : this.client._bind_edit(fs_tab)))
        .header_toolbar()
        .overflow_toolbar()
        .title(`CSV Content`)
        .toolbar_spacer()
        .get_parent()
        .get_parent();
      lr_fields = z2ui5_cl_util.rtti_get_t_attri_by_any(fs_tab);
      lo_cols = tab.columns();
      sy_tabix = 0;
      for (const lr_col of lr_fields) {
        sy_tabix++;
        lo_cols.column().text(lr_col.name);
      }
      lo_cells = tab.items().column_list_item().cells();
      sy_tabix = 0;
      for (const lr_col of lr_fields) {
        sy_tabix++;
        lo_cells.text(`{` + lr_col.name + `}`);
      }
    }
    const footer = page.footer().overflow_toolbar();
    footer._z2ui5()
      .file_uploader({ value: this.client._bind_edit(this.mv_value), path: this.client._bind_edit(this.mv_path), placeholder: `filepath here...`, upload: this.client._event(`UPLOAD`) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`)) {
      this.view_display();
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_136;
