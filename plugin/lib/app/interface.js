// z2ui5_if_client as the runtime declares it: its constants, and the
// signature of every method - read from the transpiled interface, never listed
// here - so that a call is checked against the runtime the project runs on.
const { isPlainObject, toPlain } = require("./types");

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
/** z2ui5_if_client's parameters, method by method - READ FROM THE RUNTIME's
 *  own interface, not listed here: the transpiled z2ui5_if_client carries
 *  every method's parameters (METHODS[..].parameters: the name, parm_kind,
 *  is_optional), the importing ones in the order that puts the PREFERRED one
 *  first - the one a call with a single positional argument means - and
 *  is_optional " " on those that are neither OPTIONAL nor have a DEFAULT.
 *  ABAP refuses a call without one of those at compile time; here the call
 *  is refused when it is made, rather than send "undefined" to the browser.
 *
 *  This used to be a table in this file, 25 methods long, that restated the
 *  interface and had to follow every parameter upstream added. It agreed
 *  with the runtime in every entry, so the runtime answers alone - a
 *  parameter upstream adds is one the client takes, on the runtime that has
 *  it. abi-gate.test.mjs holds the two things read here that the transpiler
 *  does not promise: the shape of `parameters`, and that the preferred
 *  parameter comes first. */
const runtimeVersion = () => {
  try { return require("@abap2ui5/node-runtime/package.json").version; } catch { return "?"; }
};
const signatures = new Map();
const signature = (method) => {
  if (signatures.has(method)) return signatures.get(method);
  const declared = globalThis.abap?.Classes?.["Z2UI5_IF_CLIENT"]?.METHODS?.[method.toUpperCase()];
  if (!declared) {
    throw new Error(`client.${method}( ): z2ui5_if_client has no such method in the abap2UI5 runtime this ` +
      `project runs on (@abap2ui5/node-runtime ${runtimeVersion()})`);
  }
  const importing = Object.entries(declared.parameters ?? {}).filter(([, p]) => p.parm_kind === "I");
  const sig = {
    names: importing.map(([n]) => n.toLowerCase()),
    required: importing.filter(([, p]) => p.is_optional !== "X").map(([n]) => n.toLowerCase()),
  };
  signatures.set(method, sig);
  return sig;
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
    if (keys.length && !keys.some((k) => names.includes(k)) && /^(_bind|window_)/.test(method)) {
      // not parameters at all: the value of a field, where its name belongs
      throw new Error(`${who}: an object is the parameters by name - { ${names.join(", ")} } - and this ` +
        `one has none of them. In JavaScript the client binds a field by its NAME, ` +
        `client.${method}("name"), not by its value.`);
    }
    for (const [k, v] of Object.entries(first)) {
      if (!names.includes(k)) {
        throw new Error(`${who}: no parameter "${k}" - { ${names.join(", ")} }, as z2ui5_if_client declares it in ` +
          `the abap2UI5 runtime this project runs on (@abap2ui5/node-runtime ${runtimeVersion()})`);
      }
      if (v !== undefined) out[k] = v;
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
  modelUpdate: "drop it - changed bound data is pushed to the view on its own",
};

module.exports = { z2ui5_if_client, constants, constant, paramsOf, stringList, EVENT_CONTROL, RETIRED };
