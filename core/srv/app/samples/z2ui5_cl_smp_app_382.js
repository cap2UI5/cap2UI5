const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_382 extends z2ui5_if_app {
  client = null;
  title = ``;
  message = ``;
  details = ``;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_init() {
    this.title = `abap2UI5`;
    this.message = `This is a message box.`;
    this.details = `These are additional details about the message.`;
  }

  on_event() {
    switch (this.client.get_event()) {
      case `CUSTOM`:
        this.client.message_box_display(this.message, `information`, this.title, undefined, undefined, [`Approve`, `Reject`], `Approve`, undefined, undefined, undefined, this.details);
        break;
      default:
        this.client.message_box_display(this.message, this.client.get_event(), this.title, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.details);
        break;
    }
  }

  view_display() {
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
      .a({ n: `title`, v: `abap2UI5 - Message - MessageBox, Types and Custom Actions` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `This sample demonstrates MessageBox: open confirm, information, success, ` + `warning, error, or a custom dialog with your own actions.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele(`headerContent`)
      .tag(`Link`)
      .a({ n: `text`, v: `UI5 Demo Kit` })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `href`, v: `https://sdk.openui5.org/entity/sap.m.MessageBox/sample/sap.m.sample.MessageBox` });
    page.ele(`Panel`)
      .a({ n: `headerText`, v: `Message Box Configuration` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Settings` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `Title` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.title) })
      .tag(`Label`)
      .a({ n: `text`, v: `Message` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.message) })
      .tag(`Label`)
      .a({ n: `text`, v: `Details` })
      .tag(`TextArea`)
      .a({ n: `value`, v: this.client._bind(this.details) })
      .a({ n: `rows`, v: `3` });
    page.ele(`footer`)
      .ele(`OverflowToolbar`)
      .tag(`Text`)
      .a({ n: `text`, v: `Open Message Box:` })
      .tag(`ToolbarSpacer`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`confirm`) })
      .a({ n: `text`, v: `Confirm` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`information`) })
      .a({ n: `text`, v: `Information` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`success`) })
      .a({ n: `text`, v: `Success` })
      .a({ n: `type`, v: `Accept` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`warning`) })
      .a({ n: `text`, v: `Warning` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`error`) })
      .a({ n: `text`, v: `Error` })
      .a({ n: `type`, v: `Reject` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`CUSTOM`) })
      .a({ n: `text`, v: `Custom` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_382;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

