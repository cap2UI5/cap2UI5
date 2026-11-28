// A TEST FIXTURE as much as a demo: the commands the client queues besides
// the view - a front-end action, a popover anchored to a control, the second
// nested slot, the message box with its options and with data, the toast's
// options, the URL hash and the app state. actions.test.mjs reads each off
// the response; browser.e2e.mjs opens the popover.
const { defineApp, z2ui5_if_client } = require("@cap2ui5/cds-plugin");

const fragment = (body) =>
  `<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns="sap.m">${body}</core:FragmentDefinition>`;

defineApp("ZCL_JS_ACTIONS", class {
  title = "Invoices";

  main(client) {
    switch (client.get_event()) {
      case "TITLE":
        client.follow_up_action({ val: z2ui5_if_client.cs_event.set_title, t_arg: [this.title] });
        return;
      case "EXPAND":
        // a control of the POPUP: control_by_id resolves the id in that slot
        client.follow_up_action({
          val: z2ui5_if_client.cs_event.control_by_id,
          view: z2ui5_if_client.cs_view.popup,
          t_arg: ["panel", "setExpanded", "true"],
        });
        return;
      case "RELOAD":
        // val alone, positionally - the constant read from the client itself
        client.follow_up_action(client.cs_event.location_reload);
        return;
      case "POPOVER":
        client.popover_display({
          xml: fragment(
            `<Popover title="More" placement="Bottom"><Text text="the popover"/>` +
            `<footer><Toolbar><Button text="Close" press="${client._event("POPOVER_CLOSE")}"/></Toolbar></footer>` +
            `</Popover>`),
          by_id: "more",
        });
        return;
      case "POPOVER_CLOSE":
        client.popover_destroy();
        return;
      case "DETAIL":
        client.nest2_view_display({
          val: `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Text text="second slot"/></mvc:View>`,
          id: "detail",
          method_insert: "addContent",
          method_destroy: "removeAllContent",
        });
        return;
      case "DETAIL_CLOSE":
        client.nest2_view_destroy();
        return;
      case "BLANK":
        client.view_destroy();
        return;
      case "ASK":
        client.message_box_display({
          text: "Delete it?", type: "confirm", title: "Please decide", actions: ["DELETE", "CANCEL"],
          emphasizedaction: "DELETE", onclose: "BOX_CLOSED",
        });
        return;
      case "ROWS":
        client.message_box_display([{ city: "Berlin", size: 3 }, { city: "Lisbon", size: 5 }]);
        return;
      case "FAILED":
        // components named like BAPIRET2's: the framework reads a message
        client.message_box_display({ type: "E", message: "Posting failed" });
        return;
      case "TOAST":
        client.message_toast_display({ text: "saved", duration: "5000" });
        return;
      case "HASH":
        client.hash_set("/detail/1");
        return;
      case "HASH_REPLACE":
        client.hash_replace("/detail/2");
        return;
      case "STATE":
        client.app_state_set_active();
        return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - actions">` +
        `<Button id="more" text="More" press="${client._event("POPOVER")}"/>` +
        `<Button text="Title" press="${client._event("TITLE")}"/>` +
        `<Button text="Detail" press="${client._event("DETAIL")}"/>` +
        `<VBox id="detail"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});
