const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_072 extends z2ui5_if_app {
  static c_lcb = `{`;
  static c_rcb = `}`;

  mt_table = [];
  lv_cnt_total = 0;
  lv_cnt_pos = 0;
  lv_cnt_heavy = 0;
  lv_cnt_neg = 0;
  lv_selectedkey = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_event() {
    if (this.client.check_on_event(`OnSelectIconTabBar`)) {
      this.client.message_toast_display(`Event SelectedTabBar Key ${this.lv_selectedkey} `);
      this.set_filter();
      this.client.view_model_update();
    }
  }

  on_init() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ id: `page_main`, showheader: (!((this.client.get().CHECK_LAUNCHPAD_ACTIVE) === true || (this.client.get().CHECK_LAUNCHPAD_ACTIVE) === `X`)), title: `abap2UI5 - IconTabBar`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const lo_items = page.icon_tab_bar({ class: `sapUiResponsiveContentPadding`, selectedkey: this.client._bind_edit(this.lv_selectedkey), select: this.client._event(`OnSelectIconTabBar`, [`\${LV_SELECTEDKEY}`]) })
      .items();
    lo_items.icon_tab_filter({ count: this.client._bind_edit(this.lv_cnt_total), text: `Products`, key: `ALL`, showall: true });
    lo_items.icon_tab_separator();
    lo_items.icon_tab_filter({ icon: `sap-icon://begin`, iconcolor: `Positive`, count: this.client._bind_edit(this.lv_cnt_pos), text: `OK`, key: `OK` });
    lo_items.icon_tab_filter({ icon: `sap-icon://compare`, iconcolor: `Critical`, count: this.client._bind_edit(this.lv_cnt_heavy), text: `Heavy`, key: `HEAVY` });
    lo_items.icon_tab_filter({ icon: `sap-icon://inventory`, iconcolor: `Negative`, count: this.client._bind_edit(this.lv_cnt_neg), text: `Overweight`, key: `OVERWEIGHT` });
    const tab = page.scroll_container({ height: `70%`, vertical: true })
      .table({ inset: false, showseparators: `Inner`, headertext: `Products`, items: this.client._bind(this.mt_table) });
    tab.columns()
      .column(`12em`)
      .text(`Product`)
      .get_parent()
      .column({ minscreenwidth: `Tablet`, demandpopin: true })
      .text(`Supplier`)
      .get_parent()
      .column({ minscreenwidth: `Desktop`, demandpopin: true, halign: `End` })
      .text(`Dimensions`)
      .get_parent()
      .column({ minscreenwidth: `Desktop`, demandpopin: true, halign: `Center` })
      .text(`Weight`)
      .get_parent()
      .column({ halign: `End` })
      .text(`Price`)
      .get_parent()
      .column({ halign: `End` })
      .text(`Rating`);
    tab.items()
      .column_list_item()
      .cells()
      .object_identifier({ text: `{PRODUCTNAME}`, title: `{PRODUCTID}` })
      .get_parent()
      .text(`{SUPPLIERNAME}`)
      .get_parent()
      .text(`{WIDTH} x {DEPTH} x {HEIGHT} {DIMUNIT}`)
      .object_number({ number: `{MEASURE}`, unit: `{UNIT}`, state: `{STATE_MEASURE}` })
      .object_number({ state: `{STATE_PRICE}`, number: `{ parts: [ { path : 'PRICE' } , { path : 'WAERS' } ] } ` });
    this.client.view_display(view.stringify());
  }

  set_data() {
    this.mt_table = [{ productid: `1`, productname: `table`, suppliername: `Company 1`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 100, unit: `ST`, price: `1000.50`, waers: `EUR`, state_price: `Success`, rating: `0`, state_measure: `Warning` }, { productid: `2`, productname: `chair`, suppliername: `Company 2`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 123, unit: `ST`, price: `2000.55`, waers: `USD`, state_price: `Error`, rating: `1`, state_measure: `Warning` }, { productid: `3`, productname: `sofa`, suppliername: `Company 3`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 700, unit: `ST`, price: `3000.11`, waers: `CNY`, state_price: `Success`, rating: `2`, state_measure: `Warning` }, { productid: `4`, productname: `computer`, suppliername: `Company 4`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 200, unit: `ST`, price: `4000.88`, waers: `USD`, state_price: `Success`, rating: `3`, state_measure: `Success` }, { productid: `5`, productname: `printer`, suppliername: `Company 5`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 90, unit: `ST`, price: `5000.47`, waers: `EUR`, state_price: `Error`, rating: `4`, state_measure: `Warning` }, { productid: `6`, productname: `table2`, suppliername: `Company 6`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 600, unit: `ST`, price: `6000.33`, waers: `GBP`, state_price: `Success`, rating: `5`, state_measure: `Information` }];
    this.lv_cnt_total = z2ui5_cl_util.abap_copy(this.mt_table.length);
    this.lv_cnt_pos = /* TODO(abap2js): REDUCE */ null;
    this.lv_cnt_heavy = /* TODO(abap2js): REDUCE */ null;
    this.lv_cnt_neg = /* TODO(abap2js): REDUCE */ null;
  }

  set_filter() {
    this.set_data();
    switch (this.lv_selectedkey) {
      case `ALL`:
        break;
      case `OK`:
        for (let _i = this.mt_table.length - 1; _i >= 0; _i--) { const row = this.mt_table[_i]; if (!(row.measure >= 0 && row.measure <= 100)) this.mt_table.splice(_i, 1); }
        break;
      case `HEAVY`:
        for (let _i = this.mt_table.length - 1; _i >= 0; _i--) { const row = this.mt_table[_i]; if (!(row.measure >= 101 && row.measure <= 500)) this.mt_table.splice(_i, 1); }
        break;
      case `OVERWEIGHT`:
        for (let _i = this.mt_table.length - 1; _i >= 0; _i--) { const row = this.mt_table[_i]; if (!row.measure > 500) this.mt_table.splice(_i, 1); }
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_072;
