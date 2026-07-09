const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");
const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_036 extends z2ui5_if_app {
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
    const view = z2ui5_cl_xml_view.factory();
    const lv_xml = `<mvc:View` + ` ` + ` xmlns:mvc="sap.ui.core.mvc" displayBlock="true"` + ` ` + ` xmlns:z2ui5="z2ui5" xmlns:m="sap.m" xmlns="http://www.w3.org/1999/xhtml"` + ` ` + ` ><m:Button ` + ` ` + ` text="back" ` + ` ` + ` press="` + this.client._event_nav_app_leave() + `" ` + ` ` + ` class="sapUiContentPadding sapUiResponsivePadding--content"/> ` + ` ` + `<html><head><style>` + ` ` + `body {background-color: powderblue;}` + ` ` + `h1 {color: blue;}` + ` ` + `p {color: red;}` + ` ` + `</style>` + `</head>` + ` ` + `<body>` + ` ` + `<h1>This is a heading with css</h1>` + ` ` + `<p>This is a paragraph with css.</p>` + ` ` + `<h1>My First JavaScript</h1>` + ` ` + `<button type="button" onclick="myFunction()">` + ` ` + `run javascript code sent from the backend.</button>` + ` ` + `<button type="button" onclick="myFunction2()">sent data to backend and come back</button>` + ` ` + `<Input id='input' value='frontend data' /><h1>This is SVG</h1><p id="demo"></p><svg id="svg" version="1.1"` + ` ` + ` baseProfile="full"` + ` ` + ` width="500" height="500"` + ` ` + ` xmlns="http://www.w3.org/2000/svg">` + ` ` + ` <rect width="100%" height="100%" />` + ` ` + ` <circle id="circle" cx="100" cy="100" r="80" />` + ` ` + ` </svg>` + ` ` + `<div>X: <input id="sliderX" type="range" min="1" max="500" value="100" /></div><h1>This is canvas</h1><canvas id="canvas" width="500" height="300"></canvas>` + ` ` + `<script> debugger; var canvas = document.getElementById(z2ui5.oView.createId( 'canvas' ));` + ` ` + ` if (canvas.getContext){` + ` ` + `let context = canvas.getContext('2d');` + ` ` + `context.fillStyle = 'rgb(200,0,0)';` + ` ` + `context.fillRect (10, 10, 80, 80);` + ` ` + `context.fillStyle = 'rgba(0, 0, 200, 0.5)';` + ` ` + `context.fillRect (100, 10, 80, 80);` + ` ` + `context.strokeStyle = 'rgb(200,0,0)';` + ` ` + `context.strokeRect (190, 10, 80, 80);` + ` ` + `context.strokeStyle = 'rgba(0, 0, 200, 0.5)';` + ` ` + ` context.strokeRect (280, 10, 80, 80);` + ` ` + ` context.fillStyle = 'rgb(200,0,0)';` + ` ` + ` context.fillRect (370, 10, 80, 80);` + ` ` + ` context.clearRect (380, 20, 60, 20);` + ` ` + ` context.fillRect (390, 25, 10, 10);` + ` ` + ` context.fillRect (420, 25, 10, 10);` + ` ` + ` context.clearRect (385, 60, 50, 10); } ` + ` ` + ` function myFunction( ) { alert( 'button pressed' ) }` + ` ` + ` function myFunction2( ) { z2ui5.oView.getController()
      .onEvent({ 'EVENT' : 'POST', 'METHOD' : 'UPDATE' }, ` + ` document.getElementById(z2ui5.oView.createId( "input" )).value ` + ` ) }` + ` ` + `</script> <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/barcodes/JsBarcode.code128.min.js"> </script>` + `</body>` + ` ` + `</html> ` + ` ` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }
}

module.exports = z2ui5_cl_demo_app_036;
