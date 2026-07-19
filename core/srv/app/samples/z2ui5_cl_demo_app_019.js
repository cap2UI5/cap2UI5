const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_019 extends z2ui5_if_app {
  t_tab = [];
  t_tab_sel = [];
  sel_mode = ``;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Table with different Selection Modes`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `A SegmentedButton switches the table's selection mode (None, Single, Multi) at ` + `runtime; a second table below collects the rows selected in the first.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.segmented_button({ selected_key: this.client._bind_edit(this.sel_mode), selection_change: this.client._event(`BUTTON_SEGMENT_CHANGE`) })
      .get()
      .items()
      .get()
      .segmented_button_item({ key: `None`, text: `None` })
      .segmented_button_item({ key: `SingleSelect`, text: `SingleSelect` })
      .segmented_button_item({ key: `SingleSelectLeft`, text: `SingleSelectLeft` })
      .segmented_button_item({ key: `SingleSelectMaster`, text: `SingleSelectMaster` })
      .segmented_button_item({ key: `MultiSelect`, text: `MultiSelect` });
    page.table({ headertext: `Table`, mode: this.sel_mode, items: this.client._bind_edit(this.t_tab) })
      .columns()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Value`)
      .get_parent()
      .column()
      .text(`Description`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .text(`{TITLE}`)
      .text(`{VALUE}`)
      .text(`{DESCR}`);
    page.table(this.client._bind(this.t_tab_sel))
      .header_toolbar()
      .overflow_toolbar()
      .title(`Selected Entries`)
      .button({ icon: `sap-icon://pull-down`, text: `copy selected entries`, press: this.client._event(`BUTTON_READ_SEL`) })
      .get_parent()
      .get_parent()
      .columns()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Value`)
      .get_parent()
      .column()
      .text(`Description`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .text(`{TITLE}`)
      .text(`{VALUE}`)
      .text(`{DESCR}`);
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.sel_mode = `None`;
      this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ descr: `this is a description`, title: `title_01`, value: `value_01` }, { descr: `this is a description`, title: `title_02`, value: `value_02` }, { descr: `this is a description`, title: `title_03`, value: `value_03` }, { descr: `this is a description`, title: `title_04`, value: `value_04` }, { descr: `this is a description`, title: `title_05`, value: `value_05` }]);
    } else if (client.check_on_event(`BUTTON_SEGMENT_CHANGE`)) {
      client.message_toast_display(`Selection Mode changed`);
    } else if (client.check_on_event(`BUTTON_READ_SEL`)) {
      this.t_tab_sel = z2ui5_cl_util.abap_tab_assign(this.t_tab_sel, z2ui5_cl_util.abap_copy(this.t_tab));
      for (let _i = this.t_tab_sel.length - 1; _i >= 0; _i--) { const row = this.t_tab_sel[_i]; if (!(row.selkz === true || row.selkz === `X`)) this.t_tab_sel.splice(_i, 1); }
    }
    this.view_display();
  }
}

module.exports = z2ui5_cl_demo_app_019;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

