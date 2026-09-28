// A view built the way an ABAP app builds one: with abap2UI5's own
// z2ui5_cl_ui5_view_builder, under its own name - the same methods, called
// the same way (one positional argument, or the parameters by name), the same
// one rule for a( ), and upstream's rendering and escaping.
const { defineApp, z2ui5_cl_ui5_view_builder } = require("cap2ui5");

defineApp("ZCL_JS_BUILDER", class {
  name = "";

  main(client) {
    if (client.check_on_navigated()) {
      const view = z2ui5_cl_ui5_view_builder.factory()
          .ele({ n: "View", ns: "mvc" })
              .a({ n: "xmlns", v: "sap.m" })
              .a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" })
              .a({ n: "displayBlock", b: true })
              .a({ n: "height", v: "100%" });
      view.ele("Shell")
          .ele("Page")
              .a({ n: "title", v: "cap2UI5 - view builder" })
              .tag("Input")
                  .a({ n: "value", v: client._bind("name") })
                  .a({ n: "placeholder", v: "Your name" })
              .tag("Text")
                  .a({ n: "text", t: "{shown as typed}" })
              .tag("Button")
                  .a({ n: "text", v: "Go" })
                  .a({ n: "press", v: client._event("GO") });
      client.view_display(view.stringify());
      return;
    }
    if (client.check_on_event("GO")) client.message_box_display(`Hello ${this.name}`);
  }
});
