const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_008 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    let ls_msg_sy;
    let ls_msg_bapiret;
    let lv_val;
    let lx;
    switch (this.client.get_event()) {
      case `BUTTON_MESSAGE_BOX_SY`:
        ls_msg_sy = z2ui5_cl_smp_context.msg_get_by_msg({ id: `NET`, no: `001` });
        this.client.message_box_display(ls_msg_sy);
        break;
      case `BUTTON_MESSAGE_BOX_BAPIRET`:
        ls_msg_bapiret = { id: `NET`, number: `001` };
        this.client.message_box_display(ls_msg_bapiret);
        break;
      case `BUTTON_MESSAGE_BOX_CX_ROOT`:
        try {
          lv_val = z2ui5_cl_util.abap_div(1, 0);
          this.client.message_box_display(`${lv_val}`);
        } catch (_caught1) {
          lx = _caught1;
          this.client.message_box_display(lx);
        }
        break;
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
      .a({ n: `title`, v: `abap2UI5 - Message - MessageBox from SY, BAPIRET2 or Exception` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() })
      .ele(`headerContent`)
      .tag(`Link`)
      .end();
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The three buttons feed a MessageBox with the message objects ABAP ` + `produces: a SY message read from T100, a BAPIRET2 structure and a ` + `caught CX_ROOT exception. message_box_display( ) accepts each of them ` + `directly, no conversion in the app.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `Grid`, ns: `layout` })
      .a({ n: `defaultSpan`, v: `L6 M12 S12` })
      .ele({ n: `content`, ns: `layout` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Message Box from ABAP Object` })
      .ele({ n: `content`, ns: `form` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_MESSAGE_BOX_SY`) })
      .a({ n: `text`, v: `SY Message` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_MESSAGE_BOX_BAPIRET`) })
      .a({ n: `text`, v: `BAPIRET2` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`BUTTON_MESSAGE_BOX_CX_ROOT`) })
      .a({ n: `text`, v: `CX_ROOT` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_008;

const z2ui5_cl_smp_context = require("./z2ui5_cl_smp_context");
const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

