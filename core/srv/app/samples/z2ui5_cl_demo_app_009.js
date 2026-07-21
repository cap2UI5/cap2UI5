const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_009 extends z2ui5_if_app {
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
    switch (this.client.get().EVENT) {
      case `POPUP_TABLE_VALUE`:
        this.t_suggestion_sel = z2ui5_cl_util.abap_tab_assign(this.t_suggestion_sel, z2ui5_cl_util.abap_copy(this.t_suggestion));
        this.popup_value_suggestion();
        break;
      case `POPUP_TABLE_VALUE_CUSTOM`:
        this.t_employees_sel = {};
        this.popup_value_employee();
        break;
      case `SEARCH`:
        this.t_employees_sel = z2ui5_cl_util.abap_tab_assign(this.t_employees_sel, z2ui5_cl_util.abap_copy(this.t_employees));
        if (this.s_screen.city) {
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
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Value Help Examples`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Four value-help patterns: inline suggestions, numeric-only input, a value-help popup with a selectable table, ` + `and a custom popup with a city search. Fill the fields, then Clear resets the view and Send simulates a submit.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const form = page.grid(`L7 M7 S7`).content(`layout`).simple_form(`Input with Value Help`).content(`form`);
    form.label(`Input with suggestion items`)
      .input({ value: this.client._bind(this.s_screen.color_01, { name: `s_screen-color_01` }), placeholder: `fill in your favorite colour`, suggestionitems: this.client._bind(this.t_suggestion), showsuggestion: true })
      .get()
      .suggestion_items()
      .get()
      .list_item({ text: `{VALUE}`, additionaltext: `{DESCR}` });
    form.label(`Input only numbers allowed`)
      .input({ value: this.client._bind(this.s_screen.quantity, { name: `s_screen-quantity` }), type: `Number`, placeholder: `quantity` });
    form.label(`Input with value`)
      .input({ value: this.client._bind(this.s_screen.color_02, { name: `s_screen-color_02` }), placeholder: `fill in your favorite colour`, showvaluehelp: true, valuehelprequest: this.client._event(`POPUP_TABLE_VALUE`) });
    form.label(`Custom value Popup`)
      .input({ value: this.client._bind(this.s_screen.name, { name: `s_screen-name` }), placeholder: `name`, showvaluehelp: true, valuehelprequest: this.client._event(`POPUP_TABLE_VALUE_CUSTOM`) })
      .input({ value: this.client._bind(this.s_screen.lastname, { name: `s_screen-lastname` }), placeholder: `lastname`, showvaluehelp: true, valuehelprequest: this.client._event(`POPUP_TABLE_VALUE_CUSTOM`) });
    page.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Clear`, press: this.client._event(`BUTTON_CLEAR`), type: `Reject`, icon: `sap-icon://delete` })
      .button({ text: `Send to Server`, press: this.client._event(`BUTTON_SEND`), type: `Success`, icon: `sap-icon://paper-plane` });
    this.client.view_display(view.stringify());
  }

  popup_value_suggestion() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog(`abap2UI5 - Value Help`);
    const tab = dialog.table({ mode: `SingleSelectLeft`, items: this.client._bind(this.t_suggestion_sel) });
    tab.columns().column(`20rem`).text(`Color`).get_parent().column().text(`Description`).get_parent();
    tab.items().column_list_item({ selected: `{SELKZ}` }).cells().text(`{VALUE}`).text(`{DESCR}`);
    dialog.buttons()
      .button({ text: `continue`, press: this.client._event(`POPUP_TABLE_VALUE_CONTINUE`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }

  popup_value_employee() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog(`abap2UI5 - Value Help`);
    dialog.simple_form()
      .label(`Location`)
      .input({ value: this.client._bind(this.s_screen.city, { name: `s_screen-city` }), suggestionitems: this.client._bind(this.t_cities), showsuggestion: true })
      .get()
      .suggestion_items()
      .get()
      .list_item({ text: `{VALUE}`, additionaltext: `{DESCR}` })
      .get_parent()
      .get_parent()
      .button({ text: `search...`, press: this.client._event(`SEARCH`) });
    const tab = dialog.table({ headertext: `Employees`, mode: `SingleSelectLeft`, items: this.client._bind(this.t_employees_sel) });
    tab.columns()
      .column(`10rem`)
      .text(`City`)
      .get_parent()
      .column(`10rem`)
      .text(`Nr`)
      .get_parent()
      .column(`15rem`)
      .text(`Name`)
      .get_parent()
      .column(`30rem`)
      .text(`Lastname`)
      .get_parent();
    tab.items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .text(`{CITY}`)
      .text(`{NR}`)
      .text(`{NAME}`)
      .text(`{LASTNAME}`);
    dialog.buttons()
      .button({ text: `continue`, press: this.client._event(`POPUP_TABLE_VALUE_CUSTOM_CONTINUE`), type: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_009;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

