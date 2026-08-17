const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_104 extends z2ui5_if_app {
  app_sub = null;
  classname = ``;
  t_tab = [];
  layout = ``;
  grid_sub = null;
  view_nested = null;
  client = null;

  on_event_sub() {
    let sy_subrc = 0;
    let fs_fs = null;
    let _fs$fs_fs = null;
    if (this.app_sub != null) {
      _fs$fs_fs = ((_o, _n) => { if (_o == null) return null; const _k = String(_n).toLowerCase(); return _k in _o ? { o: _o, k: _k } : null; })(this.app_sub, `VIEW_PARENT`);
      fs_fs = _fs$fs_fs ? _fs$fs_fs.o[_fs$fs_fs.k] : null;
      sy_subrc = _fs$fs_fs ? 0 : 4;
      if (sy_subrc !== 0) {
        return;
      }
      fs_fs = this.grid_sub;
      if (_fs$fs_fs) _fs$fs_fs.o[_fs$fs_fs.k] = fs_fs;
      {
        const _dynr = (this.app_sub);
        const _dynm = _dynr ? _dynr[String(`Z2UI5_IF_APP~MAIN`).toLowerCase()] : undefined;
        if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`Z2UI5_IF_APP~MAIN`)} not found`);
        {
          const _dynargs = { client: this.client };
          const _dynret = _dynm.call(_dynr, _dynargs);
        }
      }
    }
  }

  on_init_sub() {
    let sy_subrc = 0;
    let fs_fs = null;
    let _fs$fs_fs = null;
    this.classname = this.classname.toUpperCase();
    this.app_sub = (() => { const _n = String(this.classname); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(`CREATE OBJECT: class ${_n} not found`); return new _c(); })();
    _fs$fs_fs = ((_o, _n) => { if (_o == null) return null; const _k = String(_n).toLowerCase(); return _k in _o ? { o: _o, k: _k } : null; })(this.app_sub, `VIEW_PARENT`);
    fs_fs = _fs$fs_fs ? _fs$fs_fs.o[_fs$fs_fs.k] : null;
    sy_subrc = _fs$fs_fs ? 0 : 4;
    if (sy_subrc !== 0) {
      return;
    }
    fs_fs = this.grid_sub;
    if (_fs$fs_fs) _fs$fs_fs.o[_fs$fs_fs.k] = fs_fs;
    {
      const _dynr = (this.app_sub);
      const _dynm = _dynr ? _dynr[String(`Z2UI5_IF_APP~MAIN`).toLowerCase()] : undefined;
      if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`Z2UI5_IF_APP~MAIN`)} not found`);
      {
        const _dynargs = { client: this.client };
        const _dynret = _dynm.call(_dynr, _dynargs);
      }
    }
    {
      const _dynr = (this.app_sub);
      const _dynm = _dynr ? _dynr[String(`VIEW_DISPLAY`).toLowerCase()] : undefined;
      if (typeof _dynm !== "function") throw new Error(`CALL METHOD: ${String(`VIEW_DISPLAY`)} not found`);
      {
        const _dynargs = {  };
        const _dynret = _dynm.call(_dynr, _dynargs);
      }
    }
  }

  view_display_detail() {
    this.view_nested = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const page = this.view_nested.ele(`Page`).a({ n: `title`, v: `Nested View` });
    this.grid_sub = page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L12 M12 S12` })
      .ele({ n: `content`, ns: `layout` });
  }

  view_display_master() {
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:f`, v: `sap.f` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Nested View - Embed Another App's View` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Selecting a list row instantiates another abap2UI5 app by its class name and ` + `embeds that app's own view into the detail column.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const col_layout = page.ele({ n: `FlexibleColumnLayout`, ns: `f` })
      .a({ n: `layout`, v: this.client._bind(this.layout) })
      .a({ n: `id`, v: `test` });
    const master = col_layout.ele({ n: `beginColumnPages`, ns: `f` });
    const list = master.ele(`List`)
      .a({ n: `headerText`, v: `List Output` })
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `mode`, v: `SingleSelectMaster` })
      .a({ n: `selectionChange`, v: this.client._event(`SELCHANGE`) })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{TITLE}` })
      .a({ n: `description`, v: `{DESCR}` })
      .a({ n: `icon`, v: `{ICON}` })
      .a({ n: `info`, v: `{INFO}` })
      .a({ n: `press`, v: this.client._event(`TEST`) })
      .a({ n: `selected`, v: `{SELECTED}` });
    this.client.view_display(list.stringify());
  }

  async main(client) {
    let sy_subrc = 0;
    let t_sel;
    let s_sel;
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ title: `Class 1`, info: `z2ui5_cl_smp_app_105`, descr: `this is a description`, icon: `sap-icon://account` }, { title: `Class 2`, info: `z2ui5_cl_smp_app_112`, descr: `this is a description`, icon: `sap-icon://account` }]);
      this.layout = `OneColumn`;
      this.view_display_master();
      this.view_display_detail();
    } else if (client.check_on_navigated()) {
      this.view_display_master();
    } else if (client.check_on_event(`SELCHANGE`)) {
      t_sel = z2ui5_cl_util.abap_copy(this.t_tab);
      for (let _i = t_sel.length - 1; _i >= 0; _i--) { const row = t_sel[_i]; if (!(row.selected === true || row.selected === `X`)) t_sel.splice(_i, 1); }
      s_sel = {};
      {
        const _t = t_sel;
        const _i = (1) - 1;
        sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;
        if (sy_subrc === 0) s_sel = _t[_i];
      }
      if (sy_subrc !== 0) {
        return;
      }
      if (!z2ui5_cl_util.abap_is_initial(this.classname)) {
        this.view_display_master();
      }
      this.classname = z2ui5_cl_util.abap_tab_assign(this.classname, z2ui5_cl_util.abap_copy(s_sel.info));
      this.layout = `TwoColumnsMidExpanded`;
      this.view_display_detail();
      this.on_init_sub();
      client.nest_view_display(this.view_nested.stringify(), `test`, `addMidColumnPage`, `removeAllMidColumnPages`);
    }
    this.on_event_sub();
  }
}

module.exports = z2ui5_cl_smp_app_104;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

