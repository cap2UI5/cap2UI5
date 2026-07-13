const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_069 extends z2ui5_if_app {
  mt_tree = [];
  mv_check_enabled_01 = true;
  mv_check_enabled_02 = false;
  client = null;

  view_display_app_01() {
    const lo_view_nested = z2ui5_cl_xml_view.factory();
    const page = lo_view_nested.page(`APP_01`);
    page.button({ text: `Update this view`, press: this.client._event(`UPDATE_DETAIL`) });
    this.client.nest_view_display(lo_view_nested.stringify(), `test`, `addMidColumnPage`, `removeAllMidColumnPages`);
  }

  view_display_app_02() {
    const lo_view_nested = z2ui5_cl_xml_view.factory();
    const page = lo_view_nested.page(`APP_02`);
    page.button({ text: `Update this view`, press: this.client._event(`UPDATE_DETAIL`) }).input();
    page.button({ text: `button 01`, press: this.client._event(`NEST_TEST`), enabled: this.client._bind(this.mv_check_enabled_01) });
    page.button({ text: `button 01`, press: this.client._event(`NEST_TEST`), enabled: this.client._bind(this.mv_check_enabled_01) });
    page.button({ text: `button 02`, press: this.client._event(`NEST_TEST`), enabled: this.client._bind(this.mv_check_enabled_02) });
    this.client.nest_view_display(lo_view_nested.stringify(), `test`, `addMidColumnPage`, `removeAllMidColumnPages`);
  }

  view_display_master() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Master-Detail View with Nested Views`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const lr_master = page.flexible_column_layout({ layout: `TwoColumnsBeginExpanded`, id: `test` })
      .begin_column_pages();
    lr_master.tree(this.client._bind(this.mt_tree))
      .items()
      .standard_tree_item({ type: `Active`, title: `{TEXT}`, press: this.client._event(`EVENT_ITEM`, [`\${TEXT}`]) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.mt_tree = [{ text: `Apps`, nodes: [{ text: `Frontend`, nodes: [{ text: `App_001` }, { text: `App_002` }] }] }, { text: `Configuration`, nodes: [{ text: `User Interface`, nodes: [{ text: `Theme` }, { text: `Library` }] }, { text: `Database`, nodes: [{ text: `HANA` }, { text: `ANY DB` }] }] }];
      this.view_display_master();
    }
    switch (client.get().EVENT) {
      case `UPDATE_DETAIL`:
        this.view_display_app_01();
        break;
      case `EVENT_ITEM`:
        switch (client.get_event_arg(1)) {
          case `App_001`:
            this.view_display_app_01();
            break;
          case `App_002`:
            this.view_display_app_02();
            break;
        }
        break;
      case `NEST_TEST`:
        this.mv_check_enabled_01 = (!(this.mv_check_enabled_01 === true || this.mv_check_enabled_01 === `X`));
        this.mv_check_enabled_02 = (!(this.mv_check_enabled_01 === true || this.mv_check_enabled_01 === `X`));
        client.nest_view_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_069;
