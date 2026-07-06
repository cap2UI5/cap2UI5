// TODO(abap2js): unresolved reference cl_abap_typedescr — add require manually
const z2ui5_cl_pop_table = require("abap2UI5/z2ui5_cl_pop_table");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_data extends z2ui5_if_app {
  mr_data = null;
  title = `Table View`;
  client = null;

  display() {
    // TODO(abap2js): FIELD-SYMBOLS <data> TYPE any.
    // TODO(abap2js): ASSIGN mr_data->* TO <data>.
    switch (z2ui5_cl_util.rtti_get_type_kind(data)) {
      case cl_abap_typedescr.typekind_table:
        this.client.nav_app_call(z2ui5_cl_pop_table.factory({ i_tab: data, i_title: this.title }));
        break;
      case cl_abap_typedescr.typekind_struct1:
      case cl_abap_typedescr.typekind_struct2:
        const lt_result = z2ui5_cl_util.itab_get_by_struc(data);
        this.client.nav_app_call(z2ui5_cl_pop_table.factory({ i_tab: lt_result, i_title: this.title }));
        break;
    }
  }

  static factory({ val, title } = {}) {
    let r_result = null;
    // TODO(abap2js): FIELD-SYMBOLS <data> TYPE any.
    r_result = new z2ui5_cl_pop_data();
    if (title) {
      r_result.title = title;
    }
    // TODO(abap2js): CREATE DATA r_result->mr_data LIKE val.
    // TODO(abap2js): ASSIGN r_result->mr_data->* TO <data>.
    data = val;
    return r_result;
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.display();
      return;
    }
    client.nav_app_leave();
  }
}

module.exports = z2ui5_cl_pop_data;
