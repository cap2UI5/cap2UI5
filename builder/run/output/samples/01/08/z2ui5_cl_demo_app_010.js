const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_010 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Demo Layout`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content().button({ text: `button` });
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
    let grid = page.grid(`L4 M4 S4`).content(`layout`);
    grid.simple_form(`Grid width 33%`).content(`form`).button({ text: `button` }).text(`text`).link({ text: `link` });
    grid.simple_form(`Grid width 33%`).content(`form`).button({ text: `button` }).text(`text`).link({ text: `link` });
    grid.simple_form(`Grid width 33%`).content(`form`).button({ text: `button` }).text(`text`).link({ text: `link` });
    grid = page.grid(`L12 M12 S12`).content(`layout`);
    grid.simple_form(`grid width 100%`).content(`form`).button({ text: `button` }).text(`text`).link({ text: `link` });
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
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_010;
