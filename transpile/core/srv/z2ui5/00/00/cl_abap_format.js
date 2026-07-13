/** cl_abap_format — native shim (escape-format constants). */
"use strict";

class cl_abap_format {
  static e_xml_attr = 1;
  static e_xml_text = 2;
  static e_html_attr = 3;
  static e_html_text = 4;
  static e_url = 5;
  static e_uri = 6;
  static e_uri_full = 7;
  static e_json_string = 8;
  static e_string_tpl = 9;
}

module.exports = cl_abap_format;
