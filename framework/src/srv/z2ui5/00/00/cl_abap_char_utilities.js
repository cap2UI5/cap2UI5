/** cl_abap_char_utilities — native shim (character constants). */
"use strict";

class cl_abap_char_utilities {
  static newline = "\n";
  static cr_lf = "\r\n";
  static horizontal_tab = "\t";
  static vertical_tab = "\v";
  static form_feed = "\f";
  static backspace = "\b";
  static charsize = 1;
  static minchar = "\u0000";
  static maxchar = "\uffff";
  static byte_order_mark_utf8 = "\ufeff";
}

module.exports = cl_abap_char_utilities;
