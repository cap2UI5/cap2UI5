// A view built the way an ABAP app builds one: with abap2UI5's own
// z2ui5_cl_ui5_view_builder, as ViewBuilder - the same verbs (ele, tag, a,
// end), the same one rule for a( ), and upstream's rendering and escaping.
const { defineApp, ViewBuilder } = require("cap2ui5");

defineApp("ZCL_JS_BUILDER", class {
  name = "";

  main(c) {
    if (c.isDisplay) {
      const view = ViewBuilder.factory();
      view.ele("View", "mvc")
              .a("xmlns", "sap.m")
              .a("xmlns:mvc", "sap.ui.core.mvc")
              .a("displayBlock", true)
              .a("height", "100%")
          .ele("Shell")
          .ele("Page")
              .a("title", "cap2UI5 - view builder")
              .tag("Input")
                  .a("value", c.bind("name"))
                  .a("placeholder", "Your name")
              .tag("Text")
                  .a("text", { t: "{shown as typed}" })
              .tag("Button")
                  .a("text", "Go")
                  .a("press", c.event("GO"));
      c.view(view);
      return;
    }
    if (c.eventName === "GO") c.messageBox(`Hello ${this.name}`);
  }
});
