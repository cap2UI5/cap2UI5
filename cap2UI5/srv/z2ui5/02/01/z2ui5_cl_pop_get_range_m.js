const z2ui5_cl_abap2ui5_context = require("abap2UI5/z2ui5_cl_abap2ui5_context");
const z2ui5_cl_pop_get_range = require("abap2UI5/z2ui5_cl_pop_get_range");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_pop_get_range_m extends z2ui5_if_app {
  ms_result = {};
  client = null;
  mv_popup_name = ``;

  static factory({ val } = {}) {
    let r_result = null;
    r_result = new z2ui5_cl_pop_get_range_m();
    r_result.ms_result.t_filter = z2ui5_cl_util.abap_copy(val);
    return r_result;
  }

  init() {
    this.popup_display();
  }

  popup_display() {
    let lo_popup = z2ui5_cl_xml_view.factory_popup();
    lo_popup = lo_popup.dialog({ afterclose: this.client._event(`BUTTON_CANCEL`), contentheight: `50%`, contentwidth: `50%`, title: `Define Filter Conditions` });
    const vbox = lo_popup.vbox({ height: `100%`, justifycontent: `SpaceBetween` });
    const item = vbox.list({ nodata: `No conditions defined`, items: this.client._bind(this.ms_result.t_filter, { name: `ms_result-t_filter` }) })
      .custom_list_item();
    const grid = item.grid({ class: `sapUiSmallMarginTop sapUiSmallMarginBottom sapUiSmallMarginBegin` });
    grid.text(`{NAME}`);
    grid.multi_input({ tokens: `{T_TOKEN}`, enabled: false, valuehelprequest: this.client._event(`LIST_OPEN`, [`\${NAME}`]) })
      .tokens()
      .token({ key: `{KEY}`, text: `{TEXT}`, visible: `{VISIBLE}`, selected: `{SELKZ}`, editable: `{EDITABLE}` });
    grid.button({ text: `Select`, press: this.client._event(`LIST_OPEN`, [`\${NAME}`]) });
    grid.button({ icon: `sap-icon://delete`, type: `Transparent`, text: `Clear`, press: this.client._event(`LIST_DELETE`, [`\${NAME}`]) });
    lo_popup.buttons()
      .button({ text: `Clear All`, icon: `sap-icon://delete`, type: `Transparent`, press: this.client._event(`POPUP_DELETE_ALL`) })
      .button({ text: `Cancel`, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: `OK`, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` });
    this.client.popup_display(lo_popup.stringify());
  }

  result() {
    let result = {};
    result = z2ui5_cl_util.abap_copy(this.ms_result);
    return result;
  }

  async main(client) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    let lo_popup;
    let ls_popup_result;
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.init();
      return;
    }
    const ls_get = client.get();
    if ((ls_get.CHECK_ON_NAVIGATED === true || ls_get.CHECK_ON_NAVIGATED === `X`)) {
      lo_popup = (client.get_app_prev());
      ls_popup_result = lo_popup.result();
      if ((ls_popup_result.check_confirmed === true || ls_popup_result.check_confirmed === `X`)) {
        fs_tab = this.ms_result.t_filter.find((row) => row.name === this.mv_popup_name);
        _fs$fs_tab = null;
        sy_subrc = 0;
        fs_tab.t_range = z2ui5_cl_util.abap_copy(ls_popup_result.t_range);
        fs_tab.t_token = z2ui5_cl_abap2ui5_context.filter_get_token_t_by_range_t(fs_tab.t_range);
      }
      this.popup_display();
    }
    switch (ls_get.EVENT) {
      case `LIST_DELETE`:
        fs_tab = this.ms_result.t_filter.find((row) => row.name === client.get_event_arg(1));
        _fs$fs_tab = null;
        sy_subrc = 0;
        fs_tab.t_token = null;
        fs_tab.t_range = null;
        client.popup_model_update();
        break;
      case `LIST_OPEN`:
        this.mv_popup_name = client.get_event_arg(1);
        client.nav_app_call(z2ui5_cl_pop_get_range.factory(this.ms_result.t_filter.find((row) => row.name === this.mv_popup_name).t_range));
        break;
      case `BUTTON_CONFIRM`:
        this.ms_result.check_confirmed = true;
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `BUTTON_CANCEL`:
        client.popup_destroy();
        client.nav_app_leave();
        break;
      case `POPUP_DELETE_ALL`:
        sy_tabix = 0;
        for (const lr_filter of this.ms_result.t_filter) {
          sy_tabix++;
          lr_filter.t_range = null;
          lr_filter.t_token = null;
        }
        client.popup_model_update();
        break;
    }
  }
}

// abap PREFERRED PARAMETER call style — see z2ui5_pop_preferred_param.js
require("./z2ui5_pop_preferred_param")(z2ui5_cl_pop_get_range_m, {
  factory: { preferred: `val`, params: [`val`] },
});

module.exports = z2ui5_cl_pop_get_range_m;
