const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_052 extends z2ui5_if_app {
  mt_table = [];
  mv_check_popover = false;
  mv_product = ``;
  client = null;

  popover_display({ id } = {}) {
    const lo_popover = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const popover = lo_popover.ele(`Popover`)
      .a({ n: `title`, v: `abap2UI5 - Popover - ${this.mv_product}` })
      .a({ n: `placement`, v: `Right` })
      .a({ n: `contentWidth`, v: `20rem` });
    popover.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `layout`, v: `ColumnLayout` })
      .a({ n: `editable`, b: false })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Product` })
      .tag(`Text`)
      .a({ n: `text`, v: this.mv_product })
      .tag(`Label`)
      .a({ n: `text`, v: `info2` })
      .tag(`Text`)
      .a({ n: `text`, v: `this is a text` })
      .tag(`Label`)
      .a({ n: `text`, v: `info3` })
      .tag(`Text`)
      .a({ n: `text`, v: `this is a text` })
      .tag(`Text`)
      .a({ n: `text`, v: `this is a text` });
    popover.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag(`ToolbarSpacer`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_DETAILS`) })
      .a({ n: `text`, v: `details` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popover_display(lo_popover.stringify(), id);
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
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    let page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Popover - Open from a Table Row` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `id`, v: `page_main` });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `List report layout: a dynamic page with a table whose product links open a popover ` + `showing details for the selected row.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page = page.ele({ n: `DynamicPage`, ns: `f` }).a({ n: `headerExpanded`, b: true });
    const cont = page.ele({ n: `content`, ns: `f` });
    const tab = cont.ele(`Table`).a({ n: `items`, v: this.client._bind(this.mt_table) }).a({ n: `id`, v: `tab` });
    const lo_columns = tab.ele(`columns`);
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Product` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Date` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Name` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Location` });
    lo_columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: `Quantity` });
    const lo_cells = tab.ele(`items`).ele(`ColumnListItem`);
    lo_cells.tag(`Link`)
      .a({ n: `text`, v: `{PRODUCT}` })
      .a({ n: `press`, v: this.client._event(`POPOVER_DETAIL`, [`\${$source>/id}`, `\${PRODUCT}`]) })
      .a({ n: `id`, v: `link` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{CREATE_DATE}` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{CREATE_BY}` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{STORAGE_LOCATION}` });
    lo_cells.tag(`Text`).a({ n: `text`, v: `{QUANTITY}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      this.set_data();
      return;
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
    switch (client.get_event()) {
      case `BUTTON_DETAILS`:
        client.popover_destroy();
        break;
      case `POPOVER_DETAIL`:
        this.mv_check_popover = true;
        this.mv_product = client.get_event_arg(2);
        this.popover_display({ id: client.get_event_arg() });
        break;
    }
  }

  set_data() {
    this.mt_table = z2ui5_cl_util.abap_tab_assign(this.mt_table, [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }]);
  }
}

module.exports = z2ui5_cl_smp_app_052;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

