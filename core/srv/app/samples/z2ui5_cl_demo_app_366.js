const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_366 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Page - Header, Sub-Header & Footer`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: this.client._event(`CLICK_HINT_ICON`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Page` });
    page.sub_header()
      .overflow_toolbar()
      .button({ text: `button` })
      .text(`text`)
      .link({ text: `link` })
      .toolbar_spacer()
      .text(`subheader`)
      .toolbar_spacer()
      .button({ text: `button` })
      .text(`text`)
      .link({ text: `link` });
    page.simple_form(`Content Area`).content(`form`).button({ text: `button` }).text(`text`).link({ text: `link` });
    page.footer()
      .overflow_toolbar()
      .button({ text: `button` })
      .text(`text`)
      .link({ text: `link` })
      .toolbar_spacer()
      .text(`footer`)
      .toolbar_spacer()
      .text(`text`)
      .link({ text: `link` })
      .button({ text: `reject`, type: `Reject` })
      .button({ text: `accept`, type: `Success` });
    this.client.view_display(page.stringify());
  }

  on_event() {
    if (this.client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The page organizes the screen into header content, sub-header, content area and footer. Header and footer stay fixed while the content scrolls.` });
    this.client.popover_display(view.stringify(), id);
  }
}

module.exports = z2ui5_cl_demo_app_366;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

