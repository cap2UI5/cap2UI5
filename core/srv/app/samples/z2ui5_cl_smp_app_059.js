const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_059 extends z2ui5_if_app {
  mt_table = [];
  mv_field = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.set_data();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    if (this.client.check_on_event(`BUTTON_SEARCH`)) {
      this.set_data();
      const _out0 = { val: this.mv_field, tab: this.mt_table };
      z2ui5_cl_smp_context.itab_filter_by_val(_out0);
      if ("tab" in _out0) this.mt_table = _out0.tab;
    }
  }

  set_data() {
    this.mt_table = z2ui5_cl_util.abap_tab_assign(this.mt_table, []);
    for (let sy_index = 1; sy_index <= 1000; sy_index++) {
      this.mt_table.push(...[{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }].map((_r) => z2ui5_cl_util.abap_copy(_r)));
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page1 = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Table - Live Search with Parallel Requests` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `id`, v: `page_main` });
    page1.tag(`MessageStrip`)
      .a({ n: `text`, v: `By default abap2UI5 handles only one backend request at a time - the app is set busy and further ` + `requests are ignored until the running one is finished. A live search needs the opposite: only the ` + `newest request matters and older ones can be dropped. Set check_allow_multi_req on the event to ` + `allow that - type in both fields and compare.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const lo_box = page1.ele(`HBox`).a({ n: `class`, v: `sapUiSmallMarginBegin` });
    lo_box.ele(`VBox`)
      .tag(`Text`)
      .a({ n: `text`, v: `Search disabled parallel (default)` })
      .tag(`SearchField`)
      .a({ n: `width`, v: `17.5rem` })
      .a({ n: `value`, v: this.client._bind(this.mv_field) })
      .a({ n: `placeholder`, v: `Search products` })
      .a({ n: `liveChange`, v: this.client._event(`BUTTON_SEARCH`) });
    lo_box.ele(`VBox`)
      .tag(`Text`)
      .a({ n: `text`, v: `Search parallel` })
      .tag(`SearchField`)
      .a({ n: `width`, v: `17.5rem` })
      .a({ n: `value`, v: this.client._bind(this.mv_field) })
      .a({ n: `placeholder`, v: `Search products` })
      .a({ n: `liveChange`, v: this.client._event(`BUTTON_SEARCH`, undefined, { check_allow_multi_req: true }) });
    const tab = page1.ele(`Table`).a({ n: `items`, v: this.client._bind(this.mt_table) });
    const lo_columns = tab.ele(`columns`);
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Product` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Date` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Name` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Location` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Quantity` });
    const lo_cells = tab.ele(`items`).ele(`ColumnListItem`);
    lo_cells.tag(`Text`).a({ n: `text`, v: `{PRODUCT}` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{CREATE_DATE}` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{CREATE_BY}` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{STORAGE_LOCATION}` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{QUANTITY}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_059;

const z2ui5_cl_smp_context = require("./z2ui5_cl_smp_context");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

