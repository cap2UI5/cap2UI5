const z2ui5_if_app = require("abap2UI5/z2ui5_if_app");

class z2ui5_cl_smp_app_496 extends z2ui5_if_app {
  static cs_event = { ping: `PING`, where: `WHERE` };

  t_tab = [];
  text = ``;
  roundtrips = 0;
  client = null;

  async main(client) {
    this.client = client;
    if (client.check_on_init()) {
      this.text = `change me and press Send`;
      this.tabs_init();
      this.view_display();
    } else if (client.check_on_event(z2ui5_cl_smp_app_496.cs_event.ping)) {
      this.roundtrips = this.roundtrips + 1;
    } else if (client.check_on_event(z2ui5_cl_smp_app_496.cs_event.where)) {
      client.message_box_display(`Press Ctrl+F12 to open and close the developer tools. They belong to the framework, ` + `not to this sample - the shortcut works in every abap2UI5 app.`, undefined, `Developer Tools`);
    }
  }

  tabs_init() {
    this.t_tab = z2ui5_cl_util.abap_tab_assign(this.t_tab, [{ name: `Error`, descr: `The last uncaught exception with its call stack - the same one the error popup shows.` }, { name: `Log`, descr: `What the frontend did since the app started: roundtrips, frontend actions, events.` }, { name: `Previous Request`, descr: `The JSON this browser sent last - your event, the changed model, the app state.` }, { name: `Response`, descr: `The JSON the backend sent back - the new view, the new model, the follow-up actions.` }, { name: `Source Code`, descr: `The ABAP class behind the running app, with an ADT jump link in the dialog footer.` }, { name: `View`, descr: `The XML view your ABAP built - what z2ui5_cl_ui5_view_builder stringified into the response.` }, { name: `View Model`, descr: `The model behind that view: every bound attribute of this class with its live value.` }, { name: `Popup, Popover, Nest1, Nest2`, descr: `The same two tabs - view and model - for each of the other view slots of the app.` }]);
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
      .a({ n: `title`, v: `abap2UI5 - Basics V - The Developer Tools (Ctrl+F12)` })
      .a({ n: `showNavButton`, b: this.client.check_app_prev_stack() })
      .a({ n: `navButtonPress`, v: this.client._event_nav_app_leave() });
    page.tag(`MessageStrip`)
      .a({ n: `text`, v: `Press Ctrl+F12 - here and in every other abap2UI5 app - and the developer tools ` + `open over the app. They show what travels between this class and the browser: the ` + `XML view your ABAP built, the model behind it, and the JSON of the last request and ` + `response. Change the text below, press Send, and look at Previous Request: the value ` + `you typed is in it. Then look at View Model - it is there too, because a public ` + `attribute is the model.` })
      .a({ n: `type`, v: `Information` })
      .a({ n: `showIcon`, b: true })
      .a({ n: `class`, v: `sapUiSmallMargin` });
    page.ele({ n: `SimpleForm`, ns: `form` })
      .a({ n: `title`, v: `Something to look at` })
      .a({ n: `editable`, b: true })
      .ele({ n: `content`, ns: `form` })
      .tag(`Label`)
      .a({ n: `text`, v: `bound to the public attribute TEXT` })
      .tag(`Input`)
      .a({ n: `value`, v: this.client._bind(this.text) })
      .tag(`Label`)
      .a({ n: `text`, v: `roundtrips so far` })
      .tag(`Text`)
      .a({ n: `text`, v: this.client._bind(this.roundtrips) })
      .tag(`Label`)
      .a({ n: `text`, v: `send it to the backend` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(z2ui5_cl_smp_app_496.cs_event.ping) })
      .a({ n: `text`, v: `Send` })
      .tag(`Label`)
      .a({ n: `text`, v: `how do I open the tools?` })
      .tag(`Button`)
      .a({ n: `press`, v: this.client._event(z2ui5_cl_smp_app_496.cs_event.where) })
      .a({ n: `text`, v: `Show me` })
      .a({ n: `icon`, v: `sap-icon://sys-help` });
    page.ele(`List`)
      .a({ n: `headerText`, v: `What the tabs of the tools show` })
      .a({ n: `items`, v: this.client._bind(this.t_tab) })
      .a({ n: `class`, v: `sapUiSmallMargin` })
      .tag(`StandardListItem`)
      .a({ n: `title`, v: `{NAME}` })
      .a({ n: `description`, v: `{DESCR}` });
    this.client.view_display(view.stringify());
  }
}

module.exports = z2ui5_cl_smp_app_496;

const z2ui5_cl_ui5_view_builder = require("abap2UI5/z2ui5_cl_ui5_view_builder");
const z2ui5_cl_util = require("abap2UI5/z2ui5_cl_util");

