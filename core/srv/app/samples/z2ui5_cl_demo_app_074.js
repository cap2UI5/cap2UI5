const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_074 extends z2ui5_if_app {
  filepath = ``;
  file = ``;
  table = null;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init() || client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    let raw;
    let content;
    let error;
    try {
      switch (this.client.get().EVENT) {
        case `START`:
        case `CHANGE`:
          this.view_display();
          break;
        case `UPLOAD`:
          let [header, base64] = this.file.split(`;`);
          [header, base64] = base64.split(`,`);
          raw = z2ui5_cl_sample_context.conv_decode_x_base64(base64);
          content = z2ui5_cl_sample_context.conv_get_string_by_xstring(raw);
          this.client.message_box_display(content);
          this.file = {};
          this.filepath = {};
          this.view_display();
          break;
      }
    } catch (_caught1) {
      error = _caught1;
      this.client.message_box_display(error.get_text(), `error`);
    }
  }

  view_display() {
    let sy_tabix = 0;
    let sy_subrc = 0;
    let fs_table = null;
    let _fs$fs_table = null;
    let tab;
    let fields;
    let columns;
    let cells;
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Upload a File`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    if (this.table) {
      fs_table = this.table;
      _fs$fs_table = { o: this, k: `table` };
      sy_subrc = 0;
      tab = page.table(this.client._bind_edit(fs_table))
        .header_toolbar()
        .overflow_toolbar()
        .title(`CSV Content`)
        .toolbar_spacer()
        .get_parent()
        .get_parent();
      fields = z2ui5_cl_sample_context.rtti_get_t_attri_by_any(fs_table);
      columns = tab.columns();
      cells = tab.items().column_list_item().cells();
      sy_tabix = 0;
      for (const field of fields) {
        sy_tabix++;
        columns.column().text(field.name);
        cells.text(`{${field.name}}`);
      }
    }
    page.footer()
      .overflow_toolbar()
      ._z2ui5()
      .file_uploader({ value: this.client._bind_edit(this.file), path: this.client._bind_edit(this.filepath), placeholder: `filepath here...`, upload: this.client._event(`UPLOAD`) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_074;

const z2ui5_cl_sample_context = require("./z2ui5_cl_sample_context");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

