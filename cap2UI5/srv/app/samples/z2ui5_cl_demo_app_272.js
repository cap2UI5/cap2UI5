const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_272 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    let base_url = ``;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Object Header with Circle-shaped Image`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      .object_page_layout({ showtitleinheadercontent: true });
    const header = page.header_title()
      .object_page_header({ objecttitle: `Denise Smith`, objectsubtitle: `Senior Developer`, objectimageuri: base_url + `test-resources/sap/m/images/Woman_04.png`, objectimageshape: `Circle`, objectimagedensityaware: false, objectimagealt: `Denise Smith` });
    header.attributes(`uxap`)
      .object_attribute({ title: `Email address`, text: `DeniseSmith@sap.com`, active: true })
      .object_attribute({ title: `Office Phone`, text: `+33 6 453 564` })
      .object_attribute({ title: `Functional Area`, text: `Development` });
    page.header_content(`uxap`)
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page.header_content(`uxap`)
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: base_url + `sdk/#/api/sap.uxap.ObjectPageHeader` });
    client.view_display(view.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `sap.uxap.ObjectPageHeader is the successor of the deprecated sap.m.ObjectHeader. ` + `The image shape is set via the 'objectImageShape' property (Square by default or ` + `Circle). The object attributes are provided through the 'attributes' aggregation.` });
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

module.exports = z2ui5_cl_demo_app_272;
