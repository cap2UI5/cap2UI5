const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_352 extends z2ui5_if_app {
  input = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
      client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`ZINPUT`]);
      client.follow_up_action(z2ui5_if_client.cs_event.keyboard_set_mode, [`ZINPUT`, `numeric`]);
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
    this.on_event();
  }

  view_display() {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Browser - Soft Keyboard Mode on Mobile` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Set the on-screen soft keyboard mode (numeric or off) via the keyboard_set_mode follow-up action, and ` + `focus the input on load.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Title`)
      .a({ n: `text`, v: `Keyboard on/off` })
      .tag(`Label`)
      .a({ n: `text`, v: `Input (numeric keyboard)` })
      .tag(`Input`)
      .a({ n: `id`, v: `ZINPUT` })
      .a({ n: `value`, v: this.client._bind(this.input) })
      .a({ n: `valueHelpRequest`, v: this.client._event(`CALL_KEYBOARD`) })
      .a({ n: `showValueHelp`, b: true });
    this.client.view_display(page.stringify());
  }

  on_event() {
    if (this.client.check_on_event(`CALL_KEYBOARD`)) {
      this.client.follow_up_action(z2ui5_if_client.cs_event.keyboard_set_mode, [`ZINPUT`, `none`]);
    }
  }
}

module.exports = z2ui5_cl_smp_app_352;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

