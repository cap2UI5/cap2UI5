const z2ui5_if_app = require("../../02/z2ui5_if_app");
const z2ui5_cl_util = require("../../00/03/z2ui5_cl_util");
const z2ui5_cl_ui5_view_builder = require("../../02/z2ui5_cl_ui5_view_builder");

/**
 * 1:1 port of abap2UI5 z2ui5_cl_ui5_app_start.
 *
 * Launchpad / startup screen: lets the user enter an app class name, validates it
 * via dynamic instantiation, and shows a "Link to the Application" once the class
 * is confirmed loadable. Plus a System-Info popup, a Debugging hint, and links to
 * sample repo / docs / GitHub PRs.
 */
class z2ui5_cl_ui5_app_start extends z2ui5_if_app {

  // --- cs_event: the PUBLIC event contract, 1:1 with the abap CONSTANTS
  //     block. Lowercase, because that is the ABAP name and what transpiled
  //     callers (and the upstream unit tests) address. ---
  static cs_event = Object.freeze({
    button_check:  "BUTTON_CHECK",
    button_change: "BUTTON_CHANGE",
    set_config:    "SET_CONFIG",
  });

  // Private events of the start page — abap keeps these out of cs_event on
  // purpose (what a start page does with its own popup is not contract).
  static c_event_system = "OPEN_SYSTEM";
  static c_event_close  = "CLOSE_POPUP";

  // Internal superset used by this file's view + dispatcher. The three
  // contract events are derived from cs_event so the two can never drift.
  static CS_EVENT = Object.freeze({
    BUTTON_CHECK:  "BUTTON_CHECK",
    BUTTON_CHANGE: "BUTTON_CHANGE",
    SET_CONFIG:    "SET_CONFIG",
    VALUE_HELP:    "VALUE_HELP",
    OPEN_DEBUG:    "OPEN_DEBUG",
    OPEN_INFO:     "OPEN_SYSTEM",
    CLOSE:         "CLOSE_POPUP",
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
    link_enabled:           false,
  };

  mv_ui5_version = "";
  client = null;

  // --- Factory (mirrors abap CLASS-METHODS factory) ---
  static factory() {
    return new z2ui5_cl_ui5_app_start();
  }

  reset_button_state() {
    this.ms_home.btn_text     = "Check";
    this.ms_home.btn_event_id = z2ui5_cl_ui5_app_start.CS_EVENT.BUTTON_CHECK;
    this.ms_home.btn_icon     = "sap-icon://validate";
    this.ms_home.class_editable = true;
    this.ms_home.link_enabled   = false;
    // Drop the previous check's outcome, otherwise the re-opened input still
    // shows the old value state and a stale step-5 link. The value state
    // resets to `None` rather than empty — the bound property must stay a
    // valid ValueState.
    this.ms_home.class_value_state      = "None";
    this.ms_home.url                    = "";
    this.ms_home.class_value_state_text = "";
  }

  on_init() {
    this.reset_button_state();
    this.ms_home.classname = "z2ui5_cl_ui5_app_hi_world";
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
      this.ms_home.btn_event_id   = z2ui5_cl_ui5_app_start.CS_EVENT.BUTTON_CHANGE;
      this.ms_home.btn_icon       = "sap-icon://edit";
      this.ms_home.class_value_state = "Success";
      this.ms_home.class_editable = false;
      this.ms_home.link_enabled   = true;

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
      this.on_init();
      this.view_display_start();
      return;
    }

    if (client.get().CHECK_ON_NAVIGATED) {
      try {
        const z2ui5_cl_ui5_app_select = require("./z2ui5_cl_ui5_app_select");
        const prev = client.get_app_prev();
        if (prev instanceof z2ui5_cl_ui5_app_select) {
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
    const E = z2ui5_cl_ui5_app_start.CS_EVENT;
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
        this.client.message_box_display("Press CTRL+F12 to open the developer tools");
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
        const z2ui5_cl_ui5_app_select = require("./z2ui5_cl_ui5_app_select");
        const apps = z2ui5_cl_util.rtti_get_classes_impl_intf(z2ui5_if_app);
        if (!apps.length) {
          this.client.message_box_display("No apps found that implement z2ui5_if_app", "error");
          return;
        }
        this.client.nav_app_call(z2ui5_cl_ui5_app_select.factory({ i_tab: apps, i_title: "Select an App" }));
        break;
      }
      default:
        this.view_display_start();
        break;
    }
  }

  /** The namespaces both views need. SimpleForm/content live in
   *  sap.ui.layout.form and Title in sap.ui.core — an unprefixed element
   *  would resolve into the default sap.m namespace, where those names do
   *  not exist, and the view would fail to LOAD rather than to render. */
  _view_namespaces(root) {
    return root
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
  }

  /** The SimpleForm both views share, returning its content aggregation. */
  _simple_form(parent) {
    return parent
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `editable`, b: true })
      .a({ n: `layout`, v: `ResponsiveGridLayout` })
      .a({ n: `labelSpanXL`, v: `4` })
      .a({ n: `labelSpanL`, v: `3` })
      .a({ n: `labelSpanM`, v: `4` })
      .a({ n: `labelSpanS`, v: `12` })
      // adjustLabelSpan is deliberately NOT set: the builder this view was
      // written against silently dropped it, so the page has always rendered
      // with UI5's default (true). Emitting the value the old source asked
      // for would be a layout change smuggled in under a refactor.
      .a({ n: `emptySpanXL`, v: `0` })
      .a({ n: `emptySpanL`, v: `4` })
      .a({ n: `emptySpanM`, v: `0` })
      .a({ n: `emptySpanS`, v: `0` })
      .a({ n: `columnsXL`, v: `1` })
      .a({ n: `columnsL`, v: `1` })
      .a({ n: `columnsM`, v: `1` })
      .a({ n: `singleContainerFullSize`, b: false })
      .ele({ n: `content`, ns: `form` });
  }

  /** A section heading inside the form — <Toolbar><Title/></Toolbar>. */
  _section(content, text) {
    content.ele({ n: `Toolbar` }).tag({ n: `Title` }).a({ n: `text`, v: text });
  }

  view_display_start() {
    const E = z2ui5_cl_ui5_app_start.CS_EVENT;
    const c = this.client;

    const view = this._view_namespaces(
      z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: `View`, ns: `mvc` })
        .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
        // both were emitted by the previous builder — the page is a
        // full-height app shell, not flow content
        .a({ n: `displayBlock`, v: `true` })
        .a({ n: `height`, v: `100%` }),
    );

    const page = view
      .ele({ n: `Shell` })
      .ele({ n: `Page` })
      .a({ n: `title`, v: `abap2UI5 - Developing UI5 Apps Purely in ABAP` })
      .a({ n: `showNavButton`, b: false });

    // --- Header toolbar ---
    const header = page.ele({ n: `headerContent` });
    header.tag({ n: `ToolbarSpacer` });
    header.tag({ n: `Button` })
      .a({ n: `text`, v: `Developer Tools` })
      .a({ n: `icon`, v: `sap-icon://enablement` })
      .a({ n: `press`, v: c._event(E.OPEN_DEBUG) });
    header.tag({ n: `Button` })
      .a({ n: `text`, v: `System` })
      .a({ n: `icon`, v: `sap-icon://information` })
      .a({ n: `press`, v: c._event(E.OPEN_INFO) });
    if (z2ui5_cl_util.rtti_check_class_exists(`z2ui5_cl_app_icf_config`)) {
      header.tag({ n: `Button` })
        .a({ n: `text`, v: `Config` })
        .a({ n: `icon`, v: `sap-icon://settings` })
        .a({ n: `press`, v: c._event(E.SET_CONFIG) });
    }

    const content = this._simple_form(page.end());

    // ===== Quickstart =====
    this._section(content, `Quickstart`);
    const step = (label, text) => {
      content.tag({ n: `Label` }).a({ n: `text`, v: label });
      content.tag({ n: `Text` }).a({ n: `text`, v: text });
    };
    step(`Step 1`, `Create a new class in your ABAP system`);
    step(`Step 2`, `Add the interface: Z2UI5_IF_APP`);
    step(`Step 3`, `Define the view, implement behavior`);
    content.tag({ n: `Label` });
    content.tag({ n: `Link` })
      .a({ n: `text`, v: `(Example)` })
      .a({ n: `href`, v: `https://github.com/abap2UI5/abap2UI5/blob/main/src/01/04/z2ui5_cl_ui5_app_hi_world.clas.abap` })
      .a({ n: `target`, v: `_blank` });
    content.tag({ n: `Label` }).a({ n: `text`, v: `Step 4` });

    if (this.ms_home.class_editable) {
      content.tag({ n: `Input` })
        .a({ n: `value`, v: c._bind_edit(this.ms_home.classname, { name: `ms_home-classname` }) })
        .a({ n: `placeholder`, v: `fill in the class name and press 'check'` })
        .a({ n: `enabled`, v: c._bind(this.ms_home.class_editable, { name: `ms_home-class_editable` }) })
        .a({ n: `width`, v: `70%` })
        .a({ n: `submit`, v: c._event(this.ms_home.btn_event_id) })
        .a({ n: `valueState`, v: c._bind(this.ms_home.class_value_state, { name: `ms_home-class_value_state` }) })
        .a({ n: `valueStateText`, v: c._bind(this.ms_home.class_value_state_text, { name: `ms_home-class_value_state_text` }) })
        .a({ n: `showValueHelp`, b: true })
        .a({ n: `valueHelpRequest`, v: c._event(E.VALUE_HELP) });
    } else {
      content.tag({ n: `Text` }).a({ n: `text`, v: this.ms_home.classname });
    }

    content.tag({ n: `Label` });
    content.tag({ n: `Button` })
      .a({ n: `text`, v: c._bind(this.ms_home.btn_text, { name: `ms_home-btn_text` }) })
      .a({ n: `press`, v: c._event(this.ms_home.btn_event_id) })
      .a({ n: `icon`, v: c._bind(this.ms_home.btn_icon, { name: `ms_home-btn_icon` }) })
      .a({ n: `width`, v: `70%` });

    content.tag({ n: `Label` }).a({ n: `text`, v: `Step 5` });
    // UI5 expression binding needs `${...}` to dereference a model path; the
    // first `$` is literal, the second is JS interpolation.
    const bindEditable = c._bind(this.ms_home.class_editable, { name: `ms_home-class_editable` });
    content.tag({ n: `Link` })
      .a({ n: `text`, v: `Link to the Application` })
      .a({ n: `href`, v: c._bind(this.ms_home.url, { name: `ms_home-url` }) })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `enabled`, v: `{= $${bindEditable} === false }` });

    // ===== What's next? =====
    // Jump into the getting-started gallery when the samples are installed.
    // The samples repository renamed its overview app in 2026-08
    // (z2ui5_cl_demo_app_g00 -> z2ui5_cl_smp_app_000), so the old name stays
    // as a fallback for installations that predate the rename.
    this._section(content, `What's next?`);
    const samplesClass = [`z2ui5_cl_smp_app_000`, `z2ui5_cl_demo_app_g00`]
      .find((n) => z2ui5_cl_util.rtti_check_class_exists(n)) ?? ``;
    if (samplesClass) {
      const cfg = c.get().S_CONFIG || {};
      const samplesUrl = z2ui5_cl_util.app_get_url({
        classname: samplesClass,
        origin:   cfg.ORIGIN || ``,
        pathname: cfg.PATHNAME || ``,
        search:   cfg.SEARCH || ``,
        hash:     cfg.HASH || ``,
      });
      content.tag({ n: `Label` }).a({ n: `text`, v: `Start Developing` });
      content.tag({ n: `Button` })
        .a({ n: `text`, v: `Explore Code Samples` })
        .a({ n: `press`, v: c._event_client(c.cs_event.OPEN_NEW_TAB, [samplesUrl]) })
        .a({ n: `width`, v: `70%` });
    } else {
      content.tag({ n: `Label` }).a({ n: `text`, v: `Install the sample repository` });
      content.tag({ n: `Link` })
        .a({ n: `text`, v: `And explore more than 250 sample apps...` })
        .a({ n: `href`, v: `https://github.com/abap2UI5/samples` })
        .a({ n: `target`, v: `_blank` });
    }

    // ===== Contribution =====
    this._section(content, `Contribution`);
    content.tag({ n: `Label` }).a({ n: `text`, v: `Open an issue` });
    content.tag({ n: `Link` })
      .a({ n: `text`, v: `You have problems, comments or wishes?` })
      .a({ n: `href`, v: `https://github.com/abap2UI5/abap2UI5/issues` })
      .a({ n: `target`, v: `_blank` });
    content.tag({ n: `Label` }).a({ n: `text`, v: `Open a Pull Request` });
    content.tag({ n: `Link` })
      .a({ n: `text`, v: `You added a new feature or fixed a bug?` })
      .a({ n: `href`, v: `https://github.com/abap2UI5/abap2UI5/pulls` })
      .a({ n: `target`, v: `_blank` });

    // ===== Documentation =====
    this._section(content, `Documentation`);
    content.tag({ n: `Label` });
    content.tag({ n: `Link` })
      .a({ n: `text`, v: `abap2UI5.org` })
      .a({ n: `href`, v: `https://abap2UI5.org` })
      .a({ n: `target`, v: `_blank` });

    c.view_display(view.stringify());
  }

  view_display_popup() {
    const E = z2ui5_cl_ui5_app_start.CS_EVENT;
    const c = this.client;

    // A popup is a fragment, not a view — the frontend inserts it into an
    // existing view hierarchy.
    const view = this._view_namespaces(
      z2ui5_cl_ui5_view_builder.factory().ele({ n: `FragmentDefinition`, ns: `core` }),
    );

    const dialog = view
      .ele({ n: `Dialog` })
      .a({ n: `title`, v: `abap2UI5 - System Information` })
      .a({ n: `contentWidth`, v: `30em` })
      .a({ n: `afterClose`, v: c._event(E.CLOSE) });

    const dContent = dialog.ele({ n: `content` });

    // The z2ui5.Info custom control fills ui5_version frontend-side via
    // setProperty. _bind (one-way, path /mv_ui5_version) on BOTH this and the
    // Text below — same path, so when Info's two-way-default JSONModel
    // binding writes back, the Text re-renders. _bind_edit would write to
    // /XX/mv_ui5_version and leave the Text's path untouched.
    dContent.tag({ n: `Info`, ns: `z2ui5` }).a({ n: `ui5_version`, v: c._bind(this.mv_ui5_version) });

    const fContent = this._simple_form(dContent);

    this._section(fContent, `Frontend`);
    fContent.tag({ n: `Label` }).a({ n: `text`, v: `UI5 Version` });
    fContent.tag({ n: `Text` }).a({ n: `text`, v: c._bind(this.mv_ui5_version) });
    fContent.tag({ n: `Label` }).a({ n: `text`, v: `Launchpad active` });
    fContent.tag({ n: `CheckBox` })
      .a({ n: `selected`, b: !!c.get().CHECK_LAUNCHPAD_ACTIVE })
      .a({ n: `enabled`, b: false });

    this._section(fContent, `Backend`);
    fContent.tag({ n: `Label` }).a({ n: `text`, v: `ABAP for Cloud` });
    fContent.tag({ n: `CheckBox` })
      .a({ n: `selected`, b: z2ui5_cl_util.context_check_abap_cloud() })
      .a({ n: `enabled`, b: false });
    fContent.tag({ n: `Label` }).a({ n: `text`, v: `Backend Implementation` });
    fContent.tag({ n: `Text` }).a({ n: `text`, v: `CAP Node.js (cap2UI5)` });

    this._section(fContent, `abap2UI5`);
    fContent.tag({ n: `Label` }).a({ n: `text`, v: `Protocol Mirror` });
    fContent.tag({ n: `Text` }).a({ n: `text`, v: `wire-format compatible` });
    fContent.tag({ n: `Label` }).a({ n: `text`, v: `Source` });
    fContent.tag({ n: `Link` })
      .a({ n: `text`, v: `github.com/abap2UI5/abap2UI5` })
      .a({ n: `href`, v: `https://github.com/abap2UI5/abap2UI5` })
      .a({ n: `target`, v: `_blank` });

    dialog.ele({ n: `endButton` })
      .tag({ n: `Button` })
      .a({ n: `text`, v: `Close` })
      .a({ n: `press`, v: c._event(E.CLOSE) })
      .a({ n: `type`, v: `Emphasized` });

    c.popup_display(view.stringify());
  }
}

module.exports = z2ui5_cl_ui5_app_start;
