const cl_abap_structdescr = require("abap2UI5/cl_abap_structdescr");
const z2ui5_cl_srt_complexdescr = require("abap2UI5/z2ui5_cl_srt_complexdescr");
const z2ui5_cl_srt_datadescr = require("abap2UI5/z2ui5_cl_srt_datadescr");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_srt_structdescr extends z2ui5_cl_srt_complexdescr {
  struct_kind = null;
  components = null;
  has_include = null;

  constructor({ rtti } = {}) {
    let sy_tabix = 0;
    let components_rtti = [];
    let scomponent = null;
    let scomponent_rtti = null;
    super.constructor(rtti);
    this.struct_kind = z2ui5_cl_util.abap_copy(rtti.struct_kind);
    this.has_include = z2ui5_cl_util.abap_copy(rtti.has_include);
    components_rtti = rtti.get_components();
    sy_tabix = 0;
    for (const fs_component of components_rtti) {
      sy_tabix++;
      scomponent = null;
      scomponent.name = z2ui5_cl_util.abap_copy(fs_component.name);
      scomponent_rtti = z2ui5_cl_srt_datadescr.create_by_rtti(fs_component.type);
      scomponent.type = z2ui5_cl_util.abap_copy(scomponent_rtti);
      scomponent.as_include = z2ui5_cl_util.abap_copy(fs_component.as_include);
      scomponent.suffix = z2ui5_cl_util.abap_copy(fs_component.suffix);
      this.components.push(scomponent);
      if ((scomponent.type.not_serializable === true || scomponent.type.not_serializable === `X`)) {
        not_serializable = true;
      }
    }
  }

  get_rtti() {
    let sy_tabix = 0;
    let lv_method;
    let components_rtti = [];
    let component_rtti = null;
    components_rtti = null;
    sy_tabix = 0;
    for (const fs_component of this.components) {
      sy_tabix++;
      component_rtti = null;
      component_rtti.name = z2ui5_cl_util.abap_copy(fs_component.name);
      try {
        component_rtti.type = fs_component.type.get_rtti();
      } catch (x) {
        lv_method = `GET_BY_KIND`;
        // TODO(abap2js): CALL METHOD cl_abap_elemdescr=>(lv_method) EXPORTING p_type_kind = <component>-type->type_kind p_length = <component>-type->length p_decimals = <component>-type->decimals RECEIVING p_result = component_rtti-type.
      }
      component_rtti.as_include = z2ui5_cl_util.abap_copy(fs_component.as_include);
      component_rtti.suffix = z2ui5_cl_util.abap_copy(fs_component.suffix);
      components_rtti.push(component_rtti);
    }
    rtti = cl_abap_structdescr.create(components_rtti);
  }
}

module.exports = z2ui5_cl_srt_structdescr;
