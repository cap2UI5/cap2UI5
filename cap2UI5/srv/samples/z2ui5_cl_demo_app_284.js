const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_284 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Flexible sizing - Toolbar`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.Page/sample/sap.m.sample.PageListReportToolbar` });
    const page_02 = page_01.page({ enablescrolling: true, title: `Title`, class: `sapUiResponsivePadding--header sapUiResponsivePadding--footer` })
      .content()
      .vbox({ fitcontainer: true })
      .simple_form({ id: `SimpleFormDisplay480`, editable: false, layout: `ResponsiveGridLayout`, title: `Address`, labelspanl: `4`, labelspanm: `4`, emptyspanl: `0`, emptyspanm: `0`, columnsl: `2`, columnsm: `2` })
      .content(`form`)
      .title({ ns: `core`, text: `Office` })
      .label(`Name`)
      .text(`Red Point Stores`)
      .label(`Street/No.`)
      .text(`Main St 1618`)
      .label(`ZIP Code/City`)
      .text(`31415 Maintown`)
      .label(`Country`)
      .text(`Germany`)
      .title({ ns: `core`, text: `Online` })
      .label(`Web`)
      .text(`http://www.sap.com`)
      .label(`Twitter`)
      .text(`@sap`)
      .get_parent()
      .layout_data(`form`)
      .flex_item_data({ shrinkfactor: `0`, backgrounddesign: `Solid`, styleclass: `sapContrastPlus` })
      .get_parent()
      .get_parent()
      .analytical_table({ ns: `table`, selectionmode: `MultiToggle` })
      .rowmode(`table`)
      .auto({ ns: `trm`, rowcontentheight: `32` })
      .get_parent()
      .get_parent()
      .toolbar({ ns: `table` })
      .overflow_toolbar()
      .title(`Title Bar Here`)
      .toolbar_spacer()
      .search_field({ width: `12rem` })
      .segmented_button()
      .items()
      .segmented_button_item({ icon: `sap-icon://table-view` })
      .segmented_button_item({ icon: `sap-icon://bar-chart` })
      .get_parent()
      .get_parent()
      .button({ icon: `sap-icon://group-2`, type: `Transparent` })
      .button({ icon: `sap-icon://action-settings`, type: `Transparent` })
      .get_parent()
      .get_parent()
      .columns(`table`)
      .analytical_column(`table`)
      .get_parent()
      .analytical_column(`table`)
      .get_parent()
      .analytical_column(`table`)
      .get_parent()
      .get_parent()
      .layout_data(`table`)
      .flex_item_data({ growfactor: `1`, basesize: `0%`, styleclass: `sapUiResponsiveContentPadding` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .content()
      .toolbar_spacer()
      .button({ text: `Grouped View` })
      .button({ text: `Classical Table` });
    client.view_display(page_02.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`CLICK_HINT_ICON`)) {
      this.popover_display({ id: `button_hint_id` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `This page shows flexible sizing with a Toolbar. ` + `The upper part extends with its content, but doesn't react to viewport changes. ` + `The lower part reacts to the viewport size. The table inside takes the available space. ` + `If the minimum size of the table is reached, the page begins to scroll.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_284;
