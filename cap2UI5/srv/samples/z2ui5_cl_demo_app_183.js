const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_183 extends z2ui5_if_app {
  t_tab = [];
  check_ui5 = false;
  mv_key = ``;
  sortorder = `None`;

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
      case `GET_OPENED_COL`:
        let lt_arg = client.get().T_EVENT_ARG;
        return;
        break;
      case `ONSORT`:
        lt_arg = client.get().T_EVENT_ARG;
        break;
      case `ONGROUP`:
        break;
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
      .page({ title: `abap2UI5 - table with column menu (press a column header)`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const tab = page.scroll_container({ height: `70%`, vertical: true })
      .table({ growing: true, growingthreshold: `20`, growingscrolltoload: true, items: client._bind_edit(this.t_tab), sticky: `ColumnHeaders,HeaderToolbar` });
    tab.header_toolbar()
      .toolbar()
      .title(`title of the table`)
      .button({ text: `letf side button`, icon: `sap-icon://account`, press: client._event(`BUTTON_SORT`) })
      .segmented_button(this.mv_key)
      .items()
      .segmented_button_item({ key: `BLUE`, icon: `sap-icon://accept`, text: `blue` })
      .segmented_button_item({ key: `GREEN`, icon: `sap-icon://add-favorite`, text: `green` })
      .get_parent()
      .get_parent()
      .toolbar_spacer()
      .button({ icon: `sap-icon://sort-descending`, press: client._event(`SORT_DESCENDING`) })
      .button({ icon: `sap-icon://sort-ascending`, press: client._event(`SORT_ASCENDING`) });
    tab.dependents()
      .column_menu({ id: `menu`, beforeopen: client._event(`GET_OPENED_COL`, [`$event.mParameters.openBy.getId()`]) })
      .column_menu_quick_sort({ change: client._event(`ONSORT`) })
      .items(`columnmenu`)
      .column_menu_quick_sort_item({ sortorder: client._bind_edit(this.sortorder) })
      .get_parent()
      .get_parent()
      .get_parent()
      .column_menu_quick_group({ change: client._event(`ONGROUP`) })
      .items(`columnmenu`)
      .column_menu_quick_group_item()
      .get_parent()
      .get_parent()
      .get_parent()
      .items(`columnmenu`)
      .column_menu_action_item({ icon: `sap-icon://sort`, label: `Sort`, press: client._event(`ONSORTACTIONITEM`) })
      .get_parent()
      .column_menu_action_item({ icon: `sap-icon://group-2`, label: `Group`, press: client._event(`ONSGROUPACTIONITEM`) })
      .get_parent()
      .column_menu_action_item({ icon: `sap-icon://filter`, label: `Filter`, press: client._event(`ONSFILTERACTIONITEM`) })
      .get_parent()
      .column_menu_action_item({ icon: `sap-icon://table-column`, label: `Columns`, press: client._event(`ONSCOLUMNSACTIONITEM`) });
    tab.columns()
      .column({ headermenu: `menu`, id: `color_col` })
      .text(`Color`)
      .get_parent()
      .column({ headermenu: `menu`, id: `info_col` })
      .text(`Info`)
      .get_parent()
      .column({ headermenu: `menu`, id: `description_col` })
      .text(`Description`)
      .get_parent()
      .column({ headermenu: `menu`, id: `checkbox_col` })
      .text(`Checkbox`)
      .get_parent()
      .column({ headermenu: `menu`, id: `counter_col` })
      .text(`Counter`)
      .get_parent()
      .column({ headermenu: `menu`, id: `chart_col` })
      .text(`Radial Micro Chart`);
    tab.items()
      .column_list_item()
      .cells()
      .text(`{VALUE}`)
      .text(`{INFO}`)
      .text(`{DESCR}`)
      .checkbox({ selected: `{CHECKBOX}`, enabled: false })
      .text(`{COUNT}`);
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_183;
