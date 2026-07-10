const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_034 extends z2ui5_if_app {
  t_bapiret = null;
  mv_popup_name = ``;
  mv_main_xml = ``;
  mv_popup_xml = ``;

  view_main({ client } = {}) {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Popups`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const grid = page.grid(`L8 M12 S12`).content(`layout`);
    grid.simple_form(`Tables`)
      .content(`form`)
      .label(`01`)
      .button({ text: `Show bapiret tab`, press: client._event(`POPUP_BAL`) });
    this.mv_main_xml = page.stringify();
  }

  view_popup_bal({ client } = {}) {
    const popup = z2ui5_cl_xml_view.factory_popup()
      .dialog(`abap2ui5 - Popup Message Log`)
      .table(client._bind(this.t_bapiret))
      .columns()
      .column(`5rem`)
      .text(`Type`)
      .get_parent()
      .column(`5rem`)
      .text(`Number`)
      .get_parent()
      .column(`5rem`)
      .text(`ID`)
      .get_parent()
      .column()
      .text(`Message`)
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .text(`{TYPE}`)
      .text(`{NUMBER}`)
      .text(`{ID}`)
      .text(`{MESSAGE}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `close`, press: client._event(`POPUP_BAL_CLOSE`), type: `Emphasized` });
    this.mv_popup_xml = popup.stringify();
  }

  async main(client) {
    if (client.check_on_init()) {
      this.t_bapiret = [{ message: `An empty Report field causes an empty XML Message to be sent`, type: `E`, id: `MSG1`, number: `001` }, { message: `Check was executed for wrong Scenario`, type: `E`, id: `MSG1`, number: `002` }, { message: `Request was handled without errors`, type: `S`, id: `MSG1`, number: `003` }, { message: `product activated`, type: `S`, id: `MSG4`, number: `375` }, { message: `check the input values`, type: `W`, id: `MSG2`, number: `375` }, { message: `product already in use`, type: `I`, id: `MSG2`, number: `375` }];
    }
    this.mv_popup_name = ``;
    switch (client.get().EVENT) {
      case `POPUP_BAL`:
        this.mv_popup_name = `POPUP_BAL`;
        break;
    }
    this.view_main({ client: client });
    switch (this.mv_popup_name) {
      case `POPUP_BAL`:
        this.view_popup_bal({ client: client });
        break;
    }
    client.view_display(this.mv_main_xml);
    client.popup_display(this.mv_popup_xml);
    this.mv_main_xml = {};
    this.mv_popup_xml = {};
  }
}

module.exports = z2ui5_cl_demo_app_034;
