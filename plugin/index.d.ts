// Type declarations for what `require("@cap2ui5/cds-plugin")` exports:
// defineApp, the client an app's main( ) receives - z2ui5_if_client, by its
// own names - the field declarations in `t`, the view builder and the
// interface's constants under their ABAP names, and defineExit. The runtime
// is plain JavaScript (lib/); these types describe it as an app author sees
// it.

/** One name/value pair of the framework's configuration tables. */
export interface NameValue {
  n: string;
  v: string;
}

/** The front-end actions of z2ui5_if_client=>cs_event, by the names ABAP gives them. */
export type CsEventName =
  | "popup_close" | "popover_close" | "cross_app_nav_to_ext" | "cross_app_nav_to_prev_app"
  | "set_size_limit" | "set_odata_model" | "clipboard_copy" | "set_title" | "set_title_launchpad"
  | "set_favicon" | "set_focus" | "scroll_to" | "scroll_into_view" | "start_timer" | "system_logout"
  | "keyboard_shortcut" | "open_new_tab" | "location_reload" | "download_b64_file" | "urlhelper"
  | "store_data" | "play_audio" | "smart_variant_init" | "filter_bar_variant_init"
  | "control_by_id" | "control_global" | "binding_call" | "bind_element"
  | "hash_set" | "hash_replace" | "hash_back" | "hash_attach_changed" | "hash_routing"
  | "app_state_set_active";

/**
 * z2ui5_if_client's constant structures, read from the runtime:
 * `z2ui5_if_client=>cs_event-set_title` is `z2ui5_if_client.cs_event.set_title`
 * - or `client.cs_event.set_title`, as ABAP allows both.
 */
export interface ClientConstants {
  readonly cs_event: { readonly [K in CsEventName]: string };
  readonly cs_view: {
    readonly main: string; readonly nested: string; readonly nested2: string;
    readonly popup: string; readonly popover: string;
  };
  readonly cs_nav_mode: { readonly default: string; readonly fresh: string; readonly keep: string };
  readonly cs_device: {
    readonly system: { readonly phone: string; readonly tablet: string; readonly desktop: string; readonly combi: string };
    readonly browser: { readonly chrome: string; readonly firefox: string; readonly safari: string; readonly edge: string };
    readonly os: {
      readonly windows: string; readonly macintosh: string; readonly linux: string;
      readonly ios: string; readonly android: string;
    };
    readonly orientation: { readonly portrait: string; readonly landscape: string };
  };
  /** The page transitions of view_display( ) - in the runtime from the abap2UI5
   *  releases after 1.145.0 on, absent before. */
  readonly cs_transition?: {
    readonly slide: string; readonly base_slide: string; readonly fade: string;
    readonly flip: string; readonly show: string;
  };
}

/** z2ui5_if_client's constants, on the interface as an ABAP app reads them. */
export const z2ui5_if_client: ClientConstants;

/** z2ui5_if_client=>ty_s_event_control: how the browser fires an event (_event( )'s s_ctrl). */
export interface EventControl {
  /** cancel the control's default for this event (oEvent.preventDefault()) */
  check_prevent_default?: boolean;
  /** the same, decided per firing by a client expression; wins over check_prevent_default */
  prevent_default_expr?: string;
  /** quote every argument, so none is evaluated as a binding or expression */
  check_arg_literal?: boolean;
  /** keep the LAST firing while a roundtrip runs, instead of dropping it - for liveChange */
  check_queue_last?: boolean;
  /** do not raise the global busy indicator for this wire */
  check_no_busy?: boolean;
}

type FieldName<App> = Extract<keyof App, string>;
/** A field by its NAME, or a component of a structure field named as ABAP names it: `"s_order-customer"`. */
export type BindTarget<App> = FieldName<App> | `${FieldName<App>}-${string}` | `${FieldName<App>}.${string}`;

/** A view: XML text, a z2ui5_cl_ui5_view_builder (any node of its chain), or what its stringify( ) answered. */
export type View = string | z2ui5_cl_ui5_view_builder | Rendering;

/** An app to navigate to: its registered name, its defineApp class, an instance, or what get_app( id ) answered. */
export type AppRef = string | AppConstructor | object;

/**
 * The client an app's `main( )` receives: z2ui5_if_client, by its own method
 * names. A method's preferred parameter is its one positional argument -
 * ``client->_event( `GO` )`` is `client._event("GO")` - and parameters by name
 * are one object - ``client->_event( val = `GO` t_arg = … )`` is
 * `client._event({ val: "GO", t_arg: [ … ] })`. Queries answer synchronously;
 * commands are recorded and carried out in order after `main( )` returns.
 */
export interface Client<App = Record<string, unknown>> extends ClientConstants {
  /** The first roundtrip of THIS app instance - seed state here. */
  check_on_init(): boolean;
  /** The first roundtrip AND every return to this app - render here. */
  check_on_navigated(): boolean;
  /** Whether this roundtrip answers the event `val` - without it, any event. */
  check_on_event(val?: string): boolean;
  check_on_event(params: { val?: string }): boolean;
  /** Whether there is an app to go back to - for showNavButton. */
  check_app_prev_stack(): boolean;
  /** The event this roundtrip answers; `""` on a start. */
  get_event(): string;
  /** An argument the event carried, 1-based; the first 8 are available. */
  get_event_arg(v?: number): string;
  get_event_arg(params: { v?: number }): string;
  /**
   * `client->get( )`: what the frontend sent with this roundtrip - the event,
   * the draft ids (`s_draft`), the browser location (`s_config`), device,
   * focus, scroll and UI5 information, what a returning app handed over
   * (`r_event_data`) - as plain values under the ABAP component names.
   */
  get(): Record<string, any>;
  /**
   * The app on the other side of the last navigation: inside a called app its
   * caller, back in the caller the app that just returned. A defineApp app as
   * its fields' plain values, an ABAP app as the instance itself.
   */
  get_app_prev(): Record<string, any> | null;
  /** Without an id, the running app itself. */
  get_app(): App;
  /**
   * The app behind a draft id - read from the draft store after `main( )`, so
   * its fields can be written, not read; hand it to `nav_app_leave( )` or
   * `nav_app_call( )` as an app.
   */
  get_app(id: string): Record<string, any>;
  get_app(params: { id?: string }): Record<string, any>;
  /** The absolute link to this app's current state. */
  app_state_get_href(): string;

  /**
   * The binding of a field, by NAME, for a view attribute: `{/NAME}`, or with
   * `path` the bare `/NAME` a composed binding needs. `tab` and `tab_index`
   * bind one cell - `val` is then the column; `omit_initial`,
   * `omit_initial_paths`, `json` and `switch_default_model` are _bind( )'s
   * options. A component, a cell or an option makes it a placeholder until
   * `main( )` returns - embed it as it is.
   */
  _bind(val: BindTarget<App>): string;
  _bind(params: {
    val: BindTarget<App> | string;
    path?: boolean;
    tab?: BindTarget<App>;
    tab_index?: number;
    switch_default_model?: boolean;
    omit_initial?: boolean;
    omit_initial_paths?: string[];
    json?: boolean;
  }): string;
  /** obsolete in z2ui5_if_client - _bind( ) under another name */
  _bind_edit(val: BindTarget<App>): string;
  _bind_edit(params: {
    val: BindTarget<App> | string; path?: boolean; tab?: BindTarget<App>; tab_index?: number;
    switch_default_model?: boolean;
  }): string;
  /** the bare path of a field - _bind( val path = abap_true ) */
  _bind_path(val: BindTarget<App>): string;
  _bind_path(params: { val: BindTarget<App> }): string;

  /**
   * The handler of an event, for a view attribute. `t_arg` come back as
   * `get_event_arg( 1..n )`, `arg` is one more behind them. Embed the result
   * as it is: a placeholder, replaced after `main( )` returns.
   */
  _event(val?: string): string;
  _event(params: { val?: string; t_arg?: unknown[]; s_ctrl?: EventControl; arg?: unknown }): string;
  /** The handler that leaves this app - a Page's navButtonPress. */
  _event_nav_app_leave(): string;
  /** obsolete in z2ui5_if_client - follow_up_action( ) in a view attribute */
  _event_client(val: string): string;
  _event_client(params: { val: string; view?: string; t_arg?: unknown[] }): string;
  /**
   * A front-end action: `val` a cs_event constant, `view` the cs_view slot
   * its control ids are meant in. Embedded in a view attribute it is a
   * handler that runs in the browser, no roundtrip; called on its own it runs
   * when this roundtrip's answer lands.
   */
  follow_up_action(val: string): string;
  follow_up_action(params: { val: string; view?: string; t_arg?: unknown[] }): string;

  view_display(val: View): void;
  /** transition (a cs_transition value) and transition_back come with the abap2UI5
   *  releases after 1.145.0; on an older runtime a call that sets them is refused. */
  view_display(params: {
    val: View; switch_default_model_path?: string; switch_default_model_anno_uri?: string;
    transition?: string; transition_back?: boolean;
  }): void;
  view_destroy(): void;
  /** obsolete in z2ui5_if_client - does nothing, bound data is pushed on its own */
  view_model_update(): void;
  popup_display(val: View): void;
  popup_display(params: { val: View }): void;
  popup_destroy(): void;
  /** obsolete - does nothing */
  popup_model_update(): void;
  /** A popover anchored to the control whose id is `by_id`. */
  popover_display(params: { xml: View; by_id: string }): void;
  popover_destroy(): void;
  /** obsolete - does nothing */
  popover_model_update(): void;
  /**
   * A view rendered into the control `id` of the main view, which stays as it
   * is: `method_insert` adds it to the control's aggregation (`addContent`),
   * `method_destroy` clears what was there first - without it every call adds
   * one more.
   */
  nest_view_display(params: { val: View; id: string; method_insert: string; method_destroy?: string }): void;
  nest_view_destroy(): void;
  /** obsolete - does nothing */
  nest_view_model_update(): void;
  /** The second nested slot, with nest_view_display( )'s contract. */
  nest2_view_display(params: { val: View; id: string; method_insert: string; method_destroy?: string }): void;
  nest2_view_destroy(): void;
  /** obsolete - does nothing */
  nest2_view_model_update(): void;
  /** A message box. `text` may be data - an object, an array - laid out as for an ABAP structure or table. */
  message_box_display(params: {
    text: unknown;
    type?: string;
    title?: string;
    styleclass?: string;
    onclose?: string;
    actions?: string[];
    emphasizedaction?: string;
    initialfocus?: string;
    details?: string;
  }): void;
  message_box_display(text: unknown): void;
  message_toast_display(text: string): void;
  message_toast_display(params: { text: string; duration?: string | number; onclose?: string }): void;

  /**
   * Show another app on top of this one. `fields` is cap2UI5's own: fields to
   * preset on the called app, what an ABAP app does between NEW and
   * nav_app_call( ).
   */
  nav_app_call(app: AppRef, fields?: Record<string, unknown>): void;
  nav_app_call(params: { app: AppRef }, fields?: Record<string, unknown>): void;
  /**
   * Hand the screen back - to the caller, or to `app`. `event` is what it
   * finds in get_event( ), `r_data` what it finds in get( ).r_event_data.
   */
  nav_app_leave(app?: AppRef): void;
  nav_app_leave(params: { app?: AppRef; event?: string; r_data?: unknown }): void;
  /** Push a hash onto the browser history. */
  hash_set(val?: string): void;
  hash_set(params: { val?: string }): void;
  /** Rewrite the hash without a history entry. */
  hash_replace(val?: string): void;
  hash_replace(params: { val?: string }): void;
  /** Keep this app's state id in the URL. */
  app_state_set_active(val?: boolean): void;
  app_state_set_active(params: { val?: boolean }): void;
  /** Not supported by cap2UI5 - it throws; the app's state is in its fields, which are in the draft. */
  set_session_stateful(val?: boolean): never;

  /** The framework's own z2ui5_if_client, transpiled - asynchronous. */
  readonly raw: unknown;
}

/** What `defineApp( )` registers and returns: the app's class, as the framework instantiates it. */
export type AppConstructor = new (...args: unknown[]) => object;

/**
 * Register an app under `name` - the name `?app_start=` starts it by.
 *
 * Every field with an initial value survives each roundtrip in the draft;
 * declare what an initial value cannot tell with `t`. A field is part of the
 * MODEL - sent to the browser and written back by it - once `main( )` binds
 * it, as in ABAP. Inside `main( )` the fields read and write as plain values.
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
  /** NUMC n: digits, kept with their leading zeros. */
  numc(length: number): string;
  /** A date, D: YYYYMMDD. */
  date(): string;
  /** A time, T: HHMMSS. */
  time(): string;
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
 * abap2UI5's z2ui5_cl_ui5_view_builder, under its own name, its methods
 * called as the client's are: one positional argument for the preferred
 * parameter, or the parameters by name as one object. The same one rule
 * holds - a( ) lands on the element the chain points at, the child just added
 * by ele( )/tag( ) or the node itself while it has none. The chain is recorded
 * and rendered by upstream's class after main( ), so its XML and escaping are
 * those of an ABAP app's view.
 *
 *     const view = z2ui5_cl_ui5_view_builder.factory()
 *         .ele({ n: "View", ns: "mvc" })
 *             .a({ n: "xmlns", v: "sap.m" })
 *             .a({ n: "xmlns:mvc", v: "sap.ui.core.mvc" });
 *     view.ele("Page")
 *             .a({ n: "title", v: "Hello" })
 *         .tag("Input")
 *             .a({ n: "value", v: client._bind("name") })
 *         .tag("Button")
 *             .a({ n: "text", v: "Go" })
 *             .a({ n: "press", v: client._event("GO") });
 *     client.view_display(view.stringify());
 */
export class z2ui5_cl_ui5_view_builder {
  /** An empty builder root; open the mvc:View and declare its xmlns yourself. */
  static factory(): z2ui5_cl_ui5_view_builder;
  /** Braces and backslashes escaped, so UI5 shows text instead of reading a binding. */
  static escape_literal(val: string): string;
  static escape_literal(params: { val: string }): string;
  /** Add a child element and descend into it. `ns` is the namespace prefix. */
  ele(n: string): z2ui5_cl_ui5_view_builder;
  ele(params: { n: string; ns?: string }): z2ui5_cl_ui5_view_builder;
  /** Add a child element and stay here: the form for a leaf. */
  tag(n: string): z2ui5_cl_ui5_view_builder;
  tag(params: { n: string; ns?: string }): z2ui5_cl_ui5_view_builder;
  /**
   * An attribute on the element the chain points at - exactly one of `v`
   * (written as it is: a binding, an event, constant text), `b` (rendered
   * true/false) and `t` (text rendered literally, braces and all).
   */
  a(params: { n: string; v?: string | number; b?: boolean; t?: string }): z2ui5_cl_ui5_view_builder;
  /** Ascend to the parent element. */
  end(): z2ui5_cl_ui5_view_builder;
  /**
   * The XML of the chain as it stands now. Rendered by upstream's class after
   * main( ): hand it to client.view_display( ) as it is, or await it outside
   * main( ).
   */
  stringify(): Rendering;
}

/** What stringify( ) answers: the XML, once awaited. */
export interface Rendering extends PromiseLike<string> {
  catch<T = never>(onRejected?: (reason: unknown) => T | PromiseLike<T>): Promise<string | T>;
  finally(onFinally?: () => void): Promise<string>;
}

/** z2ui5_cl_ui5_view_builder again, for code that prefers a JavaScript name. */
export { z2ui5_cl_ui5_view_builder as ViewBuilder };

/** How a value maps to an ABAP type; used by defineApp, exported for tests. */
export function shapeOf(value: unknown, path?: string[]): unknown;

export interface Abap2jsOptions {
  /** The file the source came from: named in messages, and the class's file name. */
  file?: string;
  /** Directories the other classes a class names are read from - `zcl_other=>ty_s_row`. */
  lib?: string[];
  /** Written into the header as `// @origin <origin>`. */
  origin?: string;
  /** "esm" (the default) imports from cap2ui5, "cjs" requires it. */
  format?: "esm" | "cjs";
}

/**
 * Translate an abap2UI5 app class - a class implementing z2ui5_if_app - into
 * a cap2UI5 app module, line for line: `code` registers the app under the
 * class's name with defineApp( ). What the translation does not know it
 * refuses with an Abap2jsError naming file, row and column.
 */
export function abap2js(source: string, options?: Abap2jsOptions): { name: string; code: string };

/** What abap2js throws for a class it does not translate. */
export class Abap2jsError extends Error {
  file: string;
  row?: number;
  col?: number;
}
