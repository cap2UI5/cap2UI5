const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_336 extends z2ui5_if_app {
  ms_struc = [];
  mo_layout_obj = null;
  mo_layout_obj_2 = null;

  async main(client) {
    if (client.check_on_init()) {
      this.mo_layout_obj = z2ui5_cl_demo_app_333.factory({ i_data: (this.ms_struc), vis_cols: 3 });
      this.mo_layout_obj_2 = z2ui5_cl_demo_app_333.factory({ i_data: (this.ms_struc), vis_cols: 3 });
      this.view_display({ client: client });
    }
    client.view_model_update();
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `BACK`, press: client._event_nav_app_leave(), type: `Success` });
    client.view_display(page.stringify());
  }

  static factory() {
    let result = null;
    result = new z2ui5_cl_demo_app_336();
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_336;
