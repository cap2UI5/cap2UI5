const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_109 extends z2ui5_if_app {
  product = ``;
  quantity = ``;
  mv_placement = ``;
  client = null;

  popover_display({ id } = {}) {
    const view = z2ui5_cl_xml_view.factory_popup();
    view.quick_view({ placement: this.mv_placement })
      .quick_view_page({ pageid: `employeePageId`, header: `Employee Info`, title: `choper725`, titleurl: `https://github.com/abap2UI5/abap2UI5`, description: `Enjoy` })
      .quick_view_group({ heading: `Contact Details` })
      .quick_view_group_element({ label: `Mobile`, value: `123-456-789`, type: `mobile` })
      .get_parent()
      .quick_view_group_element({ label: `Phone`, value: `789-456-123`, type: `phone` })
      .get_parent()
      .quick_view_group_element({ label: `Email`, value: `thisisemail@email.com`, emailsubject: `Subject`, type: `email` })
      .get_parent()
      .get_parent()
      .quick_view_group({ heading: `Company` })
      .quick_view_group_element({ label: `Name`, value: `Adventure Company`, url: `https://github.com/abap2UI5/abap2UI5`, type: `link` })
      .get_parent()
      .quick_view_group_element({ label: `Address`, value: `Here"` })
      .get_parent();
    this.client.popover_display(view.stringify(), id);
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Popover Quickview Examples`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `Opens a QuickView popover, a compact contact card with grouped fields and links, ` + `anchored to a button; the segmented button sets its placement.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    page.simple_form(`QuickView Popover`)
      .content(`form`)
      .title(`QuickView Popover`)
      .label(`placement`)
      .segmented_button(this.client._bind_edit(this.mv_placement))
      .items()
      .segmented_button_item({ key: `Left`, icon: `sap-icon://add-favorite`, text: `Left` })
      .segmented_button_item({ key: `Top`, icon: `sap-icon://accept`, text: `Top` })
      .segmented_button_item({ key: `Bottom`, icon: `sap-icon://accept`, text: `Bottom` })
      .segmented_button_item({ key: `Right`, icon: `sap-icon://attachment`, text: `Right` })
      .get_parent()
      .get_parent()
      .label(`popover`)
      .button({ text: `show`, press: this.client._event(`POPOVER`), id: `TEST`, width: `10rem` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `CLOSE_POPOVER`:
        this.client.popover_destroy();
        break;
      case `POPOVER`:
        this.popover_display({ id: `TEST` });
        break;
      case `BUTTON_CONFIRM`:
        this.client.message_toast_display(`confirm`);
        this.client.popover_destroy();
        break;
      case `BUTTON_CANCEL`:
        this.client.message_toast_display(`cancel`);
        this.client.popover_destroy();
        break;
    }
  }

  on_init() {
    this.mv_placement = `Left`;
    this.product = `tomato`;
    this.quantity = `500`;
  }
}

module.exports = z2ui5_cl_demo_app_109;

const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");

