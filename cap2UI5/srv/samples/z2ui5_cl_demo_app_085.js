const z2ui5_cl_demo_app_086 = require("./z2ui5_cl_demo_app_086");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_085 extends z2ui5_if_app {
  static c_pic_url = `https://sapui5.hana.ondemand.com/sdk/test-resources/sap/ui/documentation/sdk/images/`;

  mt_table = [];
  mt_table_supplier = [];
  mv_search_value = ``;
  ls_detail = [];
  client = null;
  lv_layout = ``;
  lv_sort_desc = true;
  ls_detail_supplier = {};
  check_detail_active = false;

  sort() {
    if (this.lv_sort_desc === true) {
      this.mt_table.sort((a, b) => (a.productid > b.productid ? 1 : a.productid < b.productid ? -1 : 0));
      this.lv_sort_desc = false;
    } else {
      this.mt_table.sort((a, b) => (a.productid > b.productid ? 1 : a.productid < b.productid ? -1 : 0) * -1);
      this.lv_sort_desc = true;
    }
  }

  view_display_detail() {
    const lo_view_nested = z2ui5_cl_xml_view.factory();
    const page = lo_view_nested.object_page_layout({ showtitleinheadercontent: true, showeditheaderbutton: true, editheaderbuttonpress: this.client._event(`EDIT_HEADER_PRESS`), uppercaseanchorbar: false });
    const header_title = page.header_title().object_page_dyn_header_title();
    header_title.expanded_heading()
      .hbox()
      .info_label({ text: `Product Id ` + this.client._bind(this.ls_detail.productid), colorscheme: `9`, width: `200px`, icon: `sap-icon://home-share` });
    header_title.snapped_heading()
      .flex_box({ alignitems: `Center` })
      .avatar({ src: z2ui5_cl_demo_app_085.c_pic_url + this.ls_detail.pic, class: `sapUiTinyMarginEnd` })
      .info_label({ text: `Product Id ` + this.client._bind(this.ls_detail.productid), colorscheme: `9`, width: `200px`, icon: `sap-icon://home-share` });
    header_title.expanded_content(`uxap`).text(this.client._bind(this.ls_detail.productname));
    header_title.snapped_content(`uxap`).text(this.client._bind(this.ls_detail.productname));
    header_title.snapped_title_on_mobile().title(this.client._bind(this.ls_detail.productname));
    header_title.actions(`uxap`)
      .overflow_toolbar()
      .overflow_toolbar_button({ icon: `sap-icon://supplier`, text: `Supplier Detail`, type: `Transparent`, enabled: `true`, tooltip: `Goto Supplier`, press: this.client._event(`ONGOTOSUPPLIER`) })
      .overflow_toolbar_button({ icon: `sap-icon://exit-full-screen`, text: `Exit Fullscreen Mode`, type: `Transparent`, tooltip: `Close Fullscreen Mode`, enabled: (this.lv_layout === `TwoColumnsMidExpanded` ? `false` : this.lv_layout === `MidColumnFullScreen` ? `true` : null), press: this.client._event(`ONEXITFULLSCREENMODE`) })
      .overflow_toolbar_button({ icon: `sap-icon://full-screen`, text: `Enter Fullscreen Mode`, type: `Transparent`, enabled: (this.lv_layout === `TwoColumnsMidExpanded` ? `true` : this.lv_layout === `MidColumnFullScreen` ? `false` : null), tooltip: `Fullscreen Mode`, press: this.client._event(`ONFULLSCREENMODE`) })
      .overflow_toolbar_button({ icon: `sap-icon://decline`, text: `Exit Detail Screen`, type: `Transparent`, enabled: `true`, tooltip: `Close Detail`, press: this.client._event(`ONCLOSEDETAIL`) });
    const header_content = page.header_content(`uxap`);
    header_content.flex_box({ wrap: `Wrap` })
      .avatar({ src: z2ui5_cl_demo_app_085.c_pic_url + this.ls_detail.pic, class: `sapUiSmallMarginEnd`, displaysize: `layout` })
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label(`Dimension`)
      .label(`Weight`)
      .label(`Price`)
      .label(`Rating`)
      .label(`Achived goals`)
      .get_parent()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .text(` ${this.ls_detail.width} x ${this.ls_detail.depth} x ${this.ls_detail.height} ${this.ls_detail.dimunit}`)
      .object_number({ number: (this.ls_detail.measure), unit: this.ls_detail.unit, state: this.ls_detail.state_measure })
      .text(`${this.ls_detail.price} ${this.ls_detail.waers} `)
      .vbox()
      .rating_indicator({ class: `sapUiSmallMarginBottom`, value: this.ls_detail.rating, maxvalue: `6`, displayonly: `true` })
      .get_parent()
      .progress_indicator({ percentvalue: this.ls_detail.process, displayvalue: `${this.ls_detail.process} %`, state: this.ls_detail.state_price, showvalue: `true` })
      .get_parent()
      .get_parent()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label(`Supplier`)
      .label(`Country`)
      .label(`City`)
      .label(`Street`)
      .label(`Mail`)
      .label(`Phone`)
      .get_parent()
      .vertical_layout({ class: `sapUiSmallMarginBeginEnd` })
      .label(this.ls_detail_supplier.suppliername)
      .label(this.ls_detail_supplier.country)
      .label(`${this.ls_detail_supplier.zipcode}-${this.ls_detail_supplier.city} `)
      .link({ text: this.ls_detail_supplier.street, href: `https://www.google.com/maps/search/?api=1&query=${this.ls_detail_supplier.street},${this.ls_detail_supplier.city},${this.ls_detail_supplier.country}`, target: `_blank` })
      .link({ text: this.ls_detail_supplier.email, href: `mailto:${this.ls_detail_supplier.email}`, target: `_blank` })
      .link({ text: this.ls_detail_supplier.phone, href: `tel:${this.ls_detail_supplier.phone}` })
      .get_parent();
    const sections = page.sections();
    sections.object_page_section({ titleuppercase: false, id: `SectionDescription`, title: `Description` })
      .heading(`uxap`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `SectionDescription1`, title: `Description` })
      .blocks()
      .vbox()
      .text_area({ rows: `10`, value: `Text`, editable: `false`, width: `100%` })
      .get_parent()
      .get_parent()
      .get_parent()
      .object_page_sub_section({ id: `SectionDescription2`, title: `Picture` })
      .blocks()
      .vbox()
      .image({ src: z2ui5_cl_demo_app_085.c_pic_url + this.ls_detail.pic });
    sections.object_page_section({ titleuppercase: false, id: `SupplierSection`, title: `Supplier` })
      .heading(`uxap`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `SupplierSection1`, title: `Connect` })
      .blocks()
      .label(`Phone ${this.ls_detail_supplier.phone}`)
      .label(`Mail ${this.ls_detail_supplier.email}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .object_page_sub_section({ id: `SupplierSection2`, title: `Payment information ` })
      .blocks()
      .label(`20 Days Net`);
    sections.object_page_section({ titleuppercase: false, id: `Others`, title: `Others` })
      .heading(`uxap`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `Others1`, title: `Information` })
      .blocks()
      .vbox()
      .label(`info`)
      .label(`info`)
      .get_parent()
      .get_parent()
      .get_parent()
      .object_page_sub_section({ id: `Others2`, title: `Details ` })
      .blocks()
      .vbox()
      .label(`details`)
      .label(`details`)
      .label(`details`);
    sections.object_page_section({ titleuppercase: false, id: `OtherSuppliers`, title: `Other Supplier` })
      .heading(`uxap`)
      .get_parent()
      .sub_sections()
      .object_page_sub_section({ id: `OtherSupplier1`, title: `Supplier List` })
      .scroll_container({ height: `100%`, vertical: true })
      .table({ inset: false, showseparators: `Inner`, headertext: `Suppliers`, items: this.client._bind(this.mt_table_supplier), sticky: `ColumnHeaders,HeaderToolbar` })
      .columns()
      .column()
      .text(`Supplier`)
      .get_parent()
      .column()
      .text(`Country`)
      .get_parent()
      .column()
      .text(`City`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ type: `Navigation`, press: this.client._event(`ONPRESSSUPPLIER`, [`${SUPPLIERNAME}`]) })
      .cells()
      .text(`{SUPPLIERNAME}`)
      .get_parent()
      .text(`{COUNTRY}`)
      .text(`{CITY}`);
    this.check_detail_active = true;
    this.client.nest_view_display(lo_view_nested.stringify(), `Detail`, `addMidColumnPage`, `removeAllMidColumnPages`);
  }

  view_display_master() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Master Detail`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true });
    const lr_master = page.flexible_column_layout({ layout: this.lv_layout, id: `Detail` }).begin_column_pages();
    const tab = lr_master.scroll_container({ height: `100%`, vertical: true })
      .table({ inset: false, showseparators: `Inner`, headertext: `Products`, items: this.client._bind(this.mt_table), sticky: `ColumnHeaders,HeaderToolbar` });
    tab.header_toolbar()
      .overflow_toolbar()
      .search_field({ id: `SEARCH`, width: `17.5rem`, search: this.client._event(`ONSEARCH`), change: this.client._event(`ONSEARCH`), value: this.client._bind_edit(this.mv_search_value) })
      .toolbar_spacer()
      .overflow_toolbar_button({ icon: `sap-icon://sort`, type: `Transparent`, press: this.client._event(`ONSORT`) });
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
      .text(`Price`);
    tab.items()
      .column_list_item({ type: `Navigation`, press: this.client._event(`ONPRESSMASTER`, [`${KEY}`]) })
      .cells()
      .object_identifier({ text: `{PRODUCTNAME}`, title: `{PRODUCTID}` })
      .get_parent()
      .text(`{SUPPLIERNAME}`)
      .get_parent()
      .text(`{WIDTH} x {DEPTH} x {HEIGHT} {DIMUNIT}`)
      .object_number({ number: `{MEASURE}`, unit: `{UNIT}`, state: `{STATE_MEASURE}` })
      .object_number({ state: `{STATE_PRICE}`, number: `{ parts: [ { path : 'PRICE' } , { path : 'WAERS' } ] } ` });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.set_data();
      this.sort();
      this.view_display_master();
      return;
    }
    if (client.get().CHECK_ON_NAVIGATED === true) {
      this.view_display_master();
      this.view_display_detail();
      return;
    }
    this.on_event();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `ONGOTOSUPPLIER`:
        let lo_app_next = new z2ui5_cl_demo_app_086();
        lo_app_next.ls_detail_supplier = this.ls_detail_supplier;
        this.client.nav_app_call(lo_app_next);
        break;
      case `ONEXITFULLSCREENMODE`:
        this.lv_layout = `TwoColumnsMidExpanded`;
        this.view_display_master();
        this.view_display_detail();
        this.client.nest_view_model_update();
        this.client.message_toast_display(`Event Close FullScreen Mode `);
        break;
      case `ONFULLSCREENMODE`:
        this.lv_layout = `MidColumnFullScreen`;
        this.view_display_master();
        this.view_display_detail();
        this.client.nest_view_model_update();
        this.client.message_toast_display(`Event FullScreen Detail `);
        break;
      case `ONCLOSEDETAIL`:
        this.lv_layout = `OneColumn`;
        this.view_display_master();
        this.view_display_detail();
        this.check_detail_active = false;
        this.client.nest_view_model_update();
        this.client.message_toast_display(`Event Close Detail `);
        break;
      case `ONPRESSSUPPLIER`:
        let lt_arg = this.client.get().T_EVENT_ARG;
        // TODO(abap2js): READ TABLE mt_table_supplier WITH KEY suppliername = lt_arg[ 1 ] INTO ls_detail_supplier.
        this.client.message_toast_display(`Event Press Supplier List Name: ${lt_arg[(1) - 1]} `);
        lo_app_next = new z2ui5_cl_demo_app_086();
        lo_app_next.ls_detail_supplier = this.ls_detail_supplier;
        this.client.nav_app_call(lo_app_next);
        break;
      case `ONPRESSMASTER`:
        lt_arg = this.client.get().T_EVENT_ARG;
        this.client.message_toast_display(`Event Press Master - Product Id ${lt_arg[(1) - 1]} `);
        // TODO(abap2js): READ TABLE mt_table WITH KEY key = lt_arg[ 1 ] INTO ls_detail.
        // TODO(abap2js): READ TABLE mt_table_supplier WITH KEY suppliername = ls_detail-suppliername INTO ls_detail_supplier.
        this.lv_layout = `TwoColumnsMidExpanded`;
        if (this.check_detail_active === false) {
          this.view_display_master();
        }
        this.view_display_detail();
        this.client.view_model_update();
        this.client.nest_view_model_update();
        break;
      case `UPDATE_DETAIL`:
        this.view_display_detail();
        break;
      case `ONSORT`:
        this.client.message_toast_display(`Sort Entries`);
        this.sort();
        // TODO(abap2js): READ TABLE mt_table INDEX 1 INTO ls_detail.
        this.view_display_master();
        this.view_display_detail();
        this.client.view_model_update();
        this.client.nest_view_model_update();
        break;
      case `ONSEARCH`:
        this.client.message_toast_display(`Search Entries`);
        this.set_data();
        this.set_search();
        this.client.view_model_update();
        this.client.nest_view_model_update();
        break;
    }
  }

  set_data() {
    this.mt_table = [{ key: `1`, productid: `1`, productname: `table`, suppliername: `Company 1`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 100, unit: `ST`, price: `1000.50`, waers: `EUR`, state_price: `Success`, state_measure: `Warning`, pic: `HT-1010.jpg`, rating: `0`, process: `0` }, { key: `2`, productid: `2`, productname: `chair`, suppliername: `Company 2`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 123, unit: `ST`, price: `2000.55`, waers: `USD`, state_price: `Error`, state_measure: `Error`, pic: `HT-2001.jpg`, rating: `1`, process: `10` }, { key: `3`, productid: `3`, productname: `sofa`, suppliername: `Company 3`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 700, unit: `ST`, price: `3000.11`, waers: `CNY`, state_price: `Success`, state_measure: `Warning`, pic: `HT-1251.jpg`, rating: `2`, process: `15` }, { key: `4`, productid: `4`, productname: `computer`, suppliername: `Company 4`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 200, unit: `ST`, price: `4000.88`, waers: `USD`, state_price: `Success`, state_measure: `Success`, pic: `HT-6100.jpg`, rating: `3`, process: `38` }, { key: `5`, productid: `5`, productname: `printer`, suppliername: `Company 5`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 90, unit: `ST`, price: `5000.47`, waers: `EUR`, state_price: `Error`, state_measure: `Warning`, pic: `HT-1000.jpg`, rating: `4`, process: `66` }, { key: `6`, productid: `6`, productname: `table2`, suppliername: `Company 6`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 600, unit: `ST`, price: `6000.33`, waers: `GBP`, state_price: `Success`, state_measure: `Information`, pic: `HT-1137.jpg`, rating: `2`, process: `91` }, { key: `7`, productid: `7`, productname: `table3`, suppliername: `Company 7`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 600, unit: `ST`, price: `6000.33`, waers: `GBP`, state_price: `Success`, state_measure: `Warning`, pic: `HT-7000.jpg`, rating: `6`, process: `5` }, { key: `8`, productid: `8`, productname: `table4`, suppliername: `Company 8`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 600, unit: `ST`, price: `6000.33`, waers: `GBP`, state_price: `Warning`, state_measure: `Error`, pic: `HT-9997.jpg`, rating: `0`, process: `75` }, { key: `9`, productid: `9`, productname: `table5`, suppliername: `Company 9`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 600, unit: `ST`, price: `6000.33`, waers: `GBP`, state_price: `Information`, state_measure: `Success`, pic: `HT-7020.jpg`, rating: `1`, process: `81` }, { key: `10`, productid: `10`, productname: `table6`, suppliername: `Company 10`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 600, unit: `ST`, price: `6000.33`, waers: `GBP`, state_price: `Success`, state_measure: `Information`, pic: `HT-1023.jpg`, rating: `4`, process: `24` }, { key: `11`, productid: `11`, productname: `table7`, suppliername: `Company 11`, width: `10`, depth: `20`, height: `30`, dimunit: `CM`, measure: 600, unit: `ST`, price: `6000.33`, waers: `GBP`, state_price: `Information`, state_measure: `Success`, pic: `HT-1085.jpg`, rating: `5`, process: `46` }];
    this.mt_table_supplier = [{ suppliername: `Company 1`, email: `company1@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Dresden`, street: `Neumarkt`, zipcode: `01067` }, { suppliername: `Company 2`, email: `company2@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Erfurt`, street: `Domplatz`, zipcode: `99084` }, { suppliername: `Company 3`, email: `company3@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Suhl`, street: `Carl-Fiedler-Straße 58`, zipcode: `98527` }, { suppliername: `Company 4`, email: `company4@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Hildburgheusen`, street: `Markt`, zipcode: `98646` }, { suppliername: `Company 5`, email: `company5@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Sonneberg`, street: `Beethovenstraße 10`, zipcode: `96515` }, { suppliername: `Company 6`, email: `company6@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Meiningen`, street: `Schloßplatz 1`, zipcode: `98617` }, { suppliername: `Company 7`, email: `company7@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Leipzig`, street: `Pfaffendorfer Str. 29`, zipcode: `04105` }, { suppliername: `Company 8`, email: `company8@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Magdeburg`, street: `Am Dom 1`, zipcode: `39104` }, { suppliername: `Company 9`, email: `company9@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Schwerin`, street: `Lennéstraße 1`, zipcode: `19053` }, { suppliername: `Company 10`, email: `company10@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Rostock`, street: `Rungestraße 79-78`, zipcode: `18055` }, { suppliername: `Company 11`, email: `company11@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Cottbus`, street: `Marktstraße`, zipcode: `03046` }, { suppliername: `Company 12`, email: `company12@sap.com`, phone: `+49 1234567890`, country: `Germany`, city: `Halle (Saale)`, street: `Marktpl. 1`, zipcode: `06108` }];
    this.ls_detail = this.mt_table[(1) - 1];
  }

  set_search() {
    if (this.mv_search_value) {
      let sy_tabix = 0;
      for (const lr_row of this.mt_table) {
        sy_tabix++;
        let lv_row = ``;
        let lv_index = 1;
        while (true) {
          // TODO(abap2js): ASSIGN COMPONENT lv_index OF STRUCTURE lr_row->* TO FIELD-SYMBOL(<field>).
          if (sy_subrc !== 0) {
            break;
          }
          lv_row = lv_row + field;
          lv_index = lv_index + 1;
        }
        if (lv_row NS this.mv_search_value) {
          // TODO(abap2js): DELETE mt_table.
        }
      }
    }
  }
}

module.exports = z2ui5_cl_demo_app_085;
