// abap2js - an abap2UI5 app class, translated into a cap2UI5 app module.
//
// The claim: what comes out is the app the ABAP class is, line for line, and
// what abap2js does not know it refuses with file, row and column instead of
// guessing. fixtures/abap2js/zcl_js_translated.clas.abap is an app written
// the way abap2UI5's samples are, one construct of each kind; its translation
// is srv/apps/zcl_js_translated.js, held here to the generator byte for byte
// and then driven over the wire. That the translation BEHAVES as the ABAP
// does is measured where the corpus is - cap2UI5/samples runs every
// translated sample beside its transpiled original - not here, because the
// transpiler is not a dependency of this repository.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { EXAMPLE, post, serve } from "./server.mjs";

const require = createRequire(import.meta.url);
const { abap2js, Abap2jsError } = require("@cap2ui5/cds-plugin");
const s = serve();

const FIXTURE = path.join(EXAMPLE, "test/fixtures/abap2js/zcl_js_translated.clas.abap");
const MODULE = path.join(EXAMPLE, "srv/apps/zcl_js_translated.js");
const CLI = require.resolve("@cap2ui5/cds-plugin/bin/cap2ui5.js");
const REGENERATE = "npx --no-install cap2ui5 abap2js test/fixtures/abap2js/zcl_js_translated.clas.abap --out srv/apps " +
  '--origin "cap2UI5 examples/bookshop" (in examples/bookshop)';

const APP = "ZCL_JS_TRANSLATED";
const P = (o) => post(s.url, { user: "alice", ...o });
const slots = (r) => [...(r.json?.S_FRONT?.S_ACTION?.T_SYSTEM ?? []), ...(r.json?.S_FRONT?.S_ACTION?.T_CUSTOM ?? [])];
const view = (r) => slots(r).find((a) => a[0] === "VIEW_SLOTS" && a[1] === "display" && a[2] === "MAIN")?.[3];
const custom = (r) => r.json?.S_FRONT?.S_ACTION?.T_CUSTOM ?? [];

test("the translation of the fixture is the app in srv/apps, byte for byte", () => {
  const { name, code } = abap2js(fs.readFileSync(FIXTURE, "utf8"), {
    file: FIXTURE, format: "cjs", origin: "cap2UI5 examples/bookshop test/fixtures/abap2js/zcl_js_translated.clas.abap",
  });
  assert.equal(name, APP);
  assert.equal(code, fs.readFileSync(MODULE, "utf8"), `srv/apps/zcl_js_translated.js is stale - ${REGENERATE}`);
});

test("line for line: a view chain keeps its calls, lines and columns", () => {
  const code = fs.readFileSync(MODULE, "utf8");
  assert.match(code, /^ {4}const view = z2ui5_cl_ui5_view_builder\.factory\(\)\n {8}\.ele\(\{ n: "View", ns: "mvc" \}\)\n {12}\.a\(\{ n: "xmlns", {5}v: "sap\.m" \}\)$/m,
    "one call per line, at the ABAP's column, the v: column aligned as the v = column was");
  assert.match(code, /^const ty_s_row = \{\n {2}title: {4}"",\n {2}count: {4}0,\n {2}selected: false,\n\};$/m,
    "a structure TYPES is a module constant, its components aligned as the ABAP aligned them");
  assert.match(code, /this\.client\._bind\("s_order-title"\)/, "_bind( ) takes the field's name");
  assert.match(code, /this\.client\.nav_app_call\("ZCL_JS_HELLO"\)/, "nav_app_call( NEW zcl( ) ) names the app");
  assert.match(code, /^ {2}on_event\(\) \{\n {4}let selected;\n {4}let row = \{ \.\.\.ty_s_row \};\n/m,
    "declared on top, where ABAP has every local: what a WHEN declares (a case clause is no block), and a LOOP's " +
    "row read after ENDLOOP - which starts initial, as in ABAP, should the loop not run");
  assert.match(code, /^ {8}for \(row of this\.t_rows\.filter\(/m, "the loop writes the row declared on top");
  assert.match(code, /^ {4}let pair = \{ \.\.\.ty_s_pair, row: \{ \.\.\.ty_s_pair\.row \} \};$/m,
    "a local of the class's structure type is a copy of its constant all the way down - a spread one level deep " +
    "shared the inner structure with the module, and every request after wrote into it");
  assert.match(code, /^ {8}\.a\(\{ n: "state", {8}b: this\.active \}\)\n {8}\/\/ the text beside it: [^\n]+\n {8}\.a\(\{ n: "customTextOn"/m,
    "a comment between the calls of a chain stays between them");
});

test("INCLUDE TYPE of the class's own type is that type's constant, spread", () => {
  const { code } = abap2js(`CLASS zcl_js_include DEFINITION PUBLIC.
  PUBLIC SECTION.
    INTERFACES z2ui5_if_app.
    TYPES: BEGIN OF ty_s_head, title TYPE string, END OF ty_s_head.
    DATA BEGIN OF s_order.
      INCLUDE TYPE ty_s_head.
      DATA note TYPE string.
    DATA END OF s_order.
ENDCLASS.
CLASS zcl_js_include IMPLEMENTATION.
  METHOD z2ui5_if_app~main.
  ENDMETHOD.
ENDCLASS.
`, { file: "zcl_js_include.clas.abap" });
  assert.match(code, /^ {2}s_order = \{\n {4}\.\.\.ty_s_head,\n {4}note: "",\n {2}\};$/m);
});

test("the translated app starts: its view and model are the ABAP app's", async () => {
  const r = await P({ app: APP });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  const xml = view(r);
  assert.match(xml, /<Page title="abap2js - translated" showNavButton="false" navButtonPress="[^"]+">/);
  assert.match(xml, /<Input value="\{\/NAME\}"\/>/);
  assert.match(xml, /<Input value="\{\/S_ORDER\/TITLE\}"\/>/);
  assert.match(xml, /<Text text="\{\/CODE\}"\/>/, "a path binding inside \\{ \\} - ABAP's escapes undone, JavaScript's applied");
  assert.match(xml, /<List items="\{\/T_ROWS\}">/);
  assert.match(xml, /<Switch state="false" customTextOn="off"\/>/, "SWITCH #( ) on an abap_bool gives its THEN's string - no X");
  const m = r.json.MODEL;
  assert.equal(m.NAME, "World", "DATA … VALUE is the field's initial value");
  assert.equal(m.CODE, "000000", "TYPE n LENGTH 6 is t.numc( 6 )");
  assert.deepEqual(m.T_ROWS.map((x) => [x.TITLE, x.COUNT, x.SELECTED]), [["first", 1, true], ["second", 2, false]]);
  assert.equal(m.S_ORDER.TITLE, "order");
});

test("its events: CASE with OR, abap_bool as ABAP prints it, a called app", async () => {
  const start = await P({ app: APP });
  for (const event of ["GREET", "HELLO"]) {
    const r = await P({ app: APP, id: start.json.S_FRONT.ID, event });
    assert.equal(r.status, 200, r.text.slice(0, 300));
    assert.deepEqual(custom(r)[0].slice(0, 3), ["MESSAGE_BOX", "show", "Hello World, active: , 2 rows, 1 selected (first)"],
      `WHEN … OR, LOOP AT … WHERE and its row after ENDLOOP - ${event}`);
  }

  const toggled = await P({ app: APP, id: start.json.S_FRONT.ID, event: "TOGGLE" });
  assert.deepEqual(custom(toggled)[0], ["SET_TITLE", "2 rows", "X"],
    "an own method's RETURNING value, and CONV string( abap_true ) is X");
  const greet = await P({ app: APP, id: toggled.json.S_FRONT.ID, event: "GREET" });
  assert.equal(custom(greet)[0][2], "Hello World, active: X, 2 rows, 1 selected (first)", "the toggled abap_bool, in a string template");

  const edit = await P({ app: APP, id: start.json.S_FRONT.ID, event: "EDIT" });
  assert.deepEqual(custom(edit)[0].slice(0, 3), ["MESSAGE_TOAST", "show", "edit mode"], "WHEN OTHERS, SWITCH #( ) on a constant");

  const call = await P({ app: APP, id: start.json.S_FRONT.ID, event: "CALL" });
  assert.equal(call.json.S_FRONT.APP, "ZCL_JS_HELLO", "nav_app_call( NEW zcl_js_hello( ) )");
});

test("what ABAP's = does and JavaScript's does not: copies, conversions, NOT, an empty WHEN, DO", async () => {
  // what the ABAP method answers, transpiled and run on open-abap: a structure copied all the way
  // down and a row appended as it was, an empty WHEN that runs into no other, NOT, DO's count
  // read once, APPEND INITIAL LINE, a text in arithmetic, a number and an abap_bool in &&
  const ABAP = "4 rows, 6, 42, 99, X";
  for (const user of ["alice", "bob", "alice"]) {
    // twice and by two users: a local structure that shared the TYPES constant wrote it, and
    // the next request - anybody's - started from what the last one left (5, then 10, then 15)
    const start = await P({ app: APP, user });
    const r = await P({ app: APP, id: start.json.S_FRONT.ID, event: "RULES", user });
    assert.equal(r.status, 200, r.text.slice(0, 300));
    assert.deepEqual(custom(r)[0].slice(0, 3), ["MESSAGE_BOX", "show", ABAP], `${user}: what the ABAP method answers`);
  }
});

/** The class around `body` in its main( ) and `methods`, translated and run on a stand-in client
 *  whose get_event( ) is `event`: what it hands message_box_display( ). */
const run = (decl, body, event = "", methods = "") => {
  const { code } = abap2js(`CLASS zcl_js_run DEFINITION PUBLIC.
  PUBLIC SECTION.
    INTERFACES z2ui5_if_app.
${decl}
ENDCLASS.
CLASS zcl_js_run IMPLEMENTATION.
  METHOD z2ui5_if_app~main.
${body}
  ENDMETHOD.
${methods}
ENDCLASS.
`, { file: "zcl_js_run.clas.abap", format: "cjs" });
  let App;
  const stub = { defineApp: (name, cls) => { App = cls; } };
  new Function("require", code)(() => stub);
  let shown;
  new App().main({ get_event: () => event, message_box_display: (v) => { shown = v; } });
  return { shown, code };
};

test("a translation behaves as the ABAP: the answers are what the transpiled ABAP answers", () => {
  const rows = "    TYPES: BEGIN OF ty_s_row, id TYPE i, done TYPE abap_bool, END OF ty_s_row.";
  const cases = [
    // NOT stands in front of the comparison it negates
    ["", "    DATA(a) = `5`.\n    IF NOT a = `5`.\n      client->message_box_display( `NOT lost` ).\n    ELSE.\n" +
      "      client->message_box_display( `else` ).\n    ENDIF.", "else"],
    ["", "    DATA(e) = ``.\n    IF NOT e IS NOT INITIAL.\n      client->message_box_display( `initial` ).\n    ENDIF.", "initial"],
    [rows, "    DATA t TYPE STANDARD TABLE OF ty_s_row WITH EMPTY KEY.\n    t = VALUE #( ( id = 1 ) ( id = 2 ) ( id = 3 ) ).\n" +
      "    DATA(n) = 0.\n    LOOP AT t INTO DATA(r) WHERE NOT id = 1 AND NOT ( id = 3 ).\n      n = n + r-id.\n    ENDLOOP.\n" +
      "    client->message_box_display( |{ n }| ).", "2"],
    // an empty WHEN does nothing - in a switch it ran into the next case
    ["", "    DATA(o) = `start`.\n    CASE o.\n      WHEN `start`.\n      WHEN `other`.\n        o = `fell through`.\n" +
      "      WHEN OTHERS.\n        o = `fell through`.\n    ENDCASE.\n    client->message_box_display( o ).", "start"],
    // 'X' is the abap_bool it is compared with, in CASE, WHERE and SWITCH
    ["", "    DATA(f) = abap_true.\n    DATA(o) = `start`.\n    CASE f.\n      WHEN 'X'.\n      WHEN OTHERS.\n" +
      "        o = `fell through`.\n    ENDCASE.\n    client->message_box_display( o && SWITCH string( f WHEN 'X' THEN ` X` ) ).", "start X"],
    [rows, "    DATA t TYPE STANDARD TABLE OF ty_s_row WITH EMPTY KEY.\n    t = VALUE #( ( id = 1 done = abap_true ) ( id = 2 ) ).\n" +
      "    DATA(n) = 0.\n    LOOP AT t INTO DATA(r) WHERE done = 'X'.\n      n = n + 1.\n    ENDLOOP.\n" +
      "    client->message_box_display( |{ n }| ).", "1"],
    // EXIT outside a loop leaves the method; DO reads its count once
    ["    METHODS m RETURNING VALUE(result) TYPE string.", "    client->message_box_display( m( ) ).", "before",
      "  METHOD m.\n    result = `before`.\n    EXIT.\n  ENDMETHOD."],
    ["", "    DATA(k) = 3.\n    DATA(c) = 0.\n    DO k TIMES.\n      k = k + 1.\n      c = c + 1.\n    ENDDO.\n" +
      "    client->message_box_display( |{ c }| ).", "3"],
    // abaplint reads += and -= as two tokens: the + was lost, `i += 2` was `i = 2`
    ["", "    DATA(i) = 1.\n    DATA(s) = `4`.\n    i += 2.\n    i -= s.\n    i *= 3.\n    client->message_box_display( |{ i }| ).", "-3"],
    // conversions: a text in arithmetic, && of numbers and abap_bool, a text compared with a number
    ["", "    DATA(s) = `5`.\n    DATA(i) = 5.\n    DATA(x) = 1.\n    DATA(y) = 2.\n" +
      "    client->message_box_display( |{ s + 1 } { 1 + s } | && x && y && ` ` && abap_true && xsdbool( i = '5' ) ).", "6 6 12 XX"],
    ["", "    DATA s TYPE string.\n    s = `05`.\n    IF s = 5.\n      client->message_box_display( `equal` ).\n    ENDIF.", "equal"],
    // a TYPE p prints with its decimals; TYPE c and n take the value as ABAP moves it
    ["", "    DATA p TYPE p LENGTH 10 DECIMALS 2 VALUE '-1.5'.\n    DATA c TYPE c LENGTH 3.\n    DATA n TYPE n LENGTH 5.\n" +
      "    c = `ABCDEF`.\n    n = 42.\n    client->message_box_display( |{ p } { c } { n }| ).", "-1.50 ABC 00042"],
    // APPEND INITIAL LINE appends a row; a copy is a copy, a row appended the row as it was
    [rows, "    DATA t TYPE STANDARD TABLE OF ty_s_row WITH EMPTY KEY.\n    DATA s TYPE ty_s_row.\n    s-id = 1.\n" +
      "    APPEND s TO t.\n    s-id = 2.\n    APPEND s TO t.\n    DATA(c) = s.\n    c-id = 99.\n    APPEND INITIAL LINE TO t.\n" +
      "    DATA(o) = ``.\n    LOOP AT t INTO DATA(r).\n      r-id = r-id + 10.\n      o = o && r-id && `,`.\n    ENDLOOP.\n" +
      "    LOOP AT t INTO r.\n      o = o && r-id && `,`.\n    ENDLOOP.\n    client->message_box_display( o && s-id ).", "11,12,10,1,2,0,2"],
    // a component VALUE leaves out is initial
    [rows, "    DATA(s) = VALUE ty_s_row( id = 1 ).\n    IF s-done IS INITIAL.\n      client->message_box_display( `initial` ).\n    ENDIF.", "initial"],
  ];
  for (const [decl, body, want, methods] of cases) {
    const { shown, code } = run(decl, body, "", methods);
    assert.equal(shown, want, `${body.trim()}\n--- translated:\n${code}`);
  }
});

test("an ABAP comment or text cannot end a JavaScript line: U+2028, U+2029 and CR stay inside it", () => {
  // JavaScript ends a line at all three, ABAP only at LF: a comment that carried one through ran
  // the rest of the ABAP comment as code. (A '…' or `…` literal with one is an ABAP syntax error.)
  globalThis.abap2jsInjected = false;
  for (const br of ["\u2028", "\u2029", "\r"]) {
    const { shown, code } = run("", `    " harmless${br}globalThis.abap2jsInjected = true;\n` +
      `    client->message_box_display( |e${br}f| ).`);
    assert.equal(globalThis.abap2jsInjected, false, `${JSON.stringify(br)}: the comment's rest ran as code\n${code}`);
    if (br !== "\r") assert.equal(shown, `e${br}f`, "the text is the text");
    assert.ok(!/[\u2028\u2029]/.test(code), `${JSON.stringify(br)} is written as an escape`);
  }
  delete globalThis.abap2jsInjected;
});

test("a slip of the translator itself is an Abap2jsError with the row it was translating", () => {
  const broken = { frameworkFound: true, model() { throw new TypeError("boom"); } };
  const src = "CLASS zcl_x DEFINITION PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES z2ui5_if_app.\n" +
    "    DATA s TYPE zcl_other=>ty_s.\nENDCLASS.\nCLASS zcl_x IMPLEMENTATION.\n  METHOD z2ui5_if_app~main.\n  ENDMETHOD.\nENDCLASS.\n";
  const e = (() => { try { abap2js(src, { file: "zcl_x.clas.abap", library: broken }); } catch (x) { return x; } })();
  assert.ok(e instanceof Abap2jsError, String(e));
  assert.match(e.message, /^zcl_x\.clas\.abap:4:5 - abap2js failed on this statement \(boom\)/);
  assert.equal(e.row, 4);
});

/** abap2js of a class around `body` in its main( ), with `data` in its public section. */
const refusal = (body, data = "") => {
  const src = `CLASS zcl_js_refused DEFINITION PUBLIC.
  PUBLIC SECTION.
    INTERFACES z2ui5_if_app.
    TYPES: BEGIN OF ty_s_row, title TYPE string, END OF ty_s_row.
    DATA t_tab TYPE STANDARD TABLE OF ty_s_row WITH EMPTY KEY.
${data}
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.
CLASS zcl_js_refused IMPLEMENTATION.
  METHOD z2ui5_if_app~main.
${body}
  ENDMETHOD.
ENDCLASS.
`;
  try {
    abap2js(src, { file: "zcl_js_refused.clas.abap" });
  } catch (e) {
    return e;
  }
  return null;
};

test("what it does not know, it refuses - with file, row and column", () => {
  const cases = [
    ["    LOOP AT t_tab ASSIGNING FIELD-SYMBOL(<row>).\n    ENDLOOP.", "", /ASSIGNING \/ REFERENCE INTO writes through the row/, 12],
    ["    SELECT * FROM t000 INTO TABLE @DATA(rows).", "", /Select is not supported yet/, 12],
    ["    DATA(local) = `x`.\n    client->_bind( local ).", "", /local is no attribute - only an attribute can be bound by name/, 13],
    ["    DATA(q) = 7 / 2.", "", /the operator \/ is not supported yet/, 12],
    ["    client->message_toast_display( sy-uname ).", "", /sy- fields are not supported yet/, 12],
    // not the translation's limit but the model's: defineApp( ) has no table of scalars yet
    ["", "    DATA names TYPE string_table.", /a table of scalars cannot be a cap2UI5 field yet/, 6],
    ["", "    DATA BEGIN OF s_both.\n      INCLUDE TYPE ty_s_row AS row RENAMING WITH SUFFIX _x.\n    DATA END OF s_both.",
      /INCLUDE TYPE \.\.\. AS \/ RENAMING WITH SUFFIX is not supported/, 7],
    // DATA runs once, on entering the method: a `let` in the loop would reset it every iteration
    ["    DO 2 TIMES.\n      DATA count TYPE i.\n      count = count + 1.\n    ENDDO.", "",
      /DATA inside DO \/ LOOP \/ WHILE keeps its value from one iteration to the next/, 13],
    // a translator error, not a crash
    ["    DATA lo TYPE REF TO object.\n    lo ?= client.", "", /\?= \(a down cast\) is not supported/, 13],
    // ABAP rounds an integer quotient
    ["    DATA(q) = 7.\n    q /= 2.", "", /\/= is not supported - ABAP rounds an integer quotient/, 13],
    // === compares objects by identity; ABAP compares structures by content
    ["    DATA(a) = VALUE ty_s_row( ).\n    DATA(b) = a.\n    IF a = b.\n    ENDIF.", "",
      /comparing structures or tables is not supported/, 14],
    // an array keeps neither key order nor unique keys
    ["    DATA t TYPE SORTED TABLE OF ty_s_row WITH UNIQUE KEY title.", "", /a SORTED or HASHED table is not supported/, 12],
    // EXIT in a CASE in a loop leaves the loop, a break in a switch only the switch
    ["    DO 2 TIMES.\n      CASE 1.\n        WHEN 1.\n          EXIT.\n      ENDCASE.\n    ENDDO.", "",
      /EXIT inside a CASE inside a loop is not supported/, 15],
    ["    CONTINUE.", "", /CONTINUE outside a loop is not supported/, 12],
    // what ABAP formats or rounds its own way
    ["    DATA p TYPE p LENGTH 10 DECIMALS 2.\n    client->message_box_display( `p` && p ).", "",
      /a TYPE p in && is not supported/, 13],
    ["    DATA c TYPE c LENGTH 3.\n    c = 5.", "", /a TYPE int moved into a TYPE char LENGTH 3 is not supported - ABAP right-aligns/, 13],
    ["    DATA p TYPE p LENGTH 10 DECIMALS 2.\n    DATA(q) = p + 1.", "", /DATA\( \) = arithmetic on a TYPE p is not supported/, 13],
    ["    DATA p TYPE p LENGTH 10 DECIMALS 2.\n    p = p * p.", "", /moved into a TYPE packed LENGTH 10 is not supported - ABAP rounds/, 13],
  ];
  for (const [body, data, message, row] of cases) {
    const e = refusal(body, data);
    assert.ok(e instanceof Abap2jsError, `${body.trim()}: not refused (${e})`);
    assert.match(e.message, message);
    assert.match(e.message, /^zcl_js_refused\.clas\.abap:\d+:\d+ - /);
    assert.equal(e.row, row, `${body.trim()}: the row`);
  }
});

test("a class that is no app is refused as a whole", () => {
  const e = (() => {
    try {
      abap2js("CLASS zcl_x DEFINITION PUBLIC.\n  PUBLIC SECTION.\nENDCLASS.\nCLASS zcl_x IMPLEMENTATION.\nENDCLASS.\n");
    } catch (x) {
      return x;
    }
  })();
  assert.ok(e instanceof Abap2jsError);
  assert.match(e.message, /does not implement z2ui5_if_app/);
});

test("cap2ui5 abap2js: writes the module, --check holds it, a refusal is exit 1", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "abap2js-"));
  try {
    const run = (...args) => spawnSync(process.execPath, [CLI, "abap2js", ...args], { cwd: EXAMPLE, encoding: "utf8" });
    const origin = ["--origin", "cap2UI5 examples/bookshop"];
    const fixture = "test/fixtures/abap2js/zcl_js_translated.clas.abap";

    const missing = run(fixture, "--out", dir, "--cjs", "--check", ...origin);
    assert.equal(missing.status, 1, "--check without the module");
    assert.match(missing.stderr, /missing: .*zcl_js_translated\.js/);

    const written = run(fixture, "--out", dir, "--cjs", ...origin);
    assert.equal(written.status, 0, written.stderr);
    assert.equal(fs.readFileSync(path.join(dir, "zcl_js_translated.js"), "utf8"), fs.readFileSync(MODULE, "utf8"));

    const checked = run(fixture, "--out", "srv/apps", "--check", ...origin);
    assert.equal(checked.status, 0, `srv/apps is what the CLI writes, format from package.json: ${checked.stderr}`);

    fs.writeFileSync(path.join(dir, "zcl_js_refused.clas.abap"),
      "CLASS zcl_js_refused DEFINITION PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES z2ui5_if_app.\n  PROTECTED SECTION.\n" +
      "  PRIVATE SECTION.\nENDCLASS.\nCLASS zcl_js_refused IMPLEMENTATION.\n  METHOD z2ui5_if_app~main.\n" +
      "    WAIT UP TO 1 SECONDS.\n  ENDMETHOD.\nENDCLASS.\n");
    const refused = run(path.join(dir, "zcl_js_refused.clas.abap"), "--out", dir);
    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /refused: zcl_js_refused\.clas\.abap:9:5 - Wait is not supported yet/);
    assert.ok(!fs.existsSync(path.join(dir, "zcl_js_refused.js")), "nothing is written for a refused class");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
