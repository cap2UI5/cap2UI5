const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_290 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Object List Item - markers aggregation`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ObjectListItem/sample/sap.m.sample.ObjectListItemMarkers` });
    page.list({ headertext: `Products` })
      .object_list_item({ title: `Gladiator MX`, type: `Active`, press: client._event(`onListItemPress`, [`\${$source>/title}`]), number: `87.50`, numberunit: `EUR` })
      .first_status()
      .object_status({ text: `Available`, state: `Success` })
      .get_parent()
      .get_parent()
      .object_attribute({ text: `125 g` })
      .object_attribute({ text: `145 x 140 x 360 cm` })
      .markers()
      .object_marker({ type: `Favorite` })
      .get_parent()
      .object_marker({ type: `Flagged` })
      .get_parent()
      .get_parent()
      .get_parent()
      .object_list_item({ title: `Hurricane GX`, type: `Active`, press: client._event(`onListItemPress`, [`\${$source>/title}`]), number: `235`, numberunit: `EUR` })
      .first_status()
      .object_status({ text: `Out of stock`, state: `Warning` })
      .get_parent()
      .get_parent()
      .object_attribute({ text: `34 g` })
      .object_attribute({ text: `45 x 14 x 36 cm` })
      .markers()
      .object_marker({ type: `Flagged` })
      .get_parent()
      .object_marker({ type: `Locked` })
      .get_parent()
      .get_parent()
      .get_parent()
      .object_list_item({ title: `Power Projector 4713`, type: `Active`, press: client._event(`onListItemPress`, [`\${$source>/title}`]), number: `135`, numberunit: `EUR` })
      .first_status()
      .object_status({ text: `Discontinued`, state: `Error` })
      .get_parent()
      .get_parent()
      .object_attribute({ text: `67 g` })
      .object_attribute({ text: `425 x 35 x 30 cm` })
      .markers()
      .object_marker({ type: `Favorite` })
      .get_parent()
      .object_marker({ type: `Locked` })
      .get_parent()
      .object_marker({ type: `Draft` })
      .get_parent()
      .get_parent()
      .get_parent()
      .object_list_item({ title: `Webcam`, type: `Active`, press: client._event(`onListItemPress`, [`\${$source>/title}`]), number: `15`, numberunit: `EUR` })
      .first_status()
      .object_status({ text: `New` })
      .get_parent()
      .get_parent()
      .object_attribute({ text: `67 g` })
      .object_attribute({ text: `15 x 15 x 10 cm` })
      .markers()
      .object_marker({ type: `Unsaved` })
      .get_parent()
      .get_parent()
      .get_parent();
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `onListItemPress`:
        client.message_toast_display(`Pressed: ${client.get_event_arg(1)}`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This sample shows the different states of an Object List Item, which can be set using the markers aggregation.` });
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

module.exports = z2ui5_cl_demo_app_290;
