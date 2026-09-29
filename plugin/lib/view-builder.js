// z2ui5_cl_ui5_view_builder - abap2UI5's view builder, for a JavaScript app.
//
//   const { defineApp, z2ui5_cl_ui5_view_builder } = require("@cap2ui5/cds-plugin");
//   const view = z2ui5_cl_ui5_view_builder.factory()
//       .ele({ n: "View", ns: "mvc" })
//           .a({ n: "xmlns", v: "sap.m" })
//           .a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" });
//   view.ele("Page")
//           .a({ n: "title", v: "Hello" })
//       .tag("Input")
//           .a({ n: "value", v: client._bind("name") })
//       .tag("Button")
//           .a({ n: "text", v: "Go" })
//           .a({ n: "press", v: client._event("GO") });
//   client.view_display(view.stringify());
//
// The ABAP class under its own name, with its public methods under theirs and
// called as the client is: ONE positional argument is the method's preferred
// parameter - `->ele( `Page` )` is `.ele("Page")` - and parameters by name are
// one object - `->a( n = `title` v = … )` is `.a({ n: "title", v: … })`. So an
// ABAP view ports line by line. The same one rule for a( ) holds: it lands on
// the element the chain points at - the child just added by ele( )/tag( ), or
// the node itself while it has no children.
//   ele( n, ns )     add a child element and DESCEND into it
//   tag( n, ns )     add a child element and STAY - the form for a leaf
//   a( n, v, b, t )  an attribute: v a string written as it is, b a boolean
//                    rendered true/false, t text that must render literally,
//                    braces and all - exactly one of the three
//   end( )           ascend to the parent
//   stringify( )     the XML - see there for why it is not a string yet
//
// HOST, NOT PORT: this file does not render anything. The app's chain is
// RECORDED - synchronously, like every other client call - and replayed after
// main( ) against the transpiled z2ui5_cl_ui5_view_builder the runtime
// carries: its XML, its escaping, its refusals (a( ) with none or two of v, b
// and t, an end( ) past the root, a duplicate attribute, a name that is no
// XML name) are upstream's, byte for byte what the same chain in an ABAP app
// produces. The only JavaScript of its own is escape_literal( ), three
// replaces that a synchronous chain cannot await - pinned to the ABAP method
// by view-builder.test.mjs.

const TREE = Symbol("cap2ui5.viewBuilder");
const ID = Symbol("id");
const PARENT = Symbol("parent");
const RENDER = Symbol("render");

const isPlainObject = (v) => v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype;

/** The methods' parameters as the ABAP class declares them - the preferred
 *  one first, "!" on those that are not OPTIONAL - read from a call as the
 *  client reads its calls (define-app.js, paramsOf). */
const SIGNATURES = { ele: "n! ns", tag: "n! ns", a: "n! v b t", escape_literal: "val!" };
function paramsOf(method, args) {
  const who = `z2ui5_cl_ui5_view_builder.${method}( )`;
  const params = SIGNATURES[method].split(" ");
  const names = params.map((n) => n.replace("!", ""));
  if (args.length > 1) {
    throw new Error(`${who}: one value for ${names[0]}, or the parameters by name as one object - ` +
      `{ ${names.join(", ")} }`);
  }
  const [first] = args;
  const out = {};
  if (first !== undefined && !isPlainObject(first)) out[names[0]] = first;
  else if (first !== undefined) {
    for (const [k, v] of Object.entries(first)) {
      if (!names.includes(k)) throw new Error(`${who}: no parameter "${k}" - { ${names.join(", ")} }`);
      if (v !== undefined) out[k] = v;
    }
  }
  const missing = params.filter((n) => n.endsWith("!")).map((n) => n.slice(0, -1))
    .filter((k) => out[k] === undefined || out[k] === null);
  if (missing.length) throw new Error(`${who}: ${missing.join(", ")} is not optional - { ${names.join(", ")} }`);
  return out;
}

class z2ui5_cl_ui5_view_builder {
  /** a new empty builder root - open the mvc:View element and declare the
   *  xmlns namespaces yourself, as in a real UI5 view */
  static factory() {
    return new z2ui5_cl_ui5_view_builder({ ops: [], count: 0 }, null);
  }

  /** Text that must render literally even inside an attribute that also
   *  carries a binding: backslashes and braces escaped, as UI5 reads them.
   *  For a whole value, a( { n, t } ) does the same. */
  static escape_literal(...args) {
    const s = String(paramsOf("escape_literal", args).val);
    if (!/[{}\\]/.test(s)) return s;
    return s.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
  }

  constructor(tree, parent) {
    Object.defineProperty(this, TREE, { value: tree });
    Object.defineProperty(this, ID, { value: tree.count++ });
    Object.defineProperty(this, PARENT, { value: parent });
  }

  ele(...args) {
    const { n, ns = "" } = paramsOf("ele", args);
    const child = new z2ui5_cl_ui5_view_builder(this[TREE], this);
    this[TREE].ops.push({ op: "ele", on: this[ID], out: child[ID], n: String(n), ns: String(ns) });
    return child;
  }

  tag(...args) {
    const { n, ns = "" } = paramsOf("tag", args);
    this[TREE].ops.push({ op: "tag", on: this[ID], n: String(n), ns: String(ns) });
    return this;
  }

  a(...args) {
    const { n, ...value } = paramsOf("a", args);
    this[TREE].ops.push({ op: "a", on: this[ID], n: String(n), value });
    return this;
  }

  end() {
    this[TREE].ops.push({ op: "end", on: this[ID] });
    // past the root there is no parent to hand back - the replay raises
    // there, as the ABAP end( ) does, with upstream's message
    return this[PARENT] ?? this;
  }

  /** The XML of the chain as it stands now - `view->stringify( )`. The
   *  class that renders it is upstream's and asynchronous here, so this
   *  answers a Rendering rather than the string: handed to
   *  client.view_display( ) or a sibling inside main( ), it renders after
   *  main( ) returns, as the builder itself does - so
   *  `client.view_display(view.stringify())` is the ABAP line. Anywhere
   *  else, await it for the string; a misuse then rejects with upstream's
   *  text as the message and the ABAP exception as its cause. */
  stringify() {
    return new Rendering(this, this[TREE].ops.length);
  }
}

/** What stringify( ) answers: the chain up to that call, rendered on first
 *  use - a thenable, so `await view.stringify()` is the string. Calls the
 *  chain makes afterwards are not in it, as they are not in the string the
 *  ABAP method returned. */
class Rendering {
  #builder;
  #upTo;
  #promise;

  constructor(builder, upTo) {
    this.#builder = builder;
    this.#upTo = upTo;
  }

  /** the render itself, upstream's exception as it is raised - what the
   *  flush awaits, so an error shows as the same chain's error in ABAP */
  [RENDER]() {
    return render(this.#builder, this.#upTo);
  }

  then(onFulfilled, onRejected) {
    this.#promise ??= this[RENDER]().catch(async (e) => {
      if (typeof e?.get_text !== "function") throw e;
      throw new Error(String((await e.get_text()).get()), { cause: e });
    });
    return this.#promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then().finally(onFinally);
  }

  // Not a string yet: in a template or a concatenation it would have been
  // "[object Object]" in the view, so it says what to do instead.
  [Symbol.toPrimitive]() {
    throw new TypeError(
      "view.stringify( ) is rendered after main( ) returns, so it is not a string inside main( ): " +
        "hand it to client.view_display( ) (or popup_display, nest_view_display, …) as it is, " +
        "or await it outside main( ).",
    );
  }
}

/** A builder, or what its stringify( ) answered, as the render the flush
 *  awaits; null for anything else, which is the XML itself. */
function renderOf(v) {
  if (v instanceof z2ui5_cl_ui5_view_builder) return render(v);
  if (v instanceof Rendering) return v[RENDER]();
  return null;
}

/** a( )'s v / b / t as the ABAP method's parameters - only those the app
 *  passed, so none or two of them are refused by the ABAP a( ) itself. null
 *  is not passed either: an ABAP string cannot be null, and "null" in the
 *  view would be a bug nobody sees. */
function valueParams(value) {
  const S = (v) => new abap.types.String({ qualifiedName: "STRING" }).set(String(v));
  const B = (v) => new abap.types.Character(1, { qualifiedName: "ABAP_BOOL" }).set(v ? "X" : " ");
  const out = {};
  if (value.v != null) out.v = S(value.v);
  if (value.b != null) out.b = B(value.b);
  if (value.t != null) out.t = S(value.t);
  return out;
}

/**
 * Replay the recorded chain against z2ui5_cl_ui5_view_builder and render it.
 * Every call is the ABAP method's, in the app's order, so a misuse raises
 * where the ABAP chain would - and the framework shows it as it shows any
 * ABAP app's error.
 */
async function render(builder, upTo = builder[TREE].ops.length) {
  const VB = abap.Classes["Z2UI5_CL_UI5_VIEW_BUILDER"];
  const S = (v) => new abap.types.String({ qualifiedName: "STRING" }).set(v);
  const refs = new Map([[0, await VB.factory()]]);
  for (const step of builder[TREE].ops.slice(0, upTo)) {
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

module.exports = { z2ui5_cl_ui5_view_builder, Rendering, renderOf, render };
