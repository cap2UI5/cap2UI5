// TODO(abap2js): unresolved reference z2ui5_cl_ajson_mapping — add require manually
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_153 extends z2ui5_if_app {
  ms_struc = {};
  ms_struc2 = {};
  client = null;

  view_display() {
    this.client._bind_edit({ val: this.ms_struc, custom_mapper: z2ui5_cl_ajson_mapping.create_camel_case({ iv_first_json_upper: false }), custom_mapper_back: z2ui5_cl_ajson_mapping.create_to_snake_case() });
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Binding`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .button({ text: `Rountrip...`, press: this.client._event(`POPUP`) });
    this.client.view_display(view.stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `POPUP`:
        if (this.ms_struc !== this.ms_struc2) {
          this.client.message_box_display(`structure changed error`);
          return;
        }
        this.client.message_toast_display(`everything works as expected`);
        break;
    }
  }

  async main(client) {
    this.client = client;
    if (client.check_on_navigated()) {
      this.ms_struc.data.labels = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`];
      let ls_dataset = {};
      ls_dataset = {};
      ls_dataset.label = `Fully Rounded`;
      ls_dataset.border_width = 2;
      ls_dataset.border_radius = 200;
      ls_dataset.data = [`1`, `-12`, `19`, `3`, `5`, `-2`, `3`];
      this.ms_struc.data.datasets.push(ls_dataset);
      this.ms_struc2 = this.ms_struc;
      this.view_display();
      return;
    }
    this.on_event();
  }
}

module.exports = z2ui5_cl_demo_app_153;
