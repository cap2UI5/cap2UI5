const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_283 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    let base_url = `https://sapui5.hana.ondemand.com/`;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Feed Input`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: base_url + `sdk/#/entity/sap.m.FeedInput/sample/sap.m.sample.FeedInput` });
    page.label({ text: `Without Icon`, class: `sapUiSmallMarginTop sapUiTinyMarginBottom` });
    page.feed_input({ post: client._event(`onPost`, [`\${$source>/value}`]), showicon: false });
    page.label({ text: `With Icon Placeholder`, class: `sapUiSmallMarginTop sapUiTinyMarginBottom` });
    page.feed_input({ post: client._event(`onPost`, [`\${$source>/value}`]), showicon: true });
    page.label({ text: `With Icon Placeholder`, class: `sapUiSmallMarginTop sapUiTinyMarginBottom` });
    page.feed_input({ post: client._event(`onPost`, [`\${$source>/value}`]), showicon: true, icon: base_url + `test-resources/sap/m/images/george_washington.jpg` });
    page.label({ text: `Disabled`, class: `sapUiSmallMarginTop sapUiTinyMarginBottom` });
    page.feed_input({ post: client._event(`onPost`, [`\${$source>/value}`]), enabled: false, showicon: true, icon: base_url + `test-resources/sap/m/images/george_washington.jpg` });
    page.label({ text: `Rows Set to 5`, class: `sapUiSmallMarginTop sapUiTinyMarginBottom` });
    page.feed_input({ post: client._event(`onPost`, [`\${$source>/value}`]), rows: `5` });
    page.label({ text: `With Exceeded Text`, class: `sapUiSmallMarginTop sapUiTinyMarginBottom` });
    page.feed_input({ post: client._event(`onPost`, [`\${$source>/value}`]), maxlength: `20`, showexceededtext: true });
    page.label({ text: `With Growing`, class: `sapUiSmallMarginTop sapUiTinyMarginBottom` });
    page.feed_input({ post: client._event(`onPost`, [`\${$source>/value}`]), growing: true });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `onPost`:
        client.message_toast_display(`Posted new feed entry: ${client.get_event_arg()}`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This sample shows a standalone feed input with different settings.` });
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

module.exports = z2ui5_cl_demo_app_283;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

