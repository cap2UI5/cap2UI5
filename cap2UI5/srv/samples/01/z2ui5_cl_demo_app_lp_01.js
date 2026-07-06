const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_lp_01 extends z2ui5_if_app {
  async main(client) {
    if (client.check_on_init()) {
      if (client.get().CHECK_LAUNCHPAD_ACTIVE === false) {
        client.message_box_display(`No Launchpad Active, Sample not working!`);
      }
      const view = z2ui5_cl_xml_view.factory();
      const page = view.shell().page({ showheader: false });
      client.view_display(page.simple_form({ title: `Laucnhpad I - Read Startup Parameters`, editable: true }).content(`form`).label(``).button({ text: `Read Parameters`, press: client._event(`READ_PARAMS`) }).label(``).button({ text: `Go Back`, press: client._event_nav_app_leave() }).stringify());
    }
    switch (client.get().EVENT) {
      case `READ_PARAMS`:
        let lv_text = `Start Parameter: `;
        const lt_params = client.get().T_COMP_PARAMS;
        let sy_tabix = 0;
        for (const ls_param of lt_params) {
          sy_tabix++;
          lv_text = `${lv_text} / ${ls_param.n} = ${ls_param.v}`;
        }
        client.message_box_display(lv_text);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_lp_01;
