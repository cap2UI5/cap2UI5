// A TEST FIXTURE as much as a demo: every kind of handler expression the
// facade makes - an event with z2ui5_if_client=>ty_s_event_control options,
// the nav-back wire, and a front-end action wired into a control, which runs
// in the browser with no roundtrip. wires.test.mjs reads them off the wire,
// browser.e2e.mjs presses them.
const { defineApp } = require("cap2ui5");

defineApp("ZCL_JS_WIRES", class {
  query = "";
  said = "";

  main(c) {
    if (c.eventName === "CALL") {
      c.navTo("ZCL_JS_WIRES_CALLED");
      return;
    }
    if (c.eventName === "TYPED" || c.eventName === "TAKE") {
      this.said = `${c.eventName} ${c.eventArg(1)}`;
      return;
    }
    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - wires">` +
        `<SearchField id="search" value="${c.bind("query")}" liveChange="${c.event("TYPED",
          ["${$parameters>/newValue}"], { queueLast: true, noBusy: true })}"/>` +
        `<Button id="literal" text="Literal" press="${c.event("TAKE", ["${not a binding}"], { argLiteral: true })}"/>` +
        `<Button id="guarded" text="Guarded" press="${c.event("TAKE", ["guarded"], { preventDefault: true })}"/>` +
        `<Button id="focus" text="Focus" press="${c.eventFollowUpAction("set_focus", ["search"])}"/>` +
        `<Button id="call" text="Call" press="${c.event("CALL")}"/>` +
        `<Text id="said" text="said: ${c.bind("said")}"/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});

// Called by ZCL_JS_WIRES: its only way out is the page's back button, wired
// with c.eventNavBack( ) - main( ) has no branch for it.
defineApp("ZCL_JS_WIRES_CALLED", class {
  main(c) {
    if (c.isDisplay) {
      c.view(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page title="cap2UI5 - wires, called" showNavButton="${c.canGoBack}" ` +
        `navButtonPress="${c.eventNavBack()}"><Text text="press back"/></Page></Shell></mvc:View>`);
    }
  }
});

// Every argument the facade refuses, tried in main( ) and answered in a field,
// so the wire carries the messages (the retired-probe.js pattern).
defineApp("ZCL_JS_WIRES_WRONG", class {
  refusals = "";

  main(c) {
    const tries = {
      action: () => c.eventFollowUpAction("set_fokus"),
      view: () => c.followUpAction("set_focus", ["x"], { view: "sidebar" }),
      option: () => c.event("X", [], { queueFirst: true }),
      args: () => c.event("X", "not an array"),
    };
    const out = [];
    for (const [k, f] of Object.entries(tries)) {
      try { f(); out.push(`${k}: accepted`); } catch (e) { out.push(`${k}: ${e.message}`); }
    }
    this.refusals = out.join("\n");
  }
});
