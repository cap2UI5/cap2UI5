const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_070 extends z2ui5_if_app {
  mt_mapping = [];
  mv_search_value = ``;
  mt_table = [];
  lv_selkz = false;
  client = null;

  set_selkz({ iv_selkz } = {}) {
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const fs_ls_table of this.mt_table) {
      sy_tabix++;
      fs_ls_table.selkz = z2ui5_cl_util.abap_tab_assign(fs_ls_table.selkz, z2ui5_cl_util.abap_copy(iv_selkz));
    }
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let sy_subrc = 0;
    let lt_arg;
    let ls_arg;
    switch (this.client.get_event()) {
      case `BUTTON_SEARCH`:
      case `BUTTON_START`:
        this.client.message_toast_display(`Search Entries`);
        this.set_data();
        this.set_search();
        break;
      case `SORT`:
        lt_arg = this.client.get().T_EVENT_ARG;
        this.client.message_toast_display(`Event SORT`);
        break;
      case `FILTER`:
        lt_arg = z2ui5_cl_util.struct_lower_keys(this.client.get().T_EVENT_ARG);
        this.client.message_toast_display(`Event FILTER`);
        break;
      case `SELKZ`:
        this.client.message_toast_display(`'Event SELKZ' ${this.lv_selkz} `);
        this.set_selkz({ iv_selkz: this.lv_selkz });
        break;
      case `CUSTOMFILTER`:
        lt_arg = z2ui5_cl_util.struct_lower_keys(this.client.get().T_EVENT_ARG);
        this.client.message_toast_display(`Event CUSTOMFILTER`);
        break;
      case `ROWEDIT`:
        lt_arg = z2ui5_cl_util.struct_lower_keys(this.client.get().T_EVENT_ARG);
        ls_arg = {};
        {
          const _t = lt_arg;
          const _i = (1) - 1;
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) ls_arg = _t[_i];
        }
        if (sy_subrc === 0) {
          this.client.message_toast_display(`Event ROWEDIT Row Index ${ls_arg} `);
        }
        break;
      case `ROW_ACTION_ITEM_NAVIGATION`:
        lt_arg = z2ui5_cl_util.struct_lower_keys(this.client.get().T_EVENT_ARG);
        {
          const _t = lt_arg;
          const _i = (1) - 1;
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) ls_arg = _t[_i];
        }
        if (sy_subrc === 0) {
          this.client.message_toast_display(`Event ROW_ACTION_ITEM_NAVIGATION Row Index ${ls_arg} `);
        }
        break;
      case `ROW_ACTION_ITEM_EDIT`:
        lt_arg = z2ui5_cl_util.struct_lower_keys(this.client.get().T_EVENT_ARG);
        {
          const _t = lt_arg;
          const _i = (1) - 1;
          sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
          if (sy_subrc === 0) ls_arg = _t[_i];
        }
        if (sy_subrc === 0) {
          this.client.message_toast_display(`Event ROW_ACTION_ITEM_EDIT Row Index ${ls_arg} `);
        }
        break;
    }
  }

  on_init() {
    this.mt_mapping = z2ui5_cl_util.abap_tab_assign(this.mt_mapping, [{ n: `EQ`, v: `={LOW}` }, { n: `LT`, v: `<{LOW}` }, { n: `LE`, v: `<={LOW}` }, { n: `GT`, v: `>{LOW}` }, { n: `GE`, v: `>={LOW}` }, { n: `CP`, v: `*{LOW}*` }, { n: `BT`, v: `{LOW}...{HIGH}` }, { n: `NE`, v: `!(={LOW})` }, { n: `!<leer>`, v: `!(<leer>)` }, { n: `<leer>`, v: `<leer>` }]);
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:table`, v: `sap.ui.table` })
      .a({ n: `xmlns:u`, v: `sap.ui.unified` });
    const page1 = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Grid Table - Full Example with sap.ui.table` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `class`, v: `sapUiContentPadding` })
      .a({ n: `id`, v: `page_main` });
    page1.tag(`MessageStrip`)
      .a({ n: `text`, v: `A full sap.ui.table.Table inside a DynamicPage: fixed column, row-action buttons, ` + `progress-indicator and currency cells, plus backend-driven search, sort and filter events.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const page = page1.ele({ n: `DynamicPage`, ns: `f` }).a({ n: `headerExpanded`, b: true });
    const header_title = page.ele({ n: `title`, ns: `f` }).ele({ n: `DynamicPageTitle`, ns: `f` });
    header_title.ele({ n: `heading`, ns: `f` }).ele(`HBox`).tag(`Title`).a({ n: `text`, v: `Search Field` });
    header_title.ele({ n: `expandedContent`, ns: `f` });
    header_title.ele({ n: `snappedContent`, ns: `f` });
    const lo_box = page.ele({ n: `header`, ns: `f` })
      .ele({ n: `DynamicPageHeader`, ns: `f` })
      .a({ n: `pinnable`, b: true })
      .ele(`FlexBox`)
      .a({ n: `alignItems`, v: `Start` })
      .a({ n: `justifyContent`, v: `SpaceBetween` })
      .ele(`FlexBox`)
      .a({ n: `alignItems`, v: `Start` });
    lo_box.ele(`VBox`)
      .tag(`Text`)
      .a({ n: `text`, v: `Search` })
      .tag(`SearchField`)
      .a({ n: `width`, v: `17.5rem` })
      .a({ n: `search`, v: this.client._event(`BUTTON_SEARCH`) })
      .a({ n: `value`, v: this.client._bind(this.mv_search_value) })
      .a({ n: `id`, v: `SEARCH` })
      .a({ n: `placeholder`, v: `Search products` });
    lo_box.end()
      .ele(`HBox`)
      .a({ n: `justifyContent`, v: `End` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_START`) })
      .a({ n: `text`, v: `Go` })
      .a({ n: `type`, v: `Emphasized` });
    const cont = page.ele({ n: `content`, ns: `f` });
    const tab = cont.ele({ n: `Table`, ns: `table` })
      .a({ n: `rows`, v: this.client._bind(this.mt_table) })
      .a({ n: `alternateRowColors`, b: true })
      .a({ n: `fixedColumnCount`, v: `1` })
      .a({ n: `rowActionCount`, v: `2` })
      .a({ n: `selectionMode`, v: `None` })
      .a({ n: `filter`, v: this.client._event(`FILTER`) })
      .a({ n: `sort`, v: this.client._event(`SORT`) })
      .a({ n: `customFilter`, v: this.client._event(`CUSTOMFILTER`) });
    tab.ele({ n: `extension`, ns: `table` }).ele(`OverflowToolbar`).tag(`Title`).a({ n: `text`, v: `Products` });
    const lo_columns = tab.ele({ n: `columns`, ns: `table` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `4rem` })
      .tag(`CheckBox`)
      .a({ n: `selected`, v: this.client._bind(this.lv_selkz) })
      .a({ n: `enabled`, b: true })
      .a({ n: `select`, v: this.client._event(`SELKZ`) })
      .ele({ n: `template`, ns: `table` })
      .tag(`CheckBox`)
      .a({ n: `selected`, v: `{SELKZ}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `5rem` })
      .a({ n: `sortProperty`, v: `ROW_ID` })
      .a({ n: `filterProperty`, v: `ROW_ID` })
      .tag(`Text`)
      .a({ n: `text`, v: `Index` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{ROW_ID}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `11rem` })
      .a({ n: `sortProperty`, v: `PROCESS` })
      .a({ n: `filterProperty`, v: `PROCESS` })
      .tag(`Text`)
      .a({ n: `text`, v: `Process Indicator` })
      .ele({ n: `template`, ns: `table` })
      .tag(`ProgressIndicator`)
      .a({ n: `class`, v: `sapUiSmallMarginBottom` })
      .a({ n: `percentValue`, v: `{PROCESS}` })
      .a({ n: `displayValue`, v: `{PROCESS} %` })
      .a({ n: `showValue`, v: `true` })
      .a({ n: `state`, v: `{PROCESS_STATE}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `11rem` })
      .a({ n: `sortProperty`, v: `PRODUCT` })
      .a({ n: `filterProperty`, v: `PRODUCT` })
      .tag(`Text`)
      .a({ n: `text`, v: `Product` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Input`)
      .a({ n: `editable`, b: false })
      .a({ n: `value`, v: `{PRODUCT}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `11rem` })
      .a({ n: `sortProperty`, v: `CREATE_DATE` })
      .a({ n: `filterProperty`, v: `CREATE_DATE` })
      .tag(`Text`)
      .a({ n: `text`, v: `Date` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{CREATE_DATE}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `11rem` })
      .a({ n: `sortProperty`, v: `CREATE_BY` })
      .a({ n: `filterProperty`, v: `CREATE_BY` })
      .tag(`Text`)
      .a({ n: `text`, v: `Name` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{CREATE_BY}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `11rem` })
      .a({ n: `sortProperty`, v: `STORAGE_LOCATION` })
      .a({ n: `filterProperty`, v: `STORAGE_LOCATION` })
      .tag(`Text`)
      .a({ n: `text`, v: `Location` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{STORAGE_LOCATION}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `11rem` })
      .a({ n: `sortProperty`, v: `QUANTITY` })
      .a({ n: `filterProperty`, v: `QUANTITY` })
      .tag(`Text`)
      .a({ n: `text`, v: `Quantity` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{QUANTITY}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `6rem` })
      .a({ n: `sortProperty`, v: `MEINS` })
      .a({ n: `filterProperty`, v: `MEINS` })
      .tag(`Text`)
      .a({ n: `text`, v: `Unit` })
      .ele({ n: `template`, ns: `table` })
      .tag(`Text`)
      .a({ n: `text`, v: `{MEINS}` });
    lo_columns.ele({ n: `Column`, ns: `table` })
      .a({ n: `width`, v: `11rem` })
      .a({ n: `sortProperty`, v: `PRICE` })
      .a({ n: `filterProperty`, v: `PRICE` })
      .tag(`Text`)
      .a({ n: `text`, v: `Price` })
      .ele({ n: `template`, ns: `table` })
      .ele({ n: `Currency`, ns: `u` })
      .a({ n: `value`, v: `{PRICE}` })
      .a({ n: `currency`, v: `{WAERS}` });
    lo_columns.end()
      .ele({ n: `rowActionTemplate`, ns: `table` })
      .ele({ n: `RowAction`, ns: `table` })
      .ele({ n: `RowActionItem`, ns: `table` })
      .a({ n: `type`, v: `Navigation` })
      .a({ n: `press`, v: this.client._event(`ROW_ACTION_ITEM_NAVIGATION`, [`\${ROW_ID}`]) })
      .end()
      .ele({ n: `RowActionItem`, ns: `table` })
      .a({ n: `icon`, v: `sap-icon://edit` })
      .a({ n: `text`, v: `Edit` })
      .a({ n: `press`, v: this.client._event(`ROW_ACTION_ITEM_EDIT`, [`\${ROW_ID}`]) });
    this.client.view_display(view.stringify());
  }

  set_data() {
    this.mt_table = z2ui5_cl_util.abap_tab_assign(this.mt_table, [{ selkz: false, row_id: `1`, product: `table`, create_date: `01.01.2023`, create_by: `Olaf`, storage_location: `AREA_001`, quantity: 400, meins: `ST`, price: `1000.50`, waers: `EUR`, process: `10`, process_state: `None` }, { selkz: false, row_id: `2`, product: `chair`, create_date: `01.01.2022`, create_by: `Karlo`, storage_location: `AREA_001`, quantity: 123, meins: `ST`, price: `2000.55`, waers: `USD`, process: `20`, process_state: `Warning` }, { selkz: false, row_id: `3`, product: `sofa`, create_date: `01.05.2021`, create_by: `Elin`, storage_location: `AREA_002`, quantity: 700, meins: `ST`, price: `3000.11`, waers: `CNY`, process: `30`, process_state: `Success` }, { selkz: false, row_id: `4`, product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_002`, quantity: 200, meins: `ST`, price: `4000.88`, waers: `USD`, process: `40`, process_state: `Information` }, { selkz: false, row_id: `5`, product: `printer`, create_date: `01.01.2023`, create_by: `Renate`, storage_location: `AREA_003`, quantity: 90, meins: `ST`, price: `5000.47`, waers: `EUR`, process: `70`, process_state: `Warning` }, { selkz: false, row_id: `6`, product: `table2`, create_date: `01.01.2023`, create_by: `Angela`, storage_location: `AREA_003`, quantity: 110, meins: `ST`, price: `6000.33`, waers: `GBP`, process: `90`, process_state: `Error` }]);
  }

  set_search() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_field = null;
    let _fs$fs_field = null;
    let lv_row;
    let lv_index;
    if (!z2ui5_cl_util.abap_is_initial(this.mv_search_value)) {
      sy_tabix = 0;
      for (const lr_row of this.mt_table) {
        sy_tabix++;
        lv_row = ``;
        lv_index = 1;
        for (let sy_index = 1; ; sy_index++) {
          _fs$fs_field = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(lr_row, lv_index);
          fs_field = _fs$fs_field ? _fs$fs_field.o[_fs$fs_field.k] : null;
          sy_subrc = _fs$fs_field ? 0 : 4;
          if (sy_subrc !== 0) {
            break;
          }
          lv_row = lv_row + fs_field;
          lv_index = lv_index + 1;
        }
        if (!String(lv_row).toLowerCase().includes(String(this.mv_search_value).toLowerCase())) {
          // TODO(abap2js): DELETE mt_table.
        }
      }
    }
  }
}

module.exports = z2ui5_cl_smp_app_070;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

