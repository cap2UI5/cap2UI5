const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_488 extends z2ui5_if_app {
  s_result = null;
  returned_event = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.on_navigation();
    } else if (client.check_on_event(`CALL_APP`)) {
      client.nav_app_call(new z2ui5_cl_smp_app_489());
    }
  }

  on_navigation() {
    let sy_subrc = 0;
    let fs_s_result = null;
    let _fs$fs_s_result = null;
    const ls_get = this.client.get();
    this.returned_event = z2ui5_cl_util.abap_tab_assign(this.returned_event, z2ui5_cl_util.abap_copy(ls_get.EVENT));
    if (this.returned_event === `DATA_CONFIRMED`) {
      fs_s_result = ls_get.R_EVENT_DATA;
      _fs$fs_s_result = { o: ls_get, k: `R_EVENT_DATA` };
      sy_subrc = 0;
      if (fs_s_result != null) {
        this.s_result = z2ui5_cl_util.abap_tab_assign(this.s_result, z2ui5_cl_util.abap_copy(fs_s_result));
        this.client.message_toast_display(`Returned event ${this.returned_event}, ` + `product ${this.s_result.product}, quantity ${this.s_result.quantity}`);
      }
    } else if (this.returned_event === `DATA_CANCELLED`) {
      this.s_result = {};
      this.client.message_toast_display(`Returned event DATA_CANCELLED, no data passed`);
    }
    this.view_display();
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Navigation - Return Data and Events to the Caller` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Calls a second app that returns via nav_app_leave with an event and a data ` + `payload (r_data). On return this app reads both from client->get( ) in its ` + `check_on_navigated( ) branch and shows them below.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const form = page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L6 M12 S12` })
      .ele({ n: `content`, ns: `layout` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Result returned by the called app` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Label`).a({ n: `text`, v: `Open the input app` });
    form.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CALL_APP`) })
      .a({ n: `text`, v: `call app (nav_app_call)` })
      .a({ n: `type`, v: `Emphasized` });
    form.tag(`Label`).a({ n: `text`, v: `Returned event` });
    form.tag(`Input`).a({ n: `enabled`, b: false }).a({ n: `value`, v: this.client._bind(this.returned_event) });
    form.tag(`Label`).a({ n: `text`, v: `Returned product` });
    form.tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.s_result.product, { name: `s_result-product` }) });
    form.tag(`Label`).a({ n: `text`, v: `Returned quantity` });
    form.tag(`Input`)
      .a({ n: `enabled`, b: false })
      .a({ n: `value`, v: this.client._bind(this.s_result.quantity, { name: `s_result-quantity` }) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_488;

const z2ui5_cl_smp_app_489 = require("./z2ui5_cl_smp_app_489");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

