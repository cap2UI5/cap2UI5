const { transpileClass } = require("../scripts/abap2js");

function loadGenerated(code) {
  const m = { exports: {} };
  new Function("require", "module", "exports", code)(require, m, m.exports);
  return m.exports;
}

/**
 * Whitespace inside string/template literals must survive transpilation — a
 * blind whitespace-collapse used to turn embedded newlines (`|\n|`) and runs of
 * spaces into a single space, corrupting multi-line asset strings (inline
 * JS/CSS whose `//` comments would then swallow everything after them).
 */
describe("abap2js — whitespace inside literals is preserved", () => {
  const abap = `
CLASS zcl_ml DEFINITION PUBLIC.
  PUBLIC SECTION.
    CLASS-METHODS asset RETURNING VALUE(result) TYPE string.
    CLASS-METHODS spaced RETURNING VALUE(result) TYPE string.
ENDCLASS.
CLASS zcl_ml IMPLEMENTATION.
  METHOD asset.
    result = \`// a comment\` && |\\n| && \`code_after();\`.
  ENDMETHOD.
  METHOD spaced.
    result = |a    b|.
  ENDMETHOD.
ENDCLASS.
`;
  let Cls;
  beforeAll(() => {
    const out = transpileClass(abap, "zcl_ml.clas.abap");
    Cls = loadGenerated(out.code);
  });

  test("embedded newline stays a newline (comment does not swallow the next line)", () => {
    const s = Cls.asset();
    expect(s).toBe("// a comment\ncode_after();");
    expect(s.split("\n")).toHaveLength(2);
  });

  test("runs of spaces inside a literal are preserved", () => {
    expect(Cls.spaced()).toBe("a    b");
  });
});
