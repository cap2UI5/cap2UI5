// TODO(abap2js): unresolved reference cl_abap_elemdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_srt_complexdescr — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_srt_datadescr — add require manually

class z2ui5_cl_srt_structdescr extends z2ui5_cl_srt_complexdescr {
  struct_kind = null;
  components = null;
  has_include = null;

  constructor({ !rtti } = {}) {
    let components_rtti = [];
    let scomponent = null;
    let scomponent_rtti = null;
    // TODO(abap2js): FIELD-SYMBOLS <component> TYPE abap_componentdescr.
    super.constructor(rtti);
    this.struct_kind = rtti.struct_kind;
    this.has_include = rtti.has_include;
    components_rtti = rtti.get_components();
    let sy_tabix = 0;
    for (const fs of components_rtti) {
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
    let components_rtti = [];
    let component_rtti = null;
    // TODO(abap2js): FIELD-SYMBOLS <component> TYPE sabap_componentdescr.
    components_rtti = null;
    let sy_tabix = 0;
    for (const fs of this.components) {
      sy_tabix++;
      component_rtti = null;
      component_rtti.name = component.name;
      try {
        component_rtti.type = component.type.get_rtti();
      } catch (x) {
        const lv_method = `GET_BY_KIND`;
        call method cl_abap_elemdescr.( lv_method ) exporting p_type_kind === component.type.type_kind p_length === component.type.length p_decimals === component.type.decimals receiving p_result === component_rtti.type;
      }
      component_rtti.as_include = component.as_include;
      component_rtti.suffix = component.suffix;
      components_rtti.push(component_rtti);
    }
    rtti = cl_abap_structdescr.create(components_rtti);
  }
}

module.exports = z2ui5_cl_srt_structdescr;
