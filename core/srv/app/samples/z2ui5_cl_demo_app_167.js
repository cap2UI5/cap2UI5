const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_167 extends z2ui5_if_app {
  mv_value = ``;
  client = null;

  set_view() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Event with add Information and t_arg`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `This sample shows how to pass extra arguments to an event via t_arg - fixed ` + `values, model values, or client-side expressions - and read them in the backend.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.link({ text: `More Infos..`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/topic/b0fb4de7364f4bcbb053a99aa645affe` });
    page.button({ text: `EVENT_FIX_VAL`, press: this.client._event(`EVENT_FIX_VAL`, [`FIX_VAL`]) });
    page.input(this.client._bind_edit(this.mv_value));
    page.button({ text: `EVENT_MODEL_VALUE`, press: this.client._event(`EVENT_MODEL_VALUE`, [`$` + this.client._bind_edit(this.mv_value)]) });
    page.button({ text: `SOURCE_PROPERTY_TEXT`, press: this.client._event(`SOURCE_PROPERTY_TEXT`, [`\${$source>/text}`]) });
    page.input({ description: `make an input and press enter - `, submit: this.client._event(`EVENT_PROPERTY_VALUE`, [`\${$parameters>/value}`]) });
    page.button({ text: `PARENT_PROPERTY_ID`, press: this.client._event(`PARENT_PROPERTY_ID`, [`$event.oSource.oParent.sId`]) });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.mv_value = `my value`;
      this.set_view();
    }
    switch (client.get().EVENT) {
      case `EVENT_FIX_VAL`:
      case `EVENT_MODEL_VALUE`:
      case `SOURCE_PROPERTY_TEXT`:
      case `EVENT_PROPERTY_VALUE`:
      case `PARENT_PROPERTY_ID`:
        client.message_box_display(`backend event: ${client.get_event_arg()}`);
        break;
    }
    client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_167;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

