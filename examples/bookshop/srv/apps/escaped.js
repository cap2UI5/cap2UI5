// A TEST FIXTURE, not a demo app: it builds its view the way a view builder
// does, XML-escaping every attribute value - which is what abap2UI5's own
// Z2UI5_CL_UI5_VIEW_BUILDER does to the string client._event( ) returns. The
// placeholder has to come through that unchanged, or the substitution misses
// and the placeholder itself ships to the browser (escape.test.mjs).
const { defineApp } = require("cap2ui5");

const esc = (v) => String(v)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (o) => Object.entries(o).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");

defineApp("ZCL_JS_ESCAPED", class {
  said = "";

  main(client) {
    if (client.check_on_event("GO")) {
      this.said = "go";
      client.message_box_display("escaped event arrived");
      return;
    }
    if (client.check_on_event("TAKE")) {
      this.said = client.get_event_arg(1);
      client.message_box_display(`took ${client.get_event_arg(1)}`);
      return;
    }
    if (client.check_on_event("BREAK")) {
      // a placeholder the app cut short: nothing can substitute it any more
      client.view_display(`<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m">` +
        `<Button${attrs({ text: "Broken", press: client._event("GO").slice(0, -1) })}/></mvc:View>`);
      return;
    }
    if (client.check_on_navigated()) {
      client.view_display(
        `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true" height="100%">` +
        `<Shell><Page${attrs({ title: "cap2UI5 - escaped" })}>` +
        `<Text${attrs({ text: `said: ${client._bind("said")}` })}/>` +
        `<Button${attrs({ text: "Go", press: client._event("GO") })}/>` +
        `<Button${attrs({ text: "Take", press: client._event({ val: "TAKE", t_arg: [`a "quoted" <arg> & more`] }) })}/>` +
        `</Page></Shell></mvc:View>`);
    }
  }
});
