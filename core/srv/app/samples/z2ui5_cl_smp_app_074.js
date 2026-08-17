const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_074 extends z2ui5_if_app {
  filepath = ``;
  file = ``;
  table = null;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_navigated()) {
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
      switch (this.client.get_event()) {
        case `START`:
        case `CHANGE`:
          this.view_display();
          break;
        case `UPLOAD`:
          let [header, base64] = this.file.split(`;`);
          [header, base64] = base64.split(`,`);
          raw = z2ui5_cl_smp_context.conv_decode_x_base64(base64);
          content = z2ui5_cl_smp_context.conv_get_string_by_xstring(raw);
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
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - File - Upload to the Backend` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The file_uploader custom control returns the picked file as a base64 data URL; the backend ` + `strips the prefix, decodes the payload and shows the file content in a message box.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    if (!z2ui5_cl_util.abap_is_initial(this.table)) {
      fs_table = this.table;
      _fs$fs_table = { o: this, k: `table` };
      sy_subrc = 0;
      tab = page.ele(`Table`)
        .a({ n: `items`, v: this.client._bind(fs_table) })
        .ele(`headerToolbar`)
        .ele(`OverflowToolbar`)
        .tag(`Title`)
        .a({ n: `text`, v: `CSV Content` })
        .tag(`ToolbarSpacer`)
        .end()
        .end();
      fields = z2ui5_cl_smp_context.rtti_get_t_attri_by_any(fs_table);
      columns = tab.ele(`columns`);
      cells = tab.ele(`items`).ele(`ColumnListItem`).ele(`cells`);
      sy_tabix = 0;
      for (const field of fields) {
        sy_tabix++;
        columns.ele(`Column`).tag(`Text`).a({ n: `text`, v: field.name });
        cells.tag(`Text`).a({ n: `text`, v: `{${field.name}}` });
      }
    }
    page.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag({ n: `FileUploader`, ns: `z2ui5` })
      .a({ n: `placeholder`, v: `filepath here...` })
      .a({ n: `upload`, v: this.client._event(`UPLOAD`) })
      .a({ n: `path`, v: this.client._bind(this.filepath) })
      .a({ n: `value`, v: this.client._bind(this.file) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_074;

const z2ui5_cl_smp_context = require("./z2ui5_cl_smp_context");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

