const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_336 = require("./z2ui5_cl_demo_app_336");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_348 extends z2ui5_if_app {
  ms_struc = [];
  mo_layout_obj = null;

  async main(client) {
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE z2ui5_t_01.
    if (client.check_on_init()) {
      this.get_data();
      this.mo_layout_obj = z2ui5_cl_demo_app_333.factory({ i_data: (this.ms_struc), vis_cols: 5 });
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `GO`:
        const app = z2ui5_cl_demo_app_336.factory();
        client.nav_app_call(app);
        break;
      case `GET_DATA`:
        this.get_data2();
        break;
    }
    if (client.get().CHECK_ON_NAVIGATED === true && client.check_on_init() === false) {
      this.view_display({ client: client });
    }
    if (this.mo_layout_obj.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data is not bound!`);
    }
    if (!this.ms_struc) {
      client.message_toast_display(`ERROR - ms_struc is initial!`);
    }
    // TODO(abap2js): ASSIGN mo_layout_obj->mr_data->* TO <row>.
    if (row !== this.ms_struc) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data->* <> ms_struc!`);
    }
    client.view_model_update();
  }

  view_display({ client } = {}) {
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `CALL Next App`, press: client._event(`GO`), type: `Success` });
    page.button({ text: `Read from DB`, press: client._event(`GET_DATA`), type: `Success` });
    this.xml_form({ i_data: (this.ms_struc), i_page: page, i_client: client });
    this.xml_form({ i_data: this.mo_layout_obj.mr_data, i_page: page, i_client: client });
    client.view_display(page.stringify());
  }

  get_data() {
    // TODO(abap2js): SELECT SINGLE id, id_prev, id_prev_app, id_prev_app_stack, timestampl FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF @ms_struc.
  }

  get_data2() {
    // TODO(abap2js): SELECT SINGLE id, id_prev, id_prev_app, id_prev_app_stack, timestampl FROM z2ui5_t_01 WHERE id <> @ms_struc-id INTO CORRESPONDING FIELDS OF @ms_struc.
  }

  xml_form({ i_data, i_page, i_client } = {}) {
    // TODO(abap2js): FIELD-SYMBOLS <layout> TYPE z2ui5_cl_demo_app_333=>ty_s_layout.
    // TODO(abap2js): FIELD-SYMBOLS <data> TYPE any.
    // TODO(abap2js): FIELD-SYMBOLS <value> TYPE any.
    const form = i_page.simple_form({ editable: true, layout: `ResponsiveGridLayout`, adjustlabelspan: true })
      .content(`form`);
    let index = 0;
    let sy_tabix = 0;
    for (const fs of this.mo_layout_obj.ms_data.t_layout) {
      sy_tabix++;
      index = index + 1;
      // TODO(abap2js): ASSIGN i_data->* TO <data>.
      // TODO(abap2js): ASSIGN COMPONENT <layout>-name OF STRUCTURE <data> TO <value>.
      if (sy_subrc !== 0) {
        return;
      }
      const line = form.label({ wrapping: false, text: layout.name });
      line.input({ value: i_client._bind(value), visible: i_client._bind({ val: layout.visible, tab: this.mo_layout_obj.ms_data.t_layout, tab_index: index }), enabled: false });
    }
  }
}

module.exports = z2ui5_cl_demo_app_348;
