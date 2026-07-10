const { transpileClass } = require("../scripts/abap2js");

function loadGenerated(code) {
  const m = { exports: {} };
  new Function("require", "module", "exports", code)(require, m, m.exports);
  return m.exports;
}

/**
 * ABAP 2-letter comparison/string operators (eq/ne/lt/le/gt/ge/cs/ns/co/ca/…)
 * are also perfectly legal identifiers. They must be read as operators only in
 * operator position (after an operand), and as plain identifiers otherwise —
 * otherwise a variable named `lt` compiles to a stray `<`, a param `ns` to a
 * broken NS comparison, etc.
 */
describe("abap2js — operator words used as identifiers", () => {
  const abap = `
CLASS zcl_ops DEFINITION PUBLIC.
  PUBLIC SECTION.
    METHODS count_rows RETURNING VALUE(result) TYPE i.
    METHODS wrap
      IMPORTING ns            TYPE string
                lt            TYPE string
      RETURNING VALUE(result) TYPE string.
    METHODS real_cs
      IMPORTING a             TYPE string
                b             TYPE string
      RETURNING VALUE(result) TYPE abap_bool.
    METHODS real_lt
      IMPORTING a             TYPE i
                b             TYPE i
      RETURNING VALUE(result) TYPE abap_bool.
ENDCLASS.

CLASS zcl_ops IMPLEMENTATION.
  METHOD count_rows.
    DATA lt TYPE STANDARD TABLE OF string WITH DEFAULT KEY.
    APPEND \`a\` TO lt.
    APPEND \`b\` TO lt.
    result = lines( lt ).
  ENDMETHOD.

  METHOD wrap.
    result = |{ ns }:{ lt }|.
  ENDMETHOD.

  METHOD real_cs.
    result = xsdbool( a CS b ).
  ENDMETHOD.

  METHOD real_lt.
    result = xsdbool( a LT b ).
  ENDMETHOD.
ENDCLASS.
`;

  let out, Cls;
  beforeAll(() => {
    out = transpileClass(abap, "zcl_ops.clas.abap");
    Cls = loadGenerated(out.code);
  });

  test("transpiles with zero TODOs and no stray operator leakage", () => {
    expect(out.todos).toEqual([]);
    expect(out.code).not.toMatch(/TODO\(abap2js\)/);
    expect(out.code).not.toMatch(/=\s*<\.|<\.length/); // the old `lt` -> `<` bug
  });

  test("`lt` as a local table variable works", () => {
    expect(new Cls().count_rows()).toBe(2);
  });

  test("`ns` and `lt` as parameters render as values", () => {
    expect(new Cls().wrap({ ns: "core", lt: "x" })).toBe("core:x");
  });

  test("real CS operator still compiles and runs", () => {
    expect(new Cls().real_cs({ a: "hello", b: "ell" })).toBe(true);
    expect(new Cls().real_cs({ a: "hello", b: "zzz" })).toBe(false);
  });

  test("real LT operator still compiles and runs", () => {
    expect(new Cls().real_lt({ a: 1, b: 2 })).toBe(true);
    expect(new Cls().real_lt({ a: 5, b: 2 })).toBe(false);
  });
});
