const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_472 extends z2ui5_if_app {
  block_navigation = false;
  last_press = ``;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.block_navigation = true;
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get_event()) {
      case `LINK_PRESS`:
        if ((this.block_navigation === true || this.block_navigation === `X`)) {
          this.last_press = `Link pressed - the browser did NOT follow the href, the backend decides what happens.`;
        } else {
          this.last_press = `Link pressed - the href was followed by the browser as usual.`;
        }
        break;
      case `TOGGLE`:
        this.view_display();
        break;
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
      .a({ n: `title`, v: `abap2UI5 - Event - Link with preventDefault` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `A sap.m.Link normally follows its href when pressed. Registered with ` + `s_ctrl-check_prevent_default the event cancels that built-in default ` + `(oEvent.preventDefault()) before the roundtrip - the event still reaches the ` + `backend, so the app decides what happens instead. Flip the switch to compare.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const form = page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Link with a cancelled default` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Cancel the browser navigation` })
      .tag(`Switch`)
      .a({ n: `state`, v: this.client._bind(this.block_navigation) })
      .a({ n: `change`, v: this.client._event(`TOGGLE`) })
      .tag(`Label`)
      .a({ n: `text`, v: `Link` })
      .tag(`Link`)
      .a({ n: `text`, v: `Open abap2ui5.org` })
      .a({ n: `target`, v: `_blank` })
      .a({ n: `href`, v: `https://abap2ui5.org` })
      .a({ n: `press`, v: this.client._event(`LINK_PRESS`, undefined, { check_prevent_default: this.block_navigation }) })
      .tag(`Label`)
      .a({ n: `text`, v: `Result` })
      .tag(`Text`)
      .a({ n: `text`, v: this.client._bind(this.last_press) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_472;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

