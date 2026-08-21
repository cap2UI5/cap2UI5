/**
 * Hand-written type declarations for the abap2UI5 core.
 *
 * The package is generated from ABAP and will never carry types of its own, so
 * these cover the surface a consumer actually writes against: the app
 * interface, the client, and the fluent view builder. The builder is the case
 * that matters most — a chain of `.tag().a().end()` with no completion is a
 * guessing game, and the aggregation and attribute names are exactly what a
 * reader cannot infer from the JS.
 *
 * These are deliberately loose where the runtime is loose. Faking precision the
 * implementation does not have would produce type errors on correct code, which
 * is worse than no types at all.
 */

declare module "abap2UI5/z2ui5_if_app" {
  import type { Client } from "abap2UI5/z2ui5_cl_ui5_client";

  /**
   * Base class for every z2ui5 application.
   *
   * `main` is called once per roundtrip. The framework serializes the instance
   * between roundtrips, so any own property is state that survives — and
   * anything unserializable (a socket, a function, a class instance the
   * registry cannot resolve) will not.
   */
  export default class z2ui5_if_app {
    /** Set by the framework: the draft id this instance was loaded from. */
    id_draft: string;
    /** Set by the framework once `main` has run at least once. */
    check_initialized: boolean;
    /** Opt in to keeping this instance in memory between roundtrips. */
    check_sticky: boolean;

    main(client: Client): void | Promise<void>;
  }
}

declare module "abap2UI5/z2ui5_cl_ui5_client" {
  import type { ViewBuilder } from "abap2UI5/z2ui5_cl_ui5_view_builder";

  export interface BindOptions {
    /**
     * Explicit member path, e.g. `"ms_data-customer-name"`.
     *
     * Required for anything nested. A JS string carries no reference
     * identity, so `_bind(this.ms_data.customer.name)` passes the *value* and
     * the framework can only match it against the first attribute holding an
     * equal value — for empty strings, that is whichever it finds first. With
     * `name` the path is unambiguous at any depth.
     */
    name?: string;
    /** Bind a cell inside this table rather than a top-level attribute. */
    tab?: unknown[];
    tab_index?: number;
    /** Return the bare path (`/PATH`) instead of `{/PATH}`. */
    path_only?: boolean;
  }

  export interface Client {
    /** One-way binding: the view reads, the backend is not written back to. */
    _bind(val: unknown, opts?: BindOptions): string;
    /** Two-way binding: user input is written back on the next roundtrip. */
    _bind_edit(val: unknown, opts?: BindOptions): string;

    /** The event name that triggered this roundtrip, `""` on first call. */
    get_event(): string;
    /** Extra arguments the view attached to the event. */
    get_event_arg(index?: number): string;

    /** Render a view. Call once per roundtrip, last. */
    view_display(xml: string | ViewBuilder): void;
    view_model_update(): void;

    popup_display(xml: string | ViewBuilder): void;
    popup_destroy(): void;

    nav_app_call(app: unknown): void;
    nav_app_leave(app?: unknown): void;
    check_app_prev_stack(): boolean;

    message_toast_display(text: string): void;
    message_box_display(text: string, type?: string): void;

    /** Follow-up actions run in the frontend after this roundtrip renders. */
    follow_up_action(action: unknown): void;

    [key: string]: unknown;
  }
}

declare module "abap2UI5/z2ui5_cl_ui5_view_builder" {
  /**
   * The fluent XML view builder.
   *
   * Every method returns a builder, so a view is one chain. `tag` opens an
   * element and `end` closes it; the aggregation helpers open the named
   * aggregation of the current element.
   */
  export interface ViewBuilder {
    /** Open an element, e.g. `tag("Button")`. */
    tag(name: string, attributes?: Record<string, unknown>, selfClosing?: boolean): ViewBuilder;
    /** Add attributes to the current element: `{ n: "text", v: "Save" }`. */
    a(attributes: Record<string, unknown> | Array<Record<string, unknown>>): ViewBuilder;
    /** Close the current element. */
    end(): ViewBuilder;
    /** Serialize the chain to XML. Usually done for you by view_display. */
    get_root(): ViewBuilder;
    xml_get(): string;

    [key: string]: unknown;
  }

  /** Start a new view. `factory_page` and friends open a pre-shaped root. */
  export function factory(root?: string): ViewBuilder;
  export function factory_page(title?: string, navButton?: boolean): ViewBuilder;
}

declare module "abap2UI5/engine" {
  /** A persisted draft row. `data` is the serialized application state. */
  export interface DraftRow {
    id: string;
    id_prev?: string;
    data: string;
    [key: string]: unknown;
  }

  /** The durable draft store. Without one, drafts live in memory and are lost. */
  export interface Store {
    load(id: string): Promise<DraftRow | undefined> | DraftRow | undefined;
    save(draft: DraftRow): Promise<void> | void;
  }

  export function set_store(store: Store): void;
  /** Who the framework acts for. Read per use, so it is safe under concurrency. */
  export function set_identity(provider: () => { user?: string; tenant?: string }): void;
  /** Scan a folder for app classes. Apps inside the package need no registration. */
  export function register_app_dir(dir: string): void;
  export function roundtrip(body: unknown, reqInfo?: unknown): Promise<string>;
  export function bootstrap_html(reqInfo?: unknown): { html: string; headers: Array<{ n: string; v: string }> };
  export function ui5_resources_dir(): string | null;
  export function session_key_for(ctx: { user?: string; tenant?: string }): string | null;
  export function drop_sticky(ctx: { session_id: string }): void;
}

declare module "abap2UI5/cap" {
  /**
   * Wire the framework into a CAP project. Called automatically by the
   * cds-plugin; call it directly only to override a piece.
   */
  export function activate(options?: {
    cds?: unknown;
    identity?: boolean;
    store?: boolean;
    routes?: boolean;
    resources?: boolean;
    retention?: boolean;
    impl?: boolean;
    /** Endpoint path, default `/rest/root/z2ui5`. */
    path?: string;
    /** Draft entity, `namespace.name`. Default `cap2ui5.z2ui5_t_01`. */
    entity?: string;
    /** Extra folders to scan for app classes. */
    appDirs?: string[];
  }): { active: boolean; applied?: string[]; endpoint?: string; entity?: string; reason?: string };
}

declare module "abap2UI5/z2ui5_html" {
  /** Escape for HTML element text. */
  export function escape_text(val: unknown): string;
  /** Escape for an HTML attribute, single- or double-quoted. */
  export function escape_attr(val: unknown): string;
  /**
   * Escape a URI for a double-quoted attribute, dropping `javascript:` and
   * `vbscript:`. Returns `""` for a rejected scheme, which callers treat as
   * "not configured".
   */
  export function escape_uri(val: unknown): string;
}
