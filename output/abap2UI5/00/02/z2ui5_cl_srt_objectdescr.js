const z2ui5_cl_srt_typedescr = require("abap2UI5/z2ui5_cl_srt_typedescr");

class z2ui5_cl_srt_objectdescr extends z2ui5_cl_srt_typedescr {
  interfaces = null;
  types = null;
  attributes = null;
  methods = null;
  events = null;

  constructor({ rtti } = {}) {
    super.constructor(rtti);
    this.interfaces = rtti.interfaces;
    this.types = rtti.types;
    this.attributes = rtti.attributes;
    this.methods = rtti.methods;
    this.events = rtti.events;
    // TODO(abap2js): READ TABLE interfaces WITH KEY name = 'IF_SERIALIZABLE_OBJECT' TRANSPORTING NO FIELDS.
    if (sy_subrc !== 0) {
      not_serializable = true;
    }
  }
}

module.exports = z2ui5_cl_srt_objectdescr;
