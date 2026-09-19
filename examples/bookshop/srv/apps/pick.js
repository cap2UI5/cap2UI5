// Navigation and a popup, the two things the facade could not do before.
//
// ZCL_JS_PICK calls ZCL_JS_PICK_ONE, which hands a choice back. It is the
// case the lifecycle comment in define-app.js warns about: when the called
// app leaves, THIS main( ) runs again with isDisplay true and isFirstRun
// FALSE - so an app that rendered only on isFirstRun would show the caller's
// old screen, with nothing anywhere saying why.
const { defineApp } = require("cap2ui5");

const PICKER = "ZCL_JS_PICK_ONE";

defineApp("ZCL_JS_PICK", class {
  chosen = "";
  picks  = 0;

  main(c) {
    if (c.eventName === "CHOOSE") {
      c.navTo(PICKER);                       // scheduled for the end of the roundtrip
      return;
    }
    if (c.eventName === "HELP") {
      c.popup(
        `<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m">` +
        `<Dialog title="Help"><Text text="Choose picks a colour."/>` +
        `<beginButton><Button text="Close" press="${c.event("HELP_CLOSE")}"/></beginButton>` +
        `</Dialog></core:FragmentDefinition>`);
      return;
    }
    if (c.eventName === "HELP_CLOSE") {
      c.popupClose();
      return;
    }
    // A nested fragment inside the page's own VBox: the main view stays as it
    // is and only this re-renders. It shares the main model, so bind( ) works.
    if (c.eventName === "DETAIL") {
      c.nest("slot", `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
        `<VBox><Text text="chosen so far: ${c.bind("chosen")}"/>` +
        `<Button text="Hide" press="${c.event("DETAIL_HIDE")}"/></VBox></mvc:View>`);
      return;
    }
    if (c.eventName === "DETAIL_HIDE") {
      c.nestClose();
      return;
    }

    // Arriving here on a PICKED event means the picker left: its own state is
    // the result, read through c.prevApp.
    if (c.eventName === "PICKED" && c.prevApp) {
      this.chosen = c.prevApp.colour ?? "";
      this.picks += 1;
    }

    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - pick">` +
        `<Text id="chosen" text="chosen: ${c.bind("chosen")}"/>` +
        `<Text id="picks" text="picks: ${c.bind("picks")}"/>` +
        `<Button text="Choose" press="${c.event("CHOOSE")}"/>` +
        `<Button text="Help" press="${c.event("HELP")}"/>` +
        `<Button text="Detail" press="${c.event("DETAIL")}"/>` +
        `<VBox id="slot"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

defineApp(PICKER, class {
  colour = "";

  main(c) {
    if (c.eventName === "TAKE") {
      this.colour = c.eventArg(1);             // the colour the button carried
      if (c.canGoBack) c.navBack({ event: "PICKED" });
      return;
    }
    if (c.isDisplay) {
      // ONE event, told apart by the argument each button carries. Without the
      // argument the handler cannot know which was pressed - the browser sends
      // only what the wire carries, which a test that hand-feeds T_EVENT_ARG
      // will not notice.
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - pick one">` +
        `<Button text="red" press="${c.event("TAKE", ["red"])}"/>` +
        `<Button text="blue" press="${c.event("TAKE", ["blue"])}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});
