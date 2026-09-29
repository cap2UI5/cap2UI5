// A TEST FIXTURE as much as a demo: what two apps hand each other.
// client.nav_app_call( ) presets the called app's fields - what an ABAP app
// does between NEW and nav_app_call( ) - and client.nav_app_leave( { r_data } )
// returns data the caller reads as client.get( ).r_event_data, typed, so an
// ABAP caller could ASSIGN it as well. Or the called app writes a field of
// the caller itself, reached with client.get_app( id ), as abap2UI5's sample
// 025 does. The caller also reads client->get( ) and the link to its app
// state. handover.test.mjs drives it.
const { defineApp } = require("@cap2ui5/cds-plugin");

defineApp("ZCL_JS_HANDOVER", class {
  result = { product: "", quantity: 0 };
  returned = "";
  where = "";
  link = "";
  backend_event = "";                 // set by the called app, through client.get_app( id )

  main(client) {
    if (client.check_on_event("EDIT")) {
      client.nav_app_call("ZCL_JS_HANDOVER_FORM", { product: "Notebook", quantity: 2, mode: "edit" });
      return;
    }
    if (client.check_on_event("WRONG")) {
      client.nav_app_call("ZCL_JS_HANDOVER_FORM", { nope: 1 });
      return;
    }
    if (client.check_on_event("INFO")) {
      const got = client.get();
      this.where = `${got.s_config.pathname}|${got.s_draft.id ? "draft" : "no draft"}|${got.event}`;
      this.link = client.app_state_get_href();
      return;
    }
    if (client.check_on_navigated()) {
      if (client.check_on_event("CONFIRMED")) {
        this.returned = client.get_event();
        this.result = client.get().r_event_data;
      }
      if (this.backend_event === "FORM_LEFT") {
        this.backend_event = "";
        this.returned = `FORM_LEFT: ${client.get_app_prev().product}`;
      }
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - handover">` +
        `<Button text="Edit" press="${client._event("EDIT")}"/>` +
        `<Text text="${client._bind("returned")}"/>` +
        `<VBox binding="{${client._bind_path("result")}}"><Text text="{PRODUCT} x {QUANTITY}"/></VBox>` +
        `<Text text="${client._bind("where")}"/><Link text="this state" href="${client._bind("link")}"/>` +
        `<Text text="backend event: ${client._bind("backend_event")}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

defineApp("ZCL_JS_HANDOVER_FORM", class {
  product = "";
  quantity = 0;
  mode = "view";

  main(client) {
    if (client.check_on_event("CONFIRM")) {
      client.nav_app_leave({ event: "CONFIRMED", r_data: { product: this.product, quantity: this.quantity } });
      return;
    }
    if (client.check_on_event("BACK_WITH_EVENT")) {
      // abap2UI5's sample 025, line for line
      const app_back = client.get_app(client.get().s_draft.id_prev_app_stack);
      app_back.backend_event = "FORM_LEFT";
      client.nav_app_leave(app_back);
      return;
    }
    if (client.check_on_event("READ_BACK")) {
      // what get_app( id ) answers can be written, not read: it is loaded after main( )
      const app_back = client.get_app(client.get().s_draft.id_prev_app_stack);
      client.message_box_display(app_back.returned);
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - handover, form (${this.mode})">` +
        `<Input value="${client._bind("product")}"/><Input value="${client._bind("quantity")}"/>` +
        `<Button text="Confirm" press="${client._event("CONFIRM")}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});
