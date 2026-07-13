const z2ui5_cl_srt_objectdescr = require("abap2UI5/z2ui5_cl_srt_objectdescr");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_srt_intfdescr extends z2ui5_cl_srt_objectdescr {
  intf_kind = null;

  constructor({ rtti } = {}) {
    super.constructor(rtti);
    this.intf_kind = z2ui5_cl_util.abap_copy(rtti.intf_kind);
  }
}

module.exports = z2ui5_cl_srt_intfdescr;
