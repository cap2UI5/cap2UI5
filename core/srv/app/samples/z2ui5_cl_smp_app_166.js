const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_166 extends z2ui5_if_app {
  ms_struc = { title: ``, value: ``, value2: `` };
  ms_struc2 = {  };
  client = null;

  set_view() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Binding - Structure Fields and INCLUDEs` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample demonstrates structure-level binding: each input is bound to a ` + `field of a flat structure, including fields pulled in via INCLUDE.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag(`Input`).a({ n: `value`, v: this.client._bind(this.ms_struc.title, { name: `ms_struc-title` }) });
    page.tag(`Input`).a({ n: `value`, v: this.client._bind(this.ms_struc.value, { name: `ms_struc-value` }) });
    page.tag(`Input`).a({ n: `value`, v: this.client._bind(this.ms_struc.value2, { name: `ms_struc-value2` }) });
    page.tag(`Input`).a({ n: `value`, v: this.client._bind(this.ms_struc2.title, { name: `ms_struc2-title` }) });
    page.tag(`Input`).a({ n: `value`, v: this.client._bind(this.ms_struc2.value, { name: `ms_struc2-value` }) });
    page.tag(`Input`).a({ n: `value`, v: this.client._bind(this.ms_struc2.value2, { name: `ms_struc2-value2` }) });
    page.tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.ms_struc2.incl_title, { name: `ms_struc2-incl_title` }) });
    page.tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.ms_struc2.incl_value, { name: `ms_struc2-incl_value` }) });
    page.tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.ms_struc2.incl_value2, { name: `ms_struc2-incl_value2` }) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.ms_struc.title = `title`;
      this.ms_struc.value = `val01`;
      this.ms_struc.value2 = `val02`;
      this.ms_struc2.title = `title`;
      this.ms_struc2.value = `val01`;
      this.ms_struc2.value2 = `val02`;
      this.ms_struc2.incl_title = `title_incl`;
      this.ms_struc2.incl_value = `val01_incl`;
      this.ms_struc2.incl_value2 = `val02_incl`;
      this.set_view();
    }
  }
}

module.exports = z2ui5_cl_smp_app_166;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

