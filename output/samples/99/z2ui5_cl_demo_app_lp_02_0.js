const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_lp_02_0 extends z2ui5_if_app {
  mv_title = `my title`;

  async main(client) {
    let sy_tabix = 0;
    let shell;
    let page;
    let lv_text;
    let lt_params;
    if (client.check_on_init()) {
      if (!((client.get().CHECK_LAUNCHPAD_ACTIVE) === true || (client.get().CHECK_LAUNCHPAD_ACTIVE) === `X`)) {
        client.message_box_display(`No Launchpad Active, Sample not working!`);
      }
      shell = z2ui5_cl_xml_view.factory().shell();
      if (((client.get().CHECK_LAUNCHPAD_ACTIVE) === true || (client.get().CHECK_LAUNCHPAD_ACTIVE) === `X`)) {
        page = shell.page({ showheader: false });
        page._z2ui5().lp_title(client._bind_edit(this.mv_title));
      } else {
        page = shell.page(client._bind_edit(this.mv_title));
      }
      client.view_display(page.simple_form({ title: `Set Launchpad Title Dynamically`, editable: true }).content(`form`).label(``).input(client._bind_edit(this.mv_title)).label(``).button({ text: `Go Back`, press: client._event_nav_app_leave() }).stringify());
    }
    switch (client.get().EVENT) {
      case `READ_PARAMS`:
        lv_text = `Start Parameter: `;
        lt_params = client.get().T_COMP_PARAMS;
        sy_tabix = 0;
        for (const ls_param of lt_params) {
          sy_tabix++;
          lv_text = `${lv_text} / ${ls_param.n} = ${ls_param.v}`;
        }
        client.message_box_display(lv_text);
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_lp_02_0;
