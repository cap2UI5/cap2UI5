const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_202_0 extends z2ui5_if_app {
  av_next = `Step22`;

  view_display({ client } = {}) {
    let lr_view = z2ui5_cl_xml_view.factory();
    lr_view._generic({ name: `script`, ns: `html` })
      ._cc_plain_xml(`z2ui5.decideNextStep = (stepId, nextStepId) => {debugger;` + ` ` + ` var wiz = z2ui5.oView.byId('wiz');` + ` ` + ` wiz.discardProgress(z2ui5.oView.byId(stepId));` + ` ` + ` var step = z2ui5.oView.byId(stepId);` + ` ` + ` var nextStep = z2ui5.oView.byId(nextStepId);` + ` ` + ` step.setNextStep(nextStep);` + ` ` + `}`);
    lr_view = lr_view.shell()
      .page({ id: `page_main`, title: `abap2UI5 - Demo Wizard Control`, navbuttonpress: client._event_nav_app_leave(), shownavbutton: client.check_app_prev_stack() });
    const lr_wizard = lr_view.wizard({ id: `wiz`, enablebranching: true });
    const lr_wiz_step1 = lr_wizard.wizard_step({ title: `STEP1`, validated: true, nextstep: `STEP2` });
    lr_wiz_step1.message_strip(`STEP1`);
    const lr_wiz_step2 = lr_wizard.wizard_step({ id: `STEP2`, title: `STEP2`, validated: true, subsequentsteps: `STEP22, STEP23` });
    lr_wiz_step2.message_strip(`STEP2`);
    lr_wiz_step2.button({ text: `Press Step 2.2`, press: client._event(`STEP22`) });
    lr_wiz_step2.button({ text: `Press Step 2.3`, press: client._event(`STEP23`) });
    const lr_wiz_step22 = lr_wizard.wizard_step({ id: `STEP22`, title: `STEP2.2`, validated: true });
    lr_wiz_step22.message_strip(`STEP22`);
    const lr_wiz_step23 = lr_wizard.wizard_step({ id: `STEP23`, title: `STEP2.3`, validated: true });
    lr_wiz_step23.message_strip(`STEP23`);
    const lr_wiz_step3 = lr_wizard.wizard_step({ title: `STEP3`, validated: true });
    lr_wiz_step3.message_strip(`STEP3`);
    client.view_display(lr_view.stringify());
  }

  async main(client) {
    if (client.check_on_init()) {
      this.view_display({ client: client });
      return;
    }
    switch (client.get().EVENT) {
      case `STEP22`:
        client.follow_up_action(`z2ui5.decideNextStep(\`STEP2\`,\`STEP22\`);`);
        break;
      case `STEP23`:
        client.follow_up_action(`z2ui5.decideNextStep(\`STEP2\`,\`STEP23\`);`);
        break;
    }
    client.view_model_update();
  }
}

module.exports = z2ui5_cl_demo_app_202_0;
