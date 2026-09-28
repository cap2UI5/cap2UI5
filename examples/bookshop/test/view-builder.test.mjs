// ViewBuilder - abap2UI5's z2ui5_cl_ui5_view_builder for a JavaScript app.
//
// The claim this file holds the plugin to: a view built with ViewBuilder is
// the view the same chain builds in an ABAP app - rendered, escaped and
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
const { ViewBuilder, defineApp } = require("cap2ui5");
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
  const view = ViewBuilder.factory();
  view.ele("View", "mvc")
          .a("xmlns", "sap.m")
          .a("xmlns:f", "sap.f")
      .ele("Page")
          .a("title", `A & B <"quoted">`)
          .a("showHeader", false)
          .tag("Text")
              .a("text", { t: "{not a binding} \\ ok" })
          .ele("Card", "f")
              .a("width", 300)
          .end()
          .tag("Button")
              .a("text", "line1\nline2");
  const xml = await view.stringify();
  assert.equal(xml, await abapChain());
  // and what that means, spelled out once
  assert.match(xml, /title="A &amp; B &lt;&quot;quoted&quot;&gt;"/);
  assert.match(xml, /showHeader="false"/);
  assert.match(xml, /<Text text="\\\{not a binding\\\} \\\\ ok"\/>/);
  assert.match(xml, /<f:Card width="300"\/><Button text="line1&#xA;line2"\/>/);
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

test("c.popup( ) and c.nest( ) take a builder too", async () => {
  defineApp("ZCL_JS_VB_SLOTS", class {
    main(c) {
      if (c.isDisplay) {
        c.view(ViewBuilder.factory()
          .ele("View", "mvc").a("xmlns", "sap.m").a("xmlns:mvc", "sap.ui.core.mvc")
          .ele("Page").a("id", "host"));
        return;
      }
      if (c.eventName === "POPUP") {
        c.popup(ViewBuilder.factory()
          .ele("FragmentDefinition", "core").a("xmlns", "sap.m").a("xmlns:core", "sap.ui.core")
          .ele("Dialog").a("title", "from the builder"));
      }
      if (c.eventName === "NEST") {
        c.nest("host", ViewBuilder.factory()
          .ele("View", "mvc").a("xmlns", "sap.m").a("xmlns:mvc", "sap.ui.core.mvc")
          .tag("Text").a("text", "nested"));
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
    const view = ViewBuilder.factory();
    build(view);
    await assert.rejects(view.stringify(), (e) => {
      assert.match(e.message, /^VIEW_BUILDER_ERROR - /, e.message);
      assert.ok(e.message.includes(words), e.message);
      return true;
    });
  };
  await refused((v) => v.ele("View", "mvc").end().end(), "end( ) past the root");
  await refused((v) => v.a("text", "x"), "on the empty builder root");
  await refused((v) => v.ele("Page").a("title", "a").a("title", "b"), "duplicate attribute 'title'");
  await refused((v) => v.ele("Page").a("visible"), "without a value");
  await refused((v) => v.ele("Page").a("title", { v: "x", t: "y" }), "more than one of v, b and t");
  await refused((v) => v.ele(`te"xt`), "is not a valid XML name");
});

test("in an app, a misuse answers as it does in an ABAP app - the framework's error, naming the app", async () => {
  defineApp("ZCL_JS_VB_BROKEN", class {
    main(c) {
      if (c.isDisplay) c.view(ViewBuilder.factory().a("text", "no element yet"));
    }
  });
  const r = await post(s.url, { app: "ZCL_JS_VB_BROKEN", user: "alice" });
  assert.equal(r.status, 500);
  assert.match(r.text, /ZCL_JS_VB_BROKEN/);
  assert.match(r.text, /VIEW_BUILDER_ERROR - a\( n = 'text' \) on the empty builder root/);
});

test("escapeLiteral( ) is the ABAP method's, character for character", async () => {
  const VB = abap.Classes["Z2UI5_CL_UI5_VIEW_BUILDER"];
  for (const v of ["plain", "", "{a}", "a}b{", "C:\\temp\\file", "\\\\server\\share", "{}\\", "mixed {x} and \\y"]) {
    const upstream = String((await VB.escape_literal({ val: S(v) })).get());
    assert.equal(ViewBuilder.escapeLiteral(v), upstream, JSON.stringify(v));
  }
});
