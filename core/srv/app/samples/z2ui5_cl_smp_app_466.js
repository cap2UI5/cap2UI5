const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_466 extends z2ui5_if_app {
  status_text = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.status_text = `<strong>Deployment successful!</strong> %%icon:sap-icon://message-success%% All services ` + `%%icon:sap-icon://sys-enter-2%% are running. <em>Check status</em> ` + `%%icon:sap-icon://stethoscope%%`;
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
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    view.a({ n: `core:require`, v: `{Formatter: 'z2ui5/model/formatter'}` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Formatter - Inline Icons in a Text` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The status line below binds a plain string carrying %%icon:sap-icon://...%% placeholders ` + `through Formatter.expandInlineIcons - each placeholder becomes an inline icon glyph, ` + `no codepoints in the app.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `{ path: '${this.client._bind(this.status_text, { path: true })}', ` + `formatter: 'Formatter.expandInlineIcons' }` })
      .a({ n: `type`, v: `Success` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .a({ n: `enableFormattedText`, b: true });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_466;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

