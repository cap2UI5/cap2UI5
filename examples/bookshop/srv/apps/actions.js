// A TEST FIXTURE as much as a demo: the commands the facade queues besides
// the view - a front-end action, a popover anchored to a control, the second
// nested slot, the message box with its options and with data, the toast's
// options, the URL hash and the app state. actions.test.mjs reads each off
// the response; browser.e2e.mjs opens the popover.
const { defineApp } = require("cap2ui5");

const fragment = (body) =>
  `<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m">${body}</core:FragmentDefinition>`;

defineApp("ZCL_JS_ACTIONS", class {
  title = "Invoices";

  main(c) {
    switch (c.eventName) {
      case "TITLE":
        c.followUpAction("set_title", [this.title]);
        return;
      case "EXPAND":
        // a control of the POPUP: control_by_id resolves the id in that slot
        c.followUpAction("control_by_id", ["panel", "setExpanded", "true"], { view: "popup" });
        return;
      case "POPOVER":
        c.popover(fragment(
          `<Popover title="More" placement="Bottom"><Text text="the popover"/>` +
          `<footer><Toolbar><Button text="Close" press="${c.event("POPOVER_CLOSE")}"/></Toolbar></footer>` +
          `</Popover>`), "more");
        return;
      case "POPOVER_CLOSE":
        c.popoverClose();
        return;
      case "DETAIL":
        c.nest2("detail", `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="second slot"/></mvc:View>`);
        return;
      case "DETAIL_CLOSE":
        c.nest2Close();
        return;
      case "BLANK":
        c.viewClose();
        return;
      case "ASK":
        c.messageBox("Delete it?", {
          type: "confirm", title: "Please decide", actions: ["DELETE", "CANCEL"],
          emphasizedAction: "DELETE", onClose: "BOX_CLOSED",
        });
        return;
      case "ROWS":
        c.messageBox([{ city: "Berlin", size: 3 }, { city: "Lisbon", size: 5 }]);
        return;
      case "FAILED":
        // components named like BAPIRET2's: the framework reads a message
        c.messageBox({ type: "E", message: "Posting failed" });
        return;
      case "TOAST":
        c.messageToast("saved", { duration: "5000" });
        return;
      case "HASH":
        c.hashSet("/detail/1");
        return;
      case "HASH_REPLACE":
        c.hashReplace("/detail/2");
        return;
      case "STATE":
        c.appStateSetActive();
        return;
    }
    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - actions">` +
        `<Button id="more" text="More" press="${c.event("POPOVER")}"/>` +
        `<Button text="Title" press="${c.event("TITLE")}"/>` +
        `<Button text="Detail" press="${c.event("DETAIL")}"/>` +
        `<VBox id="detail"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});
