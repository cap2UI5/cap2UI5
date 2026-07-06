const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_037 extends z2ui5_if_app {
  mv_value = ``;
  client = null;
  mv_load_cc = false;
  mv_display_cc = false;

  get_js_custom_control() {
    let result = ``;
    result = `<html:script>jQuery.sap.declare("z2ui5.MyCC");` + `\\n` + ` sap.ui.require( [` + `\\n` + ` "sap/ui/core/Control",` + `\\n` + ` ], function (Control) {` + `\\n` + ` "use strict";` + `\\n` + ` return Control.extend("z2ui5.MyCC", {` + `\\n` + ` metadata: {` + `\\n` + ` properties: {` + `\\n` + ` value: { type: "string" }` + `\\n` + ` },` + `\\n` + ` events: {` + `\\n` + ` "change": {` + `\\n` + ` allowPreventDefault: true,` + `\\n` + ` parameters: {}` + `\\n` + ` }` + `\\n` + ` }` + `\\n` + ` },` + `\\n` + ` renderer: function (oRm, oControl) {` + `\\n` + ` oControl.oInput = new sap.m.Input({` + `\\n` + ` value: oControl.getProperty("value")` + `\\n` + ` });` + `\\n` + ` oControl.oButton = new sap.m.Button({` + `\\n` + ` text: 'button text',` + `\\n` + ` press: function (oEvent) {` + `\\n` + ` debugger;` + `\\n` + ` this.setProperty("value", this.oInput.getProperty( 'value') )` + `\\n` + ` this.fireChange();` + `\\n` + ` }.bind(oControl)` + `\\n` + ` });` + `\\n` + ` oRm.renderControl(oControl.oInput);` + `\\n` + ` oRm.renderControl(oControl.oButton);` + `\\n` + ` }` + `\\n` + ` });` + `\\n` + `}); jQuery.sap.require("z2ui5.MyCC"); </html:script>`;
    return result;
  }

  async main(client) {
    this.client = client;
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
    let lv_xml = `<mvc:View` + `\\n` + ` xmlns:mvc="sap.ui.core.mvc" displayBlock="true"` + `\\n` + ` xmlns:z2ui5="z2ui5" xmlns:m="sap.m" xmlns="http://www.w3.org/1999/xhtml"` + `\\n` + ` ><m:Button ` + `\\n` + ` text="back" ` + `\\n` + ` press="` + this.client._event_nav_app_leave() + `" ` + `\\n` + ` class="sapUiContentPadding sapUiResponsivePadding--content"/> ` + `\\n` + `<m:Button text="Load Custom Control" press="` + this.client._event(`LOAD_CC`) + `" />` + `\\n` + `<m:Button text="Display Custom Control" press="` + this.client._event(`DISPLAY_CC`) + `" />` + `\\n` + `<html><head> ` + `</head>` + `\\n` + `<body>`;
    if (this.mv_display_cc === true) {
      lv_xml = lv_xml + ` <z2ui5:MyCC change=" ` + this.client._event(`MYCC`) + `" value="` + this.client._bind_edit(this.mv_value) + `"/>`;
    }
    lv_xml = lv_xml + `</body>` + `\\n` + `</html> ` + `\\n` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }
}

module.exports = z2ui5_cl_demo_app_037;
