// After main( ): the placeholders it was handed are resolved by the
// framework's own calls, in the order it made them, and the commands it
// recorded are made in that order - lib/app/client.js records them.
const { isBoxed, isFrameworkField, boundPath, boxOf, wrap, S, B, stringTable } = require("./types");
const { stringList } = require("./interface");
const { boxIn, DRAFT_APP, TOK_LEFT } = require("./client");
const { renderOf } = require("../view-builder");

async function flush(rt) {
  const { c, app, plain, bound, windowBinds, placeholders, queue, TOK_PREFIX, TOK_RE } = rt;
  // ---- flush: resolve the placeholders, prepare, then replay -----------
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
    const box = boxIn(rt.app, p.field, p.components);
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
  // the link main( ) handed out names this roundtrip's draft: now the
  // framework marks it as one pruning must keep - see appStateHref
  if (rt.hrefAsked) await c.z2ui5_if_client$app_state_get_href({ result: 1 });
  for (const f of bound) {
    const real = String((await c.z2ui5_if_client$_bind({ val: app[f], result: 1 })).get());
    if (real !== boundPath(f)) {
      throw new Error(`client._bind( "${f}" ): the runtime bound it as ${real}, not as ${boundPath(f)} - ` +
        `the path a field's binding is answered with before main( ) returns`);
    }
  }
  /** window_bind_tab( ), on the table's box - found by reference, as
   *  _bind( ) finds a field. */
  const windowBind = async (p) => {
    // total by reference where the app named a field: the framework looks
    // the attribute up by it and reads it anew for every response
    const total = typeof p.total === "number" ? new abap.types.Integer().set(p.total)
      : boxIn(rt.app, p.total.field, p.total.components);
    const input = { val: boxIn(rt.app, p.field, p.components), total, event: S(p.event), result: 1 };
    if (p.window !== undefined) input.window = new abap.types.Integer().set(p.window);
    return String((await c.z2ui5_if_client$window_bind_tab(input)).get());
  };
  for (const p of windowBinds) {
    const real = await windowBind(p);
    if (real !== boundPath(p.field)) {
      throw new Error(`client.window_bind_tab( "${p.field}" ): the runtime bound it as ${real}, not as ` +
        `${boundPath(p.field)} - the path a field's binding is answered with before main( ) returns`);
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
    } else if (p.kind === "window") {
      values[i] = await windowBind(p);
    }
  }

  /** nav_app_call( ) wants a BOUND z2ui5_if_app instance. The app may hand
   *  over a registered name, a defineApp class, or an instance it built
   *  itself; an unbound reference raises NAV_APP_TARGET_NOT_BOUND, so a
   *  name that resolves to nothing is refused here, where the app can see
   *  which name it was. */
  const appRef = async (app, fields) => {
    let instance = app === plain ? rt.app : app;
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
    else if (kind === "timer_set") {
      const timer = { event: S(arg.event), delay_ms: new abap.types.Integer().set(arg.delay_ms) };
      if (arg.no_busy !== undefined) timer.no_busy = B(arg.no_busy);
      await c.z2ui5_if_client$timer_set(timer);
    } else if (kind === "timer_stop") await c.z2ui5_if_client$timer_stop();
    else if (kind === "nav_call") {
      const call = { app: await appRef(arg.app, extra), result: 1 };
      if (arg.tag !== undefined) call.tag = S(arg.tag);
      if (arg.keep_messages !== undefined) call.keep_messages = B(arg.keep_messages);
      await c.z2ui5_if_client$nav_app_call(call);
    } else if (kind === "nav_leave") {
      const o = arg ?? {};
      const leave = { result: 1 };
      if (o.app !== undefined) leave.app = await appRef(o.app);
      if (o.event !== undefined) leave.event = S(o.event);
      if (o.keep_messages !== undefined) leave.keep_messages = B(o.keep_messages);
      // typed, so an ABAP caller can ASSIGN it and a JavaScript one reads
      // it back as get( ).r_event_data - not a JSON string neither could use
      if (o.r_data !== undefined && o.r_data !== null) leave.r_data = boxOf(o.r_data, "client.nav_app_leave( r_data )");
      await c.z2ui5_if_client$nav_app_leave(leave);
    }
  }
}

module.exports = { flush };
