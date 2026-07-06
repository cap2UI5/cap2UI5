const z2ui5_cx_ajson_error = require("abap2UI5/z2ui5_cx_ajson_error");
const z2ui5_if_ajson_types = require("abap2UI5/z2ui5_if_ajson_types");

class z2ui5_cl_ajson {
  static go_float_regex = null;

  ms_opts = null;
  mi_custom_mapping = null;

  constructor({ iv_keep_item_order = false, iv_format_datetime = true, iv_to_abap_corresponding_only = false } = {}) {
    this.ms_opts.keep_item_order = iv_keep_item_order;
    this.ms_opts.to_abap_corresponding_only = iv_to_abap_corresponding_only;
    this.format_datetime(iv_format_datetime);
  }

  static create_empty({ ii_custom_mapping, iv_keep_item_order = false, iv_format_datetime = true, iv_to_abap_corresponding_only = false } = {}) {
    let ro_instance = null;
    ro_instance = null; // TODO(abap2js): CREATE OBJECT ro_instance EXPORTING iv_to_abap_corresponding_only = iv_to_abap_corresponding_only iv_format_datetime = iv_format_datetime iv_keep_item_order = iv_keep_item_order.
    ro_instance.mi_custom_mapping = ii_custom_mapping;
    return ro_instance;
  }

  static create_from({ ii_source_json, ii_filter, ii_mapper } = {}) {
    let ro_instance = null;
    let lo_mutator_queue = null;
    if (ii_source_json != null) {
      z2ui5_cx_ajson_error.raise(`Source not bound`);
    }
    ro_instance = null; // TODO(abap2js): CREATE OBJECT ro_instance EXPORTING iv_to_abap_corresponding_only = ii_source_json->opts( )-to_abap_corresponding_only iv_format_datetime = ii_source_json->opts( )-format_datetime iv_keep_item_order = ii_source_json->opts( )-keep_item_order.
    if (ii_filter != null && ii_mapper != null) {
      ro_instance.mt_json_tree = ii_source_json.mt_json_tree;
    } else {
      lo_mutator_queue = null; // TODO(abap2js): CREATE OBJECT lo_mutator_queue.
      if (ii_mapper != null) {
        lo_mutator_queue.add(lcl_mapper_runner.new_(ii_mapper));
      }
      if (ii_filter != null) {
        lo_mutator_queue.add(lcl_filter_runner.new_(ii_filter));
      }
      // TODO(abap2js): lo_mutator_queue->lif_mutator_runner~run( EXPORTING it_source_tree = ii_source_json->mt_json_tree IMPORTING et_dest_tree = ro_instance->mt_json_tree ).
    }
    return ro_instance;
  }

  delete_subtree({ iv_path, iv_name, ir_parent } = {}) {
    let rs_top_node = null;
    let lv_parent_path = ``;
    let lr_parent = null;
    // TODO(abap2js): READ TABLE mt_json_tree INTO rs_top_node WITH TABLE KEY path = iv_path name = iv_name.
    if (sy_subrc !== 0) {
      return rs_top_node;
    }
    // TODO(abap2js): DELETE mt_json_tree INDEX sy-tabix.
    if (rs_top_node.children > 0) {
      lv_parent_path = iv_path + iv_name + `/*`;
      for (let _i = mt_json_tree.length - 1; _i >= 0; _i--) { const row = mt_json_tree[_i]; if (String(row.path).includes(String(lv_parent_path).replace(/\*/g, ""))) mt_json_tree.splice(_i, 1); }
    }
    if (ir_parent !== undefined) {
      ir_parent.children = ir_parent.children - 1;
    } else {
      lr_parent = this.get_item({ iv_path: iv_path });
      if (lr_parent) {
        lr_parent.children = lr_parent.children - 1;
      }
    }
    return rs_top_node;
  }

  get_item({ iv_path } = {}) {
    let rv_item = null;
    let ls_path_name = null;
    ls_path_name = lcl_utils.split_path(iv_path);
    // TODO(abap2js): READ TABLE mt_json_tree REFERENCE INTO rv_item WITH KEY path = ls_path_name-path name = ls_path_name-name.
    return rv_item;
  }

  static new({ iv_keep_item_order = false, iv_format_datetime = true, iv_to_abap_corresponding_only = false } = {}) {
    let ro_instance = null;
    ro_instance = null; // TODO(abap2js): CREATE OBJECT ro_instance EXPORTING iv_to_abap_corresponding_only = iv_to_abap_corresponding_only iv_format_datetime = iv_format_datetime iv_keep_item_order = iv_keep_item_order.
    return ro_instance;
  }

  static normalize_path({ iv_path } = {}) {
    let rv_path = ``;
    rv_path = lcl_utils.normalize_path(iv_path);
    return rv_path;
  }

  static parse({ iv_json, iv_freeze = false, ii_custom_mapping, iv_keep_item_order = false } = {}) {
    let ro_instance = null;
    let lo_parser = null;
    ro_instance = null; // TODO(abap2js): CREATE OBJECT ro_instance.
    lo_parser = null; // TODO(abap2js): CREATE OBJECT lo_parser.
    ro_instance.mt_json_tree = lo_parser.parse({ iv_json, iv_keep_item_order });
    ro_instance.mi_custom_mapping = ii_custom_mapping;
    ro_instance.ms_opts.keep_item_order = iv_keep_item_order;
    if (iv_freeze === true) {
      ro_instance.freeze();
    }
    return ro_instance;
  }

  prove_path_exists({ iv_path } = {}) {
    let rr_end_node = null;
    let lt_path = [];
    let lr_node_parent = null;
    let lv_cur_path = ``;
    let lv_cur_name = ``;
    let ls_new_node = null;
    lt_path = iv_path.split(`/`);
    for (let _i = lt_path.length - 1; _i >= 0; _i--) { const row = lt_path[_i]; if (!row.table_line) lt_path.splice(_i, 1); }
    while (true) {
      lr_node_parent = rr_end_node;
      // TODO(abap2js): READ TABLE mt_json_tree REFERENCE INTO rr_end_node WITH TABLE KEY path = lv_cur_path name = lv_cur_name.
      if (sy_subrc !== 0) {
        ls_new_node = null;
        if (lr_node_parent) {
          lr_node_parent.children = lr_node_parent.children + 1;
          if (lr_node_parent.type === z2ui5_if_ajson_types.node_type.array) {
            ls_new_node.index = lcl_utils.validate_array_index({ iv_path: lv_cur_path, iv_index: lv_cur_name });
          }
        }
        ls_new_node.path = lv_cur_path;
        ls_new_node.name = lv_cur_name;
        ls_new_node.type = z2ui5_if_ajson_types.node_type.object;
        rr_end_node = ls_new_node;
        mt_json_tree.push(rr_end_node);
      }
      lv_cur_path = lv_cur_path + lv_cur_name + `/`;
      // TODO(abap2js): READ TABLE lt_path INDEX sy-index INTO lv_cur_name.
      if (sy_subrc !== 0) {
        break;
      }
    }
    return rr_end_node;
  }

  read_only_watchdog() {
    if (this.ms_opts.read_only === true) {
      z2ui5_cx_ajson_error.raise(`This json instance is read only`);
    }
  }

  array_to_string_table() {
    let sy_tabix = 0;
    let lv_normalized_path = ``;
    let lr_node = null;
    // TODO(abap2js): FIELD-SYMBOLS <item> LIKE LINE OF mt_json_tree.
    lv_normalized_path = lcl_utils.normalize_path(iv_path);
    lr_node = this.get_item({ iv_path: iv_path });
    if (!lr_node) {
      z2ui5_cx_ajson_error.raise(`Path not found: ${iv_path}`);
    }
    if (lr_node.type !== z2ui5_if_ajson_types.node_type.array) {
      z2ui5_cx_ajson_error.raise(`Array expected at: ${iv_path}`);
    }
    sy_tabix = 0;
    for (const item of mt_json_tree) {
      sy_tabix++;
      if (!(item.path === lv_normalized_path)) continue;
      switch (item.type) {
        case z2ui5_if_ajson_types.node_type.number:
        case z2ui5_if_ajson_types.node_type.string:
          rt_string_table.push(item.value);
          break;
        case z2ui5_if_ajson_types.node_type.null:
          rt_string_table.push(``);
          break;
        case z2ui5_if_ajson_types.node_type.boolean:
          let lv_tmp = ``;
          if (item.value === `true`) {
            lv_tmp = true;
          } else {
            lv_tmp = null;
          }
          rt_string_table.push(lv_tmp);
          break;
        default:
          z2ui5_cx_ajson_error.raise(`Cannot convert [${item.type}] to string at [${item.path}${item.name}]`);
          break;
      }
    }
  }

  clear() {
    this.read_only_watchdog();
    mt_json_tree = null;
  }

  clone() {
    ri_json = z2ui5_cl_ajson.create_from({ ii_source_json: this });
  }

  delete() {
    this.read_only_watchdog();
    let ls_split_path = null;
    ls_split_path = lcl_utils.split_path(iv_path);
    this.delete_subtree({ iv_path: ls_split_path.path, iv_name: ls_split_path.name });
    ri_json = this;
  }

  exists() {
    rv_exists = Boolean(this.get_item({ iv_path: iv_path }));
  }

  filter() {
    ri_json = z2ui5_cl_ajson.create_from({ ii_source_json: this, ii_filter });
  }

  format_datetime() {
    this.ms_opts.format_datetime = iv_use_iso;
    ri_json = this;
  }

  freeze() {
    this.ms_opts.read_only = true;
  }

  get() {
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (lr_item) {
      rv_value = lr_item.value;
    }
  }

  get_boolean() {
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (!lr_item || lr_item.type === z2ui5_if_ajson_types.node_type.null) {
      return;
    } else if (lr_item.type === z2ui5_if_ajson_types.node_type.boolean) {
      rv_value = Boolean(lr_item.value === `true`);
    } else if (lr_item.value) {
      rv_value = true;
    }
  }

  get_date() {
    let lr_item = null;
    let lv_y = ``;
    let lv_m = ``;
    let lv_d = ``;
    lr_item = this.get_item({ iv_path: iv_path });
    if (lr_item && lr_item.type === z2ui5_if_ajson_types.node_type.string) {
      // TODO(abap2js): FIND FIRST OCCURRENCE OF REGEX '^(\d{4})-(\d{2})-(\d{2})(T|$)' IN lr_item->value SUBMATCHES lv_y lv_m lv_d .
      rv_value = [lv_y, lv_m, lv_d].join(``);
    }
  }

  get_integer() {
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (lr_item && lr_item.type === z2ui5_if_ajson_types.node_type.number) {
      rv_value = lr_item.value;
    }
  }

  get_node_type() {
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (lr_item) {
      rv_node_type = lr_item.type;
    }
  }

  get_number() {
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (lr_item && lr_item.type === z2ui5_if_ajson_types.node_type.number) {
      rv_value = lr_item.value;
    }
  }

  get_string() {
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (lr_item && lr_item.type !== z2ui5_if_ajson_types.node_type.null) {
      rv_value = lr_item.value;
    }
  }

  get_timestamp() {
    let lo_to_abap = null;
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (!lr_item) {
      return;
    }
    lo_to_abap = null; // TODO(abap2js): CREATE OBJECT lo_to_abap.
    try {
      rv_value = lo_to_abap.to_timestamp(lr_item.value);
    } catch (error) {
      return;
    }
  }

  get_timestampl() {
    let lo_to_abap = null;
    let lr_item = null;
    lr_item = this.get_item({ iv_path: iv_path });
    if (!lr_item) {
      return;
    }
    lo_to_abap = null; // TODO(abap2js): CREATE OBJECT lo_to_abap.
    try {
      rv_value = lo_to_abap.to_timestampl(lr_item.value);
    } catch (error) {
      return;
    }
  }

  is_empty() {
    rv_yes = Boolean(mt_json_tree.length === 0);
  }

  keep_item_order() {
    this.ms_opts.keep_item_order = true;
    ri_json = this;
  }

  map() {
    ri_json = z2ui5_cl_ajson.create_from({ ii_source_json: this, ii_mapper });
  }

  members() {
    let sy_tabix = 0;
    let lv_normalized_path = ``;
    // TODO(abap2js): FIELD-SYMBOLS <item> LIKE LINE OF mt_json_tree.
    lv_normalized_path = lcl_utils.normalize_path(iv_path);
    sy_tabix = 0;
    for (const item of mt_json_tree) {
      sy_tabix++;
      if (!(item.path === lv_normalized_path)) continue;
      rt_members.push(item.name);
    }
  }

  opts() {
    rs_opts = this.ms_opts;
  }

  push() {
    let lr_parent = null;
    let lr_new_node = null;
    this.read_only_watchdog();
    lr_parent = this.get_item({ iv_path: iv_path });
    if (!lr_parent) {
      z2ui5_cx_ajson_error.raise(`Path [${iv_path}] does not exist`);
    }
    if (lr_parent.type !== z2ui5_if_ajson_types.node_type.array) {
      z2ui5_cx_ajson_error.raise(`Path [${iv_path}] is not array`);
    }
    let lt_new_nodes = null;
    let ls_new_path = null;
    let lv_new_index = 0;
    lv_new_index = lr_parent.children + 1;
    ls_new_path.path = lcl_utils.normalize_path(iv_path);
    ls_new_path.name = `${lv_new_index}`;
    lt_new_nodes = lcl_abap_to_json.convert({ is_opts: this.ms_opts, iv_data: iv_val, is_prefix: ls_new_path });
    // TODO(abap2js): READ TABLE lt_new_nodes INDEX 1 REFERENCE INTO lr_new_node.
    if (!(sy_subrc === 0)) throw new Error(`ASSERT failed`);
    lr_new_node.index = lv_new_index;
    lr_parent.children = lv_new_index;
    mt_json_tree.push(...lt_new_nodes);
    ri_json = this;
  }

  set() {
    let ls_split_path = null;
    let lr_parent = null;
    let ls_deleted_node = null;
    let lv_item_order = null;
    this.read_only_watchdog();
    ri_json = this;
    if (!iv_val && iv_ignore_empty === true && !iv_node_type) {
      return;
    }
    if (iv_node_type && iv_node_type !== z2ui5_if_ajson_types.node_type.boolean && iv_node_type !== z2ui5_if_ajson_types.node_type.null && iv_node_type !== z2ui5_if_ajson_types.node_type.number && iv_node_type !== z2ui5_if_ajson_types.node_type.string) {
      z2ui5_cx_ajson_error.raise(`Unexpected type ${iv_node_type}`);
    }
    ls_split_path = lcl_utils.split_path(iv_path);
    if (!ls_split_path) {
      if (iv_node_type) {
        mt_json_tree = lcl_abap_to_json.insert_with_type({ is_opts: this.ms_opts, iv_data: iv_val, iv_type: iv_node_type, is_prefix: ls_split_path, ii_custom_mapping: this.mi_custom_mapping });
      } else {
        mt_json_tree = lcl_abap_to_json.convert({ is_opts: this.ms_opts, iv_data: iv_val, is_prefix: ls_split_path, ii_custom_mapping: this.mi_custom_mapping });
      }
      return;
    }
    lr_parent = this.prove_path_exists({ iv_path: ls_split_path.path });
    if (!(lr_parent)) throw new Error(`ASSERT failed`);
    ls_deleted_node = this.delete_subtree({ ir_parent: lr_parent, iv_path: ls_split_path.path, iv_name: ls_split_path.name });
    lv_item_order = ls_deleted_node.order;
    let lt_new_nodes = null;
    let lv_array_index = 0;
    if (lr_parent.type === z2ui5_if_ajson_types.node_type.array) {
      lv_array_index = lcl_utils.validate_array_index({ iv_path: ls_split_path.path, iv_index: ls_split_path.name });
    } else if (lr_parent.type === z2ui5_if_ajson_types.node_type.object && lv_item_order === 0 && this.ms_opts.keep_item_order === true) {
      lv_item_order = lr_parent.children + 1;
    }
    if (iv_node_type) {
      lt_new_nodes = lcl_abap_to_json.insert_with_type({ is_opts: this.ms_opts, iv_item_order: lv_item_order, iv_data: iv_val, iv_type: iv_node_type, iv_array_index: lv_array_index, is_prefix: ls_split_path, ii_custom_mapping: this.mi_custom_mapping });
    } else {
      lt_new_nodes = lcl_abap_to_json.convert({ is_opts: this.ms_opts, iv_item_order: lv_item_order, iv_data: iv_val, iv_array_index: lv_array_index, is_prefix: ls_split_path, ii_custom_mapping: this.mi_custom_mapping });
    }
    if (lt_new_nodes.length > 0) {
      lr_parent.children = lr_parent.children + 1;
      mt_json_tree.push(...lt_new_nodes);
    }
  }

  setx() {
    let lv_path = ``;
    let lv_val = ``;
    let lv_int = 0;
    let lv_dec = 0;
    let lv_last = 0;
    if (!iv_param) {
      ri_json = this;
      return;
    }
    [lv_path, lv_val] = iv_param.split(`:`);
    // TODO(abap2js): CONDENSE lv_path.
    // TODO(abap2js): CONDENSE lv_val.
    if (!lv_val) {
      ri_json = this;
      return;
    }
    if (z2ui5_cl_ajson.go_float_regex != null) {
      z2ui5_cl_ajson.go_float_regex = null; // TODO(abap2js): CREATE OBJECT go_float_regex EXPORTING pattern = '^([1-9][0-9]*|0)\.[0-9]+$' .
    }
    if (lv_val === `null`) {
      this.set_null(lv_path);
    } else if (lv_val === `true`) {
      this.set_boolean({ iv_path: lv_path, iv_val: true });
    } else if (lv_val === `false`) {
      this.set_boolean({ iv_path: lv_path, iv_val: false });
    } else if ([...String(lv_val)].every(($c) => String(`0123456789`).includes($c))) {
      lv_int = lv_val;
      this.set_integer({ iv_path: lv_path, iv_val: lv_int });
    } else if ([...String(lv_val)].every(($c) => String(`0123456789.`).includes($c)) && z2ui5_cl_ajson.go_float_regex.create_matcher({ text: lv_val }).match() === true) {
      lv_dec = lv_val;
      this.set({ iv_path: lv_path, iv_val: lv_dec });
    } else if (String(lv_val).substr(0, 1) === `{` || String(lv_val).substr(0, 1) === `[`) {
      this.set({ iv_path: lv_path, iv_val: z2ui5_cl_ajson.parse({ iv_json: lv_val, iv_keep_item_order: this.ms_opts.keep_item_order }) });
    } else {
      lv_last = lv_val.length - 1;
      if (String(lv_val).substr(0, 1) === `"` && String(lv_val).substr(lv_last, 1) === `"`) {
        lv_val = lv_val.substr(1, lv_last - 1);
      }
      this.set_string({ iv_path: lv_path, iv_val: lv_val });
    }
    ri_json = this;
  }

  set_boolean() {
    ri_json = this;
    let lv_bool = false;
    lv_bool = Boolean(iv_val);
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lv_bool });
  }

  set_date() {
    ri_json = this;
    let lv_val = ``;
    lv_val = lcl_abap_to_json.format_date(iv_val);
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lv_val });
  }

  set_integer() {
    ri_json = this;
    this.set({ iv_ignore_empty: false, iv_path, iv_val });
  }

  set_null() {
    ri_json = this;
    let lv_null_ref = null;
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lv_null_ref });
  }

  set_string() {
    ri_json = this;
    let lv_val = ``;
    lv_val = iv_val;
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lv_val });
  }

  set_timestamp() {
    ri_json = this;
    let lv_timestamp_iso = ``;
    lv_timestamp_iso = lcl_abap_to_json.format_timestamp(iv_val);
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lv_timestamp_iso });
  }

  set_timestampl() {
    ri_json = this;
    let lv_timestamp_iso = ``;
    lv_timestamp_iso = lcl_abap_to_json.format_timestampl(iv_val);
    this.set({ iv_ignore_empty: false, iv_path, iv_val: lv_timestamp_iso });
  }

  slice() {
    let sy_tabix = 0;
    let lo_section = null;
    let ls_item = null;
    let lv_normalized_path = ``;
    let ls_path_parts = null;
    let lv_path_len = 0;
    let lv_path_pattern = ``;
    lo_section = null; // TODO(abap2js): CREATE OBJECT lo_section.
    lo_section.mi_custom_mapping = this.mi_custom_mapping;
    lv_normalized_path = lcl_utils.normalize_path(iv_path);
    lv_path_len = lv_normalized_path.length;
    ls_path_parts = lcl_utils.split_path(lv_normalized_path);
    // TODO(abap2js): READ TABLE mt_json_tree INTO ls_item WITH KEY path = ls_path_parts-path name = ls_path_parts-name.
    if (sy_subrc !== 0) {
      return;
    }
    ls_item.path = null;
    ls_item.name = null;
    ls_item.order = null;
    lo_section.mt_json_tree.push(ls_item);
    lv_path_pattern = lv_normalized_path + `*`;
    sy_tabix = 0;
    for (const ls_item of mt_json_tree) {
      sy_tabix++;
      if (!(String(ls_item.path).includes(String(lv_path_pattern).replace(/\*/g, "")))) continue;
      ls_item.path = ls_item.path.substr(lv_path_len - 1);
      lo_section.mt_json_tree.push(ls_item);
    }
    ri_json = lo_section;
  }

  stringify() {
    rv_json = lcl_json_serializer.stringify({ it_json_tree: mt_json_tree, iv_keep_item_order: this.ms_opts.keep_item_order, iv_indent });
  }

  touch_array() {
    let lr_node = null;
    let ls_deleted_node = null;
    let ls_new_node = null;
    let ls_split_path = null;
    this.read_only_watchdog();
    ls_split_path = lcl_utils.split_path(iv_path);
    if (!ls_split_path) {
      ls_new_node.path = ls_split_path.path;
      ls_new_node.name = ls_split_path.name;
      ls_new_node.type = z2ui5_if_ajson_types.node_type.array;
      mt_json_tree.push(ls_new_node);
      return;
    }
    if (iv_clear === true) {
      ls_deleted_node = this.delete_subtree({ iv_path: ls_split_path.path, iv_name: ls_split_path.name });
    } else {
      lr_node = this.get_item({ iv_path: iv_path });
    }
    if (!lr_node) {
      let lr_parent = null;
      lr_parent = this.prove_path_exists({ iv_path: ls_split_path.path });
      if (!(lr_parent)) throw new Error(`ASSERT failed`);
      lr_parent.children = lr_parent.children + 1;
      ls_new_node.path = ls_split_path.path;
      ls_new_node.name = ls_split_path.name;
      ls_new_node.type = z2ui5_if_ajson_types.node_type.array;
      if (this.ms_opts.keep_item_order === true) {
        if (ls_deleted_node) {
          ls_new_node.order = ls_deleted_node.order;
        } else {
          ls_new_node.order = lr_parent.children;
        }
      }
      mt_json_tree.push(ls_new_node);
    } else if (lr_node.type !== z2ui5_if_ajson_types.node_type.array) {
      z2ui5_cx_ajson_error.raise(`Path [${iv_path}] already used and is not array`);
    }
    ri_json = this;
  }

  to_abap() {
    let lo_to_abap = null;
    ev_container = null;
    lo_to_abap = null; // TODO(abap2js): CREATE OBJECT lo_to_abap EXPORTING iv_corresponding = boolc( iv_corresponding = abap_true OR ms_opts-to_abap_corresponding_only = abap_true ) ii_custom_mapping = mi_custom_mapping ii_refs_initiator = ii_refs_initiator.
    lo_to_abap.to_abap({ it_nodes: this.mt_json_tree, c_container: ev_container });
  }

  to_abap_corresponding_only() {
    this.ms_opts.to_abap_corresponding_only = iv_enable;
    ri_json = this;
  }
}

module.exports = z2ui5_cl_ajson;
