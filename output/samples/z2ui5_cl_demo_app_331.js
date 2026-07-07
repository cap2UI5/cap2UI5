const z2ui5_cl_demo_app_329 = require("./z2ui5_cl_demo_app_329");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_331 extends z2ui5_if_app {
  ms_struc = [];
  mo_table_obj = null;

  async main(client) {
    if (client.check_on_init()) {
      this.get_data();
      this.mo_table_obj = z2ui5_cl_demo_app_329.factory((this.ms_struc));
      this.view_display({ client: client });
    }
    if (!this.ms_struc) {
      client.message_toast_display(`ERROR - MS_STRUC is initial!`);
    }
    client.view_model_update();
  }

  view_display({ client } = {}) {
    let sy_subrc = 0;
    let fs_val = null;
    let _fs$fs_val = null;
    let fs_value = null;
    let _fs$fs_value = null;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `GO`, press: client._event(`GO`), type: `Success` });
    const form = page.simple_form({ editable: true, layout: `ResponsiveGridLayout`, adjustlabelspan: true })
      .content(`form`);
    // TODO(abap2js): ASSIGN mo_table_obj->mr_data->* TO FIELD-SYMBOL(<val>).
    _fs$fs_value = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_val, `ID`);
    fs_value = _fs$fs_value ? _fs$fs_value.o[_fs$fs_value.k] : null;
    sy_subrc = _fs$fs_value ? 0 : 4;
    if (!(fs_value != null)) {
      return;
    }
    const line = form.label({ wrapping: false, text: `ID` });
    line.input(client._bind(fs_value));
    client.view_display(page.stringify());
  }

  get_data() {
    // TODO(abap2js): SELECT SINGLE * FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF @ms_struc.
  }
}

module.exports = z2ui5_cl_demo_app_331;
