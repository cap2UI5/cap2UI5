// TODO(abap2js): unresolved reference cl_abap_refdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_srt_datadescr — add require manually

class z2ui5_cl_srt_refdescr extends z2ui5_cl_srt_datadescr {
  referenced_type = null;

  constructor({ !rtti } = {}) {
    super.constructor(rtti);
    this.referenced_type = null; // TODO(abap2js): CREATE OBJECT referenced_type TYPE z2ui5_cl_srt_typedescr EXPORTING rtti = rtti->get_referenced_type( ).
    if (this.referenced_type.not_serializable === true) {
      not_serializable = true;
    }
  }

  get_rtti() {
    if (this.referenced_type.type_kind === cl_abap_typedescr.typekind_data) {
      rtti = cl_abap_refdescr.get_ref_to_data();
    } else if (this.referenced_type.absolute_name === `\\CLASS=OBJECT`) {
      rtti = cl_abap_refdescr.get_ref_to_object();
    } else {
      rtti = this.referenced_type.get_rtti();
    }
    rtti = cl_abap_refdescr.create(rtti);
  }
}

module.exports = z2ui5_cl_srt_refdescr;
