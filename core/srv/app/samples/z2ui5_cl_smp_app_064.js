const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_064 extends z2ui5_if_app {
  mv_check_active = false;
  screen = { progress_value: `0`, display_value: `` };
  mv_percent = 0;
  mv_check_enabled = false;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
    } else if (client.check_on_navigated()) {
      this.on_init();
    } else {
      this.on_event();
    }
  }

  on_event() {
    if (this.client.check_on_event(`LOAD`)) {
      this.mv_percent = this.mv_percent + 25;
      this.mv_check_active = true;
      this.mv_check_enabled = false;
      if (this.mv_percent > 100) {
        this.mv_percent = 0;
        this.mv_check_active = false;
        this.mv_check_enabled = true;
      }
      this.client.message_toast_display(`loaded`);
      // TODO(abap2js): WAIT UP TO 2 SECONDS.
      if ((this.mv_check_active === true || this.mv_check_active === `X`)) {
        this.client.follow_up_action(z2ui5_if_client.cs_event.start_timer, [`LOAD`, `0`]);
      }
    }
  }

  on_init() {
    let temp1 = [];
    let view = null;
    let page1 = null;
    let temp5 = false;
    let layout = null;
    temp1 = {};
    this.mv_check_enabled = true;
    view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:layout`, v: `sap.ui.layout` });
    temp5 = this.client.check_app_prev_stack();
    page1 = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Timer - Progress Indicator during a Backend Call` })
      .a({ n: `showNavButton`, b: temp5 })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .a({ n: `class`, v: `sapUiContentPadding` })
      .a({ n: `id`, v: `page_main` });
    page1.tag(`MessageStrip`)
      .a({ n: `text`, v: `A ProgressIndicator driven from the backend: pressing Load runs a WAIT-delayed server ` + `step and re-arms a client timer (follow_up_action), advancing the bar in 25% steps until it completes.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    layout = page1.ele({ n: `VerticalLayout`, ns: `layout` })
      .a({ n: `class`, v: `sapuicontentpadding` })
      .a({ n: `width`, v: `100%` });
    layout.ele(`VBox`)
      .tag(`ProgressIndicator`)
      .a({ n: `percentValue`, v: this.client._bind(this.mv_percent) })
      .a({ n: `displayValue`, v: this.client._bind(this.screen.display_value, { name: `screen-display_value` }) })
      .a({ n: `showValue`, b: true })
      .a({ n: `state`, v: `Success` });
    layout.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`LOAD`) })
      .a({ n: `text`, v: `Load` })
      .a({ n: `enabled`, v: this.client._bind(this.mv_check_enabled) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_064;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

