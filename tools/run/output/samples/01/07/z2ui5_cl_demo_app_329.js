const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_demo_app_329 {
  mr_data = null;

  static factory({ i_data } = {}) {
    let result = null;
    result = new z2ui5_cl_demo_app_329();
    result.mr_data = z2ui5_cl_util.abap_copy(i_data);
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_329;
