const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_037 extends z2ui5_if_app {
  mv_value = ``;
  client = null;
  mv_load_cc = false;
  mv_display_cc = false;

  get_js_custom_control() {
    let result = ``;
    result = `<html:script>jQuery.sap.declare("z2ui5.MyCC");` + ` ` + ` sap.ui.require( [` + ` ` + ` "sap/ui/core/Control",` + ` ` + ` ], function (Control) {` + ` ` + ` "use strict";` + ` ` + ` return Control.extend("z2ui5.MyCC", {` + ` ` + ` metadata: {` + ` ` + ` properties: {` + ` ` + ` value: { type: "string" }` + ` ` + ` },` + ` ` + ` events: {` + ` ` + ` "change": {` + ` ` + ` allowPreventDefault: true,` + ` ` + ` parameters: {}` + ` ` + ` }` + ` ` + ` }` + ` ` + ` },` + ` ` + ` renderer: function (oRm, oControl) {` + ` ` + ` oControl.oInput = new sap.m.Input({` + ` ` + ` value: oControl.getProperty("value")` + ` ` + ` });` + ` ` + ` oControl.oButton = new sap.m.Button({` + ` ` + ` text: 'button text',` + ` ` + ` press: function (oEvent) {` + ` ` + ` debugger;` + ` ` + ` this.setProperty("value", this.oInput.getProperty( 'value') )` + ` ` + ` this.fireChange();` + ` ` + ` }.bind(oControl)` + ` ` + ` });` + ` ` + ` oRm.renderControl(oControl.oInput);` + ` ` + ` oRm.renderControl(oControl.oButton);` + ` ` + ` }` + ` ` + ` });` + ` ` + `}); jQuery.sap.require("z2ui5.MyCC"); </html:script>`;
    return result;
  }

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    if (client.check_on_init()) {
      this.view_display();
    }
    this.on_event();
  }

  load_cc() {
    this.client.view_display(z2ui5_cl_xml_view.factory()._generic({ ns: `html`, name: `script` })._cc_plain_xml(this.get_js_custom_control())._z2ui5().timer({ finished: this.client._event(`DISPLAY_VIEW`), delayms: `0` }).stringify());
  }

  on_event() {
    switch (this.client.get().EVENT) {
      case `DISPLAY_VIEW`:
        this.view_display();
        break;
      case `POST`:
        this.client.message_toast_display(this.client.get_event_arg(1));
        break;
      case `LOAD_CC`:
        this.mv_load_cc = true;
        this.load_cc();
        this.client.message_box_display(`Custom Control loaded `);
        break;
      case `DISPLAY_CC`:
        this.mv_display_cc = true;
        this.view_display();
        this.client.message_box_display(`Custom Control displayed `);
        break;
      case `MYCC`:
        this.client.message_toast_display(`Custom Control input: ${this.mv_value}`);
        break;
    }
  }

  view_display() {
    const view = z2ui5_cl_xml_view.factory();
    let lv_xml = `<mvc:View` + ` ` + ` xmlns:mvc="sap.ui.core.mvc" displayBlock="true"` + ` ` + ` xmlns:z2ui5="z2ui5" xmlns:m="sap.m" xmlns="http://www.w3.org/1999/xhtml"` + ` ` + ` ><m:Button ` + ` ` + ` text="back" ` + ` ` + ` press="` + this.client._event_nav_app_leave() + `" ` + ` ` + ` class="sapUiContentPadding sapUiResponsivePadding--content"/> ` + ` ` + `<m:Button text="Load Custom Control" press="` + this.client._event(`LOAD_CC`) + `" />` + ` ` + `<m:Button text="Display Custom Control" press="` + this.client._event(`DISPLAY_CC`) + `" />` + ` ` + `<html><head> ` + `</head>` + ` ` + `<body>`;
    if ((this.mv_display_cc === true || this.mv_display_cc === `X`)) {
      lv_xml = lv_xml + ` <z2ui5:MyCC change=" ` + this.client._event(`MYCC`) + `" value="` + this.client._bind_edit(this.mv_value) + `"/>`;
    }
    lv_xml = lv_xml + `</body>` + ` ` + `</html> ` + ` ` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }
}

module.exports = z2ui5_cl_demo_app_037;
