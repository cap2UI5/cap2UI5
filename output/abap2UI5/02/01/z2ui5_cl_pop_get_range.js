const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_get_range extends z2ui5_if_app {
  mt_filter = [];
  ms_result = {};
  mt_mapping = [];
  client = null;

  static factory({ t_range } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_get_range();
    z2ui5_cl_util.itab_corresponding({ val: t_range, tab: r_result.ms_result.t_range });
    r_result.ms_result.t_range.push({});
    return r_result;
  }

  result() {
    let result = {};
    result = this.ms_result;
    return result;
  }

  view_display() {
    let lo_popup = z2ui5_cl_xml_view.factory_popup();
    lo_popup = lo_popup.dialog({ afterclose: this.client._event(`BUTTON_CANCEL`), contentheight: `50%`, contentwidth: `50%`, title: `Define Filter Conditions` });
    const vbox = lo_popup.vbox({ height: `100%`, justifycontent: `SpaceBetween` });
    const item = vbox.list({ nodata: `No conditions defined`, items: this.client._bind_edit(this.mt_filter) })
      .custom_list_item();
    const grid = item.grid();
    grid.combobox({ selectedkey: `{OPTION}`, items: this.client._bind(this.mt_mapping) })
      .item({ key: `{N}`, text: `{N}` })
      .get_parent()
      .input({ value: `{LOW}`, submit: this.client._event(`BUTTON_CONFIRM`) })
      .input({ value: `{HIGH}`, visible: `{= \${OPTION} === 'BT' }`, submit: this.client._event(`BUTTON_CONFIRM`) })
      .button({ icon: `sap-icon://decline`, type: `Transparent`, press: this.client._event(`POPUP_DELETE`, [`\${KEY}`]) });
    lo_popup.buttons()
      .button({ text: `Delete All`, icon: `sap-icon://delete`, type: `Transparent`, press: this.client._event(`POPUP_DELETE_ALL`) })
      .button({ text: `Add Item`, icon: `sap-icon://add`, press: this.client._event(`POPUP_ADD`) })
      .button({ text: `Cancel`, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: `OK`, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(lo_popup.stringify());
  }

  async main(client) {
    let sy_tabix = 0;
    this.client = client;
    if (client.check_on_init()) {
      this.mt_mapping = z2ui5_cl_util.filter_get_token_range_mapping();
      this.mt_filter = [];
      sy_tabix = 0;
      for (const lr_range of this.ms_result.t_range) {
        sy_tabix++;
        this.mt_filter.push({ low: lr_range.low, high: lr_range.high, option: lr_range.option, key: z2ui5_cl_util.uuid_get_c32() });
      }
      this.view_display();
      return;
    }
    switch (client.get().EVENT) {
      case `BUTTON_CONFIRM`:
        this.ms_result.t_range = {};
        sy_tabix = 0;
        for (const lr_filter of this.mt_filter) {
          sy_tabix++;
          if (!lr_filter.low && !lr_filter.high) {
            continue;
          }
          this.ms_result.t_range.push({ sign: `I`, option: lr_filter.option, low: lr_filter.low, high: lr_filter.high });
        }
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `POPUP_ADD`:
        this.mt_filter.push({ key: z2ui5_cl_util.uuid_get_c32() });
        client.popup_model_update();
        break;
      case `POPUP_DELETE`:
        for (let _i = this.mt_filter.length - 1; _i >= 0; _i--) { const row = this.mt_filter[_i]; if (row.key === client.get_event_arg(1)) this.mt_filter.splice(_i, 1); }
        client.popup_model_update();
        break;
      case `POPUP_DELETE_ALL`:
        this.mt_filter = [];
        client.popup_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_pop_get_range;
