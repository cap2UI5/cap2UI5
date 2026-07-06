const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_305 extends z2ui5_if_app {
  t_tab = [];
  client = null;

  set_view() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Tables and cell colors`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page._generic({ name: `style`, ns: `html` })
      ._cc_plain_xml(`td:has([data-color="red"]){ ` + ` background-color: red;` + `}` + `` + `td:has([data-color="green"]){` + ` background-color: green;` + `}` + `` + `td:has([data-color="blue"]){` + ` background-color: blue;` + `}` + `` + `td:has([data-color="orange"]){` + ` background-color: orange;` + `}` + `` + `td:has([data-color="grey"]){` + ` background-color: grey;` + `}` + `` + `td:has([data-color="yellow"]){` + ` background-color: yellow;` + `}`);
    const tab = page.table({ items: this.client._bind_edit(this.t_tab), mode: `MultiSelect` })
      .header_toolbar()
      .overflow_toolbar()
      .title(`change cell color`)
      .get_parent()
      .get_parent();
    tab.columns().column().text(`Title`).get_parent().column().text(`Color`).get_parent();
    tab.items()
      .column_list_item()
      .cells()
      .text(`{TITLE}`)
      .get()
      .custom_data()
      .core_custom_data({ key: `color`, value: `{VALUE}`, writetodom: true })
      .get_parent()
      .get_parent()
      .input({ value: `{VALUE}`, enabled: true });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.t_tab = [{ title: `entry 01`, value: `red` }, { title: `entry 02`, value: `blue` }, { title: `entry 03`, value: `green` }, { title: `entry 04`, value: `yellow` }, { title: `entry 05`, value: `orange` }, { title: `entry 06`, value: `grey` }];
      this.set_view();
    }
  }
}

module.exports = z2ui5_cl_demo_app_305;
