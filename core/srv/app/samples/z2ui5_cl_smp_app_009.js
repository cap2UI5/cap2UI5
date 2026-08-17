const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_009 extends z2ui5_if_app {
  s_screen = { color_01: ``, color_02: ``, color_03: ``, city: ``, name: ``, lastname: ``, quantity: ``, unit: `` };
  t_suggestion = [];
  t_suggestion_sel = [];
  t_cities = [];
  t_employees_sel = [];
  client = null;
  t_employees = [];

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
    this.t_suggestion = z2ui5_cl_util.abap_tab_assign(this.t_suggestion, [{ descr: `this is the color Green`, value: `GREEN` }, { descr: `this is the color Blue`, value: `BLUE` }, { descr: `this is the color Black`, value: `BLACK` }, { descr: `this is the color Grey`, value: `GREY` }, { descr: `this is the color Blue2`, value: `BLUE2` }, { descr: `this is the color Blue3`, value: `BLUE3` }]);
    this.t_cities = z2ui5_cl_util.abap_tab_assign(this.t_cities, [{ value: `London`, descr: `London` }, { value: `Paris`, descr: `Paris` }, { value: `Rome`, descr: `Rome` }]);
    this.t_employees = z2ui5_cl_util.abap_tab_assign(this.t_employees, [{ city: `London`, name: `Tom`, lastname: `lastname1`, nr: `00001` }, { city: `London`, name: `Tom2`, lastname: `lastname2`, nr: `00002` }, { city: `London`, name: `Tom3`, lastname: `lastname3`, nr: `00003` }, { city: `London`, name: `Tom4`, lastname: `lastname4`, nr: `00004` }, { city: `Rome`, name: `Michaela1`, lastname: `lastname5`, nr: `00005` }, { city: `Rome`, name: `Michaela2`, lastname: `lastname6`, nr: `00006` }, { city: `Rome`, name: `Michaela3`, lastname: `lastname7`, nr: `00007` }, { city: `Rome`, name: `Michaela4`, lastname: `lastname8`, nr: `00008` }, { city: `Paris`, name: `Hermine1`, lastname: `lastname9`, nr: `00009` }, { city: `Paris`, name: `Hermine2`, lastname: `lastname10`, nr: `00010` }, { city: `Paris`, name: `Hermine3`, lastname: `lastname11`, nr: `00011` }]);
    this.view_display();
  }

  on_event() {
    switch (this.client.get_event()) {
      case `POPUP_TABLE_VALUE`:
        this.t_suggestion_sel = z2ui5_cl_util.abap_tab_assign(this.t_suggestion_sel, z2ui5_cl_util.abap_copy(this.t_suggestion));
        this.popup_value_suggestion();
        break;
      case `POPUP_TABLE_VALUE_CUSTOM`:
        this.t_employees_sel = z2ui5_cl_util.abap_tab_assign(this.t_employees_sel, []);
        this.popup_value_employee();
        break;
      case `SEARCH`:
        this.t_employees_sel = z2ui5_cl_util.abap_tab_assign(this.t_employees_sel, z2ui5_cl_util.abap_copy(this.t_employees));
        if (!z2ui5_cl_util.abap_is_initial(this.s_screen.city)) {
          for (let _i = this.t_employees_sel.length - 1; _i >= 0; _i--) { const row = this.t_employees_sel[_i]; if (row.city !== this.s_screen.city) this.t_employees_sel.splice(_i, 1); }
        }
        this.popup_value_employee();
        break;
      case `POPUP_TABLE_VALUE_CUSTOM_CONTINUE`:
        for (let _i = this.t_employees_sel.length - 1; _i >= 0; _i--) { const row = this.t_employees_sel[_i]; if (!(row.selkz === true || row.selkz === `X`)) this.t_employees_sel.splice(_i, 1); }
        if (this.t_employees_sel.length === 1) {
          this.s_screen.name = z2ui5_cl_util.abap_tab_assign(this.s_screen.name, z2ui5_cl_util.abap_copy(this.t_employees_sel[(1) - 1].name));
          this.s_screen.lastname = z2ui5_cl_util.abap_tab_assign(this.s_screen.lastname, z2ui5_cl_util.abap_copy(this.t_employees_sel[(1) - 1].lastname));
          this.client.message_toast_display(`value selected`);
          this.client.popup_destroy();
        } else {
          this.client.message_toast_display(`please select exactly one employee`);
        }
        break;
      case `POPUP_TABLE_VALUE_CONTINUE`:
        for (let _i = this.t_suggestion_sel.length - 1; _i >= 0; _i--) { const row = this.t_suggestion_sel[_i]; if (!(row.selkz === true || row.selkz === `X`)) this.t_suggestion_sel.splice(_i, 1); }
        if (this.t_suggestion_sel.length === 1) {
          this.s_screen.color_02 = z2ui5_cl_util.abap_tab_assign(this.s_screen.color_02, z2ui5_cl_util.abap_copy(this.t_suggestion_sel[(1) - 1].value));
          this.client.message_toast_display(`value selected`);
          this.client.popup_destroy();
        } else {
          this.client.message_toast_display(`please select exactly one color`);
        }
        break;
      case `BUTTON_SEND`:
        this.client.message_box_display(`success - values sent to the server`);
        break;
      case `BUTTON_CLEAR`:
        this.s_screen = { color_01: ``, color_02: ``, color_03: ``, city: ``, name: ``, lastname: ``, quantity: ``, unit: `` };
        this.client.message_box_display(`View initialized`);
        break;
    }
    this.view_display();
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Popup - Value Help: Suggestions and F4 Dialog` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Four value-help patterns: inline suggestions, numeric-only input, a value-help popup with a selectable table, ` + `and a custom popup with a city search. Fill the fields, then Clear resets the view and Send simulates a submit.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const form = page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L7 M7 S7` })
      .ele({ n: `content`, ns: `layout` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Input with Value Help` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Input with suggestion items` })
      .ele(`Input`)
      .a({ n: `placeholder`, v: `fill in your favorite colour` })
      .a({ n: `value`, v: this.client._bind(this.s_screen.color_01, { name: `s_screen-color_01` }) })
      .a({ n: `suggestionItems`, v: this.client._bind(this.t_suggestion) })
      .a({ n: `showSuggestion`, b: true })
      .ele(`suggestionItems`)
      .tag({ n: `ListItem`, ns: `core` })
      .a({ n: `text`, v: `{VALUE}` })
      .a({ n: `additionalText`, v: `{DESCR}` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Input only numbers allowed` })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `quantity` })
      .a({ n: `type`, v: `Number` })
      .a({ n: `value`, v: this.client._bind(this.s_screen.quantity, { name: `s_screen-quantity` }) });
    form.tag(`Label`)
      .a({ n: `text`, v: `Input with value` })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `fill in your favorite colour` })
      .a({ n: `value`, v: this.client._bind(this.s_screen.color_02, { name: `s_screen-color_02` }) })
      .a({ n: `valueHelpRequest`, v: this.client._event(`POPUP_TABLE_VALUE`) })
      .a({ n: `showValueHelp`, b: true });
    form.tag(`Label`)
      .a({ n: `text`, v: `Custom value Popup` })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `name` })
      .a({ n: `value`, v: this.client._bind(this.s_screen.name, { name: `s_screen-name` }) })
      .a({ n: `valueHelpRequest`, v: this.client._event(`POPUP_TABLE_VALUE_CUSTOM`) })
      .a({ n: `showValueHelp`, b: true })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `lastname` })
      .a({ n: `value`, v: this.client._bind(this.s_screen.lastname, { name: `s_screen-lastname` }) })
      .a({ n: `valueHelpRequest`, v: this.client._event(`POPUP_TABLE_VALUE_CUSTOM`) })
      .a({ n: `showValueHelp`, b: true });
    page.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag(`ToolbarSpacer`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_CLEAR`) })
      .a({ n: `text`, v: `Clear` })
      .a({ n: `icon`, v: `sap-icon://delete` })
      .a({ n: `type`, v: `Reject` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_SEND`) })
      .a({ n: `text`, v: `Send to Server` })
      .a({ n: `icon`, v: `sap-icon://paper-plane` })
      .a({ n: `type`, v: `Accept` });
    this.client.view_display(view.stringify());
  }

  popup_value_suggestion() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    const dialog = popup.ele(`Dialog`).a({ n: `title`, v: `abap2UI5 - Value Help` });
    const tab = dialog.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_suggestion_sel) })
      .a({ n: `mode`, v: `SingleSelectLeft` });
    tab.ele(`columns`)
      .ele(`Column`)
      .a({ n: `width`, v: `20rem` })
      .tag(`Text`)
      .a({ n: `text`, v: `Color` })
      .end()
      .ele(`Column`)
      .tag(`Text`)
      .a({ n: `text`, v: `Description` })
      .end();
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .a({ n: `selected`, v: `{SELKZ}` })
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{VALUE}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{DESCR}` });
    dialog.ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPUP_TABLE_VALUE_CONTINUE`) })
      .a({ n: `text`, v: `continue` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  popup_value_employee() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    const dialog = popup.ele(`Dialog`).a({ n: `title`, v: `abap2UI5 - Value Help` });
    dialog.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `editable`, b: true })
      .tag(`Label`)
      .a({ n: `text`, v: `Location` })
      .ele(`Input`)
      .a({ n: `value`, v: this.client._bind(this.s_screen.city, { name: `s_screen-city` }) })
      .a({ n: `suggestionItems`, v: this.client._bind(this.t_cities) })
      .a({ n: `showSuggestion`, b: true })
      .ele(`suggestionItems`)
      .tag({ n: `ListItem`, ns: `core` })
      .a({ n: `text`, v: `{VALUE}` })
      .a({ n: `additionalText`, v: `{DESCR}` })
      .end()
      .end()
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SEARCH`) })
      .a({ n: `text`, v: `search...` });
    const tab = dialog.ele(`Table`)
      .a({ n: `items`, v: this.client._bind(this.t_employees_sel) })
      .a({ n: `headerText`, v: `Employees` })
      .a({ n: `mode`, v: `SingleSelectLeft` });
    tab.ele(`columns`)
      .ele(`Column`)
      .a({ n: `width`, v: `10rem` })
      .tag(`Text`)
      .a({ n: `text`, v: `City` })
      .end()
      .ele(`Column`)
      .a({ n: `width`, v: `10rem` })
      .tag(`Text`)
      .a({ n: `text`, v: `Nr` })
      .end()
      .ele(`Column`)
      .a({ n: `width`, v: `15rem` })
      .tag(`Text`)
      .a({ n: `text`, v: `Name` })
      .end()
      .ele(`Column`)
      .a({ n: `width`, v: `30rem` })
      .tag(`Text`)
      .a({ n: `text`, v: `Lastname` })
      .end();
    tab.ele(`items`)
      .ele(`ColumnListItem`)
      .a({ n: `selected`, v: `{SELKZ}` })
      .ele(`cells`)
      .tag(`Text`)
      .a({ n: `text`, v: `{CITY}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{NR}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{NAME}` })
      .tag(`Text`)
      .a({ n: `text`, v: `{LASTNAME}` });
    dialog.ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPUP_TABLE_VALUE_CUSTOM_CONTINUE`) })
      .a({ n: `text`, v: `continue` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_009;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

