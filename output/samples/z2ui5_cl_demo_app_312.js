const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_312 extends z2ui5_if_app {
  mt_data_chart = [];
  ms_screen = {};
  mv_prop = ``;
  mt_feed_values = [];
  mt_viztypes = [];
  client = null;

  on_event() {
    switch (this.client.get().EVENT) {
      case `EVT_DATA_SELECT`:
        this.client.message_toast_display(this.client.get_event_arg(1));
        break;
      case `EVT_VIZTYPE_CHANGE`:
        this.ms_screen.viztype = this.ms_screen.viztypesel;
        this.on_rendering();
        break;
    }
  }

  on_init() {
    this.mt_data_chart = [{ week: `Week 1 - 4`, revenue: `431000.22`, cost: `230000.00` }, { week: `Week 5 - 8`, revenue: `494000.30`, cost: `238000.00` }, { week: `Week 9 - 12`, revenue: `491000.17`, cost: `221000.00` }, { week: `Week 13 - 16`, revenue: `536000.34`, cost: `280000.00` }];
    this.mv_prop = `{` + `\\n` + `"plotArea": {` + `\\n` + `"dataLabel": {` + `\\n` + `"formatString": "",` + `\\n` + `"visible": true` + `\\n` + `}` + `\\n` + `},` + `\\n` + `"valueAxis": {` + `\\n` + `"label": {` + `\\n` + `"formatString": ""` + `\\n` + `},` + `\\n` + `"title": {` + `\\n` + `"visible": true` + `\\n` + `}` + `\\n` + `},` + `\\n` + `"categoryAxis": {` + `\\n` + `"title": {` + `\\n` + `"visible": true` + `\\n` + `}` + `\\n` + `},` + `\\n` + `"title": {` + `\\n` + `"visible": true,` + `\\n` + `"text": "Vizframe Charts for 2UI5"` + `\\n` + `}` + `\\n` + `}`;
    this.mt_feed_values = [`Revenue`, `Cost`];
    this.ms_screen.viztype = `column`;
    this.ms_screen.viztypesel = `column`;
    this.mt_viztypes = [{ n: `column`, v: `column` }, { n: `bar`, v: `bar` }, { n: `stacked_bar`, v: `stacked_bar` }, { n: `stacked_column`, v: `stacked_column` }, { n: `line`, v: `line` }, { n: `combination`, v: `combination` }, { n: `bullet`, v: `bullet` }, { n: `vertical_bullet`, v: `vertical_bullet` }, { n: `100_stacked_bar`, v: `100_stacked_bar` }, { n: `100_stacked_column`, v: `100_stacked_column` }, { n: `stacked_combination`, v: `stacked_combination` }, { n: `horizontal_stacked_combination`, v: `horizontal_stacked_combination` }, { n: `waterfall`, v: `waterfall` }, { n: `horizontal_waterfall`, v: `horizontal_waterfall` }, { n: `area`, v: `area` }, { n: `radar`, v: `radar` }];
  }

  on_rendering() {
    const lr_view = z2ui5_cl_xml_view.factory().shell();
    const lr_dyn_page = lr_view.dynamic_page({ showfooter: false });
    const lr_header_title = lr_dyn_page.title({ ns: `f` }).get().dynamic_page_title();
    lr_header_title.heading(`f`).title(`abap2UI5 - VizFrame Charts`);
    const lr_header = lr_dyn_page.header(`f`).dynamic_page_header(true).content(`f`);
    lr_header.button({ text: `back`, press: this.client._event_nav_app_leave(), visible: this.client.check_app_prev_stack() });
    const lr_filter_bar = lr_header.filter_bar({ usetoolbar: `false` }).filter_group_items();
    const lr_filter = lr_filter_bar.filter_group_item({ name: `VizFrameType`, label: `VizFrame type`, groupname: `GroupVizFrameType`, visibleinfilterbar: `true` })
      .filter_control();
    lr_filter.combobox({ selectedkey: this.client._bind_edit(this.ms_screen.viztypesel, { name: `ms_screen-viztypesel` }), change: this.client._event(`EVT_VIZTYPE_CHANGE`), showclearicon: true, items: this.client._bind(this.mt_viztypes) })
      .item({ key: `{N}`, text: `{V}` });
    const lr_content = lr_dyn_page.content(`f`);
    const lr_vizframe = lr_content.viz_frame({ id: `idVizFrame`, vizproperties: this.mv_prop, viztype: this.client._bind(this.ms_screen.viztype, { name: `ms_screen-viztype` }), height: `500px`, width: `100%`, selectdata: this.client._event(`EVT_DATA_SELECT`, [`\${$parameters>/data/0/data/}`]) });
    const lr_dataset = lr_vizframe.viz_dataset();
    const lr_flatteneddataset = lr_dataset.viz_flattened_dataset(this.client._bind(this.mt_data_chart));
    const lr_dimensions = lr_flatteneddataset.viz_dimensions();
    const lr_dimensions_def = lr_dimensions.viz_dimension_definition({ name: `Week`, value: `{WEEK}` });
    const lr_measures = lr_flatteneddataset.viz_measures();
    const lr_measures_def1 = lr_measures.viz_measure_definition({ name: `Revenue`, value: `{REVENUE}` });
    const lr_measures_def2 = lr_measures.viz_measure_definition({ name: `Cost`, value: `{COST}` });
    const lr_feeds = lr_vizframe.viz_feeds();
    const lr_lr_feed_item1 = lr_feeds.viz_feed_item({ id: `valueAxisFeed`, uid: `valueAxis`, type: `Measure`, values: this.client._bind(this.mt_feed_values) });
    const lr_lr_feed_item2 = lr_feeds.viz_feed_item({ id: `categoryAxisFeed`, uid: `categoryAxis`, type: `Dimension`, values: `Week` });
    this.client.view_display(lr_view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.on_rendering();
    } else {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_312;
