const z2ui5_if_app = require("../z2ui5_if_app");
const z2ui5_cl_xml_view = require("../z2ui5_cl_xml_view");

/**
 * Selection-list popup — port of abap2UI5 z2ui5_cl_pop_to_select.
 *
 * Usage:
 *   client.nav_app_call(z2ui5_cl_pop_to_select.factory({
 *     i_tab:        [{ KEY: `C001`, TEXT: `Acme` }, ...],
 *     i_title:      `Choose customer`,
 *     i_multiselect: false,
 *   }));
 *
 * Caller (next roundtrip, check_on_navigated):
 *   const r = client.get_app_prev().result();
 *   if (r.check_confirmed) { use r.row | r.table }
 */
class z2ui5_cl_pop_to_select extends z2ui5_if_app {

  // ms_result: { row, table, check_confirmed }
  ms_result           = { row: null, table: [], check_confirmed: false };
  mr_tab              = [];
  mr_tab_popup        = [];
  mr_tab_popup_backup = [];

  client            = null;
  title             = ``;
  sort_field        = ``;
  content_width     = ``;
  content_height    = ``;
  growing_threshold = ``;
  descending        = false;
  multiselect       = false;
  event_confirmed   = ``;
  event_canceled    = ``;

  static factory({
    i_tab              = [],
    i_title            = ``,
    i_sort_field       = ``,
    i_descending       = false,
    i_contentwidth     = ``,
    i_contentheight    = ``,
    i_growingthreshold = ``,
    i_multiselect      = false,
    i_event_canceled   = ``,
    i_event_confirmed  = ``,
  } = {}) {
    const r_result = new z2ui5_cl_pop_to_select();
    r_result.title = i_title || (i_multiselect ? `Multi Select` : `Single Select`);
    r_result.sort_field        = i_sort_field;
    r_result.descending        = i_descending;
    r_result.content_height    = i_contentheight;
    r_result.content_width     = i_contentwidth;
    r_result.growing_threshold = i_growingthreshold;
    r_result.multiselect       = i_multiselect;
    r_result.event_confirmed   = i_event_confirmed;
    r_result.event_canceled    = i_event_canceled;
    r_result.mr_tab            = JSON.parse(JSON.stringify(i_tab));
    return r_result;
  }

  result() {
    return this.ms_result;
  }

  set_output_table() {
    // Mirror abap: copy mr_tab into mr_tab_popup with extra ZZSELKZ flag.
    this.mr_tab_popup = this.mr_tab.map((row) => ({ ...row, ZZSELKZ: false }));
    this.mr_tab_popup_backup = this.mr_tab_popup.map((r) => ({ ...r }));
  }

  display() {
    const popup = z2ui5_cl_xml_view.factory_popup();

    // Mirror abap items binding: when sort_field is set, wrap path + sorter into
    // a complex binding expression. Plain `_bind_edit(...)` otherwise.
    let itemsBind;
    if (this.sort_field) {
      const rawPath = this.client._bind_edit(this.mr_tab_popup, { path: true });
      itemsBind = `{path:'${rawPath}', sorter:{path:'${String(this.sort_field).toUpperCase()}', descending:${!!this.descending}}}`;
    } else {
      itemsBind = this.client._bind_edit(this.mr_tab_popup);
    }

    const tab = popup.TableSelectDialog({
      items:            itemsBind,
      cancel:           this.client._event(`CANCEL`),
      search:           this.client._event(`SEARCH`, [`\${$parameters>/value}`, `\${$parameters>/clearButtonPressed}`]),
      confirm:          this.client._event(`CONFIRM`, [`\${$parameters>/selectedContexts[0]/sPath}`]),
      growing:          true,
      contentWidth:     this.content_width,
      contentHeight:    this.content_height,
      growingThreshold: this.growing_threshold,
      title:            this.title,
      multiSelect:      this.multiselect,
    });

    // Discover columns from first row (excluding ZZSELKZ).
    const sample = this.mr_tab_popup[0] || this.mr_tab[0] || {};
    const cols   = Object.keys(sample).filter((k) => k !== `ZZSELKZ`);

    const list = tab.ColumnListItem({
      vAlign:   `Top`,
      selected: `{ZZSELKZ}`,
    });
    const cells = list.cells();
    for (const c of cols) cells.Text({ text: `{${c}}` });

    const columns = tab.columns();
    for (const c of cols) columns.Column({ width: `8rem` }).header().Text({ text: c });

    this.client.popup_display(popup.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `CONFIRM`:
        this.ms_result.check_confirmed = true;
        this.on_event_confirm();
        break;
      case `CANCEL`:
        this.client.popup_destroy();
        this.client.nav_app_leave();
        this.client.follow_up_action(this.client._event(this.event_canceled));
        break;
      case `SEARCH`:
        this.on_event_search();
        break;
    }
  }

  on_event_confirm() {
    this.ms_result.table = [];

    // Mirrors abap: walk mr_tab_popup, pick rows where ZZSELKZ=true. For
    // multi-select the user-toggled checkboxes are two-way-bound and arrive
    // as ZZSELKZ=true via the XX delta. For single-select TableSelectDialog
    // auto-confirms on row tap WITHOUT setting ZZSELKZ — fall back to parsing
    // the selectedContext sPath from the event arg.
    for (const row of this.mr_tab_popup) {
      if (!row.ZZSELKZ) continue;
      const { ZZSELKZ, ...clean } = row;
      this.ms_result.table.push(clean);
      if (!this.ms_result.row) this.ms_result.row = clean;
      if (!this.multiselect) break;
    }

    if (!this.multiselect && this.ms_result.table.length === 0) {
      const sPath = String(this.client.get().get_event_arg(0) || ``);
      const m = sPath.match(/\/(\d+)\s*$/);
      if (m) {
        const row = this.mr_tab_popup[+m[1]];
        if (row) {
          const { ZZSELKZ, ...clean } = row;
          this.ms_result.row = clean;
          this.ms_result.table.push(clean);
        }
      }
    }

    this.client.popup_destroy();
    this.client.nav_app_leave();
    // Mirror abap: forward the result table as r_data on the follow-up event,
    // and fire follow_up_action unconditionally (abap calls it with empty
    // event-name, which is a no-op on the wire).
    this.client.follow_up_action(
      this.client._event(this.event_confirmed, [], {}, this.ms_result.table)
    );
  }

  on_event_search() {
    const arg = String(this.client.get().get_event_arg(0) || ``).toUpperCase();
    // Filter in place — keep the same array reference so the binding registered
    // by display() still resolves to the same model path. Splicing avoids
    // creating a new array (which would change reference equality and break
    // the auto-discover lookup in srv_bind).
    // Shallow-copy each match so mr_tab_popup and mr_tab_popup_backup don't
    // share row refs — otherwise the DB serializer's cycle-detection WeakSet
    // would see the row in mr_tab_popup first and emit `null` when it hits
    // the same ref again in mr_tab_popup_backup.
    const filtered = this.mr_tab_popup_backup
      .filter((row) => {
        for (const k of Object.keys(row)) {
          if (String(row[k] ?? ``).toUpperCase().includes(arg)) return true;
        }
        return false;
      })
      .map((row) => ({ ...row }));
    this.mr_tab_popup.length = 0;
    this.mr_tab_popup.push(...filtered);

    // The aBind list is rebuilt from scratch each roundtrip; display() only
    // ran on the initial popup roundtrip, so we must re-register the binding
    // here to make the filtered array land in the response MODEL.
    this.client._bind_edit(this.mr_tab_popup);
    this.client.popup_model_update();
  }

  async main(client) {

    this.client = client;

    if (client.check_on_init()) {
      this.set_output_table();
      this.display();
      return;
    }

    this.on_event();

  }
}

module.exports = z2ui5_cl_pop_to_select;
