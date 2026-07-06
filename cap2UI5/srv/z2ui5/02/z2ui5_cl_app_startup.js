const z2ui5_if_app = require("./z2ui5_if_app");
const z2ui5_cl_util = require("../00/03/z2ui5_cl_util");

/**
 * 1:1 port of abap2UI5 z2ui5_cl_app_startup.
 *
 * Launchpad / startup screen: lets the user enter an app class name, validates it
 * via dynamic instantiation, and shows a "Link to the Application" once the class
 * is confirmed loadable. Plus a System-Info popup, a Debugging hint, and links to
 * sample repo / docs / GitHub PRs.
 */
class z2ui5_cl_app_startup extends z2ui5_if_app {

  // --- cs_event constants (mirrors abap CS_EVENT struct) ---
  static CS_EVENT = Object.freeze({
    BUTTON_CHECK:  "BUTTON_CHECK",
    BUTTON_CHANGE: "BUTTON_CHANGE",
    VALUE_HELP:    "VALUE_HELP",
    OPEN_DEBUG:    "OPEN_DEBUG",
    OPEN_INFO:     "OPEN_INFO",
    SET_CONFIG:    "SET_CONFIG",
    CLOSE:         "CLOSE",
  });

  // --- ms_home struct ---
  ms_home = {
    url:                    "",
    btn_text:               "",
    btn_event_id:           "",
    btn_icon:               "",
    classname:              "",
    class_value_state:      "None",  // sap.ui.core.ValueState enum — empty string would throw
    class_value_state_text: "",
    class_editable:         true,
  };

  mv_ui5_version = "";
  client = null;

  // --- Factory (mirrors abap CLASS-METHODS factory) ---
  static factory() {
    return new z2ui5_cl_app_startup();
  }

  reset_button_state() {
    this.ms_home.btn_text     = "Check";
    this.ms_home.btn_event_id = z2ui5_cl_app_startup.CS_EVENT.BUTTON_CHECK;
    this.ms_home.btn_icon     = "sap-icon://validate";
    this.ms_home.class_editable = true;
    this.ms_home.class_value_state      = "None";
    this.ms_home.class_value_state_text = "";
  }

  z2ui5_on_init() {
    this.reset_button_state();
    this.ms_home.classname = "z2ui5_cl_app_hello_world";
  }

  on_event_check() {
    const className = z2ui5_cl_util.c_trim_upper(this.ms_home.classname).toLowerCase();
    try {
      const Cls = z2ui5_cl_util.rtti_get_class(className);
      if (!Cls) throw new Error(`Class '${this.ms_home.classname}' not found`);
      // attempt instantiation — if the class is a valid z2ui5_if_app subclass it succeeds
      // eslint-disable-next-line no-new
      new Cls();

      this.client.message_toast_display("App is ready to start!");
      this.ms_home.btn_text       = "Edit";
      this.ms_home.btn_event_id   = z2ui5_cl_app_startup.CS_EVENT.BUTTON_CHANGE;
      this.ms_home.btn_icon       = "sap-icon://edit";
      this.ms_home.class_value_state = "Success";
      this.ms_home.class_editable = false;

      const cfg = this.client.get().S_CONFIG || {};
      this.ms_home.url = z2ui5_cl_util.app_get_url({
        classname: className,
        origin:    cfg.ORIGIN || "",
        pathname:  cfg.PATHNAME || "",
        search:    cfg.SEARCH || "",
        hash:      cfg.HASH || "",
      });
    } catch (e) {
      this.ms_home.class_value_state_text = e.message;
      this.ms_home.class_value_state      = "Warning";
      this.client.message_box_display(`Class '${this.ms_home.classname}' could not be loaded: ${e.message}`, "error");
    }
  }

  async main(client) {
    this.client = client;

    if (client.check_on_init()) {
      this.z2ui5_on_init();
      this.view_display_start();
      return;
    }

    if (client.get().CHECK_ON_NAVIGATED) {
      try {
        const z2ui5_cl_pop_to_select = require("./01/z2ui5_cl_pop_to_select");
        const prev = client.get_app_prev();
        if (prev instanceof z2ui5_cl_pop_to_select) {
          const r = prev.result();
          if (r.check_confirmed && r.row) {
            this.ms_home.classname = r.row.KEY || r.row.TEXT || "";
            this.view_display_start();
            return;
          }
        }
      } catch {
        // no-op
      }
    }

    this.z2ui5_on_event();
  }

  z2ui5_on_event() {
    const event = this.client.get().EVENT;
    const E = z2ui5_cl_app_startup.CS_EVENT;
    switch (event) {
      case E.SET_CONFIG: {
        const Cls = z2ui5_cl_util.rtti_get_class("z2ui5_cl_app_icf_config");
        if (Cls) this.client.nav_app_call(new Cls());
        break;
      }
      case E.CLOSE:
        this.client.popup_destroy();
        break;
      case E.OPEN_DEBUG:
        this.client.message_box_display("Press CTRL+F12 to open the debugging tools");
        break;
      case E.OPEN_INFO:
        this.view_display_popup();
        return;
      case E.BUTTON_CHECK:
        this.on_event_check();
        this.view_display_start();
        break;
      case E.BUTTON_CHANGE:
        this.reset_button_state();
        this.view_display_start();
        break;
      case E.VALUE_HELP: {
        const z2ui5_cl_pop_to_select = require("./01/z2ui5_cl_pop_to_select");
        const apps = z2ui5_cl_util.rtti_get_classes_impl_intf(z2ui5_if_app);
        if (!apps.length) {
          this.client.message_box_display("No apps found that implement z2ui5_if_app", "error");
          return;
        }
        this.client.nav_app_call(z2ui5_cl_pop_to_select.factory({ i_tab: apps, i_title: "Select an App" }));
        break;
      }
      default:
        this.view_display_start();
        break;
    }
  }

  view_display_start() {
    const Z2UI5_CL_XML_VIEW = require("./z2ui5_cl_xml_view");
    const view = new Z2UI5_CL_XML_VIEW();
    const E = z2ui5_cl_app_startup.CS_EVENT;
    const c = this.client;

    const page = view
      .Shell()
      .Page({
        title: "abap2UI5 - Developing UI5 Apps Purely in ABAP",
        showNavButton: false,
      });

    // --- Header toolbar ---
    const header = page.headerContent();
    header.ToolbarSpacer();
    header.Button({ text: "Debugging Tools", icon: "sap-icon://enablement", press: c._event(E.OPEN_DEBUG) });
    header.Button({ text: "System",          icon: "sap-icon://information", press: c._event(E.OPEN_INFO) });
    if (z2ui5_cl_util.rtti_check_class_exists("z2ui5_cl_app_icf_config")) {
      header.Button({ text: "Config", icon: "sap-icon://settings", press: c._event(E.SET_CONFIG) });
    }

    // --- SimpleForm with all sections ---
    const form = page.SimpleForm({
      editable: true,
      layout: "ResponsiveGridLayout",
      labelSpanXL: "4",
      labelSpanL: "3",
      labelSpanM: "4",
      labelSpanS: "12",
      adjustLabelSpan: false,
      emptySpanXL: "0",
      emptySpanL: "4",
      emptySpanM: "0",
      emptySpanS: "0",
      columnsXL: "1",
      columnsL: "1",
      columnsM: "1",
      singleContainerFullSize: false,
    });
    const content = form.content();

    // ===== Quickstart =====
    content.cc("Toolbar", { ns: "m" }).Title({ text: "Quickstart" }).get_parent();
    content
      .Label({ text: "Step 1" }).Text({ text: "Create a new class in your ABAP system" })
      .Label({ text: "Step 2" }).Text({ text: "Add the interface: Z2UI5_IF_APP" })
      .Label({ text: "Step 3" }).Text({ text: "Define the view, implement behavior" })
      .Label({})
      .Link({
        text: "(Example)",
        target: "_blank",
        href: "https://github.com/abap2UI5/abap2UI5/blob/main/src/02/z2ui5_cl_app_hello_world.clas.abap",
      })
      .Label({ text: "Step 4" });

    if (this.ms_home.class_editable) {
      content.Input({
        placeholder: "fill in the class name and press 'check'",
        enabled: c._bind(this.ms_home.class_editable),
        value: c._bind_edit(this.ms_home.classname),
        valueState: c._bind(this.ms_home.class_value_state),
        valueStateText: c._bind(this.ms_home.class_value_state_text),
        submit: c._event(this.ms_home.btn_event_id),
        valueHelpRequest: c._event(E.VALUE_HELP),
        showValueHelp: true,
        width: "70%",
      });
    } else {
      content.Text({ text: this.ms_home.classname });
    }

    content.Label({});
    content.Button({
      press: c._event(this.ms_home.btn_event_id),
      text: c._bind(this.ms_home.btn_text),
      icon: c._bind(this.ms_home.btn_icon),
      width: "70%",
    });

    content.Label({ text: "Step 5" });
    // UI5 expression binding requires `${...}` (with $-prefix) to dereference a model path.
    // First `$` is a literal in the template literal, second `${...}` is JS interpolation.
    const bindEditable = c._bind(this.ms_home.class_editable);
    content.Link({
      text: "Link to the Application",
      target: "_blank",
      href: c._bind(this.ms_home.url),
      enabled: `{= $${bindEditable} === false }`,
    });

    // ===== What's next? =====
    content.cc("Toolbar", { ns: "m" }).Title({ text: "What's next?" }).get_parent();
    if (z2ui5_cl_util.rtti_check_class_exists("z2ui5_cl_demo_app_000")) {
      const cfg = c.get().S_CONFIG || {};
      const samplesUrl = z2ui5_cl_util.app_get_url({
        classname: "z2ui5_cl_demo_app_000",
        origin:   cfg.ORIGIN || "",
        pathname: cfg.PATHNAME || "",
        search:   cfg.SEARCH || "",
        hash:     cfg.HASH || "",
      });
      content.Label({ text: "Start Developing" });
      content.Button({
        text: "Explore Code Samples",
        press: c._event_client(c.cs_event.OPEN_NEW_TAB, [samplesUrl]),
        width: "70%",
      });
    } else {
      content.Label({ text: "Install the sample repository" });
      content.Link({
        text: "And explore more than 200 sample apps...",
        target: "_blank",
        href: "https://github.com/abap2UI5/abap2UI5-samples",
      });
    }

    // ===== Contribution =====
    content.cc("Toolbar", { ns: "m" }).Title({ text: "Contribution" }).get_parent();
    content.Label({ text: "Open an issue" });
    content.Link({
      text: "You have problems, comments or wishes?",
      target: "_blank",
      href: "https://github.com/abap2UI5/abap2UI5/issues",
    });
    content.Label({ text: "Open a Pull Request" });
    content.Link({
      text: "You added a new feature or fixed a bug?",
      target: "_blank",
      href: "https://github.com/abap2UI5/abap2UI5/pulls",
    });

    // ===== Documentation =====
    content.cc("Toolbar", { ns: "m" }).Title({ text: "Documentation" }).get_parent();
    content.Label({});
    content.Link({ text: "abap2UI5.org", target: "_blank", href: "https://abap2UI5.org" });

    c.view_display(view.stringify());
  }

  view_display_popup() {
    const Z2UI5_CL_XML_VIEW = require("./z2ui5_cl_xml_view");
    const view = Z2UI5_CL_XML_VIEW.factory_popup();
    const E = z2ui5_cl_app_startup.CS_EVENT;
    const c = this.client;

    const dialog = view.Dialog({
      title: "abap2UI5 - System Information",
      afterClose: c._event(E.CLOSE),
      contentWidth: "30em",
    });

    const dContent = dialog.content();

    // z2ui5.Info custom control populates ui5_version frontend-side via setProperty.
    // Use _bind (one-way path /mv_ui5_version) on BOTH Info and the Text below — same
    // path, so when Info's TwoWay-default JSONModel binding writes back, the Text
    // re-renders. abap2UI5 uses the same pattern. Using _bind_edit here would write
    // to /XX/mv_ui5_version, leaving the Text's /mv_ui5_version untouched.
    dContent._z2ui5().info_frontend({ ui5_version: c._bind(this.mv_ui5_version) });

    const form = dContent.SimpleForm({
      editable: true,
      layout: "ResponsiveGridLayout",
      labelSpanXL: "4",
      labelSpanL: "3",
      labelSpanM: "4",
      labelSpanS: "12",
      adjustLabelSpan: false,
      emptySpanXL: "0",
      emptySpanL: "4",
      emptySpanM: "0",
      emptySpanS: "0",
      columnsXL: "1",
      columnsL: "1",
      columnsM: "1",
      singleContainerFullSize: false,
    });
    const fContent = form.content();

    // Frontend section
    fContent.cc("Toolbar", { ns: "m" }).Title({ text: "Frontend" }).get_parent();
    fContent.Label({ text: "UI5 Version" }).Text({ text: c._bind(this.mv_ui5_version) });
    fContent.Label({ text: "Launchpad active" }).CheckBox({
      enabled: false,
      selected: !!c.get().CHECK_LAUNCHPAD_ACTIVE,
    });

    // Backend section
    fContent.cc("Toolbar", { ns: "m" }).Title({ text: "Backend" }).get_parent();
    fContent.Label({ text: "ABAP for Cloud" }).CheckBox({
      enabled: false,
      selected: z2ui5_cl_util.context_check_abap_cloud(),
    });
    fContent.Label({ text: "Backend Implementation" }).Text({ text: "CAP Node.js (cap2UI5)" });

    // abap2UI5 section
    fContent.cc("Toolbar", { ns: "m" }).Title({ text: "abap2UI5" }).get_parent();
    fContent.Label({ text: "Protocol Mirror" }).Text({ text: "wire-format compatible" });
    fContent.Label({ text: "Source" }).Link({
      text: "github.com/abap2UI5/abap2UI5",
      target: "_blank",
      href: "https://github.com/abap2UI5/abap2UI5",
    });

    dialog.endButton().Button({
      text: "Close",
      press: c._event(E.CLOSE),
      type: "Emphasized",
    });

    c.popup_display(view.stringify());
  }
}

module.exports = z2ui5_cl_app_startup;
