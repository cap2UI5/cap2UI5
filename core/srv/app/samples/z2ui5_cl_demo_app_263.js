const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_263 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Numeric Content with Icon`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.NumericContent/sample/sap.m.sample.NumericContentIcon` });
    page.numeric_content({ value: `65`, scale: `MM`, valuecolor: `Error`, indicator: `Down`, icon: `sap-icon://travel-expense`, class: `sapUiSmallMargin`, press: client._event(`press`) });
    page.numeric_content({ value: `11`, scale: `MM`, valuecolor: `Critical`, indicator: `Up`, icon: `test-resources/sap/m/demokit/sample/NumericContentIcon/images/grass.jpg`, class: `sapUiSmallMargin`, press: client._event(`press`) });
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
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Shows NumericContent including an icon.` });
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

module.exports = z2ui5_cl_demo_app_263;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

