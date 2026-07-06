// TODO(abap2js): unresolved reference z2ui5_cl_core_srv_model — add require manually
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");
const z2ui5_if_core_types = require("abap2UI5/z2ui5_if_core_types");

class z2ui5_cl_core_srv_bind {
  mo_app = null;
  mr_attri = null;
  ms_config = null;
  mv_type = ``;

  bind_tab_cell({ iv_name, iv_val } = {}) {
    let result = ``;
    let sy_tabix = 0;
    let lr_ref_in = null;
    // TODO(abap2js): FIELD-SYMBOLS <tab> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <ele> TYPE any.
    // TODO(abap2js): ASSIGN ms_config-tab->* TO <tab>.
    // TODO(abap2js): ASSIGN <tab>[ ms_config-tab_index ] TO <row>.
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(this.ms_config.tab);
    sy_tabix = 0;
    for (const SYMBOL of lt_attri) {
      sy_tabix++;
      // TODO(abap2js): ASSIGN COMPONENT <comp>-name OF STRUCTURE <row> TO <ele>.
      if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
      lr_ref_in = (ele);
      if (iv_val === lr_ref_in) {
        result = `${iv_name}/${this.shift_right((this.ms_config.tab_index - 1))}/${comp.name}`;
        return result;
      }
    }
    throw new z2ui5_cx_util_error({ val: `BINDING_ERROR_TAB_CELL_LEVEL - No class attribute for binding found - Please check if the bound values are public attributes of your class` });
    return result;
  }

  check_raise_existing() {
    if (this.mr_attri.bind_type !== this.mv_type) {
      throw new z2ui5_cx_util_error({ val: `<p>Binding Error - Two different binding types for same attribute used (${this.mr_attri.name}).` });
    }
    if (this.mr_attri.custom_mapper != null && this.ms_config.custom_mapper != null && z2ui5_cl_util.rtti_get_classname_by_ref(this.mr_attri.custom_mapper) !== z2ui5_cl_util.rtti_get_classname_by_ref(this.ms_config.custom_mapper)) {
      throw new z2ui5_cx_util_error({ val: `<p>Binding Error - Two different mappers used for the same attribute (${this.mr_attri.name}).` });
    }
    if (this.mr_attri.custom_mapper_back != null && this.ms_config.custom_mapper_back != null && z2ui5_cl_util.rtti_get_classname_by_ref(this.mr_attri.custom_mapper_back) !== z2ui5_cl_util.rtti_get_classname_by_ref(this.ms_config.custom_mapper_back)) {
      throw new z2ui5_cx_util_error({ val: `<p>Binding Error - Two different mappers back used for the same attribute (${this.mr_attri.name}).` });
    }
    if (this.mr_attri.custom_filter != null && this.ms_config.custom_filter != null && z2ui5_cl_util.rtti_get_classname_by_ref(this.mr_attri.custom_filter) !== z2ui5_cl_util.rtti_get_classname_by_ref(this.ms_config.custom_filter)) {
      throw new z2ui5_cx_util_error({ val: `<p>Binding Error - Two different filters used for the same attribute (${this.mr_attri.name}).` });
    }
  }

  check_raise_new() {
    if (z2ui5_cl_util.rtti_check_serializable(this.mr_attri.custom_filter_back) === false) {
      throw new z2ui5_cx_util_error({ val: `<p>custom_filter_back used but it is not serializable - please use if_serializable_object` });
    }
    if (z2ui5_cl_util.rtti_check_serializable(this.mr_attri.custom_mapper_back) === false) {
      throw new z2ui5_cx_util_error({ val: `<p>custom_mapper_back used but it is not serializable - please use if_serializable_object` });
    }
  }

  constructor({ app } = {}) {
    this.mo_app = app;
  }

  get_client_name() {
    let result = ``;
    result = this.mr_attri.name.replaceAll(`-`, `/`).replaceAll(`>`, ``);
    result = (this.mv_type === z2ui5_if_core_types.cs_bind_type.two_way ? `/${z2ui5_if_core_types.cs_ui5.two_way_model}` : null) + `/${result}`;
    return result;
  }

  main({ val, data, config } = {}) {
    let result = ``;
    if (z2ui5_cl_util.check_bound_a_not_initial(config.tab)) {
      result = this.main_cell({ val, type, config });
      return result;
    }
    this.ms_config = config;
    this.mv_type = type;
    const lo_model = new z2ui5_cl_core_srv_model({ attri: this.mo_app.mt_attri, app: this.mo_app.mo_app });
    this.mr_attri = lo_model.main_attri_search(val);
    if (this.mr_attri.name_ref) {
      this.mr_attri = (this.mo_app.mt_attri.find((row) => row.name === this.mr_attri.name_ref));
    }
    if (this.mr_attri.bind_type) {
      this.check_raise_existing();
    } else {
      this.check_raise_new();
      this.update_model_attri();
    }
    result = this.mr_attri.name_client;
    if (result === `/${z2ui5_if_core_types.cs_ui5.two_way_model}`) {
      throw new z2ui5_cx_util_error({ val: `<p>Name of variable not allowed - XX is a reserved word - use another name for your attribute` });
    }
    if (this.ms_config.switch_default_model === true) {
      result = `http>${result}`;
    }
    if (this.ms_config.path_only === false) {
      result = `{${result}}`;
    }
    return result;
  }

  main_cell({ val, data, config } = {}) {
    let result = ``;
    this.ms_config = config;
    const lo_bind = new z2ui5_cl_core_srv_bind(this.mo_app);
    result = lo_bind.main({ val: config.tab, type, config: { path_only: true } });
    result = this.bind_tab_cell({ iv_name: result, iv_val: val });
    if (this.ms_config.path_only === false) {
      result = `{${result}}`;
    }
    return result;
  }

  update_model_attri() {
    this.mr_attri.bind_type = this.mv_type;
    this.mr_attri.custom_filter = this.ms_config.custom_filter;
    this.mr_attri.custom_filter_back = this.ms_config.custom_filter_back;
    this.mr_attri.custom_mapper = this.ms_config.custom_mapper;
    this.mr_attri.custom_mapper_back = this.ms_config.custom_mapper_back;
    this.mr_attri.view = (!this.ms_config.view ? z2ui5_if_client.cs_view.main : this.ms_config.view);
    this.mr_attri.name_client = this.get_client_name();
  }
}

module.exports = z2ui5_cl_core_srv_bind;
