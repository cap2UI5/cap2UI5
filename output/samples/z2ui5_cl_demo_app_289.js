const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_289 extends z2ui5_if_app {
  lt_a_data = [];
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Object Marker in a table`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ObjectMarker/sample/sap.m.sample.ObjectMarker` });
    page.table({ id: `idProductsTable`, items: client._bind(this.lt_a_data) })
      .columns()
      .column()
      .text(`Products`)
      .get_parent()
      .column()
      .text(`Status`)
      .get_parent()
      .column()
      .text(`Status (active)`)
      .get_parent()
      .get_parent()
      .column_list_item()
      .object_identifier({ text: `{PRODUCT}` })
      .get_parent()
      .object_marker({ type: `{TYPE}`, additionalinfo: `{ADDITIONALINFO}` })
      .get_parent()
      .object_marker({ type: `{TYPE}`, additionalinfo: `{ADDITIONALINFO}`, press: client._event(`onPress`, [`\${TYPE}`]) });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `onPress`:
        client.message_toast_display(`${client.get_event_arg(1)} marker pressed!`);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The ObjectMarker is a small building block representing an object by an icon or text and icon. Often it is used in a table.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.lt_a_data = [{ product: `Power Projector 4713`, type: `Locked` }, { product: `Power Projector 4713`, type: `LockedBy`, additionalinfo: `John Doe` }, { product: `Power Projector 4713`, type: `LockedBy` }, { product: `Gladiator MX`, type: `Draft` }, { product: `Hurricane GX`, type: `Unsaved` }, { product: `Hurricane GX`, type: `UnsavedBy`, additionalinfo: `John Doe` }, { product: `Hurricane GX`, type: `UnsavedBy` }, { product: `Hurricane GX`, type: `Unsaved` }, { product: `Webcam`, type: `Favorite` }, { product: `Deskjet Super Highspeed`, type: `Flagged` }];
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_289;
