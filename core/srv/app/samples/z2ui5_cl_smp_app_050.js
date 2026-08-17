const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_050 extends z2ui5_if_app {
  product = ``;
  quantity = ``;

  async main(client) {
    if (client.check_on_init()) {
      this.product = `tomato`;
      this.quantity = `500`;
    }
    if (client.get_event() === `BUTTON_POST`) {
      client.message_toast_display(`${this.product} ${this.quantity} - send to the server`);
    }
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `View`, ns: `mvc` })
      .a({ n: `displayBlock`, v: `true` })
      .a({ n: `height`, v: `100%` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:mvc`, v: `sap.ui.core.mvc` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const page = view.ele(`Shell`)
      .ele(`Page`)
      .a({ n: `title`, v: `abap2UI5 - CSS - Ship Your Own CSS with the View` })
      .a({ n: `showNavButton`, b: client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `An inline html style element is sent to the frontend with the view, so the sample can restyle ` + `standard UI5 controls - here the inputs are enlarged and the post button turns red.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.tag({ n: `HTML`, ns: `core` }).a({ n: `content`, v: `<style>` + `
` + `.sapMInput \\{` + `
` + `    height: 80px !important;` + `
` + `    font-size: 2.5rem !important;` + `
` + `\\}` + `
` + `
` + `input \\{` + `
` + `    height: 80% !important;` + `
` + `    font-size: 2.5rem !important;` + `
` + `\\}` + `
` + `
` + `input[role="textbox"] \\{` + `
` + `    height: 80px !important;` + `
` + `    font-size: 2.5rem !important;` + `
` + `\\}` + `
` + `
` + `input[role="text"] \\{` + `
` + `    height: 80px !important;` + `
` + `    font-size: 2.5rem !important;` + `
` + `\\}` + `
` + `
` + `.sapUiSearchField \\{` + `
` + `    height: 35px;` + `
` + `    font-size: 2.5rem !important;` + `
` + `\\}` + `
` + `
` + `.sapUiTfCombo:hover \\{` + `
` + `    height: 2rem;` + `
` + `    font-size: 2.5rem !important;` + `
` + `\\}` + `
` + `
` + `.sapMInputBaseInner::placeholder \\{` + `
` + `    font-size: 1.4rem !important;` + `
` + `\\}` + `
` + `</style>` }).tag(`Button`).a({ n: `press`, v: client._event(`BUTTON_POST`) }).a({ n: `text`, v: `post` }).a({ n: `class`, v: `mySuperRedButton` }).tag(`Input`).a({ n: `value`, v: client._bind(this.quantity) }).ele({ n: `SimpleForm`, ns: `form` }).a({ n: `title`, v: `Form Title` }).a({ n: `editable`, b: true }).ele({ n: `content`, ns: `form` }).tag(`Title`).a({ n: `text`, v: `Input` }).tag(`Label`).a({ n: `text`, v: `quantity` }).tag(`Input`).a({ n: `value`, v: client._bind(this.quantity) }).tag(`Label`).a({ n: `text`, v: `product` }).tag(`Input`).a({ n: `enabled`, b: false }).a({ n: `value`, v: this.product }).tag(`Button`).a({ n: `press`, v: client._event(`BUTTON_POST`) }).a({ n: `text`, v: `post` });
    client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_050;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

