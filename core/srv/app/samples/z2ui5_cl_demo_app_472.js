const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_472 extends z2ui5_if_app {
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
    switch (this.client.get().EVENT) {
      case `LINK_PRESS`:
        if ((this.block_navigation === true || this.block_navigation === `X`)) {
          this.last_press = `Link pressed - the browser did NOT follow the href, the backend decides what happens.`;
        } else {
          this.last_press = `Link pressed - the href was followed by the browser as usual.`;
        }
        this.client.view_model_update();
        break;
      case `TOGGLE`:
        this.view_display();
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Event with preventDefault`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `A sap.m.Link normally follows its href when pressed. Registered with ` + `s_ctrl-check_prevent_default the event cancels that built-in default ` + `(oEvent.preventDefault()) before the roundtrip - the event still reaches the ` + `backend, so the app decides what happens instead. Flip the switch to compare.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    const form = page.simple_form({ title: `Link with a cancelled default`, editable: true }).content(`form`);
    form.label(`Cancel the browser navigation`)
      .switch({ state: this.client._bind_edit(this.block_navigation), change: this.client._event(`TOGGLE`) })
      .label(`Link`)
      .link({ text: `Open abap2ui5.org`, href: `https://abap2ui5.org`, target: `_blank`, press: this.client._event(`LINK_PRESS`, undefined, { check_prevent_default: this.block_navigation }) })
      .label(`Result`)
      .text(this.client._bind_edit(this.last_press));
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_472;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

