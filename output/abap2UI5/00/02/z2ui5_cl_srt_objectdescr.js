const z2ui5_cl_srt_typedescr = require("abap2UI5/z2ui5_cl_srt_typedescr");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_srt_objectdescr extends z2ui5_cl_srt_typedescr {
  interfaces = null;
  types = null;
  attributes = null;
  methods = null;
  events = null;

  constructor({ rtti } = {}) {
    let sy_subrc = 0;
    super.constructor(rtti);
    this.interfaces = z2ui5_cl_util.abap_copy(rtti.interfaces);
    this.types = z2ui5_cl_util.abap_copy(rtti.types);
    this.attributes = z2ui5_cl_util.abap_copy(rtti.attributes);
    this.methods = z2ui5_cl_util.abap_copy(rtti.methods);
    this.events = z2ui5_cl_util.abap_copy(rtti.events);
    {
      const _t = this.interfaces;
      const _i = _t.findIndex((_r) => _r.name === `IF_SERIALIZABLE_OBJECT`);
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
    }
    if (sy_subrc !== 0) {
      not_serializable = true;
    }
  }
}

module.exports = z2ui5_cl_srt_objectdescr;
