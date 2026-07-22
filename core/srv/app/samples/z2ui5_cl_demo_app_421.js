const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_421 extends z2ui5_if_app {
  static cs_column = { title: `Title`, color: `Color`, info: `Info`, checkbox: `Checkbox`, description: `Description` };

  t_tab = [];
  focuscolumn = ``;
  focusrow = ``;
  focusid = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ index: 0, title: `entry 01`, value: `red`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 1, title: `entry 02`, value: `blue`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 2, title: `entry 03`, value: `green`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 3, title: `entry 04`, value: `orange`, info: `completed`, description: ``, checkbox: true }, { index: 4, title: `entry 05`, value: `grey`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 5 }]);
    this.default_focus();
    this.view_display();
    this.focus();
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `FOCUS`:
        this.focus();
        break;
      case `NEXT`:
        this.read_focus();
        this.next_focus();
        this.focus();
        break;
      case `RESET`:
        this.default_focus();
        this.focus();
        break;
    }
    this.client.view_model_update();
  }

  view_display() {
    let sy_tabix = 0;
    let i;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Focus a Table Cell`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Set the keyboard focus to any editable table cell from the backend - type a column id ` + `(Title, Color, Info, Checkbox or Description) and a row index, then press Set Focus, or ` + `use Next / Reset. No JavaScript is shipped with the view: every cell has a stable control ` + `id (<column>_<row>) that the set_focus follow-up action targets, and the framework reports ` + `the currently focused cell back to the backend in s_focus.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const tab = page.table()
      .header_toolbar()
      .overflow_toolbar()
      .title(this.client._bind(this.focusid))
      .toolbar_spacer()
      .label(`Column Id`)
      .input({ value: this.client._bind_edit(this.focuscolumn), submit: this.client._event(`FOCUS`), placeholder: `Column`, width: `8rem` })
      .label(`Row Index`)
      .input({ value: this.client._bind_edit(this.focusrow), submit: this.client._event(`FOCUS`), placeholder: `Row`, type: `Number`, width: `6rem` })
      .button({ text: `Set Focus`, press: this.client._event(`FOCUS`) })
      .button({ text: `Next Focus`, press: this.client._event(`NEXT`) })
      .button({ text: `Reset Focus`, press: this.client._event(`RESET`) })
      .get_parent()
      .get_parent();
    tab.columns()
      .column()
      .text(`Index`)
      .get_parent()
      .column()
      .text(`Title`)
      .get_parent()
      .column()
      .text(`Color`)
      .get_parent()
      .column()
      .text(`Info`)
      .get_parent()
      .column()
      .text(`Checkbox`)
      .get_parent()
      .column()
      .text(`Description`);
    const path = this.client._bind_edit(this.t_tab, { path: true });
    const items = tab.items();
    sy_tabix = 0;
    for (const row of this.t_tab) {
      sy_tabix++;
      i = sy_tabix - 1;
      items.column_list_item()
        .cells()
        .text(`${row.index}`)
        .input({ id: `${z2ui5_cl_demo_app_421.cs_column.title}_${i}`, value: `{${path}/${i}/TITLE}`, submit: this.client._event(`NEXT`) })
        .input({ id: `${z2ui5_cl_demo_app_421.cs_column.color}_${i}`, value: `{${path}/${i}/VALUE}`, submit: this.client._event(`NEXT`) })
        .input({ id: `${z2ui5_cl_demo_app_421.cs_column.info}_${i}`, value: `{${path}/${i}/INFO}`, submit: this.client._event(`NEXT`) })
        .checkbox({ id: `${z2ui5_cl_demo_app_421.cs_column.checkbox}_${i}`, selected: `{${path}/${i}/CHECKBOX}` })
        .input({ id: `${z2ui5_cl_demo_app_421.cs_column.description}_${i}`, value: `{${path}/${i}/DESCRIPTION}`, submit: this.client._event(`NEXT`) });
    }
    this.client.view_display(view.stringify());
  }

  focus() {
    this.focusid = `${this.focuscolumn}_${this.focusrow}`;
    this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [this.focusid]);
  }

  read_focus() {
    let [col, row] = this.client.get().S_FOCUS.ID.split(`_`);
    if (row && [...String(row)].every(($c) => String(`0123456789`).includes($c)) && (col === z2ui5_cl_demo_app_421.cs_column.title || col === z2ui5_cl_demo_app_421.cs_column.color || col === z2ui5_cl_demo_app_421.cs_column.info || col === z2ui5_cl_demo_app_421.cs_column.checkbox || col === z2ui5_cl_demo_app_421.cs_column.description)) {
      this.focuscolumn = z2ui5_cl_util.abap_tab_assign(this.focuscolumn, z2ui5_cl_util.abap_copy(col));
      this.focusrow = z2ui5_cl_util.abap_tab_assign(this.focusrow, z2ui5_cl_util.abap_copy(row));
    }
  }

  next_focus() {
    let nextrow;
    this.focuscolumn = (this.focuscolumn === z2ui5_cl_demo_app_421.cs_column.title ? z2ui5_cl_demo_app_421.cs_column.color : this.focuscolumn === z2ui5_cl_demo_app_421.cs_column.color ? z2ui5_cl_demo_app_421.cs_column.info : this.focuscolumn === z2ui5_cl_demo_app_421.cs_column.info ? z2ui5_cl_demo_app_421.cs_column.checkbox : this.focuscolumn === z2ui5_cl_demo_app_421.cs_column.checkbox ? z2ui5_cl_demo_app_421.cs_column.description : z2ui5_cl_demo_app_421.cs_column.title);
    if (this.focuscolumn === z2ui5_cl_demo_app_421.cs_column.title) {
      nextrow = (this.focusrow) + 1;
      if (this.t_tab.length >= (nextrow + 1)) {
        this.focusrow = `${nextrow}`;
      } else {
        this.focusrow = `0`;
      }
    }
  }

  default_focus() {
    this.focuscolumn = z2ui5_cl_util.abap_tab_assign(this.focuscolumn, z2ui5_cl_util.abap_copy(z2ui5_cl_demo_app_421.cs_column.title));
    this.focusrow = `0`;
  }
}

module.exports = z2ui5_cl_demo_app_421;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

