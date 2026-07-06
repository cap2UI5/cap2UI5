const z2ui5_cl_pop_get_range = require("abap2UI5/z2ui5_cl_pop_get_range");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_056 extends z2ui5_if_app {
  mt_table = [];
  mt_token = [];
  mt_tokens_added = [];
  mt_tokens_removed = [];
  client = null;
  mt_range = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_START`:
        this.set_data();
        this.client.view_model_update();
        break;
      case `UPDATE_TOKENS`:
        let sy_tabix = 0;
        for (const ls_token of this.mt_tokens_removed) {
          sy_tabix++;
          for (let _i = this.mt_token.length - 1; _i >= 0; _i--) { const row = this.mt_token[_i]; if (row.key === ls_token.key) this.mt_token.splice(_i, 1); }
        }
        let sy_tabix = 0;
        for (const ls_token of this.mt_tokens_added) {
          sy_tabix++;
          this.mt_token.push({ key: ls_token.key, text: ls_token.text, visible: true, editable: true });
        }
        this.mt_tokens_removed = {};
        this.mt_tokens_added = {};
        this.mt_range = z2ui5_cl_util.filter_get_range_t_by_token_t(this.mt_token);
        this.set_data();
        this.client.view_model_update();
        break;
      case `FILTER_VALUE_HELP`:
        this.client.nav_app_call(z2ui5_cl_pop_get_range.factory(this.mt_range));
        break;
    }
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `sofa`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `computer`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `oven`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }];
    for (let _i = this.mt_table.length - 1; _i >= 0; _i--) { const row = this.mt_table[_i]; if (product ! IN this.mt_range) this.mt_table.splice(_i, 1); }
  }

  view_display() {
    let view = z2ui5_cl_xml_view.factory();
    view = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Select-Options`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .get_parent();
    const vbox = view.vbox();
    vbox._z2ui5()
      .multiinput_ext({ addedtokens: this.client._bind_edit(this.mt_tokens_added), removedtokens: this.client._bind_edit(this.mt_tokens_removed), change: this.client._event(`UPDATE_TOKENS`), multiinputid: `MultiInput` });
    const tab = vbox.table(this.client._bind(this.mt_table))
      .header_toolbar()
      .overflow_toolbar()
      .text(`Product:`)
      .multi_input({ width: `30%`, id: `MultiInput`, tokens: this.client._bind(this.mt_token), showclearicon: true, valuehelprequest: this.client._event(`FILTER_VALUE_HELP`) })
      .item({ key: `{KEY}`, text: `{TEXT}` })
      .tokens()
      .token({ key: `{KEY}`, text: `{TEXT}`, visible: `{VISIBLE}`, selected: `{SELKZ}`, editable: `{EDITABLE}` })
      .get_parent()
      .get_parent()
      .toolbar_spacer()
      .button({ text: `Go`, press: this.client._event(`BUTTON_START`), type: `Emphasized` })
      .get_parent()
      .get_parent();
    const lo_columns = tab.columns();
    lo_columns.column().text(`Product`);
    lo_columns.column().text(`Date`);
    lo_columns.column().text(`Name`);
    lo_columns.column().text(`Location`);
    lo_columns.column().text(`Quantity`);
    const lo_cells = tab.items().column_list_item();
    lo_cells.text(`{PRODUCT}`);
    lo_cells.text(`{CREATE_DATE}`);
    lo_cells.text(`{CREATE_BY}`);
    lo_cells.text(`{STORAGE_LOCATION}`);
    lo_cells.text(`{QUANTITY}`);
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
    if (client.get().CHECK_ON_NAVIGATED === true) {
      try {
        const lo_value_help = (client.get_app(client.get().S_DRAFT.ID_PREV_APP));
        if (lo_value_help.result().check_confirmed === false) {
          return;
        }
        this.mt_range = lo_value_help.result().t_range;
        this.mt_token = z2ui5_cl_util.filter_get_token_t_by_range_t(this.mt_range);
        this.set_data();
        client.view_model_update();
      } catch (error) {
      }
      return;
    }
    if ((client.get().EVENT)) {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_056;
