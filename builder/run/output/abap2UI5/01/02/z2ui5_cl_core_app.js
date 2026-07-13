const z2ui5_cl_abap2ui5_context = require("abap2UI5/z2ui5_cl_abap2ui5_context");
// TODO(abap2js): unresolved reference z2ui5_cl_core_srv_draft — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_core_srv_model — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_abap2ui5_error = require("abap2UI5/z2ui5_cx_abap2ui5_error");

class z2ui5_cl_core_app {
  static mt_buffer = [];

  mt_attri = null;
  mo_app = null;
  ms_draft = null;

  static all_xml_parse({ xml } = {}) {
    let result = null;
    // TODO(abap2js): z2ui5_cl_abap2ui5_context=>xml_parse( EXPORTING xml = xml IMPORTING any = result ).
    return result;
  }

  all_xml_stringify() {
    let result = ``;
    const lo_model = this.create_model();
    try {
      lo_model.main_attri_db_save_srtti();
      result = z2ui5_cl_abap2ui5_context.xml_stringify(this);
      lo_model.main_attri_db_load();
      return result;
    } catch (error) {
    }
    try {
      result = z2ui5_cl_abap2ui5_context.xml_stringify(this);
      return result;
    } catch (error) {
    }
    try {
      lo_model.main_attri_refresh();
      lo_model.main_attri_db_save_srtti();
      result = z2ui5_cl_abap2ui5_context.xml_stringify(this);
      lo_model.main_attri_db_load();
      return result;
    } catch (x) {
    }
    throw new z2ui5_cx_abap2ui5_error({ val: `<p>${x.get_text()}<p>Please check if all generic data references are public attributes of your class` });
    return result;
  }

  constructor() {
    // TODO(abap2js): CREATE DATA mt_attri.
  }

  static db_load({ id } = {}) {
    let result = null;
    let sy_subrc = 0;
    const lv_id = (id);
    let lr_buf = {};
    {
      const _t = z2ui5_cl_core_app.mt_buffer;
      const _i = _t.findIndex((_r) => _r.id === lv_id);
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      if (sy_subrc === 0) lr_buf = _t[_i];
    }
    if (sy_subrc === 0) {
      result = z2ui5_cl_util.abap_copy(lr_buf.app);
      return result;
    }
    const lo_db = new z2ui5_cl_core_srv_draft();
    const ls_db = lo_db.read_draft(id);
    result = z2ui5_cl_core_app.all_xml_parse({ xml: ls_db.data });
    result.create_model().main_attri_db_load();
    z2ui5_cl_core_app.mt_buffer.push({ id: lv_id, app: result });
    return result;
  }

  static db_load_buffer_clear() {
    z2ui5_cl_core_app.mt_buffer = [];
  }

  static db_load_by_app({ app } = {}) {
    let result = null;
    const lo_db = new z2ui5_cl_core_srv_draft();
    const ls_db = lo_db.read_draft(app.id_draft);
    result = z2ui5_cl_core_app.all_xml_parse({ xml: ls_db.data });
    result.mo_app = z2ui5_cl_util.abap_copy(app);
    result.create_model().main_attri_db_load();
    return result;
  }

  db_save() {
    let li_app;
    if (this.mo_app != null) {
      li_app = (this.mo_app);
      li_app.id_draft = z2ui5_cl_util.abap_copy(this.ms_draft.id);
      li_app.check_initialized = true;
    }
    const lo_db = new z2ui5_cl_core_srv_draft();
    lo_db.create({ draft: this.ms_draft, model_xml: this.all_xml_stringify() });
  }

  model_json_parse({ iv_view, io_model } = {}) {
    this.create_model().main_json_to_attri({ view: iv_view, model: io_model });
  }

  model_json_stringify() {
    let result = ``;
    result = this.create_model().main_json_stringify();
    return result;
  }

  create_model() {
    let result = null;
    result = new z2ui5_cl_core_srv_model({ attri: this.mt_attri, app: this.mo_app });
    return result;
  }
}

module.exports = z2ui5_cl_core_app;
