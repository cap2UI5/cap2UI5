// A TEST FIXTURE as much as a demo: what two apps hand each other. navTo( )
// presets the called app's fields - what an ABAP app does between NEW and
// nav_app_call( ) - and navBack( { data } ) returns data the caller reads as
// c.eventData, typed, so an ABAP caller could ASSIGN it as well. The caller
// also reads client->get( ) and the link to its app state. handover.test.mjs
// drives it.
const { defineApp } = require("cap2ui5");

defineApp("ZCL_JS_HANDOVER", class {
  result = { product: "", quantity: 0 };
  returned = "";
  where = "";
  link = "";

  main(c) {
    if (c.eventName === "EDIT") {
      c.navTo("ZCL_JS_HANDOVER_FORM", { product: "Notebook", quantity: 2, mode: "edit" });
      return;
    }
    if (c.eventName === "WRONG") {
      c.navTo("ZCL_JS_HANDOVER_FORM", { nope: 1 });
      return;
    }
    if (c.eventName === "INFO") {
      const got = c.get();
      this.where = `${got.s_config.pathname}|${got.s_draft.id ? "draft" : "no draft"}|${got.event}`;
      this.link = c.appStateHref;
      return;
    }
    if (c.isDisplay) {
      if (c.eventName === "CONFIRMED") {
        this.returned = c.eventName;
        this.result = c.eventData;
      }
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - handover">` +
        `<Button text="Edit" press="${c.event("EDIT")}"/>` +
        `<Text text="${c.bind("returned")}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

defineApp("ZCL_JS_HANDOVER_FORM", class {
  product = "";
  quantity = 0;
  mode = "view";

  main(c) {
    if (c.eventName === "CONFIRM") {
      c.navBack({ event: "CONFIRMED", data: { product: this.product, quantity: this.quantity } });
      return;
    }
    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - handover, form (${this.mode})">` +
        `<Input value="${c.bind("product")}"/><Input value="${c.bind("quantity")}"/>` +
        `<Button text="Confirm" press="${c.event("CONFIRM")}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});
