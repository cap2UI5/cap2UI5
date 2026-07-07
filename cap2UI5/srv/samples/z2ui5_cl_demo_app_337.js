const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_336 = require("./z2ui5_cl_demo_app_336");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_337 extends z2ui5_if_app {
  mt_data = [];
  ms_data = [];
  mo_layout_obj = null;
  mo_layout_obj_2 = null;

  async main(client) {
    let sy_subrc = 0;
    let fs_val = null;
    let _fs$fs_val = null;
    let fs_val2 = null;
    let _fs$fs_val2 = null;
    let app;
    if (client.check_on_init()) {
      this.get_data();
      this.mo_layout_obj = z2ui5_cl_demo_app_333.factory({ i_data: (this.mt_data), vis_cols: 5 });
      this.mo_layout_obj_2 = z2ui5_cl_demo_app_333.factory({ i_data: (this.ms_data), vis_cols: 3 });
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `GO`:
        app = z2ui5_cl_demo_app_336.factory();
        client.nav_app_call(app);
        break;
    }
    if (client.get().CHECK_ON_NAVIGATED === true && client.check_on_init() === false) {
      this.view_display({ client: client });
    }
    if (this.mo_layout_obj.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data is not bound!`);
    }
    if (this.mo_layout_obj_2.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data is not bound!`);
    }
    // TODO(abap2js): ASSIGN mo_layout_obj->mr_data->* TO FIELD-SYMBOL(<val>).
    if (fs_val !== this.mt_data) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data <> mt_data!`);
    }
    // TODO(abap2js): ASSIGN mo_layout_obj_2->mr_data->* TO FIELD-SYMBOL(<val2>).
    if (fs_val2 !== this.ms_data) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data <> ms_data!`);
    }
    client.view_model_update();
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `CALL Next App`, press: client._event(`GO`), type: `Success` });
    this.xml_table({ i_page: page, i_client: client });
    this.xml_form({ i_page: page, i_client: client });
    client.view_display(page.stringify());
  }

  xml_table({ i_page, i_client } = {}) {
    let sy_tabix = 0;
    let lv_index;
    const table = i_page.table({ width: `auto`, items: i_client._bind_edit({ val: this.mt_data }) });
    const columns = table.columns();
    sy_tabix = 0;
    for (const layout of this.mo_layout_obj.ms_data.t_layout) {
      sy_tabix++;
      lv_index = sy_tabix;
      columns.column({ visible: i_client._bind({ val: layout.visible, tab: this.mo_layout_obj.ms_data.t_layout, tab_index: lv_index }) })
        .text(layout.name);
    }
    const column_list_item = columns.get_parent().items().column_list_item({ valign: `Middle`, type: `Inactive` });
    const cells = column_list_item.cells();
    sy_tabix = 0;
    for (const layout of this.mo_layout_obj.ms_data.t_layout) {
      sy_tabix++;
      lv_index = sy_tabix;
      cells.object_identifier({ text: `{${layout.name}}` });
    }
  }

  get_data() {
    // TODO(abap2js): SELECT id, id_prev, id_prev_app, id_prev_app_stack, timestampl FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF TABLE @mt_data UP TO 10 ROWS.
    this.ms_data = (() => { try { return this.mt_data[(1) - 1] ?? null; } catch { return null; } })();
  }

  xml_form({ i_page, i_client } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_value = null;
    let _fs$fs_value = null;
    let line;
    const form = i_page.simple_form({ editable: true, layout: `ResponsiveGridLayout`, adjustlabelspan: true })
      .content(`form`);
    let index = 0;
    sy_tabix = 0;
    for (const layout of this.mo_layout_obj.ms_data.t_layout) {
      sy_tabix++;
      index = index + 1;
      _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(this.ms_data, layout.name);
      fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
      sy_subrc = _fs$fs_value ? 0 : 4;
      if (sy_subrc !== 0) {
        return;
      }
      line = form.label({ wrapping: false, text: layout.name });
      line.input({ value: i_client._bind(fs_value), visible: i_client._bind({ val: layout.visible, tab: this.mo_layout_obj.ms_data.t_layout, tab_index: index }), enabled: false });
    }
  }
}

module.exports = z2ui5_cl_demo_app_337;
