const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_308 extends z2ui5_if_app {
  async main(client) {
    let view;
    let page;
    if (client.check_on_init()) {
      view = z2ui5_cl_xml_view.factory();
      page = view.shell()
        .page({ title: `Harvey Chart`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
      page.harvey_ball_micro_chart({ size: `L`, total: `10`, totallabel: `11`, showfractions: true, showtotal: true, totalscale: true })
        .harveyballmicrochartitem({ color: `Good`, fraction: `8`, fractionscale: `Mrd` });
      client.view_display(view.stringify());
    }
  }
}

module.exports = z2ui5_cl_demo_app_308;
