const z2ui5_cl_demo_app_333 = require("./z2ui5_cl_demo_app_333");
const z2ui5_cl_demo_app_336 = require("./z2ui5_cl_demo_app_336");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_335 extends z2ui5_if_app {
  ms_struc = [];
  mo_layout_obj = null;
  mo_layout_obj_2 = null;

  async main(client) {
    // TODO(abap2js): FIELD-SYMBOLS <row> TYPE z2ui5_t_01.
    if (client.check_on_init()) {
      this.get_data();
      this.mo_layout_obj = z2ui5_cl_demo_app_333.factory({ i_data: (this.ms_struc), vis_cols: 3 });
      this.mo_layout_obj_2 = z2ui5_cl_demo_app_333.factory({ i_data: (this.ms_struc), vis_cols: 3 });
      this.view_display({ client: client });
    }
    switch (client.get().EVENT) {
      case `GO`:
        const app = z2ui5_cl_demo_app_336.factory();
        client.nav_app_call(app);
        break;
      case `CHANGE`:
        this.get_data_2();
        break;
    }
    if (client.get().CHECK_ON_NAVIGATED === true && client.check_on_init() === false) {
      this.view_display({ client: client });
    }
    if (!this.ms_struc) {
      client.message_toast_display(`ERROR - MS_STRUC is initial!`);
    }
    if (this.mo_layout_obj.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data is not bound!`);
    }
    if (this.mo_layout_obj_2.mr_data != null) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data is not bound!`);
    }
    // TODO(abap2js): ASSIGN mo_layout_obj_2->mr_data->* TO <row>.
    if (row.id !== this.ms_struc.id) {
      client.message_toast_display(`ERROR - mo_layout_obj_2->mr_data->id does not match ms_struc-id!`);
    }
    // TODO(abap2js): ASSIGN mo_layout_obj->mr_data->* TO <row>.
    if (row.id !== this.ms_struc.id) {
      client.message_toast_display(`ERROR - mo_layout_obj->mr_data->id does not match ms_struc-id!`);
    }
    client.view_model_update();
  }

  view_display({ client } = {}) {
    let sy_tabix = 0;
    const page = z2ui5_cl_xml_view.factory()
      .shell()
      .page({ title: `RTTI IV`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    page.button({ text: `CALL Next App`, press: client._event(`GO`), type: `Success` });
    page.button({ text: `Change Data`, press: client._event(`CHANGE`), type: `Success` });
    const form = page.simple_form({ editable: true, layout: `ResponsiveGridLayout`, adjustlabelspan: true })
      .content(`form`);
    let index = 0;
    sy_tabix = 0;
    for (const layout of this.mo_layout_obj.ms_data.t_layout) {
      sy_tabix++;
      index = index + 1;
      // TODO(abap2js): ASSIGN mo_layout_obj->mr_data->* TO FIELD-SYMBOL(<val>).
      // TODO(abap2js): ASSIGN COMPONENT layout->name OF STRUCTURE <val> TO FIELD-SYMBOL(<value>).
      if (sy_subrc !== 0) {
        return;
      }
      const line = form.label({ wrapping: false, text: layout.name });
      line.input({ value: client._bind(value), visible: client._bind({ val: layout.visible, tab: this.mo_layout_obj.ms_data.t_layout, tab_index: index }), enabled: false });
    }
    client.view_display(page.stringify());
  }

  get_data() {
    // TODO(abap2js): SELECT SINGLE * FROM z2ui5_t_01 INTO CORRESPONDING FIELDS OF @ms_struc.
  }

  get_data_2() {
    // TODO(abap2js): SELECT SINGLE * FROM z2ui5_t_01 WHERE id <> @ms_struc-id INTO CORRESPONDING FIELDS OF @ms_struc.
  }
}

module.exports = z2ui5_cl_demo_app_335;
