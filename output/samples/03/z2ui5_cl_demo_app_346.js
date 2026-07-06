const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_346 extends z2ui5_if_app {
  static c_id = { index: `Index`, title: `Title`, color: `Color`, info: `Info`, checkbox: `Checkbox`, description: `Description` };

  t_tab = [];
  focuscolumn = ``;
  focusrow = ``;
  focusid = ``;
  client = null;

  set_view() {
    const view = z2ui5_cl_xml_view.factory();
    view._generic({ name: `script`, ns: `html` })
      ._cc_plain_xml(`window.addEventListener('focus', function(e) {` + ` try {` + ` const focusCtrlId = sap.ui.getCore().getCurrentFocusedControlId(); ` + ` if (!focusCtrlId) {` + ` return;` + ` }` + ` const customData = sap.ui.core.Element.getElementById(focusCtrlId).getCustomData()[0];` + ` if (!customData) {` + ` return;` + ` }` + ` const column = customData.getProperty("value");` + ` if (!column) {` + ` return;` + ` }` + ` const m = focusCtrlId.match(/(\d+$)/);` + ` const model = z2ui5.oView.getModel() ;` + ` model.setProperty("/FOCUSID",focusCtrlId);` + ` model.setProperty("/XX/FOCUSCOLUMN",column);` + ` model.setProperty("/XX/FOCUSROW",m[1]);` + ` } catch(e){}` + `}, true);` + `` + `z2ui5.determineFocusId = (column, row) => { ` + ` try {` + ` const selector = "td:has([data-columnid='" + column + "']) > div";` + ` const id = document.querySelectorAll(selector)[row].id;` + ` z2ui5.oView.getModel().setProperty("/FOCUSID",id);` + ` const element = sap.ui.core.Element.getElementById(id);` + ` if (!element) {` + ` return;` + ` }` + ` const focus = element.getFocusInfo();` + ` element.applyFocusInfo(focus);` + ` } catch(e){}` + `}`);
    const page = view.shell()
      .page({ title: `abap2UI5 - Tables and focus`, navbuttonpress: this.client._event(`BACK`), shownavbutton: true });
    const tab = page.table(this.client._bind_edit(this.t_tab))
      .header_toolbar()
      .overflow_toolbar()
      .label(`Column Id`)
      .input({ submit: this.client._event(`FOCUS`), value: this.client._bind_edit(this.focuscolumn), placeholder: `Focus Column`, width: `10%` })
      .label(`Row Index`)
      .input({ submit: this.client._event(`FOCUS`), value: this.client._bind_edit(this.focusrow), placeholder: `Focus Row`, width: `10%`, type: `Number` })
      .button({ text: `Set Focus`, press: this.client._event(`FOCUS`) })
      .button({ text: `Next Focus`, press: this.client._event(`ENTER`) })
      .button({ text: `Reset Focus`, press: this.client._event(`RESET`) })
      .title(this.client._bind(this.focusid))
      .toolbar_spacer()
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
    tab.items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .text(`{INDEX}`)
      .input({ value: `{TITLE}`, submit: this.client._event(`ENTER`) })
      .get()
      .custom_data()
      .core_custom_data({ key: `ColumnId`, value: z2ui5_cl_demo_app_346.c_id.title, writetodom: true })
      .get_parent()
      .get_parent()
      .input({ value: `{VALUE}`, submit: this.client._event(`ENTER`) })
      .get()
      .custom_data()
      .core_custom_data({ key: `ColumnId`, value: z2ui5_cl_demo_app_346.c_id.color, writetodom: true })
      .get_parent()
      .get_parent()
      .input({ value: `{INFO}`, submit: this.client._event(`ENTER`) })
      .get()
      .custom_data()
      .core_custom_data({ key: `ColumnId`, value: z2ui5_cl_demo_app_346.c_id.info, writetodom: true })
      .get_parent()
      .get_parent()
      .checkbox(`{CHECKBOX}`)
      .get()
      .custom_data()
      .core_custom_data({ key: `ColumnId`, value: z2ui5_cl_demo_app_346.c_id.checkbox, writetodom: true })
      .get_parent()
      .get_parent()
      .input({ value: `{DESCRIPTION}`, submit: this.client._event(`ENTER`) })
      .get()
      .custom_data()
      .core_custom_data({ key: `ColumnId`, value: z2ui5_cl_demo_app_346.c_id.description, writetodom: true });
    this.client.view_display(view.stringify());
    this.focus();
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = [{ index: 0, title: `entry 01`, value: `red`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 1, title: `entry 02`, value: `blue`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 2, title: `entry 03`, value: `green`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 3, title: `entry 04`, value: `orange`, info: `completed`, description: ``, checkbox: true }, { index: 4, title: `entry 05`, value: `grey`, info: `completed`, description: `this is a description`, checkbox: true }, { index: 5 }];
      this.default_focus();
      this.set_view();
      return;
    }
    switch (client.get().EVENT) {
      case `BACK`:
        client.view_destroy();
        client.nav_app_leave();
        break;
      case `FOCUS`:
        this.focus();
        break;
      case `RESET`:
        this.default_focus();
        this.focus();
        break;
      case `ENTER`:
        this.next_focus();
        this.focus();
        break;
    }
    client.view_model_update();
  }

  next_focus() {
    this.focuscolumn = (this.focuscolumn === z2ui5_cl_demo_app_346.c_id.title ? z2ui5_cl_demo_app_346.c_id.color : this.focuscolumn === z2ui5_cl_demo_app_346.c_id.color ? z2ui5_cl_demo_app_346.c_id.info : this.focuscolumn === z2ui5_cl_demo_app_346.c_id.info ? z2ui5_cl_demo_app_346.c_id.checkbox : this.focuscolumn === z2ui5_cl_demo_app_346.c_id.checkbox ? z2ui5_cl_demo_app_346.c_id.description : z2ui5_cl_demo_app_346.c_id.title);
    if (this.focuscolumn === z2ui5_cl_demo_app_346.c_id.title) {
      if (this.t_tab.length >= (this.focusrow + 2)) {
        this.focusrow = (this.focusrow + 1).trim();
      } else {
        this.focusrow = `0`;
      }
    }
  }

  focus() {
    this.client.follow_up_action(`z2ui5.determineFocusId("` + this.focuscolumn + `", "` + this.focusrow + `")`);
  }

  default_focus() {
    this.focuscolumn = `Title`;
    this.focusrow = `0`;
  }
}

module.exports = z2ui5_cl_demo_app_346;
