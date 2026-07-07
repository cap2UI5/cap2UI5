const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_181 extends z2ui5_if_app {
  mv_url = ``;
  mt_cities = null;
  mt_products = null;
  client = null;

  on_event() {
    if (this.client.check_on_event(`BOOK`)) {
      this.client.message_toast_display(`BOOKED !!! ENJOY`);
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `Cards Demo`, class: `sapUiContentPadding`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    this.mt_cities = [{ text: `Berlin`, key: `BR` }, { text: `London`, key: `LN` }, { text: `Madrid`, key: `MD` }, { text: `Prague`, key: `PR` }, { text: `Paris`, key: `PS` }, { text: `Sofia`, key: `SF` }, { text: `Vienna`, key: `VN` }];
    this.mt_products = [{ title: `Notebook HT`, subtitle: `ID23452256-D44`, revenue: `27.25K EUR`, status: `success`, status_schema: `Success` }, { title: `Notebook XT`, subtitle: `ID27852256-D47`, revenue: `7.35K EUR`, status: `exceeded`, status_schema: `Error` }, { title: `Notebook ST`, subtitle: `ID123555587-I05`, revenue: `22.89K EUR`, status: `warning`, status_schema: `Warning` }];
    const card_1 = page.card({ width: `300px`, class: `sapUiMediumMargin` })
      .header(`f`)
      .card_header({ title: `Buy bus ticket on-line`, subtitle: `Buy a single-ride ticket for a date`, iconsrc: `sap-icon://bus-public-transport` })
      .get_parent()
      .get_parent()
      .content(`f`)
      .vbox({ height: `110px`, class: `sapUiSmallMargin`, justifycontent: `SpaceBetween` })
      .hbox({ justifycontent: `SpaceBetween` })
      .combobox({ width: `120px`, placeholder: `From City`, items: `{path:'` + this.client._bind(this.mt_cities, { path: true }) + `', sorter: { path: 'TEXT' } }` })
      .get()
      .item({ key: `{KEY}`, text: `{TEXT}` })
      .get_parent()
      .combobox({ width: `120px`, placeholder: `To City`, items: `{path:'` + this.client._bind(this.mt_cities, { path: true }) + `', sorter: { path: 'TEXT' } }` })
      .get()
      .item({ key: `{KEY}`, text: `{TEXT}` })
      .get_parent()
      .get_parent()
      .hbox({ rendertype: `Bare`, justifycontent: `SpaceBetween` })
      .date_picker({ width: `200px`, placeholder: `Choose Date ...` })
      .button({ text: `Book`, type: `Emphasized`, press: this.client._event(`BOOK`), class: `sapUiTinyMarginBegin` });
    const card_2 = page.card({ width: `300px`, class: `sapUiMediumMargin` })
      .header(`f`)
      .card_header({ title: `Project Cloud Transformation`, subtitle: `Revenue per Product | EUR` })
      .get_parent()
      .get_parent()
      .content(`f`)
      .list({ class: `sapUiSmallMarginBottom`, showseparators: `None`, items: this.client._bind(this.mt_products) })
      .custom_list_item()
      .hbox({ alignitems: `Center`, justifycontent: `SpaceBetween` })
      .vbox(`sapUiSmallMarginBegin sapUiSmallMarginTopBottom`)
      .title({ text: `{TITLE}`, titlestyle: `H3` })
      .text(`{SUBTITLE}`)
      .get_parent()
      .object_status({ class: `sapUiTinyMargin sapUiSmallMarginEnd`, text: `{REVENUE}`, state: `{STATUS_SCHEMA}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_181;
