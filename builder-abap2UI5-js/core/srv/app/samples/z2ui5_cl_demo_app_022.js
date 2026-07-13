const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_022 extends z2ui5_if_app {
  progress_value = ``;

  async main(client) {
    let view;
    if (client.check_on_init()) {
      this.progress_value = `3`;
      view = z2ui5_cl_xml_view.factory();
      view.shell()
        .page({ title: `abap2UI5 - Progress Indicator Example`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
        .vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
        .label(`ProgressIndicator`)
        .progress_indicator({ percentvalue: client._bind(this.progress_value), displayvalue: `0,44GB of 32GB used`, showvalue: true, state: `Success` });
      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_demo_app_022;
