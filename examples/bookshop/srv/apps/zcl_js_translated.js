// @keywords abap2js translation fixture
// @summary An abap2UI5 app in the ABAP the samples are written in, one construct of each kind abap2js translates.
// @origin cap2UI5 examples/bookshop test/fixtures/abap2js/zcl_js_translated.clas.abap
//
// The source of srv/apps/zcl_js_translated.js: abap2js.test.mjs holds the
// module to what abap2js makes of this class, byte for byte, and drives it.
const { defineApp, t, z2ui5_cl_ui5_view_builder } = require("cap2ui5");

const ty_s_row = {
  title:    "",
  count:    0,
  selected: false,
};

const cs_mode = {
  edit:    "EDIT",
  display: "DISPLAY",
};

defineApp("ZCL_JS_TRANSLATED", class {

  t_rows   = t.table(ty_s_row);
  s_order  = ty_s_row;
  name     = "World";
  active   = false;
  amount   = t.packed(10, 2);
  code     = t.numc(6);
  greeting = "";

  main(client) {

    this.client = client;

    if (client.check_on_init()) {
      this.t_rows  = [
          { title: "first",  count: 1, selected: true },
          { title: "second", count: 2 } ];
      this.s_order = { title: "order", count: 3 };
      this.view_display();
    } else if (client.check_on_navigated()) {
      this.view_display();
    } else if (client.check_on_event()) {
      this.on_event();
    }

  }

  on_event() {

    switch (this.client.get_event()) {
      case "GREET": case "HELLO":
        // abap_bool prints as ABAP prints it: X, or nothing
        this.greeting = `Hello ${this.name}, active: ${this.active ? "X" : ""}, ${this.t_rows.length} rows`;
        this.client.message_box_display(this.greeting);
        break;
      case "TOGGLE":
        this.active = (this.active === false);
        this.client.follow_up_action({ val:   this.client.cs_event.set_title,
                                  t_arg: [ this.label(this.t_rows.length), (this.active ? "X" : "") ] });
        break;
      case "CALL":
        this.client.nav_app_call("ZCL_JS_HELLO");
        break;
      default:
        this.client.message_toast_display((this.client.get_event() === cs_mode.edit ? "edit mode"
                                         : "unknown event"));
        break;
    }

  }

  // the label of a row count
  label(count) {
    let result = "";

    result = (count === 1 ? "one row" : `${count} rows`);

    return result;
  }

  view_display() {

    const view = z2ui5_cl_ui5_view_builder.factory()
        .ele({ n: "View", ns: "mvc" })
            .a({ n: "xmlns",     v: "sap.m" })
            .a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" });
    const page = view.ele("Page")
        .a({ n: "title",          v: "abap2js - translated" })
        .a({ n: "showNavButton",  b: this.client.check_app_prev_stack() })
        .a({ n: "navButtonPress", v: this.client._event_nav_app_leave() });

    page.tag("Input")
        .a({ n: "value", v: this.client._bind("name") });
    page.tag("Input")
        .a({ n: "value", v: this.client._bind("s_order-title") });
    page.tag("Text")
        .a({ n: "text", v: `{${this.client._bind({ val: "code", path: true })}}` });
    page.ele("List")
        .a({ n: "items", v: this.client._bind("t_rows") })
        .tag("StandardListItem")
            .a({ n: "title", v: "{TITLE}" });
    page.tag("Button")
        .a({ n: "text",  v: "Greet" })
        .a({ n: "press", v: this.client._event("GREET") });
    page.tag("Button")
        .a({ n: "text",  v: "Edit" })
        .a({ n: "press", v: this.client._event({ val: cs_mode.edit, t_arg: [ "a", this.name ] }) });

    this.client.view_display(view.stringify());

  }
});
