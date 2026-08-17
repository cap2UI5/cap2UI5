const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_189 extends z2ui5_if_app {
  one = ``;
  two = ``;
  three = ``;
  client = null;

  dispatch() {
    switch (this.client.get_event()) {
      case `one_enter`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`IdTwo`]);
        break;
      case `two_enter`:
        this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`IdThree`]);
        break;
    }
  }

  render() {
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Focus - Jump to the Next Input on Enter` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Pressing Enter in an input field jumps the cursor to the next one via the set_focus follow-up action.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `One (Press Enter)` })
      .tag(`Input`)
      .a({ n: `id`, v: `IdOne` })
      .a({ n: `value`, v: this.client._bind(this.one) })
      .a({ n: `submit`, v: this.client._event(`one_enter`) })
      .tag(`Label`)
      .a({ n: `text`, v: `Two` })
      .tag(`Input`)
      .a({ n: `id`, v: `IdTwo` })
      .a({ n: `value`, v: this.client._bind(this.two) })
      .a({ n: `submit`, v: this.client._event(`two_enter`) })
      .tag(`Label`)
      .a({ n: `text`, v: `Three` })
      .tag(`Input`)
      .a({ n: `id`, v: `IdThree` })
      .a({ n: `value`, v: this.client._bind(this.three) });
    this.client.view_display(page.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.render();
      client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`IdOne`]);
    } else if (client.check_on_navigated()) {
      this.render();
    }
    this.dispatch();
  }
}

module.exports = z2ui5_cl_smp_app_189;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

