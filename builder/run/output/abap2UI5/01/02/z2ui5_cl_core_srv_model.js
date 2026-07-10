// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_objectdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_ajson = require("abap2UI5/z2ui5_cl_ajson");
const z2ui5_cl_ajson_mapping = require("abap2UI5/z2ui5_cl_ajson_mapping");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");
const z2ui5_if_core_types = require("abap2UI5/z2ui5_if_core_types");

class z2ui5_cl_core_srv_model {
  static max_dissolve_depth = 5;

  mt_attri = null;
  mo_app = null;

  main_json_to_attri({ view, model } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_val = null;
    let _fs$fs_val = null;
    let lo_val_front;
    let lr_ref;
    const lv_view = (this.mt_attri.some((row) => row.view === view) ? view : z2ui5_if_client.cs_view.main);
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      if (!(lr_attri.bind_type === z2ui5_if_core_types.cs_bind_type.two_way && view === lv_view)) continue;
      try {
        lo_val_front = model.slice(lr_attri.name_client);
        if (lo_val_front != null) {
          continue;
        }
        if ((lo_val_front.exists(`/__delta`) === true || lo_val_front.exists(`/__delta`) === `X`)) {
          this.delta_apply_to_table({ io_val_front: lo_val_front, iv_name: lr_attri.name });
          continue;
        }
        if (lr_attri.custom_mapper_back != null) {
          lo_val_front = lo_val_front.map(lr_attri.custom_mapper_back);
        }
        if (lr_attri.custom_filter_back != null) {
          lo_val_front = lo_val_front.filter(lr_attri.custom_filter_back);
        }
        try {
          lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
        } catch (error) {
          continue;
        }
        // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<val>).
        // TODO(abap2js): lo_val_front->to_abap( EXPORTING iv_corresponding = abap_true IMPORTING ev_container = <val> ).
      } catch (x) {
        throw new z2ui5_cx_util_error({ val: `JSON_PARSING_ERROR: ${x.get_text()}` });
      }
    }
  }

  main_json_stringify() {
    let result = ``;
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_val = null;
    let _fs$fs_val = null;
    let ajson_result;
    let ajson_default;
    let lr_mapper_cache;
    let ajson;
    let lr_ref;
    try {
      ajson_result = (z2ui5_cl_ajson.create_empty());
      ajson_default = (z2ui5_cl_ajson.create_empty({ ii_custom_mapping: z2ui5_cl_ajson_mapping.create_upper_case() }));
      let lt_mapper_cache = [];
      sy_tabix = 0;
      for (const lr_attri of this.mt_attri) {
        sy_tabix++;
        if (!(lr_attri.bind_type !== `` && lr_attri.type_kind !== cl_abap_datadescr.typekind_dref && lr_attri.type_kind !== cl_abap_datadescr.typekind_oref)) continue;
        if (lr_attri.custom_mapper != null) {
          lr_mapper_cache = {};
          {
            const _t = lt_mapper_cache;
            const _i = _t.findIndex((_r) => _r.mapper === lr_attri.custom_mapper);
            sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
            if (sy_subrc === 0) lr_mapper_cache = _t[_i];
          }
          if (sy_subrc === 0) {
            ajson = z2ui5_cl_util.abap_copy(lr_mapper_cache.ajson);
          } else {
            ajson = (z2ui5_cl_ajson.create_empty({ ii_custom_mapping: lr_attri.custom_mapper }));
            lt_mapper_cache.push({ mapper: lr_attri.custom_mapper, ajson: ajson });
          }
        } else {
          ajson = z2ui5_cl_util.abap_copy(ajson_default);
        }
        try {
          lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
        } catch (error) {
          continue;
        }
        // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<val>).
        ajson.set({ iv_ignore_empty: false, iv_path: `/`, iv_val: fs_val });
        if (lr_attri.custom_filter != null) {
          ajson = ajson.filter(lr_attri.custom_filter);
        }
        ajson_result.set({ iv_path: lr_attri.name_client, iv_val: ajson });
      }
      result = ajson_result.stringify();
      if (!result) {
        result = `{}`;
      }
    } catch (x) {
      throw new z2ui5_cx_util_error({ val: x });
    }
    return result;
  }

  main_attri_db_load() {
    let sy_tabix = 0;
    this.main_attri_db_load_resolve();
    let lt_child_idx = [];
    sy_tabix = 0;
    for (const lr_pre of this.mt_attri) {
      sy_tabix++;
      if (!(lr_pre.name_parent)) continue;
      lt_child_idx.push({ name_parent: lr_pre.name_parent, name: lr_pre.name });
    }
    const lr_child_idx = (lt_child_idx);
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      if (!(lr_attri.name_ref)) continue;
      switch (lr_attri.type_kind) {
        case cl_abap_datadescr.typekind_table:
          this.main_attri_db_load_table({ ir_attri: lr_attri });
          break;
        case cl_abap_datadescr.typekind_dref:
          this.main_attri_db_load_dref({ ir_attri: lr_attri, ir_child_idx: lr_child_idx });
          break;
      }
    }
  }

  main_attri_db_load_resolve() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_val = null;
    let _fs$fs_val = null;
    let lr_ref;
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      if (!(!lr_attri.name_ref)) continue;
      try {
        lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
        lr_attri.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref);
        if (lr_attri.srtti_data) {
          // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<val>).
          fs_val = z2ui5_cl_util.xml_srtti_parse(lr_attri.srtti_data);
          if (_fs$fs_val) _fs$fs_val.o[_fs$fs_val.k] = fs_val;
          lr_attri.srtti_data = null;
        }
      } catch (error) {
      }
    }
  }

  main_attri_db_load_table({ ir_attri } = {}) {
    let sy_subrc = 0;
    let fs_parent_ref = null;
    let _fs$fs_parent_ref = null;
    let fs_source_value = null;
    let _fs$fs_source_value = null;
    const lr_ref_source = this.attri_get_val_ref({ iv_path: ir_attri.name_ref });
    ir_attri.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref_source);
    let lr_attri_parent = {};
    {
      const _t = this.mt_attri;
      const _i = _t.findIndex((_r) => _r.name === ir_attri.name_parent);
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      if (sy_subrc === 0) lr_attri_parent = _t[_i];
    }
    if (sy_subrc !== 0) {
      return;
    }
    const lv_parent_path = `MO_APP->${lr_attri_parent.name}`;
    // TODO(abap2js): ASSIGN (lv_parent_path) TO FIELD-SYMBOL(<parent_ref>).
    if (sy_subrc !== 0) {
      return;
    }
    // TODO(abap2js): ASSIGN lr_ref_source->* TO FIELD-SYMBOL(<source_value>).
    // TODO(abap2js): GET REFERENCE OF <source_value> INTO <parent_ref>.
    const lr_ref_parent = (fs_parent_ref);
    lr_attri_parent.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref_parent);
  }

  main_attri_db_load_dref({ ir_attri, ir_child_idx } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_source_ref = null;
    let _fs$fs_source_ref = null;
    let fs_parent_ref = null;
    let _fs$fs_parent_ref = null;
    let lr_child;
    let lr_child_ref;
    const lv_source_path = `MO_APP->${ir_attri.name_ref}`;
    // TODO(abap2js): ASSIGN (lv_source_path) TO FIELD-SYMBOL(<source_ref>).
    if (sy_subrc !== 0) {
      return;
    }
    const lv_target_path = `MO_APP->${ir_attri.name}`;
    // TODO(abap2js): ASSIGN (lv_target_path) TO FIELD-SYMBOL(<parent_ref>).
    if (sy_subrc !== 0) {
      return;
    }
    // TODO(abap2js): GET REFERENCE OF <source_ref> INTO <parent_ref>.
    ir_attri.o_typedescr = cl_abap_datadescr.describe_by_data_ref(fs_parent_ref);
    sy_tabix = 0;
    for (const lr_child_idx of ir_child_idx) {
      sy_tabix++;
      if (!(lr_child_idx.name_parent === ir_attri.name)) continue;
      lr_child = {};
      {
        const _t = this.mt_attri;
        const _i = _t.findIndex((_r) => _r.name === lr_child_idx.name);
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        if (sy_subrc === 0) lr_child = _t[_i];
      }
      if (sy_subrc !== 0) {
        continue;
      }
      lr_child_ref = this.attri_get_val_ref({ iv_path: lr_child.name });
      lr_child.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_child_ref);
    }
  }

  main_attri_db_save_srtti() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_ref = null;
    let _fs$fs_ref = null;
    let fs_val1 = null;
    let _fs$fs_val1 = null;
    let fs_val_ref = null;
    let _fs$fs_val_ref = null;
    let fs_ref2 = null;
    let _fs$fs_ref2 = null;
    let fs_val8 = null;
    let _fs$fs_val8 = null;
    let lv_name5;
    let lv_name;
    let lo_descr;
    let lv_name6;
    let lv_name8;
    let lv_name10;
    this.dissolve();
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      if (!(!lr_attri.name_ref && lr_attri.type_kind === cl_abap_datadescr.typekind_dref)) continue;
      lv_name5 = `MO_APP->${lr_attri.name}`;
      // TODO(abap2js): ASSIGN (lv_name5) TO FIELD-SYMBOL(<ref>).
      if (sy_subrc !== 0) {
        continue;
      }
      lv_name = `MO_APP->${lr_attri.name}->*`;
      // TODO(abap2js): ASSIGN (lv_name) TO FIELD-SYMBOL(<val1>).
      if (sy_subrc !== 0) {
        continue;
      }
      lo_descr = cl_abap_datadescr.describe_by_data(fs_val1);
      switch (lo_descr.type_kind) {
        case cl_abap_datadescr.typekind_table:
          const _sy_tabix_1 = sy_tabix;
          sy_tabix = 0;
          for (const lr_attri_child of this.mt_attri) {
            sy_tabix++;
            if (!(!lr_attri_child.name_ref && lr_attri_child.type_kind === cl_abap_datadescr.typekind_table && lr_attri_child.name_parent === lr_attri.name)) continue;
            lv_name6 = `MO_APP->${lr_attri_child.name}`;
            // TODO(abap2js): ASSIGN (lv_name6) TO FIELD-SYMBOL(<val_ref>).
            if (sy_subrc !== 0) {
              continue;
            }
            lr_attri.srtti_data = z2ui5_cl_util.xml_srtti_stringify(fs_val_ref);
            fs_val_ref = null;
            if (_fs$fs_val_ref) _fs$fs_val_ref.o[_fs$fs_val_ref.k] = fs_val_ref;
            fs_val1 = null;
            if (_fs$fs_val1) _fs$fs_val1.o[_fs$fs_val1.k] = fs_val1;
            fs_ref = null;
            if (_fs$fs_ref) _fs$fs_ref.o[_fs$fs_ref.k] = fs_ref;
            break;
          }
          sy_tabix = _sy_tabix_1;
          break;
        case cl_abap_datadescr.typekind_struct1:
        case cl_abap_datadescr.typekind_struct2:
          lr_attri.srtti_data = z2ui5_cl_util.xml_srtti_stringify(fs_val1);
          break;
      }
    }
    sy_tabix = 0;
    for (const lr_attri2 of this.mt_attri) {
      sy_tabix++;
      if (!(lr_attri2.type_kind === cl_abap_datadescr.typekind_dref)) continue;
      lv_name8 = `MO_APP->${lr_attri2.name}`;
      // TODO(abap2js): ASSIGN (lv_name8) TO FIELD-SYMBOL(<ref2>).
      if (sy_subrc !== 0) {
        continue;
      }
      fs_ref2 = null;
      if (_fs$fs_ref2) _fs$fs_ref2.o[_fs$fs_ref2.k] = fs_ref2;
      if (lr_attri2.name_ref) {
        continue;
      }
      lv_name10 = `MO_APP->${lr_attri2.name}->*`;
      // TODO(abap2js): ASSIGN (lv_name10) TO FIELD-SYMBOL(<val8>).
      if (sy_subrc !== 0) {
        continue;
      }
      fs_val8 = null;
      if (_fs$fs_val8) _fs$fs_val8.o[_fs$fs_val8.k] = fs_val8;
    }
  }

  main_attri_search({ val } = {}) {
    let result = null;
    result = this.attri_search({ val: val });
    if (result != null) {
      return result;
    }
    this.dissolve();
    result = this.attri_search({ val: val });
    if (result != null) {
      return result;
    }
    this.main_attri_refresh();
    result = this.attri_search({ val: val });
    if (result != null) {
      return result;
    }
    throw new z2ui5_cx_util_error({ val: `BINDING_ERROR - No class attribute for binding found - Please check if the bound values are public attributes of your class` });
    return result;
  }

  attri_get_val_ref({ iv_path } = {}) {
    let result = null;
    let sy_subrc = 0;
    let fs_attri = null;
    let _fs$fs_attri = null;
    let lv_name;
    if (!iv_path) {
      fs_attri = this.mo_app;
      _fs$fs_attri = { o: this, k: `mo_app` };
      sy_subrc = 0;
    } else {
      lv_name = `MO_APP->${iv_path}`;
      // TODO(abap2js): ASSIGN (lv_name) TO <attri>.
    }
    if (!(fs_attri != null)) {
      throw new z2ui5_cx_util_error({ val: `ATTRI_GET_VAL_REF_ERROR` });
    }
    // TODO(abap2js): GET REFERENCE OF <attri> INTO result.
    if (result != null) {
      throw new z2ui5_cx_util_error({ val: `ATTRI_GET_VAL_REF_ERROR` });
    }
    return result;
  }

  constructor({ attri, app } = {}) {
    this.mt_attri = z2ui5_cl_util.abap_copy(attri);
    this.mo_app = z2ui5_cl_util.abap_copy(app);
  }

  attri_search({ val } = {}) {
    let result = null;
    let sy_tabix = 0;
    let lv_name_attri;
    let lv_name_val;
    let lr_ref;
    const lo_datadescr = cl_abap_datadescr.describe_by_data_ref(val);
    if (lo_datadescr.type_kind === cl_abap_typedescr.typekind_dref || lo_datadescr.type_kind === cl_abap_typedescr.typekind_oref) {
      throw new z2ui5_cx_util_error({ val: `NO DATA REFERENCES FOR BINDING ALLOWED: DEREFERENCE YOUR DATA FIRST` });
    }
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      if (!(!lr_attri.name_ref && lr_attri.type_kind === lo_datadescr.type_kind && lr_attri.kind === lo_datadescr.kind)) continue;
      lv_name_attri = z2ui5_cl_util.abap_copy(lr_attri.o_typedescr.absolute_name);
      lv_name_val = z2ui5_cl_util.abap_copy(lo_datadescr.absolute_name);
      if (lv_name_attri !== lv_name_val && !String(lv_name_attri).toLowerCase().includes(String(`%`).toLowerCase()) && !String(lv_name_val).toLowerCase().includes(String(`%`).toLowerCase())) {
        continue;
      }
      try {
        lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
      } catch (error) {
        continue;
      }
      if (lr_ref === val) {
        result = z2ui5_cl_util.abap_copy(lr_attri);
        return result;
      }
    }
    return result;
  }

  attri_create_new({ name } = {}) {
    let result = null;
    const lo_descr = cl_abap_datadescr.describe_by_data_ref(this.attri_get_val_ref({ iv_path: name }));
    result = { name: name, o_typedescr: lo_descr, type_kind: lo_descr.type_kind, kind: lo_descr.kind };
    return result;
  }

  diss_dref({ ir_attri } = {}) {
    let result = [];
    let lt_attri;
    const lr_ref_tmp = this.attri_get_val_ref({ iv_path: ir_attri.name });
    if (z2ui5_cl_util.check_unassign_initial(lr_ref_tmp)) {
      return result;
    }
    const lr_ref = z2ui5_cl_util.unassign_data(lr_ref_tmp);
    if (!lr_ref) {
      return result;
    }
    const ls_attri2 = {};
    ls_attri2.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref);
    switch (ls_attri2.o_typedescr.kind) {
      case cl_abap_datadescr.kind_struct:
        lt_attri = this.diss_struc({ ir_attri: ir_attri });
        result.push(...lt_attri);
        break;
      default:
        ls_attri2.name = `${ir_attri.name}->*`;
        ls_attri2.name_parent = z2ui5_cl_util.abap_copy(ir_attri.name);
        ls_attri2.type_kind = z2ui5_cl_util.abap_copy(ls_attri2.o_typedescr.type_kind);
        ls_attri2.kind = z2ui5_cl_util.abap_copy(ls_attri2.o_typedescr.kind);
        result.push(ls_attri2);
        break;
    }
    return result;
  }

  diss_oref({ ir_attri } = {}) {
    let result = [];
    let sy_tabix = 0;
    let ls_new;
    const lr_val = this.attri_get_val_ref({ iv_path: ir_attri.name });
    if (z2ui5_cl_util.check_unassign_initial(lr_val)) {
      return result;
    }
    const lr_ref = z2ui5_cl_util.unassign_object(lr_val);
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_oref(lr_ref);
    const lv_prefix = (ir_attri.name ? `${ir_attri.name}->` : null);
    sy_tabix = 0;
    for (const lr_attri of lt_attri) {
      sy_tabix++;
      if (!(lr_attri.visibility === cl_abap_objectdescr.public && !(lr_attri.is_interface === true || lr_attri.is_interface === `X`) && !(lr_attri.is_class === true || lr_attri.is_class === `X`) && !(lr_attri.is_constant === true || lr_attri.is_constant === `X`))) continue;
      try {
        ls_new = this.attri_create_new({ name: lv_prefix + lr_attri.name });
        ls_new.name_parent = z2ui5_cl_util.abap_copy(ir_attri.name);
        result.push(ls_new);
      } catch (error) {
      }
    }
    return result;
  }

  diss_struc({ ir_attri } = {}) {
    let result = [];
    let sy_tabix = 0;
    let lv_name;
    let lr_ref;
    let lt_attri;
    let ls_new;
    const lr_val = this.attri_get_val_ref({ iv_path: ir_attri.name });
    if (ir_attri.o_typedescr.kind === cl_abap_typedescr.kind_ref) {
      lv_name = `${ir_attri.name}->`;
      lr_ref = z2ui5_cl_util.unassign_data(lr_val);
    } else {
      lv_name = `${ir_attri.name}-`;
      lr_ref = z2ui5_cl_util.abap_copy(lr_val);
    }
    if (lr_ref != null) {
      lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(lr_ref);
      sy_tabix = 0;
      for (const ls_attri of lt_attri) {
        sy_tabix++;
        ls_new = this.attri_create_new({ name: lv_name + ls_attri.name });
        ls_new.name_parent = z2ui5_cl_util.abap_copy(ir_attri.name);
        result.push(ls_new);
      }
    }
    return result;
  }

  dissolve() {
    let lv_depth = 0;
    while (this.mt_attri.some((row) => row.check_dissolved === false) || !this.mt_attri) {
      lv_depth = lv_depth + 1;
      if (lv_depth >= z2ui5_cl_core_srv_model.max_dissolve_depth) {
        return;
      }
      try {
        this.dissolve_run();
      } catch (error) {
        this.main_attri_refresh();
      }
    }
    this.attri_update_entry_refs();
  }

  attri_update_entry_refs() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_ref = null;
    let _fs$fs_ref = null;
    let lr_ref;
    let lr_attri_ref_ref;
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      if (!((lr_attri.check_dissolved === true || lr_attri.check_dissolved === `X`) && !lr_attri.name_ref)) continue;
      try {
        lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
      } catch (error) {
        continue;
      }
      switch (lr_attri.type_kind) {
        case cl_abap_typedescr.typekind_table:
          const _sy_tabix_1 = sy_tabix;
          sy_tabix = 0;
          for (const lr_attri_ref of this.mt_attri) {
            sy_tabix++;
            if (!((lr_attri_ref.check_dissolved === true || lr_attri_ref.check_dissolved === `X`) && lr_attri_ref.name !== lr_attri.name && !lr_attri_ref.name_ref && lr_attri_ref.type_kind === cl_abap_typedescr.typekind_table)) continue;
            try {
              lr_attri_ref_ref = this.attri_get_val_ref({ iv_path: lr_attri_ref.name });
            } catch (error) {
              continue;
            }
            if (lr_ref !== lr_attri_ref_ref) {
              continue;
            }
            lr_attri.name_ref = z2ui5_cl_util.abap_copy(lr_attri_ref.name);
          }
          sy_tabix = _sy_tabix_1;
          break;
        case cl_abap_typedescr.typekind_dref:
          // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<ref>).
          const _sy_tabix_2 = sy_tabix;
          sy_tabix = 0;
          for (const lr_attri_ref of this.mt_attri) {
            sy_tabix++;
            if (!((lr_attri_ref.check_dissolved === true || lr_attri_ref.check_dissolved === `X`) && lr_attri_ref.name !== lr_attri.name && !lr_attri_ref.name_ref && (lr_attri_ref.type_kind === cl_abap_typedescr.typekind_struct1 || lr_attri_ref.type_kind === cl_abap_typedescr.typekind_struct2))) continue;
            try {
              lr_attri_ref_ref = this.attri_get_val_ref({ iv_path: lr_attri_ref.name });
            } catch (error) {
              continue;
            }
            if (fs_ref !== lr_attri_ref_ref) {
              continue;
            }
            if (lr_attri.name_ref && lr_attri.name_ref.length <= lr_attri_ref.name.length) {
              continue;
            }
            lr_attri.name_ref = z2ui5_cl_util.abap_copy(lr_attri_ref.name);
            this.attri_update_refs_children({ ir_attri: lr_attri });
          }
          sy_tabix = _sy_tabix_2;
          break;
      }
    }
  }

  attri_update_refs_children({ ir_attri } = {}) {
    let sy_tabix = 0;
    let lv_name;
    sy_tabix = 0;
    for (const lr_attri_child of this.mt_attri) {
      sy_tabix++;
      if (!(lr_attri_child.name_parent === ir_attri.name)) continue;
      lv_name = (lr_attri_child.name.startsWith(`${ir_attri.name}->`) ? lr_attri_child.name.slice((`${ir_attri.name}->`).length) : lr_attri_child.name);
      lr_attri_child.name_ref = `${ir_attri.name_ref}-${lv_name}`;
    }
  }

  dissolve_run() {
    let sy_tabix = 0;
    let ls_attri;
    let lt_init;
    let ls_entry;
    let lt_attri_struc;
    let lt_attri_oref;
    let lt_attri_dref;
    if (!this.mt_attri) {
      ls_attri = {};
      lt_init = this.diss_oref({ ir_attri: (ls_attri) });
      this.mt_attri.push(...lt_init);
    }
    const lt_attri_new = {};
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      if (!(!(lr_attri.check_dissolved === true || lr_attri.check_dissolved === `X`))) continue;
      lr_attri.check_dissolved = true;
      if (lr_attri.o_typedescr != null) {
        ls_entry = this.attri_create_new({ name: lr_attri.name });
        lr_attri.o_typedescr = z2ui5_cl_util.abap_copy(ls_entry.o_typedescr);
      }
      switch (lr_attri.o_typedescr.kind) {
        case cl_abap_typedescr.kind_struct:
          lt_attri_struc = this.diss_struc({ ir_attri: lr_attri });
          lt_attri_new.push(...lt_attri_struc);
          break;
        case cl_abap_typedescr.kind_ref:
          switch (lr_attri.o_typedescr.type_kind) {
            case cl_abap_typedescr.typekind_oref:
              lt_attri_oref = this.diss_oref({ ir_attri: lr_attri });
              lt_attri_new.push(...lt_attri_oref);
              break;
            case cl_abap_typedescr.typekind_dref:
              lt_attri_dref = this.diss_dref({ ir_attri: lr_attri });
              lt_attri_new.push(...lt_attri_dref);
              break;
            default:
              if (!(1 === 0)) throw new Error(`ASSERT failed`);
              break;
          }
          break;
        default:
          break;
      }
    }
    this.mt_attri.push(...lt_attri_new);
  }

  main_attri_refresh() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let lr_old;
    const lt_attri = z2ui5_cl_util.abap_copy(this.mt_attri);
    for (let _i = lt_attri.length - 1; _i >= 0; _i--) { const row = lt_attri[_i]; if (!row.bind_type) lt_attri.splice(_i, 1); }
    this.mt_attri = null;
    this.dissolve();
    sy_tabix = 0;
    for (const lr_attri of this.mt_attri) {
      sy_tabix++;
      lr_old = {};
      {
        const _t = lt_attri;
        const _i = _t.findIndex((_r) => _r.name === lr_attri.name);
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        if (sy_subrc === 0) lr_old = _t[_i];
      }
      if (sy_subrc === 0) {
        lr_attri.bind_type = z2ui5_cl_util.abap_copy(lr_old.bind_type);
        lr_attri.name_client = z2ui5_cl_util.abap_copy(lr_old.name_client);
        lr_attri.view = z2ui5_cl_util.abap_copy(lr_old.view);
      }
    }
  }

  delta_apply_to_table({ io_val_front, iv_name } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_delta_tab = null;
    let _fs$fs_delta_tab = null;
    let fs_delta_row = null;
    let _fs$fs_delta_row = null;
    let fs_comp = null;
    let _fs$fs_comp = null;
    let lr_ref_d;
    let lv_tabix;
    let lo_row_d;
    let lt_fld;
    let lv_fld_path;
    try {
      lr_ref_d = this.attri_get_val_ref({ iv_path: iv_name });
    } catch (error) {
      return;
    }
    // TODO(abap2js): ASSIGN lr_ref_d->* TO <delta_tab>.
    if (sy_subrc !== 0) {
      return;
    }
    const lo_delta = io_val_front.slice(`/__delta`);
    const lt_idx = lo_delta.members(`/`);
    sy_tabix = 0;
    for (const lv_idx_str of lt_idx) {
      sy_tabix++;
      lv_tabix = (lv_idx_str) + 1;
      {
        const _t = fs_delta_tab;
        const _i = (lv_tabix) - 1;
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        fs_delta_row = sy_subrc === 0 ? _t[_i] : null;
        _fs$fs_delta_row = sy_subrc === 0 ? { o: _t, k: _i } : null;
      }
      if (sy_subrc !== 0) {
        continue;
      }
      lo_row_d = lo_delta.slice(`/${lv_idx_str}`);
      lt_fld = lo_row_d.members(`/`);
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const lv_fld of lt_fld) {
        sy_tabix++;
        _fs$fs_comp = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_delta_row, lv_fld);
        fs_comp = _fs$fs_comp ? _fs$fs_comp.o[_fs$fs_comp.k] : null;
        sy_subrc = _fs$fs_comp ? 0 : 4;
        if (sy_subrc !== 0) {
          continue;
        }
        lv_fld_path = `/${lv_fld}`;
        if (lo_row_d.get_node_type(lv_fld_path) === z2ui5_if_ajson_types.node_type.boolean) {
          fs_comp = lo_row_d.get_boolean(lv_fld_path);
          if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        } else {
          fs_comp = lo_row_d.get_string(lv_fld_path);
          if (_fs$fs_comp) _fs$fs_comp.o[_fs$fs_comp.k] = fs_comp;
        }
      }
      sy_tabix = _sy_tabix_1;
    }
  }
}

module.exports = z2ui5_cl_core_srv_model;
