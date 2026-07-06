const z2ui5_cl_ajson_mapping = require("abap2UI5/z2ui5_cl_ajson_mapping");
const z2ui5_cl_pop_js_loader = require("abap2UI5/z2ui5_cl_pop_js_loader");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_090 extends z2ui5_if_app {
  mt_columns = [];
  mt_columns1 = [];
  mt_groups = [];
  mt_columns_p13n = [];
  mt_sort_p13n = [];
  mt_groups_p13n = [];
  client = null;
  check_view_loaded = false;
  mv_page = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.init_data_set();
      client.nav_app_call(z2ui5_cl_pop_js_loader.factory(this.get_custom_js()));
    } else if (this.check_view_loaded === false) {
      this.check_view_loaded = true;
      this.init_data_set();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `P13N_OPEN`:
        this.view_display_p13n();
        break;
      case `P13N_POPUP`:
        this.view_display_p13n_popup();
        break;
      case `OK`:
      case `CANCEL`:
        this.client.popup_destroy();
        break;
    }
  }

  view_display() {
    this.client._bind_edit({ val: this.mt_columns_p13n, custom_mapper: z2ui5_cl_ajson_mapping.create_lower_case() });
    this.client._bind_edit({ val: this.mt_sort_p13n, custom_mapper: z2ui5_cl_ajson_mapping.create_lower_case() });
    this.client._bind_edit({ val: this.mt_groups_p13n, custom_mapper: z2ui5_cl_ajson_mapping.create_lower_case() });
    let page = z2ui5_cl_xml_view.factory();
    page = page.shell()
      .page({ title: `abap2UI5 - P13N Dialog`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), class: `sapUiContentPadding` });
    page = page.vbox();
    page._generic({ name: `Popup`, ns: `p13n`, t_prop: [{ n: `title`, v: `My Custom View Settings` }, { n: `close`, v: `z2ui5.updateData(\${$parameters>/reason})` }, { n: `id`, v: `p13nPopup` }] })
      ._generic({ name: `panels`, ns: `p13n` })
      ._generic({ name: `SelectionPanel`, ns: `p13n`, t_prop: [{ n: `id`, v: `columnsPanel` }, { n: `title`, v: `Columns` }] })
      .get_parent()
      ._generic({ name: `SortPanel`, ns: `p13n`, t_prop: [{ n: `id`, v: `sortPanel` }, { n: `title`, v: `Sort` }] })
      .get_parent()
      ._generic({ name: `P13nFilterPanel`, ns: ``, t_prop: [{ n: `id`, v: `filterPanel` }, { n: `title`, v: `Filter` }] })
      .get_parent()
      ._generic({ name: `GroupPanel`, ns: `p13n`, t_prop: [{ n: `id`, v: `groupPanel` }, { n: `title`, v: `Group` }] })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent();
    page.button({ text: `Open P13N Dialog`, press: this.client._event(`P13N_OPEN`), class: `sapUiTinyMarginBeginEnd` })
      .button({ text: `Open P13N.POPUP`, press: `z2ui5.setInitialData()` })
      .get_parent()
      .get_parent();
    this.client.view_display(page.stringify());
  }

  view_display_p13n() {
    const p13n_dialog = z2ui5_cl_xml_view.factory_popup();
    const p13n = p13n_dialog._generic({ name: `P13nDialog`, t_prop: [{ n: `ok`, v: this.client._event(`OK`) }, { n: `cancel`, v: this.client._event(`CANCEL`) }, { n: `reset`, v: this.client._event(`RESET`) }, { n: `showReset`, v: `true` }, { n: `initialVisiblePanelType`, v: `sort` }] })
      ._generic(`panels`)
      ._generic({ name: `P13nColumnsPanel`, t_prop: [{ n: `items`, v: `{path:'${this.client._bind_edit({ val: this.mt_columns, path: true, custom_mapper: z2ui5_cl_ajson_mapping.create_lower_case() })}'}` }, { n: `columnsItems`, v: `{path:'${this.client._bind_edit({ val: this.mt_columns1, path: true, custom_mapper: z2ui5_cl_ajson_mapping.create_lower_case() })}'}` }] })
      .items()
      ._generic({ name: `P13nItem`, t_prop: [{ n: `columnKey`, v: `{columnkey}` }, { n: `text`, v: `{text}` }] })
      .get_parent()
      .get_parent()
      ._generic(`columnsItems`)
      ._generic({ name: `P13nColumnsItem`, t_prop: [{ n: `columnKey`, v: `{columnkey}` }, { n: `visible`, v: `{visible}` }, { n: `index`, v: `{index}` }] })
      .get_parent()
      .get_parent()
      .get_parent()
      ._generic({ name: `P13nGroupPanel`, t_prop: [{ n: `groupItems`, v: `{path:'${this.client._bind_edit({ val: this.mt_groups, path: true, custom_mapper: z2ui5_cl_ajson_mapping.create_lower_case() })}'}` }] })
      .items()
      ._generic({ name: `P13nItem`, t_prop: [{ n: `columnKey`, v: `{columnkey}` }, { n: `text`, v: `{text}` }] })
      .get_parent()
      .get_parent()
      ._generic(`groupItems`)
      ._generic({ name: `P13nGroupItem`, t_prop: [{ n: `columnKey`, v: `{columnkey}` }, { n: `operation`, v: `{operation}` }, { n: `showIfGrouped`, v: `{showifgrouped}` }] });
    this.client.popup_display(p13n.stringify());
  }

  view_display_p13n_popup() {
    const p13n_popup = z2ui5_cl_xml_view.factory();
    p13n_popup._generic({ name: `Popup`, ns: `p13n`, t_prop: [{ n: `title`, v: `My Custom View Settings` }, { n: `id`, v: `p13nPopup` }] })
      ._generic({ name: `panels`, ns: `p13n` })
      ._generic({ name: `SelectionPanel`, ns: `p13n`, t_prop: [{ n: `id`, v: `columnsPanel` }, { n: `title`, v: `Columns` }] })
      .get_parent()
      ._generic({ name: `SortPanel`, ns: `p13n`, t_prop: [{ n: `id`, v: `sortPanel` }, { n: `title`, v: `Sort` }] })
      .get_parent()
      ._generic({ name: `GroupPanel`, ns: `p13n`, t_prop: [{ n: `id`, v: `groupPanel` }, { n: `title`, v: `Group` }] })
      .get_parent()
      .get_parent()
      .get_parent();
    this.client.view_display(p13n_popup.stringify());
  }

  init_data_set() {
    this.mt_columns = [{ columnkey: `productId`, text: `Product ID` }, { columnkey: `name`, text: `Name` }, { columnkey: `category`, text: `Category` }, { columnkey: `supplierName`, text: `Supplier Name` }];
    this.mt_columns1 = [{ columnkey: `name`, visible: true, index: 0 }, { columnkey: `category`, visible: true, index: 1 }, { columnkey: `productId`, visible: false }, { columnkey: `supplierName`, visible: false }];
    this.mt_groups = [{ columnkey: `name`, text: `Name`, showifgrouped: true }, { columnkey: `category`, text: `Category`, showifgrouped: true }, { columnkey: `productId`, showifgrouped: false }, { columnkey: `supplierName`, showifgrouped: false }];
    this.mt_columns_p13n = [{ visible: `true`, name: `key1`, label: `City` }, { visible: `false`, name: `key2`, label: `Country` }, { visible: `false`, name: `key2`, label: `Region` }];
    this.mt_sort_p13n = [{ sorted: `true`, name: `key1`, label: `City`, descending: `true` }, { sorted: `false`, name: `key2`, label: `Country`, descending: `false` }, { sorted: `false`, name: `key2`, label: `Region`, descending: `false` }];
    this.mt_groups_p13n = [{ grouped: `true`, name: `key1`, label: `City` }, { grouped: `false`, name: `key2`, label: `Country` }, { grouped: `false`, name: `key2`, label: `Region` }];
  }

  get_custom_js() {
    let result = ``;
    result = `z2ui5.setInitialData = () => {` + `\\n` + ` var oView = z2ui5.oView` + `\\n` + ` var oSelectionPanel = oView.byId("columnsPanel");` + `\\n` + ` var oSortPanel = oView.byId("sortPanel");` + `\\n` + ` var oGroupPanel = oView.byId("groupPanel");` + `\\n` + ` oSelectionPanel.setP13nData(oView.getModel().oData.XX.MT_COLUMNS_P13N);` + `\\n` + ` oSortPanel.setP13nData(oView.getModel().oData.XX.MT_SORT_P13N);` + `\\n` + ` oGroupPanel.setP13nData(oView.getModel().oData.XX.MT_GROUPS_P13N);` + `\\n` + ` var oPopup = oView.byId("p13nPopup");` + `\\n` + ` oPopup.open();` + `\\n` + `};` + `\\n` + `z2ui5.updateData = (oReason) => {` + `\\n` + ` if( oReason === "Ok" ) {` + `\\n` + ` var oView = z2ui5.oView` + `\\n` + ` var oSelectionPanel = oView.byId("columnsPanel");` + `\\n` + ` var oSortPanel = oView.byId("sortPanel");` + `\\n` + ` var oGroupPanel = oView.byId("groupPanel");` + `\\n` + ` oView.getModel()
      .oData.XX.MT_COLUMNS_P13N = oSelectionPanel.getP13nData();` + `\\n` + ` oView.getModel()
      .oData.XX.MT_SORT_P13N = oSortPanel.getP13nData();` + `\\n` + ` oView.getModel()
      .oData.XX.MT_GROUPS_P13N = oGroupPanel.getP13nData();` + `\\n` + ` };` + `\\n` + `};`;
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_090;
