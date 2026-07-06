const z2ui5_if_app      = require("../z2ui5_if_app");
const z2ui5_cl_xml_view = require("../z2ui5_cl_xml_view");

/**
 * z2ui5_cl_pop_table — JS port of abap2UI5 z2ui5_cl_pop_table.
 *
 * Modal table-selector. Generic display of an array of records — one column
 * per key, "OK" / cancel buttons. Caller reads the selected row via
 * `result()` after the popup leaves.
 *
 * Usage:
 *   const pop = z2ui5_cl_pop_table.factory({ i_tab: rows, i_title: 'Pick' });
 *   client.nav_app_call(pop);
 *   // ...later, in the caller's main on_navigated:
 *   const r = pop.result();
 *   if (r.check_confirmed) { ... r.row ... }
 *
 * Mirror notes: ABAP uses RTTI to derive column headers from DDIC field
 * labels. JS uses the keys of the first row as headers. The JS port also
 * tracks the selected row via UI5 ColumnListItem.press → ROW_SELECTED event.
 */
class z2ui5_cl_pop_table extends z2ui5_if_app {

  client = null;
  title  = `Table View`;
  mr_tab = [];
  ms_result = { row: null, check_confirmed: false };

  static factory({ i_tab = [], i_title = `` } = {}) {
    const r_result = new z2ui5_cl_pop_table();
    if (i_title) r_result.title = i_title;
    r_result.mr_tab = Array.isArray(i_tab) ? i_tab.slice() : [];
    return r_result;
  }

  display() {
    const cols = this.mr_tab.length > 0 ? Object.keys(this.mr_tab[0]) : [];
    const c = this.client;

    const popup = z2ui5_cl_xml_view.factory_popup()
      .Dialog({
        title:      this.title,
        afterClose: c._event(`CANCEL`),
        stretch:    true,
      })
      .content();

    const tab = popup.Table({ items: c._bind(this.mr_tab) });

    const list = tab.ColumnListItem({
      type:  `Active`,
      press: c._event(`ROW_SELECTED`),
    });
    const cells = list.cells();
    for (const col of cols) {
      cells.Text({ text: `{${col}}` });
    }

    const columns = tab.columns();
    for (const col of cols) {
      columns.Column({ width: `8rem` })
        .header()
        .Text({ text: col })
        .get_parent();
    }

    popup.get_parent()
      .buttons()
        .Button({
          text:  `OK`,
          press: c._event(`BUTTON_CONFIRM`),
          type:  `Emphasized`,
        });

    c.popup_display(popup.stringify());
  }

  on_event() {
    const c = this.client;
    const event = c.get().EVENT;
    switch (event) {
      case `BUTTON_CONFIRM`:
        this.ms_result.check_confirmed = true;
        this.on_event_confirm();
        break;
      case `CANCEL`:
        c.popup_destroy();
        c.nav_app_leave();
        break;
      case `ROW_SELECTED`: {
        // Frontend press callback delivers the path of the bound row in T_EVENT_ARG[0].
        // For a table at "/__bind_N", press on row idx → arg = "/__bind_N/idx".
        const path = c.get().T_EVENT_ARG?.[0] || ``;
        const m = path.match(/\/(\d+)$/);
        if (m) {
          const idx = Number(m[1]);
          if (this.mr_tab[idx]) this.ms_result.row = this.mr_tab[idx];
        }
        break;
      }
    }
  }

  on_event_confirm() {
    this.client.popup_destroy();
    this.client.nav_app_leave();
  }

  result() {
    return this.ms_result;
  }

  async main(client) {
    this.client = client;

    if (client.check_on_init()) {
      this.display();
      return;
    }

    this.on_event();
  }
}

module.exports = z2ui5_cl_pop_table;
