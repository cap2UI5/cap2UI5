const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_167 extends z2ui5_if_app {
  mv_value = ``;
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
      .a({ n: `title`, v: `abap2UI5 - Event - Extra Arguments with t_arg` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample shows how to pass extra arguments to an event via t_arg - fixed ` + `values, model values, or client-side expressions - and read them in the backend.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag(`Link`)
      .a({ n: `text`, v: `More information...` })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `href`, v: `https://sdk.openui5.org/topic/b0fb4de7364f4bcbb053a99aa645affe` });
    page.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`EVENT_FIX_VAL`, [`FIX_VAL`]) })
      .a({ n: `text`, v: `EVENT_FIX_VAL` });
    page.tag(`Input`).a({ n: `value`, v: this.client._bind(this.mv_value) });
    page.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`EVENT_MODEL_VALUE`, [`$` + this.client._bind(this.mv_value)]) })
      .a({ n: `text`, v: `EVENT_MODEL_VALUE` });
    page.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`SOURCE_PROPERTY_TEXT`, [`\${$source>/text}`]) })
      .a({ n: `text`, v: `SOURCE_PROPERTY_TEXT` });
    page.tag(`Input`)
      .a({ n: `description`, v: `make an input and press enter - ` })
      .a({ n: `submit`, v: this.client._event(`EVENT_PROPERTY_VALUE`, [`\${$parameters>/value}`]) });
    page.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`PARENT_PROPERTY_ID`, [`$event.oSource.oParent.sId`]) })
      .a({ n: `text`, v: `PARENT_PROPERTY_ID` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.mv_value = `my value`;
      this.set_view();
    } else if (client.check_on_navigated()) {
      this.set_view();
    }
    switch (client.get_event()) {
      case `EVENT_FIX_VAL`:
      case `EVENT_MODEL_VALUE`:
      case `SOURCE_PROPERTY_TEXT`:
      case `EVENT_PROPERTY_VALUE`:
      case `PARENT_PROPERTY_ID`:
        client.message_box_display(`backend event: ${client.get_event_arg()}`);
        break;
    }
  }
}

module.exports = z2ui5_cl_smp_app_167;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

