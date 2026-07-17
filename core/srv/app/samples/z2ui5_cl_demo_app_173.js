const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_173 extends z2ui5_if_app {
  mv_flag = false;
  mt_layout = [];
  mt_data = [];
  client = null;

  view_display() {
    let view = z2ui5_cl_xml_view.factory();
    view = view.shell()
      .page({ id: `page_main`, class: `sapUiContentPadding`, title: `abap2UI5 - Sample Templating I`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    view.table(this.client._bind_edit(this.mt_data))
      .columns()
      .template_repeat({ list: `{template>/XX/MT_LAYOUT}`, var: `L0` })
      .column({ mergeduplicates: `{L0>MERGE}`, visible: `{L0>VISIBLE}` })
      .text(`{L0>FNAME}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .items()
      .column_list_item()
      .cells()
      .template_repeat({ list: `{template>/XX/MT_LAYOUT}`, var: `L1` })
      .object_identifier({ text: `{= '{' + \${L1>FNAME} + '}' }` });
    view.label(`IF Template (with re-rendering)`);
    view.switch({ state: this.client._bind_edit(this.mv_flag), change: this.client._event(`CHANGE_FLAG`) });
    view = view.vbox();
    view.template_if(`{template>/XX/MV_FLAG}`)
      .template_then()
      .icon({ src: `sap-icon://accept`, color: `green` })
      .get_parent()
      .template_else()
      .icon({ src: `sap-icon://decline`, color: `red` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      client._bind(this.mt_layout);
      this.mt_data = [{ name: `Theo`, date: `01.01.2000`, age: `5` }, { name: `Lore`, date: `01.01.2000`, age: `1` }];
      this.mt_layout = [{ fname: `NAME`, merge: `false`, visible: `true` }, { fname: `DATE`, merge: `false`, visible: `true` }, { fname: `AGE`, merge: `false`, visible: `false` }];
      this.view_display();
    }
    switch (client.get().EVENT) {
      case `CHANGE_FLAG`:
        this.view_display();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_173;
