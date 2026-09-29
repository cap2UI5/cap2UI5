// z2ui5_cl_ui5_view_builder - abap2UI5's view builder for a JavaScript app.
//
// The claim this file holds the plugin to: a view built with it is the view
// the same chain builds in an ABAP app - rendered, escaped and
// refused by upstream's class, not by a JavaScript copy of it. The chain is
// recorded while main( ) runs and replayed against the transpiled class after
// it, so these tests compare the replay with that class driven directly.
//
// ZCL_JS_BUILDER (srv/apps/builder.js) is the app on the wire; the browser
// half is in browser.e2e.mjs.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { action, post, serve } from "./server.mjs";

const require = createRequire(import.meta.url);
const { z2ui5_cl_ui5_view_builder, ViewBuilder, defineApp } = require("@cap2ui5/cds-plugin");
const s = serve();

/** the same chain, driven against the transpiled ABAP class directly */
const S = (v) => new abap.types.String({ qualifiedName: "STRING" }).set(v);
const B = (v) => new abap.types.Character(1, { qualifiedName: "ABAP_BOOL" }).set(v ? "X" : " ");
const abapChain = async () => {
  const VB = abap.Classes["Z2UI5_CL_UI5_VIEW_BUILDER"];
  const root = await VB.factory();
  const view = (await root.get().ele({ n: S("View"), ns: S("mvc") })).get();
  await view.a({ n: S("xmlns"), v: S("sap.m") });
  await view.a({ n: S("xmlns:f"), v: S("sap.f") });
  const page = (await view.ele({ n: S("Page") })).get();
  await page.a({ n: S("title"), v: S(`A & B <"quoted">`) });
  await page.a({ n: S("showHeader"), b: B(false) });
  await page.tag({ n: S("Text") });
  await page.a({ n: S("text"), t: S("{not a binding} \\ ok") });
  const card = (await page.ele({ n: S("Card"), ns: S("f") })).get();
  await card.a({ n: S("width"), v: S("300") });
  const back = (await card.end()).get();
  await back.tag({ n: S("Button") });
  await back.a({ n: S("text"), v: S("line1\nline2") });
  return String((await root.get().stringify()).get());
};

test("a recorded chain renders exactly what the same chain renders in ABAP", async () => {
  const view = z2ui5_cl_ui5_view_builder.factory();
  view.ele({ n: "View", ns: "mvc" })
          .a({ n: "xmlns", v: "sap.m" })
          .a({ n: "xmlns:f", v: "sap.f" })
      .ele("Page")
          .a({ n: "title", v: `A & B <"quoted">` })
          .a({ n: "showHeader", b: false })
          .tag("Text")
              .a({ n: "text", t: "{not a binding} \\ ok" })
          .ele({ n: "Card", ns: "f" })
              .a({ n: "width", v: 300 })
          .end()
          .tag("Button")
              .a({ n: "text", v: "line1\nline2" });
  const xml = await view.stringify();
  assert.equal(xml, await abapChain());
  // and what that means, spelled out once
  assert.match(xml, /title="A &amp; B &lt;&quot;quoted&quot;&gt;"/);
  assert.match(xml, /showHeader="false"/);
  assert.match(xml, /<Text text="\\\{not a binding\\\} \\\\ ok"\/>/);
  assert.match(xml, /<f:Card width="300"\/><Button text="line1&#xA;line2"\/>/);
});

test("its methods are called as ABAP calls them - one positional argument or the parameters by name", () => {
  const view = z2ui5_cl_ui5_view_builder.factory();
  // the forms of cap2ui5's first ViewBuilder: ABAP has no second positional argument
  assert.throws(() => view.ele("View", "mvc"),
    /z2ui5_cl_ui5_view_builder\.ele\( \): one value for n, or the parameters by name as one object - \{ n, ns \}/);
  assert.throws(() => view.a("title", "x"), /a\( \): one value for n, or the parameters by name as one object - \{ n, v, b, t \}/);
  assert.throws(() => view.a({ n: "title", value: "x" }), /a\( \): no parameter "value" - \{ n, v, b, t \}/);
  assert.throws(() => view.tag({ ns: "f" }), /tag\( \): n is not optional/);
  assert.throws(() => z2ui5_cl_ui5_view_builder.escape_literal(), /escape_literal\( \): val is not optional/);
  // ViewBuilder is the same class, for code that prefers a JavaScript name
  assert.equal(ViewBuilder, z2ui5_cl_ui5_view_builder);
});

test("stringify( ) is the chain as it stood - and not a string inside main( )", async () => {
  const view = z2ui5_cl_ui5_view_builder.factory().ele({ n: "View", ns: "mvc" }).a({ n: "xmlns", v: "sap.m" });
  const before = view.stringify();
  view.tag("Text");
  // as the ABAP method's string, it does not change with the chain after it
  assert.equal(await before, `<mvc:View xmlns="sap.m"/>`);
  assert.equal(await view.stringify(), `<mvc:View xmlns="sap.m"><Text/></mvc:View>`);
  // rendered after main( ), so in a template it would be "[object Object]" - it says so instead
  assert.throws(() => `${view.stringify()}`, /view\.stringify\( \) is rendered after main\( \) returns/);
});

test("the served app's view is the builder's, with bindings and events in place", async () => {
  const r = await post(s.url, { app: "ZCL_JS_BUILDER", user: "alice" });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  const [kind, verb, slot, xml] = action(r) ?? [];
  assert.deepEqual([kind, verb, slot], ["VIEW_SLOTS", "display", "MAIN"]);
  assert.match(xml, /^<mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" height="100%">/);
  assert.match(xml, /<Input value="\{\/NAME\}" placeholder="Your name"\/>/, "the binding is not in the view");
  assert.match(xml, /<Text text="\\\{shown as typed\\\}"\/>/, "t did not render literally");
  assert.doesNotMatch(xml, /z2ui5evt_/, "an event placeholder reached the browser");
  assert.match(xml, /press="[^"]*GO[^"]*"/, "the press handler is not the event's wire string");
});

test("the event of a builder view comes back to the app", async () => {
  const start = await post(s.url, { app: "ZCL_JS_BUILDER", user: "alice" });
  const go = await post(s.url, { app: "ZCL_JS_BUILDER", id: start.json.S_FRONT.ID, event: "GO",
    model: { NAME: "Ada" }, user: "alice" });
  assert.deepEqual(action(go)?.slice(0, 3), ["MESSAGE_BOX", "show", "Hello Ada"]);
});

test("popup_display( ) and nest_view_display( ) take a builder, or its stringify( ), too", async () => {
  defineApp("ZCL_JS_VB_SLOTS", class {
    main(client) {
      if (client.check_on_navigated()) {
        client.view_display(z2ui5_cl_ui5_view_builder.factory()
          .ele({ n: "View", ns: "mvc" }).a({ n: "xmlns", v: "sap.m" }).a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" })
          .ele("Page").a({ n: "id", v: "host" }));
        return;
      }
      if (client.check_on_event("POPUP")) {
        const popup = z2ui5_cl_ui5_view_builder.factory()
          .ele({ n: "FragmentDefinition", ns: "core" }).a({ n: "xmlns", v: "sap.m" }).a({ n: "xmlns:core", v: "sap.ui.core" })
          .ele("Dialog").a({ n: "title", v: "from the builder" });
        client.popup_display(popup.stringify());
      }
      if (client.check_on_event("NEST")) {
        client.nest_view_display({
          val: z2ui5_cl_ui5_view_builder.factory()
            .ele({ n: "View", ns: "mvc" }).a({ n: "xmlns", v: "sap.m" }).a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" })
            .tag("Text").a({ n: "text", v: "nested" }),
          id: "host",
          method_insert: "addContent",
        });
      }
    }
  });
  const start = await post(s.url, { app: "ZCL_JS_VB_SLOTS", user: "alice" });
  assert.equal(start.status, 200, start.text.slice(0, 300));
  const popup = await post(s.url, { app: "ZCL_JS_VB_SLOTS", id: start.json.S_FRONT.ID, event: "POPUP", user: "alice" });
  assert.match(JSON.stringify(action(popup)), /POPUP.*<Dialog title=\\"from the builder\\"\/>/);
  const nest = await post(s.url, { app: "ZCL_JS_VB_SLOTS", id: popup.json.S_FRONT.ID, event: "NEST", user: "alice" });
  assert.match(JSON.stringify(nest.json), /<Text text=\\"nested\\"\/>/);
});

test("a misuse is refused by upstream's builder, with upstream's words", async () => {
  const refused = async (build, words) => {
    const view = z2ui5_cl_ui5_view_builder.factory();
    build(view);
    await assert.rejects(view.stringify(), (e) => {
      assert.match(e.message, /^VIEW_BUILDER_ERROR - /, e.message);
      assert.ok(e.message.includes(words), e.message);
      return true;
    });
  };
  await refused((v) => v.ele({ n: "View", ns: "mvc" }).end().end(), "end( ) past the root");
  await refused((v) => v.a({ n: "text", v: "x" }), "on the empty builder root");
  await refused((v) => v.ele("Page").a({ n: "title", v: "a" }).a({ n: "title", v: "b" }), "duplicate attribute 'title'");
  await refused((v) => v.ele("Page").a("visible"), "without a value");
  await refused((v) => v.ele("Page").a({ n: "title", v: "x", t: "y" }), "more than one of v, b and t");
  await refused((v) => v.ele(`te"xt`), "is not a valid XML name");
});

test("in an app, a misuse answers as it does in an ABAP app - the framework's error, naming the app", async () => {
  defineApp("ZCL_JS_VB_BROKEN", class {
    main(client) {
      if (client.check_on_navigated()) {
        client.view_display(z2ui5_cl_ui5_view_builder.factory().a({ n: "text", v: "no element yet" }).stringify());
      }
    }
  });
  const r = await post(s.url, { app: "ZCL_JS_VB_BROKEN", user: "alice" });
  assert.equal(r.status, 500);
  assert.match(r.text, /ZCL_JS_VB_BROKEN/);
  assert.match(r.text, /VIEW_BUILDER_ERROR - a\( n = 'text' \) on the empty builder root/);
});

test("escape_literal( ) is the ABAP method's, character for character", async () => {
  const VB = abap.Classes["Z2UI5_CL_UI5_VIEW_BUILDER"];
  for (const v of ["plain", "", "{a}", "a}b{", "C:\\temp\\file", "\\\\server\\share", "{}\\", "mixed {x} and \\y"]) {
    const upstream = String((await VB.escape_literal({ val: S(v) })).get());
    assert.equal(z2ui5_cl_ui5_view_builder.escape_literal(v), upstream, JSON.stringify(v));
    assert.equal(z2ui5_cl_ui5_view_builder.escape_literal({ val: v }), upstream, JSON.stringify(v));
  }
});
