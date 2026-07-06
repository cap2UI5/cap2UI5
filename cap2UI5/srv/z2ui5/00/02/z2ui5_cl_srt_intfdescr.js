// TODO(abap2js): unresolved reference z2ui5_cl_srt_objectdescr — add require manually

class z2ui5_cl_srt_intfdescr extends z2ui5_cl_srt_objectdescr {
  intf_kind = null;

  constructor({ !rtti } = {}) {
    super.constructor(rtti);
    this.intf_kind = rtti.intf_kind;
  }
}

module.exports = z2ui5_cl_srt_intfdescr;
