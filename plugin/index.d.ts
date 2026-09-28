// Type declarations for what `require("cap2ui5")` exports: defineApp, the
// client an app's main( ) receives, the field declarations in `t`, and
// defineExit. The runtime is plain JavaScript (lib/); these types describe it
// as an app author sees it.

/** One name/value pair of the framework's configuration tables. */
export interface NameValue {
  n: string;
  v: string;
}

/**
 * A front-end action of z2ui5_if_client=>cs_event, by the name ABAP gives it.
 * The list is the runtime's own; a name it does not have is refused.
 */
export type FrontendAction =
  | "popup_close" | "popover_close" | "cross_app_nav_to_ext" | "cross_app_nav_to_prev_app"
  | "set_size_limit" | "set_odata_model" | "clipboard_copy" | "set_title" | "set_title_launchpad"
  | "set_favicon" | "set_focus" | "scroll_to" | "scroll_into_view" | "start_timer" | "system_logout"
  | "keyboard_shortcut" | "open_new_tab" | "location_reload" | "download_b64_file" | "urlhelper"
  | "store_data" | "play_audio" | "smart_variant_init" | "filter_bar_variant_init"
  | "control_by_id" | "control_global" | "binding_call" | "bind_element"
  | "hash_set" | "hash_replace" | "hash_back" | "hash_attach_changed" | "hash_routing"
  | "app_state_set_active" | (string & {});

/** A view slot of z2ui5_if_client=>cs_view. */
export type ViewSlot = "main" | "nested" | "nested2" | "popup" | "popover";

/** z2ui5_if_client=>ty_s_event_control: how the browser fires an event. */
export interface EventControl {
  /** cancel the control's default for this event (oEvent.preventDefault()) */
  preventDefault?: boolean;
  /** the same, decided per firing by a client expression; wins over preventDefault */
  preventDefaultExpr?: string;
  /** quote every argument, so none is evaluated as a binding or expression */
  argLiteral?: boolean;
  /** keep the LAST firing while a roundtrip runs, instead of dropping it - for liveChange */
  queueLast?: boolean;
  /** do not raise the global busy indicator for this wire */
  noBusy?: boolean;
}

/**
 * The client an app's `main( )` receives. Queries answer synchronously;
 * commands are recorded and carried out in order after `main( )` returns.
 */
export interface Client<App = Record<string, unknown>> {
  /** The first roundtrip of THIS app instance (`check_on_init( )`) - seed state here. */
  readonly isFirstRun: boolean;
  /** The first roundtrip AND every return to this app (`check_on_navigated( )`) - render here. */
  readonly isDisplay: boolean;
  /** Whether there is an app to go back to (`check_app_prev_stack( )`) - guard `navBack( )` with it. */
  readonly canGoBack: boolean;
  /**
   * The app on the other side of the last navigation: inside a called app its
   * caller, back in the caller the app that just returned. A defineApp app as
   * its fields' plain values, an ABAP app as the instance itself.
   */
  readonly prevApp: Record<string, unknown> | null;
  /** The event this roundtrip answers; `""` on a start. */
  readonly eventName: string;
  /** An argument the event carried, 1-based; the first 8 are available. */
  eventArg(i: number): string;
  /**
   * `client->get( )`: what the frontend sent with this roundtrip - the event,
   * the draft ids (`s_draft`), the browser location (`s_config`), device, focus,
   * scroll and UI5 information, the launchpad parameters - as plain values
   * under the ABAP component names.
   */
  get(): Record<string, any>;
  /** What a returning app handed over with `navBack( { data } )` (`get( )-r_event_data`); null if nothing. */
  readonly eventData: any;
  /** The absolute link to this app's current state (`app_state_get_href( )`). */
  readonly appStateHref: string;

  /**
   * The binding of one of the app's fields, for a view attribute: `{/NAME}`,
   * or with `path` the bare `/NAME` a composed binding needs. A dotted name
   * binds a component of a structure field (`"order.customer"`). `row` and
   * `column` bind one cell of a table field; `omitInitial`, `omitInitialPaths`
   * and `json` are `_bind( )`'s options. A component, a cell or one of those
   * options makes it a placeholder until `main( )` returns - embed it as it is.
   */
  bind(field: Extract<keyof App, string> | `${Extract<keyof App, string>}.${string}`, options?: {
    path?: boolean;
    row?: number;
    column?: string;
    omitInitial?: boolean;
    omitInitialPaths?: string[];
    json?: boolean;
  }): string;
  /**
   * The press/change handler for an event, for a view attribute. `args` come
   * back as `eventArg(1..n)`. Embed the result as it is: it is a placeholder
   * that is replaced after `main( )` returns.
   */
  event(name: string, args?: unknown[], control?: EventControl): string;
  /** The handler that leaves this app - a Page's navButtonPress (`_event_nav_app_leave( )`). */
  eventNavBack(): string;
  /** A front-end action as a handler: it runs in the browser when the control fires, no roundtrip. */
  eventFollowUpAction(action: FrontendAction, args?: unknown[], options?: { view?: ViewSlot }): string;

  /** Show a view: XML text, or a ViewBuilder chain (any node of it). */
  view(xml: string | ViewBuilder): void;
  /** Destroy the main view (`view_destroy( )`). */
  viewClose(): void;
  /** Show a popup over the view: XML text, or a ViewBuilder chain. */
  popup(xml: string | ViewBuilder): void;
  popupClose(): void;
  /** Open a popover anchored to the control with the id `byId`. */
  popover(xml: string | ViewBuilder, byId: string): void;
  popoverClose(): void;
  /**
   * Render a fragment into a control of the main view, which stays as it is.
   * `insert`/`clear` are the UI5 mutators of the receiving aggregation
   * (default addContent/removeAllContent).
   */
  nest(into: string, xml: string | ViewBuilder, options?: { insert?: string; clear?: string }): void;
  nestClose(): void;
  /** The second nested slot, for a second control of the main view. */
  nest2(into: string, xml: string | ViewBuilder, options?: { insert?: string; clear?: string }): void;
  nest2Close(): void;
  /** A message box. `text` may be data - an object, an array - laid out as for an ABAP structure or table. */
  messageBox(text: unknown, options?: {
    type?: string;
    title?: string;
    styleClass?: string;
    onClose?: string;
    actions?: string[];
    emphasizedAction?: string;
    initialFocus?: string;
    details?: string;
  }): void;
  messageToast(text: string, options?: { duration?: string | number; onClose?: string }): void;
  /** A front-end action the browser runs when this roundtrip's answer lands (`follow_up_action( )`). */
  followUpAction(action: FrontendAction, args?: unknown[], options?: { view?: ViewSlot }): void;

  /**
   * Show another app on top of this one: its registered name, its class, or an
   * instance. `fields` preset a defineApp app's fields before it runs.
   */
  navTo(app: string | AppConstructor | object, fields?: Record<string, unknown>): void;
  /**
   * Hand the screen back to the caller. Guard with `canGoBack`. `event` is what
   * the caller finds in `eventName`, `data` what it finds in `eventData`.
   */
  navBack(options?: { app?: string | AppConstructor | object; event?: string; data?: unknown }): void;
  /** Push a hash onto the browser history (`hash_set( )`). */
  hashSet(hash: string): void;
  /** Rewrite the hash without a history entry (`hash_replace( )`). */
  hashReplace(hash: string): void;
  /** Keep this app's state id in the URL (`app_state_set_active( )`). */
  appStateSetActive(on?: boolean): void;

  /** The framework's own z2ui5_if_client, transpiled - asynchronous, for what the facade does not cover. */
  readonly raw: unknown;
}

/** What `defineApp( )` registers and returns: the app's class, as the framework instantiates it. */
export type AppConstructor = new (...args: unknown[]) => object;

/**
 * Register an app under `name` - the name `?app_start=` starts it by.
 *
 * Every field with an initial value is part of the model and survives each
 * roundtrip; declare what an initial value cannot tell with `t`. Inside
 * `main( )` the fields read and write as plain values.
 */
export function defineApp<App extends object>(
  name: string,
  app: new () => App & { main(client: Client<App>): void | Promise<void> },
  options?: { interfaces?: string[] },
): AppConstructor;

/**
 * Field declarations for what an initial value cannot say. Each returns an
 * ABAP-typed box at runtime; inside `main( )` the field reads and writes as
 * the plain value typed here.
 */
export const t: {
  string(): string;
  int(): number;
  float(): number;
  bool(): boolean;
  /** CHAR n. */
  char(length: number): string;
  /** A decimal amount: P, `length` bytes, `decimals` places. */
  packed(length: number, decimals: number): number;
  /** A structure; a plain object field is one implicitly. */
  struct<S extends object>(fields: S): S;
  /** A table of structures - the argument is one ROW, the initial value is empty. */
  table<Row extends object>(row: Row): Row[];
};

/**
 * The framework's user exit, one per project: what the page and every
 * roundtrip are configured with - the Content-Security-Policy, the security
 * headers, the UI5 bootstrap URL, the theme, the draft expiry. Change `cfg`
 * in place; what a hook leaves alone keeps the framework's default.
 */
export function defineExit<E extends Exit>(exit: E): E;

export interface Exit {
  onPage?(cfg: Record<string, unknown>, context: ExitContext): void | Promise<void>;
  onRoundtrip?(cfg: Record<string, unknown>, context: ExitContext): void | Promise<void>;
}

export interface ExitContext {
  path: string;
  app_start: string;
  t_params: NameValue[];
}

/**
 * abap2UI5's z2ui5_cl_ui5_view_builder, for a JavaScript app: the same verbs
 * and the same one rule - a( ) lands on the element the chain points at, the
 * child just added by ele( )/tag( ) or the node itself while it has none.
 * The chain is recorded and rendered by upstream's class after main( ), so
 * its XML and escaping are those of an ABAP app's view.
 *
 *     const view = ViewBuilder.factory();
 *     view.ele("View", "mvc").a("xmlns", "sap.m").a("xmlns:mvc", "sap.ui.core.mvc")
 *         .ele("Page").a("title", "Hello")
 *             .tag("Input").a("value", c.bind("name"))
 *             .tag("Button").a("text", "Go").a("press", c.event("GO"));
 *     c.view(view);
 */
export class ViewBuilder {
  /** An empty builder root; open the mvc:View and declare its xmlns yourself. */
  static factory(): ViewBuilder;
  /** Braces and backslashes escaped, so UI5 shows text instead of reading a binding. */
  static escapeLiteral(text: string): string;
  /** Add a child element and descend into it. `ns` is the namespace prefix. */
  ele(name: string, ns?: string): ViewBuilder;
  /** Add a child element and stay here: the form for a leaf. */
  tag(name: string, ns?: string): ViewBuilder;
  /**
   * An attribute on the element the chain points at. A string or number is
   * written as it is (bindings, events, constant text); a boolean renders
   * true/false; `{ t: text }` renders text literally, braces and all.
   */
  a(name: string, value: string | number | boolean | { v?: string; b?: boolean; t?: string }): ViewBuilder;
  /** Ascend to the parent element. */
  end(): ViewBuilder;
  /** The XML, rendered by upstream's builder - inside main( ) pass the builder to c.view( ) instead. */
  stringify(): Promise<string>;
}

/** How a value maps to an ABAP type; used by defineApp, exported for tests. */
export function shapeOf(value: unknown, path?: string[]): unknown;
