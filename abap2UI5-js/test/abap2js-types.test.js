const { transpileClass } = require("../scripts/abap2js");

/** run the generated code with this test's require (self-refs via jest mapper) */
function loadGenerated(code) {
  const m = { exports: {} };
  new Function("require", "module", "exports", code)(require, m, m.exports);
  return m.exports;
}

describe("abap2js — method-local TYPES are dropped (no runtime JS, no TODO)", () => {
  const abap = `
CLASS zcl_types DEFINITION PUBLIC.
  PUBLIC SECTION.
    METHODS build
      RETURNING VALUE(result) TYPE i.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_types IMPLEMENTATION.
  METHOD build.
    TYPES ty_num TYPE i.
    TYPES: BEGIN OF ty_row,
             id   TYPE i,
             name TYPE string,
           END OF ty_row.
    TYPES ty_tab TYPE STANDARD TABLE OF ty_row WITH DEFAULT KEY.
    DATA lt_rows TYPE ty_tab.
    APPEND VALUE ty_row( id = 1 name = \`a\` ) TO lt_rows.
    APPEND VALUE ty_row( id = 2 name = \`b\` ) TO lt_rows.
    result = lines( lt_rows ).
  ENDMETHOD.
ENDCLASS.
`;

  let out;
  beforeAll(() => {
    out = transpileClass(abap, "zcl_types.clas.abap");
  });

  test("transpiles with zero TODOs", () => {
    expect(out.todos).toEqual([]);
  });

  test("no TYPES/type markers leak into the generated JS", () => {
    expect(out.code).not.toMatch(/TODO\(abap2js\)/);
    expect(out.code).not.toMatch(/\bTYPES\b/);
  });

  test("the method still runs and the local type is usable", () => {
    const Cls = loadGenerated(out.code);
    expect(new Cls().build()).toBe(2);
  });
});
