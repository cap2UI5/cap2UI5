const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_006 extends z2ui5_if_app {
  t_tab = [];
  client = null;
  check_ui5 = false;
  key = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.refresh_data();
    this.view_display();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `SORT_ASCENDING`:
        this.t_tab.sort((a, b) => ((a.count > b.count ? 1 : a.count < b.count ? -1 : 0)));
        this.client.message_toast_display(`sort ascending`);
        break;
      case `SORT_DESCENDING`:
        this.t_tab.sort((a, b) => ((a.count > b.count ? 1 : a.count < b.count ? -1 : 0)) * -1);
        this.client.message_toast_display(`sort descending`);
        break;
    }
    this.view_display();
  }

  refresh_data() {
    this.t_tab = (() => { const __out = []; let __guard = 0; for (let i = 1; !(i > 10000); i = i + 1) { if (++__guard > 1000000) throw new Error(`VALUE FOR: loop guard exceeded`); __out.push(...[{ count: i, value: `red`, descr: `this is a description`, checkbox: true, valuecolor: `Good` }]); } return __out; })();
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Scroll Container with Table and Toolbar`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `A large table (10,000 rows) is rendered inside a ScrollContainer using growing / ` + `scroll-to-load, with a sticky header toolbar offering sort buttons and a segmented button.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const tab = page.scroll_container({ height: `70%`, vertical: true })
      .table({ growing: true, growingthreshold: `20`, growingscrolltoload: true, items: this.client._bind_edit(this.t_tab), sticky: `ColumnHeaders,HeaderToolbar` });
    tab.header_toolbar()
      .toolbar()
      .title(`title of the table`)
      .button({ text: `left side button`, icon: `sap-icon://account`, press: this.client._event(`BUTTON_SORT`) })
      .segmented_button(this.key)
      .items()
      .segmented_button_item({ key: `BLUE`, icon: `sap-icon://accept`, text: `blue` })
      .segmented_button_item({ key: `GREEN`, icon: `sap-icon://add-favorite`, text: `green` })
      .get_parent()
      .get_parent()
      .toolbar_spacer()
      .button({ icon: `sap-icon://sort-descending`, press: this.client._event(`SORT_DESCENDING`) })
      .button({ icon: `sap-icon://sort-ascending`, press: this.client._event(`SORT_ASCENDING`) });
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
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_006;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

