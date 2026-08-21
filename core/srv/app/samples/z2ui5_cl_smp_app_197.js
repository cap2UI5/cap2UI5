const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_197 extends z2ui5_if_app {
  mt_table = [];
  mt_table_full = [];
  mt_table_products = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event(`RESET`)) {
      this.mt_table = z2ui5_cl_util.abap_tab_assign(this.mt_table, z2ui5_cl_util.abap_copy(this.mt_table_full));
    } else if (client.check_on_event(`FILTER`)) {
      this.on_event_filter();
    }
  }

  on_init() {
    this.data_read();
    this.view_display();
  }

  on_event_filter() {
    let sy_tabix = 0;
    let t_range = [];
    sy_tabix = 0;
    for (const lv_key of this.json_get_values({ json: this.client.get_event_arg(), name: `key` })) {
      sy_tabix++;
      t_range.push(z2ui5_cl_util.abap_copy({ sign: `I`, option: `EQ`, low: lv_key }));
    }
    this.mt_table = z2ui5_cl_util.abap_tab_assign(this.mt_table, z2ui5_cl_util.abap_copy(this.mt_table_full));
    if (!z2ui5_cl_util.abap_is_initial(t_range)) {
      for (let _i = this.mt_table.length - 1; _i >= 0; _i--) { const row = this.mt_table[_i]; if (!((($v, $r) => { if (!$r || !$r.length) return true; let $inc = false, $anyI = false, $exc = false; for (const $x of $r) { const $o = String($x.option || "EQ").toUpperCase(); const $hit = $o === "BT" ? $v >= $x.low && $v <= $x.high : $o === "NB" ? !($v >= $x.low && $v <= $x.high) : $o === "NE" ? $v !== $x.low : $o === "GT" ? $v > $x.low : $o === "GE" ? $v >= $x.low : $o === "LT" ? $v < $x.low : $o === "LE" ? $v <= $x.low : $o === "CP" ? (($v, $p) => { let $r = ""; const $s = String($p); for (let $i = 0; $i < $s.length; $i++) { const $c = $s[$i]; if ($c === "#") { $i++; $r += ($s[$i] || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); } else if ($c === "*") { $r += ".*"; } else if ($c === "+") { $r += "."; } else { $r += $c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); } } return new RegExp("^" + $r + "$", "i").test(String($v)); })($v, $x.low) : $o === "NP" ? !(($v, $p) => { let $r = ""; const $s = String($p); for (let $i = 0; $i < $s.length; $i++) { const $c = $s[$i]; if ($c === "#") { $i++; $r += ($s[$i] || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); } else if ($c === "*") { $r += ".*"; } else if ($c === "+") { $r += "."; } else { $r += $c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); } } return new RegExp("^" + $r + "$", "i").test(String($v)); })($v, $x.low) : $v === $x.low; if (String($x.sign || "I").toUpperCase() === "E") { if ($hit) $exc = true; } else { $anyI = true; if ($hit) $inc = true; } } return $exc ? false : ($anyI ? $inc : true); })(row.product, t_range))) this.mt_table.splice(_i, 1); }
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .ele(`Shell`);
    const page = view.ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Event - Control Objects in t_arg (FacetFilter)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `id`, v: `page_main` });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample shows a list-report table with a FacetFilter: selecting products ` + `filters the rows, and Reset restores the full list. The listClose event sends ` + `the selected FacetFilterItem controls as event arguments - the framework ` + `marshals each one into a JSON object of its properties.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`FacetFilter`)
      .a({ n: `id`, v: `idFacetFilter` })
      .a({ n: `showPersonalization`, b: true })
      .a({ n: `showReset`, b: true })
      .a({ n: `type`, v: `Light` })
      .a({ n: `reset`, v: this.client._event(`RESET`) })
      .ele(`FacetFilterList`)
      .a({ n: `mode`, v: `MultiSelect` })
      .a({ n: `title`, v: `Products` })
      .a({ n: `listClose`, v: this.client._event(`FILTER`, [`$event.mParameters.selectedItems`]) })
      .a({ n: `items`, v: this.client._bind(this.mt_table_products) })
      .ele(`FacetFilterItem`)
      .a({ n: `key`, v: `{PRODUCT}` })
      .a({ n: `text`, v: `{PRODUCT}` });
    const tab = page.ele(`Table`).a({ n: `items`, v: this.client._bind(this.mt_table) }).a({ n: `id`, v: `tab` });
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

  json_get_values({ json, name } = {}) {
    let result = [];
    let lv_off;
    const lv_marker = `"${name}":"`;
    let lv_rest = z2ui5_cl_util.abap_copy(json);
    for (let sy_index = 1; ; sy_index++) {
      lv_off = this.find({ val: lv_rest, sub: lv_marker, case: false });
      if (lv_off < 0) {
        break;
      }
      lv_rest = lv_rest.substr(lv_off + lv_marker.length);
      result.push(z2ui5_cl_util.abap_copy((($v, $s) => { const $i = $v.indexOf($s); return $i < 0 ? `` : $v.slice(0, $i); })(lv_rest, `"`)));
    }
    return result;
  }

  data_read() {
    this.mt_table = z2ui5_cl_util.abap_tab_assign(this.mt_table, [{ product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }, { product: `table`, create_date: `01.01.2023`, create_by: `Peter`, storage_location: `AREA_001`, quantity: 400 }, { product: `chair`, create_date: `01.01.2022`, create_by: `James`, storage_location: `AREA_001`, quantity: 123 }, { product: `sofa`, create_date: `01.05.2021`, create_by: `Simone`, storage_location: `AREA_001`, quantity: 700 }, { product: `computer`, create_date: `27.01.2023`, create_by: `Theo`, storage_location: `AREA_001`, quantity: 200 }, { product: `printer`, create_date: `01.01.2023`, create_by: `Hannah`, storage_location: `AREA_001`, quantity: 90 }, { product: `table2`, create_date: `01.01.2023`, create_by: `Julia`, storage_location: `AREA_001`, quantity: 110 }]);
    this.mt_table.sort((a, b) => ((a.product > b.product ? 1 : a.product < b.product ? -1 : 0)));
    this.mt_table_full = z2ui5_cl_util.abap_tab_assign(this.mt_table_full, z2ui5_cl_util.abap_copy(this.mt_table));
    this.mt_table_products = z2ui5_cl_util.abap_tab_assign(this.mt_table_products, z2ui5_cl_util.abap_copy(this.mt_table));
    // TODO(abap2js): DELETE ADJACENT DUPLICATES FROM mt_table_products COMPARING product.
  }
}

module.exports = z2ui5_cl_smp_app_197;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

