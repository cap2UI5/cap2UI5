const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_266 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Toggle Button`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/#/entity/sap.m.ToggleButton/sample/sap.m.sample.ToggleButton` });
    const page_02 = page_01.page({ title: `Page`, class: `sapUiContentPadding` })
      .custom_header()
      .bar()
      .content_middle()
      .title({ level: `H2`, text: `Title` })
      .get_parent()
      .content_right()
      .toggle_button({ icon: `sap-icon://edit`, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .get_parent()
      .get_parent()
      .get_parent()
      .sub_header()
      .bar()
      .content_left()
      .toggle_button({ text: `Pressed`, enabled: true, pressed: true, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .toggle_button({ text: `Pressed & Disabled`, enabled: false, pressed: true, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .get_parent()
      .content_right()
      .toggle_button({ icon: `sap-icon://action`, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .toggle_button({ icon: `sap-icon://home`, enabled: false, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .get_parent()
      .get_parent()
      .get_parent()
      .hbox()
      .toggle_button({ text: `Disabled`, enabled: `false`, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .toggle_button({ text: `Pressed`, enabled: true, pressed: true, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .toggle_button({ icon: `sap-icon://action`, enabled: true, pressed: true, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .get_parent()
      .footer()
      .bar()
      .content_right()
      .toggle_button({ text: `Pressed & Disabled`, enabled: false, pressed: true, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .toggle_button({ icon: `sap-icon://action`, press: client._event(`onPress`, [`\${$source>/pressed}`, `\${$source>/id}`]) })
      .get_parent()
      .get_parent()
      .get_parent();
    client.view_display(page_02.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `onPress`:
        if (client.get_event_arg(1) === `X`) {
          client.message_toast_display(`${client.get_event_arg(2)} Pressed`);
        } else {
          client.message_toast_display(`${client.get_event_arg(2)} Unpressed`);
        }
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Toggle Buttons can be toggled between pressed and normal state.` });
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

module.exports = z2ui5_cl_demo_app_266;
