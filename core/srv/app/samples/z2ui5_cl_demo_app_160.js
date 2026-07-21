const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_160 extends z2ui5_if_app {
  mt_output = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.model_init();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  model_init() {
    this.mt_output = {};
    for (let sy_index = 1; sy_index <= 10; sy_index++) {
      this.mt_output.push(z2ui5_cl_util.abap_copy({ index: sy_index, set_sk: `Test`, matnr: `1234567`, description: `Test`, pl_01: 0, pl_02: 0, is_total: 0, pl_total: 0, per_cent_total: 0, is_01_prev: 0, per_cent_01: 0, is_02_prev: 0, per_cent_02: 0, is_03_prev: 0, pl_03: 0, per_cent_03: 0, is_q01_prev: 0, pl_q01: 0, per_cent_q01: 0, is_q02_prev: 0, pl_q02: 0, per_cent_q02: 0, is_q03_prev: 0, pl_q03: 0, per_cent_q03: 0, is_q04_prev: 0, pl_q04: 0, per_cent_q04: 0 }));
    }
  }

  on_event() {
    if (this.client.check_on_event(`PL_TOTAL_CHANGE`)) {
      this.client.message_box_display(`Id of Input via source object: ` + this.client.get_event_arg() + z2ui5_cl_sample_context.cv_char_util_newline + `Id of Input via event.oSource.sId: ` + this.client.get_event_arg(2) + z2ui5_cl_sample_context.cv_char_util_newline + `Value of same row, index: ` + this.client.get_event_arg(3) + z2ui5_cl_sample_context.cv_char_util_newline + `Id of parent (row) via event.oSource.oParent.sId: ` + this.client.get_event_arg(4) + z2ui5_cl_sample_context.cv_char_util_newline + `Attribute of parameters.value: ` + this.client.get_event_arg(5));
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Event on cell level`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .header_content()
      .link()
      .get_parent();
    page.message_strip({ text: `Pressing ENTER in a sap.ui.table cell input fires a backend event that carries the cell id, ` + `its row index and the parent row id as event arguments, shown here in a message box.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.text(`Make an input and press ENTER`);
    const table = page.flex_box({ height: `85vh` })
      .ui_table({ alternaterowcolors: `true`, selectionmode: `None`, visiblerowcountmode: `Auto`, fixedrowcount: `1`, rows: this.client._bind(this.mt_output) });
    const columns = table.ui_columns();
    columns.ui_column({ width: `5.2rem`, sortproperty: `SET_SK`, filterproperty: `SET_SK` })
      .text(`Column 1`)
      .ui_template()
      .text(`{SET_SK}`);
    columns.ui_column({ width: `5rem`, sortproperty: `MATNR`, filterproperty: `MATNR` })
      .text(`Column 2`)
      .ui_template()
      .text(`{MATNR}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_TOTAL`, filterproperty: `PL_TOTAL` })
      .text(`Column 5`)
      .ui_template()
      .input({ value: `{PL_TOTAL}`, submit: this.client._event(`PL_TOTAL_CHANGE`, [`\${$source>/id}`, `$event.oSource.sId`, `\${INDEX}`, `$event.oSource.oParent.sId`, `\${$parameters>/value}`]), editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_total`, filterproperty: `per_cent_total` })
      .text(`Column 6`)
      .ui_template()
      .text(`{PL_TOTAL} %`);
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_160;

const z2ui5_cl_sample_context = require("./z2ui5_cl_sample_context");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

