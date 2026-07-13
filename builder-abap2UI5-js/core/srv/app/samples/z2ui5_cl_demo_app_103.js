const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_103 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
      return;
    }
  }

  view_display() {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `abap2UI5 - Side Panel Example`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.header_content().link();
    page.responsive_splitter({ defaultpane: `default` })
      .pane_container()
      .split_pane({ requiredparentwidth: `400`, id: `default` })
      .layout_data(`layout`)
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .panel({ headertext: `first pane` })
      .get_parent()
      .get_parent()
      .pane_container({ orientation: `Vertical` })
      .split_pane({ requiredparentwidth: `600` })
      .layout_data(`layout`)
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .panel({ headertext: `second pane` })
      .get_parent()
      .get_parent()
      .split_pane({ requiredparentwidth: `800` })
      .layout_data(`layout`)
      .splitter_layout_data({ size: `auto` })
      .get_parent()
      .get_parent()
      .panel({ headertext: `second pane` });
    this.client.view_display(page.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_103;
