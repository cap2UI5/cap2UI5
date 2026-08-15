const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_112 extends z2ui5_if_app {
  view_parent = null;
  mv_class_2 = ``;
  mr_data = null;
  t_items = [];
  client = null;

  view_display(_args = {}) {
    let { xml } = _args;
    this.t_items = z2ui5_cl_util.abap_tab_assign(this.t_items, [{ product: `Notebook 17"`, info: `in stock` }, { product: `Monitor 27"`, info: `2 weeks` }, { product: `Dock Pro`, info: `sold out` }]);
    this.view_parent.tag(`MessageStrip`)
      .a({ n: `text`, v: `SUB-APP CLASS 2 (z2ui5_cl_smp_app_112): an orange LIST - a different class ` + `with different controls and its own data, embedded into the same detail ` + `column of the parent app.` })
      .a({ n: `type`, v: `Warning` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    this.view_parent.ele(`List`)
      .a({ n: `headerText`, v: `Class 2 - Products` })
      .a({ n: `items`, v: this.client._bind(this.t_items) })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{PRODUCT}` })
      .a({ n: `info`, v: `{INFO}` });
    this.view_parent.ele(`VBox`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`Input`)
      .a({ n: `placeholder`, v: `type here - the value lives in sub-app 2` })
      .a({ n: `value`, v: this.client._bind(this.mv_class_2) })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`MESSAGE_SUB`) })
      .a({ n: `text`, v: `raise event in sub-app 2` })
      .a({ n: `icon`, v: `sap-icon://table-view` });
    Object.assign(_args, { xml });
  }

  on_event() {
    if (this.client.check_on_event(`MESSAGE_SUB`)) {
      this.client.message_box_display(`event raised in SUB-APP CLASS 2 (the list)`);
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

module.exports = z2ui5_cl_smp_app_112;

const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

