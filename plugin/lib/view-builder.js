// ViewBuilder - abap2UI5's z2ui5_cl_ui5_view_builder, for a JavaScript app.
//
//   const { defineApp, ViewBuilder } = require("cap2ui5");
//   const view = ViewBuilder.factory();
//   view.ele("View", "mvc")
//           .a("xmlns", "sap.m")
//           .a("xmlns:mvc", "sap.ui.core.mvc")
//       .ele("Page")
//           .a("title", "Hello")
//           .tag("Input")
//               .a("value", c.bind("name"))
//           .tag("Button")
//               .a("text", "Go")
//               .a("press", c.event("GO"));
//   c.view(view);
//
// The same concept and the same six verbs as the ABAP class, and the same
// one rule: a( ) lands on the element the chain points at - the child just
// added by ele( )/tag( ), or the node itself while it has no children.
//   ele(n, ns)  add a child element and DESCEND into it
//   tag(n, ns)  add a child element and STAY - the form for a leaf
//   a(n, value) an attribute: a string or number is `v`, a boolean is `b`
//               (true/false), { t: text } is `t` - text that must render
//               literally, braces and all
//   end( )      ascend to the parent
//
// HOST, NOT PORT: this file does not render anything. The app's chain is
// RECORDED - synchronously, like every other facade call - and replayed after
// main( ) against the transpiled z2ui5_cl_ui5_view_builder the runtime
// carries: its XML, its escaping, its refusals (an end( ) past the root, a
// duplicate attribute, a name that is no XML name) are upstream's, byte for
// byte what the same chain in an ABAP app produces. The only JavaScript of
// its own is escapeLiteral( ), three replaces that a synchronous chain cannot
// await - pinned to the ABAP method by view-builder.test.mjs.

const TREE = Symbol("cap2ui5.viewBuilder");
const ID = Symbol("id");
const PARENT = Symbol("parent");

class ViewBuilder {
  /** a new empty builder root - open the mvc:View element and declare the
   *  xmlns namespaces yourself, as in a real UI5 view */
  static factory() {
    return new ViewBuilder({ ops: [], count: 0 }, null);
  }

  /** Text that must render literally even inside an attribute that also
   *  carries a binding: backslashes and braces escaped, as UI5 reads them.
   *  For a whole value, a(n, { t: text }) does the same. */
  static escapeLiteral(val) {
    const s = String(val ?? "");
    if (!/[{}\\]/.test(s)) return s;
    return s.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
  }

  constructor(tree, parent) {
    Object.defineProperty(this, TREE, { value: tree });
    Object.defineProperty(this, ID, { value: tree.count++ });
    Object.defineProperty(this, PARENT, { value: parent });
  }

  ele(n, ns = "") {
    const child = new ViewBuilder(this[TREE], this);
    this[TREE].ops.push({ op: "ele", on: this[ID], out: child[ID], n: String(n), ns: String(ns ?? "") });
    return child;
  }

  tag(n, ns = "") {
    this[TREE].ops.push({ op: "tag", on: this[ID], n: String(n), ns: String(ns ?? "") });
    return this;
  }

  a(n, value) {
    this[TREE].ops.push({ op: "a", on: this[ID], n: String(n), value });
    return this;
  }

  end() {
    this[TREE].ops.push({ op: "end", on: this[ID] });
    // past the root there is no parent to hand back - the replay raises
    // there, as the ABAP end( ) does, with upstream's message
    return this[PARENT] ?? this;
  }

  /** The XML, rendered by upstream's builder. Asynchronous, unlike the ABAP
   *  method; inside main( ) hand the builder to c.view( ) instead - it
   *  renders after main( ) returns. A misuse rejects with upstream's text
   *  as the message and the ABAP exception as its cause. */
  async stringify() {
    try {
      return await render(this);
    } catch (e) {
      if (typeof e?.get_text !== "function") throw e;
      throw new Error(String((await e.get_text()).get()), { cause: e });
    }
  }
}

const isBuilder = (v) => v instanceof ViewBuilder;

/** a( )'s value as the ABAP method's v / b / t parameters */
function valueParams(value) {
  const S = (v) => new abap.types.String({ qualifiedName: "STRING" }).set(String(v));
  const B = (v) => new abap.types.Character(1, { qualifiedName: "ABAP_BOOL" }).set(v ? "X" : " ");
  if (typeof value === "boolean") return { b: B(value) };
  if (typeof value === "string" || typeof value === "number") return { v: S(value) };
  if (value && typeof value === "object") {
    const out = {};
    if ("v" in value) out.v = S(value.v);
    if ("b" in value) out.b = B(value.b);
    if ("t" in value) out.t = S(value.t);
    return out;                       // none of the three: the ABAP a( ) refuses
  }
  return {};                          // no value at all: the ABAP a( ) refuses
}

/**
 * Replay the recorded chain against z2ui5_cl_ui5_view_builder and render it.
 * Every call is the ABAP method's, in the app's order, so a misuse raises
 * where the ABAP chain would - and the framework shows it as it shows any
 * ABAP app's error.
 */
async function render(builder) {
  const VB = abap.Classes["Z2UI5_CL_UI5_VIEW_BUILDER"];
  const S = (v) => new abap.types.String({ qualifiedName: "STRING" }).set(v);
  const refs = new Map([[0, await VB.factory()]]);
  for (const step of builder[TREE].ops) {
    const self = refs.get(step.on).get();
    if (step.op === "ele") {
      refs.set(step.out, await self.ele({ n: S(step.n), ...(step.ns ? { ns: S(step.ns) } : {}) }));
    } else if (step.op === "tag") {
      await self.tag({ n: S(step.n), ...(step.ns ? { ns: S(step.ns) } : {}) });
    } else if (step.op === "a") {
      await self.a({ n: S(step.n), ...valueParams(step.value) });
    } else {
      await self.end();
    }
  }
  return String((await refs.get(0).get().stringify()).get());
}

module.exports = { ViewBuilder, isBuilder, render };
