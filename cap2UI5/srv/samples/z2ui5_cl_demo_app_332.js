const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_332 extends z2ui5_if_app {
  ms_struc = [];
  mo_table_obj = null;

  async main(client) {
    if (client.check_on_init()) {
      this.get_data();
      this.mo_table_obj = z2ui5_cl_demo_app_333.factory({ i_data: (this.ms_struc), vis_cols: 3 });
      this.view_display({ client: client });
    }
    if (!this.ms_struc) {
      client.message_toast_display(`ERROR - MS_STRUC is initial!`);
    }
    client.view_model_update();
  }

  view_display({ client } = {}) {
    let sy_tabix = 0;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `GO`, press: client._event(`GO`), type: `Success` });
    const form = page.simple_form({ editable: true, layout: `ResponsiveGridLayout`, adjustlabelspan: true })
      .content(`form`);
    let index = 0;
    sy_tabix = 0;
    for (const layout of this.mo_table_obj.ms_data.t_layout) {
      sy_tabix++;
      index = index + 1;
      // TODO(abap2js): ASSIGN mo_table_obj->mr_data->* TO FIELD-SYMBOL(<val>).
      // TODO(abap2js): ASSIGN COMPONENT layout->name OF STRUCTURE <val> TO FIELD-SYMBOL(<value>).
      if (sy_subrc !== 0) {
        return;
      }
      const line = form.label({ wrapping: false, text: layout.name });
      line.input({ value: client._bind(value), visible: client._bind({ val: layout.visible, tab: this.mo_table_obj.ms_data.t_layout, tab_index: index }), enabled: false });
    }
    client.view_display(page.stringify());
  }

  get_data() {
    // TODO(abap2js): SELECT SINGLE * FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF @ms_struc.
  }
}

module.exports = z2ui5_cl_demo_app_332;
