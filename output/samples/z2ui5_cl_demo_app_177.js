const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_177 extends z2ui5_if_app {
  t_tab = [];
  check_ui5 = false;
  mv_key = ``;

  refresh_data() {
    for (let sy_index = 1; sy_index <= 50; sy_index++) {
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
      case `BUTTON_POST`:
        client.message_box_display(`button post was pressed`);
        break;
      case `MENU_DEFAULT`:
        client.message_box_display(`menu default pressed`);
        break;
      case `MENU_01`:
        client.message_box_display(`menu 01 pressed`);
        break;
      case `MENU_02`:
        client.message_box_display(`menu 02 pressed`);
        break;
    }
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Scroll Container with Table and Toolbar`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const tab = page.scroll_container({ height: `70%`, vertical: true })
      .table({ growing: true, growingthreshold: `20`, growingscrolltoload: true, items: client._bind_edit(this.t_tab), sticky: `ColumnHeaders,HeaderToolbar` });
    tab.header_toolbar()
      .overflow_toolbar()
      .title(`title of the table`)
      .button({ text: `letf side button`, icon: `sap-icon://account`, press: client._event(`BUTTON_SORT`) })
      .segmented_button(this.mv_key)
      .items()
      .segmented_button_item({ key: `BLUE`, icon: `sap-icon://accept`, text: `blue` })
      .segmented_button_item({ key: `GREEN`, icon: `sap-icon://add-favorite`, text: `green` })
      .get_parent()
      .get_parent()
      .toolbar_spacer()
      .generic_tag({ arialabelledby: `genericTagLabel`, text: `Project Cost`, design: `StatusIconHidden`, status: `Error`, class: `sapUiSmallMarginBottom` })
      .object_number({ state: `Error`, emphasized: `false`, number: `3.5M`, unit: `EUR` })
      .get_parent()
      .toolbar_spacer()
      .overflow_toolbar_toggle_button({ icon: `sap-icon://sort-descending`, press: client._event(`SORT_DESCENDING`) })
      .overflow_toolbar_toggle_button({ icon: `sap-icon://sort-ascending`, press: client._event(`SORT_ASCENDING`) })
      .overflow_toolbar_menu_button({ text: `Export`, type: `Transparent`, tooltip: `Export`, defaultaction: client._event(`MENU_DEFAULT`), icon: `sap-icon://share`, buttonmode: `Split` })
      ._generic(`menu`)
      ._generic(`Menu`)
      .menu_item({ press: client._event(`MENU_01`), text: `Export as PDF`, icon: `sap-icon://pdf-attachment` })
      .menu_item({ press: client._event(`MENU_02`), text: `Export to Excel`, icon: `sap-icon://excel-attachment` });
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
      .text(`{COUNT}`)
      .radial_micro_chart({ size: `Responsive`, height: `35px`, percentage: `{PERCENTAGE}`, valuecolor: `{VALUECOLOR}` });
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_177;
