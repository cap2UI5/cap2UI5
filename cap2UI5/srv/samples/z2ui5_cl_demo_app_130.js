const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_130 extends z2ui5_if_app {
  mt_filter = [];
  mt_mapping = [];
  mt_screens = [];
  mt_variants = [];
  mt_variants_pop = [];
  mv_activ_elemnt = ``;
  mv_screen = ``;
  mv_button_active = false;
  mv_description = ``;
  mv_screen_descr = ``;
  mv_variant = ``;
  mv_description_copy = ``;
  mv_variant_copy = ``;
  mo_parent_view = null;
  client = null;
  mt_fields = [];

  get_fields() {
    let sy_tabix = 0;
    const db_fields = [{ screen_name: `INV`, field: `LGNUM`, field_doma: `/SCWM/LGNUM` }, { screen_name: `LAGP`, field: `LGNUM`, field_doma: `/SCWM/LGNUM` }, { screen_name: `LAGP`, field: `LGPLA`, field_doma: `/SCWM/DE_LGPLA` }, { screen_name: `LAGP`, field: `LGTYP`, field_doma: `/SCWM/DE_LGTYP` }, { screen_name: `QUAN`, field: `LGNUM`, field_doma: `/SCWM/LGNUM` }, { screen_name: `QUAN`, field: `LGPLA`, field_doma: `/SCWM/DE_LGPLA` }, { screen_name: `QUAN`, field: `MATNR`, field_doma: `/SCWM/DE_MATNR` }, { screen_name: `QUAN`, field: `OWNER`, field_doma: `/SCWM/DE_OWNER` }, { screen_name: `TO`, field: `LGNUM`, field_doma: `/SCWM/LGNUM` }, { screen_name: `TO`, field: `MATNR`, field_doma: `/SCWM/DE_MATNR` }, { screen_name: `TO`, field: `PROCTY`, field_doma: `/SCWM/DE_PROCTY` }, { screen_name: `TO`, field: `TOSTAT`, field_doma: `/SCWM/DE_TOSTAT` }, { screen_name: `TO`, field: `VLPLA`, field_doma: `/SCWM/LTAP_VLPLA` }];
    this.mt_fields = {};
    sy_tabix = 0;
    for (const lr_fields of db_fields) {
      sy_tabix++;
      if (!(lr_fields.screen_name === this.mv_screen)) continue;
      const field = {};
      this.mt_fields.push(field);
      field = ({ ...lr_fields });
    }
  }

  get_txt({ roll, string } = {}) {
    let result = ``;
    result = `Text`;
    return result;
  }

  get_txt_l({ roll } = {}) {
    let result = ``;
    result = `Text`;
    return result;
  }

  get_values() {
    let sy_tabix = 0;
    let filter;
    const l_variants = [{ screen_name: `QUAN`, var: `E001 - ALL`, descr: `123` }, { screen_name: `TO`, var: `E001`, descr: `123` }, { screen_name: `TO`, var: `E001 - All`, descr: `123` }];
    let var_ = [];
    let var_val = [];
    sy_tabix = 0;
    for (const a of l_variants) {
      sy_tabix++;
      if (!(a.screen_name === this.mv_screen && var_ === this.mv_variant)) continue;
      var_.push(a);
      this.mv_description = z2ui5_cl_util.abap_copy(a.descr);
    }
    const var_vall_all = [{ screen_name: `LTAP`, var: `E001 - All`, field: `LGNUM`, guid: `663192E9D70C1EEE8CC06B0F98CD81A3`, sign: `I`, opt: `EQ` }, { screen_name: `LTAP`, var: `E001 - All`, field: `MATNR`, guid: `663192E9D70C1EEE8CD4E9389CB11403`, sign: `I`, opt: `EQ` }, { screen_name: `LTAP`, var: `E001 - All`, field: `TOSTAT`, guid: `663192E9D70C1EEE8CC06BC66AD581A3`, sign: `I`, opt: `NE` }, { screen_name: `LTAP`, var: `E002 - All`, field: `LGNUM`, guid: `663192E9D70C1EEE8CC06B0F98CD81A3`, sign: `I`, opt: `EQ` }, { screen_name: `LTAP`, var: `E002 - All`, field: `MATNR`, guid: `663192E9D70C1EEE8CD4E9389CB11403`, sign: `I`, opt: `EQ` }, { screen_name: `LTAP`, var: `E002 - All`, field: `TOSTAT`, guid: `663192E9D70C1EEE8CC06BC66AD581A3`, sign: `I`, opt: `NE` }, { screen_name: `QUAN`, var: `E001 - ALL`, field: `LGNUM`, guid: `663192E9D70C1EEE90CEE2FA658C51EE`, sign: `I`, opt: `EQ` }, { screen_name: `QUAN`, var: `E001 - ALL`, field: `LGPLA`, guid: `663192E9D70C1EEE90CEEF4750FD91EE`, sign: `I`, opt: `EQ` }, { screen_name: `TO`, var: `E001 `, field: `LGNUM`, guid: `663192E9D70C1EEE8E87DE5FF8CC512A`, sign: `I`, opt: `EQ` }, { screen_name: `TO`, var: `E001 `, field: `PROCTY`, guid: `663192E9D70C1EEE8E87DD8D1EB8C7F5`, sign: `I`, opt: `EQ` }, { screen_name: `TO`, var: `E001 - All`, field: `LGNUM`, guid: `663192E9D70C1EEE8E86552847635198`, sign: `I`, opt: `EQ` }];
    sy_tabix = 0;
    for (const b of var_vall_all) {
      sy_tabix++;
      if (!(b.screen_name === this.mv_screen && var_ === this.mv_variant)) continue;
      var_val.push(b);
    }
    sy_tabix = 0;
    for (const field of this.mt_fields) {
      sy_tabix++;
      field.t_filter = {};
      field.t_token = {};
      const _sy_tabix_1 = sy_tabix;
      sy_tabix = 0;
      for (const val of var_val) {
        sy_tabix++;
        if (!(field === field.field)) continue;
        filter = { key: val.guid, option: val.opt, low: val.low, high: val.high };
        field.t_filter.push(filter);
        this.set_token({ field: { field } });
      }
      sy_tabix = _sy_tabix_1;
    }
  }

  get_variants() {
    this.mt_variants = [{ screen_name: `QUAN`, var: `E001 - ALL`, descr: `123` }, { screen_name: `TO`, var: `E001`, descr: `123` }, { screen_name: `TO`, var: `E001 - All`, descr: `123` }];
  }

  on_init() {
    this.mt_screens = [{ screen_name: `INV`, descr: `123` }, { screen_name: `LAGP`, descr: `123` }, { screen_name: `PO`, descr: `123` }, { screen_name: `QUAN`, descr: `123` }, { screen_name: `TO`, descr: `123` }];
    this.view_display();
    this.mt_mapping = [{ n: `EQ`, v: `={LOW}` }, { n: `LT`, v: `<{LOW}` }, { n: `LE`, v: `<={LOW}` }, { n: `GT`, v: `>{LOW}` }, { n: `GE`, v: `>={LOW}` }, { n: `CP`, v: `*{LOW}*` }, { n: `BT`, v: `{LOW}...{HIGH}` }, { n: `NE`, v: `!(={LOW})` }, { n: `<leer>`, v: `<leer>` }];
  }

  popup_copy_save() {
    this.mv_variant = z2ui5_cl_util.abap_copy(this.mv_variant_copy);
    this.mv_description = z2ui5_cl_util.abap_copy(this.mv_description_copy);
  }

  popup_filter_ok() {
    let sy_subrc = 0;
    let lr_field = {};
    {
      const _t = this.mt_fields;
      const _i = _t.findIndex((_r) => _r.field === this.mv_activ_elemnt);
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      if (sy_subrc === 0) lr_field = _t[_i];
    }
    if (sy_subrc === 0) {
      for (let _i = this.mt_filter.length - 1; _i >= 0; _i--) { const row = this.mt_filter[_i]; if (!row.option) this.mt_filter.splice(_i, 1); }
      lr_field.t_filter = z2ui5_cl_util.abap_copy(this.mt_filter);
      lr_field.t_token = {};
      this.set_token({ field: { field: lr_field } });
      this.client.popup_destroy();
      this.view_display();
    }
  }

  view_display() {
    let sy_tabix = 0;
    let view;
    let page;
    let lv_tabix;
    let scrtext;
    if (!this.mo_parent_view) {
      view = z2ui5_cl_xml_view.factory();
      page = z2ui5_cl_xml_view.factory()
        .shell()
        .page({ title: this.get_txt({ roll: `/SCWM/DE_TW_COND_CHECK_SELECT` }), navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    } else {
      page = this.mo_parent_view.get(`Page`);
    }
    page.header_content().get_parent();
    const grid = page.grid(`L6 M12 S12`).content(`layout`);
    grid.simple_form(this.get_txt({ roll: `BU_DYNID` }))
      .content(`form`)
      .label(this.get_txt({ roll: `BU_DYNID` }))
      .combobox({ change: this.client._event(`INPUT_SCREEN_CHANGE`), items: this.client._bind_edit(this.mt_screens), selectedkey: this.client._bind_edit(this.mv_screen) })
      .item({ key: `{SCREEN_NAME}`, text: `{SCREEN_NAME} - {DESCR}` })
      .get_parent()
      .label(this.get_txt({ roll: `DESCR_40` }))
      .input({ value: this.client._bind_edit(this.mv_screen_descr), showvaluehelp: false, enabled: false });
    grid.simple_form(this.get_txt({ roll: `/SCWM/WB_VARIANT` }))
      .content(`form`)
      .label(this.get_txt({ roll: `/SCWM/WB_VARIANT` }))
      .input({ value: this.client._bind_edit(this.mv_variant), showvaluehelp: true, valuehelprequest: this.client._event(`CALL_POPUP_VARIANT`), submit: this.client._event(`INPUT_VARIANT_CHANGE`) })
      .label(this.get_txt({ roll: `DESCR_40` }))
      .input({ value: this.client._bind_edit(this.mv_description), showvaluehelp: false });
    const content = grid.simple_form(this.get_txt({ roll: `CLASSFEL` })).content(`form`);
    if (this.mt_fields) {
      sy_tabix = 0;
      for (const lr_tab of this.mt_fields) {
        sy_tabix++;
        lv_tabix = z2ui5_cl_util.abap_copy(sy_tabix);
        scrtext = this.get_txt({ roll: lr_tab.field_doma });
        content.label(scrtext)
          .multi_input({ tokens: this.client._bind(lr_tab.t_token, { tab: this.mt_fields, tab_index: lv_tabix }), id: lr_tab.field, valuehelprequest: this.client._event(`CALL_POPUP_FILTER`, [lr_tab.field]) })
          .item({ key: `{KEY}`, text: `{TEXT}` })
          .tokens()
          .token({ key: `{KEY}`, text: `{TEXT}`, visible: `{VISIBLE}`, selected: `{SELKZ}`, editable: `{EDITABLE}` });
      }
    }
    page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: this.get_txt({ roll: `/SCWM/DE_HUDEL` }), press: this.client._event(`BUTTON_DELETE`), type: `Reject`, icon: `sap-icon://delete`, enabled: this.mv_button_active })
      .button({ text: this.get_txt({ roll: `B_KOPIE` }), press: this.client._event(`BUTTON_COPY`), type: `Default`, enabled: this.mv_button_active })
      .button({ text: this.get_txt({ roll: `/SCWM/DE_LM_LOGSAVE` }), press: this.client._event(`BUTTON_SAVE`), type: `Success`, enabled: this.mv_button_active });
    if (!this.mo_parent_view) {
      this.client.view_display(page.stringify());
    }
  }

  render_popup_filter() {
    let lo_popup = z2ui5_cl_xml_view.factory_popup();
    lo_popup = lo_popup.dialog({ contentheight: `50%`, contentwidth: `50%`, title: this.get_txt_l({ roll: `/SCWM/DE_TW_COND_CHECK_COND` }) });
    const vbox = lo_popup.vbox({ height: `100%`, justifycontent: `SpaceBetween` });
    const item = vbox.list({ nodata: this.get_txt({ roll: `/SCWM/DE_IND_BIN_EMPTY` }), items: this.client._bind_edit(this.mt_filter), selectionchange: this.client._event(`SELCHANGE`) })
      .custom_list_item();
    const grid = item.grid();
    grid.combobox({ selectedkey: `{OPTION}`, items: this.client._bind_edit(this.mt_mapping) })
      .item({ key: `{N}`, text: `{N}` })
      .get_parent()
      .input(`{LOW}`)
      .input({ value: `{HIGH}`, visible: `{= \${OPTION} === 'BT' }` })
      .button({ icon: `sap-icon://decline`, type: `Transparent`, press: this.client._event(`POPUP_FILTER_DELETE`, [`\${KEY}`]) });
    lo_popup.footer()
      .overflow_toolbar()
      .button({ text: this.get_txt({ roll: `FC_DELALL` }), icon: `sap-icon://delete`, type: `Transparent`, press: this.client._event(`POPUP_FILTER_DELETE_ALL`) })
      .button({ text: this.get_txt({ roll: `RSLPO_GUI_ADDPART` }), icon: `sap-icon://add`, press: this.client._event(`POPUP_FILTER_ADD`) })
      .toolbar_spacer()
      .button({ text: this.get_txt({ roll: `MSSRCF_ACTION` }), press: this.client._event(`POPUP_FILTER_OK`), type: `Emphasized` });
    this.client.popup_display(lo_popup.stringify());
  }

  render_popup_varaint({ client } = {}) {
    const popup = z2ui5_cl_xml_view.factory_popup();
    popup.dialog({ title: this.get_txt({ roll: `/SCWM/WB_VARIANT` }), contentwidth: `30%` })
      .table({ mode: `SingleSelectLeft`, items: client._bind_edit(this.mt_variants_pop) })
      .columns()
      .column(`20rem`)
      .text(this.get_txt({ roll: `/SCWM/WB_VARIANT` }))
      .get_parent()
      .column()
      .text(this.get_txt({ roll: `DESCR_40` }))
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .text(`{VAR}`)
      .text(`{DESCR}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: this.get_txt({ roll: `MSSRCF_ACTION` }), press: client._event(`POPUP_VARIANT_CLOSE`), type: `Emphasized` });
    client.popup_display(popup.stringify());
  }

  render_pop_copy() {
    let lo_popup = z2ui5_cl_xml_view.factory_popup();
    lo_popup = lo_popup.dialog({ contentheight: `50%`, contentwidth: `50%`, title: this.get_txt({ roll: `/SCWM/DE_COPY_NUMBER` }) });
    lo_popup.simple_form(this.get_txt({ roll: `/SCWM/WB_VARIANT` }))
      .content(`form`)
      .label(this.get_txt({ roll: `/SCWM/WB_VARIANT` }))
      .input({ value: this.client._bind_edit(this.mv_variant_copy), showvaluehelp: false })
      .label(this.get_txt({ roll: `DESCR_40` }))
      .input({ value: this.client._bind_edit(this.mv_description_copy), showvaluehelp: false });
    lo_popup.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: this.get_txt({ roll: `XEXIT` }), press: this.client._event(`POPUP_COPY_EXIT`), type: `Reject` })
      .button({ text: this.get_txt({ roll: `/SCWM/DE_LM_LOGSAVE` }), press: this.client._event(`POPUP_COPY_SAVE`), type: `Emphasized`, enabled: `{= \${MV_VARIANT_COPY} !== "" }` });
    this.client.popup_display(lo_popup.stringify());
  }

  set_token({ field } = {}) {
    let sy_tabix = 0;
    let lv_value;
    sy_tabix = 0;
    for (const lr_filter of field.t_filter) {
      sy_tabix++;
      lv_value = this.mt_mapping.find((row) => row.n === lr_filter.option).v;
      // TODO(abap2js): REPLACE `{LOW}` IN lv_value WITH lr_filter->low.
      // TODO(abap2js): REPLACE `{HIGH}` IN lv_value WITH lr_filter->high.
      field.t_token.push({ key: lv_value, text: lv_value, visible: true, editable: false });
    }
  }

  varaint_page() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let lt_item;
    let arg;
    let lr_field;
    switch (this.client.get().EVENT) {
      case `INPUT_SCREEN_CHANGE`:
        this.mv_screen_descr = (() => { try { return this.mt_screens.find((row) => row.screen_name === this.mv_screen).descr ?? null; } catch { return null; } })();
        this.get_fields();
        this.mv_variant = {};
        this.mv_description = {};
        this.get_variants();
        this.view_display();
        break;
      case `INPUT_VARIANT_CHANGE`:
        this.get_values();
        this.view_display();
        break;
      case `POPUP_FILTER_OK`:
        this.popup_filter_ok();
        break;
      case `POPUP_FILTER_ADD`:
        this.mt_filter.push({ key: z2ui5_cl_util.uuid_get_c32() });
        this.client.popup_model_update();
        break;
      case `POPUP_FILTER_DELETE`:
        lt_item = this.client.get().T_EVENT_ARG;
        for (let _i = this.mt_filter.length - 1; _i >= 0; _i--) { const row = this.mt_filter[_i]; if (row.key === lt_item[(1) - 1]) this.mt_filter.splice(_i, 1); }
        this.client.popup_model_update();
        break;
      case `POPUP_FILTER_DELETE_ALL`:
        this.mt_filter = {};
        this.client.popup_model_update();
        break;
      case `CALL_POPUP_FILTER`:
        arg = this.client.get().T_EVENT_ARG;
        this.mv_activ_elemnt = (() => { try { return arg[(1) - 1] ?? null; } catch { return null; } })();
        lr_field = {};
        {
          const _t = this.mt_fields;
          const _i = _t.findIndex((_r) => _r.field === this.mv_activ_elemnt);
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) lr_field = _t[_i];
        }
        this.mt_filter = z2ui5_cl_util.abap_copy(lr_field.t_filter);
        this.render_popup_filter();
        break;
      case `CALL_POPUP_VARIANT`:
        sy_tabix = 0;
        for (const lr_fields of this.mt_variants) {
          sy_tabix++;
          const field = {};
          this.mt_variants_pop.push(field);
          field = ({ ...lr_fields });
        }
        this.render_popup_varaint({ client: this.client });
        break;
      case `POPUP_VARIANT_CLOSE`:
        this.mv_variant = (() => { try { return this.mt_variants_pop.find((row) => row.selkz === true).var ?? null; } catch { return null; } })();
        this.client.popup_destroy();
        this.get_values();
        this.view_display();
        break;
      case `BUTTON_SAVE`:
        break;
      case `BUTTON_DELETE`:
        this.view_display();
        break;
      case `BUTTON_COPY`:
        this.render_pop_copy();
        this.view_display();
        break;
      case `POPUP_COPY_EXIT`:
        this.client.popup_destroy();
        break;
      case `POPUP_COPY_SAVE`:
        this.popup_copy_save();
        this.client.popup_destroy();
        break;
    }
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
      return;
    }
    this.varaint_page();
    this.mv_button_active = (this.mv_screen && this.mv_variant);
    client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_130;
