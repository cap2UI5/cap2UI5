const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_445 extends z2ui5_if_app {
  client = null;

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    } else {
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
    const form = parent.simple_form({ editable: false, layout: `ResponsiveGridLayout` });
    form.label(`System type`)
      .object_status({ text: `{= \${device>/system/phone} ? 'Phone' : (\${device>/system/tablet} ? 'Tablet' : (\${device>/system/desktop} ? 'Desktop' : 'Other')) }`, state: `Information` });
    form.label(`Orientation`)
      .object_status({ text: `{= \${device>/orientation/landscape} ? 'Landscape' : 'Portrait' }` });
    form.label(`Window size`).object_status({ text: `{device>/resize/width} x {device>/resize/height} px` });
    form.label(`Touch support`)
      .object_status({ text: `{= \${device>/support/touch} ? 'Yes' : 'No' }`, state: `{= \${device>/support/touch} ? 'Success' : 'None' }` });
    form.label(`Browser`).text(`{device>/browser/name} {device>/browser/version}`);
    form.label(`Operating system`).text(`{device>/os/name} {device>/os/version}`);
    result = z2ui5_cl_util.abap_copy(form);
    return result;
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    const page = view.shell()
      .page({ title: `abap2UI5 - Device Model`, navbuttonpress: this.client._event_nav_app_leave(), shownavbutton: this.client.check_app_prev_stack() });
    page.message_strip({ text: `The 'device>' model is a one-way JSONModel over sap.ui.Device. ` + `Resize the window or rotate your device and the values update live - ` + `no backend round-trip. It is available in this view and in the dialog below.`, type: `Information`, showicon: true, class: `sapUiSmallMargin` });
    this.device_form({ parent: page.panel({ headertext: `Live device properties`, class: `sapUiSmallMargin` }) });
    page.message_strip({ text: `{= \${device>/system/phone} ? 'Compact layout - you are on a phone.' : 'Full layout - tablet or desktop.' }`, type: `{= \${device>/system/phone} ? 'Warning' : 'Success' }`, showicon: true, class: `sapUiSmallMargin` });
    const tabs = page.panel({ headertext: `Responsive IconTabBar (expanded only when it is not a phone)`, class: `sapUiSmallMargin` })
      .icon_tab_bar({ expanded: `{= !\${device>/system/phone} }`, class: `sapUiResponsiveContentPadding` })
      .items();
    tabs.icon_tab_filter({ text: `Sales`, key: `sales`, icon: `sap-icon://money-bills` })
      .text(`On a phone the tab content is collapsed to save space; on tablet/desktop it stays expanded.`);
    tabs.icon_tab_filter({ text: `Stock`, key: `stock`, icon: `sap-icon://product` })
      .text(`Everything here is driven purely by the device> model - no event handler.`);
    page.button({ text: `Open dialog (device model inside a popup)`, icon: `sap-icon://sys-monitor`, press: this.client._event(`OPEN_POPUP`), class: `sapUiSmallMargin` });
    this.client.view_display(view.stringify());
  }

  popup_display() {
    const popup = z2ui5_cl_xml_view.factory_popup();
    const dialog = popup.dialog({ title: `Device model inside a popup`, contentwidth: `{= \${device>/system/phone} ? '95%' : '420px' }` });
    this.device_form({ parent: dialog.content() });
    dialog.footer()
      .overflow_toolbar()
      .toolbar_spacer()
      .button({ text: `Close`, type: `Emphasized`, press: this.client._event_client(this.client.cs_event.popup_close) });
    this.client.popup_display(popup.stringify());
  }
}

module.exports = z2ui5_cl_demo_app_445;
