const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_s_06 extends z2ui5_if_app {
  async main(client) {
    client.nav_app_call(new zcl_2ui5_start());
  }
}

module.exports = z2ui5_cl_demo_app_s_06;
