const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_199 extends z2ui5_if_app {
  mt_table = null;
  mv_counter = ``;
  mt_comp = [];
  client = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `CLEAR`:
        this.refresh_data();
        this.client.view_model_update();
        break;
      case `ADD`:
        this.add_data();
        this.client.view_model_update();
        break;
    }
  }

  on_init() {
    this.refresh_data();
    this.view_display();
  }

  view_display() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    const view = z2ui5_cl_xml_view.factory();
    // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
    const page = view.page({ id: `page_main`, title: `Refresh`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    const table = page.table({ growing: `true`, width: `auto`, items: this.client._bind_edit(fs_tab) });
    const columns = table.columns();
    sy_tabix = 0;
    for (const comp of this.mt_comp) {
      sy_tabix++;
      columns.column().text(comp.name);
    }
    const cells = columns.get_parent().items().column_list_item({ valign: `Middle`, type: `Navigation` }).cells();
    sy_tabix = 0;
    for (const comp of this.mt_comp) {
      sy_tabix++;
      cells.object_identifier({ text: `{${comp.name}}` });
    }
    page.button({ text: `Clear`, press: this.client._event(`CLEAR`) })
      .button({ text: `Add`, press: this.client._event(`ADD`) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.on_init();
    }
    // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
    if (this.mv_counter !== fs_tab.length && this.mv_counter) {
      client.message_box_display(`Frontend Lines <> Backend!`, `error`);
    }
    this.on_event();
  }

  refresh_data() {
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    try {
      // TODO(abap2js): CREATE DATA mt_table TYPE STANDARD TABLE OF z2ui5_t_01.
      // TODO(abap2js): ASSIGN mt_table->* TO <table>.
      this.mt_comp = z2ui5_cl_util.rtti_get_t_attri_by_any(fs_table);
      // TODO(abap2js): SELECT id, id_prev FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF TABLE @<table> UP TO 2 ROWS.
      this.mv_counter = 2;
    } catch (error) {
    }
  }

  add_data() {
    let sy_subrc = 0;
    let fs_tab = null;
    let _fs$fs_tab = null;
    // TODO(abap2js): ASSIGN mt_table->* TO <tab>.
    fs_tab.push(...fs_tab);
    this.mv_counter = z2ui5_cl_util.abap_copy(fs_tab.length);
  }
}

module.exports = z2ui5_cl_demo_app_199;
