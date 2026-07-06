const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_083 extends z2ui5_if_app {
  mt_01 = [];
  mt_02 = [];
  mt_02_display = [];
  mt_tab_02_input = [];
  mt_filter = [];
  mv_value = ``;
  mv_value2 = ``;
  mt_token = [];
  mt_mapping = [];
  ms_filter = {};
  mv_name = ``;
  mt_table = null;
  client = null;
  mt_cols = [];

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let ls_range = null;
    switch (this.client.get().EVENT) {
      case `BUTTON_POST`:
        // TODO(abap2js): CREATE DATA mt_table TYPE (mv_name).
        this.view_display_main();
        break;
      case `FILTER_UPDATE`:
        if (this.mv_value) {
          ls_range = z2ui5_cl_util.filter_get_range_by_token(this.mv_value);
          this.ms_filter.product.push(ls_range);
        }
        break;
      case `FILTER_VALUE_HELP_OK`:
        this.ms_filter.product = {};
        let sy_tabix = 0;
        for (const lr_filter of this.mt_filter) {
          sy_tabix++;
          this.ms_filter.product.push({ sign: `I`, option: lr_filter.option, low: lr_filter.low, high: lr_filter.high });
        }
        this.client.popup_destroy();
        break;
      case `POPUP_ADD`:
        this.mt_filter.push({ key: z2ui5_cl_util.uuid_get_c32() });
        this.client.popup_model_update();
        break;
      case `POPUP_DELETE`:
        const lt_item = this.client.get().T_EVENT_ARG;
        for (let _i = this.mt_filter.length - 1; _i >= 0; _i--) { const row = this.mt_filter[_i]; if (row.key === lt_item[(1) - 1]) this.mt_filter.splice(_i, 1); }
        this.client.popup_model_update();
        break;
      case `POPUP_DELETE_ALL`:
        this.mt_filter = {};
        this.client.popup_model_update();
        break;
      case `FILTER_VALUE_HELP`:
        this.popover_display_filter();
        this.mt_filter = {};
        let sy_tabix = 0;
        for (const lr_product of this.ms_filter.product) {
          sy_tabix++;
          this.mt_filter.push({ low: lr_product.low, high: lr_product.high, option: lr_product.option, key: z2ui5_cl_util.uuid_get_c32() });
        }
        break;
    }
  }

  on_init() {
    this.mt_01 = [{ screen_name: `screen_01` }, { screen_name: `screen_02` }];
    this.mt_02 = [{ screen_name: `screen_01`, field_doma: `CHAR30`, field: `MATNR` }, { screen_name: `screen_01`, field_doma: `STRING`, field: `LGNUM` }, { screen_name: `screen_02`, field_doma: `PRODUCT`, field: `PRODUCT` }];
    this.mv_name = `screen_01`;
    this.view_display_main();
    this.mt_mapping = [{ n: `EQ`, v: `={LOW}` }, { n: `LT`, v: `<{LOW}` }, { n: `LE`, v: `<={LOW}` }, { n: `GT`, v: `>{LOW}` }, { n: `GE`, v: `>={LOW}` }, { n: `CP`, v: `*{LOW}*` }, { n: `BT`, v: `{LOW}...{HIGH}` }, { n: `NE`, v: `!(={LOW})` }, { n: `NE`, v: `!(<leer>)` }, { n: `<leer>`, v: `<leer>` }];
  }

  view_display_main() {
    let view = z2ui5_cl_xml_view.factory();
    view = view.page({ id: `page_main`, title: `abap2UI5 - Select-Options`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const page = view.dynamic_page({ headerexpanded: true, headerpinned: true });
    const header_title = page.title({ ns: `f` }).get().dynamic_page_title();
    header_title.heading(`f`).hbox().title(`Select-Option`);
    header_title.expanded_content(`f`);
    header_title.snapped_content(`f`);
    const lo_box = page.header()
      .dynamic_page_header(true)
      .flex_box({ alignitems: `Start`, justifycontent: `SpaceBetween` })
      .flex_box({ alignitems: `Start` });
    let vbox = lo_box.vbox();
    vbox.simple_form({ editable: true }).content(`form`).title(`Table`).label(`Name`);
    vbox.input(this.client._bind_edit(this.mv_name));
    vbox.button({ text: `read`, press: this.client._event(`BUTTON_POST`) });
    vbox = lo_box.vbox();
    if (this.mt_02) {
      this.mt_02_display = this.mt_02;
      for (let _i = this.mt_02_display.length - 1; _i >= 0; _i--) { const row = this.mt_02_display[_i]; if (row.screen_name !== this.mv_name) this.mt_02_display.splice(_i, 1); }
      this.mt_tab_02_input = /* TODO(abap2js): VALUE FOR/BASE */ [];
      let sy_tabix = 0;
      for (const lr_tab of this.mt_02_display) {
        sy_tabix++;
        this.mt_tab_02_input.push({ name: lr_tab.field });
      }
      vbox.list({ items: this.client._bind(this.mt_tab_02_input), headertext: `Filter` })
        .custom_list_item()
        .hbox()
        .text(`{NAME}`)
        .multi_input({ tokens: this.client._bind(this.mt_token), showclearicon: true, value: `{VALUE}`, tokenupdate: this.client._event(`FILTER_UPDATE1`), submit: this.client._event(`FILTER_UPDATE`), id: `FILTER`, valuehelprequest: this.client._event(`FILTER_VALUE_HELP`) })
        .item({ key: `{KEY}`, text: `{TEXT}` })
        .tokens()
        .token({ key: `{KEY}`, text: `{TEXT}`, visible: `{VISIBLE}`, selected: `{SELKZ}`, editable: `{EDITABLE}` });
    }
    this.client.view_display(page.stringify());
  }

  popover_display_filter() {
    let lo_popup = z2ui5_cl_xml_view.factory_popup();
    lo_popup = lo_popup.dialog({ contentheight: `50%`, contentwidth: `50%`, title: `Define Conditons - Product` });
    const vbox = lo_popup.vbox({ height: `100%`, justifycontent: `SpaceBetween` });
    const pan = vbox.panel({ expandable: false, expanded: true, headertext: `Product` });
    const item = pan.list({ nodata: `no conditions defined`, items: this.client._bind_edit(this.mt_filter), selectionchange: this.client._event(`SELCHANGE`) })
      .custom_list_item();
    const grid = item.grid();
    grid.combobox({ selectedkey: `{OPTION}`, items: this.client._bind_edit(this.mt_mapping) })
      .item({ key: `{N}`, text: `{N}` })
      .get_parent()
      .input(`{LOW}`)
      .input({ value: `{HIGH}`, visible: `{= ${OPTION} === 'BT' }` })
      .button({ icon: `sap-icon://decline`, type: `Transparent`, press: this.client._event(`POPUP_DELETE`, [`${KEY}`]) });
    lo_popup.footer()
      .overflow_toolbar()
      .button({ text: `Delete All`, icon: `sap-icon://delete`, type: `Transparent`, press: this.client._event(`POPUP_DELETE_ALL`) })
      .button({ text: `Add Item`, icon: `sap-icon://add`, press: this.client._event(`POPUP_ADD`) })
      .toolbar_spacer()
      .button({ text: `OK`, press: this.client._event(`FILTER_VALUE_HELP_OK`), type: `Emphasized` })
      .button({ text: `Cancel`, press: this.client._event(`FILTER_VALUE_HELP_CANCEL`) });
    this.client.popup_display(lo_popup.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_083;
