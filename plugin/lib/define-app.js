// defineApp — write a cap2UI5 app as ordinary, SYNCHRONOUS JavaScript.
//
//   const { defineApp, t } = require("@cap2ui5/cds-plugin");
//   defineApp("ZCL_HELLO", class {
//     name = "";
//     books = t.table({ ID: 0, title: "", price: t.packed(9, 2) });
//     main(client) {                              // no async, no await
//       if (client.check_on_navigated()) {
//         client.view_display(`<Input value="${client._bind("name")}"/>
//                              <Button press="${client._event("GO")}"/>`);
//       } else if (client.check_on_event("GO")) {
//         client.message_box_display(`Hello ${this.name}`);
//       }
//     }
//   });
//
// THE CLIENT IS z2ui5_if_client, BY ITS OWN NAMES
//
// main( ) receives the client an ABAP app receives, spelled the JavaScript way
// and nothing else: `client->check_app_prev_stack( )` is
// `client.check_app_prev_stack()`. A method's preferred parameter is its one
// positional argument, `client->_event( `GO` )` → `client._event("GO")`, and
// parameters by name are one object, `client->_event( val = `GO` t_arg = … )`
// → `client._event({ val: "GO", t_arg: [ … ] })`. The constants are there as
// well, `client->cs_event-set_title` → `client.cs_event.set_title`. So an ABAP
// app ports line by line, and what abap2UI5's documentation says about a
// method is what the method does here.
//
// WHY THE APP CAN BE SYNCHRONOUS AT ALL
//
// Every method of the transpiled framework is `async`, but that is the
// transpiler's blanket rule, not a statement about I/O: _bind( ) and _event( )
// await nothing but their own internal calls — measured — and the draft is
// written long after main( ) returns. So nothing the app calls actually waits
// for the outside world, and JavaScript's inability to unwrap a promise
// synchronously is the only obstacle left. It is removed in two ways:
//
//   QUERIES  (check_on_navigated, get_event, _bind, _event, …) must answer a
//            value the app uses inline, so they cannot be deferred. The
//            lifecycle, the event and its arguments are resolved BEFORE
//            main( ) and handed over as plain values; a field's binding is
//            known without asking (boundPath) and registered after it. An
//            event wire cannot be - its names are invented by the app - so
//            _event( ) returns a PLACEHOLDER token and the real wire string is
//            substituted in afterwards, once the async call can be awaited.
//   COMMANDS (view_display, message_box_display, nav_app_call, …) do not
//            answer anything the app reads, so they are RECORDED synchronously
//            and replayed after main( ), in order.
//
// An `async main` still works — the wrapper awaits it either way — which is
// how an app reads the project's CDS entities: `await SELECT.from(Books)`.
//
// The one consequence worth knowing: between client._event("GO") and the
// flush, the string the app holds is a token, not the wire format. Embedding
// it in markup is what it is for and works; parsing or comparing it does not.
// The token is letters, digits and underscores only, so a view builder that
// XML-escapes attribute values passes it through unchanged.
//
// STATE
//
// The framework works on BOXED values (abap.types.*), and _bind( ) matches the
// value it is given by IDENTITY among the app's attributes — its signature has
// no name parameter. So a field must be a box, and `name = ""` must become one.
// defineApp boxes every declared field at construction, derives the ATTRIBUTES
// schema RTTI needs from the same pass, and gives main( ) a PROXY whose reads
// unwrap and whose writes write through. The boxes therefore stay on the
// instance, which is what keeps _bind( ) working.
//
// Structures and tables follow the same rule one level down: `{ a: "" }` is a
// structure, `t.table({ a: "" })` a table whose row is that structure, and a
// read hands the app plain objects / arrays of plain objects while a write
// rebuilds the rows. Component names are stored lowercase, as the transpiler
// does, and appear UPPERCASE in the model — a view binds `{TITLE}`.
const cds = require("@sap/cds");
const { t, isBoxed, shapeOf, initialOf, wrap, fieldNameError, abapName, isFrameworkField } = require("./app/types");
const { z2ui5_if_client } = require("./app/interface");
const { MAIN_TIMEOUT, limits, configure, within } = require("./app/timeout");
const { before } = require("./app/before");
const { roundtripState, createClient } = require("./app/client");
const { instanceProxy } = require("./app/proxy");
const { flush } = require("./app/flush");

const LOG = cds.log("cap2ui5");

/** Where an app's `agent` option is kept on its class, as the app gave it -
 *  a global symbol, which @cap2ui5/agent reads and checks (its lib/policy.js
 *  declared( )); nothing here needs that package. */
const AGENT = Symbol.for("cap2ui5.agent");

/** A #private member used in main( ) or a method it calls: `this` there is
 *  the proxy that unwraps the fields, and JavaScript lets only the instance
 *  itself through a private name - V8 says "Cannot read private member #x
 *  from an object whose class did not declare it" and nothing about why. It
 *  cannot be bound through: a private name is not a property a proxy sees,
 *  and neither would the draft see it - a #field is not kept from one
 *  roundtrip to the next. So it is refused, saying what to write instead: a
 *  plain field is not part of the model until the app binds it. */
function privateMemberError(e, app) {
  if (!(e instanceof TypeError)) return null;
  const m = /private member (#[\w$]+)|Receiver must be an instance of class|Object must be an instance of class/.exec(e.message);
  if (!m) return null;
  return new TypeError(
    `defineApp(${app}): ${m[1] ?? "a #private method"} - private class members are not supported in an app: ` +
      `main( ) and the methods it calls run on a proxy of the instance, which a private name does not ` +
      `reach, and a #field would not be kept in the draft either. Use a plain field - it is not sent to ` +
      `the browser unless main( ) binds it - or a module-level function instead of a #method. (${e.message})`,
    { cause: e },
  );
}

// --------------------------------------------------------------------- the wrap
/** The names defineApp( ) registered, in the order it saw them - what the
 *  startup hints list (lib/hints.js). */
const defined = [];

/** @returns {string[]} the app names registered so far */
function definedApps() {
  return [...defined];
}

/** Marks a class defineApp( ) registered - a global symbol, so that a second
 *  copy of the plugin recognises the first one's apps. */
const DEFINED = Symbol.for("cap2ui5.defineApp");

function defineApp(name, cls, opts = {}) {
  const INTERNAL = String(name).toUpperCase();
  // abap.Classes is the runtime's class registry, framework and all: an app
  // named Z2UI5_CL_UTIL replaced the framework's utility class and broke
  // every roundtrip of every app. A name defineApp( ) registered before may
  // be registered again - that is how an app is replaced.
  const existing = globalThis.abap?.Classes?.[INTERNAL];
  if (existing && !existing[DEFINED]) {
    throw new Error(`defineApp(${INTERNAL}): the abap2UI5 runtime has a class of that name already - part of the ` +
      `framework, one of its apps, or the plugin's own - and replacing it would change what every roundtrip ` +
      `runs. Choose another name.`);
  }
  const userMain = cls.prototype.main ?? cls.prototype.z2ui5_if_app$main;
  if (typeof userMain !== "function") {
    throw new Error(`defineApp(${INTERNAL}): the class needs a main( client ) method`);
  }

  class App extends cls {
    constructor(...a) {
      super(...a);
      const attrs = {};
      const shapes = {};
      const initial = {};
      const undecidable = [];
      for (const [f, v] of Object.entries(this)) {
        if (typeof v === "function") continue;
        let shape;
        try { shape = shapeOf(v, [f]); } catch (e) { undecidable.push(e.message); continue; }
        if (!shape) { undecidable.push(`${f} has no ABAP type`); continue; }
        if (f !== f.toLowerCase()) throw new Error(fieldNameError(INTERNAL, f));
        this[f] = shape.make();                 // initial - the initializer is constructor_( )'s
        shapes[f] = shape;
        if (initialOf(v) !== undefined) initial[f] = initialOf(v);
        attrs[abapName(f)] = { type: shape.make, visibility: "U", is_constant: " ", is_class: " " };
      }
      for (const f of ["z2ui5_if_app$id_draft", "z2ui5_if_app$id_app"]) {
        if (!isBoxed(this[f])) this[f] = t.string();
        attrs[abapName(f)] = { type: t.string, visibility: "U", is_constant: " ", is_class: " " };
      }
      App.ATTRIBUTES = attrs;
      Object.defineProperty(this, "__shapes", { value: shapes, enumerable: false });
      Object.defineProperty(this, "__initial", { value: initial, enumerable: false });
      if (undecidable.length) {
        LOG.warn(
          `defineApp ${INTERNAL}: these fields are NOT part of the model —\n  ` +
            undecidable.join("\n  ") +
            `\n  Give an initial value, or declare it with t.table(…) / t.struct(…) / ` +
            `t.packed(…) / t.char(…). The app runs without them.`,
        );
      }
    }

    /** The ABAP constructor: the framework runs it when it CREATES the app,
     *  and the draft restore does not (see withInitial). */
    async constructor_() {
      for (const [f, v] of Object.entries(this.__initial)) wrap(this[f], v, this.__shapes[f], `this.${f}`);
      return this;
    }

    async z2ui5_if_app$main(input) {
      const c = input.client.get();
      const rt = roundtripState(c, this, await before(c), isFrameworkField);
      const { plain, writeBack } = instanceProxy(this);
      rt.plain = plain;
      const client = createClient(rt);
      try {
        const running = userMain.call(plain, client);
        // await: an async main still works - within the time it may take
        if (limits.timeout && typeof running?.then === "function") await within(running, limits.timeout, INTERNAL);
        else await running;
        writeBack();
      } catch (e) {
        throw privateMemberError(e, INTERNAL) ?? e;
      }
      await flush(rt);
    }
  }

  App.INTERNAL_TYPE = "CLAS";
  App.INTERNAL_NAME = INTERNAL;
  App[DEFINED] = true;
  if (opts.agent !== undefined) App[AGENT] = opts.agent;
  App.IMPLEMENTED_INTERFACES = opts.interfaces ?? ["Z2UI5_IF_APP", "IF_SERIALIZABLE_OBJECT"];
  App.METHODS = {};
  App.ATTRIBUTES = {};
  new App();                                     // fills ATTRIBUTES before first use
  abap.Classes[INTERNAL] = App;
  if (!defined.includes(INTERNAL)) defined.push(INTERNAL);
  return App;
}

module.exports = { defineApp, definedApps, t, shapeOf, z2ui5_if_client, configure, MAIN_TIMEOUT };
