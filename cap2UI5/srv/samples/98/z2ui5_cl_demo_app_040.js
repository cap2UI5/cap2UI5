const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_040 extends z2ui5_if_app {
  mv_barcode = ``;
  mv_load_lib = false;
  client = null;
  app = { view_main: ``, view_popup: ``, get: null };

  async main(client) {
    this.client = client;
    this.app.get = client.get();
    this.app.view_popup = ``;
    if (this.app.get.event) {
      this.on_event();
    }
    this.view_display();
    this.app.get = {};
  }

  on_event() {
    if (this.client.check_on_event(`LOAD_BC`)) {
      this.client.message_box_display(`JSBarcode Library loaded`);
      this.mv_load_lib = true;
    }
  }

  view_display() {
    let lv_xml = `<mvc:View ` + `\\n` + ` xmlns:mvc="sap.ui.core.mvc" displayBlock="true"` + `\\n` + ` xmlns:z2ui5="z2ui5" xmlns:m="sap.m" xmlns="http://www.w3.org/1999/xhtml"` + `\\n` + ` ><m:Button ` + `\\n` + ` text="back" ` + `\\n` + ` press="` + this.client._event_nav_app_leave() + `" ` + `\\n` + ` class="sapUiContentPadding sapUiResponsivePadding--content"/> ` + `\\n` + `<html><head>` + `\\n` + `</head>` + `\\n` + `<body>` + `\\n` + `<m:Button text="LoadJSBarcode" press="` + this.client._event(`LOAD_BC`) + `" />` + `\\n` + `<m:Input value="` + this.client._bind_edit(this.mv_barcode) + `" />` + `\\n` + `<m:Button text="Display Barcode" press="` + this.client._event(`DISPLAY_BC`) + `" />` + `\\n` + `<h1>JSBarcode Library</h1>` + `\\n` + ` <svg id="barcode">` + `\\n` + `</svg>` + `\\n`;
    if (this.mv_load_lib === true) {
      this.mv_load_lib = false;
      lv_xml = lv_xml + `<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"> </script>`;
    }
    if (this.mv_barcode) {
      lv_xml = lv_xml + `<script> $("#" + z2ui5.oView.createId( 'barcode' ) )
        .JsBarcode("` + this.mv_barcode + `") </script>`;
    }
    lv_xml = lv_xml + `</body>` + `\\n` + `</html> ` + `\\n` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }
}

module.exports = z2ui5_cl_demo_app_040;
