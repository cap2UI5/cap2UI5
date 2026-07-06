const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_demo_app_333 {
  static cv_value = `STRUCT`;

  ms_data = {};
  mr_data = null;

  static factory({ i_data, vis_cols } = {}) {
    let result = null;
    result = new z2ui5_cl_demo_app_333();
    const t_comp = z2ui5_cl_util.rtti_get_t_attri_by_any(i_data);
    let index = 0;
    let sy_tabix = 0;
    for (const comp of t_comp) {
      sy_tabix++;
      index = index + 1;
      result.ms_data.t_layout reference into this.data(layout).push({});
      layout.name = comp.name;
      if (index <= vis_cols) {
        layout.visible = true;
      }
    }
    try {
      result.ms_data.guid = z2ui5_cl_util.uuid_get_c32();
    } catch (error) {
    }
    result.mr_data = i_data;
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_333;
