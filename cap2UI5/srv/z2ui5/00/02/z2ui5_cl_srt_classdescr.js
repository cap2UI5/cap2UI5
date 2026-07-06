// TODO(abap2js): unresolved reference z2ui5_cl_srt_objectdescr — add require manually

class z2ui5_cl_srt_classdescr extends z2ui5_cl_srt_objectdescr {
  class_kind = null;
  create_visibility = null;

  constructor({ !rtti } = {}) {
    super.constructor(rtti);
    this.class_kind = rtti.class_kind;
    this.create_visibility = rtti.create_visibility;
  }
}

module.exports = z2ui5_cl_srt_classdescr;
