const z2ui5_cl_srt_objectdescr = require("abap2UI5/z2ui5_cl_srt_objectdescr");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_srt_classdescr extends z2ui5_cl_srt_objectdescr {
  class_kind = null;
  create_visibility = null;

  constructor({ rtti } = {}) {
    super.constructor(rtti);
    this.class_kind = z2ui5_cl_util.abap_copy(rtti.class_kind);
    this.create_visibility = z2ui5_cl_util.abap_copy(rtti.create_visibility);
  }
}

module.exports = z2ui5_cl_srt_classdescr;
