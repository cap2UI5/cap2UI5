const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_252 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Flex Box - Render Type`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.FlexBox/sample/sap.m.sample.FlexBoxRenderType` });
    const layout = page.vbox()
      .panel({ headertext: `Render Type - Div` })
      .flex_box({ rendertype: `Div` })
      .button({ text: `Some text`, type: `Emphasized`, class: `sapUiSmallMarginEnd` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `3` })
      .get_parent()
      .get_parent()
      .input({ value: `Some value`, width: `auto`, class: `sapUiSmallMarginEnd` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `2` })
      .get_parent()
      .get_parent()
      .button({ icon: `sap-icon://download` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .panel({ headertext: `Render Type - Bare` })
      .flex_box({ rendertype: `Bare` })
      .button({ text: `Some text`, type: `Emphasized`, class: `sapUiSmallMarginEnd` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `3` })
      .get_parent()
      .get_parent()
      .input({ value: `Some value`, width: `auto`, class: `sapUiSmallMarginEnd` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `2` })
      .get_parent()
      .get_parent()
      .button({ icon: `sap-icon://download` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent();
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `hint_icon` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Flex items can be rendered differently. By default, they are wrapped in a div element. ` + `Optionally, the bare controls can be rendered directly. This can affect the resulting layout.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_252;
