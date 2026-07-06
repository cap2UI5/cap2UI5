const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_175 extends z2ui5_if_app {
  async main(client) {
    this.view_display({ client: client });
  }

  view_display({ client } = {}) {
    let lr_view = z2ui5_cl_xml_view.factory();
    lr_view = lr_view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Demo Wizard Control`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const lr_wizard = lr_view.wizard();
    const lr_wiz_step1 = lr_wizard.wizard_step({ title: `Step1`, validated: true });
    lr_wiz_step1.message_strip(`STEP1`);
    const lr_wiz_step2 = lr_wizard.wizard_step({ title: `Step2`, validated: true });
    lr_wiz_step2.message_strip(`STEP2`);
    const lr_wiz_step3 = lr_wizard.wizard_step({ title: `Step3`, validated: true });
    lr_wiz_step3.message_strip(`STEP3`);
    const lr_wiz_step4 = lr_wizard.wizard_step({ title: `Step4`, validated: true });
    lr_wiz_step4.message_strip(`STEP4`);
    client.view_display(lr_view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_175;
