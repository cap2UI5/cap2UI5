const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_279 extends z2ui5_if_app {
  text_input = ``;
  dirty = false;
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

  view_display() {
    const page = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:tnt`, v: `sap.tnt` })
      .a({ n: `xmlns:z2ui5`, v: `z2ui5.cc` })
      .ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - Navigation - Data Loss Protection on Leaving` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event(`BACK`) });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Unsaved input marks the page dirty via a custom control; navigating back then opens a confirmation ` + `popup instead of leaving and losing the data.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const box = page.ele(`FlexBox`)
      .a({ n: `class`, v: `sapUiTinyMargin` })
      .a({ n: `alignItems`, v: `Start` })
      .a({ n: `direction`, v: `Row` });
    box.tag(`Input`)
      .a({ n: `id`, v: `input` })
      .a({ n: `placeholder`, v: `Enter data, submit and navigate back to trigger data loss protection` })
      .a({ n: `value`, v: this.client._bind(this.text_input) })
      .a({ n: `submit`, v: this.client._event(`SUBMIT`) })
      .a({ n: `width`, v: `40rem` });
    box.ele({ n: `InfoLabel`, ns: `tnt` })
      .a({ n: `class`, v: `sapUiSmallMarginBegin sapUiTinyMarginTop` })
      .a({ n: `text`, v: `dirty` })
      .a({ n: `colorScheme`, v: `8` })
      .a({ n: `visible`, v: this.client._bind(this.dirty) });
    box.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`RESET`) })
      .a({ n: `text`, v: `Reset` })
      .a({ n: `visible`, v: this.client._bind(this.dirty) })
      .a({ n: `class`, v: `sapUiSmallMarginBegin` });
    page.tag({ n: `Dirty`, ns: `z2ui5` });
    this.client.view_display(page.stringify());
    this.client.follow_up_action(z2ui5_if_client.cs_event.set_focus, [`input`]);
  }

  on_event() {
    switch (this.client.get_event()) {
      case `BACK`:
        if ((this.dirty === true || this.dirty === `X`)) {
          this.popup_confirm_display();
        } else {
          this.client.nav_app_leave();
        }
        break;
      case `POPUP_LEAVE`:
        this.client.popup_destroy();
        this.dirty = {};
        this.client.nav_app_leave();
        break;
      case `POPUP_CANCEL`:
        this.client.popup_destroy();
        break;
      case `SUBMIT`:
        this.dirty = (!z2ui5_cl_util.abap_is_initial(this.text_input));
        break;
      case `RESET`:
        this.dirty = {};
        this.text_input = {};
        break;
    }
  }

  popup_confirm_display() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:tnt`, v: `sap.tnt` });
    popup.ele(`Dialog`)
      .a({ n: `title`, v: `Warning` })
      .a({ n: `icon`, v: `sap-icon://status-critical` })
      .ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Text`)
      .a({ n: `text`, v: `Your entries will be lost when you leave this page.` })
      .end()
      .ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPUP_CANCEL`) })
      .a({ n: `text`, v: `Cancel` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPUP_LEAVE`) })
      .a({ n: `text`, v: `Leave Page` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_279;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

