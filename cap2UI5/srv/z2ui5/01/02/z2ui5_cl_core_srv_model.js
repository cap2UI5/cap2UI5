// TODO(abap2js): unresolved reference cl_abap_datadescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_objectdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_ajson — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_ajson_mapping — add require manually
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
    const lv_view = (this.mt_attri.*.some((row) => row.view === view) ? view : z2ui5_if_client.cs_view.main);
    let sy_tabix = 0;
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      if (!(lr_attri.bind_type === z2ui5_if_core_types.cs_bind_type.two_way && view === lv_view)) continue;
      try {
        let lo_val_front = model.slice(lr_attri.name_client);
        if (lo_val_front != null) {
          continue;
        }
        if (lo_val_front.exists(`/__delta`) === true) {
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
          const lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
        } catch (error) {
          continue;
        }
        // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<val>).
        lo_val_front.to_abap(/* TODO(abap2js): out-params */ EXPORTING iv_corresponding = abap_true IMPORTING ev_container = <val>);
      } catch (x) {
        throw new z2ui5_cx_util_error({ val: `JSON_PARSING_ERROR: ${x.get_text()}` });
      }
    }
  }

  main_json_stringify() {
    let result = ``;
    try {
      const ajson_result = (z2ui5_cl_ajson.create_empty());
      const ajson_default = (z2ui5_cl_ajson.create_empty({ ii_custom_mapping: z2ui5_cl_ajson_mapping.create_upper_case() }));
      // TODO(abap2js): TYPES BEGIN OF ty_s_mapper_cache,
      // TODO(abap2js): TYPES mapper TYPE REF TO z2ui5_if_ajson_mapping,
      // TODO(abap2js): TYPES ajson TYPE REF TO z2ui5_if_ajson,
      // TODO(abap2js): TYPES END OF ty_s_mapper_cache.
      let lt_mapper_cache = [];
      let sy_tabix = 0;
      for (const lr_attri of this.mt_attri.*) {
        sy_tabix++;
        if (!(lr_attri.bind_type !== `` && lr_attri.type_kind !== cl_abap_datadescr.typekind_dref && lr_attri.type_kind !== cl_abap_datadescr.typekind_oref)) continue;
        if (lr_attri.custom_mapper != null) {
          // TODO(abap2js): READ TABLE lt_mapper_cache REFERENCE INTO DATA(lr_mapper_cache) WITH KEY mapper = lr_attri->custom_mapper.
          if (sy_subrc === 0) {
            let ajson = lr_mapper_cache.ajson;
          } else {
            ajson = (z2ui5_cl_ajson.create_empty({ ii_custom_mapping: lr_attri.custom_mapper }));
            lt_mapper_cache.push({ mapper: lr_attri.custom_mapper, ajson: ajson });
          }
        } else {
          ajson = ajson_default;
        }
        try {
          const lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
        } catch (error) {
          continue;
        }
        // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<val>).
        ajson.set({ iv_ignore_empty: false, iv_path: `/`, iv_val: val });
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
    this.main_attri_db_load_resolve();
    let lt_child_idx = [];
    let sy_tabix = 0;
    for (const lr_pre of this.mt_attri.*) {
      sy_tabix++;
      if (!(name_parent)) continue;
      lt_child_idx.push({ name_parent: lr_pre.name_parent, name: lr_pre.name });
    }
    const lr_child_idx = (lt_child_idx);
    let sy_tabix = 0;
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      if (!(name_ref)) continue;
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
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      if (!(!name_ref)) continue;
      try {
        const lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
        lr_attri.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref);
        if (lr_attri.srtti_data) {
          // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<val>).
          val = z2ui5_cl_util.xml_srtti_parse(lr_attri.srtti_data);
          lr_attri.srtti_data = null;
        }
      } catch (error) {
      }
    }
  }

  main_attri_db_load_table({ ir_attri } = {}) {
    const lr_ref_source = this.attri_get_val_ref({ iv_path: ir_attri.name_ref });
    ir_attri.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref_source);
    // TODO(abap2js): READ TABLE mt_attri->* REFERENCE INTO DATA(lr_attri_parent) WITH KEY name = ir_attri->name_parent.
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
    const lr_ref_parent = (parent_ref);
    lr_attri_parent.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref_parent);
  }

  main_attri_db_load_dref({ ir_attri, ir_child_idx } = {}) {
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
    ir_attri.o_typedescr = cl_abap_datadescr.describe_by_data_ref(parent_ref);
    let sy_tabix = 0;
    for (const lr_child_idx of ir_child_idx.*) {
      sy_tabix++;
      if (!(lr_child_idx.name_parent === ir_attri.name)) continue;
      // TODO(abap2js): READ TABLE mt_attri->* REFERENCE INTO DATA(lr_child) WITH KEY name = lr_child_idx->name.
      if (sy_subrc !== 0) {
        continue;
      }
      const lr_child_ref = this.attri_get_val_ref({ iv_path: lr_child.name });
      lr_child.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_child_ref);
    }
  }

  main_attri_db_save_srtti() {
    this.dissolve();
    let sy_tabix = 0;
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      if (!(!name_ref && lr_attri.type_kind === cl_abap_datadescr.typekind_dref)) continue;
      const lv_name5 = `MO_APP->${lr_attri.name}`;
      // TODO(abap2js): ASSIGN (lv_name5) TO FIELD-SYMBOL(<ref>).
      if (sy_subrc !== 0) {
        continue;
      }
      const lv_name = `MO_APP->${lr_attri.name}->*`;
      // TODO(abap2js): ASSIGN (lv_name) TO FIELD-SYMBOL(<val1>).
      if (sy_subrc !== 0) {
        continue;
      }
      const lo_descr = cl_abap_datadescr.describe_by_data(val1);
      switch (lo_descr.type_kind) {
        case cl_abap_datadescr.typekind_table:
          let sy_tabix = 0;
          for (const lr_attri_child of this.mt_attri.*) {
            sy_tabix++;
            if (!(!name_ref && lr_attri_child.type_kind === cl_abap_datadescr.typekind_table && lr_attri_child.name_parent === lr_attri.name)) continue;
            const lv_name6 = `MO_APP->${lr_attri_child.name}`;
            // TODO(abap2js): ASSIGN (lv_name6) TO FIELD-SYMBOL(<val_ref>).
            if (sy_subrc !== 0) {
              continue;
            }
            lr_attri.srtti_data = z2ui5_cl_util.xml_srtti_stringify(val_ref);
            val_ref = null;
            val1 = null;
            ref = null;
            break;
          }
          break;
        case cl_abap_datadescr.typekind_struct1:
        case cl_abap_datadescr.typekind_struct2:
          lr_attri.srtti_data = z2ui5_cl_util.xml_srtti_stringify(val1);
          break;
      }
    }
    let sy_tabix = 0;
    for (const lr_attri2 of this.mt_attri.*) {
      sy_tabix++;
      if (!(lr_attri2.type_kind === cl_abap_datadescr.typekind_dref)) continue;
      const lv_name8 = `MO_APP->${lr_attri2.name}`;
      // TODO(abap2js): ASSIGN (lv_name8) TO FIELD-SYMBOL(<ref2>).
      if (sy_subrc !== 0) {
        continue;
      }
      ref2 = null;
      if (lr_attri2.name_ref) {
        continue;
      }
      const lv_name10 = `MO_APP->${lr_attri2.name}->*`;
      // TODO(abap2js): ASSIGN (lv_name10) TO FIELD-SYMBOL(<val8>).
      if (sy_subrc !== 0) {
        continue;
      }
      val8 = null;
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
    // TODO(abap2js): FIELD-SYMBOLS <attri> TYPE any.
    if (!iv_path) {
      // TODO(abap2js): ASSIGN mo_app TO <attri>.
    } else {
      const lv_name = `MO_APP->${iv_path}`;
      // TODO(abap2js): ASSIGN (lv_name) TO <attri>.
    }
    if (!(attri != null)) {
      throw new z2ui5_cx_util_error({ val: `ATTRI_GET_VAL_REF_ERROR` });
    }
    // TODO(abap2js): GET REFERENCE OF <attri> INTO result.
    if (result != null) {
      throw new z2ui5_cx_util_error({ val: `ATTRI_GET_VAL_REF_ERROR` });
    }
    return result;
  }

  constructor({ attri, app } = {}) {
    this.mt_attri = attri;
    this.mo_app = app;
  }

  attri_search({ val } = {}) {
    let result = null;
    const lo_datadescr = cl_abap_datadescr.describe_by_data_ref(val);
    if (lo_datadescr.type_kind === cl_abap_typedescr.typekind_dref || lo_datadescr.type_kind === cl_abap_typedescr.typekind_oref) {
      throw new z2ui5_cx_util_error({ val: `NO DATA REFERENCES FOR BINDING ALLOWED: DEREFERENCE YOUR DATA FIRST` });
    }
    let sy_tabix = 0;
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      if (!(!name_ref && lr_attri.type_kind === lo_datadescr.type_kind && lr_attri.kind === lo_datadescr.kind)) continue;
      const lv_name_attri = lr_attri.o_typedescr.absolute_name;
      const lv_name_val = lo_datadescr.absolute_name;
      if (lv_name_attri !== lv_name_val && lv_name_attri NS `%` && lv_name_val NS `%`) {
        continue;
      }
      try {
        const lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
      } catch (error) {
        continue;
      }
      if (lr_ref === val) {
        result = lr_attri;
        return result;
      }
    }
    return result;
  }

  attri_create_new({ name } = {}) {
    let result = null;
    const lo_descr = cl_abap_datadescr.describe_by_data_ref(this.attri_get_val_ref({ iv_path: name }));
    result = value z2ui5_if_core_types.ty_s_attri({ name, o_typedescr: lo_descr, type_kind: lo_descr.type_kind, kind: lo_descr.kind });
    return result;
  }

  diss_dref({ ir_attri } = {}) {
    let result = [];
    const lr_ref_tmp = this.attri_get_val_ref({ iv_path: ir_attri.name });
    if (z2ui5_cl_util.check_unassign_initial(lr_ref_tmp)) {
      return result;
    }
    const lr_ref = z2ui5_cl_util.unassign_data(lr_ref_tmp);
    if (!lr_ref) {
      return result;
    }
    const ls_attri2 = value z2ui5_if_core_types.ty_s_attri();
    ls_attri2.o_typedescr = cl_abap_datadescr.describe_by_data_ref(lr_ref);
    switch (ls_attri2.o_typedescr.kind) {
      case cl_abap_datadescr.kind_struct:
        const lt_attri = this.diss_struc({ ir_attri: ir_attri });
        result.push(lines OF lt_attri);
        break;
      default:
        ls_attri2.name = `${ir_attri.name}->*`;
        ls_attri2.name_parent = ir_attri.name;
        ls_attri2.type_kind = ls_attri2.o_typedescr.type_kind;
        ls_attri2.kind = ls_attri2.o_typedescr.kind;
        result.push(ls_attri2);
        break;
    }
    return result;
  }

  diss_oref({ ir_attri } = {}) {
    let result = [];
    const lr_val = this.attri_get_val_ref({ iv_path: ir_attri.name });
    if (z2ui5_cl_util.check_unassign_initial(lr_val)) {
      return result;
    }
    const lr_ref = z2ui5_cl_util.unassign_object(lr_val);
    const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_oref(lr_ref);
    const lv_prefix = (ir_attri.name ? `${ir_attri.name}->` : null);
    let sy_tabix = 0;
    for (const lr_attri of lt_attri) {
      sy_tabix++;
      if (!(lr_attri.visibility === cl_abap_objectdescr.public && lr_attri.is_interface === false && lr_attri.is_class === false && lr_attri.is_constant === false)) continue;
      try {
        const ls_new = this.attri_create_new({ name: lv_prefix + lr_attri.name });
        ls_new.name_parent = ir_attri.name;
        result.push(ls_new);
      } catch (error) {
      }
    }
    return result;
  }

  diss_struc({ ir_attri } = {}) {
    let result = [];
    const lr_val = this.attri_get_val_ref({ iv_path: ir_attri.name });
    if (ir_attri.o_typedescr.kind === cl_abap_typedescr.kind_ref) {
      let lv_name = `${ir_attri.name}->`;
      let lr_ref = z2ui5_cl_util.unassign_data(lr_val);
    } else {
      lv_name = `${ir_attri.name}-`;
      lr_ref = lr_val;
    }
    if (lr_ref != null) {
      const lt_attri = z2ui5_cl_util.rtti_get_t_attri_by_any(lr_ref);
      let sy_tabix = 0;
      for (const ls_attri of lt_attri) {
        sy_tabix++;
        const ls_new = this.attri_create_new({ name: lv_name + ls_attri.name });
        ls_new.name_parent = ir_attri.name;
        result.push(ls_new);
      }
    }
    return result;
  }

  dissolve() {
    let lv_depth = 0;
    while (this.mt_attri.*.some((row) => row.check_dissolved === false) || !(this.mt_attri.*)) {
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
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      if (!(lr_attri.check_dissolved === true && !name_ref)) continue;
      try {
        const lr_ref = this.attri_get_val_ref({ iv_path: lr_attri.name });
      } catch (error) {
        continue;
      }
      switch (lr_attri.type_kind) {
        case cl_abap_typedescr.typekind_table:
          let sy_tabix = 0;
          for (const lr_attri_ref of this.mt_attri.*) {
            sy_tabix++;
            if (!(lr_attri_ref.check_dissolved === true && lr_attri_ref.name !== lr_attri.name && !name_ref && lr_attri_ref.type_kind === cl_abap_typedescr.typekind_table)) continue;
            try {
              let lr_attri_ref_ref = this.attri_get_val_ref({ iv_path: lr_attri_ref.name });
            } catch (error) {
              continue;
            }
            if (lr_ref !== lr_attri_ref_ref) {
              continue;
            }
            lr_attri.name_ref = lr_attri_ref.name;
          }
          break;
        case cl_abap_typedescr.typekind_dref:
          // TODO(abap2js): ASSIGN lr_ref->* TO FIELD-SYMBOL(<ref>).
          let sy_tabix = 0;
          for (const lr_attri_ref of this.mt_attri.*) {
            sy_tabix++;
            if (!(lr_attri_ref.check_dissolved === true && lr_attri_ref.name !== lr_attri.name && !name_ref && (lr_attri_ref.type_kind === cl_abap_typedescr.typekind_struct1 || lr_attri_ref.type_kind === cl_abap_typedescr.typekind_struct2))) continue;
            try {
              lr_attri_ref_ref = this.attri_get_val_ref({ iv_path: lr_attri_ref.name });
            } catch (error) {
              continue;
            }
            if (ref !== lr_attri_ref_ref) {
              continue;
            }
            if (lr_attri.name_ref && lr_attri.name_ref.length <= lr_attri_ref.name.length) {
              continue;
            }
            lr_attri.name_ref = lr_attri_ref.name;
            this.attri_update_refs_children({ ir_attri: lr_attri });
          }
          break;
      }
    }
  }

  attri_update_refs_children({ ir_attri } = {}) {
    let sy_tabix = 0;
    for (const lr_attri_child of this.mt_attri.*) {
      sy_tabix++;
      if (!(lr_attri_child.name_parent === ir_attri.name)) continue;
      const lv_name = (lr_attri_child.name.startsWith(`${ir_attri.name}->`) ? lr_attri_child.name.slice((`${ir_attri.name}->`).length) : lr_attri_child.name);
      lr_attri_child.name_ref = `${ir_attri.name_ref}-${lv_name}`;
    }
  }

  dissolve_run() {
    if (!(this.mt_attri.*)) {
      const ls_attri = value z2ui5_if_core_types.ty_s_attri();
      const lt_init = this.diss_oref({ ir_attri: (ls_attri) });
      this.mt_attri.*.push(lines OF lt_init);
    }
    const lt_attri_new = value z2ui5_if_core_types.ty_t_attri();
    let sy_tabix = 0;
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      if (!(lr_attri.check_dissolved === false)) continue;
      lr_attri.check_dissolved = true;
      if (lr_attri.o_typedescr != null) {
        const ls_entry = this.attri_create_new({ name: lr_attri.name });
        lr_attri.o_typedescr = ls_entry.o_typedescr;
      }
      switch (lr_attri.o_typedescr.kind) {
        case cl_abap_typedescr.kind_struct:
          const lt_attri_struc = this.diss_struc({ ir_attri: lr_attri });
          lt_attri_new.push(lines OF lt_attri_struc);
          break;
        case cl_abap_typedescr.kind_ref:
          switch (lr_attri.o_typedescr.type_kind) {
            case cl_abap_typedescr.typekind_oref:
              const lt_attri_oref = this.diss_oref({ ir_attri: lr_attri });
              lt_attri_new.push(lines OF lt_attri_oref);
              break;
            case cl_abap_typedescr.typekind_dref:
              const lt_attri_dref = this.diss_dref({ ir_attri: lr_attri });
              lt_attri_new.push(lines OF lt_attri_dref);
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
    this.mt_attri.*.push(lines OF lt_attri_new);
  }

  main_attri_refresh() {
    const lt_attri = this.mt_attri.*;
    for (let _i = lt_attri.length - 1; _i >= 0; _i--) { const row = lt_attri[_i]; if (!bind_type) lt_attri.splice(_i, 1); }
    this.mt_attri.* = null;
    this.dissolve();
    let sy_tabix = 0;
    for (const lr_attri of this.mt_attri.*) {
      sy_tabix++;
      // TODO(abap2js): READ TABLE lt_attri REFERENCE INTO DATA(lr_old) WITH KEY name = lr_attri->name.
      if (sy_subrc === 0) {
        lr_attri.bind_type = lr_old.bind_type;
        lr_attri.name_client = lr_old.name_client;
        lr_attri.view = lr_old.view;
      }
    }
  }

  delta_apply_to_table({ io_val_front, iv_name } = {}) {
    try {
      const lr_ref_d = this.attri_get_val_ref({ iv_path: iv_name });
    } catch (error) {
      return;
    }
    // TODO(abap2js): FIELD-SYMBOLS <delta_tab> TYPE STANDARD TABLE.
    // TODO(abap2js): ASSIGN lr_ref_d->* TO <delta_tab>.
    if (sy_subrc !== 0) {
      return;
    }
    const lo_delta = io_val_front.slice(`/__delta`);
    const lt_idx = lo_delta.members(`/`);
    let sy_tabix = 0;
    for (const lv_idx_str of lt_idx) {
      sy_tabix++;
      const lv_tabix = (lv_idx_str) + 1;
      // TODO(abap2js): FIELD-SYMBOLS <delta_row> TYPE any.
      // TODO(abap2js): READ TABLE <delta_tab> INDEX lv_tabix ASSIGNING <delta_row>.
      if (sy_subrc !== 0) {
        continue;
      }
      const lo_row_d = lo_delta.slice(`/${lv_idx_str}`);
      const lt_fld = lo_row_d.members(`/`);
      let sy_tabix = 0;
      for (const lv_fld of lt_fld) {
        sy_tabix++;
        // TODO(abap2js): FIELD-SYMBOLS <comp> TYPE any.
        // TODO(abap2js): ASSIGN COMPONENT lv_fld OF STRUCTURE <delta_row> TO <comp>.
        if (sy_subrc !== 0) {
          continue;
        }
        const lv_fld_path = `/${lv_fld}`;
        if (lo_row_d.get_node_type(lv_fld_path) === z2ui5_if_ajson_types.node_type.boolean) {
          comp = lo_row_d.get_boolean(lv_fld_path);
        } else {
          comp = lo_row_d.get_string(lv_fld_path);
        }
      }
    }
  }
}

module.exports = z2ui5_cl_core_srv_model;
