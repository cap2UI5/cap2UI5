const z2ui5_cl_xml_view = require("abap2UI5/z2ui5_cl_xml_view");
const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_demo_app_036 extends z2ui5_if_app {
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
    const view = z2ui5_cl_xml_view.factory();
    const lv_xml = `<mvc:View` + `\\n` + ` xmlns:mvc="sap.ui.core.mvc" displayBlock="true"` + `\\n` + ` xmlns:z2ui5="z2ui5" xmlns:m="sap.m" xmlns="http://www.w3.org/1999/xhtml"` + `\\n` + ` ><m:Button ` + `\\n` + ` text="back" ` + `\\n` + ` press="` + this.client._event_nav_app_leave() + `" ` + `\\n` + ` class="sapUiContentPadding sapUiResponsivePadding--content"/> ` + `\\n` + `<html><head><style>` + `\\n` + `body {background-color: powderblue;}` + `\\n` + `h1 {color: blue;}` + `\\n` + `p {color: red;}` + `\\n` + `</style>` + `</head>` + `\\n` + `<body>` + `\\n` + `<h1>This is a heading with css</h1>` + `\\n` + `<p>This is a paragraph with css.</p>` + `\\n` + `<h1>My First JavaScript</h1>` + `\\n` + `<button type="button" onclick="myFunction()">` + `\\n` + `run javascript code sent from the backend.</button>` + `\\n` + `<button type="button" onclick="myFunction2()">sent data to backend and come back</button>` + `\\n` + `<Input id='input' value='frontend data' /><h1>This is SVG</h1><p id="demo"></p><svg id="svg" version="1.1"` + `\\n` + ` baseProfile="full"` + `\\n` + ` width="500" height="500"` + `\\n` + ` xmlns="http://www.w3.org/2000/svg">` + `\\n` + ` <rect width="100%" height="100%" />` + `\\n` + ` <circle id="circle" cx="100" cy="100" r="80" />` + `\\n` + ` </svg>` + `\\n` + `<div>X: <input id="sliderX" type="range" min="1" max="500" value="100" /></div><h1>This is canvas</h1><canvas id="canvas" width="500" height="300"></canvas>` + `\\n` + `<script> debugger; var canvas = document.getElementById(z2ui5.oView.createId( 'canvas' ));` + `\\n` + ` if (canvas.getContext){` + `\\n` + `let context = canvas.getContext('2d');` + `\\n` + `context.fillStyle = 'rgb(200,0,0)';` + `\\n` + `context.fillRect (10, 10, 80, 80);` + `\\n` + `context.fillStyle = 'rgba(0, 0, 200, 0.5)';` + `\\n` + `context.fillRect (100, 10, 80, 80);` + `\\n` + `context.strokeStyle = 'rgb(200,0,0)';` + `\\n` + `context.strokeRect (190, 10, 80, 80);` + `\\n` + `context.strokeStyle = 'rgba(0, 0, 200, 0.5)';` + `\\n` + ` context.strokeRect (280, 10, 80, 80);` + `\\n` + ` context.fillStyle = 'rgb(200,0,0)';` + `\\n` + ` context.fillRect (370, 10, 80, 80);` + `\\n` + ` context.clearRect (380, 20, 60, 20);` + `\\n` + ` context.fillRect (390, 25, 10, 10);` + `\\n` + ` context.fillRect (420, 25, 10, 10);` + `\\n` + ` context.clearRect (385, 60, 50, 10); } ` + `\\n` + ` function myFunction( ) { alert( 'button pressed' ) }` + `\\n` + ` function myFunction2( ) { z2ui5.oView.getController()
      .onEvent({ 'EVENT' : 'POST', 'METHOD' : 'UPDATE' }, ` + ` document.getElementById(z2ui5.oView.createId( "input" )).value ` + ` ) }` + `\\n` + `</script> <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/barcodes/JsBarcode.code128.min.js"> </script>` + `</body>` + `\\n` + `</html> ` + `\\n` + `</mvc:View>`;
    this.client.view_display(lv_xml);
  }
}

module.exports = z2ui5_cl_demo_app_036;
