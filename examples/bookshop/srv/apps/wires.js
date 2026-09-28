// A TEST FIXTURE as much as a demo: every kind of handler expression the
// client makes - an event with z2ui5_if_client=>ty_s_event_control options,
// the nav-back wire, and a front-end action wired into a control, which runs
// in the browser with no roundtrip. wires.test.mjs reads them off the wire,
// browser.e2e.mjs presses them.
const { defineApp, z2ui5_if_client } = require("cap2ui5");

defineApp("ZCL_JS_WIRES", class {
  query = "";
  said = "";

  main(client) {
    if (client.check_on_event("CALL")) {
      client.nav_app_call("ZCL_JS_WIRES_CALLED");
      return;
    }
    if (client.check_on_event("TYPED") || client.check_on_event("TAKE")) {
      this.said = `${client.get_event()} ${client.get_event_arg(1)}`;
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - wires">` +
        `<SearchField id="search" value="${client._bind("query")}" liveChange="${client._event({
          val: "TYPED", t_arg: ["${$parameters>/newValue}"], s_ctrl: { check_queue_last: true, check_no_busy: true },
        })}"/>` +
        `<Button id="literal" text="Literal" press="${client._event({
          val: "TAKE", t_arg: ["${not a binding}"], s_ctrl: { check_arg_literal: true } })}"/>` +
        `<Button id="guarded" text="Guarded" press="${client._event({
          val: "TAKE", t_arg: ["guarded"], s_ctrl: { check_prevent_default: true } })}"/>` +
        `<Button id="focus" text="Focus" press="${client.follow_up_action({
          val: z2ui5_if_client.cs_event.set_focus, t_arg: ["search"] })}"/>` +
        `<Button id="call" text="Call" press="${client._event("CALL")}"/>` +
        `<Text id="said" text="said: ${client._bind("said")}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

// Called by ZCL_JS_WIRES: its only way out is the page's back button, wired
// with client._event_nav_app_leave( ) - main( ) has no branch for it.
defineApp("ZCL_JS_WIRES_CALLED", class {
  main(client) {
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - wires, called" showNavButton="${client.check_app_prev_stack()}" ` +
        `navButtonPress="${client._event_nav_app_leave()}"><Text text="press back"/></Page></Shell></mvc:View>`);
    }
  }
});

// Every argument the client refuses, tried in main( ) and answered in a field,
// so the wire carries the messages (the retired-probe.js pattern).
defineApp("ZCL_JS_WIRES_WRONG", class {
  refusals = "";

  main(client) {
    const tries = {
      action: () => client.follow_up_action("set_fokus"),
      view: () => client.follow_up_action({ val: client.cs_event.set_focus, t_arg: ["x"], view: "sidebar" }),
      option: () => client._event({ val: "X", s_ctrl: { check_queue_first: true } }),
      args: () => client._event({ val: "X", t_arg: "not an array" }),
      positional: () => client._event("X", ["an argument"]),
      parameter: () => client._event({ val: "X", targ: ["a"] }),
      required: () => client.follow_up_action({ t_arg: ["x"] }),
    };
    const out = [];
    for (const [k, f] of Object.entries(tries)) {
      try { f(); out.push(`${k}: accepted`); } catch (e) { out.push(`${k}: ${e.message}`); }
    }
    this.refusals = out.join("\n");
  }
});
