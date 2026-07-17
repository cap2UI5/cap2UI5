const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_045 extends z2ui5_if_app {
  t_tab = [];
  mv_info_filter = ``;

  refresh_data() {
    let ls_row;
    for (let sy_index = 1; sy_index <= 1000; sy_index++) {
      ls_row = { count: sy_index, value: `red`, info: (sy_index < 50 ? `completed` : `uncompleted`), descr: `this is a description`, checkbox: true };
      this.t_tab.push(ls_row);
    }
  }

  async main(client) {
    if (client.check_on_init()) {
      this.refresh_data();
    }
    switch (client.get().EVENT) {
      case `FILTER_INFO`:
        this.refresh_data();
        if (this.mv_info_filter !== ``) {
          for (let _i = this.t_tab.length - 1; _i >= 0; _i--) { const row = this.t_tab[_i]; if (row.info !== this.mv_info_filter) this.t_tab.splice(_i, 1); }
        }
        break;
      case `BUTTON_POST`:
        client.message_box_display(`button post was pressed`);
        break;
    }
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Scroll Container with Table and Toolbar`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      .header_content()
      .link()
      .get_parent();
    page.simple_form({ title: `Form Title`, editable: true })
      .content(`form`)
      .title(`Filter`)
      .label(`info`)
      .input(client._bind_edit(this.mv_info_filter))
      .button({ text: `filter`, press: client._event(`FILTER_INFO`) });
    const tab = page.scroll_container({ height: `70%`, vertical: true })
      .table({ growing: true, growingthreshold: `20`, growingscrolltoload: true, items: client._bind(this.t_tab), sticky: `ColumnHeaders,HeaderToolbar` });
    tab.header_toolbar().overflow_toolbar().toolbar_spacer();
    tab.columns()
      .column()
      .text(`Color`)
      .get_parent()
      .column()
      .text(`Info`)
      .get_parent()
      .column()
      .text(`Description`)
      .get_parent()
      .column()
      .text(`Checkbox`)
      .get_parent()
      .column()
      .text(`Counter`);
    tab.items()
      .column_list_item()
      .cells()
      .text(`{VALUE}`)
      .text(`{INFO}`)
      .text(`{DESCR}`)
      .checkbox({ selected: `{CHECKBOX}`, enabled: false })
      .text(`{COUNT}`);
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_045;
