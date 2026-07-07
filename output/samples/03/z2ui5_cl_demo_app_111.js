const z2ui5_cl_pop_js_loader = require("abap2UI5/z2ui5_cl_pop_js_loader");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_111 extends z2ui5_if_app {
  mv_search_value = ``;
  mt_table = [];
  mv_key = ``;
  mv_product = ``;
  mv_create_date = ``;
  mv_create_by = ``;
  mv_storage_location = ``;
  mv_quantity = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.set_data();
      client.nav_app_call(z2ui5_cl_pop_js_loader.factory(this.get_custom_js()));
      return;
    }
    if (client.get().CHECK_ON_NAVIGATED === true) {
      this.view_display();
      return;
    }
    this.on_event();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `BUTTON_SEARCH`:
      case `BUTTON_START`:
        this.client.view_model_update();
        break;
    }
  }

  set_data() {
    this.mt_table = [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }];
  }

  set_search() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_field = null;
    let _fs$fs_field = null;
    if (this.mv_search_value) {
      sy_tabix = 0;
      for (const lr_row of this.mt_table) {
        sy_tabix++;
        let lv_row = ``;
        let lv_index = 1;
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

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    this.client.view_display(z2ui5_cl_xml_view.factory()._generic({ ns: `html`, name: `script` })._cc_plain_xml(`sap.z2ui5.InitSvm();`).stringify());
    const page1 = view.page({ id: `page_main`, title: `abap2UI5 - List Report Features`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const page = page1.dynamic_page({ headerexpanded: true, headerpinned: true });
    const header_title = page.title({ ns: `f` }).get().dynamic_page_title();
    header_title.heading(`f`).smart_variant_management({ id: `svm`, showexecuteonselection: true });
    header_title.expanded_content(`f`);
    header_title.snapped_content(`f`);
    const lo_fb = page.header().dynamic_page_header(true);
    lo_fb.filter_bar({ id: `fbar`, persistencykey: `myPersKey`, usetoolbar: false, search: `sap.z2ui5.onSearch();` })
      .filter_group_items()
      .filter_group_item({ name: `PRODUCT`, label: `Product`, groupname: `group1`, visibleinfilterbar: true })
      .fb_control()
      .input({ value: this.client._bind_edit(this.mv_product), suggest: true, suggestionitems: `{/EDIT/MT_TABLE}`, change: `sap.z2ui5.onChange();` })
      .get()
      .suggestion_items()
      .item({ text: `{PRODUCT}` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .filter_group_item({ name: `CREATE_DATE`, label: `Create Date`, groupname: `group1`, visibleinfilterbar: true })
      .fb_control()
      .input({ value: this.client._bind_edit(this.mv_create_date), change: `sap.z2ui5.onChange();` })
      .get_parent()
      .get_parent()
      .filter_group_item({ name: `CREATE_BY`, label: `Create By`, groupname: `group1`, visibleinfilterbar: true })
      .fb_control()
      .input({ value: this.client._bind_edit(this.mv_create_by), change: `sap.z2ui5.onChange();` })
      .get_parent()
      .get_parent()
      .filter_group_item({ name: `STORAGE_LOCATION`, label: `Storage Location`, groupname: `group1`, visibleinfilterbar: true })
      .fb_control()
      .input({ value: this.client._bind_edit(this.mv_storage_location), change: `sap.z2ui5.onChange();` })
      .get_parent()
      .get_parent()
      .filter_group_item({ name: `QUANTITY`, label: `Quantity`, groupname: `group1`, visibleinfilterbar: true })
      .fb_control()
      .input({ suggest: true, suggestionitems: `{/EDIT/MT_TABLE}`, value: this.client._bind_edit(this.mv_quantity), change: `sap.z2ui5.onChange($event);` })
      .get()
      .suggestion_items()
      .item({ text: `{QUANTITY}` })
      .get_parent()
      .get_parent()
      .get_parent();
    const cont = page.content(`f`);
    const tab = cont.table({ id: `table1`, items: this.client._bind_edit(this.mt_table) });
    const lo_columns = tab.columns();
    lo_columns.column().text(`Product`);
    lo_columns.column().text(`Date`);
    lo_columns.column().text(`Name`);
    lo_columns.column().text(`Location`);
    lo_columns.column().text(`Quantity`);
    const lo_cells = tab.items().column_list_item();
    lo_cells.text(`{PRODUCT}`);
    lo_cells.text(`{CREATE_DATE}`);
    lo_cells.text(`{CREATE_BY}`);
    lo_cells.text(`{STORAGE_LOCATION}`);
    lo_cells.text(`{QUANTITY}`);
    this.client.view_display(view.stringify());
  }

  get_custom_js() {
    let result = ``;
    result = `sap.z2ui5.InitSvm = () => {` + `\\n` + ` var oView = sap.z2ui5.oView` + `\\n` + ` var oSmartVariantManagement = oView.byId("svm");` + `\\n` + ` var oFilterBar = oView.byId("fbar");` + `\\n` + ` var aData = _registerFetchData(oFilterBar);` + `\\n` + ` oFilterBar.registerFetchData( aData );` + `\\n` + ` oFilterBar.registerApplyData( _registerApplyData(oFilterBar, aData));` + `\\n` + ` oFilterBar.registerGetFiltersWithValues( _registerGetFiltersWithValues(oFilterBar));` + `\\n` + ` var oPersInfo = new sap.ui.comp.smartvariants.PersonalizableInfo({` + `\\n` + ` type: "filterBar",` + `\\n` + ` keyName: "persistencyKey",` + `\\n` + ` dataSource: "",` + `\\n` + ` control: oFilterBar` + `\\n` + ` });` + `\\n` + ` oSmartVariantManagement.addPersonalizableControl(oPersInfo);` + `\\n` + ` oSmartVariantManagement.initialise(function () {oSmartVariantManagement.currentVariantSetModified(false);}, oFilterBar);` + `\\n` + `};` + `\\n` + `_registerFetchData = (oFilterBar) => {` + `\\n` + ` var aData = oFilterBar.getAllFilterItems()
      .reduce(function (aResult, oFilterItem) {` + `\\n` + ` aResult.push({` + `\\n` + ` groupName: oFilterItem.getGroupName(),` + `\\n` + ` fieldName: oFilterItem.getName(),` + `\\n` + ` fieldData: oFilterItem.getControl().getValue()` + `\\n` + ` });` + `\\n` + ` return aResult;` + `\\n` + ` }, []);` + `\\n` + ` return aData;` + `\\n` + `};` + `\\n` + `_registerApplyData = (oFilterBar, aData) => {` + `\\n` + ` aData.forEach(function (oDataObject) {` + `\\n` + ` var oControl = oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);` + `\\n` + ` oControl.setValue(oDataObject.fieldData);` + `\\n` + ` });` + `\\n` + `};` + `\\n` + `_registerGetFiltersWithValues = (oFilterBar) => {` + `\\n` + ` var aFiltersWithValue = oFilterBar.getFilterGroupItems()
      .reduce(function (aResult, oFilterGroupItem) {` + `\\n` + ` var oControl = oFilterGroupItem.getControl();` + `\\n` + ` if (oControl &amp;&amp; oControl.getValue &amp;&amp; oControl.getValue().length > 0) {` + `\\n` + ` aResult.push(oFilterGroupItem);` + `\\n` + ` }` + `\\n` + ` return aResult;` + `\\n` + ` }, []);` + `\\n` + ` return aFiltersWithValue;` + `\\n` + `};` + `\\n` + `sap.z2ui5.onSearch = () => {` + `\\n` + ` var oView = sap.z2ui5.oView` + `\\n` + ` var oFilterBar = oView.byId("fbar");` + `\\n` + ` var oTable = oView.byId("table1");` + `\\n` + ` var aTableFilters = oFilterBar.getFilterGroupItems()
      .reduce(function (aResult, oFilterGroupItem) {` + `\\n` + ` var oControl = oFilterGroupItem.getControl(),` + `\\n` + ` aSelectedKey = oControl.getValue(),` + `\\n` + ` aFilters = return new sap.ui.model.Filter({` + `\\n` + ` path: oFilterGroupItem.getName(),` + `\\n` + ` operator: "Contains",` + `\\n` + ` value1: sSelectedKey` + `\\n` + ` });` + `\\n` + ` if (aSelectedKey.length > 0) {` + `\\n` + ` aResult.push(new sap.ui.model.Filter({` + `\\n` + ` filters: aFilters,` + `\\n` + ` and: false` + `\\n` + ` }));` + `\\n` + ` }` + `\\n` + ` return aResult;` + `\\n` + ` }, []);` + `\\n` + ` oTable.getBinding("items")
      .filter(aTableFilters);` + `\\n` + `};` + `\\n` + `sap.z2ui5.onChange = (oEvent) => {` + `\\n` + ` var oView = sap.z2ui5.oView` + `\\n` + ` var oFilterBar = oView.byId("fbar");` + `\\n` + ` var oSmartVariantManagement = oView.byId("svm");` + `\\n` + ` oSmartVariantManagement.currentVariantSetModified(true);` + `\\n` + ` oFilterBar.fireFilterChange(oEvent);` + `\\n` + `}`;
    return result;
  }
}

module.exports = z2ui5_cl_demo_app_111;
