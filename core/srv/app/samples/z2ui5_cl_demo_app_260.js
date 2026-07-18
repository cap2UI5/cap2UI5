const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_260 extends z2ui5_if_app {
  client = null;

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Sample: Nested Splitter Layouts - 7 Areas`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.header_content()
      .button({ id: `hint_icon`, icon: `sap-icon://hint`, tooltip: `Sample information`, press: client._event(`POPOVER`) });
    page.header_content()
      .link({ text: `UI5 Demo Kit`, target: `_blank`, href: `https://sapui5.hana.ondemand.com/sdk/#/entity/sap.ui.layout.Splitter/sample/sap.ui.layout.sample.SplitterNested1` });
    const layout = page.splitter({ height: `500px`, orientation: `Vertical` })
      .splitter()
      .get()
      .layout_data(`layout`)
      .splitter_layout_data({ size: `50px` })
      .get_parent()
      .get_parent()
      .content_areas(`layout`)
      .button({ width: `100%`, text: `Content 1` })
      .get()
      .layout_data()
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .splitter()
      .get()
      .layout_data(`layout`)
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .content_areas(`layout`)
      .button({ width: `100%`, text: `Content 2` })
      .get()
      .layout_data()
      .splitter_layout_data({ size: `300px` })
      .get_parent()
      .get_parent()
      .get_parent()
      .splitter({ orientation: `Vertical` })
      .button({ width: `100%`, text: `Content 3` })
      .get()
      .layout_data()
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .get_parent()
      .button({ width: `100%`, text: `Content 4` })
      .get()
      .layout_data()
      .splitter_layout_data({ size: `10%` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .button({ width: `100%`, text: `Content 5` })
      .get()
      .layout_data()
      .splitter_layout_data({ size: `30%`, minsize: `200px` })
      .get_parent()
      .get_parent()
      .get_parent()
      .get_parent()
      .splitter()
      .get()
      .layout_data(`layout`)
      .splitter_layout_data({ size: `50px` })
      .get_parent()
      .get_parent()
      .content_areas(`layout`)
      .button({ width: `100%`, text: `Content 6` })
      .get()
      .layout_data()
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .get_parent()
      .button({ width: `100%`, text: `Content 7` })
      .get()
      .layout_data()
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .get_parent();
    client.view_display(page.stringify());
  }

  on_event({ client } = {}) {
    switch (client.get().EVENT) {
      case `POPOVER`:
        this.popover_display({ id: `hint_icon` });
        break;
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: `Bottom`, width: `auto` })
      .quick_view_page({ pageid: `sampleInformationId`, header: `Sample information`, description: `Nested Splitter example with 7 content areas` });
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

module.exports = z2ui5_cl_demo_app_260;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

