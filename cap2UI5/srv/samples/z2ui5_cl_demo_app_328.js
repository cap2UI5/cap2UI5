// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_demo_app_329 = require("./z2ui5_cl_demo_app_329");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_328 extends z2ui5_if_app {
  mt_table = null;
  mo_table_obj = null;

  async main(client) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let fs_selkz = null;
    let _fs$fs_selkz = null;
    let fs_table = null;
    let _fs$fs_table = null;
    let fs_val = null;
    let _fs$fs_val = null;
    let okay;
    if (client.check_on_init()) {
      this.get_data();
      this.mo_table_obj = z2ui5_cl_demo_app_329.factory(this.mt_table);
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `SELECTION_CHANGE`:
        client.view_model_update();
        break;
      case `GO`:
        // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
        sy_tabix = 0;
        for (const fs_line of fs_tab) {
          sy_tabix++;
          _fs$fs_selkz = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_line, `SELKZ`);
          fs_selkz = _fs$fs_selkz ? _fs$fs_selkz.o[_fs$fs_selkz.k] : null;
          sy_subrc = _fs$fs_selkz ? 0 : 4;
          if (sy_subrc !== 0) {
            continue;
          }
          if ((fs_selkz === true || fs_selkz === `X`)) {
            okay = true;
            break;
          }
        }
        if ((okay === true || okay === `X`)) {
          this.get_data();
          this.mo_table_obj = z2ui5_cl_demo_app_329.factory(this.mt_table);
          this.view_display({ client: client });
          // TODO(abap2js): ASSIGN mt_table->* TO FIELD-SYMBOL(<table>).
          // TODO(abap2js): ASSIGN mo_table_obj->mr_data->* TO FIELD-SYMBOL(<val>).
          if (fs_table !== fs_val) {
            client.message_toast_display(`Error - MT_TABLE <> MO_TABLE_OBJ->MR_TABLE_DATA`);
          } else {
            client.message_toast_display(`Success - MT_TABLE = MO_TABLE_OBJ->MR_TABLE_DATA`);
          }
        } else {
          client.message_toast_display(`Plases select a Line`);
        }
        break;
    }
  }

  view_display({ client } = {}) {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `GO`, press: client._event(`GO`), type: `Success` });
    // TODO(abap2js): ASSIGN mt_table->* TO FIELD-SYMBOL(<table>).
    page.table({ headertext: `Table`, mode: `MultiSelect`, items: client._bind_edit(fs_table), selectionchange: client._event(`SELECTION_CHANGE`) })
      .columns()
      .column()
      .text(`id `)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .text(`{ID}`);
    client.view_display(page.stringify());
  }

  get_data() {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let new_struct_desc;
    let new_table_desc;
    let selkz = false;
    const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_table_name(`Z2UI5_T_01`);
    t_comp.push(...[{ name: `SELKZ`, type: (cl_abap_datadescr.describe_by_data(selkz)) }]);
    try {
      new_struct_desc = cl_abap_structdescr.create(t_comp);
      new_table_desc = cl_abap_tabledescr.create({ p_line_type: new_struct_desc, p_table_kind: cl_abap_tabledescr.tablekind_std });
      // TODO(abap2js): CREATE DATA mt_table TYPE HANDLE new_table_desc.
      // TODO(abap2js): ASSIGN mt_table->* TO <table>.
      // TODO(abap2js): SELECT id FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 4 ROWS.
    } catch (error) {
    }
  }
}

module.exports = z2ui5_cl_demo_app_328;
