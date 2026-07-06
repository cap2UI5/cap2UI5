// TODO(abap2js): unresolved reference cl_abap_structdescr — add require manually
// TODO(abap2js): unresolved reference cl_abap_tabledescr — add require manually
const z2ui5_cl_demo_app_193 = require("./z2ui5_cl_demo_app_193");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_192 extends z2ui5_if_app {
  mt_new_data2 = null;
  mt_out = [];
  client = null;

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `xxx`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .header_content();
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.xml_parse();
    this.client = client;
    this.get_data();
    this.view_display();
    this.xml_stringify();
  }

  get_data() {
    let sy_tabix = 0;
    let lr_structdescr = null;
    let lr_tabdescr = null;
    // TODO(abap2js): FIELD-SYMBOLS <fs_s_head> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <fs_t_head_new> TYPE STANDARD TABLE.
    // TODO(abap2js): FIELD-SYMBOLS <fs_s_head_new> TYPE any.
    this.mt_out = [{ aa: `aa`, bb: `bb`, cc: `cc` }, { aa: `a1`, bb: `b1`, cc: `c1` }];
    const kopf = (this.mt_out);
    sy_tabix = 0;
    for (const fs_s_head of kopf) {
      sy_tabix++;
      const lo_new_data = new z2ui5_cl_demo_app_193();
      this.mt_new_data2.push(lo_new_data);
      lr_structdescr = cl_abap_structdescr.describe_by_data(fs_s_head);
      lr_tabdescr = cl_abap_tabledescr.create(lr_structdescr);
      // TODO(abap2js): CREATE DATA lo_new_data->mt_kopf TYPE HANDLE lr_tabdescr.
      // TODO(abap2js): ASSIGN lo_new_data->mt_kopf->* TO <fs_t_head_new>.
      fs_t_head_new.push({});
      fs_s_head_new = fs_s_head;
    }
  }

  xml_parse() {
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const lo_data of this.mt_new_data2) {
      sy_tabix++;
      lo_data.xml_parse();
    }
  }

  xml_stringify() {
    let sy_tabix = 0;
    sy_tabix = 0;
    for (const lo_data of this.mt_new_data2) {
      sy_tabix++;
      lo_data.xml_stringify();
    }
  }
}

module.exports = z2ui5_cl_demo_app_192;
