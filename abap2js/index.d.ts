// @cap2ui5/abap2js

export interface Abap2jsOptions {
  /** The file the source came from: named in messages, and the class's file name. */
  file?: string;
  /** Directories the other classes a class names are read from - `zcl_other=>ty_s_row`. */
  lib?: string[];
  /** Written into the header as `// @origin <origin>`. */
  origin?: string;
  /** "esm" (the default) imports from @cap2ui5/cds-plugin, "cjs" requires it. */
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
