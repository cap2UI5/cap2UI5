const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_262 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Numeric Content of Different Colors`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.NumericContent/sample/sap.m.sample.NumericContentDifColors` });
    page.numeric_content({ value: `888.8`, scale: `MM`, class: `sapUiSmallMargin`, press: client._event(`press`), truncatevalueto: `4` });
    page.numeric_content({ value: `65.5`, scale: `MM`, valuecolor: `Good`, indicator: `Up`, class: `sapUiSmallMargin`, press: client._event(`press`) });
    page.numeric_content({ value: `6666`, scale: `MM`, valuecolor: `Critical`, indicator: `Up`, class: `sapUiSmallMargin`, press: client._event(`press`) });
    page.numeric_content({ value: `65.5`, scale: `MMill`, valuecolor: `Error`, indicator: `Down`, class: `sapUiSmallMargin`, press: client._event(`press`) });
    page.generic_tile({ class: `sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout`, header: `Country-Specific Profit Margin`, subheader: `Expenses`, press: client._event(`press`) })
      .tile_content({ unit: `EUR`, footer: `Current Quarter` })
      .numeric_content({ scale: `M`, value: `1.96`, valuecolor: `Error`, indicator: `Up`, withmargin: false });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `press`:
        client.message_toast_display(`The numeric content is pressed.`);
        break;
      case `POPOVER`:
        this.popover_display({ id: `hint_icon` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows NumericContent including numbers, units of measurement, and status arrows indicating a trend. ` + `The numbers can be colored according to their meaning.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_262;
