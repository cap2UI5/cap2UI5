// What main( ) may ask that the framework can only answer asynchronously,
// asked BEFORE main( ) runs: main( ) is synchronous, and a query has to
// answer inline. What the app calls (a command) is recorded instead and made
// after it - lib/app/flush.js.
const { S, readState } = require("./types");

/** @param c the transpiled z2ui5_if_client of this roundtrip
 *  @returns the answers the client hands out during main( ) */
async function before(c) {
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
  // the roundtrip an app gets the screen BACK on from one it called, and
  // the tag it gave that call - abap2UI5 1.151.0
  const onNavBack = await truthy(c.z2ui5_if_client$check_on_nav_back({ result: 1 }));
  const navTag = String((await c.z2ui5_if_client$get_nav_tag({ result: 1 })).get());
  // client->get( ): everything the frontend sent with this roundtrip. The
  // event name is read from it here; the rest is converted only if the app
  // asks for client.get( ), since most roundtrips never do.
  const got = await c.z2ui5_if_client$get({ result: 1 });
  const eventName = String(got.get().event.get()).trim();
  // get_start_param( name ) answers inside a synchronous main( ), and the
  // framework's method is async. Its three sources are all in get( ): the
  // URL query, the launchpad's startupParameters and the intent's query
  // in the hash - so every name they carry is asked HERE, of the
  // framework's own method. Which of them wins, and how a value is
  // decoded, stays the framework's; only the names are gathered, loosely
  // (a name too many costs one call and answers "").
  const startParams = new Map();
  {
    const { s_config, t_comp_params } = got.get();
    const decoded = (text) => { try { return decodeURIComponent(text); } catch { return text; } };
    const sources = [s_config?.get().search, s_config?.get().hash].map((v) => String(v?.get() ?? ""));
    const names = new Set((t_comp_params?.array() ?? []).map((row) => String(row.get().n.get())));
    for (const text of sources.flatMap((v) => [v, decoded(v)])) {
      for (const [, name] of text.matchAll(/[?&]([^=&#?]+)=/g)) names.add(decoded(name));
    }
    for (const name of names) {
      const key = name.trim().toLowerCase();
      if (!key || startParams.has(key)) continue;
      startParams.set(key, String((await c.z2ui5_if_client$get_start_param({ name: S(key), result: 1 })).get()));
    }
  }
  // The event's arguments, all of them: get( ) carries the table that
  // get_event_arg( v ) reads row v of, so there is nothing to ask the
  // framework for one at a time, and no limit the ABAP method does not have.
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
  // where the framework sends and accepts only bound attributes - bound up
  // front, every field would reach the browser and the browser could write
  // every field, a forged IS_ADMIN included. See boundPath( ).
  // app_state_get_href( ): composed from the browser's location and this
  // roundtrip's draft id, no side effect - so it can be answered up front,
  // which an app needs because it writes the link into a bound field.
  //
  // It HAS a side effect since abap2UI5 1.151.0: the link outlives the
  // session, so the framework marks the draft it names as one pruning
  // must keep (z2ui5_cl_ui5_app_cont->mt_draft_keep). Asked for every
  // roundtrip, that protected every draft and cap2ui5.Drafts was never
  // pruned. So the mark of this up-front call is taken back, and the
  // framework is asked again after main( ) when the app really asked.
  const draftKeep = c.mo_action.get().mo_app.get().mt_draft_keep;
  const keptBefore = draftKeep.array().slice();
  const appStateHref = String((await c.z2ui5_if_client$app_state_get_href({ result: 1 })).get());
  draftKeep.clear();
  for (const row of keptBefore) draftKeep.append(row);


  return { onInit, onNavigated, prevStack, onNavBack, navTag, got, eventName, startParams, eventArgs, prevApp,
    appStateHref };
}

module.exports = { before };
