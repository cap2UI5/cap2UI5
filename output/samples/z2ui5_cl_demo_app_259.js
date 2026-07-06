const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_259 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Button`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Button/sample/sap.m.sample.Button` });
    const page_02 = page_01.page({ title: `Page`, class: `sapUiContentPadding` })
      .custom_header()
      .toolbar()
      .button({ type: `Back`, press: client._event(`onPress`, [`\${$source>/id}`]) })
      .toolbar_spacer()
      .title({ text: `Title`, level: `H2` })
      .toolbar_spacer()
      .button({ icon: `sap-icon://edit`, type: `Transparent`, press: client._event(`onPress`, [`\${$source>/id}`]), arialabelledby: `editButtonLabel` })
      .get_parent()
      .get_parent()
      .sub_header()
      .toolbar()
      .toolbar_spacer()
      .button({ text: `Default`, press: client._event(`onPress`, [`\${$source>/id}`]) })
      .button({ type: `Reject`, text: `Reject`, press: client._event(`onPress`, [`\${$source>/id}`]) })
      .button({ icon: `sap-icon://action`, type: `Transparent`, press: client._event(`onPress`, [`\${$source>/id}`]), arialabelledby: `actionButtonLabel` })
      .toolbar_spacer()
      .get_parent()
      .get_parent()
      .content()
      .hbox()
      .button({ text: `Default`, press: client._event(`onPress`, [`\${$source>/id}`]), ariadescribedby: `defaultButtonDescription genericButtonDescription` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .button({ type: `Accept`, text: `Accept`, press: client._event(`onPress`, [`\${$source>/id}`]), ariadescribedby: `acceptButtonDescription genericButtonDescription` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .button({ type: `Reject`, text: `Reject`, press: client._event(`onPress`, [`\${$source>/id}`]), ariadescribedby: `rejectButtonDescription genericButtonDescription` })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .button({ text: `Coming Soon`, press: client._event(`onPress`, [`\${$source>/id}`]), ariadescribedby: `comingSoonButtonDescription genericButtonDescription`, enabled: false })
      .get()
      .layout_data()
      .flex_item_data({ growfactor: `1` })
      .get_parent()
      .get_parent()
      .get_parent()
      .label({ id: `genericButtonDescription`, text: `Note: The buttons in this sample display MessageToast when pressed.` })
      .invisible_text({ ns: `core`, id: `defaultButtonDescription`, text: `Description of default button goes here.` })
      .get_parent()
      .invisible_text({ ns: `core`, id: `acceptButtonDescription`, text: `Description of accept button goes here.` })
      .get_parent()
      .invisible_text({ ns: `core`, id: `rejectButtonDescription`, text: `Description of reject button goes here.` })
      .get_parent()
      .invisible_text({ ns: `core`, id: `comingSoonButtonDescription`, text: `This feature is not active just now.` })
      .get_parent()
      .invisible_text({ ns: `core`, id: `editButtonLabel`, text: `Edit Button Label` })
      .get_parent()
      .invisible_text({ ns: `core`, id: `actionButtonLabel`, text: `Action Button Label` })
      .get_parent()
      .get_parent()
      .footer()
      .toolbar()
      .toolbar_spacer()
      .button({ type: `Emphasized`, text: `Emphasized`, press: client._event(`onPress`, [`\${$source>/id}`]) })
      .button({ text: `Default`, press: client._event(`onPress`, [`\${$source>/id}`]) })
      .button({ icon: `sap-icon://action`, type: `Transparent`, press: client._event(`onPress`, [`\${$source>/id}`]) })
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
        client.message_toast_display(`${client.get_event_arg(1)} Pressed`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Buttons trigger user actions and come in a variety of shapes and colors. Placing a button on a page header or footer changes its appearance.` });
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

module.exports = z2ui5_cl_demo_app_259;
