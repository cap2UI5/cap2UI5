const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_026 extends z2ui5_if_app {
  product = ``;
  quantity = ``;
  placement = ``;
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.placement = `Left`;
      this.product = `tomato`;
      this.quantity = `500`;
      this.view_display();
    } else if (client.check_on_event(`POPOVER`)) {
      this.popover_display({ id: `TEST` });
    } else if (client.check_on_event(`BUTTON_CONFIRM`)) {
      client.message_toast_display(`confirm`);
      client.popover_destroy();
    } else if (client.check_on_event(`BUTTON_CANCEL`)) {
      client.message_toast_display(`cancel`);
      client.popover_destroy();
    }
  }

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.popover({ title: `Popover Title`, placement: this.placement })
      .footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Cancel`, press: this.client._event(`BUTTON_CANCEL`) })
      .button({ text: `Confirm`, press: this.client._event(`BUTTON_CONFIRM`), type: `Emphasized` })
      .get_parent()
      .get_parent()
      .text(`make an input here:`)
      .input(`abcd`);
    this.client.popover_display(view.stringify(), id);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    view.shell()
      .page({ title: `abap2UI5 - Popover Examples`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() })
      .simple_form(`Popover`)
      .content(`form`)
      .title(`Input`)
      .label(`Link`)
      .link({ text: `Documentation UI5 Popover Control`, href: `https://openui5.hana.ondemand.com/entity/sap.m.Popover` })
      .label(`placement`)
      .segmented_button(this.client._bind_edit(this.placement))
      .items()
      .segmented_button_item({ key: `Left`, icon: `sap-icon://add-favorite`, text: `Left` })
      .segmented_button_item({ key: `Top`, icon: `sap-icon://accept`, text: `Top` })
      .segmented_button_item({ key: `Bottom`, icon: `sap-icon://accept`, text: `Bottom` })
      .segmented_button_item({ key: `Right`, icon: `sap-icon://attachment`, text: `Right` })
      .get_parent()
      .get_parent()
      .label(`popover`)
      .button({ text: `show`, press: this.client._event(`POPOVER`), id: `TEST` })
      .button({ text: `cancel`, press: this.client._event(`POPOVER`) })
      .button({ text: `post`, press: this.client._event(`POPOVER`) });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_026;
