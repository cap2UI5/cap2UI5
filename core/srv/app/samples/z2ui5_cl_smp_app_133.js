const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_133 extends z2ui5_if_app {
  field_01 = ``;
  field_02 = ``;
  selstart = ``;
  selend = ``;
  client = null;

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
      .a({ n: `title`, v: `abap2UI5 - Focus - Set Focus and Select Text in an Input` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Pressing a button runs the set_focus front-end action, which moves keyboard focus to the ` + `target input and selects the text between the given start and end positions.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Focus & Cursor` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Title`)
      .a({ n: `text`, v: `Input` })
      .tag(`Label`)
      .a({ n: `text`, v: `Sel_Start` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.selstart) })
      .tag(`Label`)
      .a({ n: `text`, v: `Sel_End` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.selend) })
      .tag(`Label`)
      .a({ n: `text`, v: `field_01` })
      .tag(`Input`)
      .a({ n: `id`, v: `BUTTON01` })
      .a({ n: `value`, v: this.client._bind(this.field_01) })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON01`) })
      .a({ n: `text`, v: `focus here` })
      .tag(`Label`)
      .a({ n: `text`, v: `field_02` })
      .tag(`Input`)
      .a({ n: `id`, v: `BUTTON02` })
      .a({ n: `value`, v: this.client._bind(this.field_02) })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON02`) })
      .a({ n: `text`, v: `focus here` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.field_01 = `this is a text`;
      this.field_02 = `this is another text`;
      this.selstart = `3`;
      this.selend = `7`;
      this.view_display();
      return;
    } else if (client.check_on_navigated()) {
      this.view_display();
    }
    switch (client.get_event()) {
      case `BUTTON01`:
      case `BUTTON02`:
        client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [client.get_event(), this.selstart, this.selend]);
        client.message_toast_display(`focus changed`);
        break;
    }
  }
}

module.exports = z2ui5_cl_smp_app_133;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

