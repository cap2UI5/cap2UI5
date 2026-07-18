const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_166 extends z2ui5_if_app {
  ms_struc = { title: ``, value: ``, value2: `` };
  ms_struc2 = {  };
  client = null;

  set_view() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Binding Structure Level`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.input(this.client._bind_edit(this.ms_struc.title, { name: `ms_struc-title` }));
    page.input(this.client._bind_edit(this.ms_struc.value, { name: `ms_struc-value` }));
    page.input(this.client._bind_edit(this.ms_struc.value2, { name: `ms_struc-value2` }));
    page.input(this.client._bind_edit(this.ms_struc2.title, { name: `ms_struc2-title` }));
    page.input(this.client._bind_edit(this.ms_struc2.value, { name: `ms_struc2-value` }));
    page.input(this.client._bind_edit(this.ms_struc2.value2, { name: `ms_struc2-value2` }));
    page.input(this.client._bind_edit(this.ms_struc2.incl_title, { name: `ms_struc2-incl_title` }));
    page.input(this.client._bind_edit(this.ms_struc2.incl_value, { name: `ms_struc2-incl_value` }));
    page.input(this.client._bind_edit(this.ms_struc2.incl_value2, { name: `ms_struc2-incl_value2` }));
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.ms_struc.title = `title`;
      this.ms_struc.value = `val01`;
      this.ms_struc.value2 = `val02`;
      this.ms_struc2.title = `title`;
      this.ms_struc2.value = `val01`;
      this.ms_struc2.value2 = `val02`;
      this.ms_struc2.incl_title = `title_incl`;
      this.ms_struc2.incl_value = `val01_incl`;
      this.ms_struc2.incl_value2 = `val02_incl`;
      this.set_view();
    }
    client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_166;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

