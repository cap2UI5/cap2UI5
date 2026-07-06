const z2ui5_if_app          = require("../z2ui5_if_app");
const z2ui5_cl_pop_table    = require("./z2ui5_cl_pop_table");
const z2ui5_cl_util         = require("../../00/03/z2ui5_cl_util");

/**
 * z2ui5_cl_pop_data — JS port of abap2UI5 z2ui5_cl_pop_data.
 *
 * Generic data viewer that dispatches by type-kind:
 *   TABLE  → z2ui5_cl_pop_table
 *   STRUCT → wrap into a single-row table, then z2ui5_cl_pop_table
 *
 * Apps don't usually instantiate this directly — they pass it any value and
 * let the dispatch happen. The popup nav-leaves immediately after dispatch
 * (mirrors abap impl).
 */
class z2ui5_cl_pop_data extends z2ui5_if_app {

  client = null;
  title  = `Table View`;
  mr_data = null;

  static factory({ val, title } = {}) {
    const r_result = new z2ui5_cl_pop_data();
    if (title) r_result.title = title;
    r_result.mr_data = val;
    return r_result;
  }

  display() {
    const kind = z2ui5_cl_util.rtti_get_type_kind(this.mr_data);
    if (kind === `TABLE`) {
      this.client.nav_app_call(z2ui5_cl_pop_table.factory({
        i_tab:   this.mr_data,
        i_title: this.title,
      }));
    } else if (kind === `STRUCT`) {
      this.client.nav_app_call(z2ui5_cl_pop_table.factory({
        i_tab:   [this.mr_data],
        i_title: this.title,
      }));
    }
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
