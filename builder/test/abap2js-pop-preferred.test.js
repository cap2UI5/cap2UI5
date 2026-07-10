const { transpileClass } = require("../scripts/abap2js");
const shim = require("../base/srv/z2ui5/02/01/z2ui5_pop_preferred_param");

/** load generated code, resolving the popup shim + framework self-refs */
function loadGenerated(code) {
  const req = (id) => (id === "./z2ui5_pop_preferred_param" ? shim : require(id));
  const m = { exports: {} };
  new Function("require", "module", "exports", code)(req, m, m.exports);
  return m.exports;
}

/**
 * z2ui5_cl_pop_* factories must keep abap's PREFERRED PARAMETER call style: the
 * preferred / single-mandatory parameter can be passed positionally. The
 * transpiler emits the z2ui5_pop_preferred_param wiring so the transpiled popups
 * behave like the hand-ports (and can replace them in base).
 */
describe("abap2js — popup PREFERRED PARAMETER wiring", () => {
  const abap = `
CLASS z2ui5_cl_pop_test DEFINITION PUBLIC.
  PUBLIC SECTION.
    CLASS-METHODS factory
      IMPORTING i_main        TYPE string
                i_opt         TYPE string DEFAULT \`d\`
      RETURNING VALUE(r_result) TYPE REF TO z2ui5_cl_pop_test.
    CLASS-METHODS explicit
      IMPORTING i_first       TYPE string OPTIONAL
                i_second      TYPE string OPTIONAL
      PREFERRED PARAMETER i_second
      RETURNING VALUE(r_result) TYPE REF TO z2ui5_cl_pop_test.
    DATA main TYPE string.
    DATA opt  TYPE string.
    DATA sec  TYPE string.
ENDCLASS.

CLASS z2ui5_cl_pop_test IMPLEMENTATION.
  METHOD factory.
    r_result = NEW #( ).
    r_result->main = i_main.
    r_result->opt  = i_opt.
  ENDMETHOD.
  METHOD explicit.
    r_result = NEW #( ).
    r_result->sec = i_second.
  ENDMETHOD.
ENDCLASS.
`;

  let out, Cls;
  beforeAll(() => {
    out = transpileClass(abap, "z2ui5_cl_pop_test.clas.abap");
    Cls = loadGenerated(out.code);
  });

  test("emits wiring: first mandatory param, and explicit PREFERRED PARAMETER", () => {
    expect(out.code).toMatch(/z2ui5_pop_preferred_param/);
    expect(out.code).toMatch(/factory: \{ preferred: `i_main`, params: \[`i_main`, `i_opt`\] \}/);
    expect(out.code).toMatch(/explicit: \{ preferred: `i_second`, params: \[`i_first`, `i_second`\] \}/);
  });

  test("positional call maps to the preferred parameter", () => {
    const p = Cls.factory("hello");
    expect(p.main).toBe("hello");
    expect(p.opt).toBe("d");
  });

  test("options-bag call still works", () => {
    const p = Cls.factory({ i_main: "a", i_opt: "b" });
    expect(p.main).toBe("a");
    expect(p.opt).toBe("b");
  });

  test("explicit PREFERRED PARAMETER receives the positional value", () => {
    expect(Cls.explicit("x").sec).toBe("x");
  });
});
