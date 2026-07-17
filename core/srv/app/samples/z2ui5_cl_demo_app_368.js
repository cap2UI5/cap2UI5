const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_368 extends z2ui5_if_app {
  t_products = [];
  cnt_total = 0;
  cnt_ok = 0;
  cnt_heavy = 0;
  cnt_overweight = 0;
  selectedkey = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Icon Tab Bar - Filter Table`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.IconTabBar/sample/sap.m.sample.IconTabBar` });
    const items = page.icon_tab_bar({ class: `sapUiResponsiveContentPadding`, selectedkey: this.client._bind_edit(this.selectedkey), select: this.client._event(`TAB_SELECT`) })
      .items();
    items.icon_tab_filter({ count: this.client._bind(this.cnt_total), text: `Products`, key: `ALL`, showall: true });
    items.icon_tab_separator();
    items.icon_tab_filter({ icon: `sap-icon://begin`, iconcolor: `Positive`, count: this.client._bind(this.cnt_ok), text: `OK`, key: `OK` });
    items.icon_tab_filter({ icon: `sap-icon://compare`, iconcolor: `Critical`, count: this.client._bind(this.cnt_heavy), text: `Heavy`, key: `HEAVY` });
    items.icon_tab_filter({ icon: `sap-icon://inventory`, iconcolor: `Negative`, count: this.client._bind(this.cnt_overweight), text: `Overweight`, key: `OVERWEIGHT` });
    page.table({ inset: false, showseparators: `Inner`, headertext: `Products`, items: this.client._bind(this.t_products) })
      .columns()
      .column()
      .text(`Product`)
      .get_parent()
      .column()
      .text(`Supplier`)
      .get_parent()
      .column({ halign: `End` })
      .text(`Weight`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .text(`{PRODUCTNAME}`)
      .text(`{SUPPLIERNAME}`)
      .text(`{MEASURE} {UNIT}`);
    this.client.view_display(page.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `TAB_SELECT`:
        this.set_data();
        this.client.view_model_update();
        break;
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
    }
  }

  set_data() {
    this.t_products = [{ productname: `table`, suppliername: `Company 1`, measure: 100, unit: `KG` }, { productname: `chair`, suppliername: `Company 2`, measure: 123, unit: `KG` }, { productname: `sofa`, suppliername: `Company 3`, measure: 700, unit: `KG` }, { productname: `computer`, suppliername: `Company 4`, measure: 200, unit: `KG` }, { productname: `printer`, suppliername: `Company 5`, measure: 90, unit: `KG` }, { productname: `table2`, suppliername: `Company 6`, measure: 600, unit: `KG` }];
    this.cnt_total = z2ui5_cl_util.abap_copy(this.t_products.length);
    this.cnt_ok = /* TODO(abap2js): REDUCE */ null;
    this.cnt_heavy = /* TODO(abap2js): REDUCE */ null;
    this.cnt_overweight = /* TODO(abap2js): REDUCE */ null;
    switch (this.selectedkey) {
      case `OK`:
        for (let _i = this.t_products.length - 1; _i >= 0; _i--) { const row = this.t_products[_i]; if (row.measure > 100) this.t_products.splice(_i, 1); }
        break;
      case `HEAVY`:
        for (let _i = this.t_products.length - 1; _i >= 0; _i--) { const row = this.t_products[_i]; if (row.measure <= 100 || row.measure > 500) this.t_products.splice(_i, 1); }
        break;
      case `OVERWEIGHT`:
        for (let _i = this.t_products.length - 1; _i >= 0; _i--) { const row = this.t_products[_i]; if (row.measure <= 500) this.t_products.splice(_i, 1); }
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The icon tab filters show a count per category and filter the table below on selection. The counts are bound to the backend and updated with the model.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_368;
