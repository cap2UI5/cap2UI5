const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_081 extends z2ui5_if_app {
  product = ``;
  quantity = ``;
  mv_placement = ``;
  mt_tab = [];
  client = null;

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.popover({ title: `Popover Title`, placement: this.mv_placement })
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Cancel`, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: `Confirm`, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` })
      .get_parent()
      .get_parent()
      .text(`make an input here:`)
      .input(`abcd`);
    this.client.popover_display(view.stringify(), id);
  }

  popover_list_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.popover({ title: `Popover Title`, placement: this.mv_placement })
      .list({ items: this.client._bind_edit(this.mt_tab), selectionchange: this.client._event(`SEL_CHANGE`), mode: `SingleSelectMaster` })
      .standard_list_item({ title: `{ID}`, description: `{NAME}`, selected: `{SELECTED}` });
    this.client.popover_display(view.stringify(), id);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popover with List`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form(`Popover`)
      .content(`form`)
      .title(`Input`)
      .label(`Link`)
      .link({ text: `Documentation UI5 Popover Control`, href: `https://openui5.hana.ondemand.com/entity/sap.m.Popover` })
      .label(`placement`)
      .segmented_button(this.client._bind_edit(this.mv_placement))
      .items()
      .segmented_button_item({ key: `Left`, icon: `sap-icon://add-favorite`, text: `Left` })
      .segmented_button_item({ key: `Top`, icon: `sap-icon://accept`, text: `Top` })
      .segmented_button_item({ key: `Bottom`, icon: `sap-icon://accept`, text: `Bottom` })
      .segmented_button_item({ key: `Right`, icon: `sap-icon://attachment`, text: `Right` })
      .get_parent()
      .get_parent()
      .label(`popover`)
      .button({ text: `show popover with list`, press: this.client._event(`POPOVER_LIST`), id: `TEST` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let lt_sel;
    switch (this.client.get().EVENT) {
      case `SEL_CHANGE`:
        lt_sel = z2ui5_cl_util.abap_copy(this.mt_tab);
        for (let _i = lt_sel.length - 1; _i >= 0; _i--) { const row = lt_sel[_i]; if (!row.selected) lt_sel.splice(_i, 1); }
        break;
      case `POPOVER_LIST`:
        this.popover_list_display({ id: `TEST` });
        break;
      case `POPOVER`:
        this.popover_display({ id: `TEST` });
        break;
      case `BUTTON_CONFIRM`:
        this.client.message_toast_display(`confirm`);
        this.client.popover_destroy();
        break;
      case `BUTTON_CANCEL`:
        this.client.message_toast_display(`cancel`);
        this.client.popover_destroy();
        break;
    }
  }

  on_init() {
    this.mv_placement = `Left`;
    this.product = `tomato`;
    this.quantity = `500`;
    this.mt_tab = z2ui5_cl_util.abap_tab_assign(this.mt_tab, [{ id: `1`, name: `name1` }, { id: `2`, name: `name2` }, { id: `3`, name: `name3` }, { id: `4`, name: `name4` }]);
  }
}

module.exports = z2ui5_cl_demo_app_081;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

