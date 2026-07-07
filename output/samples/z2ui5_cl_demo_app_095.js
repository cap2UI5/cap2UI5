const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_095 extends z2ui5_if_app {
  ms_screen = {};
  mo_app_sub = null;
  mo_grid_sub = null;
  mr_input = null;
  mr_screen = null;
  client = null;
  page = null;

  on_event() {
    if (this.client.check_on_event(`BUTTON_SAVE`)) {
      this.client.message_box_display(`event main app`);
    }
  }

  on_event_sub() {
    this.mo_app_sub.mo_view_parent = this.mo_grid_sub;
    this.mo_app_sub.main(this.client);
  }

  on_init() {
    this.ms_screen.input = `app main`;
    this.view_build();
  }

  on_init_sub() {
    this.mo_app_sub = /* TODO(abap2js): NEW #( ) */ null;
    this.mo_app_sub.mo_view_parent = this.mo_grid_sub;
    this.mo_app_sub.main(this.client);
    this.client.view_display(this.page.stringify());
  }

  view_build() {
    this.page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Main App with Sub App`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: true });
    const o_grid = this.page.grid(`L6 M12 S12`).content(`layout`);
    const content = o_grid.simple_form(`Input`).content(`form`);
    content.label(`main app`)
      .input({ value: this.client._bind_edit(this.ms_screen.input, { name: `ms_screen-input` }), submit: this.client._event(`INPUT`) });
    this.mo_grid_sub = this.page.grid(`L12 M12 S12`).content(`layout`);
    this.page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Delete`, press: this.client._event(`BUTTON_DELETE`), type: `Reject`, icon: `sap-icon://delete` })
      .button({ text: `Add`, press: this.client._event(`BUTTON_ADD`), type: `Default`, icon: `sap-icon://add` })
      .button({ text: `Save`, press: this.client._event(`BUTTON_SAVE`), type: `Success` });
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.on_init_sub();
      client.view_display(this.page.stringify());
      return;
    }
    this.on_event();
    this.on_event_sub();
  }
}

module.exports = z2ui5_cl_demo_app_095;
