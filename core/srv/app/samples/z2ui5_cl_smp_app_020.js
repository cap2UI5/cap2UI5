const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_020 extends z2ui5_if_app {
  text = ``;
  cancel_text = ``;
  cancel_event = ``;
  confirm_text = ``;
  confirm_event = ``;
  event = ``;

  static factory({ i_text, i_cancel_text, i_cancel_event, i_confirm_text, i_confirm_event } = {}) {
    let result = null;
    result = new z2ui5_cl_smp_app_020();
    result.text = z2ui5_cl_util.abap_tab_assign(result.text, z2ui5_cl_util.abap_copy(i_text));
    result.cancel_text = z2ui5_cl_util.abap_tab_assign(result.cancel_text, z2ui5_cl_util.abap_copy(i_cancel_text));
    result.cancel_event = z2ui5_cl_util.abap_tab_assign(result.cancel_event, z2ui5_cl_util.abap_copy(i_cancel_event));
    result.confirm_text = z2ui5_cl_util.abap_tab_assign(result.confirm_text, z2ui5_cl_util.abap_copy(i_confirm_text));
    result.confirm_event = z2ui5_cl_util.abap_tab_assign(result.confirm_event, z2ui5_cl_util.abap_copy(i_confirm_event));
    return result;
  }

  async main(client) {
    switch (client.get_event()) {
      case this.cancel_event:
      case this.confirm_event:
        this.event = client.get_event();
        client.popup_destroy();
        client.nav_app_leave();
        return;
        break;
    }
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` });
    const dialog = popup.ele(`Dialog`).a({ n: `title`, v: `abap2UI5 - Popup to decide` });
    dialog.tag(`MessageStrip`)
      .a({ n: `text`, v: `A reusable decision popup opened as a sub-app: its text, button labels and events ` + `are passed in by the caller, and the pressed event is sent back.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    dialog.ele(`VBox`)
      .tag(`Text`)
      .a({ n: `text`, v: this.text })
      .end()
      .ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: client._event(this.cancel_event) })
      .a({ n: `text`, v: this.cancel_text })
      .tag(`Button`)
      .a({ n: `press`, v: client._event(this.confirm_event) })
      .a({ n: `text`, v: this.confirm_text })
      .a({ n: `type`, v: `Emphasized` });
    client.popup_display(popup.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_020;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

