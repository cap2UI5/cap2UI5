const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_087 extends z2ui5_if_app {
  t_tab = [];
  check_ui5 = false;
  mv_key = ``;

  refresh_data() {
    for (let sy_index = 1; sy_index <= 100; sy_index++) {
      let ls_row = {};
      ls_row.count = sy_index;
      ls_row.value = `red`;
      ls_row.descr = `this is a description`;
      ls_row.checkbox = true;
      ls_row.valuecolor = `Good`;
      this.t_tab.push(ls_row);
    }
  }

  async main(client) {
    if (client.check_on_init()) {
      this.refresh_data();
    }
    switch (client.get().EVENT) {
      case `SORT_ASCENDING`:
        this.t_tab.sort((a, b) => ((a.count > b.count ? 1 : a.count < b.count ? -1 : 0)));
        client.message_toast_display(`sort ascending`);
        break;
      case `SORT_DESCENDING`:
        this.t_tab.sort((a, b) => ((a.count > b.count ? 1 : a.count < b.count ? -1 : 0)) * -1);
        client.message_toast_display(`sort descending`);
        break;
    }
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Table with Cell Copy`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const tab = page.table({ growing: true, growingthreshold: `20`, growingscrolltoload: true, items: client._bind_edit(this.t_tab), sticky: `ColumnHeaders,HeaderToolbar` });
    tab.header_toolbar()
      .toolbar()
      .title(`title of the table`)
      .button({ text: `letf side button`, icon: `sap-icon://account`, press: client._event(`BUTTON_SORT`) })
      .toolbar_spacer()
      .button({ icon: `sap-icon://sort-descending`, press: client._event(`SORT_DESCENDING`) })
      .button({ icon: `sap-icon://sort-ascending`, press: client._event(`SORT_ASCENDING`) });
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
      .text(`Counter`)
      .get_parent()
      .column()
      .text(`Radial Micro Chart`);
    tab.items()
      .column_list_item()
      .cells()
      .text(`{VALUE}`)
      .text(`{INFO}`)
      .text(`{DESCR}`)
      .checkbox({ selected: `{CHECKBOX}`, enabled: false })
      .text(`{COUNT}`);
    tab.dependents();
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_087;
