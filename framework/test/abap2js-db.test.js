const { transpileClass } = require("../scripts/abap2js");
const z2ui5_port = require("../src/srv/z2ui5/z2ui5_port");

/**
 * Load generated code, resolving the transpiler's neutral persistence import
 * (`abap2UI5/z2ui5_port`) to the in-memory backend directly — no build needed.
 */
function loadGenerated(code) {
  const req = (id) => (id === "abap2UI5/z2ui5_port" ? z2ui5_port : require(id));
  const m = { exports: {} };
  new Function("require", "module", "exports", code)(req, m, m.exports);
  return m.exports;
}

describe("abap2js — OpenSQL lowered to neutral z2ui5_port.db() IR", () => {
  const abap = `
CLASS zcl_db_pilot DEFINITION PUBLIC.
  PUBLIC SECTION.
    CLASS-METHODS save   IMPORTING id TYPE clike val TYPE clike.
    CLASS-METHODS load   IMPORTING id TYPE clike RETURNING VALUE(result) TYPE string.
    CLASS-METHODS remove IMPORTING id TYPE clike.
    CLASS-METHODS count  RETURNING VALUE(result) TYPE i.
    CLASS-METHODS missing IMPORTING id TYPE clike RETURNING VALUE(result) TYPE abap_bool.
ENDCLASS.

CLASS zcl_db_pilot IMPLEMENTATION.
  METHOD save.
    DATA(ls) = VALUE z2ui5_t_91( id = id data = val ).
    MODIFY z2ui5_t_91 FROM @ls.
    COMMIT WORK AND WAIT.
  ENDMETHOD.

  METHOD load.
    SELECT SINGLE data FROM z2ui5_t_91 WHERE id = @id INTO @DATA(lv).
    IF sy-subrc = 0.
      result = lv.
    ENDIF.
  ENDMETHOD.

  METHOD remove.
    DELETE FROM z2ui5_t_91 WHERE id = @id.
    COMMIT WORK AND WAIT.
  ENDMETHOD.

  METHOD count.
    SELECT FROM z2ui5_t_91 FIELDS * INTO CORRESPONDING FIELDS OF TABLE @DATA(lt_db).
    result = lines( lt_db ).
  ENDMETHOD.

  METHOD missing.
    SELECT SINGLE data FROM z2ui5_t_91 WHERE id = @id INTO @DATA(lv).
    result = xsdbool( sy-subrc <> 0 ).
  ENDMETHOD.
ENDCLASS.
`;

  let out, Cls;
  beforeAll(() => {
    out = transpileClass(abap, "zcl_db_pilot.clas.abap");
    Cls = loadGenerated(out.code);
  });
  beforeEach(() => z2ui5_port._reset());

  test("transpiles the DB methods with zero TODOs", () => {
    expect(out.todos).toEqual([]);
    expect(out.code).not.toMatch(/TODO\(abap2js\)/);
  });

  test("emits neutral z2ui5_port.db() markers, not raw SQL", () => {
    expect(out.code).toMatch(/z2ui5_port\.db\(\{ op: `modify`/);
    expect(out.code).toMatch(/z2ui5_port\.db\(\{ op: `select_single`/);
    expect(out.code).toMatch(/z2ui5_port\.db\(\{ op: `delete`/);
    expect(out.code).not.toMatch(/\bSELECT\b|\bMODIFY\b/);
  });

  test("MODIFY upserts, SELECT SINGLE reads back the field, sy-subrc works", () => {
    expect(Cls.load({ id: "A" })).toBe(""); // not found → sy-subrc 4 → result stays ``
    Cls.save({ id: "A", val: "hello" });
    Cls.save({ id: "B", val: "world" });
    expect(Cls.load({ id: "A" })).toBe("hello");
    expect(Cls.load({ id: "B" })).toBe("world");
    Cls.save({ id: "A", val: "changed" }); // upsert, not insert
    expect(Cls.load({ id: "A" })).toBe("changed");
    expect(Cls.count()).toBe(2);
  });

  test("DELETE removes the row", () => {
    Cls.save({ id: "A", val: "x" });
    Cls.save({ id: "B", val: "y" });
    Cls.remove({ id: "A" });
    expect(Cls.count()).toBe(1);
    expect(Cls.load({ id: "A" })).toBe("");
    expect(Cls.load({ id: "B" })).toBe("y");
  });

  test("sy-subrc reflects a missing row", () => {
    Cls.save({ id: "A", val: "x" });
    expect(Cls.missing({ id: "A" })).toBe(false);
    expect(Cls.missing({ id: "Z" })).toBe(true);
  });
});
