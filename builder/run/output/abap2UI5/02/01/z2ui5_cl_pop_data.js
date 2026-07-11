const z2ui5_cl_pop_table = require("abap2UI5/z2ui5_cl_pop_table");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_data extends z2ui5_if_app {
  mr_data = null;
  title = `Table View`;
  client = null;

  display() {
    let sy_subrc = 0;
    let fs_data = null;
    let _fs$fs_data = null;
    let lt_result;
    // TODO(abap2js): ASSIGN mr_data->* TO <data>.
    if (z2ui5_cl_util.rtti_check_table(fs_data)) {
      this.client.nav_app_call(z2ui5_cl_pop_table.factory({ i_tab: fs_data, i_title: this.title }));
    } else if (z2ui5_cl_util.rtti_check_structure(fs_data)) {
      lt_result = z2ui5_cl_util.itab_get_by_struc(fs_data);
      this.client.nav_app_call(z2ui5_cl_pop_table.factory({ i_tab: lt_result, i_title: this.title }));
    }
  }

  static factory({ val, title } = {}) {
    let r_result = null;
    let sy_subrc = 0;
    let fs_data = null;
    let _fs$fs_data = null;
    r_result = new z2ui5_cl_pop_data();
    if (title) {
      r_result.title = z2ui5_cl_util.abap_copy(title);
    }
    // TODO(abap2js): CREATE DATA r_result->mr_data LIKE val.
    // TODO(abap2js): ASSIGN r_result->mr_data->* TO <data>.
    fs_data = z2ui5_cl_util.abap_copy(val);
    if (_fs$fs_data) _fs$fs_data.o[_fs$fs_data.k] = fs_data;
    return r_result;
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.display();
      return;
    }
    client.nav_app_leave();
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_data, {
  factory: { preferred: `val`, params: [`val`, `title`] },
});

module.exports = z2ui5_cl_pop_data;
