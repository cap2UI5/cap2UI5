// defineApp — write a cap2UI5 app as ordinary, SYNCHRONOUS JavaScript.
//
//   const { defineApp, t } = require("cap2ui5");
//   defineApp("ZCL_HELLO", class {
//     name = "";
//     books = t.table({ ID: 0, title: "", price: t.packed(9, 2) });
//     main(c) {                                   // no async, no await
//       if (c.isDisplay) {
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
//   QUERIES  (bind, event, isDisplay, eventName) must answer a value the app
//            uses inline, so they cannot be deferred. `isDisplay`, `eventName`
//            and every bind path are resolved BEFORE main( ) and handed over as
//            plain values. `event` cannot be — its names are invented by the
//            app — so it returns a PLACEHOLDER token and the real wire string
//            is substituted in afterwards, once the async call can be awaited.
//   COMMANDS (view, messageBox, messageToast, …) do not answer anything the app
//            reads, so they are RECORDED synchronously and replayed after
//            main( ), in order.
//
// An `async main` still works — the wrapper awaits it either way — which is
// how an app reads the project's CDS entities: `await SELECT.from(Books)`.
//
// The one consequence worth knowing: between c.event("GO") and the flush, the
// string the app holds is a token, not the wire format. Embedding it in markup
// is what it is for and works; parsing or comparing it does not. The token is
// letters, digits and underscores only, so a view builder that XML-escapes
// attribute values passes it through unchanged - an earlier token carried the
// event as JSON between NULs, abap2UI5's own view builder escaped its quotes,
// the substitution missed, and the raw NULs made the response invalid JSON.
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
const crypto = require("node:crypto");
const cds = require("@sap/cds");
const { isBuilder, render } = require("./view-builder");

const LOG = cds.log("cap2ui5");

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
  struct: (fields) => declared(withInitial(structFor(fields), fields)),
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

// A field's INITIAL VALUE, for the rows make( ) cannot carry: a table's shape
// comes from its first row, and make( ) is also what RTTI and the deserializer
// construct from, so it builds every table empty - which silently dropped the
// rows a field initializer listed. They are written in constructor_( ), not in
// the JavaScript constructor, because that is the one the draft restore skips:
// it creates the instance with `new` alone, as ABAP deserializes an object
// without its constructor, and then APPENDS the stored rows - so rows written
// by `new` were doubled on every roundtrip.
const withInitial = (box, value) => Object.defineProperty(box, "__initial", { value });
const initialOf = (v) => (isBoxed(v) ? v.__initial : v);

/** box -> plain value, for the app to read. ABAP has no boolean; abap_bool is an "X" / " " flag. */
function unwrap(box, shape) {
  switch (shape.k) {
    case "bool": return box.get() === "X";
    case "struct": return rowToPlain(box, shape.fields);
    case "table": return box.array().map((r) => rowToPlain(r, shape.fields));
    default: return box.get();
  }
}
/** plain value -> box, for the app's writes. A box - a t.table( ) or
 *  t.packed( ) declared inside a plain initializer - is copied as ABAP moves
 *  one value into another. */
function wrap(box, value, shape) {
  if (isBoxed(value)) {
    box.set(value);
    return;
  }
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

// ------------------------------------------------ what the framework hands over
/** Any ABAP value as plain JavaScript, for what the app reads from the
 *  framework without a field of its own to type it by - c.get( ) and
 *  c.eventData: a structure as an object under the lowercase component names
 *  the transpiler uses, a table as an array, abap_bool as a boolean, a data
 *  reference as what it points to, a CHAR without its padding. */
function toPlain(v) {
  if (v === null || v === undefined) return null;
  if (v instanceof abap.types.DataReference) {
    const p = v.getPointer();
    return p ? toPlain(p) : null;
  }
  if (v instanceof abap.types.ABAPObject) return v.get() ?? null;
  if (v instanceof abap.types.Structure) {
    return Object.fromEntries(Object.entries(v.get()).map(([k, c]) => [k, toPlain(c)]));
  }
  if (typeof v.array === "function") return v.array().map(toPlain);
  if (v instanceof abap.types.Character) {
    return v.getQualifiedName?.() === "ABAP_BOOL" ? v.get() === "X" : String(v.get()).trimEnd();
  }
  return typeof v.get === "function" ? v.get() : v;
}

/** A plain value as a box of its own shape, for what the app hands the
 *  framework WITHOUT a field to hold it: navBack( { data } ), and a message
 *  box's text when that is data rather than a string. The receiver gets it
 *  typed - an ABAP app a structure it can ASSIGN, a JavaScript app, through
 *  toPlain( ), the object again, its keys lowercase as ABAP names components. */
function boxOf(value, who) {
  if (isBoxed(value)) return value;
  const shape = shapeOf(value, [who]);
  if (!shape) {
    throw new Error(`${who}: ${JSON.stringify(value)} has no ABAP type - null, undefined and an empty array carry none.`);
  }
  const box = shape.make();
  wrap(box, value, shape);
  return box;
}

/** z2ui5_if_client's front-end actions (cs_event) and view slots (cs_view) as
 *  { name: value }. Read from the runtime rather than copied: they are
 *  upstream's, and an action upstream adds is one the facade knows. */
let CONSTANTS;
function constants() {
  if (!CONSTANTS) {
    const IF = abap.Classes["Z2UI5_IF_CLIENT"];
    const read = (n) => Object.fromEntries(
      Object.entries(IF[`z2ui5_if_client$${n}`].get()).map(([k, v]) => [k, String(v.get())]));
    CONSTANTS = { cs_event: read("cs_event"), cs_view: read("cs_view") };
  }
  return CONSTANTS;
}
/** A constant by the name ABAP gives it (`set_title`, `popup`) or by its
 *  value (`SET_TITLE`, `POPUP`). The two differ for some - cs_event-hash_set
 *  is `SET_PUSH_STATE` - so a name is what the facade documents; anything
 *  else is refused with the list, since a wrong one would reach the browser
 *  as an action nobody handles. */
function constant(group, value, who) {
  const map = constants()[group];
  const s = String(value ?? "");
  if (Object.hasOwn(map, s.toLowerCase())) return map[s.toLowerCase()];
  if (Object.values(map).includes(s.toUpperCase())) return s.toUpperCase();
  throw new Error(`${who}: "${s}" is not in z2ui5_if_client=>${group} - known: ${Object.keys(map).join(", ")}`);
}

/** A facade option object as the ABAP parameters it stands for. An unknown
 *  option is refused: silently ignored, a typo would look like a feature
 *  that does not work. */
function optionsOf(opts, names, who) {
  if (opts !== undefined && opts !== null && (typeof opts !== "object" || Array.isArray(opts))) {
    throw new Error(`${who}: the options are an object - ${Object.keys(names).join(", ")}`);
  }
  const out = {};
  for (const [k, v] of Object.entries(opts ?? {})) {
    if (!Object.hasOwn(names, k)) {
      throw new Error(`${who}: unknown option "${k}" - known: ${Object.keys(names).join(", ")}`);
    }
    if (v !== undefined && v !== null) out[names[k]] = v;
  }
  return out;
}
/** z2ui5_if_client=>ty_s_event_control, for c.event( )'s third argument */
const EVENT_CONTROL = {
  preventDefault: "check_prevent_default",
  preventDefaultExpr: "prevent_default_expr",
  argLiteral: "check_arg_literal",
  queueLast: "check_queue_last",
  noBusy: "check_no_busy",
};
/** message_box_display( )'s options */
const MESSAGE_BOX = {
  type: "type",
  title: "title",
  styleClass: "styleclass",
  onClose: "onclose",
  actions: "actions",
  emphasizedAction: "emphasizedaction",
  initialFocus: "initialfocus",
  details: "details",
};
/** message_toast_display( )'s options */
const MESSAGE_TOAST = { duration: "duration", onClose: "onclose" };
/** _bind( )'s options, and row/column for a table cell (tab, tab_index) */
const BIND = {
  path: "path",
  omitInitial: "omit_initial",
  omitInitialPaths: "omit_initial_paths",
  json: "json",
  row: "row",
  column: "column",
};
/** follow_up_action( )'s option besides the action and its arguments */
const ACTION = { view: "view" };

/** a string_table argument, as the app hands it over: an array */
function stringList(list, who) {
  if (!Array.isArray(list)) throw new Error(`${who}: expects an array, got ${typeof list}`);
  return list.map(String);
}
/** follow_up_action( )'s parameters, for both of its forms */
function actionOf(action, args, opts, who) {
  const o = optionsOf(opts, ACTION, who);
  return {
    val: constant("cs_event", action, who),
    args: stringList(args, who),
    view: o.view === undefined ? undefined : constant("cs_view", o.view, who),
  };
}

// --------------------------------------------------------------------- the wrap
/** The names defineApp( ) registered, in the order it saw them - what the
 *  startup hints list (lib/hints.js). */
const defined = [];

/** @returns {string[]} the app names registered so far */
function definedApps() {
  return [...defined];
}

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
      const initial = {};
      const undecidable = [];
      for (const [f, v] of Object.entries(this)) {
        if (typeof v === "function") continue;
        let shape;
        try { shape = shapeOf(v, [f]); } catch (e) { undecidable.push(e.message); continue; }
        if (!shape) { undecidable.push(`${f} has no ABAP type`); continue; }
        this[f] = isBoxed(v) ? v : shape.make();
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
      for (const [f, v] of Object.entries(this.__initial)) wrap(this[f], v, this.__shapes[f]);
      return this;
    }

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
      // client->get( ): everything the frontend sent with this roundtrip. The
      // event name is read from it here; the rest is converted only if the
      // app asks - c.get( ), c.eventData - since most roundtrips never do.
      const got = await c.z2ui5_if_client$get({ result: 1 });
      const eventName = String(got.get().event.get()).trim();
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
      // app_state_get_href( ): composed from the browser's location and this
      // roundtrip's draft id, no side effect - so it can be answered up front,
      // which an app needs because it writes the link into a bound field.
      const appStateHref = String((await c.z2ui5_if_client$app_state_get_href({ result: 1 })).get());

      // ---- the synchronous surface the app sees ----------------------------
      // XML-inert and JSON-safe: [A-Za-z0-9_] only. The nonce is per roundtrip
      // so a token cannot collide with text the app put there itself; the
      // closing "_" keeps _1_ from matching inside _10_.
      //
      // A placeholder stands for anything whose value only an async framework
      // call can produce: an event wire (c.event, c.eventNavBack,
      // c.eventFollowUpAction) and a binding the framework has to register
      // with options (c.bind with omitInitial, json, a table cell). One per
      // distinct call; resolved after main( ) in the order they were made, so
      // a placeholder inside another one's arguments is resolved first.
      const TOK_PREFIX = `z2ui5evt_${crypto.randomBytes(6).toString("hex")}_`;
      const TOK_RE = new RegExp(`${TOK_PREFIX}(\\d+)_`, "g");
      const TOK_LEFT = new RegExp(TOK_PREFIX, "i"); // what survives a cut or a case change
      const placeholders = [];                // token number -> what it stands for
      const tokens = new Map();               // JSON of that -> token, one per distinct call
      const placeholder = (spec) => {
        const key = JSON.stringify(spec);
        if (!tokens.has(key)) {
          placeholders.push(spec);
          tokens.set(key, `${TOK_PREFIX}${placeholders.length - 1}_`);
        }
        return tokens.get(key);
      };
      const queue = [];
      let plainGet;                            // client->get( ), converted on first use
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
        /** client->get( ): what the frontend sent with this roundtrip - the
         *  browser location (s_config), the device, focus, scroll and UI5
         *  information, the draft ids, the launchpad parameters - as plain
         *  values under the ABAP component names. */
        get() {
          return (plainGet ??= toPlain(got));
        },
        /** What a returning app handed over with navBack( { data } ) - get(
         *  )-r_event_data, as plain values; null when nothing was. */
        get eventData() {
          return facade.get().r_event_data;
        },
        appStateHref,                            // the absolute link to this app's current state

        // -- binding and events
        /** The binding for a field: `{/NAME}`, or with `{ path: true }` the
         *  bare path `/NAME` a composed binding needs. `row` and `column`
         *  address one cell of a table field (tab, tab_index); `omitInitial`,
         *  `omitInitialPaths` and `json` are _bind( )'s options of those names.
         *  A binding with options is registered by the framework after main( ),
         *  so it comes back as a placeholder - embed it, like c.event( ). */
        bind(field, opts) {
          if (!(field in paths)) {
            throw new Error(
              `c.bind("${field}"): not a bindable field of this app — ` +
                `known: ${Object.keys(paths).join(", ") || "(none)"}`,
            );
          }
          const who = `c.bind("${field}")`;
          const o = optionsOf(opts, BIND, who);
          const cell = o.row !== undefined || o.column !== undefined;
          if (cell) {
            const shape = shapes[field];
            if (shape.k !== "table") {
              throw new Error(`${who}: row and column address a cell of a TABLE field, and ${field} is not one`);
            }
            if (!Number.isInteger(o.row) || o.row < 1) {
              throw new Error(`${who}: row is the 1-based row number, as tab_index is - got ${o.row}`);
            }
            if (!Object.hasOwn(shape.fields, o.column)) {
              throw new Error(`${who}: "${o.column}" is not a column of ${field} - known: ${Object.keys(shape.fields).join(", ")}`);
            }
          }
          if (cell || o.omit_initial || o.omit_initial_paths || o.json) {
            return placeholder({
              kind: "bind", field, path: Boolean(o.path), row: o.row, column: o.column,
              omitInitial: Boolean(o.omit_initial), json: Boolean(o.json),
              omitInitialPaths: o.omit_initial_paths && stringList(o.omit_initial_paths, `${who} omitInitialPaths`),
            });
          }
          // path_only is the same binding without its braces (finalize_path)
          return o.path ? paths[field].slice(1, -1) : paths[field];
        },
        /** The wire string for an event. `args` travel with it and come back
         *  as c.eventArg(1..n) - which is how two buttons can fire ONE event
         *  and still be told apart. Without them the handler cannot know which
         *  control fired: the browser sends only what the wire carries.
         *  `ctrl` is z2ui5_if_client=>ty_s_event_control: preventDefault,
         *  preventDefaultExpr, argLiteral, queueLast, noBusy. */
        event(n, args = [], ctrl) {
          const who = `c.event("${n}")`;
          return placeholder({ kind: "event", name: String(n), args: stringList(args, who),
            ctrl: optionsOf(ctrl, EVENT_CONTROL, who) });
        },
        /** The handler expression that LEAVES this app - a Page's
         *  navButtonPress, a Cancel button: the previous app takes the screen
         *  back and main( ) needs no branch for it (_event_nav_app_leave). */
        eventNavBack() {
          return placeholder({ kind: "navBack" });
        },
        /** A front-end action as a handler expression: it runs in the browser
         *  when the control fires, with no roundtrip - follow_up_action( ) in a
         *  view attribute. `action` names a z2ui5_if_client=>cs_event. */
        eventFollowUpAction(action, args = [], opts) {
          const who = `c.eventFollowUpAction("${action}")`;
          return placeholder({ kind: "action", ...actionOf(action, args, opts, who) });
        },

        // -- what to put on the screen (recorded, replayed in order after main)
        view(xml) { queue.push(["view", xml]); },
        viewClose() { queue.push(["view_destroy"]); },
        popup(xml) { queue.push(["popup", xml]); },
        popupClose() { queue.push(["popup_destroy"]); },
        /** A popover anchored to the control with the id `byId` - the usual
         *  shape for a menu, a quick view, a confirmation next to its button. */
        popover(xml, byId) {
          if (byId === undefined || byId === null || byId === "") {
            throw new Error("c.popover(xml, byId): byId is the id of the control the popover opens by");
          }
          queue.push(["popover", xml, String(byId)]);
        },
        popoverClose() { queue.push(["popover_destroy"]); },
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
        /** The second nested slot, for a second control of the main view -
         *  the detail column of a FlexibleColumnLayout beside nest( )'s. */
        nest2(into, xml, { insert = "addContent", clear = "removeAllContent" } = {}) {
          queue.push(["nest2", xml, { id: String(into), insert, clear }]);
        },
        nest2Close() { queue.push(["nest2_destroy"]); },
        /** `text` is a string, or data - an object, an array - which the
         *  framework lays out as it does for an ABAP structure or table.
         *  `opts`: type, title, styleClass, onClose, actions, emphasizedAction,
         *  initialFocus, details - message_box_display( )'s parameters. */
        messageBox(text, opts) { queue.push(["box", text, optionsOf(opts, MESSAGE_BOX, "c.messageBox( )")]); },
        /** `opts`: duration, onClose */
        messageToast(text, opts) { queue.push(["toast", text, optionsOf(opts, MESSAGE_TOAST, "c.messageToast( )")]); },
        /** A front-end action the browser runs once this roundtrip's answer
         *  lands - set the focus, scroll, open a URL, copy to the clipboard,
         *  call a control method by id. `action` names a
         *  z2ui5_if_client=>cs_event (`set_focus`, `open_new_tab`, …), `args`
         *  are its positional arguments, `{ view }` the slot whose control ids
         *  are meant (cs_view: main, popup, popover, nested, nested2). */
        followUpAction(action, args = [], opts) {
          queue.push(["follow_up", actionOf(action, args, opts, `c.followUpAction("${action}")`)]);
        },

        // -- navigation. Both are scheduled for the end of the roundtrip by the
        //    framework, so they are usually the last thing a branch does.
        /** Show another app on top of this one; it comes back through navBack( ).
         *  `fields` preset the called app's fields, when it is a defineApp app
         *  named here - what an ABAP app does between NEW and nav_app_call( ). */
        navTo(app, fields) { queue.push(["nav_call", app, fields]); },
        /** Hand the screen back to whoever called this app. Guard with canGoBack.
         *  `event` is what the caller finds in c.eventName, `data` what it
         *  finds in c.eventData - typed, so an ABAP caller can read it too. */
        navBack(opts) { queue.push(["nav_leave", opts ?? {}]); },
        /** the URL hash: set pushes a history entry, replace does not */
        hashSet(hash) { queue.push(["hash_set", String(hash ?? "")]); },
        hashReplace(hash) { queue.push(["hash_replace", String(hash ?? "")]); },
        /** keep this app's state id in the URL, so a reload or a shared link
         *  restores it (app_state_set_active) */
        appStateSetActive(on = true) { queue.push(["app_state", Boolean(on)]); },

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
      // A method is bound to the PROXY, not to the instance behind it: an app
      // splits main( ) into helpers the way an ABAP app has view_display( )
      // and on_event( ), and a helper bound to the instance read the ABAP
      // boxes - worse, `this.name = "x"` in it replaced a box with a string,
      // which _bind( ) matches by identity and then could not find.
      const plain = new Proxy(this, {
        get(tgt, prop, recv) {
          const v = Reflect.get(tgt, prop, recv);
          if (typeof prop === "string" && shapes[prop]) return unwrap(v, shapes[prop]);
          return typeof v === "function" ? v.bind(recv) : v;
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

      // ---- flush: resolve the placeholders, then replay the commands -------
      const B = (v) => new abap.types.Character(1, { qualifiedName: "ABAP_BOOL" }).set(v ? "X" : " ");
      const stringTable = (list) => {
        const tab = abap.types.TableFactory.construct(
          new abap.types.String({ qualifiedName: "STRING" }), STANDARD_TABLE, "");
        for (const a of list) tab.append(new abap.types.String().set(a));
        return tab;
      };
      // In markup the placeholder is an attribute value, so the wire string
      // that replaces it is escaped as one - what upstream's view builder does
      // with _event( )'s result (z2ui5_cl_ui5_view_builder=>xml_escape). An
      // event argument with a quote in it would otherwise end the attribute.
      const XML_ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "\n": "&#xA;", "\r": "&#xD;", "\t": "&#x9;" };
      const xmlEscape = (v) => String(v).replace(/[&<>"\n\r\t]/g, (ch) => XML_ESC[ch]);
      const values = [];                       // token number -> what the framework answered
      const subst = (s, { xml = false } = {}) => {
        const out = String(s).replace(TOK_RE, (tok, i) =>
          values[i] === undefined ? tok : xml ? xmlEscape(values[i]) : String(values[i]));
        // What is left is a placeholder the app changed after the facade
        // returned it - cut, re-encoded, case-changed. Shipping it would send
        // the browser a handler that does nothing, so refuse.
        const at = out.search(TOK_LEFT);
        if (at >= 0) {
          throw new Error(
            `c.event( ): a placeholder it returned reached the view altered, so it cannot ` +
              `be replaced by the event's wire string: "${out.slice(at, at + TOK_PREFIX.length + 12)}…". ` +
              `Embed what c.event( ), c.eventNavBack( ), c.eventFollowUpAction( ) and a c.bind( ) ` +
              `with options return in the markup as it is; do not parse, cut or re-encode it.`,
          );
        }
        return out;
      };
      const actionInput = (a, extra = {}) => {
        const input = { val: S(a.val), ...extra };
        if (a.args.length) input.t_arg = stringTable(a.args.map((x) => subst(x)));
        if (a.view !== undefined) input.view = S(a.view);
        return input;
      };
      /** z2ui5_if_client=>ty_s_event_control, built from the interface's own
       *  parameter type so its components are upstream's */
      const eventControl = (ctrl) => {
        const s = abap.Classes["Z2UI5_IF_CLIENT"].METHODS._EVENT.parameters.S_CTRL.type();
        for (const [k, v] of Object.entries(ctrl)) {
          s.get()[k].set(k === "prevent_default_expr" ? subst(v) : v ? "X" : " ");
        }
        return s;
      };
      /** _bind( ) with its options. A cell is the component box of that row
       *  of the table: bind_tab_cell( ) finds it by reference. */
      const bindWith = async (p) => {
        const input = { val: this[p.field], result: 1 };
        if (p.row !== undefined) {
          const table = this[p.field];
          const row = table.array()[p.row - 1];
          if (!row) {
            throw new Error(`c.bind("${p.field}", { row: ${p.row} }): the table has ${table.array().length} row(s)`);
          }
          input.val = row.get()[shapes[p.field].fields[p.column].key];
          input.tab = table;
          input.tab_index = new abap.types.Integer().set(p.row);
        }
        if (p.path) input.path = B(true);
        if (p.omitInitial) input.omit_initial = B(true);
        if (p.omitInitialPaths) input.omit_initial_paths = stringTable(p.omitInitialPaths.map((x) => x.toUpperCase()));
        if (p.json) input.json = B(true);
        return (await c.z2ui5_if_client$_bind(input)).get();
      };
      // In the order the app made them: a placeholder in another one's
      // arguments was made before it, so it is resolved first.
      for (const [i, p] of placeholders.entries()) {
        if (p.kind === "event") {
          const input = { val: S(p.name), result: 1 };
          if (p.args.length) input.t_arg = stringTable(p.args.map((x) => subst(x)));
          if (Object.keys(p.ctrl).length) input.s_ctrl = eventControl(p.ctrl);
          values[i] = (await c.z2ui5_if_client$_event(input)).get();
        } else if (p.kind === "navBack") {
          values[i] = (await c.z2ui5_if_client$_event_nav_app_leave({ result: 1 })).get();
        } else if (p.kind === "action") {
          // result supplied: follow_up_action( ) answers the wire instead of queueing
          values[i] = (await c.z2ui5_if_client$follow_up_action(actionInput(p, { result: 1 }))).get();
        } else if (p.kind === "bind") {
          values[i] = await bindWith(p);
        }
      }

      /** nav_app_call( ) wants a BOUND z2ui5_if_app instance. The app may hand
       *  over a registered name, a defineApp class, or an instance it built
       *  itself; an unbound reference raises NAV_APP_TARGET_NOT_BOUND, so a
       *  name that resolves to nothing is refused here, where the app can see
       *  which name it was. */
      const appRef = async (app, fields) => {
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
        if (fields !== undefined) presetFields(instance, fields);
        const ref = new abap.types.ABAPObject({ qualifiedName: "Z2UI5_IF_APP" });
        ref.set(instance);
        return ref;
      };
      /** The fields navTo( ) presets, written through the called app's own
       *  shapes after its constructor_( ) - so they win over its initializers. */
      const presetFields = (instance, fields) => {
        const name = instance?.constructor?.INTERNAL_NAME ?? "the app";
        const own = instance?.__shapes;
        if (!own) {
          throw new Error(`c.navTo(${name}, fields): only a defineApp app's fields can be preset, and ${name} is not one`);
        }
        for (const [k, v] of Object.entries(fields)) {
          if (!Object.hasOwn(own, k) || isFrameworkField(k)) {
            throw new Error(`c.navTo(${name}, fields): ${k} is not a field of ${name} - known: ` +
              `${Object.keys(own).filter((f) => !isFrameworkField(f)).join(", ")}`);
          }
          wrap(instance[k], v, own[k]);
        }
      };
      /** A message box's text: a string, or data the framework lays out */
      const boxText = (text) => {
        if (text instanceof Error) return S(text.message);
        if (text !== null && typeof text === "object") return boxOf(text, "c.messageBox( )");
        return S(subst(text));
      };
      const optionInput = (o, lists = []) => Object.fromEntries(Object.entries(o).map(([k, v]) =>
        [k, lists.includes(k) ? stringTable(stringList(v, k).map((x) => subst(x))) : S(subst(v))]));

      /** A view is XML text or a ViewBuilder chain (lib/view-builder.js),
       *  which upstream's z2ui5_cl_ui5_view_builder renders here, after main( ).
       *  Its escaping leaves the placeholders alone - [A-Za-z0-9_] - so
       *  subst( ) finds them in the rendered XML as in hand-written text. */
      const xmlOf = async (v) => subst(isBuilder(v) ? await render(v) : v, { xml: true });
      const nestInput = async (xml, at) => ({
        val: S(await xmlOf(xml)), id: S(at.id), method_insert: S(at.insert), method_destroy: S(at.clear),
      });
      for (const [kind, arg, extra] of queue) {
        if (kind === "view") await c.z2ui5_if_client$view_display({ val: S(await xmlOf(arg)) });
        else if (kind === "view_destroy") await c.z2ui5_if_client$view_destroy();
        else if (kind === "popup") await c.z2ui5_if_client$popup_display({ val: S(await xmlOf(arg)) });
        else if (kind === "popup_destroy") await c.z2ui5_if_client$popup_destroy();
        else if (kind === "popover") {
          await c.z2ui5_if_client$popover_display({ xml: S(await xmlOf(arg)), by_id: S(extra) });
        } else if (kind === "popover_destroy") await c.z2ui5_if_client$popover_destroy();
        else if (kind === "nest") await c.z2ui5_if_client$nest_view_display(await nestInput(arg, extra));
        else if (kind === "nest_destroy") await c.z2ui5_if_client$nest_view_destroy();
        else if (kind === "nest2") await c.z2ui5_if_client$nest2_view_display(await nestInput(arg, extra));
        else if (kind === "nest2_destroy") await c.z2ui5_if_client$nest2_view_destroy();
        else if (kind === "box") {
          await c.z2ui5_if_client$message_box_display({ text: boxText(arg), ...optionInput(extra, ["actions"]) });
        } else if (kind === "toast") {
          await c.z2ui5_if_client$message_toast_display({ text: S(subst(arg)), ...optionInput(extra) });
        } else if (kind === "follow_up") await c.z2ui5_if_client$follow_up_action(actionInput(arg));
        else if (kind === "hash_set") await c.z2ui5_if_client$hash_set({ val: S(arg) });
        else if (kind === "hash_replace") await c.z2ui5_if_client$hash_replace({ val: S(arg) });
        else if (kind === "app_state") await c.z2ui5_if_client$app_state_set_active({ val: B(arg) });
        else if (kind === "nav_call") {
          await c.z2ui5_if_client$nav_app_call({ app: await appRef(arg, extra), result: 1 });
        } else if (kind === "nav_leave") {
          const o = arg ?? {};
          const input = { result: 1 };
          if (o.app !== undefined) input.app = await appRef(o.app);
          if (o.event !== undefined) input.event = S(o.event);
          // typed, so an ABAP caller can ASSIGN it and a JavaScript one reads
          // it back as c.eventData - not a JSON string neither could use
          if (o.data !== undefined && o.data !== null) input.r_data = boxOf(o.data, "c.navBack( { data } )");
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
  if (!defined.includes(INTERNAL)) defined.push(INTERNAL);
  return App;
}

module.exports = { defineApp, definedApps, t, shapeOf };
