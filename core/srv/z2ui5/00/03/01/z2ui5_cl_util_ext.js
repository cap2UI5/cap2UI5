/**
 * z2ui5_cl_util_ext — the ABAP-platform extras, and why they are stubs here.
 *
 * The upstream class is the one part of abap2UI5 that is genuinely, and
 * permanently, ABAP-only. Every method reaches for something the SAP kernel
 * provides and Node has no analogue of:
 *
 *   - DDIC metadata (DFIES, search helps, fixed values, conversion exits)
 *   - RTTI describe-by-name over dictionary types (cl_abap_structdescr and
 *     friends), plus XCO on cloud
 *   - the transport system (E070/E071/E071K)
 *   - client handling (MANDT)
 *
 * None of that has a JavaScript port waiting to be written. It is not a gap
 * in this port; it is the boundary of the platform.
 *
 * WHAT THIS FILE USED TO BE
 * -------------------------
 * A 713-line raw transpile: mostly commented-out ABAP statements
 * (CALL METHOD (dynamic), ASSIGN COMPONENT, FIELD-SYMBOLS) interleaved with
 * dead JS, calling six kernel classes that do not exist here. 150 of the
 * repository's 185 TODO markers lived in it, and — because those references
 * are undefined — it is why `no-undef` had to run as a warning across the
 * whole codebase. One file that could never work was disarming the lint gate
 * for the other 109 that must.
 *
 * The ABAP source is not lost: it sits in run/input/abap2UI5, versioned, and
 * is the thing to read when porting any of this becomes worthwhile.
 *
 * WHAT IT IS NOW
 * --------------
 * The same public surface, where each method says plainly that it is not
 * available. Throwing rather than returning an empty value is deliberate: an
 * empty DFIES table or a blank conversion result looks like a legitimate
 * answer and produces a wrong screen somewhere far from here, while a thrown
 * error names the method and the reason at the call site. Nothing in the
 * framework or the samples calls any of it today.
 */
"use strict";

const z2ui5_cx_util_error = require("abap2UI5/z2ui5_cx_util_error");

/** The one reason all of these fail, phrased per method. */
function unavailable(method, needs) {
  const text =
    `z2ui5_cl_util_ext.${method}() is not available on this platform — ` +
    `it needs ${needs}, which exists only in an ABAP system. ` +
    `See the ABAP original in run/input/abap2UI5 if you intend to port it.`;
  throw new z2ui5_cx_util_error(text);
}

class z2ui5_cl_util_ext {

  // ---- RTTI / DDIC metadata ------------------------------------------------

  /** abap rtti_get_class_descr_on_cloud — class short text via XCO. */
  static rtti_get_class_descr_on_cloud() {
    unavailable(`rtti_get_class_descr_on_cloud`, `the XCO class-repository API`);
  }

  /** abap rtti_get_t_attri_on_prem — DDIC field list of a table (DFIES). */
  static rtti_get_t_attri_on_prem() {
    unavailable(`rtti_get_t_attri_on_prem`, `DDIC metadata (DFIES) and RTTI describe-by-name`);
  }

  /** abap rtti_get_t_attri_on_cloud — the same, through XCO. */
  static rtti_get_t_attri_on_cloud() {
    unavailable(`rtti_get_t_attri_on_cloud`, `the XCO data-definition API`);
  }

  /** abap rtti_get_t_dfies_by_table_name. */
  static rtti_get_t_dfies_by_table_name() {
    unavailable(`rtti_get_t_dfies_by_table_name`, `DDIC metadata (DFIES)`);
  }

  /** abap rtti_get_table_desrc — the translated description of a table. */
  static rtti_get_table_desrc() {
    unavailable(`rtti_get_table_desrc`, `DDIC texts (DD02T)`);
  }

  // ---- search helps --------------------------------------------------------

  /** abap bus_search_help_read — run a DDIC search help. */
  static bus_search_help_read() {
    unavailable(`bus_search_help_read`, `DDIC search helps (F4 IF)`);
  }

  /** abap tab_get_where_by_dfies — build a WHERE from DDIC field metadata. */
  static tab_get_where_by_dfies() {
    unavailable(`tab_get_where_by_dfies`, `DDIC metadata (DFIES)`);
  }

  // ---- transport system ----------------------------------------------------

  /** abap bus_tr_add — add an object key to a transport request. */
  static bus_tr_add() {
    unavailable(`bus_tr_add`, `the ABAP transport system (E071/E071K)`);
  }

  /** abap bus_tr_read — read the caller's open transport requests. */
  static bus_tr_read() {
    unavailable(`bus_tr_read`, `the ABAP transport system (E070)`);
  }

  // ---- client / conversion -------------------------------------------------

  /** abap set_mandt — stamp the current client onto a structure. */
  static set_mandt() {
    unavailable(`set_mandt`, `an ABAP client (MANDT) column`);
  }

  /** abap conv_exit — run a DDIC conversion exit (CONVERSION_EXIT_*_OUTPUT). */
  static conv_exit() {
    unavailable(`conv_exit`, `DDIC conversion exits`);
  }
}

module.exports = z2ui5_cl_util_ext;
