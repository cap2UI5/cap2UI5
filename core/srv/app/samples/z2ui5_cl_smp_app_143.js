const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_143 extends z2ui5_if_app {
  gt_data = [];
  client = null;

  on_event() {
    let x;
    try {
      if (this.client.check_on_event(`ROW_ACTION_ITEM_ADD`)) {
        this.client.message_toast_display(`Something`);
      }
    } catch (_caught1) {
      x = _caught1;
      this.client.message_box_display(x.get_text(), `error`);
    }
  }

  on_init() {
    this.gt_data = z2ui5_cl_util.abap_tab_assign(this.gt_data, [{ field1: `21`, field2: `T1`, field3: `TEXT1` }, { field1: `22`, field2: `T1`, field3: `TEXT1` }, { field1: `23`, field2: `T2`, field3: `TEXT1` }, { field1: `24`, field2: `T2`, field3: `TEXT2` }, { field1: `25`, field2: `T3`, field3: `TEXT2` }]);
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:table`, v: `sap.ui.table` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const page1 = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Grid Table - Keep Column Filters on Refresh` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `class`, v: `sapUiContentPadding` })
      .a({ n: `id`, v: `page_main` });
    page1.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample uses the abap2UI5 uitableext custom control so the active sap.ui.table column ` + `filters are preserved across a view model update instead of being reset.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const page = page1.ele({ n: `DynamicPage`, ns: `f` }).a({ n: `headerExpanded`, b: true });
    page1.tag({ n: `UITableExt`, ns: `z2ui5` }).a({ n: `tableId`, v: `Table1` });
    const header_title = page.ele({ n: `title`, ns: `f` }).ele({ n: `DynamicPageTitle`, ns: `f` });
    header_title.ele({ n: `heading`, ns: `f` }).ele(`HBox`).tag(`Title`).a({ n: `text`, v: `Table` });
    header_title.ele({ n: `expandedContent`, ns: `f` });
    header_title.ele({ n: `snappedContent`, ns: `f` });
    const cont = page.ele({ n: `content`, ns: `f` });
    const table = cont.ele(`VBox`)
      .ele({ n: `Table`, ns: `table` })
      .a({ n: `rows`, v: this.client._bind(this.gt_data) })
      .a({ n: `alternateRowColors`, b: true })
      .a({ n: `enableCellFilter`, b: true })
      .a({ n: `fixedColumnCount`, v: `1` })
      .a({ n: `rowActionCount`, v: `1` })
      .a({ n: `selectionMode`, v: `None` })
      .a({ n: `id`, v: `Table1` });
    table.ele({ n: `columns`, ns: `table` })
      .ele({ n: `Column`, ns: `table` })
      .a({ n: `sortProperty`, v: `FIELD1` })
      .a({ n: `autoResizable`, v: `true` })
      .a({ n: `filterProperty`, v: `FIELD1` })
      .tag(`Text`)
      .a({ n: `text`, v: `Field1` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{FIELD1}` })
      .end()
      .end()
      .ele({ n: `Column`, ns: `table` })
      .a({ n: `sortProperty`, v: `FIELD2` })
      .a({ n: `autoResizable`, v: `true` })
      .a({ n: `filterProperty`, v: `FIELD2` })
      .tag(`Text`)
      .a({ n: `text`, v: `Field2` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{FIELD2}` })
      .end()
      .end()
      .ele({ n: `Column`, ns: `table` })
      .a({ n: `sortProperty`, v: `FIELD3` })
      .a({ n: `autoResizable`, v: `true` })
      .a({ n: `filterProperty`, v: `FIELD3` })
      .tag(`Text`)
      .a({ n: `text`, v: `Field3` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{FIELD3}` })
      .end()
      .end()
      .end()
      .ele({ n: `rowActionTemplate`, ns: `table` })
      .ele({ n: `RowAction`, ns: `table` })
      .ele({ n: `RowActionItem`, ns: `table` })
      .a({ n: `icon`, v: `sap-icon://add` })
      .a({ n: `text`, v: `Add` })
      .a({ n: `press`, v: this.client._event(`ROW_ACTION_ITEM_ADD`, [`\${MATNR}`]) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
    this.view_display();
    this.on_event();
  }
}

module.exports = z2ui5_cl_smp_app_143;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

