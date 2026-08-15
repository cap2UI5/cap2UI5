const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_421 extends z2ui5_if_app {
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
    switch (this.client.get_event()) {
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
  }

  view_display() {
    let sy_tabix = 0;
    let i;
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Focus - Focus a Table Cell by Column and Row` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Set the keyboard focus to any editable table cell from the backend - type a column id ` + `(Title, Color, Info, Checkbox or Description) and a row index, then press Set Focus, or ` + `use Next / Reset. No JavaScript is shipped with the view: every cell has a stable control ` + `id (<column>_<row>) that the set_focus follow-up action targets, and the framework reports ` + `the currently focused cell back to the backend in s_focus.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tab = page.ele(`Table`)
      .ele(`headerToolbar`)
      .ele(`OverflowToolbar`)
      .tag(`Title`)
      .a({ n: `text`, v: this.client._bind(this.focusid) })
      .tag(`ToolbarSpacer`)
      .tag(`Label`)
      .a({ n: `text`, v: `Column Id` })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `Column` })
      .a({ n: `value`, v: this.client._bind(this.focuscolumn) })
      .a({ n: `submit`, v: this.client._event(`FOCUS`) })
      .a({ n: `width`, v: `8rem` })
      .tag(`Label`)
      .a({ n: `text`, v: `Row Index` })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `Row` })
      .a({ n: `type`, v: `Number` })
      .a({ n: `value`, v: this.client._bind(this.focusrow) })
      .a({ n: `submit`, v: this.client._event(`FOCUS`) })
      .a({ n: `width`, v: `6rem` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`FOCUS`) })
      .a({ n: `text`, v: `Set Focus` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`NEXT`) })
      .a({ n: `text`, v: `Next Focus` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`RESET`) })
      .a({ n: `text`, v: `Reset Focus` })
      .end()
      .end();
    tab.ele(`columns`)
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Index` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Title` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Color` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Info` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Checkbox` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Description` });
    const path = this.client._bind(this.t_tab, { path: true });
    const items = tab.ele(`items`);
    sy_tabix = 0;
    for (const row of this.t_tab) {
      sy_tabix++;
      i = sy_tabix - 1;
      items.ele(`ColumnListItem`)
        .ele(`cells`)
        .tag(`Text`)
        .a({ n: `text`, v: `${row.index}` })
        .tag(`Input`)
        .a({ n: `id`, v: `${z2ui5_cl_smp_app_421.cs_column.title}_${i}` })
        .a({ n: `value`, v: `{${path}/${i}/TITLE}` })
        .a({ n: `submit`, v: this.client._event(`NEXT`) })
        .tag(`Input`)
        .a({ n: `id`, v: `${z2ui5_cl_smp_app_421.cs_column.color}_${i}` })
        .a({ n: `value`, v: `{${path}/${i}/VALUE}` })
        .a({ n: `submit`, v: this.client._event(`NEXT`) })
        .tag(`Input`)
        .a({ n: `id`, v: `${z2ui5_cl_smp_app_421.cs_column.info}_${i}` })
        .a({ n: `value`, v: `{${path}/${i}/INFO}` })
        .a({ n: `submit`, v: this.client._event(`NEXT`) })
        .tag(`CheckBox`)
        .a({ n: `id`, v: `${z2ui5_cl_smp_app_421.cs_column.checkbox}_${i}` })
        .a({ n: `selected`, v: `{${path}/${i}/CHECKBOX}` })
        .tag(`Input`)
        .a({ n: `id`, v: `${z2ui5_cl_smp_app_421.cs_column.description}_${i}` })
        .a({ n: `value`, v: `{${path}/${i}/DESCRIPTION}` })
        .a({ n: `submit`, v: this.client._event(`NEXT`) });
    }
    this.client.view_display(view.stringify());
  }

  focus() {
    this.focusid = `${this.focuscolumn}_${this.focusrow}`;
    this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [this.focusid]);
  }

  read_focus() {
    let [col, row] = this.client.get().S_FOCUS.ID.split(`_`);
    if (!z2ui5_cl_util.abap_is_initial(row) && [...String(row)].every(($c) => String(`0123456789`).includes($c)) && (col === z2ui5_cl_smp_app_421.cs_column.title || col === z2ui5_cl_smp_app_421.cs_column.color || col === z2ui5_cl_smp_app_421.cs_column.info || col === z2ui5_cl_smp_app_421.cs_column.checkbox || col === z2ui5_cl_smp_app_421.cs_column.description)) {
      this.focuscolumn = z2ui5_cl_util.abap_tab_assign(this.focuscolumn, z2ui5_cl_util.abap_copy(col));
      this.focusrow = z2ui5_cl_util.abap_tab_assign(this.focusrow, z2ui5_cl_util.abap_copy(row));
    }
  }

  next_focus() {
    let nextrow;
    this.focuscolumn = (this.focuscolumn === z2ui5_cl_smp_app_421.cs_column.title ? z2ui5_cl_smp_app_421.cs_column.color : this.focuscolumn === z2ui5_cl_smp_app_421.cs_column.color ? z2ui5_cl_smp_app_421.cs_column.info : this.focuscolumn === z2ui5_cl_smp_app_421.cs_column.info ? z2ui5_cl_smp_app_421.cs_column.checkbox : this.focuscolumn === z2ui5_cl_smp_app_421.cs_column.checkbox ? z2ui5_cl_smp_app_421.cs_column.description : z2ui5_cl_smp_app_421.cs_column.title);
    if (this.focuscolumn === z2ui5_cl_smp_app_421.cs_column.title) {
      nextrow = (this.focusrow) + 1;
      if (this.t_tab.length >= (nextrow + 1)) {
        this.focusrow = `${nextrow}`;
      } else {
        this.focusrow = `0`;
      }
    }
  }

  default_focus() {
    this.focuscolumn = z2ui5_cl_util.abap_tab_assign(this.focuscolumn, z2ui5_cl_util.abap_copy(z2ui5_cl_smp_app_421.cs_column.title));
    this.focusrow = `0`;
  }
}

module.exports = z2ui5_cl_smp_app_421;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

