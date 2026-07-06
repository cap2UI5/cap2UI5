const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_321 extends z2ui5_if_app {
  mv_quantity = ``;

  async main(client) {
    if (client.check_on_navigated()) {
      const view = z2ui5_cl_xml_view.factory();
      client.view_display(view.shell().page({ title: `abap2UI5 - Navigation with app state`, navbuttonpress: client._event(`BACK`), shownavbutton: client.check_app_prev_stack() }).simple_form({ title: `Form Title`, editable: true }).content(`form`).title(`Input`).label(`quantity`).input(client._bind_edit(this.mv_quantity)).button({ text: `post with state`, press: client._event(`BUTTON_POST`) }).stringify());
    }
    switch (client.get().EVENT) {
      case `BUTTON_POST`:
        client.message_toast_display(`data updated`);
        client.set_app_state_active();
        break;
      case `BACK`:
        client.nav_app_leave();
        break;
    }
  }
}

module.exports = z2ui5_cl_demo_app_321;
