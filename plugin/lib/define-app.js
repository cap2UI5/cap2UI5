// defineApp — write a cap2UI5 app as ordinary, SYNCHRONOUS JavaScript.
//
//   const { defineApp, t } = require("cap2ui5");
//   defineApp("ZCL_HELLO", class {
//     name = "";
//     books = t.table({ ID: 0, title: "", price: t.packed(9, 2) });
//     main(c) {                                   // no async, no await
//       if (c.isInitial) {
//         c.view(`<Input value="${c.bind("name")}"/>
//                 <Button press="${c.event("GO")}"/>`);
//       } else if (c.eventName === "GO") {
//         c.messageBox(`Hello ${this.name}`);
//       }
//     }
//   });
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
//   QUERIES  (bind, event, isInitial, eventName) must answer a value the app
//            uses inline, so they cannot be deferred. `isInitial`, `eventName`
//            and every bind path are resolved BEFORE main( ) and handed over as
//            plain values. `event` cannot be — its names are invented by the
//            app — so it returns a PLACEHOLDER token and the real wire string
//            is substituted in afterwards, once the async call can be awaited.
//   COMMANDS (view, messageBox, modelUpdate, …) do not answer anything the app
//            reads, so they are RECORDED synchronously and replayed after
//            main( ), in order.
//
// An `async main` still works — the wrapper awaits it either way — which is
// how an app reads the project's CDS entities: `await SELECT.from(Books)`.
//
// The one consequence worth knowing: between c.event("GO") and the flush, the
// string the app holds is a token, not the wire format. Embedding it in markup
// is what it is for and works; parsing or comparing it does not.
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
// (An earlier draft replaced the fields with plain values instead of proxying
// them, and _bind( ) answered BINDING_ERROR — rightly: the box was no longer an
// attribute of the object, so there was nothing left to match by identity.)
//
// Structures and tables follow the same rule one level down: `{ a: "" }` is a
// structure, `t.table({ a: "" })` a table whose row is that structure, and a
// read hands the app plain objects / arrays of plain objects while a write
// rebuilds the rows. Component names are stored lowercase, as the transpiler
// does, and appear UPPERCASE in the model — a view binds `{TITLE}`.

// ---------------------------------------------------------------- type mapping
//
// Narrow on purpose, and it refuses rather than guesses. Numbers are the real
// ambiguity — ABAP has I, P and F and they render differently — so an integer
// becomes I, a fractional number F, and a decimal amount has to say so with
// t.packed(). Guessing silently produces views with the wrong number of
// decimals and nothing to point at.
const STANDARD_TABLE = {
  withHeader: false, keyType: "DEFAULT",
  primaryKey: { isUnique: false, type: "STANDARD", keyFields: [], name: "primary_key" },
  secondary: [],
};

const t = {
  string: () => new abap.types.String({ qualifiedName: "STRING" }),
  int: () => new abap.types.Integer({ qualifiedName: "I" }),
  float: () => new abap.types.Float({ qualifiedName: "F" }),
  bool: () => new abap.types.Character(1, { qualifiedName: "ABAP_BOOL", ddicName: "ABAP_BOOL" }),
  char: (len) => new abap.types.Character(len, {}),
  packed: (length, decimals) => new abap.types.Packed({ length, decimals, qualifiedName: "P" }),
  /** A structure: `t.struct({ street: "", zip: 0 })`. A plain object field is one implicitly. */
  struct: (fields) => declared(structFor(fields)),
  /** A table of structures: `t.table({ ID: 0, title: "" })` - the argument is one ROW. */
  table: (row) => declared(tableFor(row)),
};

const isBoxed = (v) =>
  v !== null && typeof v === "object" && typeof v.get === "function" && typeof v.set === "function";
const isPlainObject = (v) => v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype;

// A "shape" says how a value crosses between the app and its box:
//   { k: "string" | "number" | "bool" | "boxed" }            scalar
//   { k: "struct", fields: { <appKey>: { key, shape } } }    key = lowercase component
//   { k: "table",  fields }                                  one row = that structure
// `make()` builds a fresh box of the shape - what ATTRIBUTES.type() must do on
// every call, because RTTI and the deserializer construct from it.
function shapeOf(v, path = []) {
  if (typeof v === "string") return { k: "string", make: () => t.string().set(v) };
  if (typeof v === "boolean") return { k: "bool", make: () => t.bool().set(v ? "X" : " ") };
  if (typeof v === "number") {
    return Number.isInteger(v)
      ? { k: "number", make: () => t.int().set(v) }
      : { k: "number", make: () => t.float().set(v) };
  }
  if (isBoxed(v)) {
    if (v.__shape) return v.__shape;                        // t.struct / t.table
    return { k: "boxed", make: () => v.clone ? v.clone() : v };
  }
  if (Array.isArray(v)) return v.length && isPlainObject(v[0]) ? tableFor(v[0], path).__shape : null;
  if (isPlainObject(v)) return structFor(v, path).__shape;
  return null;
}

/** A structure's components, which may themselves be structures or tables.
 *  The depth limit is a cycle guard, not a judgement: an object that contains
 *  itself would otherwise recurse until the stack goes, and the message a
 *  stack overflow leaves behind names nothing an app author can act on. */
const MAX_DEPTH = 8;
function fieldsOf(obj, path = []) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    const here = [...path, k];
    if (here.length > MAX_DEPTH) {
      // Reported by the PATH, not by a message wrapped once per level: the
      // path says `order.customer.self.self.…`, which names the cycle, where
      // nine nested prefixes only said that something went wrong nine times.
      throw new Error(
        `${here.join(".")} is nested more than ${MAX_DEPTH} levels deep. ` +
          `If that is a cycle - an object that contains itself - it cannot be a ` +
          `model; if it is not, flatten it, because a view cannot bind that deep.`,
      );
    }
    const shape = shapeOf(v, here);
    if (!shape) {
      throw new Error(
        `${here.join(".")} has no ABAP type: null, undefined and an empty array ` +
          `carry none. Give it a value, or declare it with t.table(…) / t.packed(…).`,
      );
    }
    fields[k] = { key: k.toLowerCase(), shape };
  }
  return fields;
}
const structBox = (fields) =>
  new abap.types.Structure(
    Object.fromEntries(Object.values(fields).map(({ key, shape }) => [key, shape.make()])),
    undefined, undefined, {}, {});

function structFor(obj, path = []) {
  const fields = fieldsOf(obj, path);
  const shape = { k: "struct", fields, make: () => structBox(fields) };
  return Object.defineProperty(shape.make(), "__shape", { value: shape });
}
function tableFor(row, path = []) {
  const fields = fieldsOf(row, path);
  const shape = { k: "table", fields,
    make: () => abap.types.TableFactory.construct(structBox(fields), STANDARD_TABLE, "") };
  return Object.defineProperty(shape.make(), "__shape", { value: shape });
}
const declared = (box) => box;

/** box -> plain value, for the app to read. ABAP has no boolean; abap_bool is an "X" / " " flag. */
function unwrap(box, shape) {
  switch (shape.k) {
    case "bool": return box.get() === "X";
    case "struct": return rowToPlain(box, shape.fields);
    case "table": return box.array().map((r) => rowToPlain(r, shape.fields));
    default: return box.get();
  }
}
/** plain value -> box, for the app's writes. */
function wrap(box, value, shape) {
  switch (shape.k) {
    case "bool": box.set(value ? "X" : " "); break;
    case "struct": plainToRow(box, value ?? {}, shape.fields); break;
    case "table": {
      box.clear();
      for (const row of value ?? []) {
        const r = box.getRowType().clone();
        plainToRow(r, row, shape.fields);
        box.append(r);
      }
      break;
    }
    default: box.set(value);
  }
}
const rowToPlain = (row, fields) =>
  Object.fromEntries(Object.entries(fields).map(([k, { key, shape }]) => [k, unwrap(row.get()[key], shape)]));
function plainToRow(row, value, fields) {
  const comps = row.get();
  for (const [k, { key, shape }] of Object.entries(fields)) {
    if (value[k] === undefined || value[k] === null) continue;      // keep the initial value
    wrap(comps[key], value[k], shape);
  }
}

/** A defineApp instance's declared fields as plain values. Anything else -
 *  an ABAP app, or nothing - is handed back as it came, because there is no
 *  shape to read it by and guessing one would be worse than saying so. */
function readState(instance) {
  const shapes = instance?.__shapes;
  if (!shapes) return instance ?? null;
  const out = {};
  for (const [f, shape] of Object.entries(shapes)) out[f] = unwrap(instance[f], shape);
  return out;
}

/** `name` -> NAME, `z2ui5_if_app$id_draft` -> Z2UI5_IF_APP~ID_DRAFT. */
const abapName = (f) => f.toUpperCase().replace(/\$/g, "~");
const isFrameworkField = (f) => f.includes("$");

// --------------------------------------------------------------------- the wrap
function defineApp(name, cls, opts = {}) {
  const INTERNAL = String(name).toUpperCase();
  const userMain = cls.prototype.main ?? cls.prototype.z2ui5_if_app$main;
  if (typeof userMain !== "function") {
    throw new Error(`defineApp(${INTERNAL}): the class needs a main( client ) method`);
  }

  class App extends cls {
    constructor(...a) {
      super(...a);
      const attrs = {};
      const shapes = {};
      const undecidable = [];
      for (const [f, v] of Object.entries(this)) {
        if (typeof v === "function") continue;
        let shape;
        try { shape = shapeOf(v, [f]); } catch (e) { undecidable.push(e.message); continue; }
        if (!shape) { undecidable.push(`${f} has no ABAP type`); continue; }
        this[f] = isBoxed(v) ? v : shape.make();
        shapes[f] = shape;
        attrs[abapName(f)] = { type: shape.make, visibility: "U", is_constant: " ", is_class: " " };
      }
      for (const f of ["z2ui5_if_app$id_draft", "z2ui5_if_app$id_app"]) {
        if (!isBoxed(this[f])) this[f] = t.string();
        attrs[abapName(f)] = { type: t.string, visibility: "U", is_constant: " ", is_class: " " };
      }
      App.ATTRIBUTES = attrs;
      Object.defineProperty(this, "__shapes", { value: shapes, enumerable: false });
      if (undecidable.length) {
        console.warn(
          `[defineApp] ${INTERNAL}: these fields are NOT part of the model —\n  ` +
            undecidable.join("\n  ") +
            `\n  Give an initial value, or declare it with t.table(…) / t.struct(…) / ` +
            `t.packed(…) / t.char(…). The app runs without them.`,
        );
      }
    }

    async constructor_() { return this; }

    async z2ui5_if_app$main(input) {
      const c = input.client.get();
      const S = (v = "") => new abap.types.String().set(String(v));
      const shapes = this.__shapes;

      // ---- resolve the queries that CAN be resolved up front ---------------
      //
      // The two lifecycle predicates are NOT interchangeable, and the wrong one
      // is the framework's most common app bug (z2ui5_if_client's own ABAP Doc
      // says so):
      //
      //   isFirstRun  check_on_init( )      - the first roundtrip of THIS app
      //               INSTANCE and only that one. Seed state here.
      //   isDisplay   check_on_navigated( ) - true on the first roundtrip AND
      //               every time the app gets the screen back: a called app
      //               leaving, a value help closing, a bookmark restored.
      //               RENDER here.
      //
      // isFirstRun implies isDisplay, so `if (c.isDisplay) c.view(…)` is the
      // whole display condition - no `||` with isFirstRun. An app that renders
      // only on isFirstRun works perfectly until something navigates back into
      // it, and then leaves the previous screen standing with no error at all.
      const truthy = async (p) => abap.compare.initial(await p) === false;
      const isFirstRun = await truthy(c.z2ui5_if_client$check_on_init({ result: 1 }));
      const isDisplay = await truthy(c.z2ui5_if_client$check_on_navigated({ result: 1 }));
      const canGoBack = await truthy(c.z2ui5_if_client$check_app_prev_stack({ result: 1 }));
      const eventName = String((await c.z2ui5_if_client$get({ result: 1 })).get().event.get()).trim();
      // Event arguments are indexed and the app picks by index, which a
      // synchronous facade cannot resolve on demand - so the first ARG_LIMIT
      // are fetched up front. The framework's own wires never pass more; an app
      // that needs a longer list has c.raw.
      const ARG_LIMIT = 8;
      const eventArgs = [];
      for (let i = 1; i <= ARG_LIMIT; i++) {
        eventArgs.push(String((await c.z2ui5_if_client$get_event_arg({ v: i, result: 1 })).get()));
      }
      // The instance on the other side of the last navigation: inside a called
      // app the caller, and back in the caller after navBack( ) the app that
      // just returned - which is how a called app's RESULT is read. Unwrapped
      // to plain values when it is a defineApp app; handed over as the raw
      // instance when it is an ABAP one, which the app can still read.
      const prevRef = await c.z2ui5_if_client$get_app_prev({ result: 1 });
      const prevApp = readState(abap.compare.initial(prevRef) ? null : prevRef.get());
      const paths = {};
      for (const f of Object.keys(shapes)) {
        if (isFrameworkField(f)) continue;
        paths[f] = (await c.z2ui5_if_client$_bind({ val: this[f], result: 1 })).get();
      }

      // ---- the synchronous surface the app sees ----------------------------
      const TOK = (n) => `\u0000z2ui5:evt:${n}\u0000`;
      const events = new Map();               // token key -> { name, args }
      const queue = [];
      const facade = {
        // -- lifecycle (see the comment above; they are not the same question)
        isFirstRun,
        isDisplay,
        canGoBack,                               // check_app_prev_stack - guard navBack( ) with it
        prevApp,                                 // the app on the other side of the last navigation
        eventName,                               // the event this roundtrip answers; "" on a start
        eventArg(i) {
          if (!Number.isInteger(i) || i < 1 || i > ARG_LIMIT) {
            throw new Error(
              `c.eventArg(${i}): the first ${ARG_LIMIT} arguments are resolved up front; ` +
                `for more, read them through c.raw.`,
            );
          }
          return eventArgs[i - 1];
        },

        // -- binding and events
        bind(field) {
          if (!(field in paths)) {
            throw new Error(
              `c.bind("${field}"): not a bindable field of this app — ` +
                `known: ${Object.keys(paths).join(", ") || "(none)"}`,
            );
          }
          return paths[field];
        },
        /** The wire string for an event. `args` travel with it and come back
         *  as c.eventArg(1..n) - which is how two buttons can fire ONE event
         *  and still be told apart. Without them the handler cannot know which
         *  control fired: the browser sends only what the wire carries. */
        event(n, args = []) {
          const key = JSON.stringify([String(n), args.map(String)]);
          events.set(key, { name: String(n), args: args.map(String) });
          return TOK(key);
        },

        // -- what to put on the screen (recorded, replayed in order after main)
        view(xml) { queue.push(["view", xml]); },
        popup(xml) { queue.push(["popup", xml]); },
        popupClose() { queue.push(["popup_destroy"]); },
        /** A fragment rendered INTO a control of the main view, which stays as
         *  it is - only the fragment re-renders on the next call. It shares the
         *  main view's model, so bind( ) and event( ) work in it as anywhere.
         *  `into` is the id of the receiving control; `insert`/`clear` are the
         *  UI5 mutators for its aggregation - addContent/removeAllContent for a
         *  Page or VBox, addItem/removeAllItems for a List. Without `clear`
         *  every call adds one more fragment. */
        nest(into, xml, { insert = "addContent", clear = "removeAllContent" } = {}) {
          queue.push(["nest", xml, { id: String(into), insert, clear }]);
        },
        /** There is ONE nested slot and nest_view_destroy( ) takes no argument:
         *  it clears that slot, not a named one. */
        nestClose() { queue.push(["nest_destroy"]); },
        messageBox(text) { queue.push(["box", text]); },
        messageToast(text) { queue.push(["toast", text]); },

        // -- navigation. Both are scheduled for the end of the roundtrip by the
        //    framework, so they are usually the last thing a branch does.
        /** Show another app on top of this one; it comes back through navBack( ). */
        navTo(app) { queue.push(["nav_call", app]); },
        /** Hand the screen back to whoever called this app. Guard with canGoBack. */
        navBack(opts) { queue.push(["nav_leave", opts ?? {}]); },

        raw: c,                                  // escape hatch, still async
      };
      // isInitial was this facade's name for check_on_navigated( ), which reads
      // like check_on_init( ) and is not it. Rather than silently change what a
      // name means, it is gone and says where to go.
      Object.defineProperty(facade, "isInitial", {
        get() {
          throw new Error(
            "c.isInitial is gone because the name lied: it was check_on_navigated( ). " +
              "Use c.isDisplay to RENDER (true on the first roundtrip and on every " +
              "return from a navigation or a value help) and c.isFirstRun to seed " +
              "state once (check_on_init( ), the first roundtrip of this instance).",
          );
        },
      });
      // view_model_update( ) and its popup/nest siblings are documented as
      // obsolete and do NOTHING - changed bound data is pushed automatically.
      Object.defineProperty(facade, "modelUpdate", {
        get() {
          throw new Error(
            "c.modelUpdate( ) is gone: z2ui5_if_client=>view_model_update( ) is obsolete " +
              "and does nothing. Changed bound data is pushed to the view - and to an open " +
              "popup or nested view - on its own.",
          );
        },
      });

      // ---- run the app: no async needed on its side ------------------------
      const plain = new Proxy(this, {
        get(tgt, prop, recv) {
          const v = Reflect.get(tgt, prop, recv);
          if (typeof prop === "string" && shapes[prop]) return unwrap(v, shapes[prop]);
          return typeof v === "function" ? v.bind(tgt) : v;
        },
        set(tgt, prop, value) {
          if (typeof prop === "string" && shapes[prop]) {
            wrap(tgt[prop], value, shapes[prop]);
            return true;
          }
          return Reflect.set(tgt, prop, value);
        },
      });
      await userMain.call(plain, facade);        // await: an async main still works

      // ---- flush: resolve the event tokens, then replay the commands -------
      const wire = {};
      for (const [key, { name, args }] of events) {
        const input = { val: S(name), result: 1 };
        if (args.length) {
          const t = abap.types.TableFactory.construct(
            new abap.types.String({ qualifiedName: "STRING" }), STANDARD_TABLE, "");
          for (const a of args) t.append(new abap.types.String().set(a));
          input.t_arg = t;
        }
        wire[TOK(key)] = (await c.z2ui5_if_client$_event(input)).get();
      }
      const subst = (s) => {
        let out = String(s);
        for (const [tok, real] of Object.entries(wire)) out = out.split(tok).join(real);
        return out;
      };
      /** nav_app_call( ) wants a BOUND z2ui5_if_app instance. The app may hand
       *  over a registered name, a defineApp class, or an instance it built
       *  itself; an unbound reference raises NAV_APP_TARGET_NOT_BOUND, so a
       *  name that resolves to nothing is refused here, where the app can see
       *  which name it was. */
      const appRef = async (app) => {
        let instance = app;
        if (typeof app === "string" || typeof app === "function") {
          const Cls = typeof app === "function" ? app : abap.Classes[app.toUpperCase()];
          if (!Cls) {
            throw new Error(
              `c.navTo("${app}"): no app of that name is registered. ` +
                `Known: ${Object.keys(abap.Classes).filter((k) => k.startsWith("Z")).slice(0, 20).join(", ")}…`,
            );
          }
          instance = await new Cls().constructor_();
        }
        const ref = new abap.types.ABAPObject({ qualifiedName: "Z2UI5_IF_APP" });
        ref.set(instance);
        return ref;
      };

      for (const [kind, arg, id] of queue) {
        if (kind === "view") await c.z2ui5_if_client$view_display({ val: S(subst(arg)) });
        else if (kind === "popup") await c.z2ui5_if_client$popup_display({ val: S(subst(arg)) });
        else if (kind === "popup_destroy") await c.z2ui5_if_client$popup_destroy();
        else if (kind === "nest") {
          await c.z2ui5_if_client$nest_view_display({
            val: S(subst(arg)), id: S(id.id),
            method_insert: S(id.insert), method_destroy: S(id.clear),
          });
        } else if (kind === "nest_destroy") await c.z2ui5_if_client$nest_view_destroy();
        else if (kind === "box") await c.z2ui5_if_client$message_box_display({ text: S(subst(arg)) });
        else if (kind === "toast") await c.z2ui5_if_client$message_toast_display({ text: S(subst(arg)) });
        else if (kind === "nav_call") {
          await c.z2ui5_if_client$nav_app_call({ app: await appRef(arg), result: 1 });
        } else if (kind === "nav_leave") {
          const o = arg ?? {};
          const input = { result: 1 };
          if (o.app !== undefined) input.app = await appRef(o.app);
          if (o.event !== undefined) input.event = S(o.event);
          if (o.data !== undefined) input.r_data = S(typeof o.data === "string" ? o.data : JSON.stringify(o.data));
          await c.z2ui5_if_client$nav_app_leave(input);
        }
      }
    }
  }

  App.INTERNAL_TYPE = "CLAS";
  App.INTERNAL_NAME = INTERNAL;
  App.IMPLEMENTED_INTERFACES = opts.interfaces ?? ["Z2UI5_IF_APP", "IF_SERIALIZABLE_OBJECT"];
  App.METHODS = {};
  App.ATTRIBUTES = {};
  new App();                                     // fills ATTRIBUTES before first use
  abap.Classes[INTERNAL] = App;
  return App;
}

module.exports = { defineApp, t, shapeOf };
