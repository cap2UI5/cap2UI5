const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_105 extends z2ui5_if_app {
  view_parent = null;
  mv_class_1 = ``;
  mr_data = null;
  client = null;

  view_display(_args = {}) {
    let { xml } = _args;
    this.view_parent.tag(`MessageStrip`)
      .a({ n: `text`, v: `SUB-APP CLASS 1 (z2ui5_cl_smp_app_105): a green FORM - it has no page of ` + `its own, its controls are injected into the detail column of the calling ` + `parent app through a shared view reference.` })
      .a({ n: `type`, v: `Success` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const form = this.view_parent.ele(`Panel`)
      .a({ n: `headerText`, v: `Class 1 - Form` })
      .ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Embedded class` })
      .ele(`ObjectStatus`)
      .a({ n: `state`, v: `Success` })
      .a({ n: `text`, v: `z2ui5_cl_smp_app_105` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Input from class 1` })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `type here - the value lives in sub-app 1` })
      .a({ n: `value`, v: this.client._bind(this.mv_class_1) });
    form.tag(`Label`)
      .a({ n: `text`, v: `Event` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`MESSAGE_SUB`) })
      .a({ n: `text`, v: `raise event in sub-app 1` })
      .a({ n: `icon`, v: `sap-icon://form` });
    Object.assign(_args, { xml });
  }

  on_event() {
    if (this.client.check_on_event(`MESSAGE_SUB`)) {
      this.client.message_box_display(`event raised in SUB-APP CLASS 1 (the form)`);
    }
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }
}

module.exports = z2ui5_cl_smp_app_105;

