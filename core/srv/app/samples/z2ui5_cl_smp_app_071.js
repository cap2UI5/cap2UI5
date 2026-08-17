const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_071 extends z2ui5_if_app {
  set_size_limit = 100;
  combo_number = 105;
  t_combo = [];
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.combo_fill();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event(`UPDATE`)) {
      client.follow_up_action(z2ui5_if_client.cs_event.set_size_limit, [(this.set_size_limit), client.cs_view.main]);
      client.message_toast_display(`SizeLimitUpdated`);
    } else if (client.check_on_event(`UPDATE_MODEL`)) {
      this.combo_fill();
      client.message_toast_display(`update number of entries`);
    }
  }

  combo_fill() {
    this.t_combo = {};
    for (let sy_index = 1; sy_index <= this.combo_number; sy_index++) {
      this.t_combo.push(z2ui5_cl_util.abap_copy({ key: sy_index, text: sy_index }));
    }
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
      .a({ n: `title`, v: `abap2UI5 - Binding - Model setSizeLimit for Large Tables` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A ComboBox bound to a large internal table: adjust the model's setSizeLimit to ` + `control how many of the entries the control actually renders.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Set Size Limit` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `setSizeLimit` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.set_size_limit) })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`UPDATE`) })
      .a({ n: `text`, v: `update size limit` })
      .tag(`Label`)
      .a({ n: `text`, v: `Number of Entries` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.combo_number) })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`UPDATE_MODEL`) })
      .a({ n: `text`, v: `update number entries` })
      .tag(`Label`)
      .a({ n: `text`, v: `demo` })
      .ele(`ComboBox`)
      .a({ n: `items`, v: this.client._bind(this.t_combo) })
      .tag({ n: `Item`, ns: `core` })
      .a({ n: `key`, v: `{KEY}` })
      .a({ n: `text`, v: `{TEXT}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_071;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_if_client = require("abap2UI5/z2ui5_if_client");

