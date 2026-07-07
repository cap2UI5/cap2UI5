const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_032 extends z2ui5_if_app {
  mv_value = ``;
  client = null;
  app = { view_main: ``, view_popup: ``, get: null };

  async main(client) {
    this.client = client;
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
    const lv_xml = `<mvc:View` + `\\n` + ` xmlns:mvc="sap.ui.core.mvc" displayBlock="true"` + `\\n` + ` xmlns:z2ui5="z2ui5" xmlns:m="sap.m" xmlns="http://www.w3.org/1999/xhtml"` + `\\n` + ` ><m:Button ` + `\\n` + ` text="back" ` + `\\n` + ` press="` + this.client._event_nav_app_leave() + `" ` + `\\n` + ` class="sapUiContentPadding sapUiResponsivePadding--content"/> ` + `\\n` + `<html><head><style>` + `\\n` + `body {background-color: powderblue;}` + `\\n` + `h1 {color: blue;}` + `\\n` + `p {color: red;}` + `\\n` + `</style>` + `</head>` + `\\n` + `<body>` + `\\n` + `<h1>This is a heading with css</h1>` + `\\n` + `<p>This is a paragraph with css.</p>` + `\\n` + `<h1>My First JavaScript</h1>` + `\\n` + `<button onclick="myFunction()" type="button">send</button>` + `\\n` + `<Input id='input' value='frontend data' /> ` + `<script> function myFunction( ) { z2ui5.oView.getController()
      .onEvent({ 'EVENT' : 'POST', 'METHOD' : 'UPDATE' }, document.getElementById(z2ui5.oView.createId( "input" )).value ) } </script>` + `\\n` + `</body>` + `\\n` + `</html> ` + `\\n` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }
}

module.exports = z2ui5_cl_demo_app_032;
