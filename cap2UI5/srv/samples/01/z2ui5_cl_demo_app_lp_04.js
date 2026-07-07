const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_lp_04 extends z2ui5_if_app {
  product = ``;
  product_url = ``;
  quantity = ``;
  check_launchpad_active = false;

  async main(client) {
    const view = z2ui5_cl_xml_view.factory();
    this.product_url = z2ui5_cl_util.url_param_get({ val: `product`, url: client.get().S_CONFIG.SEARCH });
    this.check_launchpad_active = z2ui5_cl_util.struct_lower_keys(client.get().CHECK_LAUNCHPAD_ACTIVE);
    const lt_params = client.get().T_COMP_PARAMS;
    try {
      this.product = lt_params.find((row) => row.n === `PRODUCT`).V;
    } catch (error) {
    }
    if (client.check_on_init()) {
      this.quantity = `500`;
      client.view_display(view.shell().page({ showheader: (false === client.get().CHECK_LAUNCHPAD_ACTIVE), title: `abap2UI5 - Cross App Navigation App 128`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() }).header_content().link({ text: `Source_Code`, target: `_blank` }).get_parent().simple_form({ title: `App 128`, editable: true }).content(`form`).title(`Input`).label(`product nav param`).input(client._bind_edit(this.product)).label(`CHECK_LAUNCHPAD_ACTIVE`).input(this.check_launchpad_active).button({ press: client._event() }).button({ text: `BACK`, press: client._event_client(client.cs_event.cross_app_nav_to_prev_app) }).button({ text: `go to app 127`, press: client._event_client(client.cs_event.cross_app_nav_to_ext, [`{ semanticObject: "Z2UI5_CL_LP_SAMPLE_03", action: "display" }`, `{ ProductID : "123234" }`]) }).stringify());
    }
    client.view_model_update();
    switch (client.get().EVENT) {
      case `BUTTON_POST`:
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_lp_04;
