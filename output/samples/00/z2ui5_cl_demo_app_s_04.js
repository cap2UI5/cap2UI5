const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_s_04 extends z2ui5_if_app {
  unit = null;
  numc = null;
  numc_out = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
      this.set_data();
    }
  }

  view_display({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    client.view_display(view.shell().page({ title: `abap2UI5 - Conversion Exit`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).simple_form({ title: `Form Title`, editable: true }).content(`form`).title(`Conversion`).label(`Numeric`).input({ value: client._bind_edit(this.numc_out), enabled: false }).label(`Unit`).input({ value: client._bind_edit(this.unit), enabled: false }).stringify());
  }

  set_data() {
    this.unit = `ST`;
    this.numc = 10;
    try {
      // TODO(abap2js): CALL FUNCTION `CONVERSION_EXIT_CUNIT_OUTPUT` EXPORTING input = unit IMPORTING output = unit EXCEPTIONS OTHERS = 99.
      // TODO(abap2js): CALL FUNCTION `CONVERSION_EXIT_ALPHA_OUTPUT` EXPORTING input = numc IMPORTING output = numc_out EXCEPTIONS OTHERS = 99.
    } catch (error) {
    }
  }
}

module.exports = z2ui5_cl_demo_app_s_04;
