const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_300 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page_01 = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Object Status`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page_01.header_content()
      .button({ id: `button_hint_id`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`CLICK_HINT_ICON`) });
    page_01.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.ObjectStatus/sample/sap.m.sample.ObjectStatus` });
    page_01.vertical_layout({ width: `100%` })
      .block_layout()
      .block_layout_row()
      .block_layout_cell()
      .vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .label({ text: `ObjectStatus with different value states`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginTop` })
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Unknown`, state: `None` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Currently closed`, icon: `sap-icon://information`, state: `Information` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Product Shipped`, icon: `sap-icon://sys-enter-2`, state: `Success` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Product Missing`, icon: `sap-icon://alert`, state: `Warning` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Product Damaged`, icon: `sap-icon://error`, state: `Error` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Product Damaged`, state: `Error` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, title: `Product status`, text: `Damaged`, active: true, state: `Error`, press: client._event(`handleStatusPressed`), icon: `sap-icon://error` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, title: `Test`, active: true, state: `Error`, icon: `sap-icon://error` })
      .get_parent()
      .get_parent()
      .get_parent()
      .block_layout_cell()
      .vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .label({ text: `Inverted ObjectStatus with different value states.`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginTop` })
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Unknown`, inverted: true, state: `None` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Currently closed (click)`, inverted: true, active: true, icon: `sap-icon://information`, state: `Information` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Product Shipped`, inverted: true, icon: `sap-icon://sys-enter-2`, state: `Success` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Product Missing`, inverted: true, icon: `sap-icon://alert`, state: `Warning` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Product Damaged`, active: true, inverted: true, state: `Error`, icon: `sap-icon://error` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, active: true, inverted: true, state: `Error`, icon: `sap-icon://error` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent();
    page_01.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .block_layout()
      .block_layout_row()
      .block_layout_cell()
      .label({ text: `ObjectStatus with different indication states.`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginBottom` })
      .vertical_layout({ width: `100%` })
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 1`, state: `Indication01` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 2`, state: `Indication02` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 3`, state: `Indication03` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 4 active`, active: true, state: `Indication04` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 5`, state: `Indication05` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 6`, state: `Indication06` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 7`, state: `Indication07` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Indication 8`, state: `Indication08` })
      .get_parent()
      .get_parent()
      .get_parent()
      .block_layout_cell()
      .label({ text: `Inverted ObjectStatus with different indication states.`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginBottom` })
      .vertical_layout({ width: `100%` })
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication1`, inverted: true, state: `Indication01` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication2`, inverted: true, state: `Indication02` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication3 active`, inverted: true, active: true, state: `Indication03` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication4`, inverted: true, state: `Indication04` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication5 active`, inverted: true, active: true, state: `Indication05` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication6 active`, active: true, inverted: true, icon: `sap-icon://attachment`, state: `Indication06` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication7 active`, active: true, inverted: true, state: `Indication07` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication8 active`, active: true, inverted: true, state: `Indication08` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication9 active`, active: true, inverted: true, state: `Indication09` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication10`, inverted: true, state: `Indication10` })
      .get_parent()
      .get_parent()
      .get_parent()
      .block_layout_cell()
      .vertical_layout({ width: `100%` })
      .label({ text: `Inverted ObjectStatus with different indication states.`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginBottom` })
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication11`, inverted: true, state: `Indication11` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication12 active`, active: true, inverted: true, state: `Indication12` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication13 active`, inverted: true, active: true, state: `Indication13` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication14 active`, active: true, inverted: true, icon: `sap-icon://notes`, state: `Indication14` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication15 active`, active: true, inverted: true, state: `Indication15` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication16`, inverted: true, state: `Indication16` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication17 active`, active: true, inverted: true, state: `Indication17` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication18`, inverted: true, state: `Indication18` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication19 active`, active: true, inverted: true, state: `Indication19` })
      .get_parent()
      .object_status({ class: `sapUiSmallMarginBottom`, text: `Inverted Indication20`, inverted: true, state: `Indication20` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent();
    page_01.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .label({ text: `ObjectStatus with style sapMObjectStatusLarge applied`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginTop` })
      .object_status({ class: `sapMObjectStatusLarge`, title: `Product status`, text: `Shipped`, state: `Success`, icon: `sap-icon://sys-enter-2` })
      .get_parent()
      .object_status({ class: `sapMObjectStatusLarge`, text: `Shipped`, state: `Success`, inverted: true, icon: `sap-icon://sys-enter-2` })
      .get_parent();
    page_01.vertical_layout({ class: `sapUiContentPadding`, width: `100%` })
      .label({ text: `ObjectStatus with and without sapMObjectStatusLongText CSS class`, design: `Bold`, wrapping: true, class: `sapUiSmallMarginTop` })
      .table()
      .columns()
      .column()
      .text(`ObjectStatus with default text wrapping`)
      .get_parent()
      .column()
      .text(`ObjectStatus with enhanced text wrapping via 'sapMObjectStatusLongText' CSS class`)
      .get_parent()
      .get_parent()
      .column_list_item()
      .cells()
      .object_status({ class: ``, title: `Product status`, text: `VeryLongTextToDemonstrateWrappingVeryLongTextToDemonstrateWrappingVeryLongTextToDemonstrateWrappingVeryLongTextToDemonstrateWrapping` })
      .get_parent()
      .object_status({ class: `sapMObjectStatusLongText`, title: `Product status`, text: `VeryLongTextToDemonstrateWrappingVeryLongTextToDemonstrateWrappingVeryLongTextToDemonstrateWrappingVeryLongTextToDemonstrateWrapping` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent();
    client.view_display(page_01.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `CLICK_HINT_ICON`:
        this.popover_display({ id: `button_hint_id` });
        break;
      case `handleStatusPressed`:
        client.message_box_display(`Product was damaged along transportation.`, ``, `Error description`, undefined, undefined, [`OK `]);
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `The object status is a small building block representing a status with a semantic color.` });
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

module.exports = z2ui5_cl_demo_app_300;
