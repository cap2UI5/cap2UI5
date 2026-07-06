const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_lp_03 extends z2ui5_if_app {
  nav_params = { product: ``, quantity: `` };

  async main(client) {
    if (client.check_on_init()) {
      this.nav_params.product = `102343333`;
      if (client.get().CHECK_LAUNCHPAD_ACTIVE === false) {
        client.message_box_display(`No Launchpad Active, Sample not working!`);
      }
      const view = z2ui5_cl_xml_view.factory();
      client.view_display(view.shell().page({ showheader: /* TODO(abap2js) */ xsdbool(false === client.get().CHECK_LAUNCHPAD_ACTIVE), title: `abap2UI5 - Cross App Navigation App 127 - This App only works when started via Launchpad`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).header_content().link({ text: `Source_Code`, target: `_blank` }).get_parent().simple_form({ title: `App 127`, editable: true }).content(`form`).label(`Product`).input(client._bind_edit(this.nav_params.product)).button({ text: `BACK`, press: client._event_client(client.cs_event.cross_app_nav_to_prev_app) }).button({ text: `go to app 128`, press: client._event_client(client.cs_event.cross_app_nav_to_ext, [`{ semanticObject: "Z2UI5_CL_LP_SAMPLE_04", action: "display" }`, `$` + client._bind_edit(this.nav_params)]) }).stringify());
    }
    switch (client.get().EVENT) {
      case `BUTTON_POST`:
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_lp_03;
