const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_172 extends z2ui5_if_app {
  output = [];
  client = null;

  load_output_table() {
    let ls_output = {};
    this.output = {};
    for (let sy_index = 1; sy_index <= 11; sy_index++) {
      ls_output.index = sy_index;
      ls_output.text = `Text`;
      ls_output.link = `Link`;
      ls_output.currency = `123.45`;
      ls_output.waers = `EUR`;
      if (sy_index === 1) {
        ls_output.bool = false;
        ls_output.percent1 = `100.00`;
      } else {
        ls_output.bool = true;
        ls_output.percent1 = `10.00`;
      }
      this.output.push(ls_output);
    }
  }

  on_event() {
    let lv_id_event;
    let ls_row_submit;
    let lv_id_parent;
    let lv_column;
    let lt_event_arguments = [];
    let lv_tab_index = ``;
    let lv_message = ``;
    lt_event_arguments = z2ui5_cl_util.struct_lower_keys(this.client.get().T_EVENT_ARG);
    switch (this.client.get().EVENT) {
      case `LINK_CLICK`:
        lv_tab_index = lt_event_arguments[(1) - 1];
        lv_message = `Link in row ${lv_tab_index} clicked`;
        this.client.message_toast_display(lv_message);
        break;
      case `INPUT_CHANGE`:
        lv_id_event = lt_event_arguments[(1) - 1];
        lv_tab_index = lt_event_arguments[(2) - 1];
        ls_row_submit = this.output[(lv_tab_index) - 1];
        lv_id_parent = lt_event_arguments[(3) - 1];
        lv_column = lt_event_arguments[(4) - 1];
        this.calculate_sum({ i_column: lv_column });
        break;
    }
    this.client.follow_up_action(`z2ui5.afterBE()`);
    this.client.view_model_update();
  }

  render_main_screen() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ id: `page`, title: `abap2UI5 - Demo ui.table`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .header_content()
      .link()
      .get_parent();
    page._generic({ name: `script`, ns: `html` })
      ._cc_plain_xml(`z2ui5.afterBE = () => { setTimeout( () => { let input = document.activeElement.childNodes[0].childNodes[0].childNodes[0].childNodes[0]; input.focus( ); input.select(); } , 100 ); }`);
    const table = page.ui_table({ id: `tab`, alternaterowcolors: `true`, visiblerowcountmode: `Auto`, fixedrowcount: `1`, selectionmode: `None`, rows: this.client._bind_edit(this.output) });
    const columns = table.ui_columns();
    columns.ui_column({ width: `8rem`, sortproperty: `TEXT`, filterproperty: `TEXT` })
      .text(`Text Column`)
      .ui_template()
      .text(`{TEXT}`);
    columns.ui_column({ width: `8rem`, sortproperty: `LINK`, filterproperty: `LINK` })
      .text(`Link Column`)
      .ui_template()
      .link({ text: `{LINK}`, press: this.client._event(`LINK_CLICK`, [`\${INDEX}`]) });
    columns.ui_column({ width: `8rem`, sortproperty: `CURRENCY`, filterproperty: `CURRENCY` })
      .text(`Currency Column`)
      .ui_template()
      .text(`{ parts: [ 'CURRENCY', 'WAERS'], type: 'sap.ui.model.type.Currency', formatOptions: { currencyCode: false } }`);
    columns.ui_column({ width: `8rem`, sortproperty: `PERCENT1`, filterproperty: `PERCENT1` })
      .text(`Percentage`)
      .ui_template()
      .text(`{PERCENT1} %`);
    columns.ui_column({ width: `8rem`, sortproperty: `INPUT1`, filterproperty: `INPUT1` })
      .text(`Input Column`)
      .ui_template()
      .input({ value: `{INPUT1}`, enabled: `{BOOL}`, change: this.client._event(`INPUT_CHANGE`, [`\${$source>/id}`, `\${INDEX}`, `$event.oSource.oParent.sId`, `INPUT1`]), editable: true, type: `Number` });
    columns.ui_column({ width: `8rem`, sortproperty: `INPUT2`, filterproperty: `INPUT2` })
      .text(`Input Column`)
      .ui_template()
      .input({ value: `{INPUT2}`, enabled: `{BOOL}`, change: this.client._event(`INPUT_CHANGE`, [`\${$source>/id}`, `\${INDEX}`, `$event.oSource.oParent.sId`, `INPUT2`]), submit: this.client._event(`INPUT_SUBMIT`), editable: true, type: `Number` });
    columns.ui_column({ width: `8rem`, sortproperty: `INPUT3`, filterproperty: `INPUT3` })
      .text(`Input Column`)
      .ui_template()
      .input({ value: `{INPUT3}`, enabled: `{BOOL}`, change: this.client._event(`INPUT_CHANGE`, [`\${$source>/id}`, `\${INDEX}`, `$event.oSource.oParent.sId`, `INPUT3`]), editable: true, type: `Number` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.load_output_table();
      this.render_main_screen();
    } else {
      this.on_event();
    }
  }

  calculate_sum({ i_column } = {}) {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_f_input = null;
    let _fs$fs_f_input = null;
    let fs_f_output = null;
    let _fs$fs_f_output = null;
    let lv_sum = 0;
    sy_tabix = 0;
    for (const fs_f_output of this.output) {
      sy_tabix++;
      if (!(fs_f_output.index > 1)) continue;
      _fs$fs_f_input = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_f_output, i_column);
      fs_f_input = _fs$fs_f_input ? _fs$fs_f_input.o[_fs$fs_f_input.k] : null;
      sy_subrc = _fs$fs_f_input ? 0 : 4;
      lv_sum = lv_sum + fs_f_input;
    }
    {
      const _t = this.output;
      const _i = (1) - 1;
      sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
      fs_f_output = sy_subrc === 0 ? _t[_i] : null;
      _fs$fs_f_output = sy_subrc === 0 ? { o: _t, k: _i } : null;
    }
    _fs$fs_f_input = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(fs_f_output, i_column);
    fs_f_input = _fs$fs_f_input ? _fs$fs_f_input.o[_fs$fs_f_input.k] : null;
    sy_subrc = _fs$fs_f_input ? 0 : 4;
    fs_f_input = lv_sum;
    if (_fs$fs_f_input) _fs$fs_f_input.o[_fs$fs_f_input.k] = fs_f_input;
  }
}

module.exports = z2ui5_cl_demo_app_172;
