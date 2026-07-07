const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_011 extends z2ui5_if_app {
  t_tab = [];
  check_editable_active = false;
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Tables and editable`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack(), id: `test2` });
    const tab = page.table({ items: `{path: '${this.client._bind_edit(this.t_tab, { path: true })}', templateShareable: false}`, mode: `MultiSelect` })
      .header_toolbar()
      .overflow_toolbar()
      .title(`title of the table`)
      .button({ text: `test`, press: this.client._event(`BUTTON_TEST`) })
      .toolbar_spacer()
      .button({ icon: `sap-icon://delete`, text: `delete selected row`, press: this.client._event(`BUTTON_DELETE`) })
      .button({ icon: `sap-icon://add`, text: `add`, press: this.client._event(`BUTTON_ADD`) })
      .button({ icon: `sap-icon://edit`, text: (this.check_editable_active === true ? `display` : `edit`), press: this.client._event(`BUTTON_EDIT`) })
      .get_parent()
      .get_parent();
    tab.columns()
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
      .text(`Description`)
      .get_parent()
      .column()
      .text(`Checkbox`);
    tab.items()
      .column_list_item({ selected: `{SELKZ}` })
      .cells()
      .input({ value: `{TITLE}`, enabled: `{EDITABLE}`, id: `test` })
      .input({ value: `{VALUE}`, enabled: `{EDITABLE}` })
      .input({ value: `{INFO}`, enabled: `{EDITABLE}` })
      .input({ value: `{DESCR}`, enabled: `{EDITABLE}` })
      .checkbox({ selected: `{CHECKBOX}`, enabled: `{EDITABLE}` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    let sy_tabix = 0;
    this.client = client;
    if (client.check_on_init()) {
      this.check_editable_active = false;
      this.t_tab = [{ title: `entry 01`, value: `red`, info: `completed`, descr: `this is a description`, checkbox: true }, { title: `entry 02`, value: `blue`, info: `completed`, descr: `this is a description`, checkbox: true }, { title: `entry 03`, value: `green`, info: `completed`, descr: `this is a description`, checkbox: true }, { title: `entry 04`, value: `orange`, info: `completed`, descr: ``, checkbox: true }, { title: `entry 05`, value: `grey`, info: `completed`, descr: `this is a description`, checkbox: true }, { }];
      this.view_display();
    } else if (client.check_on_event(`BUTTON_EDIT`)) {
      this.check_editable_active = (this.check_editable_active === false);
      sy_tabix = 0;
      for (const lr_tab of this.t_tab) {
        sy_tabix++;
        lr_tab.editable = this.check_editable_active;
      }
      client.view_model_update();
    } else if (client.check_on_event(`BUTTON_DELETE`)) {
      for (let _i = this.t_tab.length - 1; _i >= 0; _i--) { const row = this.t_tab[_i]; if (row.selkz === true) this.t_tab.splice(_i, 1); }
      client.view_model_update();
    } else if (client.check_on_event(`BUTTON_ADD`)) {
      this.t_tab.push({});
      client.view_model_update();
    }
  }
}

module.exports = z2ui5_cl_demo_app_011;
