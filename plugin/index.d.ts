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

  /** The binding path of one of the app's fields, for a view attribute. */
  bind(field: Extract<keyof App, string>): string;
  /**
   * The press/change handler for an event, for a view attribute. `args` come
   * back as `eventArg(1..n)`. Embed the result as it is: it is a placeholder
   * that is replaced after `main( )` returns.
   */
  event(name: string, args?: unknown[]): string;

  /** Show a view: XML text, or a ViewBuilder chain (any node of it). */
  view(xml: string | ViewBuilder): void;
  /** Show a popup over the view: XML text, or a ViewBuilder chain. */
  popup(xml: string | ViewBuilder): void;
  popupClose(): void;
  /**
   * Render a fragment into a control of the main view, which stays as it is.
   * `insert`/`clear` are the UI5 mutators of the receiving aggregation
   * (default addContent/removeAllContent).
   */
  nest(into: string, xml: string | ViewBuilder, options?: { insert?: string; clear?: string }): void;
  nestClose(): void;
  messageBox(text: string): void;
  messageToast(text: string): void;

  /** Show another app on top of this one: its registered name, its class, or an instance. */
  navTo(app: string | AppConstructor | object): void;
  /** Hand the screen back to the caller. Guard with `canGoBack`. */
  navBack(options?: { app?: string | AppConstructor | object; event?: string; data?: unknown }): void;

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
