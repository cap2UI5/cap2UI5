// Boxes and shapes: how an app's plain JavaScript values cross into the
// framework's boxed ABAP values (abap.types.*) and back.
//
// Narrow on purpose, and it refuses rather than guesses. Numbers are the real
// ambiguity - ABAP has I, P and F and they render differently - so an integer
// becomes I, a fractional number F, and a decimal amount has to say so with
// t.packed( ).

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
  /** A data reference, `TYPE REF TO data`, to a value of the shape given:
   *  `t.ref(t.table({ id: 0, text: "" }))`. The constructor creates the data
   *  it points to (`CREATE DATA`); the app reads and writes that data, and
   *  binds it dereferenced, `client._bind("mr_tab->*")`. */
  ref: (target) => declared(refFor(target)),
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

/** `TYPE REF TO data`, as the transpiler declares it - the type it is created
 *  with is the pointer's, never this placeholder - and the shape of what it
 *  points to. The initial value is the target's: written into the data the
 *  constructor creates. */
function refFor(target, path = []) {
  const inner = shapeOf(target, [...path, "->*"]);
  if (!inner) throw new Error(`t.ref( ) takes a value of the type to point to - ${describe(target)} has no ABAP type`);
  if (inner.k === "ref") throw new Error("t.ref( ) of a t.ref( ): a reference to a reference is not supported");
  const shape = { k: "ref", inner, make: () => new abap.types.DataReference(new abap.types.Character(4)) };
  const box = Object.defineProperty(shape.make(), "__shape", { value: shape });
  return withInitial(box, initialOf(target) ?? REF_CREATE);
}
/** The initial value of a t.ref( ) whose target has none of its own: the
 *  data is created all the same. */
const REF_CREATE = Symbol("cap2ui5.ref-create");
/** The data a reference points to, created on first need as CREATE DATA
 *  does - of the target's shape. */
function pointerOf(box, shape) {
  if (!box.getPointer()) box.assign(shape.inner.make());
  return box.getPointer();
}

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
    case "ref": return box.getPointer() ? unwrap(box.getPointer(), shape.inner) : null;
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
  if (shape.k === "ref") {
    // the value is written into the data the reference points to, as
    // `mr_tab->* = …` does; null and undefined clear that data, not the reference
    if (value === REF_CREATE) {
      pointerOf(box, shape);
      return;
    }
    if (value instanceof abap.types.DataReference) {
      box.set(value);
      return;
    }
    wrap(pointerOf(box, shape), value, shape.inner, `${at}->*`);
    return;
  }
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
/** The name the framework keeps an attribute under, as RTTI spells it:
 *  `ROWS`, `ORDER-LINES`, `MR_TAB->*` for the data behind a reference. */
const abapPath = (top, keys) =>
  [top, ...keys.filter((k) => k !== "*")].join("-").toUpperCase() + (keys.includes("*") ? "->*" : "");

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

/** abap.types helpers for the calls the client makes */
const S = (v = "") => new abap.types.String().set(String(v));
const B = (v) => new abap.types.Character(1, { qualifiedName: "ABAP_BOOL" }).set(v ? "X" : " ");
const stringTable = (list) => {
  const tab = abap.types.TableFactory.construct(
    new abap.types.String({ qualifiedName: "STRING" }), STANDARD_TABLE, "");
  for (const a of list) tab.append(new abap.types.String().set(a));
  return tab;
};

module.exports = {
  STANDARD_TABLE, t, isBoxed, isPlainObject, shapeOf, initialOf, unwrap, wrap, describe, readState,
  fieldNameError, abapName, isFrameworkField, boundPath, abapPath, toPlain, boxOf, S, B, stringTable,
};
