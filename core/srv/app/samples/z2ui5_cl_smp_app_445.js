const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_445 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }
  }

  on_event() {
    if (this.client.check_on_event(`OPEN_POPUP`)) {
      this.popup_display();
    }
  }

  device_form({ parent } = {}) {
    let result = null;
    const form = parent.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `layout`, v: `ResponsiveGridLayout` })
      .a({ n: `editable`, b: false });
    form.tag(`Label`)
      .a({ n: `text`, v: `System type` })
      .ele(`ObjectStatus`)
      .a({ n: `state`, v: `Information` })
      .a({ n: `text`, v: `{= \${device>/system/phone} ? 'Phone' : (\${device>/system/tablet} ? 'Tablet' : (\${device>/system/desktop} ? 'Desktop' : 'Other')) }` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Orientation` })
      .ele(`ObjectStatus`)
      .a({ n: `text`, v: `{= \${device>/orientation/landscape} ? 'Landscape' : 'Portrait' }` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Window size` })
      .ele(`ObjectStatus`)
      .a({ n: `text`, v: `{device>/resize/width} x {device>/resize/height} px` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Touch support` })
      .ele(`ObjectStatus`)
      .a({ n: `state`, v: `{= \${device>/support/touch} ? 'Success' : 'None' }` })
      .a({ n: `text`, v: `{= \${device>/support/touch} ? 'Yes' : 'No' }` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Browser` })
      .tag(`Text`)
      .a({ n: `text`, v: `{device>/browser/name} {device>/browser/version}` });
    form.tag(`Label`)
      .a({ n: `text`, v: `Operating system` })
      .tag(`Text`)
      .a({ n: `text`, v: `{device>/os/name} {device>/os/version}` });
    result = z2ui5_cl_util.abap_tab_assign(result, z2ui5_cl_util.abap_copy(form));
    return result;
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
      .a({ n: `title`, v: `abap2UI5 - Device - Device Model: Phone, Tablet, Desktop` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `The 'device>' model is a one-way JSONModel over sap.ui.Device. ` + `Resize the window or rotate your device and the values update live - ` + `no backend round-trip. It is available in this view and in the dialog below.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    this.device_form({ parent: page.ele(`Panel`).a({ n: `class`, v: `sapUiSmallMargin` }).a({ n: `headerText`, v: `Live device properties` }) });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `{= \${device>/system/phone} ? 'Compact layout - you are on a phone.' : 'Full layout - tablet or desktop.' }` })
      .a({ n: `type`, v: `{= \${device>/system/phone} ? 'Warning' : 'Success' }` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    const tabs = page.ele(`Panel`)
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .a({ n: `headerText`, v: `Responsive IconTabBar (expanded only when it is not a phone)` })
      .ele(`IconTabBar`)
      .a({ n: `class`, v: `sapUiResponsiveContentPadding` })
      .a({ n: `expanded`, v: `{= !\${device>/system/phone} }` })
      .ele(`items`);
    tabs.ele(`IconTabFilter`)
      .a({ n: `icon`, v: `sap-icon://money-bills` })
      .a({ n: `text`, v: `Sales` })
      .a({ n: `key`, v: `sales` })
      .tag(`Text`)
      .a({ n: `text`, v: `On a phone the tab content is collapsed to save space; on tablet/desktop it stays expanded.` });
    tabs.ele(`IconTabFilter`)
      .a({ n: `icon`, v: `sap-icon://product` })
      .a({ n: `text`, v: `Stock` })
      .a({ n: `key`, v: `stock` })
      .tag(`Text`)
      .a({ n: `text`, v: `Everything here is driven purely by the device> model - no event handler.` });
    page.tag(`Button`)
      .a({ n: `press`, v: this.client._event(`OPEN_POPUP`) })
      .a({ n: `text`, v: `Open dialog (device model inside a popup)` })
      .a({ n: `icon`, v: `sap-icon://sys-monitor` })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    this.client.view_display(view.stringify());
  }

  popup_display() {
    const popup = z2ui5_cl_ui5_view_builder.factory()
      .ele({ n: `FragmentDefinition`, ns: `core` })
      .a({ n: `xmlns`, v: `sap.m` })
      .a({ n: `xmlns:core`, v: `sap.ui.core` })
      .a({ n: `xmlns:form`, v: `sap.ui.layout.form` });
    const dialog = popup.ele(`Dialog`)
      .a({ n: `title`, v: `Device model inside a popup` })
      .a({ n: `contentWidth`, v: `{= \${device>/system/phone} ? '95%' : '420px' }` });
    this.device_form({ parent: dialog.ele(`content`) });
    dialog.ele(`buttons`)
      .tag(`Button`)
      .a({ n: `press`, v: this.client.follow_up_action(this.client.cs_event.popup_close) })
      .a({ n: `text`, v: `Close` })
      .a({ n: `type`, v: `Emphasized` });
    this.client.popup_display(popup.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_445;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

