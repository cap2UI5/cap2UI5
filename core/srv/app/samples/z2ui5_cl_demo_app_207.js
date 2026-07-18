const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_207 extends z2ui5_if_app {
  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Radio Button`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.RadioButton/sample/sap.m.sample.RadioButton` });
    const layout = page.vbox(`sapUiSmallMargin`)
      .label({ text: `Default RadioButton use`, labelfor: `GroupA` })
      .radio_button_group({ id: `GroupA` })
      .radio_button({ text: `Option 1`, selected: true })
      .get_parent()
      .radio_button({ text: `Option 2` })
      .get_parent()
      .radio_button({ text: `Option 3` })
      .get_parent()
      .radio_button({ text: `Option 4` })
      .get_parent()
      .radio_button({ text: `Option 5` })
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiSmallMargin`)
      .label(`RadioButton in various ValueState variants`)
      .hbox({ class: `sapUiTinyMarginTopBottom` })
      .vbox(`sapUiMediumMarginEnd`)
      .label({ text: `Success`, labelfor: `GroupB` })
      .radio_button_group({ id: `GroupB`, valuestate: `Success` })
      .radio_button({ text: `Option 1`, selected: true })
      .get_parent()
      .radio_button({ text: `Option 2` })
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiMediumMarginEnd`)
      .label({ text: `Error`, labelfor: `GroupC` })
      .radio_button_group({ id: `GroupC`, valuestate: `Error` })
      .radio_button({ text: `Option 1`, selected: true })
      .get_parent()
      .radio_button({ text: `Option 2` })
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiMediumMarginEnd`)
      .label({ text: `Warning`, labelfor: `GroupD` })
      .radio_button_group({ id: `GroupD`, valuestate: `Warning` })
      .radio_button({ text: `Option 1`, selected: true })
      .get_parent()
      .radio_button({ text: `Option 2` })
      .get_parent()
      .get_parent()
      .get_parent()
      .vbox(`sapUiMediumMarginEnd`)
      .label({ text: `Information`, labelfor: `GroupE` })
      .radio_button_group({ id: `GroupE`, valuestate: `Information` })
      .radio_button({ text: `Option 1`, selected: true })
      .get_parent()
      .radio_button({ text: `Option 2` })
      .get_parent();
    client.view_display(page.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
  }
}

module.exports = z2ui5_cl_demo_app_207;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

