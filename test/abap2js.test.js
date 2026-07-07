const fs = require("fs");
const path = require("path");
const { transpileClass } = require("../scripts/abap2js");
const Client = require("../cap2UI5/srv/z2ui5/01/02/z2ui5_cl_core_client");

/**
 * Execute generated code with this test's require — the "abap2UI5/..."
 * package self-references resolve via jest.config.js moduleNameMapper.
 */
function loadGenerated(code) {
  const m = { exports: {} };
  new Function("require", "module", "exports", code)(require, m, m.exports);
  return m.exports;
}

function createClient(app, { event = "", args = [] } = {}) {
  const client = new Client();
  client.oApp = app;
  client.oReq = { S_FRONT: { EVENT: event, T_EVENT_ARG: args } };
  app.client = client;
  return client;
}

describe("abap2js transpiler", () => {
  describe("hello world (real abap2UI5 source)", () => {
    const abap = fs.readFileSync(path.join(__dirname, "fixtures", "z2ui5_cl_app_hello_world.clas.abap"), "utf8");
    let AppClass;

    beforeAll(() => {
      const { code, todos } = transpileClass(abap, "z2ui5_cl_app_hello_world.clas.abap");
      expect(todos).toEqual([]);
      AppClass = loadGenerated(code);
    });

    test("renders the view on init", async () => {
      const app = new AppClass();
      const client = createClient(app);
      await app.main(client);

      expect(client.S_VIEW.XML).toContain("Hello World");
      expect(client.S_VIEW.XML).toContain("<form:content");
      expect(client.S_VIEW.XML).toContain("<core:Title");
      expect(client.S_VIEW.XML).toContain("BUTTON_POST");
    });

    test("handles the button event", async () => {
      const app = new AppClass();
      app.name = "TestUser";
      const client = createClient(app, { event: "BUTTON_POST" });
      await app.main(client);

      expect(client.S_MSG_BOX.TEXT).toContain("TestUser");
    });
  });

  describe("language features", () => {
    const abap = `
CLASS zcl_feature DEFINITION PUBLIC.
  PUBLIC SECTION.
    INTERFACES z2ui5_if_app.
    CONSTANTS:
      BEGIN OF cs_mode,
        edit    TYPE string VALUE \`EDIT\`,
        display TYPE string VALUE \`DISPLAY\`,
      END OF cs_mode.
    CLASS-METHODS factory
      IMPORTING
        i_mode          TYPE string DEFAULT cs_mode-edit
      RETURNING
        VALUE(r_result) TYPE REF TO zcl_feature.
    DATA mv_mode  TYPE string.
    DATA mv_count TYPE i.
    DATA mt_rows  TYPE string_table.
    METHODS sum_even
      IMPORTING
        i_max         TYPE i
      RETURNING
        VALUE(result) TYPE i.
    METHODS classify
      IMPORTING
        i_val         TYPE string
      RETURNING
        VALUE(result) TYPE string.
    METHODS title
      RETURNING
        VALUE(result) TYPE string.
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_feature IMPLEMENTATION.

  METHOD factory.
    r_result = NEW #( ).
    r_result->mv_mode = i_mode.
  ENDMETHOD.

  METHOD sum_even.
    DO i_max TIMES.
      IF sy-index > 4 OR result >= 100.
        EXIT.
      ENDIF.
      result = result + sy-index.
    ENDDO.
  ENDMETHOD.

  METHOD classify.
    CASE i_val.
      WHEN \`A\` OR \`B\`.
        result = |letter \\{ { i_val } \\}|.
      WHEN OTHERS.
        result = COND #( WHEN i_val IS INITIAL THEN \`empty\` ELSE to_upper( i_val ) ).
    ENDCASE.
  ENDMETHOD.

  METHOD title.
    CONSTANTS c_title TYPE string VALUE \` abap2UI5 - Samples\`.
    result = c_title.
  ENDMETHOD.

  METHOD z2ui5_if_app~main.
    DATA(lt_rows) = VALUE string_table( ( \`x\` ) ( \`y\` ) ).
    LOOP AT lt_rows INTO DATA(lv_row).
      APPEND lv_row TO mt_rows.
    ENDLOOP.
    IF client->get( )-event = \`GO\` AND mv_mode <> cs_mode-display.
      mv_count = lines( mt_rows ).
    ENDIF.
  ENDMETHOD.

ENDCLASS.
`;
    let Feature;

    beforeAll(() => {
      const { code, todos } = transpileClass(abap, "zcl_feature.clas.abap");
      expect(todos).toEqual([]);
      Feature = loadGenerated(code);
    });

    test("struct constants and static factory defaults", () => {
      expect(Feature.cs_mode).toEqual({ edit: "EDIT", display: "DISPLAY" });
      expect(Feature.factory().mv_mode).toBe("EDIT");
      expect(Feature.factory({ i_mode: "DISPLAY" }).mv_mode).toBe("DISPLAY");
    });

    test("DO n TIMES with sy-index, EXIT, comparisons", () => {
      const f = Feature.factory();
      expect(f.sum_even({ i_max: 10 })).toBe(1 + 2 + 3 + 4);
    });

    test("method-local CONSTANTS becomes a const declaration", () => {
      const f = Feature.factory();
      expect(f.title()).toBe(" abap2UI5 - Samples");
    });

    test("CASE with multi-WHEN, string template escapes, COND, builtins", () => {
      const f = Feature.factory();
      expect(f.classify({ i_val: "A" })).toBe("letter { A }");
      expect(f.classify({ i_val: "B" })).toBe("letter { B }");
      expect(f.classify({ i_val: "" })).toBe("empty");
      expect(f.classify({ i_val: "zz" })).toBe("ZZ");
    });

    test("VALUE table rows, LOOP/APPEND, client.get() uppercase keys", async () => {
      const f = Feature.factory();
      const client = createClient(f, { event: "GO" });
      await f.main(client);
      expect(f.mt_rows).toEqual(["x", "y"]);
      expect(f.mv_count).toBe(2);
    });
  });

  describe("view builder preferred-parameter shim", () => {
    const View = require("abap2UI5/z2ui5_cl_xml_view");

    test("positional strings map to the abap PREFERRED PARAMETER", () => {
      const view = View.factory();
      view.shell().page(`Home`).label(`Name`).input(`{/XX/name}`);
      const xml = view.stringify();
      expect(xml).toContain(`title="Home"`);
      expect(xml).toContain(`text="Name"`);
      expect(xml).toContain(`value="{/XX/name}"`);
    });
  });
});
