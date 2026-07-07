const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_160 extends z2ui5_if_app {
  mt_output = [];
  client = null;

  load_output_table() {
    let ls_output = {};
    this.mt_output = {};
    for (let sy_index = 1; sy_index <= 10; sy_index++) {
      ls_output.index = z2ui5_cl_util.abap_copy(sy_index);
      ls_output.set_sk = `Test`;
      ls_output.matnr = `1234567`;
      ls_output.description = `Test`;
      ls_output.pl_01 = 0;
      ls_output.pl_02 = 0;
      this.mt_output.push(ls_output);
    }
  }

  on_event() {
    let lv_id_event;
    let lv_tab_index;
    let ls_row_submit;
    let lv_id_parent;
    let lt_event_arguments = [];
    if (this.client.check_on_event(`PL_TOTAL_CHANGE`)) {
      lt_event_arguments = z2ui5_cl_util.struct_lower_keys(this.client.get().T_EVENT_ARG);
      lv_id_event = z2ui5_cl_util.abap_copy(lt_event_arguments[(1) - 1]);
      lv_tab_index = z2ui5_cl_util.abap_copy(lt_event_arguments[(2) - 1]);
      ls_row_submit = z2ui5_cl_util.abap_copy(this.mt_output[(lv_tab_index) - 1]);
      lv_id_parent = z2ui5_cl_util.abap_copy(lt_event_arguments[(3) - 1]);
      this.client.message_box_display(lv_tab_index + lv_id_event + lv_id_parent);
    }
    this.client.view_model_update();
  }

  render_main_screen() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Event on cell level`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .header_content()
      .link()
      .get_parent();
    const table = page.flex_box({ height: `85vh` })
      .ui_table({ alternaterowcolors: `true`, visiblerowcountmode: `Auto`, fixedrowcount: `1`, selectionmode: `None`, rows: this.client._bind_edit(this.mt_output) });
    const columns = table.ui_columns();
    columns.ui_column({ width: `5.2rem`, sortproperty: `SET_SK`, filterproperty: `SET_SK` })
      .text(`Column 1`)
      .ui_template()
      .text(`{SET_SK}`);
    columns.ui_column({ width: `5rem`, sortproperty: `MATNR`, filterproperty: `MATNR` })
      .text(`Column 2`)
      .ui_template()
      .text(`{MATNR}`);
    columns.ui_column({ width: `20rem`, sortproperty: `DESCRIPTION`, filterproperty: `DESCRIPTION` })
      .text(`Column 3`)
      .ui_template()
      .text(`{DESCRIPTION}`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_TOTAL`, filterproperty: `IS_TOTAL` })
      .text(`Column 4`)
      .ui_template()
      .text(`{IS_TOTAL}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_TOTAL`, filterproperty: `PL_TOTAL` })
      .text(`Column 5`)
      .ui_template()
      .input({ value: `{PL_TOTAL}`, submit: this.client._event(`PL_TOTAL_CHANGE`, [`\${$source>/id}`, `\${INDEX}`, `$event.oSource.oParent.sId`]), editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_total`, filterproperty: `per_cent_total` })
      .text(`Column 6`)
      .ui_template()
      .text(`{per_cent_total} %`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_01_PREV`, filterproperty: `IS_01_PREV` })
      .text(`Column 7`)
      .ui_template()
      .text(`{IS_01_PREV}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_01`, filterproperty: `PL_01` })
      .text(`Column 8`)
      .ui_template()
      .input({ value: `{PL_01}`, editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_01`, filterproperty: `per_cent_01` })
      .text(`Column 9`)
      .ui_template()
      .text(`{per_cent_01} %`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_02_PREV`, filterproperty: `IS_02_PREV` })
      .text(`Column 10`)
      .ui_template()
      .text(`{IS_02_PREV}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_02`, filterproperty: `PL_02` })
      .text(`Column 11`)
      .ui_template()
      .input({ value: `{PL_02}`, editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_02`, filterproperty: `per_cent_02` })
      .text(`Column 12`)
      .ui_template()
      .text(`{per_cent_02} %`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_03_PREV`, filterproperty: `IS_03_PREV` })
      .text(`Column 13`)
      .ui_template()
      .text(`{IS_03_PREV}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_03`, filterproperty: `PL_03` })
      .text(`Column 14`)
      .ui_template()
      .input({ value: `{PL_03}`, editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_03`, filterproperty: `per_cent_03` })
      .text(`Column 15`)
      .ui_template()
      .text(`{per_cent_03} %`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_Q01_PREV`, filterproperty: `IS_Q01_PREV` })
      .text(`Column 16`)
      .ui_template()
      .text(`{IS_Q01_PREV}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_Q01`, filterproperty: `PL_Q01` })
      .text(`Column 17`)
      .ui_template()
      .text(`{PL_Q01}`);
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_q01`, filterproperty: `per_cent_q01` })
      .text(`Column 18`)
      .ui_template()
      .text(`{per_cent_q01} %`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_Q02_PREV`, filterproperty: `IS_Q02_PREV` })
      .text(`Column 19`)
      .ui_template()
      .text(`{IS_Q02_PREV}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_Q02`, filterproperty: `PL_Q02` })
      .text(`Column 20`)
      .ui_template()
      .input({ value: `{PL_Q02}`, editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_q02`, filterproperty: `per_cent_q02` })
      .text(`Column 21`)
      .ui_template()
      .text(`{per_cent_q02} %`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_Q03_PREV`, filterproperty: `IS_Q03_PREV` })
      .text(`Column 22`)
      .ui_template()
      .text(`{IS_Q03_PREV}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_Q03`, filterproperty: `PL_Q03` })
      .text(`Column 23`)
      .ui_template()
      .input({ value: `{PL_Q03}`, editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_q03`, filterproperty: `per_cent_q03` })
      .text(`Column 24`)
      .ui_template()
      .text(`{per_cent_q03} %`);
    columns.ui_column({ width: `5rem`, sortproperty: `IS_Q04_PREV`, filterproperty: `IS_Q04_PREV` })
      .text(`Column 25`)
      .ui_template()
      .text(`{IS_Q04_PREV}`);
    columns.ui_column({ width: `5rem`, sortproperty: `PL_Q04`, filterproperty: `PL_Q04` })
      .text(`Column 26`)
      .ui_template()
      .input({ value: `{PL_Q04}`, editable: true, type: `Number` });
    columns.ui_column({ width: `4rem`, sortproperty: `per_cent_q04`, filterproperty: `per_cent_q04` })
      .text(`Column 27`)
      .ui_template()
      .text(`{per_cent_q04} %`);
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.load_output_table();
      this.render_main_screen();
    } else {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_demo_app_160;
