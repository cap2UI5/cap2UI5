const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_094 extends z2ui5_if_app {
  ms_screen = {};
  mr_input = null;
  mr_screen = null;
  mo_app = null;
  mv_val = ``;
  client = null;
  page = null;

  on_init() {
    let sy_subrc = 0;
    let fs_input = null;
    let _fs$fs_input = null;
    let fs_screen = null;
    let _fs$fs_screen = null;
    this.ms_screen.input = `structure level 01 - working`;
    // TODO(abap2js): CREATE DATA mr_input TYPE string.
    // TODO(abap2js): ASSIGN mr_input->* TO <input>.
    fs_input = `ref data - working`;
    if (_fs$fs_input) _fs$fs_input.o[_fs$fs_input.k] = fs_input;
    // TODO(abap2js): CREATE DATA mr_screen TYPE ty_s_01.
    // TODO(abap2js): ASSIGN mr_screen->* TO <screen>.
    fs_screen.input = `ref data struc - working`;
    this.ms_screen.ty_s_02.input = `struc deep dissolve - working`;
    this.ms_screen.ty_s_02.ty_s_03.ty_s_04.input = `struc deep switch guid name - working`;
    this.mo_app = /* TODO(abap2js): NEW #( ) */ null;
    this.mo_app.mv_val = `instance attribute val - working`;
    this.mo_app.ms_screen.input = `instance attribute struc - working`;
  }

  view_build() {
    let sy_subrc = 0;
    let fs_input = null;
    let _fs$fs_input = null;
    let fs_screen = null;
    let _fs$fs_screen = null;
    // TODO(abap2js): ASSIGN mr_input->* TO <input>.
    // TODO(abap2js): ASSIGN mr_screen->* TO <screen>.
    this.page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `test`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const o_grid = this.page.grid(`L6 M12 S12`).content(`layout`);
    const content = o_grid.simple_form(`Input`).content(`form`);
    content.label(`structure level 01`)
      .input(this.client._bind_edit(this.ms_screen.input, { name: `ms_screen-input` }))
      .label(`ref data`)
      .input(this.client._bind_edit(fs_input))
      .label(`ref data struc field`)
      .input(this.client._bind_edit(fs_screen.input))
      .label(`struc deep dissolve`)
      .input(this.client._bind_edit(this.ms_screen.ty_s_02.input, { name: `ms_screen-ty_s_02-input` }))
      .label(`struc deep switch guid name`)
      .input(this.client._bind_edit(this.ms_screen.ty_s_02.ty_s_03.ty_s_04.input, { name: `ms_screen-ty_s_02-ty_s_03-ty_s_04-input` }))
      .label(`instance attribute val`)
      .input(this.client._bind_edit(this.mo_app.mv_val, { name: `mo_app-mv_val` }))
      .label(`instance attribute struc`)
      .input(this.client._bind_edit(this.mo_app.ms_screen.input, { name: `mo_app-ms_screen-input` }));
    this.page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Delete`, press: this.client._event(`BUTTON_DELETE`), type: `Reject`, icon: `sap-icon://delete` })
      .button({ text: `Add`, press: this.client._event(`BUTTON_ADD`), type: `Default`, icon: `sap-icon://add` })
      .button({ text: `Save`, press: this.client._event(`BUTTON_SAVE`), type: `Success` });
    this.client.view_display(this.page.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
    this.view_build();
    client.message_toast_display(`server roundtrip`);
  }
}

module.exports = z2ui5_cl_demo_app_094;
