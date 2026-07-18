const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_228 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Numeric Content Without Margins`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.NumericContent/sample/sap.m.sample.NumericContentWithoutMargin` });
    const layout = page.label(`Numeric content with margins`);
    layout.numeric_content({ value: `65.5`, scale: `MM`, class: `sapUiSmallMargin`, withmargin: true });
    layout.numeric_content({ value: `65.5`, scale: `MM`, valuecolor: `Good`, indicator: `Up`, class: `sapUiSmallMargin`, withmargin: true });
    layout.numeric_content({ value: `6666`, scale: `MM`, valuecolor: `Critical`, indicator: `Up`, class: `sapUiSmallMargin`, withmargin: true });
    layout.numeric_content({ value: `65.5`, scale: `MM`, valuecolor: `Error`, indicator: `Down`, class: `sapUiSmallMargin`, withmargin: true });
    layout.label(`Numeric content without margins`);
    layout.numeric_content({ value: `65.5`, scale: `MM`, class: `sapUiSmallMargin`, withmargin: false });
    layout.numeric_content({ value: `65.5`, scale: `MM`, valuecolor: `Good`, indicator: `Up`, class: `sapUiSmallMargin`, withmargin: false });
    layout.numeric_content({ value: `6666`, scale: `MM`, valuecolor: `Critical`, indicator: `Up`, class: `sapUiSmallMargin`, withmargin: false });
    layout.numeric_content({ value: `65.5`, scale: `MM`, valuecolor: `Error`, indicator: `Down`, class: `sapUiSmallMargin`, withmargin: false });
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_228;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

