// The client main( ) is handed: z2ui5_if_client by its own names, answering
// the queries from what lib/app/before.js asked up front, and recording every
// command for lib/app/flush.js to make after main( ).
//
// A PLACEHOLDER stands for what only an async framework call can produce: an
// event wire (_event, _event_nav_app_leave, the wired form of
// follow_up_action) and a binding the framework has to register with options
// (_bind of a component, a cell, omit_initial, json; window_bind_tab of a
// component). One per distinct call - a follow_up_action( ) and a
// window_bind_tab( ) one per CALL - resolved after main( ) in the order they
// were made, so a placeholder inside another one's arguments is resolved
// first. XML-inert and JSON-safe: [A-Za-z0-9_] only, so a view builder that
// escapes attribute values passes it through. The nonce is per roundtrip so a
// token cannot collide with text the app put there itself; the closing "_"
// keeps _1_ from matching inside _10_.
const crypto = require("node:crypto");
const { isPlainObject, describe, boundPath, abapPath, toPlain } = require("./types");
const { constants, constant, paramsOf, stringList, EVENT_CONTROL, RETIRED } = require("./interface");

/** What client.get_app( id ) answers - see there. */
class DraftApp {}
const DRAFT_APP = Symbol("cap2ui5.draftApp");

/** The state one roundtrip shares between the client and the flush after
 *  main( ): the app, the answers asked up front, and what main( ) recorded. */
function roundtripState(c, app, asked, isFrameworkField) {
  const shapes = app.__shapes;
  const prefix = `z2ui5evt_${crypto.randomBytes(6).toString("hex")}_`;
  return {
    c, app, shapes, ...asked,
    // the app's own fields - what _bind( ) can name. NOT bound up front: a
    // field becomes part of the model when the app binds it, as in ABAP,
    // where the framework sends and accepts only bound attributes. Binding
    // every field sent every field to the browser and let the browser write
    // every field, the ones no view shows included.
    fields: new Set(Object.keys(shapes).filter((f) => !isFrameworkField(f))),
    bound: new Set(),                      // fields main( ) bound without options
    windowBinds: [],                       // window_bind_tab( ) of a field, in the order main( ) made them
    placeholders: [],                      // token number -> what it stands for
    queue: [],                             // the commands, in the order main( ) made them
    hrefAsked: false,                      // main( ) called app_state_get_href( )
    plain: null,                           // the proxy main( ) runs on - lib/define-app.js
    TOK_PREFIX: prefix,
    TOK_RE: new RegExp(`${prefix}(\\d+)_`, "g"),
  };
}

/** A field, or a component of a structure field, named as ABAP names it:
 *  `s_order-customer` (a `.` works too), or the data a t.ref( ) field points
 *  to, `mr_tab->*`. Its shape, and the keys from the field's box to it - `*`
 *  is the dereference. */
function fieldOfIn(rt, name, who) {
  const { fields, shapes } = rt;
  const deref = /->\*$/.exec(String(name));
  if (deref) {
    const top = String(name).slice(0, deref.index);
    if (!fields.has(top) || shapes[top].k !== "ref") {
      throw new Error(`${who}: ${name} - only a t.ref( ) field is dereferenced, and ${top} is ` +
        `${fields.has(top) ? "none" : "not a field of this app"}`);
    }
    return { top, keys: ["*"], shape: shapes[top].inner };
  }
  const [top, ...components] = String(name).split(/[-.]/);
  if (!fields.has(top)) {
    throw new Error(
      `${who}: ${top} is not a field of this app - in JavaScript the client takes a field's ` +
        `NAME, client._bind("name"), not its value. Known: ${[...fields].join(", ") || "(none)"}`,
    );
  }
  let shape = shapes[top];
  if (shape.k === "ref" && components.length) {
    throw new Error(`${who}: ${name} - ${top} is a reference; a component of the data behind it is not supported, bind ${top}->*`);
  }
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
}

/** the box of a field, or of a component of it by its keys */
const boxIn = (app, field, keys) => keys.reduce((box, k) => (k === "*" ? box.getPointer() : box.get()[k]), app[field]);

/** @returns the client main( ) is handed */
function createClient(rt) {
  const { c, app, bound, windowBinds, placeholders, queue, TOK_PREFIX,
    onInit, onNavigated, prevStack, onNavBack, navTag, got, eventName, startParams, eventArgs, prevApp,
    appStateHref } = rt;
  const tokens = new Map();               // JSON of that -> token, one per distinct call
  const placeholder = (spec) => {
    const key = JSON.stringify(spec);
    if (!tokens.has(key)) {
      placeholders.push(spec);
      tokens.set(key, `${TOK_PREFIX}${placeholders.length - 1}_`);
    }
    return tokens.get(key);
  };
  let plainGet;                            // client->get( ), converted on first use
  let navPending = false;                  // main( ) called nav_app_call( ) or nav_app_leave( )
  let actionCalls = 0;
  let windowCalls = 0;

    const fieldOf = (name, who) => fieldOfIn(rt, name, who);
  /** window_bind_tab( )'s val: a TABLE field, or a
   *  table component of a structure field - and the name the framework
   *  keeps the attribute under, `ROWS`, `ORDER-LINES` */
  const tableOf = (name, who) => {
    const target = fieldOf(name, who);
    if (target.shape.k !== "table") throw new Error(`${who}: val names a TABLE field, and ${name} is not one`);
    return { ...target, name: abapPath(target.top, target.keys) };
  };
  /** the box of a field, or of a component of it by its keys */
  const boxAt = (field, keys) => boxIn(app, field, keys);
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
    // -- what this roundtrip is about (lib/app/before.js: check_on_init
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
    check_on_nav_back: () => onNavBack,
    get_nav_tag: () => navTag,
    /** whether THIS main( ) has already called nav_app_call( ) or
     *  nav_app_leave( ) - the calls are made after main( ), so the
     *  answer is kept here */
    check_nav_pending: () => navPending,
    /** One start parameter of the page, by name, whichever way the app
     *  was started - the framework's own answer (the URL query, the
     *  launchpad's startupParameters, the intent's query, in that
     *  order), asked before main( ) for every name the three carry. */
    get_start_param(...args) {
      const { name } = paramsOf("get_start_param", args);
      return startParams.get(String(name ?? "").trim().toLowerCase()) ?? "";
    },
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
      if (id === undefined || id === "") return rt.plain;
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
    app_state_get_href: () => { rt.hrefAsked = true; return appStateHref; },

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
    /** the bare path of a field: _bind( val path = abap_true ) */
    _bind_path(...args) {
      const { val } = paramsOf("_bind_path", args);
      return bind("_bind_path", { val, path: true });
    },

    /** Bind a LARGE result to a list control that the APP loads a window
     *  at a time, as z2ui5_if_client=>window_bind_tab does: `val` names
     *  the table field holding the rows loaded so far, in the order the
     *  browser shows them; `total` says how many there are in all - a
     *  number, or the NAME of a number field, which the framework then
     *  reads anew for every response, so an event that loads, sorts or
     *  filters only sets the field and renders no view (ABAP passes the
     *  attribute, `total = mv_total`; here a field goes by its name, as
     *  for _bind( ));
     *  `event` is the app's event the browser's requests arrive as, the
     *  request in get( ).r_event_data - { path, reason, skip, top,
     *  t_sort, t_filter }, reason one of cs_window_reason; `window` is
     *  the rows the browser asks for at a time (100 unless set). The
     *  framework neither sorts nor filters nor counts - loading the rows
     *  is the app's. Answers the binding as _bind( ) does, `{/ROWS}`. A
     *  table component of a structure is registered after main( ), so
     *  its binding is a placeholder - embed it as it is. */
    window_bind_tab(...args) {
      const who = "client.window_bind_tab( )";
      const p = paramsOf("window_bind_tab", args);
      const target = tableOf(p.val, who);
      let total = p.total;
      if (typeof total === "string") {
        const field = fieldOf(total, who);
        if (field.shape.k === "table" || field.shape.k === "struct" || typeof boxAt(field.top, field.keys)?.get?.() !== "number") {
          throw new Error(`${who}: total names a NUMBER field, and ${p.total} is not one`);
        }
        total = { field: field.top, components: field.keys };
      } else if (!Number.isInteger(total) || total < 0) {
        throw new Error(`${who}: total is the number of rows there are in all, or the name of the field ` +
          `that holds it - got ${describe(p.total)}`);
      }
      if (typeof p.event !== "string" || !p.event) {
        throw new Error(`${who}: event is the name of the app's event the browser's requests arrive as - got ${describe(p.event)}`);
      }
      if (p.window !== undefined && !(Number.isInteger(p.window) && p.window >= 1)) {
        throw new Error(`${who}: window is the number of rows the browser asks for at a time, at least 1 - got ${describe(p.window)}`);
      }
      const spec = { kind: "window", call: windowCalls++, field: target.top, components: target.keys,
        total, event: p.event, window: p.window };
      if (target.keys.length) return placeholder(spec);
      // a field: answered now, registered after main( ) - as _bind( ) is
      windowBinds.push(spec);
      return boundPath(target.top);
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
      // an app is an object too: only one that names `app` is the parameters
      const p = paramsOf("nav_app_call", [first], (o) => isPlainObject(o) && Object.hasOwn(o, "app"));
      navPending = true;
      queue.push(["nav_call", p, fields]);
    },
    /** Hand the screen back - to the caller, or to `app`. `event` is what
     *  it finds in get_event( ), `r_data` what it finds in get( ).r_event_data,
     *  typed, so an ABAP caller can ASSIGN it. */
    nav_app_leave(...args) {
      const p = paramsOf("nav_app_leave", args);
      navPending = true;
      queue.push(["nav_leave", p]);
    },
    /** DECLARE the repeating timer of this app: the event `event` every
     *  `delay_ms` milliseconds for as long as the app has the screen -
     *  the framework keeps it running. timer_stop( ) ends it. */
    timer_set(...args) {
      const p = paramsOf("timer_set", args);
      if (!Number.isInteger(p.delay_ms)) {
        throw new Error(`client.timer_set( ): delay_ms is a whole number of milliseconds - got ${describe(p.delay_ms)}`);
      }
      queue.push(["timer_set", p]);
    },
    timer_stop() { queue.push(["timer_stop"]); },
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
    if (target.shape.k === "ref") {
      throw new Error(`${who}: ${cell ? p.tab : p.val} is a reference - bind the data behind it, ` +
        `"${cell ? p.tab : p.val}->*", as _bind( lr_data->* ) does in ABAP`);
    }
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

  return client;
}

/** What survives a cut or a case change of a placeholder - of THIS
 *  roundtrip's nonce or of any other: a placeholder the app kept in a field
 *  and embedded one roundtrip later carries an old nonce. */
const TOK_LEFT = /z2ui5evt_[0-9a-f]{12}_/i;

module.exports = { roundtripState, createClient, fieldOfIn, boxIn, DraftApp, DRAFT_APP, TOK_LEFT };
