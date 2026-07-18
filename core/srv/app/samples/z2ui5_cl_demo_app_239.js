const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_239 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Check Box`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.m.CheckBox/sample/sap.m.sample.CheckBox` });
    const layout = page.vbox()
      .checkbox()
      .checkbox({ text: `Option a`, selected: true })
      .checkbox({ text: `Option b` })
      .checkbox({ text: `Option c`, selected: true })
      .checkbox({ text: `Option d` })
      .checkbox({ text: `Option e`, enabled: false })
      .checkbox({ text: `Option partially selected`, selected: true, partiallyselected: true })
      .checkbox({ text: `Required option`, required: true })
      .checkbox({ text: `Warning`, valuestate: `Warning` })
      .checkbox({ text: `Warning disabled`, valuestate: `Warning`, enabled: false, selected: true })
      .checkbox({ text: `Error`, valuestate: `Error` })
      .checkbox({ text: `Error disabled`, valuestate: `Error`, enabled: false, selected: true })
      .checkbox({ text: `Information`, valuestate: `Information` })
      .checkbox({ text: `Information disabled`, valuestate: `Information`, enabled: false, selected: true })
      .checkbox({ text: `Checkbox with wrapping='true' and long text`, wrapping: true, width: `150px` });
    layout.simple_form({ editable: true, layout: `ResponsiveGridLayout`, labelspanl: `4`, labelspanm: `4` })
      .content(`form`)
      .label(`Clearing with Customer`)
      .checkbox({ text: `Option` })
      .checkbox({ text: `Option 2`, selected: true })
      .get()
      .layout_data()
      .grid_data({ linebreak: true, indentl: `4`, indentm: `4` })
      .get_parent()
      .get_parent()
      .checkbox({ id: `focusMe`, text: `Option 3` })
      .get()
      .layout_data()
      .grid_data({ linebreak: true, indentl: `4`, indentm: `4` })
      .get_parent()
      .get_parent()
      .checkbox({ text: `Checkbox with wrapping='true' and long text placed in a form`, wrapping: true, width: `200px` })
      .get()
      .layout_data()
      .grid_data({ linebreak: true, indentl: `4`, indentm: `4` });
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `hint_icon` });
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Checkboxes allow users to select a subset of options. If you want to offer an off/on setting you should use the Switch control instead.` });
    this.client.popover_display(view.stringify(), id);
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display({ client: client });
    }
    this.on_event({ client: client });
  }
}

module.exports = z2ui5_cl_demo_app_239;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

