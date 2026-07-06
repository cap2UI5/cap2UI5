const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_054 extends z2ui5_if_app {
  t_tab = [];

  refresh_data() {
    for (let sy_index = 1; sy_index <= 100; sy_index++) {
      const ls_row = { count: sy_index, value: `red`, info: (sy_index < 50 ? `completed` : `uncompleted`), descr: `this is a description`, checkbox: true };
      this.t_tab.push(ls_row);
    }
  }

  async main(client) {
  }
}

module.exports = z2ui5_cl_demo_app_054;
