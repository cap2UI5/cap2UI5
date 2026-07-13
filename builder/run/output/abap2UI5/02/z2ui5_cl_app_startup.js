const z2ui5_cl_abap2ui5_context = require("abap2UI5/z2ui5_cl_abap2ui5_context");
const z2ui5_cl_app_hello_world = require("abap2UI5/z2ui5_cl_app_hello_world");
// TODO(abap2js): unresolved reference z2ui5_cl_core_srv_draft — add require manually
// TODO(abap2js): unresolved reference z2ui5_cl_exit — add require manually
const z2ui5_cl_pop_to_select = require("abap2UI5/z2ui5_cl_pop_to_select");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_app_startup extends z2ui5_if_app {
  static cs_event = { button_check: `BUTTON_CHECK`, button_change: `BUTTON_CHANGE`, value_help: `VALUE_HELP`, open_debug: `OPEN_DEBUG`, open_info: `OPEN_INFO`, set_config: `SET_CONFIG`, close: `CLOSE` };

  ms_home = { url: ``, btn_text: ``, btn_event_id: ``, btn_icon: ``, classname: ``, class_value_state: ``, class_value_state_text: ``, class_editable: true };
  client = null;
  mt_classes = [];

  static factory() {
    let result = null;
    result = new z2ui5_cl_app_startup();
    return result;
  }

  get_app_url({ classname } = {}) {
    let result = ``;
    const ls_config = this.client.get().S_CONFIG;
    result = z2ui5_cl_abap2ui5_context.app_get_url({ classname, origin: ls_config.ORIGIN, pathname: ls_config.PATHNAME, search: ls_config.SEARCH, hash: ls_config.HASH });
    return result;
  }

  create_layout_form({ view } = {}) {
    let result = null;
    result = view.simple_form({ editable: true, layout: `ResponsiveGridLayout`, labelspanxl: `4`, labelspanl: `3`, labelspanm: `4`, labelspans: `12`, adjustlabelspan: false, emptyspanxl: `0`, emptyspanl: `4`, emptyspanm: `0`, emptyspans: `0`, columnsxl: `1`, columnsl: `1`, columnsm: `1`, singlecontainerfullsize: false })
      .content(`form`);
    return result;
  }

  reset_button_state() {
    this.ms_home.btn_text = `Check`;
    this.ms_home.btn_event_id = z2ui5_cl_util.abap_copy(z2ui5_cl_app_startup.cs_event.button_check);
    this.ms_home.btn_icon = `sap-icon://validate`;
    this.ms_home.class_editable = true;
  }

  on_event_check() {
    let li_app_test = null;
    try {
      this.ms_home.classname = z2ui5_cl_abap2ui5_context.c_trim_upper(this.ms_home.classname);
      li_app_test = (() => { const _n = String(this.ms_home.classname); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
      this.client.message_toast_display(`App is ready to start!`);
      this.ms_home.btn_text = `Edit`;
      this.ms_home.btn_event_id = z2ui5_cl_util.abap_copy(z2ui5_cl_app_startup.cs_event.button_change);
      this.ms_home.btn_icon = `sap-icon://edit`;
      this.ms_home.class_value_state = `Success`;
      this.ms_home.class_editable = false;
      this.ms_home.url = this.get_app_url({ classname: this.ms_home.classname });
    } catch (lx) {
      this.ms_home.class_value_state_text = lx.get_text();
      this.ms_home.class_value_state = `Warning`;
      this.client.message_box_display(this.ms_home.class_value_state_text, `error`);
    }
  }

  view_display_start() {
    let lv_url_samples;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Building UI5 Apps Purely in ABAP`, shownavbutton: false });
    const toolbar = page.header_content();
    toolbar.toolbar_spacer()
      .button({ text: `Debugging Tools`, icon: `sap-icon://enablement`, press: this.client._event(z2ui5_cl_app_startup.cs_event.open_debug) })
      .button({ text: `System`, icon: `sap-icon://information`, press: this.client._event(z2ui5_cl_app_startup.cs_event.open_info) });
    if (z2ui5_cl_abap2ui5_context.rtti_check_class_exists(`z2ui5_cl_app_icf_config`)) {
      toolbar.button({ text: `Config`, icon: `sap-icon://settings`, press: this.client._event(z2ui5_cl_app_startup.cs_event.set_config) });
    }
    const simple_form = this.create_layout_form({ view: page });
    simple_form.toolbar().title(`Quickstart`);
    simple_form.label(`Step 1`)
      .text(`Create a new class in your ABAP system`)
      .label(`Step 2`)
      .text(`Add the interface: Z2UI5_IF_APP`)
      .label(`Step 3`)
      .text(`Define the view, implement behavior`)
      .label()
      .link({ text: `(Example)`, target: `_blank`, href: `https://github.com/abap2UI5/abap2UI5/blob/main/src/02/z2ui5_cl_app_hello_world.clas.abap` })
      .label(`Step 4`);
    if ((this.ms_home.class_editable === true || this.ms_home.class_editable === `X`)) {
      simple_form.input({ placeholder: `fill in the class name and press 'check'`, enabled: this.client._bind(this.ms_home.class_editable, { name: `ms_home-class_editable` }), value: this.client._bind_edit(this.ms_home.classname, { name: `ms_home-classname` }), submit: this.client._event(this.ms_home.btn_event_id), valuehelprequest: this.client._event(z2ui5_cl_app_startup.cs_event.value_help), showvaluehelp: true, width: `70%` });
    } else {
      simple_form.text(this.ms_home.classname);
    }
    simple_form.label();
    simple_form.button({ press: this.client._event(this.ms_home.btn_event_id), text: this.client._bind(this.ms_home.btn_text, { name: `ms_home-btn_text` }), icon: this.client._bind(this.ms_home.btn_icon, { name: `ms_home-btn_icon` }), width: `70%` });
    simple_form.label(`Step 5`)
      .link({ text: `Link to the Application`, target: `_blank`, href: this.client._bind(this.ms_home.url, { name: `ms_home-url` }), enabled: `{= $${this.client._bind(this.ms_home.class_editable, { name: `ms_home-class_editable` })} === false }` });
    simple_form.toolbar().title(`What's next?`);
    const lv_class_samples = (z2ui5_cl_abap2ui5_context.rtti_check_class_exists(`z2ui5_cl_sample_app_001`) ? `z2ui5_cl_sample_app_001` : z2ui5_cl_abap2ui5_context.rtti_check_class_exists(`z2ui5_cl_demo_app_000`) ? `z2ui5_cl_demo_app_000` : null);
    if (lv_class_samples) {
      lv_url_samples = this.get_app_url({ classname: lv_class_samples });
      simple_form.label(`Start Developing`);
      simple_form.button({ text: `Explore Code Samples`, press: this.client._event_client(this.client.cs_event.open_new_tab, [lv_url_samples]), width: `70%` });
    } else {
      simple_form.label(`Install the sample repository`);
      simple_form.link({ text: `And explore more than 250 sample apps...`, target: `_blank`, href: `https://github.com/abap2UI5/samples` });
    }
    simple_form.toolbar().title(`Contribution`);
    simple_form.label(`Open an issue`);
    simple_form.link({ text: `You have problems, comments or wishes?`, target: `_blank`, href: `https://github.com/abap2UI5/abap2UI5/issues` });
    simple_form.label(`Open a Pull Request`);
    simple_form.link({ text: `You added a new feature or fixed a bug?`, target: `_blank`, href: `https://github.com/abap2UI5/abap2UI5/pulls` });
    simple_form.toolbar().title(`Documentation`);
    simple_form.label();
    simple_form.link({ text: `abap2UI5.org`, target: `_blank`, href: `https://abap2UI5.org` });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let fs_class = null;
    let _fs$fs_class = null;
    let lo_f4;
    let ls_result;
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.z2ui5_on_init();
      this.view_display_start();
      return;
    }
    if (((client.get().CHECK_ON_NAVIGATED) === true || (client.get().CHECK_ON_NAVIGATED) === `X`)) {
      try {
        lo_f4 = (client.get_app_prev());
        ls_result = lo_f4.result();
        if ((ls_result.check_confirmed === true || ls_result.check_confirmed === `X`)) {
          // TODO(abap2js): ASSIGN ls_result-row->* TO FIELD-SYMBOL(<class>).
          this.ms_home = ({ ...this.ms_home, ...fs_class });
          this.view_display_start();
          return;
        }
      } catch (error) {
      }
    }
    this.z2ui5_on_event();
  }

  view_display_popup() {
    const page2 = z2ui5_cl_xml_view.factory_popup()
      .dialog({ title: `abap2UI5 - System Information`, afterclose: this.client._event(z2ui5_cl_app_startup.cs_event.close) });
    const content = page2.content();
    const simple_form2 = this.create_layout_form({ view: content });
    simple_form2.toolbar().title(`Frontend`);
    const ls_client = this.client.get();
    simple_form2.label(`UI5 Version`);
    simple_form2.text(ls_client.S_UI5.VERSION);
    simple_form2.label(`Launchpad active`);
    simple_form2.checkbox({ enabled: false, selected: ls_client.CHECK_LAUNCHPAD_ACTIVE });
    simple_form2.toolbar().title(`Backend`);
    simple_form2.label(`ABAP for Cloud`);
    simple_form2.checkbox({ enabled: false, selected: z2ui5_cl_abap2ui5_context.context_check_abap_cloud() });
    simple_form2.label(`User Exit`);
    simple_form2.text(z2ui5_cl_exit.get_user_exit_class());
    const lv_count = (new z2ui5_cl_core_srv_draft().count_entries());
    simple_form2.toolbar().title(`abap2UI5`);
    simple_form2.label(`Version`);
    simple_form2.text(z2ui5_if_app.version);
    simple_form2.label(`Draft Entries`);
    simple_form2.text(lv_count);
    page2.end_button()
      .button({ text: `Close`, press: this.client._event(z2ui5_cl_app_startup.cs_event.close), type: `Emphasized` });
    this.client.popup_display(page2.stringify());
  }

  z2ui5_on_event() {
    let li_app_config = null;
    let li_app = null;
    switch (this.client.get().EVENT) {
      case z2ui5_cl_app_startup.cs_event.set_config:
        li_app_config = (() => { const _n = String(`Z2UI5_CL_APP_ICF_CONFIG`); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
        this.client.nav_app_call(li_app_config);
        break;
      case z2ui5_cl_app_startup.cs_event.close:
        this.client.popup_destroy();
        break;
      case z2ui5_cl_app_startup.cs_event.open_debug:
        this.client.message_box_display(`Press CTRL+F12 to open the debugging tools`);
        break;
      case z2ui5_cl_app_startup.cs_event.open_info:
        this.view_display_popup();
        break;
      case z2ui5_cl_app_startup.cs_event.button_check:
        this.on_event_check();
        this.view_display_start();
        break;
      case z2ui5_cl_app_startup.cs_event.button_change:
        this.reset_button_state();
        this.view_display_start();
        break;
      case z2ui5_cl_app_startup.cs_event.value_help:
        try {
          this.mt_classes = z2ui5_cl_abap2ui5_context.rtti_get_classes_impl_intf(z2ui5_cl_abap2ui5_context.rtti_get_intfname_by_ref(li_app));
        } catch (error) {
          this.client.message_box_display(`Unfortunately the value help is not available on your ABAP release!`);
          return;
        }
        this.client.nav_app_call(z2ui5_cl_pop_to_select.factory(this.mt_classes));
        break;
    }
  }

  z2ui5_on_init() {
    this.reset_button_state();
    this.ms_home.classname = z2ui5_cl_abap2ui5_context.rtti_get_classname_by_ref(new z2ui5_cl_app_hello_world());
  }
}

module.exports = z2ui5_cl_app_startup;
