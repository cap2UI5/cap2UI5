const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_006 extends z2ui5_if_app {
  t_tab = [];
  client = null;
  key = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.refresh_data();
    this.view_display();
  }

  on_event() {
    switch (this.client.get_event()) {
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
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Table - Large Table with Growing and ScrollContainer` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A large table (10,000 rows) is rendered inside a ScrollContainer using growing / ` + `scroll-to-load, with a sticky header toolbar offering sort buttons and a segmented button.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tab = page.ele(`ScrollContainer`)
      .a({ n: `height`, v: `70%` })
      .a({ n: `vertical`, b: true })
      .ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `growing`, b: true })
      .a({ n: `growingThreshold`, v: `20` })
      .a({ n: `growingScrollToLoad`, b: true })
      .a({ n: `sticky`, v: `ColumnHeaders,HeaderToolbar` });
    tab.ele(`headerToolbar`)
      .ele(`Toolbar`)
      .tag(`Title`)
      .a({ n: `text`, v: `title of the table` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_SORT`) })
      .a({ n: `text`, v: `left side button` })
      .a({ n: `icon`, v: `sap-icon://account` })
      .ele(`SegmentedButton`)
      .a({ n: `selectedKey`, v: this.key })
      .ele(`items`)
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://accept` })
      .a({ n: `key`, v: `BLUE` })
      .a({ n: `text`, v: `blue` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://add-favorite` })
      .a({ n: `key`, v: `GREEN` })
      .a({ n: `text`, v: `green` })
      .end()
      .end()
      .tag(`ToolbarSpacer`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SORT_DESCENDING`) })
      .a({ n: `icon`, v: `sap-icon://sort-descending` })
      .a({ n: `tooltip`, v: `Sort descending` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SORT_ASCENDING`) })
      .a({ n: `icon`, v: `sap-icon://sort-ascending` })
      .a({ n: `tooltip`, v: `Sort ascending` });
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Color` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Info` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Description` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Checkbox` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Counter` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Radial Micro Chart` });
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{VALUE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{INFO}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DESCR}` })
      .tag(`CheckBox`)
      .a({ n: `selected`, v: `{CHECKBOX}` })
      .a({ n: `enabled`, b: false })
      .tag(`Text`)
      .a({ n: `text`, v: `{COUNT}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_006;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

