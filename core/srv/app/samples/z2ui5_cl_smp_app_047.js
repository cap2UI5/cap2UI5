const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_047 extends z2ui5_if_app {
  int1 = 0;
  int2 = 0;
  int_sum = 0;
  dec1 = 0;
  dec2 = 0;
  dec_sum = 0;
  date = null;
  time = null;
  mt_tab = [];

  async main(client) {
    let sy_datum = "";
    let sy_uzeit = "";
    if (client.check_on_init()) {
      this.date = z2ui5_cl_util.abap_tab_assign(this.date, z2ui5_cl_util.abap_copy(sy_datum));
      this.time = z2ui5_cl_util.abap_tab_assign(this.time, z2ui5_cl_util.abap_copy(sy_uzeit));
      this.dec1 = - z2ui5_cl_util.abap_div(1, 3);
      this.dec2 = z2ui5_cl_util.abap_div(2, 3);
      this.mt_tab = z2ui5_cl_util.abap_tab_assign(this.mt_tab, [{ date: sy_datum, time: sy_uzeit }]);
      client._bind(this.mt_tab);
    }
    switch (client.get_event()) {
      case `BUTTON_INT`:
        this.int_sum = this.int1 + this.int2;
        break;
      case `BUTTON_DEC`:
        this.dec_sum = this.dec1 + this.dec2;
        break;
    }
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Binding - Types for Integer, Decimal, Date and Time` })
      .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Numeric and date/time binding: integer and decimal fields use automatic type ` + `conversion, buttons calculate the sums, and a growing table lists the values.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Integer and Decimals` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Title`)
      .a({ n: `text`, v: `Input` })
      .tag(`Label`)
      .a({ n: `text`, v: `integer` })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.int1) })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.int2) })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: client._bind(this.int_sum) })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`BUTTON_INT`) })
      .a({ n: `text`, v: `calc sum` })
      .tag(`Label`)
      .a({ n: `text`, v: `decimals` })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.dec1) })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.dec2) })
      .tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: client._bind(this.dec_sum) })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(`BUTTON_DEC`) })
      .a({ n: `text`, v: `calc sum` })
      .tag(`Label`)
      .a({ n: `text`, v: `date` })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.date) })
      .tag(`Label`)
      .a({ n: `text`, v: `time` })
      .tag(`Input`)
      .a({ n: `value`, v: client._bind(this.time) });
    const tab = page.ele(`ScrollContainer`)
      .a({ n: `height`, v: `70%` })
      .a({ n: `vertical`, b: true })
      .ele(`Table`)
      .a({ n: `items`, v: client._bind(this.mt_tab) })
      .a({ n: `growing`, b: true })
      .a({ n: `growingThreshold`, v: `20` })
      .a({ n: `growingScrollToLoad`, b: true })
      .a({ n: `sticky`, v: `ColumnHeaders,HeaderToolbar` });
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Date` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Time` })
      .end();
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{DATE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{TIME}` });
    client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_047;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

