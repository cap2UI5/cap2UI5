// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cx_srt = require("abap2UI5/z2ui5_cx_srt");

class z2ui5_cl_srt_typedescr {
  absolute_name = null;
  type_kind = null;
  length = null;
  decimals = null;
  kind = null;
  not_serializable = false;
  is_ddic_type = false;
  technical_type = false;

  constructor({ rtti } = {}) {
    this.absolute_name = rtti.absolute_name;
    this.type_kind = rtti.type_kind;
    this.length = rtti.length;
    this.decimals = rtti.decimals;
    this.kind = rtti.kind;
    this.is_ddic_type = rtti.is_ddic_type();
    if (String(rtti.absolute_name).includes(String(`\\TYPE=%_T*`).replace(/\*/g, ""))) {
      this.technical_type = true;
    }
  }

  static create_by_data_object({ data_object } = {}) {
    let srtti = null;
    srtti = z2ui5_cl_srt_typedescr.create_by_rtti({ rtti: cl_abap_typedescr.describe_by_data(data_object) });
    return srtti;
  }

  static create_by_rtti({ rtti } = {}) {
    let srtti = null;
    let elem_rtti = null;
    let struct_rtti = null;
    let table_rtti = null;
    let ref_rtti = null;
    let class_rtti = null;
    let intf_rtti = null;
    switch (rtti.kind) {
      case cl_abap_typedescr.kind_elem:
        elem_rtti = rtti;
        srtti = null; // TODO(abap2js): CREATE OBJECT srtti TYPE z2ui5_cl_srt_elemdescr EXPORTING rtti = elem_rtti.
        break;
      case cl_abap_typedescr.kind_struct:
        struct_rtti = rtti;
        srtti = null; // TODO(abap2js): CREATE OBJECT srtti TYPE z2ui5_cl_srt_structdescr EXPORTING rtti = struct_rtti.
        break;
      case cl_abap_typedescr.kind_table:
        table_rtti = rtti;
        srtti = null; // TODO(abap2js): CREATE OBJECT srtti TYPE z2ui5_cl_srt_tabledescr EXPORTING rtti = table_rtti.
        break;
      case cl_abap_typedescr.kind_ref:
        ref_rtti = rtti;
        srtti = null; // TODO(abap2js): CREATE OBJECT srtti TYPE z2ui5_cl_srt_refdescr EXPORTING rtti = ref_rtti.
        break;
      case cl_abap_typedescr.kind_class:
        class_rtti = rtti;
        srtti = null; // TODO(abap2js): CREATE OBJECT srtti TYPE z2ui5_cl_srt_classdescr EXPORTING rtti = class_rtti.
        break;
      case cl_abap_typedescr.kind_intf:
        intf_rtti = rtti;
        srtti = null; // TODO(abap2js): CREATE OBJECT srtti TYPE z2ui5_cl_srt_intfdescr EXPORTING rtti = intf_rtti.
        break;
      default:
        throw new z2ui5_cx_srt();
        break;
    }
    return srtti;
  }

  get_rtti() {
    let rtti = null;
    if (this.technical_type === false) {
      rtti = cl_abap_typedescr.describe_by_name(this.absolute_name);
    }
    return rtti;
  }
}

module.exports = z2ui5_cl_srt_typedescr;
