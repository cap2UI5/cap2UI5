const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_030 extends z2ui5_if_app {
  t_products = [];
  show_footer = false;
  area_shrink_ratio = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.show_footer = true;
    this.area_shrink_ratio = `1:1.6:1.6`;
    this.t_products = z2ui5_cl_util.abap_tab_assign(this.t_products, [{ name: `Notebook Basic 15`, product_id: `HT-1000`, supplier_name: `Very Best Screens`, width: `30`, depth: `18`, height: `3`, dim_unit: `cm`, price: `956.00`, currency_code: `EUR` }, { name: `Notebook Basic 17`, product_id: `HT-1001`, supplier_name: `Very Best Screens`, width: `29`, depth: `17`, height: `3.1`, dim_unit: `cm`, price: `1,249.00`, currency_code: `EUR` }, { name: `Notebook Basic 18`, product_id: `HT-1002`, supplier_name: `Very Best Screens`, width: `28`, depth: `19`, height: `2.5`, dim_unit: `cm`, price: `1,570.00`, currency_code: `EUR` }, { name: `Notebook Basic 19`, product_id: `HT-1003`, supplier_name: `Smartcards`, width: `32`, depth: `21`, height: `4`, dim_unit: `cm`, price: `1,650.00`, currency_code: `EUR` }, { name: `ITelO Vault`, product_id: `HT-1007`, supplier_name: `Technocom`, width: `32`, depth: `22`, height: `3`, dim_unit: `cm`, price: `299.00`, currency_code: `EUR` }, { name: `Notebook Professional 15`, product_id: `HT-1010`, supplier_name: `Very Best Screens`, width: `33`, depth: `20`, height: `3`, dim_unit: `cm`, price: `1,999.00`, currency_code: `EUR` }, { name: `Notebook Professional 17`, product_id: `HT-1011`, supplier_name: `Very Best Screens`, width: `33`, depth: `23`, height: `2`, dim_unit: `cm`, price: `2,299.00`, currency_code: `EUR` }, { name: `ITelO Vault Net`, product_id: `HT-1020`, supplier_name: `Technocom`, width: `10`, depth: `1.8`, height: `17`, dim_unit: `cm`, price: `459.00`, currency_code: `EUR` }, { name: `ITelO Vault SAT`, product_id: `HT-1021`, supplier_name: `Technocom`, width: `11`, depth: `1.7`, height: `18`, dim_unit: `cm`, price: `149.00`, currency_code: `EUR` }, { name: `Comfort Easy`, product_id: `HT-1022`, supplier_name: `Technocom`, width: `84`, depth: `1.5`, height: `14`, dim_unit: `cm`, price: `1,679.00`, currency_code: `EUR` }, { name: `Comfort Senior`, product_id: `HT-1023`, supplier_name: `Technocom`, width: `80`, depth: `1.6`, height: `13`, dim_unit: `cm`, price: `512.00`, currency_code: `EUR` }, { name: `Ergo Screen E-I`, product_id: `HT-1030`, supplier_name: `Very Best Screens`, width: `37`, depth: `12`, height: `36`, dim_unit: `cm`, price: `230.00`, currency_code: `EUR` }, { name: `Ergo Screen E-II`, product_id: `HT-1031`, supplier_name: `Very Best Screens`, width: `40.8`, depth: `19`, height: `43`, dim_unit: `cm`, price: `285.00`, currency_code: `EUR` }, { name: `Ergo Screen E-III`, product_id: `HT-1032`, supplier_name: `Very Best Screens`, width: `40.8`, depth: `19`, height: `43`, dim_unit: `cm`, price: `345.00`, currency_code: `EUR` }, { name: `Flat Basic`, product_id: `HT-1035`, supplier_name: `Very Best Screens`, width: `39`, depth: `20`, height: `41`, dim_unit: `cm`, price: `399.00`, currency_code: `EUR` }, { name: `Flat Future`, product_id: `HT-1036`, supplier_name: `Very Best Screens`, width: `45`, depth: `26`, height: `46`, dim_unit: `cm`, price: `430.00`, currency_code: `EUR` }]);
    this.t_products.sort((a, b) => ((a.name > b.name ? 1 : a.name < b.name ? -1 : 0)));
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `TOGGLE_AREA_PRIORITY`:
        this.area_shrink_ratio = (this.area_shrink_ratio === `1:1.6:1.6` ? `1.6:1:1.6` : `1:1.6:1.6`);
        this.client.view_model_update();
        break;
      case `TOGGLE_FOOTER`:
        this.show_footer = (!(this.show_footer === true || this.show_footer === `X`));
        this.client.view_model_update();
        break;
      case `OPEN_POPOVER`:
        this.popover_display({ id: this.client.get_event_arg() });
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Sample: Dynamic Page Freestyle`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.f.DynamicPage/sample/sap.f.sample.DynamicPageFreeStyle` });
    const dynamic_page = page.dynamic_page({ showfooter: this.client._bind(this.show_footer) });
    const header_title = dynamic_page.title({ ns: `f` }).get().dynamic_page_title();
    header_title._generic_property({ n: `areaShrinkRatio`, v: this.client._bind(this.area_shrink_ratio) });
    header_title.heading(`f`).title(`Header Title`);
    header_title._generic({ name: `breadcrumbs`, ns: `f` })
      .breadcrumbs()
      .link({ text: `Home` })
      .link({ text: `Page 1` })
      .link({ text: `Page 2` })
      .link({ text: `Page 3` })
      .link({ text: `Page 4` })
      .link({ text: `Page 5` });
    header_title.expanded_content(`f`).label(`This is a subheading`);
    header_title.snapped_content(`f`).label(`This is a subheading`);
    header_title._generic({ name: `snappedTitleOnMobile`, ns: `f` }).title(`This is a subheading`);
    header_title.content(`f`)
      .overflow_toolbar()
      .generic_tag({ text: `SR`, status: `Error`, design: `StatusIconHidden`, press: this.client._event(`OPEN_POPOVER`, [`\${$source>/id}`]) })
      .object_number({ number: `2`, unit: `M`, emphasized: false, state: `Error` });
    header_title.actions(`f`)
      .button({ text: `Edit`, type: `Emphasized`, press: this.client._event(`TOGGLE_AREA_PRIORITY`) })
      .button({ text: `Delete`, type: `Transparent` })
      .button({ text: `Copy`, type: `Transparent` })
      .button({ text: `Toggle Footer`, type: `Transparent`, press: this.client._event(`TOGGLE_FOOTER`) })
      .button({ icon: `sap-icon://action`, type: `Transparent` })
      .button({ text: `Button with layoutData`, type: `Transparent`, press: this.client._event(`OPEN_POPOVER`, [`\${$source>/id}`]) })
      .get()
      .layout_data()
      .overflow_toolbar_layout_data({ priority: `AlwaysOverflow`, closeoverflowoninteraction: false });
    header_title.navigation_actions()
      .button({ icon: `sap-icon://full-screen`, type: `Transparent` })
      .button({ icon: `sap-icon://decline`, type: `Transparent` });
    dynamic_page.header()
      .dynamic_page_header(true)
      .horizontal_layout({ allowwrapping: true })
      .vertical_layout({ class: `sapUiMediumMarginEnd` })
      .object_attribute({ title: `Location`, text: `Warehouse A` })
      .object_attribute({ title: `Halway`, text: `23L` })
      .object_attribute({ title: `Rack`, text: `34` })
      .get_parent()
      .vertical_layout()
      .object_attribute({ title: `Availability` })
      .object_status({ text: `In Stock`, state: `Success` });
    dynamic_page.content(`f`)
      .table({ id: `idProductsTable`, items: this.client._bind(this.t_products), sticky: `HeaderToolbar,ColumnHeaders`, inset: false, class: `sapFDynamicPageAlignContent`, width: `auto` })
      .header_toolbar()
      .toolbar()
      .title({ text: `Products`, level: `H2` })
      .get_parent()
      .get_parent()
      .columns()
      .column(`12em`)
      .text(`Product`)
      .get_parent()
      .column({ minscreenwidth: `Tablet`, demandpopin: true })
      .text(`Supplier`)
      .get_parent()
      .column({ minscreenwidth: `Tablet`, demandpopin: true, halign: `End` })
      .text(`Dimensions`)
      .get_parent()
      .column({ halign: `End` })
      .text(`Price`)
      .get_parent()
      .get_parent()
      .column_list_item()
      .object_identifier({ title: `{NAME}`, text: `{PRODUCT_ID}` })
      .get_parent()
      .text(`{SUPPLIER_NAME}`)
      .text(`{WIDTH} x {DEPTH} x {HEIGHT} {DIM_UNIT}`)
      .object_number({ number: `{PRICE}`, unit: `{CURRENCY_CODE}` });
    dynamic_page.footer(`f`)
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ type: `Accept`, text: `Accept` })
      .button({ type: `Reject`, text: `Reject` });
    this.client.view_display(view.stringify());
  }

  popover_display({ id } = {}) {
    const popup = z2ui5_cl_xml_view.factory_popup();
    popup.popover({ placement: `Bottom`, showheader: false, contentwidth: `300px` })
      .card({ width: `100%` })
      .header(`f`)
      ._generic({ name: `NumericHeader`, ns: `card`, t_prop: [{ n: `title`, v: `Sales Revenue` }, { n: `subtitle`, v: `Sales revenue in the current quarter` }, { n: `unitOfMeasurement`, v: `EUR` }, { n: `number`, v: `2.16` }, { n: `scale`, v: `M` }, { n: `trend`, v: `Down` }, { n: `state`, v: `Error` }] })
      ._generic({ name: `sideIndicators`, ns: `card` })
      ._generic({ name: `NumericSideIndicator`, ns: `card`, t_prop: [{ n: `number`, v: `4.74` }, { n: `unit`, v: `M` }, { n: `title`, v: `Target` }] })
      .get_parent()
      ._generic({ name: `NumericSideIndicator`, ns: `card`, t_prop: [{ n: `number`, v: `-54.49` }, { n: `unit`, v: `%` }, { n: `title`, v: `Deviation` }] });
    this.client.popover_display(popup.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_030;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

