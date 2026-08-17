const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_467 extends z2ui5_if_app {
  t_messages = [];
  name = ``;
  amount = 0;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.amount = 42;
      this.t_messages = z2ui5_cl_util.abap_tab_assign(this.t_messages, [{ message: `Please enter a valid name`, type: `Error`, additionaltext: `Name`, target: `/NAME` }, { message: `Draft saved automatically`, type: `Information`, additionaltext: `Autosave` }]);
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Message - Message Model and MessageManager` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Both sources of the central message> model in one page: the Name messages ` + `are AUTHORED BY THE APP (pushed from an ABAP table by the invisible ` + `z2ui5.cc.MessageManager companion - the Error targets the Name field and ` + `colours it), while typing letters into the Amount field collects the failed ` + `Integer validation AUTOMATICALLY - no app code, no roundtrip. Both render ` + `in the list below.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `MessageManager`, ns: `z2ui5` }).a({ n: `items`, v: this.client._bind(this.t_messages) });
    page.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Label`)
      .a({ n: `text`, v: `Name (message authored by the app)` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.name) })
      .tag(`Label`)
      .a({ n: `text`, v: `Amount (integer only - validation collected automatically)` })
      .tag(`Input`)
      .a({ n: `value`, v: `{ path: '${this.client._bind(this.amount, { path: true })}', ` + `type: 'sap.ui.model.type.Integer' }` })
      .a({ n: `width`, v: `12rem` });
    page.ele(`List`)
      .a({ n: `headerText`, v: `Collected messages (message> model)` })
      .a({ n: `items`, v: `{message>/}` })
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .a({ n: `noDataText`, v: `no messages` })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{message>message}` })
      .a({ n: `description`, v: `{message>additionalText}` })
      .a({ n: `info`, v: `{message>type}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_467;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

