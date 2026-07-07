const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

class z2ui5_cl_demo_app_064 extends z2ui5_if_app {
  mt_mapping = [];
  mv_search_value = ``;
  mt_table = [];
  lv_selkz = false;
  mv_check_active = false;
  screen = { progress_value: `0`, display_value: `` };
  mv_percent = 0;
  mv_check_enabled = false;
  client = null;

  set_selkz({ iv_selkz } = {}) {
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const fs_ls_table of this.mt_table) {
      sy_tabix++;
      fs_ls_table.selkz = iv_selkz;
    }
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let lt_arg = [];
    let ls_arg = ``;
    if (this.client.check_on_event(`LOAD`)) {
      this.mv_percent = this.mv_percent + 25;
      this.mv_check_active = true;
      this.mv_check_enabled = false;
      if (this.mv_percent > 100) {
        this.mv_percent = 0;
        this.mv_check_active = false;
        this.mv_check_enabled = true;
      }
      this.client.message_toast_display(`loaded`);
      // TODO(abap2js): WAIT UP TO 2 SECONDS.
      if (this.mv_check_active === true) {
        this.client.action.gen({ val: z2ui5_if_client.cs_event.start_timer, t_arg: [this.client._event(`LOAD`), `0`] });
      }
      this.client.view_model_update();
    }
  }

  on_init() {
    let temp1 = [];
    let view = null;
    let page1 = null;
    let temp5 = false;
    let layout = null;
    temp1 = {};
    this.mv_check_enabled = true;
    view = z2ui5_cl_xml_view.factory();
    temp5 = this.client.check_app_prev_stack();
    page1 = view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Progress Bar while Server Request`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: temp5, class: `sapUiContentPadding` });
    layout = page1.vertical_layout({ class: `sapuicontentpadding`, width: `100%` });
    layout.vbox()
      .progress_indicator({ percentvalue: this.client._bind_edit(this.mv_percent), displayvalue: this.client._bind_edit(this.screen.display_value), showvalue: true, state: `Success` });
    layout.button({ text: `Load`, press: this.client._event(`LOAD`), enabled: this.client._bind(this.mv_check_enabled) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_064;
