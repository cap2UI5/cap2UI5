// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
const z2ui5_cl_srt_complexdescr = require("abap2UI5/z2ui5_cl_srt_complexdescr");
const z2ui5_cl_srt_datadescr = require("abap2UI5/z2ui5_cl_srt_datadescr");

class z2ui5_cl_srt_structdescr extends z2ui5_cl_srt_complexdescr {
  struct_kind = null;
  components = null;
  has_include = null;

  constructor({ rtti } = {}) {
    let sy_tabix = 0;
    let components_rtti = [];
    let scomponent = null;
    let scomponent_rtti = null;
    // TODO(abap2js): FIELD-SYMBOLS <component> TYPE abap_componentdescr.
    super.constructor(rtti);
    this.struct_kind = rtti.struct_kind;
    this.has_include = rtti.has_include;
    components_rtti = rtti.get_components();
    sy_tabix = 0;
    for (const component of components_rtti) {
      sy_tabix++;
      scomponent = null;
      scomponent.name = component.name;
      scomponent_rtti = z2ui5_cl_srt_datadescr.create_by_rtti(component.type);
      scomponent.type = scomponent_rtti;
      scomponent.as_include = component.as_include;
      scomponent.suffix = component.suffix;
      this.components.push(scomponent);
      if (scomponent.type.not_serializable === true) {
        not_serializable = true;
      }
    }
  }

  get_rtti() {
    let sy_tabix = 0;
    let components_rtti = [];
    let component_rtti = null;
    // TODO(abap2js): FIELD-SYMBOLS <component> TYPE sabap_componentdescr.
    components_rtti = null;
    sy_tabix = 0;
    for (const component of this.components) {
      sy_tabix++;
      component_rtti = null;
      component_rtti.name = component.name;
      try {
        component_rtti.type = component.type.get_rtti();
      } catch (x) {
        const lv_method = `GET_BY_KIND`;
        // TODO(abap2js): CALL METHOD cl_abap_elemdescr=>(lv_method) EXPORTING p_type_kind = <component>-type->type_kind p_length = <component>-type->length p_decimals = <component>-type->decimals RECEIVING p_result = component_rtti-type.
      }
      component_rtti.as_include = component.as_include;
      component_rtti.suffix = component.suffix;
      components_rtti.push(component_rtti);
    }
    rtti = cl_abap_structdescr.create(components_rtti);
  }
}

module.exports = z2ui5_cl_srt_structdescr;
