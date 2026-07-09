const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_032 extends z2ui5_if_app {
  mv_value = ``;
  client = null;
  app = { view_main: ``, view_popup: ``, get: null };

  async main(client) {
    this.client = z2ui5_cl_util.abap_copy(client);
    this.app.get = client.get();
    this.app.view_popup = ``;
    if (client.check_on_init()) {
      this.on_init();
    }
    if (this.app.get.event) {
      this.on_event();
    }
    this.view_display();
    this.app.get = {};
  }

  on_event() {
    switch (this.app.get.event) {
      case `POST`:
        this.client.message_toast_display(this.app.get.t_event_arg[(1) - 1]);
        break;
      case `MYCC`:
        this.client.message_toast_display(`MYCC event ${this.mv_value}`);
        break;
    }
  }

  on_init() {
    this.app.view_main = `VIEW_MAIN`;
    this.mv_value = `test`;
  }

  view_display() {
    const lo_view = z2ui5_cl_xml_view.factory();
    const lv_xml = `<mvc:View` + ` ` + ` xmlns:mvc="sap.ui.core.mvc" displayBlock="true"` + ` ` + ` xmlns:z2ui5="z2ui5" xmlns:m="sap.m" xmlns="http://www.w3.org/1999/xhtml"` + ` ` + ` ><m:Button ` + ` ` + ` text="back" ` + ` ` + ` press="` + this.client._event_nav_app_leave() + `" ` + ` ` + ` class="sapUiContentPadding sapUiResponsivePadding--content"/> ` + ` ` + `<html><head><style>` + ` ` + `body {background-color: powderblue;}` + ` ` + `h1 {color: blue;}` + ` ` + `p {color: red;}` + ` ` + `</style>` + `</head>` + ` ` + `<body>` + ` ` + `<h1>This is a heading with css</h1>` + ` ` + `<p>This is a paragraph with css.</p>` + ` ` + `<h1>My First JavaScript</h1>` + ` ` + `<button onclick="myFunction()" type="button">send</button>` + ` ` + `<Input id='input' value='frontend data' /> ` + `<script> function myFunction( ) { z2ui5.oView.getController()
      .onEvent({ 'EVENT' : 'POST', 'METHOD' : 'UPDATE' }, document.getElementById(z2ui5.oView.createId( "input" )).value ) } </script>` + ` ` + `</body>` + ` ` + `</html> ` + ` ` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }
}

module.exports = z2ui5_cl_demo_app_032;
