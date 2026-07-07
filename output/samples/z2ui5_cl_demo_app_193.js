const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

class z2ui5_cl_demo_app_193 {
  mt_kopf = null;
  mt_pos = null;
  mt_keyva = [];
  mt_kopf_xml = ``;
  mt_pos_xml = ``;

  xml_parse() {
    if (this.mt_pos_xml) {
      this.mt_kopf = z2ui5_cl_util.xml_srtti_parse(this.mt_kopf_xml);
      this.mt_kopf_xml = {};
    }
    if (this.mt_pos_xml) {
      this.mt_pos = z2ui5_cl_util.xml_srtti_parse(this.mt_pos_xml);
      this.mt_pos_xml = {};
    }
  }

  xml_stringify() {
    let sy_subrc = 0;
    let fs_head = null;
    let _fs$fs_head = null;
    let fs_pos = null;
    let _fs$fs_pos = null;
    // TODO(abap2js): ASSIGN mt_kopf->* TO FIELD-SYMBOL(<head>).
    if (sy_subrc === 0) {
      this.mt_kopf_xml = z2ui5_cl_util.xml_srtti_stringify(fs_head);
      this.mt_kopf = {};
    }
    // TODO(abap2js): ASSIGN mt_pos->* TO FIELD-SYMBOL(<pos>).
    if (sy_subrc === 0) {
      this.mt_pos_xml = z2ui5_cl_util.xml_srtti_stringify(fs_pos);
      this.mt_pos = {};
    }
  }
}

module.exports = z2ui5_cl_demo_app_193;
