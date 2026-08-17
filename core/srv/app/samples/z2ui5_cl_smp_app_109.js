const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_109 extends z2ui5_if_app {
  product = ``;
  quantity = ``;
  mv_placement = ``;
  client = null;

  popover_display({ id } = {}) {
    const view = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    view.ele(`QuickView`)
      .a({ n: `placement`, v: this.mv_placement })
      .ele(`QuickViewPage`)
      .a({ n: `description`, v: `Enjoy` })
      .a({ n: `header`, v: `Employee Info` })
      .a({ n: `pageId`, v: `employeePageId` })
      .a({ n: `title`, v: `choper725` })
      .a({ n: `titleUrl`, v: `https://github.com/abap2UI5/abap2UI5` })
      .ele(`QuickViewGroup`)
      .a({ n: `heading`, v: `Contact Details` })
      .ele(`QuickViewGroupElement`)
      .a({ n: `label`, v: `Mobile` })
      .a({ n: `type`, v: `mobile` })
      .a({ n: `value`, v: `123-456-789` })
      .end()
      .ele(`QuickViewGroupElement`)
      .a({ n: `label`, v: `Phone` })
      .a({ n: `type`, v: `phone` })
      .a({ n: `value`, v: `789-456-123` })
      .end()
      .ele(`QuickViewGroupElement`)
      .a({ n: `emailSubject`, v: `Subject` })
      .a({ n: `label`, v: `Email` })
      .a({ n: `type`, v: `email` })
      .a({ n: `value`, v: `thisisemail@email.com` })
      .end()
      .end()
      .ele(`QuickViewGroup`)
      .a({ n: `heading`, v: `Company` })
      .ele(`QuickViewGroupElement`)
      .a({ n: `label`, v: `Name` })
      .a({ n: `type`, v: `link` })
      .a({ n: `url`, v: `https://github.com/abap2UI5/abap2UI5` })
      .a({ n: `value`, v: `Adventure Company` })
      .end()
      .ele(`QuickViewGroupElement`)
      .a({ n: `label`, v: `Address` })
      .a({ n: `value`, v: `Here"` })
      .end();
    this.client.popover_display(view.stringify(), id);
  }

  view_display() {
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
      .a({ n: `title`, v: `abap2UI5 - Popover - QuickView Contact Card` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Opens a QuickView popover, a compact contact card with grouped fields and links, ` + `anchored to a button; the segmented button sets its placement.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `QuickView Popover` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Title`)
      .a({ n: `text`, v: `QuickView Popover` })
      .tag(`Label`)
      .a({ n: `text`, v: `placement` })
      .ele(`SegmentedButton`)
      .a({ n: `selectedKey`, v: this.client._bind(this.mv_placement) })
      .ele(`items`)
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://add-favorite` })
      .a({ n: `key`, v: `Left` })
      .a({ n: `text`, v: `Left` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://accept` })
      .a({ n: `key`, v: `Top` })
      .a({ n: `text`, v: `Top` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://accept` })
      .a({ n: `key`, v: `Bottom` })
      .a({ n: `text`, v: `Bottom` })
      .tag(`SegmentedButtonItem`)
      .a({ n: `icon`, v: `sap-icon://attachment` })
      .a({ n: `key`, v: `Right` })
      .a({ n: `text`, v: `Right` })
      .end()
      .end()
      .tag(`Label`)
      .a({ n: `text`, v: `popover` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(`POPOVER`) })
      .a({ n: `text`, v: `show` })
      .a({ n: `id`, v: `TEST` })
      .a({ n: `width`, v: `10rem` });
    this.client.view_display(view.stringify());
  }

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.on_init();
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else {
      this.on_event();
    }
  }

  on_event() {
    switch (this.client.get_event()) {
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

module.exports = z2ui5_cl_smp_app_109;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");

