const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_143 extends z2ui5_if_app {
  gt_data = [];
  client = null;

  on_event() {
    let x;
    try {
      if (this.client.check_on_event(`ROW_ACTION_ITEM_ADD`)) {
        this.client.message_toast_display(`Something`);
        this.client.view_model_update();
      }
    } catch (_caught1) {
      x = _caught1;
      this.client.message_box_display(x.get_text(), `error`);
    }
  }

  on_init() {
    this.gt_data = z2ui5_cl_util.abap_tab_assign(this.gt_data, [{ field1: `21`, field2: `T1`, field3: `TEXT1` }, { field1: `22`, field2: `T1`, field3: `TEXT1` }, { field1: `23`, field2: `T2`, field3: `TEXT1` }, { field1: `24`, field2: `T2`, field3: `TEXT2` }, { field1: `25`, field2: `T3`, field3: `TEXT2` }]);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page1 = view.page({ id: `page_main`, title: `Table Filters Reset after view Update`, class: `sapUiContentPadding`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    const page = page1.dynamic_page({ headerexpanded: true, headerpinned: true });
    page1._z2ui5().uitableext(`Table1`);
    const header_title = page.title({ ns: `f` }).get().dynamic_page_title();
    header_title.heading(`f`).hbox().title(`Table`);
    header_title.expanded_content(`f`);
    header_title.snapped_content(`f`);
    const cont = page.content(`f`);
    const table = cont.vbox()
      .ui_table({ rows: this.client._bind(this.gt_data), id: `Table1`, editable: false, alternaterowcolors: true, enablecellfilter: true, rowactioncount: `1`, fixedcolumncount: `1`, visiblerowcount: `7`, selectionmode: `None` });
    table.ui_columns()
      .ui_column({ sortproperty: `FIELD1`, filterproperty: `FIELD1`, autoresizable: `true` })
      .text(`Field1`)
      .ui_template()
      .text(`{FIELD1}`)
      .get_parent()
      .get_parent()
      .ui_column({ sortproperty: `FIELD2`, filterproperty: `FIELD2`, autoresizable: `true` })
      .text(`Field2`)
      .ui_template()
      .text(`{FIELD2}`)
      .get_parent()
      .get_parent()
      .ui_column({ sortproperty: `FIELD3`, filterproperty: `FIELD3`, autoresizable: `true` })
      .text(`Field3`)
      .ui_template()
      .text(`{FIELD3}`)
      .get_parent()
      .get_parent()
      .get_parent()
      .ui_row_action_template()
      .ui_row_action()
      .ui_row_action_item({ icon: `sap-icon://add`, text: `Add`, press: this.client._event(`ROW_ACTION_ITEM_ADD`, [`\${MATNR}`]) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    }
    this.view_display();
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_143;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

