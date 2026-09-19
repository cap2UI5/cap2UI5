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
function shapeOf(v) {
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
  if (Array.isArray(v)) return v.length && isPlainObject(v[0]) ? tableFor(v[0]).__shape : null;
  if (isPlainObject(v)) return structFor(v).__shape;
  return null;
}

function fieldsOf(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    const shape = shapeOf(v);
    if (!shape || shape.k === "struct" || shape.k === "table") {
      throw new Error(`cannot type component "${k}": a structure component must be a scalar`);
    }
    fields[k] = { key: k.toLowerCase(), shape };
  }
  return fields;
}
const structBox = (fields) =>
  new abap.types.Structure(
    Object.fromEntries(Object.values(fields).map(({ key, shape }) => [key, shape.make()])),
    undefined, undefined, {}, {});

function structFor(obj) {
  const fields = fieldsOf(obj);
  const shape = { k: "struct", fields, make: () => structBox(fields) };
  return Object.defineProperty(shape.make(), "__shape", { value: shape });
}
function tableFor(row) {
  const fields = fieldsOf(row);
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
        try { shape = shapeOf(v); } catch (e) { undecidable.push(`${f} (${e.message})`); continue; }
        if (!shape) { undecidable.push(f); continue; }
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
          `[defineApp] ${INTERNAL}: cannot type ${undecidable.join(", ")} — ` +
            `null/undefined and empty arrays carry no ABAP type. Give an initial value, ` +
            `or declare it with t.table(…) / t.struct(…) / t.packed(…) / t.char(…).`,
        );
      }
    }

    async constructor_() { return this; }

    async z2ui5_if_app$main(input) {
      const c = input.client.get();
      const S = (v = "") => new abap.types.String().set(String(v));
      const shapes = this.__shapes;

      // ---- resolve the queries that CAN be resolved up front ---------------
      const isInitial =
        abap.compare.initial(await c.z2ui5_if_client$check_on_navigated({ result: 1 })) === false;
      const eventName = String((await c.z2ui5_if_client$get({ result: 1 })).get().event.get()).trim();
      const paths = {};
      for (const f of Object.keys(shapes)) {
        if (isFrameworkField(f)) continue;
        paths[f] = (await c.z2ui5_if_client$_bind({ val: this[f], result: 1 })).get();
      }

      // ---- the synchronous surface the app sees ----------------------------
      const TOK = (n) => `\u0000z2ui5:evt:${n}\u0000`;
      const events = new Set();
      const queue = [];
      const facade = {
        isInitial,
        eventName,                               // the event this roundtrip answers; "" on start
        bind(field) {
          if (!(field in paths)) {
            throw new Error(
              `c.bind("${field}"): not a bindable field of this app — ` +
                `known: ${Object.keys(paths).join(", ") || "(none)"}`,
            );
          }
          return paths[field];
        },
        event(n) { events.add(String(n)); return TOK(n); },
        view(xml) { queue.push(["view", xml]); },
        modelUpdate() { queue.push(["model"]); },   // push changed state to the view without re-rendering
        messageBox(text) { queue.push(["box", text]); },
        messageToast(text) { queue.push(["toast", text]); },
        raw: c,                                  // escape hatch, still async
      };

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
      for (const n of events) {
        wire[TOK(n)] = (await c.z2ui5_if_client$_event({ val: S(n), result: 1 })).get();
      }
      const subst = (s) => {
        let out = String(s);
        for (const [tok, real] of Object.entries(wire)) out = out.split(tok).join(real);
        return out;
      };
      for (const [kind, arg] of queue) {
        if (kind === "view") await c.z2ui5_if_client$view_display({ val: S(subst(arg)) });
        else if (kind === "model") await c.z2ui5_if_client$view_model_update();
        else if (kind === "box") await c.z2ui5_if_client$message_box_display({ text: S(subst(arg)) });
        else if (kind === "toast") await c.z2ui5_if_client$message_toast_display({ text: S(subst(arg)) });
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
