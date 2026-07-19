const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_065 extends z2ui5_if_app {
  mv_input_main = ``;
  mv_input_nest = ``;
  mv_count = 0;

  async main(client) {
    const lo_view = z2ui5_cl_xml_view.factory();
    const page = lo_view.shell()
      .page({ title: `Main View`, id: `test`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() })
      .header_content()
      .link()
      .get_parent();
    page.message_strip({ text: `A main view with a nested view inside: the buttons re-render everything, only the ` + `main view, only the nested view, or refresh just the nested view's model.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.content()
      .button({ text: `Rerender all`, press: client._event(`ALL`) })
      .button({ text: `Rerender Main without nest`, press: client._event(`MAIN`) })
      .button({ text: `Rerender only nested view`, press: client._event(`NEST`) })
      .button({ text: `Update only nested MODEL (nest_view_model_update)`, press: client._event(`NEST_MODEL`) })
      .input(client._bind_edit(this.mv_input_main));
    const lo_view_nested = z2ui5_cl_xml_view.factory()
      .page(`Nested View`)
      .button({ text: `event`, press: client._event(`TEST`) })
      .input(client._bind_edit(this.mv_input_nest));
    if (client.check_on_init()) {
      client.view_display(lo_view.stringify());
    }
    switch (client.get().EVENT) {
      case `TEST`:
        client.message_box_display(`input ${this.mv_input_nest}`);
        break;
      case `ALL`:
        client.view_display(lo_view.stringify());
        client.nest_view_display(lo_view_nested.stringify(), `test`, `addContent`);
        break;
      case `MAIN`:
        client.view_display(lo_view.stringify());
        break;
      case `NEST`:
        client.nest_view_display(lo_view_nested.stringify(), `test`, `addContent`);
        break;
      case `NEST_MODEL`:
        this.mv_count = this.mv_count + 1;
        this.mv_input_nest = `nest model updated #${this.mv_count}`;
        client.nest_view_model_update();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_065;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

