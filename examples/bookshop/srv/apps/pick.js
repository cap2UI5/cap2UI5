// Navigation, a popup and a nested view.
//
// ZCL_JS_PICK calls ZCL_JS_PICK_ONE, which hands a choice back. It is the
// case the lifecycle comment in define-app.js warns about: when the called
// app leaves, THIS main( ) runs again with check_on_navigated( ) true and
// check_on_init( ) FALSE - so an app that rendered only on check_on_init( )
// would show the caller's old screen, with nothing anywhere saying why.
const { defineApp } = require("@cap2ui5/cds-plugin");

const PICKER = "ZCL_JS_PICK_ONE";

defineApp("ZCL_JS_PICK", class {
  chosen = "";
  picks  = 0;

  main(client) {
    if (client.check_on_event("CHOOSE")) {
      client.nav_app_call(PICKER);             // scheduled for the end of the roundtrip
      return;
    }
    if (client.check_on_event("HELP")) {
      client.popup_display(
        `<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m">` +
        `<Dialog title="Help"><Text text="Choose picks a colour."/>` +
        `<beginButton><Button text="Close" press="${client._event("HELP_CLOSE")}"/></beginButton>` +
        `</Dialog></core:FragmentDefinition>`);
      return;
    }
    if (client.check_on_event("HELP_CLOSE")) {
      client.popup_destroy();
      return;
    }
    // A nested view inside the page's own VBox: the main view stays as it is
    // and only this re-renders. It shares the main model, so _bind( ) works.
    if (client.check_on_event("DETAIL")) {
      client.nest_view_display({
        val: `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
          `<VBox><Text text="chosen so far: ${client._bind("chosen")}"/>` +
          `<Button text="Hide" press="${client._event("DETAIL_HIDE")}"/></VBox></mvc:View>`,
        id: "slot",
        method_insert: "addContent",
        method_destroy: "removeAllContent",
      });
      return;
    }
    if (client.check_on_event("DETAIL_HIDE")) {
      client.nest_view_destroy();
      return;
    }

    // Arriving here on a PICKED event means the picker left: its own state is
    // the result, read through get_app_prev( ).
    if (client.check_on_event("PICKED") && client.get_app_prev()) {
      this.chosen = client.get_app_prev().colour ?? "";
      this.picks += 1;
    }

    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - pick">` +
        `<Text id="chosen" text="chosen: ${client._bind("chosen")}"/>` +
        `<Text id="picks" text="picks: ${client._bind("picks")}"/>` +
        `<Button text="Choose" press="${client._event("CHOOSE")}"/>` +
        `<Button text="Help" press="${client._event("HELP")}"/>` +
        `<Button text="Detail" press="${client._event("DETAIL")}"/>` +
        `<VBox id="slot"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

defineApp(PICKER, class {
  colour = "";

  main(client) {
    if (client.check_on_event("TAKE")) {
      this.colour = client.get_event_arg(1);   // the colour the button carried
      if (client.check_app_prev_stack()) client.nav_app_leave({ event: "PICKED" });
      return;
    }
    if (client.check_on_navigated()) {
      // ONE event, told apart by the argument each button carries. Without the
      // argument the handler cannot know which was pressed - the browser sends
      // only what the wire carries, which a test that hand-feeds T_EVENT_ARG
      // will not notice.
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - pick one">` +
        `<Button text="red" press="${client._event({ val: "TAKE", t_arg: ["red"] })}"/>` +
        `<Button text="blue" press="${client._event({ val: "TAKE", t_arg: ["blue"] })}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});
