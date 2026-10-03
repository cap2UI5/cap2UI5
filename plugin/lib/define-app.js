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
// XML-escapes attribute values passes it through unchanged - an earlier token
// carried the event as JSON between NULs, abap2UI5's own view builder escaped
// its quotes, the substitution missed, and the raw NULs made the response
// invalid JSON.
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
const { renderOf } = require("./view-builder");
const { AGENT, appOption } = require("./agent/policy");

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
  /** ABAP's N, D and T: digits kept with their leading zeros, a date as
   *  YYYYMMDD and a time as HHMMSS - read and written as strings. What
   *  abap2js writes for `TYPE n LENGTH 12`, `TYPE d` and `TYPE t`, so that the
   *  model carries the value the ABAP app's would. */
  numc: (length) => new abap.types.Numc({ length, qualifiedName: "N" }),
  date: () => new abap.types.Date({ qualifiedName: "D" }),
  time: () => new abap.types.Time({ qualifiedName: "T" }),
  /** A structure: `t.struct({ street: "", zip: 0 })`. A plain object field is one implicitly. */
  struct: (fields) => declared(withInitial(structFor(fields), fields)),
  /** A table of structures: `t.table({ ID: 0, title: "" })` - the argument is one ROW. */
  table: (row) => declared(tableFor(row)),
};

const isBoxed = (v) =>
  v !== null && typeof v === "object" && typeof v.get === "function" && typeof v.set === "function";
/** How a declared box - t.bool( ), t.float( ), t.char( n ), … - reads and
 *  writes: an abap_bool is a boolean, a CHAR is read without its padding, a
 *  float as the number it holds. Read as a generic box, t.bool( ) answered
 *  " " - which is truthy - and took no boolean; a float answered open-abap's
 *  external format, "5,0000000000000000E-01", with which `ratio * 2` is NaN;
 *  and a CHAR came back padded, "ab   " !== "ab". */
function boxKind(box) {
  if (box instanceof abap.types.Float) return "float";
  if (box instanceof abap.types.Character) return box.getQualifiedName?.() === "ABAP_BOOL" ? "bool" : "char";
  if (box instanceof abap.types.Date) return "date";
  if (box instanceof abap.types.Time) return "time";
  return "boxed";
}
const isPlainObject = (v) => v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype;

// A "shape" says how a value crosses between the app and its box:
//   { k: "string" | "number" | "float" | "char" | "bool" | "date" | "time" | "boxed" }   scalar
//   { k: "struct", fields: { <appKey>: { key, shape } } }    key = lowercase component
//   { k: "table",  fields }                                  one row = that structure
// `make()` builds a fresh box of the shape - what ATTRIBUTES.type() must do on
// every call, because RTTI and the deserializer construct from it. It builds
// the box INITIAL: the value a field initializer gives is written once, in
// constructor_( ) (see withInitial). A box that carried it from `new` came
// back from the draft restore with it - the restore leaves an initial value
// out - so `name = "Alice"`, cleared to "", was "Alice" again one roundtrip
// later.
function shapeOf(v, path = []) {
  if (typeof v === "string") return { k: "string", make: t.string };
  if (typeof v === "boolean") return { k: "bool", make: t.bool };
  if (typeof v === "number") return Number.isInteger(v) ? { k: "number", make: t.int } : { k: "float", make: t.float };
  if (isBoxed(v)) {
    if (v.__shape) return v.__shape;                        // t.struct / t.table
    const make = () => {
      const box = v.clone();
      box.clear();
      return box;
    };
    return { k: boxKind(v), make };
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
/** The value an initializer gives, to be written in constructor_( ): a plain
 *  value as it is, a t.struct( ) its components, and a box the app declared
 *  with a value of its own - `t.char(3).set("abc")` - that box. */
const initialOf = (v) => {
  if (!isBoxed(v)) return v;
  if (v.__shape) return v.__initial;
  return abap.compare.initial(v) ? undefined : v;
};

/** box -> plain value, for the app to read. ABAP has no boolean; abap_bool is an "X" / " " flag. */
function unwrap(box, shape) {
  switch (shape.k) {
    case "bool": return box.get() === "X";
    case "float": return box.getRaw();
    case "char": return String(box.get()).trimEnd();
    case "struct": return rowToPlain(box, shape.fields);
    case "table": return box.array().map((r) => rowToPlain(r, shape.fields));
    default: return box.get();
  }
}
/** A value a field cannot take, named by the field - `this.count` - or the
 *  component - `this.rows[2].id` - it was written to. The box threw V8's
 *  "Cannot read properties of null (reading 'get')" or "value.get is not a
 *  function" for it, or an ABAP conversion exception with no message at all,
 *  and none of them said which field. */
const REFUSED = Symbol("cap2ui5.refused");
const describe = (v) => {
  if (typeof v === "string") return JSON.stringify(v.length > 40 ? `${v.slice(0, 40)}…` : v);
  if (v instanceof Date) return `a Date (${Number.isNaN(v.getTime()) ? "invalid" : v.toISOString()})`;
  if (Array.isArray(v)) return "an array";
  if (typeof v === "object") return "an object";
  return `${typeof v} ${String(v)}`;
};
const refuse = (at, value, why, cause) =>
  Object.assign(new TypeError(`${at} cannot take ${describe(value)} - ${why}`, cause ? { cause } : undefined), { [REFUSED]: true });

/** A date as t.date( ) stores it, YYYYMMDD, from what a CAP project has in
 *  hand: the YYYYMMDD itself, or the YYYY-MM-DD a cds.Date comes as - also as
 *  the start of a cds.DateTime or cds.Timestamp. Anything else is refused:
 *  an ABAP D keeps the first eight characters of whatever it is given, so
 *  "2026-01-02" became "2026-01-" without a word. A JavaScript Date is an
 *  instant, and which day that is depends on a time zone the field does not
 *  have, so it is refused too: format it first. */
function dateValue(value, at) {
  const s = String(value);
  if (/^(\d{8})?$/.test(s)) return s;
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(s);
  if (iso) return `${iso[1]}${iso[2]}${iso[3]}`;
  throw refuse(at, value, value instanceof Date
    ? "a Date is an instant, and the day it falls on depends on a time zone a t.date( ) does not have; format it, YYYY-MM-DD"
    : "a t.date( ) takes YYYYMMDD or YYYY-MM-DD (a cds.Date, or the start of a cds.DateTime)");
}
/** A time as t.time( ) stores it, HHMMSS: that, or the HH:MM:SS of a cds.Time. */
function timeValue(value, at) {
  const s = String(value);
  if (/^(\d{6})?$/.test(s)) return s;
  const iso = /^(\d{2}):(\d{2}):(\d{2})(?:$|\.|Z)/.exec(s);
  if (iso) return `${iso[1]}${iso[2]}${iso[3]}`;
  throw refuse(at, value, "a t.time( ) takes HHMMSS or HH:MM:SS (a cds.Time)");
}

/** plain value -> box, for the app's writes. A box - a t.table( ) or
 *  t.packed( ) declared inside a plain initializer - is copied as ABAP moves
 *  one value into another. `null` and `undefined` CLEAR the field: ABAP has
 *  no null, `{ }` and `[ ]` cleared a structure and a table already, and the
 *  box took a null as an object to call .get( ) on - a TypeError that named
 *  no field. `at` is the field, for a refusal: `this.count`. */
function wrap(box, value, shape, at = "the field") {
  if (value === null || value === undefined) {
    box.clear();
    return;
  }
  if (isBoxed(value)) {
    box.set(value);
    return;
  }
  try {
    switch (shape.k) {
      case "bool": box.set(value ? "X" : " "); break;
      case "date": box.set(dateValue(value, at)); break;
      case "time": box.set(timeValue(value, at)); break;
      case "struct": {
        // a new value replaces the whole structure, as `s = VALUE #( … )` does:
        // a component it leaves out is initial afterwards, not what it was
        if (typeof value !== "object" || Array.isArray(value)) {
          throw refuse(at, value, "a structure takes an object with its components");
        }
        // built beside the field and moved in whole, so a component that is
        // refused leaves the field as it was, not half written
        const s = box.clone();
        s.clear();
        plainToRow(s, value, shape.fields, at);
        box.set(s);
        break;
      }
      case "table": {
        // a string is iterable too: "rows" appended four initial rows
        if (!Array.isArray(value)) throw refuse(at, value, "a table takes an array of rows");
        const rows = value.map((row, i) => {
          const r = box.getRowType().clone();
          if (row !== null && row !== undefined) plainToRow(r, row, shape.fields, `${at}[${i}]`);  // null: an initial row
          return r;
        });
        box.clear();
        for (const r of rows) box.append(r);
        break;
      }
      default: box.set(value);
    }
  } catch (e) {
    if (e?.[REFUSED]) throw e;
    // a transpiled ABAP exception has a class name and no message
    const abapEx = e?.constructor?.INTERNAL_NAME;
    throw refuse(at, value, `it is an ABAP ${box.constructor.name} field${abapEx ? ` (${String(abapEx).toLowerCase()})` : ""}`, e);
  }
}
const rowToPlain = (row, fields) =>
  Object.fromEntries(Object.entries(fields).map(([k, { key, shape }]) => [k, unwrap(row.get()[key], shape)]));
function plainToRow(row, value, fields, at = "the row") {
  if (typeof value !== "object" || Array.isArray(value)) {
    throw refuse(at, value, "a structure takes an object with its components");
  }
  const comps = row.get();
  for (const [k, { key, shape }] of Object.entries(fields)) {
    if (value[k] === undefined || value[k] === null) continue;      // keep the initial value
    wrap(comps[key], value[k], shape, `${at}.${k}`);
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

/** A field is an ABAP attribute, and the runtime reads an attribute from
 *  the instance under its LOWERCASE name - the transpiler's convention - while
 *  ATTRIBUTES lists it upper case. `isAdmin` is therefore an attribute
 *  ISADMIN the runtime looks for as `isadmin` and does not find: every
 *  roundtrip of the app failed with a BINDING_ERROR, bound or not. Mapping
 *  the name would need a second name for every field in the draft, the
 *  model, nav_app_call( )'s presets and get_app_prev( ) - and two fields
 *  `isAdmin` and `isadmin` would collide - so the name is refused where it
 *  is declared, as ABAP would never produce it. A structure's components
 *  and the app's methods may be camelCase. */
function fieldNameError(app, f) {
  const snake = f.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  return `defineApp(${app}): field ${f} - a field is an ABAP attribute, and ABAP names are not case-sensitive: ` +
    `the runtime reads it as "${f.toLowerCase()}". Name it in lower case, snake_case as ABAP does - ${snake}.`;
}

/** `name` -> NAME, `z2ui5_if_app$id_draft` -> Z2UI5_IF_APP~ID_DRAFT. */
const abapName = (f) => f.toUpperCase().replace(/\$/g, "~");
const isFrameworkField = (f) => f.includes("$");
/** The binding z2ui5_if_client=>_bind( ) answers for a top-level attribute:
 *  its name as RTTI spells it, under the model's root (get_client_name in
 *  z2ui5_cl_ui5_srv_bind). Known without binding, so _bind( ) can answer it
 *  inline and bind the field after main( ) - see there. */
const boundPath = (f) => `{/${abapName(f)}}`;

// ------------------------------------------------ what the framework hands over
/** Any ABAP value as plain JavaScript, for what the app reads from the
 *  framework without a field of its own to type it by - client.get( ), the
 *  data in its r_event_data, the constants: a structure as an object under
 *  the lowercase component names the transpiler uses, a table as an array,
 *  abap_bool as a boolean, a data reference as what it points to, a CHAR
 *  without its padding. */
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
  if (v instanceof abap.types.Float) return v.getRaw();
  return typeof v.get === "function" ? v.get() : v;
}

/** A plain value as a box of its own shape, for what the app hands the
 *  framework WITHOUT a field to hold it: nav_app_leave( { r_data } ), and a message
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
  wrap(box, value, shape, who);
  return box;
}

/** z2ui5_if_client's constant structures - cs_event, cs_view, cs_nav_mode,
 *  cs_device, and cs_transition where the runtime has it (the releases after
 *  1.145.0) - as plain frozen objects: `client.cs_event.set_title` is
 *  `client->cs_event-set_title`. Read from the runtime rather than copied,
 *  the groups included: they are upstream's, and an action or a group
 *  upstream adds is one the client knows. A fixed list of groups was what
 *  failed first when upstream added cs_transition. */
const PREFIX = "z2ui5_if_client$";
let CONSTANTS;
const deepFreeze = (o) => {
  for (const v of Object.values(o)) if (v && typeof v === "object") deepFreeze(v);
  return Object.freeze(o);
};
function constants() {
  if (!globalThis.abap?.Classes?.["Z2UI5_IF_CLIENT"]) {
    throw new Error("z2ui5_if_client's constants are read from the abap2UI5 runtime, which has not booted yet - " +
      "read them in main( ) or in an app file under srv/apps/, which loads after it.");
  }
  const IF = abap.Classes["Z2UI5_IF_CLIENT"];
  CONSTANTS ??= deepFreeze(Object.fromEntries(Object.keys(IF).filter((k) => k.startsWith(PREFIX))
    .map((k) => [k.slice(PREFIX.length), toPlain(IF[k])])));
  return CONSTANTS;
}
/** The interface's constants as an ABAP app reads them, on the interface
 *  itself: `z2ui5_if_client=>cs_event-set_title` is
 *  `z2ui5_if_client.cs_event.set_title`. The same objects as client.cs_event
 *  and its siblings - which groups there are, the runtime says, so this is
 *  a read-only view on constants( ) rather than a fixed set of getters. */
const booted = () => Boolean(globalThis.abap?.Classes?.["Z2UI5_IF_CLIENT"]);
const z2ui5_if_client = new Proxy({}, {
  get: (_, k) => {
    if (typeof k !== "string") return undefined;
    if (k.startsWith("cs_")) return constants()[k];   // before the boot, constants( ) says why not
    return booted() && Object.hasOwn(constants(), k) ? constants()[k] : undefined;
  },
  has: (_, k) => booted() && Object.hasOwn(constants(), k),
  ownKeys: () => (booted() ? Object.keys(constants()) : []),
  getOwnPropertyDescriptor: (_, k) => (booted() && Object.hasOwn(constants(), k)
    ? { value: constants()[k], enumerable: true, configurable: true, writable: false } : undefined),
  set: () => false,
  defineProperty: () => false,
  deleteProperty: () => false,
});
/** A constant's value, given the value itself (`client.cs_event.set_title`,
 *  "SET_TITLE") or, leniently, its name ("set_title"). Anything else is
 *  refused with the names: it would reach the browser as an action nobody
 *  handles. */
function constant(group, value, who) {
  const map = constants()[group];
  const s = String(value ?? "");
  if (Object.values(map).includes(s.toUpperCase())) return s.toUpperCase();
  if (Object.hasOwn(map, s.toLowerCase())) return map[s.toLowerCase()];
  throw new Error(`${who}: "${s}" is not in z2ui5_if_client=>${group} - known: ${Object.keys(map).join(", ")}`);
}

// ------------------------------------------------- the calls, as ABAP writes them
/** z2ui5_if_client's parameters, method by method, as the interface declares
 *  them: the PREFERRED one first - the one a call with a single positional
 *  argument means - and a "!" on those that are neither OPTIONAL nor have a
 *  DEFAULT. ABAP refuses a call without one of those at compile time; here
 *  the call is refused when it is made, rather than send "undefined" to the
 *  browser. */
const SIGNATURES = {
  check_on_event: "val",
  get_event_arg: "v",
  get_app: "id",
  _bind: "val! path tab tab_index switch_default_model omit_initial omit_initial_paths json custom_mapper custom_filter",
  _bind_edit: "val! path tab tab_index switch_default_model custom_mapper custom_mapper_back custom_filter " +
    "custom_filter_back",
  _bind_path: "val!",
  _event: "val t_arg s_ctrl arg",
  _event_client: "val! view t_arg",
  follow_up_action: "val! view t_arg",
  view_display: "val! switch_default_model_path switch_default_model_anno_uri transition transition_back",
  popup_display: "val!",
  popover_display: "xml! by_id!",
  nest_view_display: "val! id! method_insert! method_destroy",
  nest2_view_display: "val! id! method_insert! method_destroy",
  message_box_display: "text! type title styleclass onclose actions emphasizedaction initialfocus details",
  message_toast_display: "text! duration onclose",
  nav_app_call: "app!",
  nav_app_leave: "app event r_data",
  hash_set: "val",
  hash_replace: "val",
  app_state_set_active: "val",
  set_session_stateful: "val",
};
/** The parameters the RUNTIME in use declares for a method, lower case - or
 *  null before it has booted. SIGNATURES is what the client wires, and it
 *  follows upstream's interface; a runtime from before a parameter was added
 *  does not know it, and its transpiled method ignores what it does not
 *  declare. So a call that sets such a parameter is refused, naming the
 *  runtime, instead of doing nothing (view_display's transition, which came
 *  after @abap2ui5/node-runtime 1.145.0). */
function runtimeParams(method) {
  const m = globalThis.abap?.Classes?.["Z2UI5_IF_CLIENT"]?.METHODS?.[method.toUpperCase()];
  return m?.parameters ? Object.keys(m.parameters).map((p) => p.toLowerCase()) : null;
}
const runtimeVersion = () => {
  try { return require("@abap2ui5/node-runtime/package.json").version; } catch { return "?"; }
};
const signature = (method) => {
  const params = SIGNATURES[method].split(" ");
  return { names: params.map((n) => n.replace("!", "")), required: params.filter((n) => n.endsWith("!")).map((n) => n.slice(0, -1)) };
};

/** A call as ABAP writes it: nothing, ONE positional argument for the
 *  method's preferred parameter - client->_event( `GO` ) - or the parameters
 *  by name, client->_event( val = `GO` t_arg = … ), which JavaScript writes
 *  as one object: client._event({ val: "GO", t_arg: [ … ] }). An unknown name
 *  is refused: ignored, a typo would look like a parameter that does nothing.
 *  `named` decides whether a lone object is the parameters or the value of
 *  the preferred one - which only matters where that value can itself be an
 *  object, the text of message_box_display( ). */
function paramsOf(method, args, named = isPlainObject) {
  const who = `client.${method}( )`;
  const { names, required } = signature(method);
  if (args.length > 1) {
    throw new Error(`${who}: one value for ${names[0]}, or the parameters by name as one object - ` +
      `{ ${names.join(", ")} }`);
  }
  const [first] = args;
  const out = {};
  if (first !== undefined && !named(first)) out[names[0]] = first;
  else if (first !== undefined) {
    const keys = Object.keys(first);
    if (keys.length && !keys.some((k) => names.includes(k)) && method.startsWith("_bind")) {
      // not parameters at all: the value of a field, where its name belongs
      throw new Error(`${who}: an object is the parameters by name - { ${names.join(", ")} } - and this ` +
        `one has none of them. In JavaScript the client binds a field by its NAME, ` +
        `client.${method}("name"), not by its value.`);
    }
    for (const [k, v] of Object.entries(first)) {
      if (!names.includes(k)) throw new Error(`${who}: no parameter "${k}" - { ${names.join(", ")} }`);
      if (v !== undefined) out[k] = v;
    }
  }
  const known = runtimeParams(method);
  for (const k of Object.keys(out)) {
    if (known && !known.includes(k)) {
      throw new Error(`${who}: ${k} is not a parameter of z2ui5_if_client=>${method} in the abap2UI5 runtime ` +
        `this project runs on (@abap2ui5/node-runtime ${runtimeVersion()}) - it came with a later release`);
    }
  }
  const missing = required.filter((k) => out[k] === undefined || out[k] === null);
  if (missing.length) {
    throw new Error(`${who}: ${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} not optional - ` +
      `{ ${names.join(", ")} }`);
  }
  return out;
}
/** a string_table parameter, as the app hands it over: an array */
function stringList(list, who) {
  if (!Array.isArray(list)) throw new Error(`${who}: expects an array, got ${typeof list}`);
  return list.map(String);
}

/** ty_s_event_control's component names - what _event( )'s s_ctrl takes -
 *  read from the interface's own parameter type, as eventControlBox( )
 *  builds it, so a component upstream adds is one the client accepts */
let S_CTRL;
const EVENT_CONTROL = () =>
  (S_CTRL ??= Object.keys(abap.Classes["Z2UI5_IF_CLIENT"].METHODS._EVENT.parameters.S_CTRL.type().get()));

/** cap2ui5 0.1.0's names, and what replaces each. They throw, saying so:
 *  silently gone, `if (client.isDisplay)` would just be false on every
 *  roundtrip and the app would never render. */
const RETIRED = {
  isFirstRun: "use client.check_on_init( )",
  isDisplay: "use client.check_on_navigated( )",
  canGoBack: "use client.check_app_prev_stack( )",
  eventName: "use client.get_event( ), or client.check_on_event( name )",
  eventArg: "use client.get_event_arg( i )",
  prevApp: "use client.get_app_prev( )",
  bind: "use client._bind( name )",
  event: "use client._event( name ), or client._event( { val, t_arg } )",
  view: "use client.view_display( xml )",
  popup: "use client.popup_display( xml )",
  popupClose: "use client.popup_destroy( )",
  nest: "use client.nest_view_display( { val, id, method_insert, method_destroy } )",
  nestClose: "use client.nest_view_destroy( )",
  messageBox: "use client.message_box_display( text )",
  messageToast: "use client.message_toast_display( text )",
  navTo: "use client.nav_app_call( app )",
  navBack: "use client.nav_app_leave( { event, r_data } )",
  // gone before 0.1.0 already: named like check_on_init( ), wired to check_on_navigated( )
  isInitial: "use client.check_on_navigated( ) to render and client.check_on_init( ) to seed state once",
  modelUpdate: "drop it - view_model_update( ) is obsolete and does nothing, changed bound data is pushed on its own",
};

/** z2ui5_if_client's methods that are declared obsolete and do NOTHING -
 *  changed bound data is pushed to the view, and to an open popup, popover
 *  or nested view, on its own. They do nothing here either, so an app that
 *  still calls one ports unchanged; abi-gate.test.mjs goes red if upstream
 *  ever gives one of them something to do. */
const OBSOLETE = ["view_model_update", "popup_model_update", "popover_model_update",
  "nest_view_model_update", "nest2_view_model_update"];

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

/** What client.get_app( id ) answers - see there. */
class DraftApp {}
const DRAFT_APP = Symbol("cap2ui5.draftApp");

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
  // whether, and how, agents may operate the app - lib/agent/policy.js;
  // checked before anything is registered, so a wrong option registers nothing
  const agent = appOption(INTERNAL, opts.agent);
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
      const S = (v = "") => new abap.types.String().set(String(v));
      const shapes = this.__shapes;

      // ---- resolve the queries that CAN be resolved up front ---------------
      //
      // The two lifecycle predicates are NOT interchangeable, and the wrong one
      // is the framework's most common app bug (z2ui5_if_client's own ABAP Doc
      // says so):
      //
      //   check_on_init( )      - the first roundtrip of THIS app INSTANCE and
      //                           only that one. Seed state here.
      //   check_on_navigated( ) - true on the first roundtrip AND every time the
      //                           app gets the screen back: a called app leaving,
      //                           a value help closing, a bookmark restored.
      //                           RENDER here.
      //
      // check_on_init( ) implies check_on_navigated( ), so
      // `if (client.check_on_navigated()) client.view_display(…)` is the whole
      // display condition. An app that renders only on check_on_init( ) works
      // perfectly until something navigates back into it, and then leaves the
      // previous screen standing with no error at all.
      const truthy = async (p) => abap.compare.initial(await p) === false;
      const onInit = await truthy(c.z2ui5_if_client$check_on_init({ result: 1 }));
      const onNavigated = await truthy(c.z2ui5_if_client$check_on_navigated({ result: 1 }));
      const prevStack = await truthy(c.z2ui5_if_client$check_app_prev_stack({ result: 1 }));
      // client->get( ): everything the frontend sent with this roundtrip. The
      // event name is read from it here; the rest is converted only if the app
      // asks for client.get( ), since most roundtrips never do.
      const got = await c.z2ui5_if_client$get({ result: 1 });
      const eventName = String(got.get().event.get()).trim();
      // The event's arguments, all of them: get( ) carries the table that
      // get_event_arg( v ) reads row v of, so there is nothing to ask the
      // framework for one at a time. The first eight used to be fetched up
      // front, one call each, and a ninth was refused - a limit the ABAP
      // method does not have.
      const eventArgs = got.get().t_event_arg.array().map((a) => String(a.get()));
      // The instance on the other side of the last navigation: inside a called
      // app the caller, and back in the caller after nav_app_leave( ) the app
      // that just returned. Unwrapped to plain values when it is a defineApp
      // app; handed over as the raw instance when it is an ABAP one, which the
      // app can still read.
      const prevRef = await c.z2ui5_if_client$get_app_prev({ result: 1 });
      const prevApp = readState(abap.compare.initial(prevRef) ? null : prevRef.get());
      // The app's own fields - what _bind( ) can name. NOT bound here: a
      // field becomes part of the model when the app binds it, as in ABAP,
      // where the framework sends and accepts only bound attributes. Binding
      // every field up front - which is how the path used to be learnt -
      // sent every field to the browser and let the browser write every
      // field, the ones no view shows included (a forged PRICE or IS_ADMIN
      // was taken as if a control had sent it). See boundPath( ).
      const fields = new Set(Object.keys(shapes).filter((f) => !isFrameworkField(f)));
      const bound = new Set();                 // fields main( ) bound without options
      // app_state_get_href( ): composed from the browser's location and this
      // roundtrip's draft id, no side effect - so it can be answered up front,
      // which an app needs because it writes the link into a bound field.
      const appStateHref = String((await c.z2ui5_if_client$app_state_get_href({ result: 1 })).get());

      // ---- the client the app sees -----------------------------------------
      // A placeholder stands for what only an async framework call can
      // produce: an event wire (_event, _event_nav_app_leave, the wired form of
      // follow_up_action) and a binding the framework has to register with
      // options (_bind of a component, a cell, omit_initial, json). One per
      // distinct call - a follow_up_action( ) one per CALL, see there - resolved
      // after main( ) in the order they were made, so a placeholder inside
      // another one's arguments is resolved first.
      //
      // XML-inert and JSON-safe: [A-Za-z0-9_] only. The nonce is per roundtrip
      // so a token cannot collide with text the app put there itself; the
      // closing "_" keeps _1_ from matching inside _10_.
      const TOK_PREFIX = `z2ui5evt_${crypto.randomBytes(6).toString("hex")}_`;
      const TOK_RE = new RegExp(`${TOK_PREFIX}(\\d+)_`, "g");
      // What survives a cut or a case change - of THIS roundtrip's nonce or
      // of any other: a placeholder the app kept in a field and embedded one
      // roundtrip later carries an old nonce, and only matching that one let
      // it through to the browser as press="z2ui5evt_…" - a dead button.
      const TOK_LEFT = /z2ui5evt_[0-9a-f]{12}_/i;
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
      let actionCalls = 0;

      /** A field, or a component of a structure field, named as ABAP names it:
       *  `s_order-customer` (a `.` works too). Its shape, and the component
       *  keys from the field's box to it. */
      const fieldOf = (name, who) => {
        const [top, ...components] = String(name).split(/[-.]/);
        if (!fields.has(top)) {
          throw new Error(
            `${who}: ${top} is not a field of this app - in JavaScript the client takes a field's ` +
              `NAME, client._bind("name"), not its value. Known: ${[...fields].join(", ") || "(none)"}`,
          );
        }
        let shape = shapes[top];
        const keys = [];
        for (const [i, comp] of components.entries()) {
          if (shape.k !== "struct" || !Object.hasOwn(shape.fields, comp)) {
            const at = [top, ...components.slice(0, i)].join("-");
            throw new Error(`${who}: ${comp} is not a component of ${at}` + (shape.k === "struct"
              ? ` - known: ${Object.keys(shape.fields).join(", ")}` : `, which is no structure`));
          }
          keys.push(shape.fields[comp].key);
          shape = shape.fields[comp].shape;
        }
        return { top, keys, shape };
      };
      /** s_ctrl as the app writes it - ty_s_event_control's components by
       *  name - checked against the interface's own type */
      const eventControl = (s_ctrl, who) => {
        if (s_ctrl === undefined || s_ctrl === null) return {};
        if (!isPlainObject(s_ctrl)) throw new Error(`${who}: s_ctrl is an object - ${EVENT_CONTROL().join(", ")}`);
        for (const k of Object.keys(s_ctrl)) {
          if (!EVENT_CONTROL().includes(k)) {
            throw new Error(`${who}: s_ctrl has no component "${k}" - ${EVENT_CONTROL().join(", ")}`);
          }
        }
        return { ...s_ctrl };
      };
      /** follow_up_action( )'s and _event_client( )'s val and view - a
       *  cs_event and a cs_view constant - and t_arg */
      const frontendAction = (method, p) => ({
        val: constant("cs_event", p.val, `client.${method}( )`),
        args: p.t_arg === undefined ? [] : stringList(p.t_arg, `client.${method}( ) t_arg`),
        view: p.view === undefined ? undefined : constant("cs_view", p.view, `client.${method}( )`),
      });

      const client = {
        // -- what this roundtrip is about (see the comment above: check_on_init
        //    and check_on_navigated are not the same question)
        check_on_init: () => onInit,
        check_on_navigated: () => onNavigated,
        /** true when this roundtrip answers the event named `val`; without
         *  `val`, when it answers any event */
        check_on_event(...args) {
          const { val } = paramsOf("check_on_event", args);
          return val === undefined || val === "" ? eventName !== "" : eventName === String(val);
        },
        check_app_prev_stack: () => prevStack,
        get_event: () => eventName,
        /** an argument the event carried, 1-based as `v` is; past the last
         *  one it is initial - "" - as the ABAP READ TABLE leaves it */
        get_event_arg(...args) {
          const { v = 1 } = paramsOf("get_event_arg", args);
          if (!Number.isInteger(v) || v < 1) {
            throw new Error(`client.get_event_arg( ${v} ): v is the position of the argument, 1-based`);
          }
          return eventArgs[v - 1] ?? "";
        },
        /** client->get( ) as plain values under its ABAP component names -
         *  the event and its arguments, the draft ids (s_draft), the browser
         *  location (s_config), device, focus, scroll and UI5 information,
         *  what a returning app handed over (r_event_data) */
        get: () => (plainGet ??= toPlain(got)),
        get_app_prev: () => prevApp,
        /** The app behind a draft id; without one, the running app itself.
         *  With one, the app is read from the draft store - which a
         *  synchronous client can only do after main( ) - so it answers a
         *  handle whose fields can be WRITTEN, applied once the app is read,
         *  and which nav_app_leave( ) and nav_app_call( ) take as they take
         *  an app: get_app( get( ).s_draft.id_prev_app_stack ), a field set,
         *  nav_app_leave( it ). Reading the other app is get_app_prev( ). */
        get_app(...args) {
          const { id } = paramsOf("get_app", args);
          if (id === undefined || id === "") return plain;
          const writes = {};
          return new Proxy(new DraftApp(), {
            get(tgt, prop) {
              if (prop === DRAFT_APP) return { id: String(id), writes };
              if (typeof prop === "symbol" || prop === "then" || prop === "toJSON") return undefined;
              throw new Error(
                `client.get_app( ${id} ).${prop}: the app behind a draft id is read from the draft store ` +
                  `after main( ) returns, so its fields can be written here - applied when nav_app_leave( ) ` +
                  `or nav_app_call( ) hands it the screen - but not read. What the app on the other side ` +
                  `of the last navigation holds is client.get_app_prev( ).`,
              );
            },
            set(tgt, prop, value) {
              writes[prop] = value;
              return true;
            },
          });
        },
        app_state_get_href: () => appStateHref,

        // -- binding
        /** The binding of a field, by NAME: `{/NAME}`. A component of a
         *  structure is named as ABAP names it, "s_order-customer"; a cell is
         *  { val: column, tab: table field, tab_index: row }. path, omit_initial,
         *  omit_initial_paths, json and switch_default_model are _bind( )'s.
         *  A component, a cell or an option is registered by the framework
         *  after main( ), so it comes back as a placeholder - embed it as it is. */
        _bind(...args) {
          return bind("_bind", paramsOf("_bind", args));
        },
        /** obsolete in z2ui5_if_client - _bind( ) under another name, as there */
        _bind_edit(...args) {
          return bind("_bind_edit", paramsOf("_bind_edit", args));
        },
        /** the bare path of a field: _bind( val path = abap_true ) */
        _bind_path(...args) {
          const { val } = paramsOf("_bind_path", args);
          return bind("_bind_path", { val, path: true });
        },

        // -- handlers
        /** The handler of an event, for a view attribute. t_arg travel with it
         *  and come back as get_event_arg( 1..n ) - `arg` is one more, behind
         *  them; s_ctrl is ty_s_event_control, by component name. */
        _event(...args) {
          const p = paramsOf("_event", args);
          const t_arg = p.t_arg === undefined ? [] : stringList(p.t_arg, "client._event( ) t_arg");
          if (p.arg !== undefined) t_arg.push(String(p.arg));
          return placeholder({ kind: "event", name: String(p.val ?? ""), args: t_arg,
            ctrl: eventControl(p.s_ctrl, "client._event( )") });
        },
        /** the handler that leaves this app - a Page's navButtonPress */
        _event_nav_app_leave: () => placeholder({ kind: "nav_app_leave" }),
        /** obsolete in z2ui5_if_client - the wired form of follow_up_action( ),
         *  under another name, as there */
        _event_client(...args) {
          return placeholder({ kind: "client", ...frontendAction("_event_client", paramsOf("_event_client", args)) });
        },
        /** A front-end action - val is a cs_event constant, t_arg its
         *  arguments, view the slot whose control ids are meant. As in ABAP it
         *  has two forms, told apart by whether its result is used: embedded
         *  in a view attribute it is a handler that runs in the browser, with
         *  no roundtrip; called on its own it runs when this roundtrip's
         *  answer lands. So every call is its own placeholder, and the queued
         *  form goes out only if that placeholder reached nothing sent. */
        follow_up_action(...args) {
          const spec = { kind: "action", call: actionCalls++,
            ...frontendAction("follow_up_action", paramsOf("follow_up_action", args)) };
          const token = placeholder(spec);
          queue.push(["follow_up", spec, token]);
          return token;
        },

        // -- the screen: recorded, replayed in order after main( ). A view is
        //    XML text, a ViewBuilder, or what its stringify( ) answered.
        view_display(...args) { queue.push(["view", paramsOf("view_display", args)]); },
        view_destroy() { queue.push(["view_destroy"]); },
        popup_display(...args) { queue.push(["popup", paramsOf("popup_display", args)]); },
        popup_destroy() { queue.push(["popup_destroy"]); },
        /** a popover anchored to the control whose id is by_id */
        popover_display(...args) { queue.push(["popover", paramsOf("popover_display", args)]); },
        popover_destroy() { queue.push(["popover_destroy"]); },
        /** A view rendered INTO the control `id` of the main view, which stays
         *  as it is: method_insert is the UI5 mutator that adds it to the
         *  control's aggregation, method_destroy the one that clears what was
         *  there first - without it, every call adds one more. */
        nest_view_display(...args) { queue.push(["nest", paramsOf("nest_view_display", args)]); },
        nest_view_destroy() { queue.push(["nest_destroy"]); },
        nest2_view_display(...args) { queue.push(["nest2", paramsOf("nest2_view_display", args)]); },
        nest2_view_destroy() { queue.push(["nest2_destroy"]); },
        /** text is a string, or data - an object, an array - which the
         *  framework lays out as for an ABAP structure or table. An object
         *  with a `text` key is the parameters by name. */
        message_box_display(...args) {
          const p = paramsOf("message_box_display", args, (o) => isPlainObject(o) && Object.hasOwn(o, "text"));
          if (p.actions !== undefined) stringList(p.actions, "client.message_box_display( ) actions");
          queue.push(["box", p]);
        },
        message_toast_display(...args) { queue.push(["toast", paramsOf("message_toast_display", args)]); },

        // -- navigation and the URL, scheduled for the end of the roundtrip by
        //    the framework, so usually the last thing a branch does
        /** Show another app on top of this one: its registered name, its
         *  defineApp class, or an instance. The second argument is cap2UI5's
         *  own: fields to preset on a defineApp app, what an ABAP app does
         *  between NEW and nav_app_call( ). */
        nav_app_call(...args) {
          const [first, fields] = args;
          queue.push(["nav_call", paramsOf("nav_app_call", [first]).app, fields]);
        },
        /** Hand the screen back - to the caller, or to `app`. `event` is what
         *  it finds in get_event( ), `r_data` what it finds in get( ).r_event_data,
         *  typed, so an ABAP caller can ASSIGN it. */
        nav_app_leave(...args) { queue.push(["nav_leave", paramsOf("nav_app_leave", args)]); },
        hash_set(...args) { queue.push(["hash_set", String(paramsOf("hash_set", args).val ?? "")]); },
        hash_replace(...args) { queue.push(["hash_replace", String(paramsOf("hash_replace", args).val ?? "")]); },
        app_state_set_active(...args) {
          queue.push(["app_state", Boolean(paramsOf("app_state_set_active", args).val ?? true)]);
        },
        set_session_stateful() {
          throw new Error(
            "client.set_session_stateful( ) is not supported by cap2UI5: it keeps the app in a pinned " +
              "ABAP session instead of its draft, and the CAP host has not been built or tested for that " +
              "- per user, across restarts. Keep the state in the app's fields; they are in the draft.",
          );
        },

        ...constants(),                          // cs_event, cs_view, cs_nav_mode, cs_device - cs_transition
        raw: c,                                  // the transpiled z2ui5_if_client, async
      };

      /** _bind( ) and its two other names: the binding of a field, a
       *  component or a cell - a placeholder when the framework has to
       *  register it with options after main( ) */
      function bind(method, p) {
        const who = `client.${method}( )`;
        for (const k of ["custom_mapper", "custom_mapper_back", "custom_filter", "custom_filter_back"]) {
          if (p[k] !== undefined) {
            throw new Error(`${who}: ${k} takes an ABAP object implementing the bundled AJSON library's ` +
              `interfaces, which z2ui5_if_client declares obsolete - omit_initial, omit_initial_paths and ` +
              `json say what it was used for`);
          }
        }
        const cell = p.tab !== undefined || p.tab_index !== undefined;
        const target = fieldOf(cell ? p.tab : p.val, who);
        if (cell) {
          if (target.shape.k !== "table") {
            throw new Error(`${who}: tab names a TABLE field, and ${p.tab} is not one`);
          }
          if (!Number.isInteger(p.tab_index) || p.tab_index < 1) {
            throw new Error(`${who}: tab_index is the row, 1-based - got ${p.tab_index}`);
          }
          if (!Object.hasOwn(target.shape.fields, p.val)) {
            throw new Error(`${who}: with tab, val is the column - "${p.val}" is not one of ${p.tab}: ` +
              `${Object.keys(target.shape.fields).join(", ")}`);
          }
        }
        const options = {
          omit_initial: Boolean(p.omit_initial),
          json: Boolean(p.json),
          switch_default_model: Boolean(p.switch_default_model),
          omit_initial_paths: p.omit_initial_paths && stringList(p.omit_initial_paths, `${who} omit_initial_paths`),
        };
        if (cell || target.keys.length || options.omit_initial || options.omit_initial_paths || options.json ||
            options.switch_default_model) {
          return placeholder({
            kind: "bind", field: target.top, components: target.keys, path: Boolean(p.path),
            row: cell ? p.tab_index : undefined, column: cell ? target.shape.fields[p.val].key : undefined,
            ...options,
          });
        }
        // Answered now, bound after main( ) - see boundPath( ). path_only is
        // the same binding without its braces (finalize_path).
        bound.add(target.top);
        const braced = boundPath(target.top);
        return p.path ? braced.slice(1, -1) : braced;
      }
      for (const m of OBSOLETE) client[m] = () => {};
      // The names of cap2ui5 0.1.0 say where they went, rather than answer
      // undefined: `if (client.isDisplay)` would be false on every roundtrip.
      for (const [old, now] of Object.entries(RETIRED)) {
        Object.defineProperty(client, old, {
          get() {
            throw new Error(`client.${old} is gone - the client's methods are named as z2ui5_if_client ` +
              `names them: ${now}`);
          },
        });
      }

      // ---- run the app: no async needed on its side ------------------------
      // A method is bound to the PROXY, not to the instance behind it: an app
      // splits main( ) into helpers the way an ABAP app has view_display( )
      // and on_event( ), and a helper bound to the instance read the ABAP
      // boxes - worse, `this.name = "x"` in it replaced a box with a string,
      // which _bind( ) matches by identity and then could not find.
      //
      // A field is an OWN key of shapes: `shapes[prop]` alone also found what
      // every object inherits - constructor, toString, hasOwnProperty - and
      // then `${this}` or `this.constructor` threw "box.get is not a function".
      const isField = (prop) => typeof prop === "string" && Object.hasOwn(shapes, prop);
      const plain = new Proxy(this, {
        get(tgt, prop, recv) {
          const v = Reflect.get(tgt, prop, recv);
          if (isField(prop)) return unwrap(v, shapes[prop]);
          // the class itself stays the class - bound, it is no constructor of anything
          return typeof v === "function" && prop !== "constructor" ? v.bind(recv) : v;
        },
        set(tgt, prop, value) {
          if (isField(prop)) {
            wrap(tgt[prop], value, shapes[prop], `this.${prop}`);
            return true;
          }
          return Reflect.set(tgt, prop, value);
        },
      });
      try {
        await userMain.call(plain, client);      // await: an async main still works
      } catch (e) {
        throw privateMemberError(e, INTERNAL) ?? e;
      }

      // ---- flush: resolve the placeholders, prepare, then replay -----------
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
      const used = new Set();                  // token numbers that reached something sent
      const subst = (s, { xml = false } = {}) => {
        const out = String(s).replace(TOK_RE, (tok, i) => {
          if (values[i] === undefined) return tok;
          used.add(Number(i));
          return xml ? xmlEscape(values[i]) : String(values[i]);
        });
        // What is left is a placeholder the app changed after the client
        // returned it - cut, re-encoded, case-changed. Shipping it would send
        // the browser a handler that does nothing, so refuse.
        const at = out.search(TOK_LEFT);
        if (at >= 0 && !out.slice(at).toLowerCase().startsWith(TOK_PREFIX)) {
          throw new Error(
            `client._event( ): a placeholder from an EARLIER roundtrip reached the view: ` +
              `"${out.slice(at, at + TOK_PREFIX.length + 4)}…". A placeholder is replaced in the roundtrip ` +
              `that made it and means nothing after it - call _event( ), _event_nav_app_leave( ), ` +
              `follow_up_action( ) or the _bind( ) with options where the view is built, not once into a field.`,
          );
        }
        if (at >= 0) {
          throw new Error(
            `client._event( ): a placeholder it returned reached the view altered, so it cannot be ` +
              `replaced by the event's wire string: "${out.slice(at, at + TOK_PREFIX.length + 12)}…". ` +
              `Embed what _event( ), _event_nav_app_leave( ), follow_up_action( ) and a _bind( ) with ` +
              `options return in the markup as it is; do not parse, cut or re-encode it.`,
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
      const eventControlBox = (ctrl) => {
        const s = abap.Classes["Z2UI5_IF_CLIENT"].METHODS._EVENT.parameters.S_CTRL.type();
        for (const [k, v] of Object.entries(ctrl)) {
          const comp = s.get()[k];
          comp.set(comp instanceof abap.types.Character && comp.getLength() === 1 ? (v ? "X" : " ") : subst(v));
        }
        return s;
      };
      /** _bind( ) with its options, on the box itself: the framework finds a
       *  component, like a field, by reference - and a cell as the component
       *  box of that row of the table (bind_tab_cell). */
      const bindWith = async (p) => {
        let box = this[p.field];
        for (const k of p.components) box = box.get()[k];
        const input = { val: box, result: 1 };
        if (p.row !== undefined) {
          const row = box.array()[p.row - 1];
          if (!row) {
            throw new Error(`client._bind( ): row ${p.row} of ${[p.field, ...p.components].join("-")} does not ` +
              `exist - the table has ${box.array().length} row(s)`);
          }
          input.val = row.get()[p.column];
          input.tab = box;
          input.tab_index = new abap.types.Integer().set(p.row);
        }
        if (p.path) input.path = B(true);
        if (p.omit_initial) input.omit_initial = B(true);
        if (p.omit_initial_paths) input.omit_initial_paths = stringTable(p.omit_initial_paths.map((x) => x.toUpperCase()));
        if (p.json) input.json = B(true);
        if (p.switch_default_model) input.switch_default_model = B(true);
        return (await c.z2ui5_if_client$_bind(input)).get();
      };
      // The fields main( ) bound: now they are part of the model, sent to
      // the browser and written back by it - and only they. The framework's
      // answer is what the app was handed; abi-gate.test.mjs holds the two
      // equal, and a runtime that disagrees fails the roundtrip here rather
      // than render a view bound to nothing.
      for (const f of bound) {
        const real = String((await c.z2ui5_if_client$_bind({ val: this[f], result: 1 })).get());
        if (real !== boundPath(f)) {
          throw new Error(`client._bind( "${f}" ): the runtime bound it as ${real}, not as ${boundPath(f)} - ` +
            `the path a field's binding is answered with before main( ) returns`);
        }
      }
      // In the order the app made them: a placeholder in another one's
      // arguments was made before it, so it is resolved first.
      for (const [i, p] of placeholders.entries()) {
        if (p.kind === "event") {
          const input = { val: S(p.name), result: 1 };
          if (p.args.length) input.t_arg = stringTable(p.args.map((x) => subst(x)));
          if (Object.keys(p.ctrl).length) input.s_ctrl = eventControlBox(p.ctrl);
          values[i] = (await c.z2ui5_if_client$_event(input)).get();
        } else if (p.kind === "nav_app_leave") {
          values[i] = (await c.z2ui5_if_client$_event_nav_app_leave({ result: 1 })).get();
        } else if (p.kind === "action") {
          // result supplied: follow_up_action( ) answers the wire and queues nothing
          values[i] = (await c.z2ui5_if_client$follow_up_action(actionInput(p, { result: 1 }))).get();
        } else if (p.kind === "client") {
          values[i] = (await c.z2ui5_if_client$_event_client(actionInput(p, { result: 1 }))).get();
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
        let instance = app === plain ? this : app;
        const draft = app?.[DRAFT_APP];
        if (draft) {
          const stored = await c.z2ui5_if_client$get_app({ id: S(draft.id), result: 1 });
          if (abap.compare.initial(stored)) {
            throw new Error(`client.get_app( ${draft.id} ): no app is stored under that draft id`);
          }
          instance = stored.get();
          presetFields(instance, draft.writes, `client.get_app( ${draft.id} )`);
        } else if (typeof app === "string" || typeof app === "function") {
          const Cls = typeof app === "function" ? app : abap.Classes[app.toUpperCase()];
          if (!Cls) {
            throw new Error(
              `client.nav_app_call( "${app}" ): no app of that name is registered. ` +
                `Known: ${Object.keys(abap.Classes).filter((k) => k.startsWith("Z")).slice(0, 20).join(", ")}…`,
            );
          }
          instance = await new Cls().constructor_();
        }
        if (fields !== undefined) presetFields(instance, fields, "client.nav_app_call( )");
        const ref = new abap.types.ABAPObject({ qualifiedName: "Z2UI5_IF_APP" });
        ref.set(instance);
        return ref;
      };
      /** The fields nav_app_call( ) presets, or that the app wrote to what
       *  get_app( id ) answered: written through a defineApp app's own shapes
       *  after its constructor_( ) - so they win over its initializers - and
       *  into an ABAP app's attributes as the transpiler stores them. */
      const presetFields = (instance, fields, who) => {
        const name = instance?.constructor?.INTERNAL_NAME ?? "the app";
        const own = instance?.__shapes;
        for (const [k, v] of Object.entries(fields)) {
          if (own) {
            if (!Object.hasOwn(own, k) || isFrameworkField(k)) {
              throw new Error(`${who}: ${k} is not a field of ${name} - known: ` +
                `${Object.keys(own).filter((f) => !isFrameworkField(f)).join(", ")}`);
            }
            wrap(instance[k], v, own[k], `${who}: ${k}`);
            continue;
          }
          const box = instance?.[k.toLowerCase()];
          if (!isBoxed(box)) throw new Error(`${who}: ${k} is not an attribute of ${name}`);
          box.set(typeof v === "boolean" ? (v ? "X" : " ") : v !== null && typeof v === "object" ? boxOf(v, who) : v);
        }
      };
      /** A message box's text: a string, or data the framework lays out */
      const boxText = (text) => {
        if (text instanceof Error) return S(text.message);
        if (text !== null && typeof text === "object") return boxOf(text, "client.message_box_display( )");
        return S(subst(text ?? ""));
      };
      /** a view's XML: text, a ViewBuilder chain rendered by upstream's class,
       *  or what its stringify( ) answered - the placeholders replaced */
      const xmlOf = async (v) => {
        const rendering = renderOf(v);
        return subst(rendering ? await rendering : await v, { xml: true });
      };
      const strings = (p, skip = []) => Object.fromEntries(Object.entries(p)
        .filter(([k]) => !skip.includes(k)).map(([k, v]) => [k, S(subst(v))]));

      // Prepared first, all of it, so that whether a follow_up_action( )
      // placeholder reached anything sent is known before the replay decides
      // whether to queue it.
      const prepared = [];
      for (const [kind, arg] of queue) {
        if (kind === "view") {
          prepared.push({ ...strings(arg, ["val", "transition_back"]), val: S(await xmlOf(arg.val)),
            ...(arg.transition_back === undefined ? {} : { transition_back: B(arg.transition_back) }) });
        }
        else if (kind === "popup") prepared.push({ val: S(await xmlOf(arg.val)) });
        else if (kind === "popover") prepared.push({ xml: S(await xmlOf(arg.xml)), by_id: S(subst(arg.by_id)) });
        else if (kind === "nest" || kind === "nest2") {
          prepared.push({ ...strings(arg, ["val"]), val: S(await xmlOf(arg.val)) });
        } else if (kind === "box") {
          const input = { ...strings(arg, ["text", "actions"]), text: boxText(arg.text) };
          if (arg.actions !== undefined) input.actions = stringTable(stringList(arg.actions, "actions").map((x) => subst(x)));
          prepared.push(input);
        } else if (kind === "toast") prepared.push(strings(arg));
        else if (kind === "follow_up") prepared.push(actionInput(arg));
        else prepared.push(undefined);
      }

      for (const [i, [kind, arg, extra]] of queue.entries()) {
        const input = prepared[i];
        if (kind === "view") await c.z2ui5_if_client$view_display(input);
        else if (kind === "view_destroy") await c.z2ui5_if_client$view_destroy();
        else if (kind === "popup") await c.z2ui5_if_client$popup_display(input);
        else if (kind === "popup_destroy") await c.z2ui5_if_client$popup_destroy();
        else if (kind === "popover") await c.z2ui5_if_client$popover_display(input);
        else if (kind === "popover_destroy") await c.z2ui5_if_client$popover_destroy();
        else if (kind === "nest") await c.z2ui5_if_client$nest_view_display(input);
        else if (kind === "nest_destroy") await c.z2ui5_if_client$nest_view_destroy();
        else if (kind === "nest2") await c.z2ui5_if_client$nest2_view_display(input);
        else if (kind === "nest2_destroy") await c.z2ui5_if_client$nest2_view_destroy();
        else if (kind === "box") await c.z2ui5_if_client$message_box_display(input);
        else if (kind === "toast") await c.z2ui5_if_client$message_toast_display(input);
        else if (kind === "follow_up") {
          // its result reached a view attribute: the wired form, nothing to queue
          if (!used.has(Number(extra.slice(TOK_PREFIX.length, -1)))) {
            await c.z2ui5_if_client$follow_up_action(input);
          }
        } else if (kind === "hash_set") await c.z2ui5_if_client$hash_set({ val: S(arg) });
        else if (kind === "hash_replace") await c.z2ui5_if_client$hash_replace({ val: S(arg) });
        else if (kind === "app_state") await c.z2ui5_if_client$app_state_set_active({ val: B(arg) });
        else if (kind === "nav_call") {
          await c.z2ui5_if_client$nav_app_call({ app: await appRef(arg, extra), result: 1 });
        } else if (kind === "nav_leave") {
          const o = arg ?? {};
          const leave = { result: 1 };
          if (o.app !== undefined) leave.app = await appRef(o.app);
          if (o.event !== undefined) leave.event = S(o.event);
          // typed, so an ABAP caller can ASSIGN it and a JavaScript one reads
          // it back as get( ).r_event_data - not a JSON string neither could use
          if (o.r_data !== undefined && o.r_data !== null) leave.r_data = boxOf(o.r_data, "client.nav_app_leave( r_data )");
          await c.z2ui5_if_client$nav_app_leave(leave);
        }
      }
    }
  }

  App.INTERNAL_TYPE = "CLAS";
  App.INTERNAL_NAME = INTERNAL;
  App[DEFINED] = true;
  if (agent !== undefined) App[AGENT] = agent;
  App.IMPLEMENTED_INTERFACES = opts.interfaces ?? ["Z2UI5_IF_APP", "IF_SERIALIZABLE_OBJECT"];
  App.METHODS = {};
  App.ATTRIBUTES = {};
  new App();                                     // fills ATTRIBUTES before first use
  abap.Classes[INTERNAL] = App;
  if (!defined.includes(INTERNAL)) defined.push(INTERNAL);
  return App;
}

module.exports = { defineApp, definedApps, t, shapeOf, z2ui5_if_client };
