const z2ui5_if_app = require("../../02/z2ui5_if_app");
const z2ui5_cl_ui5_view_builder = require("../../02/z2ui5_cl_ui5_view_builder");

/**
 * The framework's value-help dialog — pick one entry from a list.
 *
 * Replaces the built-in z2ui5_cl_pop_to_select from upstream's frozen
 * src/99/02, for the one place the framework itself needs a value help: the
 * start page's "browse the installed app classes" button.
 *
 * Deliberately NOT a full re-port of the retired class. That one carried
 * multi-select, sorters, growing thresholds and configurable content sizes —
 * 220 lines of surface with a single consumer using none of it. Reproducing
 * unused capability is how a retired class gets a second life. What is here
 * is what is used: a searchable single-select list over `{KEY, TEXT}` rows.
 *
 * Contract (unchanged from the class it replaces, so the caller reads the
 * same way):
 *
 *   client.nav_app_call(z2ui5_cl_ui5_app_select.factory({
 *     i_tab:   [{ KEY: `zcl_x`, TEXT: `My app` }, …],
 *     i_title: `Select an App`,
 *   }));
 *
 *   // next roundtrip, check_on_navigated:
 *   const r = client.get_app_prev().result();
 *   if (r.check_confirmed) use r.row;
 */
class z2ui5_cl_ui5_app_select extends z2ui5_if_app {

  ms_result = { row: null, table: [], check_confirmed: false };
  mt_rows = [];      // the full list
  mt_visible = [];   // what the dialog is bound to (filtered by the search)
  client = null;
  title = ``;

  static factory(a) {
    // abap PREFERRED PARAMETER: factory(tab) ≡ factory({ i_tab: tab })
    const { i_tab = [], i_title = `Select` } = Array.isArray(a) ? { i_tab: a } : a || {};
    const result = new z2ui5_cl_ui5_app_select();
    result.title = i_title;
    result.mt_rows = i_tab.map((row) => ({ ...row }));
    result.mt_visible = result.mt_rows.map((row) => ({ ...row }));
    return result;
  }

  result() {
    return this.ms_result;
  }

  display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` });

    const dialog = view
      .ele({ n: `SelectDialog` })
      .a({ n: `title`, v: this.title })
      .a({ n: `growing`, b: true })
      .a({ n: `items`, v: this.client._bind_edit(this.mt_visible) })
      .a({ n: `search`, v: this.client._event(`SEARCH`, [`\${$parameters>/value}`]) })
      .a({ n: `cancel`, v: this.client._event(`CANCEL`) })
      // The selected row travels as its binding path — the frontend has no
      // other stable handle on "which row", and the index in that path is an
      // index into the CURRENTLY bound (i.e. filtered) list.
      .a({ n: `confirm`, v: this.client._event(`CONFIRM`, [`\${$parameters>/selectedContexts[0]/sPath}`]) });

    dialog
      .ele({ n: `StandardListItem` })
      .a({ n: `title`, v: `{TEXT}` })
      .a({ n: `description`, v: `{KEY}` });

    this.client.popup_display(view.stringify());
  }

  on_event_confirm() {
    const sPath = String(this.client.get_event_arg(0) || ``);
    const m = sPath.match(/\/(\d+)\s*$/);
    const row = m ? this.mt_visible[Number(m[1])] : null;

    if (row) {
      this.ms_result.check_confirmed = true;
      this.ms_result.row = { ...row };
      this.ms_result.table = [{ ...row }];
    }

    this.client.popup_destroy();
    this.client.nav_app_leave();
  }

  on_event_search() {
    const needle = String(this.client.get_event_arg(0) || ``).toUpperCase();
    const hits = this.mt_rows
      .filter((row) => Object.values(row).some((v) => String(v ?? ``).toUpperCase().includes(needle)))
      .map((row) => ({ ...row }));

    // Filter IN PLACE. The binding registered by display() resolves to this
    // array's model path, and replacing the array would change the reference
    // the binding was auto-discovered under.
    this.mt_visible.length = 0;
    this.mt_visible.push(...hits);

    // The bind list is rebuilt every roundtrip and display() only ran on the
    // first one, so the binding has to be re-registered for the filtered
    // rows to reach the response model.
    this.client._bind_edit(this.mt_visible);
    this.client.popup_model_update();
  }

  async main(client) {
    this.client = client;

    if (client.check_on_init()) {
      this.display();
      return;
    }

    switch (client.get_event()) {
      case `CONFIRM`:
        this.on_event_confirm();
        break;
      case `SEARCH`:
        this.on_event_search();
        break;
      case `CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
    }
  }
}

module.exports = z2ui5_cl_ui5_app_select;
