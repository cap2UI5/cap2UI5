
class z2ui5_cl_ui5f_preload {
  static get({ styles_css, custom_js } = {}) {
    let result = ``;
    result = `      "z2ui5/Component.js": function(){${z2ui5_cl_ui5f_comp_js.get()}${custom_js}},` + `
` + `      "z2ui5/Util.js": function(){${z2ui5_cl_ui5f_util_js.get()}},` + `
` + `      "z2ui5/cc/CameraPicture.js": function(){${z2ui5_cl_ui5f_campic_js.get()}},` + `
` + `      "z2ui5/cc/CameraSelector.js": function(){${z2ui5_cl_ui5f_camsel_js.get()}},` + `
` + `      "z2ui5/cc/Dirty.js": function(){${z2ui5_cl_ui5f_dirty_js.get()}},` + `
` + `      "z2ui5/cc/Favicon.js": function(){${z2ui5_cl_ui5f_favicon_js.get()}},` + `
` + `      "z2ui5/cc/FileUploader.js": function(){${z2ui5_cl_ui5f_uploader_js.get()}},` + `
` + `      "z2ui5/cc/Focus.js": function(){${z2ui5_cl_ui5f_focus_js.get()}},` + `
` + `      "z2ui5/cc/Geolocation.js": function(){${z2ui5_cl_ui5f_geoloc_js.get()}},` + `
` + `      "z2ui5/cc/History.js": function(){${z2ui5_cl_ui5f_history_js.get()}},` + `
` + `      "z2ui5/cc/Info.js": function(){${z2ui5_cl_ui5f_info_js.get()}},` + `
` + `      "z2ui5/cc/LPTitle.js": function(){${z2ui5_cl_ui5f_lptitle_js.get()}},` + `
` + `      "z2ui5/cc/MessageManager.js": function(){${z2ui5_cl_ui5f_msgmgr_js.get()}},` + `
` + `      "z2ui5/cc/MultiInputExt.js": function(){${z2ui5_cl_ui5f_multiinp_js.get()}},` + `
` + `      "z2ui5/cc/Scrolling.js": function(){${z2ui5_cl_ui5f_scroll_js.get()}},` + `
` + `      "z2ui5/cc/SmartMultiInputExt.js": function(){${z2ui5_cl_ui5f_smartinp_js.get()}},` + `
` + `      "z2ui5/cc/Storage.js": function(){${z2ui5_cl_ui5f_storage_js.get()}},` + `
` + `      "z2ui5/cc/Timer.js": function(){${z2ui5_cl_ui5f_timer_js.get()}},` + `
` + `      "z2ui5/cc/Title.js": function(){${z2ui5_cl_ui5f_title_js.get()}},` + `
` + `      "z2ui5/cc/Tree.js": function(){${z2ui5_cl_ui5f_tree_js.get()}},` + `
` + `      "z2ui5/cc/UITableExt.js": function(){${z2ui5_cl_ui5f_uitable_js.get()}},` + `
` + `      "z2ui5/cc/UploadSetExt.js": function(){${z2ui5_cl_ui5f_upldset_js.get()}},` + `
` + `      "z2ui5/cc/Websocket.js": function(){${z2ui5_cl_ui5f_websock_js.get()}},` + `
` + `      "z2ui5/controller/App.controller.js": function(){${z2ui5_cl_ui5f_app_js.get()}},` + `
` + `      "z2ui5/controller/View1.controller.js": function(){${z2ui5_cl_ui5f_view1_js.get()}},` + `
` + `      "z2ui5/core/AppState.js": function(){${z2ui5_cl_ui5f_appstate_js.get()}},` + `
` + `      "z2ui5/core/ErrorView.js": function(){${z2ui5_cl_ui5f_errview_js.get()}},` + `
` + `      "z2ui5/core/FrontendAction.js": function(){${z2ui5_cl_ui5f_frontact_js.get()}},` + `
` + `      "z2ui5/core/Lib.js": function(){${z2ui5_cl_ui5f_lib_js.get()}},` + `
` + `      "z2ui5/core/Router.js": function(){${z2ui5_cl_ui5f_router_js.get()}},` + `
` + `      "z2ui5/core/ScrollFocus.js": function(){${z2ui5_cl_ui5f_scrfocus_js.get()}},` + `
` + `      "z2ui5/core/Server.js": function(){${z2ui5_cl_ui5f_server_js.get()}},` + `
` + `      "z2ui5/core/Session.js": function(){${z2ui5_cl_ui5f_session_js.get()}},` + `
` + `      "z2ui5/core/ViewSlots.js": function(){${z2ui5_cl_ui5f_viewslot_js.get()}},` + `
` + `      "z2ui5/core/actions/Browser.js": function(){${z2ui5_cl_ui5f_browser_js.get()}},` + `
` + `      "z2ui5/core/actions/ControlCall.js": function(){${z2ui5_cl_ui5f_ctrlcall_js.get()}},` + `
` + `      "z2ui5/core/actions/Launchpad.js": function(){${z2ui5_cl_ui5f_launchpd_js.get()}},` + `
` + `      "z2ui5/core/actions/LegacyCustomJs.js": function(){${z2ui5_cl_ui5f_legacy_js.get()}},` + `
` + `      "z2ui5/core/actions/Shortcuts.js": function(){${z2ui5_cl_ui5f_shortcut_js.get()}},` + `
` + `      "z2ui5/core/actions/Slots.js": function(){${z2ui5_cl_ui5f_slots_js.get()}},` + `
` + `      "z2ui5/core/actions/Variants.js": function(){${z2ui5_cl_ui5f_variants_js.get()}},` + `
` + `      "z2ui5/core/actions/ViewOps.js": function(){${z2ui5_cl_ui5f_viewops_js.get()}},` + `
` + `      "z2ui5/css/style.css": '${z2ui5_cl_ui5f_preload.escape_js_literal({ val: styles_css })}',` + `
` + `      "z2ui5/devtools/AbapSource.js": function(){${z2ui5_cl_ui5f_abapsrc_js.get()}},` + `
` + `      "z2ui5/devtools/Console.js": function(){${z2ui5_cl_ui5f_console_js.get()}},` + `
` + `      "z2ui5/devtools/DevTools.js": function(){${z2ui5_cl_ui5f_devtools_js.get()}},` + `
` + `      "z2ui5/devtools/DeveloperTools.fragment.xml": '${z2ui5_cl_ui5f_preload.escape_js_literal({ val: z2ui5_cl_ui5f_dtools_xml.get() })}',` + `
` + `      "z2ui5/devtools/DeveloperTools.js": function(){${z2ui5_cl_ui5f_dtools_js.get()}},` + `
` + `      "z2ui5/devtools/Format.js": function(){${z2ui5_cl_ui5f_dtformat_js.get()}},` + `
` + `      "z2ui5/devtools/Inspect.js": function(){${z2ui5_cl_ui5f_inspect_js.get()}},` + `
` + `      "z2ui5/devtools/LiveEdit.js": function(){${z2ui5_cl_ui5f_liveedit_js.get()}},` + `
` + `      "z2ui5/devtools/Picker.js": function(){${z2ui5_cl_ui5f_picker_js.get()}},` + `
` + `      "z2ui5/devtools/Recorder.js": function(){${z2ui5_cl_ui5f_recorder_js.get()}},` + `
` + `      "z2ui5/devtools/Report.js": function(){${z2ui5_cl_ui5f_report_js.get()}},` + `
` + `      "z2ui5/devtools/Tabs.js": function(){${z2ui5_cl_ui5f_tabs_js.get()}},` + `
` + `      "z2ui5/manifest.json": '${z2ui5_cl_ui5f_preload.escape_js_literal({ val: z2ui5_cl_ui5f_manifest.get() })}',` + `
` + `      "z2ui5/model/formatter.js": function(){${z2ui5_cl_ui5f_format_js.get()}},` + `
` + `      "z2ui5/model/models.js": function(){${z2ui5_cl_ui5f_models_js.get()}},` + `
` + `      "z2ui5/view/App.view.xml": '${z2ui5_cl_ui5f_preload.escape_js_literal({ val: z2ui5_cl_ui5f_app_xml.get() })}',` + `
`;
    return result;
  }

  static escape_js_literal({ val } = {}) {
    let result = ``;
    result = val.replaceAll(`\\`, `\\\\`);
    result = result.replaceAll(`'`, `\\'`);
    result = result.replaceAll(String(z2ui5_cl_ui5_util_context.cv_char_util_cr_lf).substr(0, 1), `\\r`);
    result = result.replaceAll(z2ui5_cl_ui5_util_context.cv_char_util_newline, `\\n`);
    return result;
  }
}

module.exports = z2ui5_cl_ui5f_preload;

const z2ui5_cl_ui5_util_context = require("abap2UI5/z2ui5_cl_ui5_util_context");
const z2ui5_cl_ui5f_abapsrc_js = require("abap2UI5/z2ui5_cl_ui5f_abapsrc_js");
const z2ui5_cl_ui5f_app_js = require("abap2UI5/z2ui5_cl_ui5f_app_js");
const z2ui5_cl_ui5f_app_xml = require("abap2UI5/z2ui5_cl_ui5f_app_xml");
const z2ui5_cl_ui5f_appstate_js = require("abap2UI5/z2ui5_cl_ui5f_appstate_js");
const z2ui5_cl_ui5f_browser_js = require("abap2UI5/z2ui5_cl_ui5f_browser_js");
const z2ui5_cl_ui5f_campic_js = require("abap2UI5/z2ui5_cl_ui5f_campic_js");
const z2ui5_cl_ui5f_camsel_js = require("abap2UI5/z2ui5_cl_ui5f_camsel_js");
const z2ui5_cl_ui5f_comp_js = require("abap2UI5/z2ui5_cl_ui5f_comp_js");
const z2ui5_cl_ui5f_console_js = require("abap2UI5/z2ui5_cl_ui5f_console_js");
const z2ui5_cl_ui5f_ctrlcall_js = require("abap2UI5/z2ui5_cl_ui5f_ctrlcall_js");
const z2ui5_cl_ui5f_devtools_js = require("abap2UI5/z2ui5_cl_ui5f_devtools_js");
const z2ui5_cl_ui5f_dirty_js = require("abap2UI5/z2ui5_cl_ui5f_dirty_js");
const z2ui5_cl_ui5f_dtformat_js = require("abap2UI5/z2ui5_cl_ui5f_dtformat_js");
const z2ui5_cl_ui5f_dtools_js = require("abap2UI5/z2ui5_cl_ui5f_dtools_js");
const z2ui5_cl_ui5f_dtools_xml = require("abap2UI5/z2ui5_cl_ui5f_dtools_xml");
const z2ui5_cl_ui5f_errview_js = require("abap2UI5/z2ui5_cl_ui5f_errview_js");
const z2ui5_cl_ui5f_favicon_js = require("abap2UI5/z2ui5_cl_ui5f_favicon_js");
const z2ui5_cl_ui5f_focus_js = require("abap2UI5/z2ui5_cl_ui5f_focus_js");
const z2ui5_cl_ui5f_format_js = require("abap2UI5/z2ui5_cl_ui5f_format_js");
const z2ui5_cl_ui5f_frontact_js = require("abap2UI5/z2ui5_cl_ui5f_frontact_js");
const z2ui5_cl_ui5f_geoloc_js = require("abap2UI5/z2ui5_cl_ui5f_geoloc_js");
const z2ui5_cl_ui5f_history_js = require("abap2UI5/z2ui5_cl_ui5f_history_js");
const z2ui5_cl_ui5f_info_js = require("abap2UI5/z2ui5_cl_ui5f_info_js");
const z2ui5_cl_ui5f_inspect_js = require("abap2UI5/z2ui5_cl_ui5f_inspect_js");
const z2ui5_cl_ui5f_launchpd_js = require("abap2UI5/z2ui5_cl_ui5f_launchpd_js");
const z2ui5_cl_ui5f_legacy_js = require("abap2UI5/z2ui5_cl_ui5f_legacy_js");
const z2ui5_cl_ui5f_lib_js = require("abap2UI5/z2ui5_cl_ui5f_lib_js");
const z2ui5_cl_ui5f_liveedit_js = require("abap2UI5/z2ui5_cl_ui5f_liveedit_js");
const z2ui5_cl_ui5f_lptitle_js = require("abap2UI5/z2ui5_cl_ui5f_lptitle_js");
const z2ui5_cl_ui5f_manifest = require("abap2UI5/z2ui5_cl_ui5f_manifest");
const z2ui5_cl_ui5f_models_js = require("abap2UI5/z2ui5_cl_ui5f_models_js");
const z2ui5_cl_ui5f_msgmgr_js = require("abap2UI5/z2ui5_cl_ui5f_msgmgr_js");
const z2ui5_cl_ui5f_multiinp_js = require("abap2UI5/z2ui5_cl_ui5f_multiinp_js");
const z2ui5_cl_ui5f_picker_js = require("abap2UI5/z2ui5_cl_ui5f_picker_js");
const z2ui5_cl_ui5f_recorder_js = require("abap2UI5/z2ui5_cl_ui5f_recorder_js");
const z2ui5_cl_ui5f_report_js = require("abap2UI5/z2ui5_cl_ui5f_report_js");
const z2ui5_cl_ui5f_router_js = require("abap2UI5/z2ui5_cl_ui5f_router_js");
const z2ui5_cl_ui5f_scrfocus_js = require("abap2UI5/z2ui5_cl_ui5f_scrfocus_js");
const z2ui5_cl_ui5f_scroll_js = require("abap2UI5/z2ui5_cl_ui5f_scroll_js");
const z2ui5_cl_ui5f_server_js = require("abap2UI5/z2ui5_cl_ui5f_server_js");
const z2ui5_cl_ui5f_session_js = require("abap2UI5/z2ui5_cl_ui5f_session_js");
const z2ui5_cl_ui5f_shortcut_js = require("abap2UI5/z2ui5_cl_ui5f_shortcut_js");
const z2ui5_cl_ui5f_slots_js = require("abap2UI5/z2ui5_cl_ui5f_slots_js");
const z2ui5_cl_ui5f_smartinp_js = require("abap2UI5/z2ui5_cl_ui5f_smartinp_js");
const z2ui5_cl_ui5f_storage_js = require("abap2UI5/z2ui5_cl_ui5f_storage_js");
const z2ui5_cl_ui5f_tabs_js = require("abap2UI5/z2ui5_cl_ui5f_tabs_js");
const z2ui5_cl_ui5f_timer_js = require("abap2UI5/z2ui5_cl_ui5f_timer_js");
const z2ui5_cl_ui5f_title_js = require("abap2UI5/z2ui5_cl_ui5f_title_js");
const z2ui5_cl_ui5f_tree_js = require("abap2UI5/z2ui5_cl_ui5f_tree_js");
const z2ui5_cl_ui5f_uitable_js = require("abap2UI5/z2ui5_cl_ui5f_uitable_js");
const z2ui5_cl_ui5f_upldset_js = require("abap2UI5/z2ui5_cl_ui5f_upldset_js");
const z2ui5_cl_ui5f_uploader_js = require("abap2UI5/z2ui5_cl_ui5f_uploader_js");
const z2ui5_cl_ui5f_util_js = require("abap2UI5/z2ui5_cl_ui5f_util_js");
const z2ui5_cl_ui5f_variants_js = require("abap2UI5/z2ui5_cl_ui5f_variants_js");
const z2ui5_cl_ui5f_view1_js = require("abap2UI5/z2ui5_cl_ui5f_view1_js");
const z2ui5_cl_ui5f_viewops_js = require("abap2UI5/z2ui5_cl_ui5f_viewops_js");
const z2ui5_cl_ui5f_viewslot_js = require("abap2UI5/z2ui5_cl_ui5f_viewslot_js");
const z2ui5_cl_ui5f_websock_js = require("abap2UI5/z2ui5_cl_ui5f_websock_js");

