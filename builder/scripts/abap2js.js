#!/usr/bin/env node
/**
 * abap2js — transpiles abap2UI5 app classes (z2ui5_if_app implementations,
 * popup classes, demo apps) from ABAP to the idiomatic JavaScript style used
 * in srv/z2ui5 and srv/app/samples.
 *
 * Parsing is done by @abaplint/core (larshp's ABAP parser): it provides exact
 * statement boundaries, statement classification and the token stream. This
 * script only implements the JS emitter on top of that.
 *
 * Scope: the app layer that is supposed to be a 1:1 copy of the ABAP source.
 * The core engine (handler, binding, model, draft) is a hand-maintained
 * architecture adaptation (CDS/SQLite, native JSON) and is NOT a target.
 * Statements outside the supported subset are emitted as
 * `// TODO(abap2js): <original>` so nothing is silently dropped.
 *
 * Usage:
 *   node builder/scripts/abap2js.js <file.clas.abap|dir> [more inputs...] -o <outdir>
 *   node builder/scripts/abap2js.js <file.clas.abap> --stdout
 */
"use strict";

const { Registry, MemoryFile } = require("@abaplint/core");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// require-path mapping (mirrors the "exports" of cap2UI5's package.json)
// ---------------------------------------------------------------------------

function requirePathFor(className) {
  if (/^z2ui5_cl_demo_/.test(className)) return `./${className}`;
  if (
    /^z2ui5_(cl|cx)_srt_?/.test(className) ||
    /^z2ui5_(cl|cx)_ajson/.test(className) ||
    /^z2ui5_if_/.test(className) ||
    /^z2ui5_cl_pop_/.test(className) ||
    /^z2ui5_cl_util/.test(className) ||
    /^z2ui5_cl_app_/.test(className) ||
    className === "z2ui5_cl_xml_view" ||
    className === "z2ui5_cl_xml_view_cc" ||
    className === "z2ui5_cx_util_error" ||
    className === "z2ui5_port"
  ) {
    return `abap2UI5/${className}`;
  }
  return null; // unknown — will be flagged as TODO
}

// ---------------------------------------------------------------------------
// token helpers
// ---------------------------------------------------------------------------

const KW = (s) => s.toUpperCase();

function tokify(statement) {
  return statement.getTokens().map((t) => ({ type: t.constructor.name, str: t.getStr(), row: t.getStart().getRow(), col: t.getStart().getCol() }));
}

/** true when b starts directly after a with no whitespace (ABAP offset syntax) */
function isAdjacent(a, b) {
  return a && b && a.row === b.row && b.col === a.col + a.str.length;
}

const isParenL = (t) => t.type === "ParenLeft" || t.type === "ParenLeftW" || t.type === "WParenLeft" || t.type === "WParenLeftW";
const isParenR = (t) => t.type === "ParenRight" || t.type === "ParenRightW" || t.type === "WParenRight" || t.type === "WParenRightW";
const isBrackL = (t) => /BracketLeft/.test(t.type);
const isBrackR = (t) => /BracketRight/.test(t.type);
const isTmplBegin = (t) => t.type === "StringTemplateBegin";
const isTmplMiddle = (t) => t.type === "StringTemplateMiddle";
const isTmplEnd = (t) => t.type === "StringTemplateEnd";
const isTmpl = (t) => t.type === "StringTemplate";
const isStr = (t) => t.type === "StringToken" || t.type === "String";
const isId = (t) => t.type === "Identifier";
const isDash = (t) => t.type === "Dash" || t.type === "WDash" || t.type === "DashW";
const isInstArrow = (t) => t.type === "InstanceArrow";
const isStatArrow = (t) => t.type === "StaticArrow";

function depthDelta(t) {
  if (isParenL(t) || isBrackL(t) || isTmplBegin(t)) return 1;
  if (isParenR(t) || isBrackR(t) || isTmplEnd(t)) return -1;
  return 0;
}

/** find index of matching closer for the opener at `start` */
function matchGroup(toks, start) {
  let depth = 0;
  for (let i = start; i < toks.length; i++) {
    depth += depthDelta(toks[i]);
    if (depth === 0) return i;
  }
  throw new Error("unbalanced group: " + toks.map((t) => t.str).join(" "));
}

/** split token list at top-level occurrences matching pred */
function splitTop(toks, pred) {
  const parts = [];
  let depth = 0;
  let cur = [];
  for (const t of toks) {
    const d = depthDelta(t);
    if (d > 0) depth++;
    if (d < 0) depth--;
    if (depth === 0 && d === 0 && pred(t)) {
      parts.push(cur);
      cur = [];
    } else {
      cur.push(t);
    }
  }
  parts.push(cur);
  return parts;
}

function escTemplateText(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/** ABAP string-template escapes: structural \| \{ \} \\ plus the control
 *  characters \n (newline), \t (tab), \r (CR). Resolve them to the actual
 *  characters — escTemplateText() re-escapes backslashes/backticks for JS
 *  afterwards, and a literal newline is valid inside a JS template literal.
 *  Without \n/\t/\r a template like |...\n...| leaked the two-character
 *  sequence "\n" into the output (e.g. broken inline XML views). */
function unescAbapTemplate(s) {
  return s.replace(/\\(.)/g, (_m, c) =>
    c === "n" ? "\n" : c === "t" ? "\t" : c === "r" ? "\r" : c);
}

const JS_RESERVED = new Set(["class", "new", "delete", "function", "var", "let", "const", "switch", "case", "return", "this", "typeof", "in", "of", "do", "if", "else", "for", "while", "void", "with", "yield", "await", "static", "import", "export", "extends", "super", "catch", "try", "finally", "throw", "default", "break", "continue", "instanceof", "null", "true", "false", "enum", "arguments", "interface", "implements", "package", "private", "protected", "public"]);

/** rename identifiers that collide with JS reserved words (class → class_) */
function safeIdent(name) {
  return JS_RESERVED.has(name) ? `${name}_` : name;
}

/** JS name for an ABAP field symbol — `<x>` → `fs_x`. ABAP `<x>` and `x` are
 *  distinct names, so stripping only the brackets can collide. */
function fsIdent(raw) {
  return safeIdent(`fs_${raw.replace(/[<>]/g, "").toLowerCase()}`);
}

/** identifier that may be a plain var or a field symbol */
function varOrFsIdent(raw) {
  return /^<\w+>$/.test(raw) ? fsIdent(raw) : safeIdent(raw.toLowerCase());
}

/** ABAP '...' literal → JS `...` literal */
function singleQuotedToBacktick(raw) {
  const inner = raw.slice(1, -1).replace(/''/g, "'");
  return "`" + escTemplateText(inner) + "`";
}

/** ABAP `...` literal → JS `...` literal (escapes \, ` and ${ for JS) */
function backtickToTemplate(raw) {
  const inner = raw.slice(1, -1).replace(/``/g, "`");
  return "`" + escTemplateText(inner) + "`";
}

/** render any ABAP string token as a JS template literal */
function stringToken(str) {
  return str.startsWith("'") ? singleQuotedToBacktick(str) : backtickToTemplate(str);
}

/** parameter names may carry the ABAP escape prefix: !name */
function paramName(str) {
  return str.replace(/^!/, "").toLowerCase();
}

/** free-text ABAP source for a JS block comment — must not close the comment */
function commentSafe(src, max = 120) {
  return src.replace(/\*\//g, "* /").slice(0, max);
}

// ---------------------------------------------------------------------------
// class model
// ---------------------------------------------------------------------------

function typeDefault(typeTokens) {
  const t = typeTokens.join(" ").toUpperCase().replace(/^(TYPE|LIKE)\s+/, "");
  if (/REF TO/.test(t)) return "null";
  if (/TABLE OF|TABLE$|_TAB$|^TY_T_|_T_|STANDARD TABLE|SORTED TABLE|HASHED TABLE|TT_|RANGE OF/.test(t)) return "[]";
  if (/ABAP_BOOL|XSDBOOLEAN|^XFELD/.test(t)) return "false";
  // structure types by naming convention (ty_s_result, ts_data, ...)
  if (/^TY_S_|^TS_|^S_[A-Z0-9_]/.test(t)) return "{}";
  if (/^I$|^INT4|^INT8|^F$|^P |^P$|DECFLOAT/.test(t)) return "0";
  if (/^STRING|^C |^C$|CLIKE|^CHAR|^N |^N$|CSEQUENCE/.test(t)) return "``";
  return "null";
}

function parseTypeAfter(toks, i) {
  // returns { typeTokens, default: <VALUE literal or null>, next }
  const typeTokens = [];
  let value = null;
  while (i < toks.length) {
    const up = KW(toks[i].str);
    if (up === "VALUE") {
      i++;
      if (i < toks.length) {
        value = toks[i];
        i++;
      }
      continue;
    }
    if (up === "READ-ONLY" || up === "OPTIONAL" || up === "DEFAULT" || up === "LENGTH" || up === "DECIMALS") {
      typeTokens.push(toks[i].str);
      i++;
      continue;
    }
    typeTokens.push(toks[i].str);
    i++;
  }
  return { typeTokens, value };
}

class ClassModel {
  constructor(name) {
    this.name = name;
    this.superclass = null;
    this.interfaces = [];
    this.fields = new Map(); // name -> { default, isStatic, isConst, valueExpr }
    this.structConsts = new Map(); // name -> [{ name, valueTok }]
    this.methods = new Map(); // lowername -> { isStatic, importing:[{name,defaultTok}], returning:{name,typeTokens}|null }
    this.methodBodies = []; // { name, statements: [{type,toks,src}] }
  }
}

function buildModel(file) {
  const statements = file.getStatements().map((s) => ({
    type: s.get().constructor.name,
    toks: tokify(s),
    src: s.concatTokens(),
  }));

  let model = null;
  let inImpl = false;
  let curMethod = null;
  let structCollector = null; // { name, members: [] , isConst }

  for (const s of statements) {
    const T = s.type;
    let toks = s.toks;

    if (T === "ClassDefinition") {
      const name = toks[1].str.toLowerCase();
      model = new ClassModel(name);
      const idxInh = toks.findIndex((t) => KW(t.str) === "INHERITING");
      if (idxInh >= 0) model.superclass = toks[idxInh + 2].str.toLowerCase();
      continue;
    }
    if (!model) continue;

    if (T === "ClassImplementation") {
      inImpl = true;
      continue;
    }

    if (!inImpl) {
      // ----- definition part -----
      if (T === "InterfaceDef") {
        model.interfaces.push(toks[1].str.toLowerCase());
      } else if (T === "DataBegin" || T === "ConstantBegin") {
        structCollector = { name: toks[toks.length - 2].str.toLowerCase(), members: [], isConst: T === "ConstantBegin" };
        // "DATA BEGIN OF name ." → name is token before final "."
        const ofIdx = toks.findIndex((t) => KW(t.str) === "OF");
        structCollector.name = toks[ofIdx + 1].str.toLowerCase();
      } else if (T === "DataEnd" || T === "ConstantEnd") {
        if (structCollector) {
          if (structCollector.isConst) model.structConsts.set(structCollector.name, structCollector.members);
          else
            model.fields.set(structCollector.name, {
              default: "{ " + structCollector.members.map((m) => `${m.name}: ${m.value ?? m.default}`).join(", ") + " }",
              isStatic: false,
              isConst: false,
            });
          structCollector = null;
        }
      } else if (T === "Data" || T === "ClassData" || T === "Constant") {
        // CLASS-DATA lexes as three tokens: CLASS - DATA
        const body = KW(toks[0].str) === "CLASS" && isDash(toks[1]) ? toks.slice(2) : toks;
        const name = body[1].str.toLowerCase();
        const { typeTokens, value } = parseTypeAfter(body.slice(2, -1), 0);
        const rendered = value ? renderLiteralToken(value) : null;
        if (structCollector) {
          structCollector.members.push({ name, default: typeDefault(typeTokens), value: rendered });
        } else if (T === "Constant") {
          model.fields.set(name, { default: rendered ?? typeDefault(typeTokens), isStatic: true, isConst: true });
        } else {
          model.fields.set(name, { default: rendered ?? typeDefault(typeTokens), isStatic: T === "ClassData", isConst: false });
        }
      } else if (T === "MethodDef") {
        // CLASS-METHODS lexes as three tokens: CLASS - METHODS
        const isStatic = KW(toks[0].str) === "CLASS" && isDash(toks[1]);
        if (isStatic) toks = toks.slice(2);
        const name = toks[1].str.toLowerCase();
        const def = { isStatic, importing: [], returning: null };
        let mode = null;
        for (let i = 2; i < toks.length - 1; i++) {
          const up = KW(toks[i].str);
          if (["IMPORTING", "EXPORTING", "CHANGING", "RETURNING", "RAISING", "REDEFINITION", "FOR", "ABSTRACT", "FINAL"].includes(up)) {
            mode = up;
            continue;
          }
          if (["IMPORTING", "EXPORTING", "CHANGING"].includes(mode) && isId(toks[i]) && !["TYPE", "LIKE", "REF", "TO", "OF", "OPTIONAL", "DEFAULT", "TABLE", "STANDARD", "SORTED", "HASHED", "WITH", "KEY", "EMPTY", "UNIQUE", "NON-UNIQUE", "LINE", "PREFERRED", "PARAMETER"].includes(up.replace(/^!/, ""))) {
            // parameter names are followed by TYPE/LIKE — EXPORTING/CHANGING
            // params join the destructured signature (JS object refs give the
            // by-reference semantics for structures and tables)
            if (KW(toks[i + 1]?.str) === "TYPE" || KW(toks[i + 1]?.str) === "LIKE") {
              const param = { name: paramName(toks[i].str), defaultToks: null };
              // scan ahead for DEFAULT <tok...> until next param/section
              for (let j = i + 2; j < toks.length - 1; j++) {
                const u = KW(toks[j].str);
                if (["IMPORTING", "EXPORTING", "CHANGING", "RETURNING", "RAISING"].includes(u)) break;
                if (u === "DEFAULT") {
                  const dToks = [];
                  for (let k = j + 1; k < toks.length - 1; k++) {
                    const uu = KW(toks[k].str);
                    if (["IMPORTING", "EXPORTING", "CHANGING", "RETURNING", "RAISING", "OPTIONAL", "PREFERRED"].includes(uu)) break;
                    if (isId(toks[k]) && KW(toks[k + 1]?.str) === "TYPE") break;
                    dToks.push(toks[k]);
                  }
                  param.defaultToks = dToks;
                  break;
                }
                if (isId(toks[j]) && KW(toks[j + 1]?.str) === "TYPE") break;
              }
              def.importing.push(param);
            }
          }
          if (mode === "RETURNING" && KW(toks[i].str) === "VALUE" && isParenL(toks[i + 1])) {
            const close = matchGroup(toks, i + 1);
            def.returning = { name: paramName(toks[i + 2].str), typeTokens: toks.slice(close + 2, toks.length - 1).map((t) => t.str) };
          }
        }
        model.methods.set(name, def);
      }
      continue;
    }

    // ----- implementation part -----
    if (T === "MethodImplementation") {
      curMethod = { name: toks[1].str.toLowerCase(), statements: [] };
      model.methodBodies.push(curMethod);
      continue;
    }
    if (T === "EndMethod") {
      curMethod = null;
      continue;
    }
    if (curMethod) curMethod.statements.push(s);
  }
  return model;
}

function renderLiteralToken(tok) {
  if (isStr(tok)) return stringToken(tok.str);
  const up = KW(tok.str);
  if (up === "ABAP_TRUE") return "true";
  if (up === "ABAP_FALSE") return "false";
  return tok.str;
}

// ---------------------------------------------------------------------------
// target signature introspection
//
// The hand-written client port (srv/z2ui5/01/02/z2ui5_cl_core_client.js) uses
// POSITIONAL parameters, while the view builder & transpiled app classes use
// destructured option objects. ABAP named arguments on a client receiver are
// therefore mapped to positional arguments in the order of the real JS
// signature, which is parsed from the port's source once.
// ---------------------------------------------------------------------------

let _clientSig;
function clientSignature() {
  if (_clientSig !== undefined) return _clientSig;
  _clientSig = null;
  const p = path.join(__dirname, "..", "..", "cap2UI5", "srv", "z2ui5", "01", "02", "z2ui5_cl_core_client.js");
  if (!fs.existsSync(p)) return _clientSig;
  _clientSig = new Map();
  const src = fs.readFileSync(p, "utf8");
  // signatures may span multiple lines (e.g. message_box_display)
  const re = /^  (?:static |async )*([a-z_][a-z0-9_]*)\(([^)]*?)\)\s*\{/gms;
  let m;
  while ((m = re.exec(src)) !== null) {
    const raw = m[2].replace(/\s+/g, " ").trim();
    const destructured = raw.startsWith("{");
    const params = destructured
      ? []
      : raw === ""
        ? []
        : raw.split(",").map((s) => s.trim().split("=")[0].trim());
    _clientSig.set(m[1], { params, destructured });
  }
  return _clientSig;
}

function isClientReceiver(recv) {
  return recv === "client" || recv === "this.client" || /\.client$/.test(recv);
}

// _bind / _bind_edit: ABAP identifies nested struct members via reference
// semantics (REF #). JS values carry no identity, so the runtime needs the
// attribute path passed explicitly. Keep `val` positional, move all other
// ABAP parameters into the opts object, and derive `name` whenever the bound
// value is a member chain of an app attribute (rendered as `this.a.b`).
const BIND_METHS = new Set(["_bind", "_bind_edit"]);
const APP_MEMBER_PATH = /^this\.([A-Za-z0-9_$]+(?:\.[A-Za-z0-9_$]+)+)$/;

function bindArgs(meth, groupToks, ctx) {
  if (!BIND_METHS.has(meth)) return null;
  const named = namedArgsOf(groupToks, ctx);
  let valExpr;
  const extra = [];
  if (named) {
    if (!named.has("val")) return null;
    for (const [k, v] of named.entries()) {
      if (k === "val") valExpr = renderNamedVal(v);
      else extra.push(`${k}: ${renderNamedVal(v)}`);
    }
  } else {
    valExpr = txArgs(groupToks, ctx, meth);
    if (!valExpr || !APP_MEMBER_PATH.test(valExpr)) return null;
  }
  const m = APP_MEMBER_PATH.exec(valExpr || "");
  if (m) extra.unshift(`name: \`${m[1].replace(/\./g, "-")}\``);
  if (!valExpr) return null;
  return extra.length ? `${valExpr}, { ${extra.join(", ")} }` : valExpr;
}

/** named args on a client method → positional args in JS signature order */
function clientArgs(meth, groupToks, ctx) {
  const sig = clientSignature()?.get(meth);
  const named = namedArgsOf(groupToks, ctx);
  if (!named || !sig || sig.destructured || !sig.params.length) return null;
  const pos = sig.params.map((p) => (named.has(p) ? renderNamedVal(named.get(p)) : "undefined"));
  while (pos.length && pos[pos.length - 1] === "undefined") pos.pop();
  if ([...named.keys()].some((k) => !sig.params.includes(k))) return null; // unknown param — keep object
  return pos.join(", ");
}

// ---------------------------------------------------------------------------
// expression transpiler
// ---------------------------------------------------------------------------

const BUILTIN_PREDICATES = new Set(["xsdbool", "boolc", "line_exists"]);
const CONSTRUCTORS = new Set(["VALUE", "COND", "NEW", "CONV", "SWITCH", "CORRESPONDING", "REF", "EXACT", "REDUCE", "FILTER", "CAST"]);

class Ctx {
  constructor(model, method) {
    this.model = model;
    this.method = method; // { name, def }
    this.locals = new Set(); // declared local vars (lowercase)
    this.upperLocals = new Set(); // locals holding client.get() structs (UPPERCASE keys)
    this.requires = null; // shared Set on emitter
    this.todos = null; // shared array
    this.rowVar = null; // WHERE context: bare names resolve to <rowVar>.<name>
    this.loopDepth = 0;
    this.fsBacked = new Map(); // field symbol name -> shadow var holding { o, k } write-back target
  }
  isLocal(name) {
    return this.locals.has(name.toLowerCase());
  }
  isField(name) {
    return this.model.fields.has(name.toLowerCase()) && !this.model.fields.get(name.toLowerCase()).isStatic;
  }
  isStaticField(name) {
    const f = this.model.fields.get(name.toLowerCase());
    return (f && f.isStatic) || this.model.structConsts.has(name.toLowerCase());
  }
  isOwnMethod(name) {
    return this.model.methods.has(name.toLowerCase());
  }
}

/** transpile a full expression token list to a JS expression string */
function txExpr(toks, ctx) {
  const atoms = toAtoms(toks, ctx);
  return joinAtoms(atoms, ctx);
}

/** condition context: same as txExpr (comparison mapping happens in joinAtoms) */
function txCond(toks, ctx) {
  return txExpr(toks, ctx);
}

/**
 * Pass A: collapse the token stream into atoms — each atom is either a fully
 * rendered primary (identifier chain incl. calls, literals, templates,
 * constructor expressions) or an operator/keyword marker.
 */
function toAtoms(toks, ctx) {
  const atoms = [];
  let i = 0;
  while (i < toks.length) {
    const t = toks[i];
    const up = KW(t.str);

    // constructor expressions: VALUE #( ... ), COND #( ... ), NEW type( ... ),
    // VALUE intf=>ty_s_x( ... ) — the type may span `intf=>type` token chains
    if (isId(t) && CONSTRUCTORS.has(up) && i + 1 < toks.length) {
      let open = -1;
      let typeName = null;
      if (toks[i + 1].str === "#") {
        if (isParenL(toks[i + 2] ?? { type: "" })) {
          open = i + 2;
          typeName = null;
        }
      } else {
        let k = i + 1;
        while (k < toks.length && (isId(toks[k]) || isStatArrow(toks[k]))) k++;
        if (k > i + 1 && toks[k] && isParenL(toks[k])) {
          open = k;
          typeName = toks
            .slice(i + 1, k)
            .map((x) => x.str)
            .join("")
            .toLowerCase();
        }
      }
      if (open >= 0) {
        const close = matchGroup(toks, open);
        const inner = toks.slice(open + 1, close);
        atoms.push({ kind: "expr", str: txConstructor(up, typeName, inner, ctx) });
        i = close + 1;
        i = chainSuffix(toks, i, atoms, ctx);
        continue;
      }
    }

    // primaries — note: comparison operators (=, <>, >, ...) lex as
    // Identifier tokens too, so require a word/number/field-symbol shape here.
    // The 2-letter word operators (eq/lt/cs/ns/…) are also legal identifiers:
    // treat them as identifiers when NOT in operator position (i.e. an operand
    // is expected — at the start, or right after another operator), so a
    // variable/param named `lt` or `ns` is not mistaken for a comparison.
    const wordShaped = isId(t) && (/^[a-z0-9_]/i.test(t.str) || /^<\w+>$/.test(t.str));
    const operandExpected = atoms.length === 0 || atoms[atoms.length - 1].kind === "op";
    const asIdent = wordShaped && (!isOperatorWord(up) || (AMBIGUOUS_OP_IDENTS.has(up) && operandExpected));
    if (isStr(t) || isTmplBegin(t) || isTmpl(t) || asIdent || isParenL(t)) {
      const { str, next } = parsePrimary(toks, i, ctx);
      atoms.push({ kind: "expr", str });
      i = next;
      continue;
    }

    // ABAP offset/length substring: var+off(len) — no whitespace around +
    if (t.str === "+" && atoms.length && atoms[atoms.length - 1].kind === "expr" && isAdjacent(toks[i - 1], t) && isAdjacent(t, toks[i + 1]) && toks[i + 2] && isParenL(toks[i + 2]) && (/^\d+$/.test(toks[i + 1].str) || isId(toks[i + 1]))) {
      const base = atoms.pop().str;
      const off = /^\d+$/.test(toks[i + 1].str) ? toks[i + 1].str : txExpr([toks[i + 1]], ctx);
      const close = matchGroup(toks, i + 2);
      const lenToks = toks.slice(i + 3, close);
      const len = lenToks.length === 1 && lenToks[0].str === "*" ? null : txExpr(lenToks, ctx);
      atoms.push({ kind: "expr", str: len === null ? `String(${base}).substr(${off})` : `String(${base}).substr(${off}, ${len})` });
      i = close + 1;
      continue;
    }

    // operators / everything else
    atoms.push({ kind: "op", str: t.str, up });
    i++;
  }
  return atoms;
}

const OPERATOR_WORDS = new Set(["AND", "OR", "NOT", "IS", "IN", "EQ", "NE", "GT", "LT", "GE", "LE", "CS", "CP", "CO", "CN", "CA", "NA", "NS", "NP", "INITIAL", "BOUND", "SUPPLIED", "ASSIGNED", "INSTANCE", "OF", "BETWEEN", "XSDBOOL", "MOD", "DIV"]);
// Binary infix operators that are ALSO common identifier names (a namespace
// `ns`, a local table `lt`, …). They only act as operators in operator
// position; elsewhere they are plain identifiers. (AND/OR/NOT/IN/IS/BETWEEN are
// excluded — unlikely identifiers, and some are unary/keyword-shaped.)
const AMBIGUOUS_OP_IDENTS = new Set(["EQ", "NE", "GT", "LT", "GE", "LE", "CS", "CP", "CO", "CN", "CA", "NA", "NS", "NP", "MOD", "DIV"]);
function isOperatorWord(up) {
  return OPERATOR_WORDS.has(up) && up !== "XSDBOOL";
}

/** parse one primary starting at i; returns { str, next } */
function parsePrimary(toks, i, ctx) {
  const t = toks[i];

  // string literals
  if (isStr(t)) {
    return { str: stringToken(t.str), next: i + 1 };
  }

  // string templates |a { x } b|
  if (isTmpl(t)) {
    // template without embedded expressions: |text|
    return { str: "`" + escTemplateText(unescAbapTemplate(t.str.slice(1, -1))) + "`", next: i + 1 };
  }
  if (isTmplBegin(t)) {
    let out = "`" + escTemplateText(unescAbapTemplate(t.str.slice(1).replace(/\{\s*$/, "")));
    let j = i + 1;
    while (j < toks.length) {
      // collect expression tokens until Middle/End at depth 0
      const exprToks = [];
      let depth = 0;
      while (j < toks.length) {
        const tt = toks[j];
        if (depth === 0 && (isTmplMiddle(tt) || isTmplEnd(tt))) break;
        depth += depthDelta(tt);
        exprToks.push(tt);
        j++;
      }
      out += "${" + txTemplateExpr(exprToks, ctx) + "}";
      const tt = toks[j];
      if (isTmplMiddle(tt)) {
        out += escTemplateText(unescAbapTemplate(tt.str.replace(/^\}/, "").replace(/\{\s*$/, "")));
        j++;
        continue;
      }
      if (isTmplEnd(tt)) {
        out += escTemplateText(unescAbapTemplate(tt.str.replace(/^\}/, "").slice(0, -1)));
        j++;
        break;
      }
      break;
    }
    return { str: out + "`", next: j };
  }

  // parenthesized expression
  if (isParenL(t)) {
    const close = matchGroup(toks, i);
    const inner = txExpr(toks.slice(i + 1, close), ctx);
    const atoms = [{ kind: "expr", str: `(${inner})` }];
    const next = chainSuffix(toks, close + 1, atoms, ctx);
    return { str: atoms.map((a) => a.str).join(""), next };
  }

  // identifier chain
  return parseIdentChain(toks, i, ctx);
}

/** template expression may carry format options (ALPHA = ..., WIDTH = ...) */
function txTemplateExpr(exprToks, ctx) {
  const FORMAT = new Set(["ALPHA", "WIDTH", "PAD", "DATE", "TIME", "TIMESTAMP", "NUMBER", "SIGN", "DECIMALS", "ZERO", "STYLE", "CURRENCY", "COUNTRY", "ALIGN", "CASE", "EXPONENT", "XSD"]);
  for (let k = 0; k < exprToks.length; k++) {
    if (isId(exprToks[k]) && FORMAT.has(KW(exprToks[k].str)) && exprToks[k + 1]?.str === "=") {
      ctx.todos?.push(`format option dropped in template: ${exprToks.map((t) => t.str).join(" ")}`);
      exprToks = exprToks.slice(0, k);
      break;
    }
  }
  // a single identifier that collides with an operator word (a variable
  // named `and`, `in`, ...) is still just a variable here
  if (exprToks.length === 1 && isId(exprToks[0]) && isOperatorWord(KW(exprToks[0].str))) {
    return parseIdentChain(exprToks, 0, ctx).str;
  }
  return txExpr(exprToks, ctx);
}

const BUILTIN_FN = {
  lines: (args) => `${args[0]}.length`,
  strlen: (args) => `${args[0]}.length`,
  to_upper: (args) => `${args[0]}.toUpperCase()`,
  to_lower: (args) => `${args[0]}.toLowerCase()`,
  condense: (args) => `${args[0]}.trim()`,
  shift_left: null, // named args — handled below
  repeat: null,
  substring: null,
  replace: null,
  concat_lines_of: null,
  reverse: (args) => `${args[0]}.split("").reverse().join("")`,
  xsdbool: (args) => `Boolean(${args[0]})`,
  boolc: (args) => `Boolean(${args[0]})`,
  escape: null,
};

function renderBuiltinNamed(name, named, ctx) {
  const g = (k) => named.get(k);
  switch (name) {
    case "repeat":
      return `${g("val")}.repeat(${g("occ")})`;
    case "substring": {
      const off = g("off") ?? "0";
      return g("len") ? `${g("val")}.substr(${off}, ${g("len")})` : `${g("val")}.substr(${off})`;
    }
    case "replace":
      if (named.has("regex")) return `${g("val")}.replace(new RegExp(${g("regex")}, ${named.has("occ") ? "`g`" : "``"}), ${g("with")})`;
      return named.has("occ") ? `${g("val")}.replaceAll(${g("sub")}, ${g("with")})` : `${g("val")}.replace(${g("sub")}, ${g("with")})`;
    case "concat_lines_of":
      return `${g("table")}.join(${g("sep") ?? "``"})`;
    case "shift_left":
      if (named.has("places")) return `${g("val")}.slice(${g("places")})`;
      if (named.has("sub")) return `(${g("val")}.startsWith(${g("sub")}) ? ${g("val")}.slice((${g("sub")}).length) : ${g("val")})`;
      return null;
    case "escape":
      return null;
    default:
      return null;
  }
}

/** identifier chains: receiver=>method( ... )->meth( ... )-comp[ ... ] ... */
function parseIdentChain(toks, i, ctx) {
  const first = toks[i];
  // field symbols <fs> keep their name without the brackets
  const name = /^<\w+>$/.test(first.str) ? `fs_${first.str.slice(1, -1)}` : first.str;
  const lower = safeIdent(name.toLowerCase());
  const up = KW(name);
  let str;
  let j = i + 1;

  const callFollows = j < toks.length && isParenL(toks[j]);

  // interface components: intf~comp — the JS classes flatten interface
  // members, so own-interface calls go to this.comp, foreign ones to intf.comp
  if (name.includes("~")) {
    const [intfRaw, compRaw] = name.split("~");
    const intf = intfRaw.toLowerCase();
    const comp = compRaw.toLowerCase();
    const own = ctx.model.interfaces.includes(intf) || ctx.isOwnMethod(name.toLowerCase()) || ctx.isOwnMethod(comp);
    if (callFollows) {
      const close = matchGroup(toks, j);
      const args = txArgs(toks.slice(j + 1, close), ctx, comp);
      str = own ? `this.${comp}(${args})` : (ctx.requires?.add(intf), `${intf}.${comp}(${args})`);
      j = close + 1;
    } else if (!own && /^z2ui5_/.test(intf)) {
      ctx.requires?.add(intf);
      str = `${intf}.${comp}`;
    } else {
      str = `this.${comp}`;
    }
    const atoms0 = [{ kind: "expr", str }];
    j = chainSuffix(toks, j, atoms0, ctx);
    return { str: atoms0.map((a) => a.str).join(""), next: j };
  }

  if (up === "ME") {
    str = "this";
  } else if (up === "SUPER") {
    str = "super";
  } else if (up === "ABAP_TRUE") {
    str = "true";
  } else if (up === "ABAP_FALSE" || up === "ABAP_UNDEFINED") {
    str = "false";
  } else if (up === "SPACE") {
    str = "``";
  } else if (up === "SY" && isDash(toks[j] ?? { type: "" })) {
    const field = toks[j + 1].str.toLowerCase();
    str = field === "index" ? "sy_index" : field === "tabix" ? "sy_tabix" : `sy_${field}`;
    if (!["index", "tabix", "subrc"].includes(field)) ctx.todos?.push(`sy-${field} used — provide manually`);
    j += 2;
  } else if (callFollows && lower in BUILTIN_FN) {
    // builtin function call
    const close = matchGroup(toks, j);
    const inner = toks.slice(j + 1, close);
    const named = namedArgsOf(inner, ctx);
    let rendered = null;
    if (lower === "xsdbool" || lower === "boolc") {
      // the argument is a logical expression — `x = y` inside is a
      // comparison, not a named parameter
      rendered = `(${txCond(inner, ctx)})`;
    } else if (named) rendered = renderBuiltinNamed(lower, named, ctx);
    else if (BUILTIN_FN[lower]) rendered = BUILTIN_FN[lower]([txExpr(inner, ctx)]);
    if (rendered === null) {
      ctx.todos?.push(`builtin ${lower}( ) not mapped`);
      rendered = `/* TODO(abap2js) */ ${lower}(${txExpr(inner, ctx)})`;
    }
    str = rendered;
    j = close + 1;
  } else if (callFollows && lower === "line_exists") {
    const close = matchGroup(toks, j);
    str = txTableExpr(toks.slice(j + 1, close), ctx, "some");
    j = close + 1;
  } else if (callFollows && ctx.isOwnMethod(lower)) {
    // implicit self call — own methods are emitted with a destructured
    // options object, so a single positional arg maps to the first param
    const def = ctx.model.methods.get(lower);
    const receiver = def.isStatic ? ctx.model.name : "this";
    const close = matchGroup(toks, j);
    const group = toks.slice(j + 1, close);
    let args = txArgs(group, ctx, lower);
    if (group.length && def.importing.length && !namedArgsOf(group, ctx)) {
      args = `{ ${def.importing[0].name}: ${args} }`;
    }
    str = `${receiver}.${lower}(${args})`;
    j = close + 1;
  } else if (/^z2ui5_(cl|cx|if)_/.test(lower) || /^cl_|^cx_/.test(lower)) {
    ctx.requires?.add(lower);
    str = lower;
  } else if (ctx.isLocal(lower)) {
    str = lower;
  } else if (ctx.isField(lower)) {
    str = `this.${lower}`;
  } else if (ctx.isStaticField(lower)) {
    str = `${ctx.model.name}.${lower}`;
  } else if (callFollows) {
    // unknown bare call — most likely an inherited/interface method
    const close = matchGroup(toks, j);
    str = `this.${lower}(${txArgs(toks.slice(j + 1, close), ctx, lower)})`;
    j = close + 1;
  } else if (ctx.rowVar && /^[a-z_]/i.test(name)) {
    // WHERE context: unresolved bare names are components of the loop row
    str = `${ctx.rowVar}.${lower}`;
  } else {
    str = lower === name ? name : lower;
  }

  const atoms = [{ kind: "expr", str }];
  j = chainSuffix(toks, j, atoms, ctx, ctx.upperLocals.has(lower));
  return { str: atoms.map((a) => a.str).join(""), next: j };
}

/** consume ->meth( )/=>meth( )/-comp/[...] suffixes onto atoms */
function chainSuffix(toks, j, atoms, ctx, upper = false) {
  for (;;) {
    const t = toks[j];
    if (!t) break;
    if (isInstArrow(t) || isStatArrow(t)) {
      // obj->* dereference — JS references are transparent
      if (toks[j + 1]?.str === "*") {
        j += 2;
        continue;
      }
      // dynamic call: obj->(`METH`) — JS methods are lowercase
      if (toks[j + 1] && isParenL(toks[j + 1])) {
        const close = matchGroup(toks, j + 1);
        const nameExpr = txExpr(toks.slice(j + 2, close), ctx);
        j = close + 1;
        let args = "";
        if (toks[j] && isParenL(toks[j])) {
          const c2 = matchGroup(toks, j);
          args = txArgs(toks.slice(j + 1, c2), ctx, "dynamic");
          j = c2 + 1;
        }
        ctx.todos?.push(`dynamic method call approximated: ->(${nameExpr})`);
        atoms[atoms.length - 1].str += `[String(${nameExpr}).toLowerCase()](${args})`;
        continue;
      }
      // interface prefix on chained calls: obj->intf~meth( ) → obj.meth( )
      const meth = toks[j + 1].str.toLowerCase().replace(/^.*~/, "");
      j += 2;
      if (toks[j] && isParenL(toks[j])) {
        const close = matchGroup(toks, j);
        const group = toks.slice(j + 1, close);
        let args = null;
        if (isClientReceiver(atoms[atoms.length - 1].str)) {
          args = bindArgs(meth, group, ctx) ?? clientArgs(meth, group, ctx);
        }
        if (args === null) args = txArgs(group, ctx, meth);
        // client.get() returns the request struct with UPPERCASE keys
        if (meth === "get" && isClientReceiver(atoms[atoms.length - 1].str)) upper = true;
        atoms[atoms.length - 1].str += `.${meth}(${args})`;
        j = close + 1;
      } else {
        atoms[atoms.length - 1].str += `.${meth}`;
      }
      continue;
    }
    if (isDash(t) && toks[j + 1] && isId(toks[j + 1])) {
      const comp = toks[j + 1].str;
      atoms[atoms.length - 1].str += `.${upper ? comp.toUpperCase() : comp.toLowerCase()}`;
      j += 2;
      // component might be followed by a call? (rare) — leave to next loop turn
      continue;
    }
    if (isBrackL(t)) {
      const close = matchGroup(toks, j);
      const inner = toks.slice(j + 1, close);
      const base = atoms[atoms.length - 1].str;
      atoms[atoms.length - 1].str = txTableIndex(base, inner, ctx);
      j = close + 1;
      continue;
    }
    break;
  }
  return j;
}

/** tab[ ... ] access — either index or key lookup */
function txTableIndex(base, inner, ctx) {
  const named = namedArgsOf(inner, ctx);
  if (named) {
    const conds = [...named.entries()].map(([k, v]) => `row.${k} === ${renderNamedVal(v)}`).join(" && ");
    return `${base}.find((row) => ${conds})`;
  }
  return `${base}[(${txExpr(inner, ctx)}) - 1]`;
}

/** line_exists( tab[ k = v ] ) → tab.some(...) */
function txTableExpr(inner, ctx, verb) {
  // inner = `tab [ k = v ]`
  const bi = inner.findIndex(isBrackL);
  if (bi < 0) return `${txExpr(inner, ctx)} !== undefined`;
  const base = txExpr(inner.slice(0, bi), ctx);
  const close = matchGroup(inner, bi);
  const named = namedArgsOf(inner.slice(bi + 1, close), ctx);
  if (named) {
    const conds = [...named.entries()].map(([k, v]) => `row.${k} === ${renderNamedVal(v)}`).join(" && ");
    return `${base}.${verb}((row) => ${conds})`;
  }
  return `${base}.length >= (${txExpr(inner.slice(bi + 1, close), ctx)})`;
}

/**
 * If the group consists of `name = expr` / `name-comp = expr` pairs at top
 * level, return Map(name → rendered expr | nested Map); otherwise null.
 */
function namedArgsOf(groupToks, ctx) {
  // strip leading EXPORTING
  let toks = groupToks;
  if (toks.length && KW(toks[0].str) === "EXPORTING") toks = toks.slice(1);
  if (toks.some((t) => ["IMPORTING", "CHANGING", "RECEIVING", "EXCEPTIONS"].includes(KW(t.str)) && isId(t))) return null; // handled by caller as TODO
  if (toks.length < 3) return null;

  // a key is id (-id)* directly followed by "=" — returns [path, nextIdx]
  const keyAt = (k) => {
    if (!isId(toks[k]) || /^[^a-z_!]/i.test(toks[k].str)) return null;
    const path = [paramName(toks[k].str)];
    k++;
    while (isDash(toks[k] ?? { type: "" }) && isId(toks[k + 1] ?? { type: "" })) {
      path.push(toks[k + 1].str.toLowerCase());
      k += 2;
    }
    if (toks[k]?.str !== "=") return null;
    return [path, k + 1];
  };

  if (!keyAt(0)) return null;

  const named = new Map();
  const setPath = (path, val) => {
    let m = named;
    for (let d = 0; d < path.length - 1; d++) {
      if (!(m.get(path[d]) instanceof Map)) m.set(path[d], new Map());
      m = m.get(path[d]);
    }
    m.set(path[path.length - 1], val);
  };

  let i = 0;
  while (i < toks.length) {
    const key = keyAt(i);
    if (!key) return null;
    const [path, exprStart] = key;
    i = exprStart;
    const exprToks = [];
    let depth = 0;
    while (i < toks.length) {
      const t = toks[i];
      depth += depthDelta(t);
      if (depth === 0 && exprToks.length > 0 && keyAt(i)) break;
      exprToks.push(t);
      i++;
    }
    setPath(path, txExpr(exprToks, ctx));
  }
  return named.size ? named : null;
}

/** render a named-args value that may be a nested Map */
function renderNamedVal(v) {
  if (!(v instanceof Map)) return v;
  return `{ ${[...v.entries()].map(([k, x]) => `${k}: ${renderNamedVal(x)}`).join(", ")} }`;
}

/** render call arguments: named → object literal, positional → expression */
function txArgs(groupToks, ctx, methodName) {
  if (groupToks.length === 0) return "";
  if (groupToks.some((t) => isId(t) && ["IMPORTING", "RECEIVING", "EXCEPTIONS"].includes(KW(t.str)))) {
    // true out-params need a rewritten callee — keep the call parseable
    ctx.todos?.push(`call with IMPORTING/RECEIVING/EXCEPTIONS params: ${methodName}( ... ) — rewrite manually`);
    return `undefined /* TODO(abap2js): out-params ${commentSafe(groupToks.map((t) => t.str).join(" "))} */`;
  }
  if (groupToks.some((t) => isId(t) && KW(t.str) === "CHANGING")) {
    // EXPORTING/CHANGING sections merge into one options object — the callee
    // signature includes CHANGING params, JS object refs mutate in place
    const merged = groupToks.filter((t) => !(isId(t) && ["EXPORTING", "CHANGING"].includes(KW(t.str))));
    const named = namedArgsOf(merged, ctx);
    if (named) return renderNamedArgs(named);
    ctx.todos?.push(`CHANGING call not mappable: ${methodName}( ... ) — rewrite manually`);
    return `undefined /* TODO(abap2js): out-params ${commentSafe(groupToks.map((t) => t.str).join(" "))} */`;
  }
  if (BUILTIN_PREDICATES.has(methodName)) return txCond(groupToks, ctx);
  const named = namedArgsOf(groupToks, ctx);
  if (named) return renderNamedArgs(named);
  return txCond(groupToks, ctx);
}

function renderNamedArgs(named) {
  return `{ ${[...named.entries()].map(([k, v]) => (k === v && !JS_RESERVED.has(k) ? k : `${k}: ${renderNamedVal(v)}`)).join(", ")} }`;
}

/** VALUE/COND/NEW/... constructor expressions — typeName is null for `#` */
function txConstructor(kind, typeName, inner, ctx) {
  switch (kind) {
    case "NEW": {
      if (typeName && /[~=>]/.test(typeName)) {
        ctx.todos?.push(`NEW with nested type ${typeName} — resolve manually`);
        return `null /* TODO(abap2js): NEW ${commentSafe(typeName)} */`;
      }
      if (typeName) {
        if (/^z2ui5_/.test(typeName)) ctx.requires?.add(typeName);
        return `new ${typeName}(${txArgs(inner, ctx, typeName)})`;
      }
      // NEW #( ) — only resolvable for the factory pattern (returning own class)
      const ret = ctx.method?.def?.returning;
      if (ret && ret.typeTokens.join(" ").toUpperCase().includes("REF TO")) {
        const cls = ret.typeTokens[ret.typeTokens.length - 1].toLowerCase();
        if (cls === ctx.model.name) return `new ${ctx.model.name}(${txArgs(inner, ctx, cls)})`;
        if (/^z2ui5_/.test(cls)) {
          ctx.requires?.add(cls);
          return `new ${cls}(${txArgs(inner, ctx, cls)})`;
        }
      }
      ctx.todos?.push(`NEW #( ) — target type unknown, resolve manually`);
      return `/* TODO(abap2js): NEW #( ) */ null`;
    }
    case "VALUE": {
      if (inner.length === 0) return "{}";
      // VALUE #( BASE tab ( row ) ... ) → [...tab, row, ...] /
      // VALUE #( BASE struct comp = x ) → { ...struct, comp: x }
      if (KW(inner[0]?.str) === "BASE" && inner[1] && !isParenL(inner[1])) {
        let k = 1;
        let depth = 0;
        while (k < inner.length && !(depth === 0 && (isRowParen(inner[k]) || looksLikeKey(inner, k)))) {
          depth += depthDelta(inner[k]);
          k++;
        }
        const baseExpr = txExpr(inner.slice(1, k), ctx);
        const rest = inner.slice(k);
        if (!rest.length) return `(${baseExpr})`;
        const restRendered = txConstructor("VALUE", null, rest, ctx);
        if (restRendered.startsWith("[")) return `[...(${baseExpr} ?? []),${restRendered.slice(1)}`;
        if (restRendered.startsWith("{")) return `{ ...${baseExpr},${restRendered.slice(1)}`;
        return restRendered;
      }
      // table-expression fallbacks: VALUE #( tab[ ... ] OPTIONAL / DEFAULT x )
      const optIdx = findTopWord(inner, "OPTIONAL");
      if (optIdx > 0 && optIdx === inner.length - 1) {
        return `(() => { try { return ${txExpr(inner.slice(0, optIdx), ctx)} ?? null; } catch { return null; } })()`;
      }
      const defIdx = findTopWord(inner, "DEFAULT");
      if (defIdx > 0 && inner[defIdx + 1]?.str !== "=") {
        const dflt = txExpr(inner.slice(defIdx + 1), ctx);
        return `(() => { try { return ${txExpr(inner.slice(0, defIdx), ctx)} ?? ${dflt}; } catch { return ${dflt}; } })()`;
      }
      if (isId(inner[0]) && KW(inner[0].str) === "FOR") {
        const rendered = txValueFor(inner, ctx);
        if (rendered) return rendered;
      }
      if (inner.some((t, k) => isId(t) && (KW(t.str) === "FOR" || (KW(t.str) === "BASE" && isParenL(inner[k + 1] ?? { type: "" })) || (KW(t.str) === "LINES" && KW(inner[k + 1]?.str ?? "") === "OF")))) {
        ctx.todos?.push(`VALUE #( FOR/BASE/LINES OF ... ) not supported — rewrite manually`);
        return `/* TODO(abap2js): VALUE FOR/BASE */ []`;
      }
      // table rows — a standalone top-level paren group (not a call, not a
      // pair value) is a row; `comp = x` pairs before rows set defaults:
      // VALUE #( a = 1 ( b = 2 ) ( b = 3 ) ) → [{a:1,b:2}, {a:1,b:3}]
      let hasRow = false;
      {
        let d = 0;
        let prevEq = false;
        for (const t of inner) {
          if (d === 0 && isRowParen(t) && !prevEq) {
            hasRow = true;
            break;
          }
          if (d === 0) prevEq = t.str === "=";
          d += depthDelta(t);
        }
      }
      if (hasRow) {
        const rows = [];
        let defaults = new Map();
        let i = 0;
        while (i < inner.length) {
          if (isParenL(inner[i])) {
            const close = matchGroup(inner, i);
            const rowToks = inner.slice(i + 1, close);
            const named = rowToks.length ? namedArgsOf(rowToks, ctx) ?? null : new Map();
            if (named) {
              rows.push(renderNamedVal(new Map([...defaults, ...named])));
            } else {
              rows.push(txExpr(rowToks, ctx));
            }
            i = close + 1;
            continue;
          }
          // consume one `key = value` default pair (value may hold groups)
          let j = i;
          while (j < inner.length && inner[j].str !== "=") j++;
          j++; // first value token
          let depth = 0;
          let consumed = 0;
          while (j < inner.length) {
            const t = inner[j];
            if (depth === 0 && consumed > 0 && (isRowParen(t) || (isId(t) && !isOperatorWord(KW(t.str))) && looksLikeKey(inner, j))) break;
            depth += depthDelta(t);
            consumed++;
            j++;
          }
          const named = namedArgsOf(inner.slice(i, j), ctx);
          if (!named) return `(${txExpr(inner, ctx)})`;
          defaults = new Map([...defaults, ...named]);
          i = j;
        }
        return `[${rows.join(", ")}]`;
      }
      const named = namedArgsOf(inner, ctx);
      if (named) return renderNamedVal(named);
      return `(${txExpr(inner, ctx)})`;
    }
    case "COND":
    case "SWITCH": {
      // WHEN c THEN v [WHEN ...] [ELSE d]
      const parts = [];
      let elseExpr = "null";
      let i = 0;
      const isSwitch = kind === "SWITCH";
      let switchSubject = null;
      if (isSwitch) {
        const whenIdx = topIndexOfWord(inner, "WHEN");
        switchSubject = txExpr(inner.slice(0, whenIdx), ctx);
        i = whenIdx;
      }
      while (i < inner.length) {
        const up = KW(inner[i].str);
        if (up === "WHEN") {
          const thenIdx = topIndexOfWord(inner, "THEN", i);
          const nextWhen = topIndexOfWord(inner, "WHEN", thenIdx);
          const elseIdx = topIndexOfWord(inner, "ELSE", thenIdx);
          const end = Math.min(nextWhen < 0 ? inner.length : nextWhen, elseIdx < 0 ? inner.length : elseIdx);
          const cond = isSwitch ? `${switchSubject} === ${txExpr(inner.slice(i + 1, thenIdx), ctx)}` : txCond(inner.slice(i + 1, thenIdx), ctx);
          parts.push({ cond, val: txExpr(inner.slice(thenIdx + 1, end), ctx) });
          i = end;
          continue;
        }
        if (up === "ELSE") {
          elseExpr = txExpr(inner.slice(i + 1), ctx);
          break;
        }
        i++;
      }
      let out = elseExpr;
      for (let k = parts.length - 1; k >= 0; k--) out = `${parts[k].cond} ? ${parts[k].val} : ${out}`;
      return `(${out})`;
    }
    case "CONV":
    case "EXACT":
    case "CAST": // duck typing — the runtime check happens at call time anyway
      return `(${txExpr(inner, ctx)})`;
    case "REF":
      return `(${txExpr(inner, ctx)})`;
    case "CORRESPONDING": {
      // CORRESPONDING #( BASE ( x ) y ) → ({ ...x, ...y })
      if (inner.length && KW(inner[0].str) === "BASE" && isParenL(inner[1])) {
        const close = matchGroup(inner, 1);
        const baseExpr = txExpr(inner.slice(2, close), ctx);
        const rest = inner.slice(close + 1);
        return rest.length ? `({ ...${baseExpr}, ...${txExpr(rest, ctx)} })` : `({ ...${baseExpr} })`;
      }
      return `({ ...${txExpr(inner, ctx)} })`;
    }
    default:
      ctx.todos?.push(`${kind} #( ) not supported`);
      return `/* TODO(abap2js): ${kind} */ null`;
  }
}

/** standalone paren (whitespace before) — a VALUE row, not a call group */
/**
 * VALUE #( FOR ... ) table comprehensions. Two supported forms:
 *
 *   FOR i = start [THEN expr] UNTIL|WHILE cond ( row ) ...
 *   FOR row IN tab [INDEX INTO idx] [WHERE ( cond )] ( row ) ...
 *
 * Renders an IIFE that accumulates the row groups per iteration. Returns
 * null for shapes outside this subset (nested FOR, LET, FROM/TO, GROUPS) —
 * the caller then falls back to the TODO comment.
 */
function txValueFor(inner, ctx) {
  const varTok = inner[1];
  if (!varTok || !isId(varTok) || !/^[a-z_]\w*$/i.test(varTok.str)) return null;
  const varName = varTok.str.toLowerCase();

  // Locate where the row groups begin — the first standalone top-level paren
  // that does not belong to a WHERE ( ... ) clause.
  let rowsStart = -1;
  {
    let k = 2;
    let d = 0;
    while (k < inner.length) {
      const t = inner[k];
      if (d === 0 && isId(t) && KW(t.str) === "WHERE" && isParenL(inner[k + 1] ?? { type: "" })) {
        k = matchGroup(inner, k + 1) + 1;
        continue;
      }
      if (d === 0 && isRowParen(t)) {
        rowsStart = k;
        break;
      }
      d += depthDelta(t);
      k++;
    }
  }
  if (rowsStart < 0) return null;

  const head = inner.slice(2, rowsStart);
  const rest = inner.slice(rowsStart);
  // unsupported shapes inside this comprehension
  const UNSUPPORTED = new Set(["LET", "GROUPS", "FROM", "TO", "STEP"]);
  if (head.some((t) => isId(t) && UNSUPPORTED.has(KW(t.str)))) return null;
  {
    let d = 0;
    for (const t of rest) {
      if (d === 0 && isId(t) && KW(t.str) === "FOR") return null; // nested FOR
      d += depthDelta(t);
    }
  }

  const addedLocal = !ctx.locals.has(varName);
  if (addedLocal) ctx.locals.add(varName);
  const done = (result) => {
    if (addedLocal) ctx.locals.delete(varName);
    return result;
  };

  // Row groups render exactly like a plain VALUE row list. Rendered lazily —
  // AFTER all comprehension locals (loop var, INDEX INTO var) are registered,
  // so row expressions referencing them resolve as locals, not `this.` fields.
  const renderRows = () => {
    const rendered = txConstructor("VALUE", null, rest, ctx);
    return rendered.startsWith("[") ? rendered : null;
  };

  if (head[0]?.str === "=") {
    // FOR i = start [THEN expr] UNTIL|WHILE cond
    const thenIdx = findTopWord(head, "THEN");
    const untilIdx = findTopWord(head, "UNTIL");
    const whileIdx = findTopWord(head, "WHILE");
    const condKw = untilIdx >= 0 ? untilIdx : whileIdx;
    if (condKw < 1) return done(null);
    const startExpr = txExpr(head.slice(1, thenIdx >= 0 ? thenIdx : condKw), ctx);
    const stepExpr = thenIdx >= 0 ? txExpr(head.slice(thenIdx + 1, condKw), ctx) : `${varName} + 1`;
    const cond = txCond(head.slice(condKw + 1), ctx);
    const test = untilIdx >= 0 ? `!(${cond})` : `(${cond})`;
    const rowsRendered = renderRows();
    if (!rowsRendered) return done(null);
    return done(
      `(() => { const __out = []; let __guard = 0; for (let ${varName} = ${startExpr}; ${test}; ${varName} = ${stepExpr}) { if (++__guard > 1000000) throw new Error(\`VALUE FOR: loop guard exceeded\`); __out.push(...${rowsRendered}); } return __out; })()`
    );
  }

  if (isId(head[0]) && KW(head[0].str) === "IN") {
    // FOR row IN tab [INDEX INTO idx] [WHERE ( cond )]
    const idxKw = findTopWord(head, "INDEX");
    const whereKw = findTopWord(head, "WHERE");
    let tabEnd = head.length;
    if (idxKw > 0) tabEnd = Math.min(tabEnd, idxKw);
    if (whereKw > 0) tabEnd = Math.min(tabEnd, whereKw);
    const tabExpr = txExpr(head.slice(1, tabEnd), ctx);

    let idxVar = null;
    if (idxKw > 0) {
      if (KW(head[idxKw + 1]?.str ?? "") !== "INTO" || !isId(head[idxKw + 2] ?? { type: "" })) return done(null);
      idxVar = head[idxKw + 2].str.toLowerCase();
      if (!ctx.locals.has(idxVar)) ctx.locals.add(idxVar);
    }
    let whereCond = null;
    if (whereKw > 0) {
      whereCond = txWhere(head.slice(whereKw + 1), varName, ctx);
    }

    const idxDecl = idxVar ? `let ${idxVar} = 0; ` : ``;
    const idxInc = idxVar ? `${idxVar} += 1; ` : ``;
    const whereGuard = whereCond ? `if (!(${whereCond})) continue; ` : ``;
    const rowsRendered = renderRows();
    if (!rowsRendered) return done(null);
    return done(
      `(() => { const __out = []; ${idxDecl}for (const ${varName} of (${tabExpr} ?? [])) { ${idxInc}${whereGuard}__out.push(...${rowsRendered}); } return __out; })()`
    );
  }

  return done(null);
}

function isRowParen(t) {
  return t.type === "WParenLeft" || t.type === "WParenLeftW";
}

/** id [(- id)*] directly followed by "=" at toks[k] */
function looksLikeKey(toks, k) {
  if (!isId(toks[k])) return false;
  k++;
  while (isDash(toks[k] ?? { type: "" }) && isId(toks[k + 1] ?? { type: "" })) k += 2;
  return toks[k]?.str === "=";
}

function topIndexOfWord(toks, word, from = 0) {
  let depth = 0;
  for (let i = from; i < toks.length; i++) {
    depth += depthDelta(toks[i]);
    if (depth === 0 && isId(toks[i]) && KW(toks[i].str) === word && depthDelta(toks[i]) === 0) {
      if (i >= from && i !== from) return i;
      if (i === from && from === 0) return i;
    }
  }
  return -1;
}

/** Pass B: operator mapping over atoms */
function joinAtoms(atoms, ctx) {
  const out = [];
  for (let i = 0; i < atoms.length; i++) {
    const a = atoms[i];
    if (a.kind === "expr") {
      out.push(a.str);
      continue;
    }
    const up = a.up;
    const next = atoms[i + 1];
    const nextUp = next?.kind === "op" ? next.up : null;

    if (up === "IS") {
      // <expr> IS [NOT] INITIAL/BOUND/SUPPLIED
      const negated = nextUp === "NOT";
      const what = negated ? atoms[i + 2] : atoms[i + 1];
      const operand = out.pop();
      const w = what?.kind === "op" ? what.up : KW(what?.str ?? "");
      let cond;
      if (w === "INITIAL") cond = `!${wrap(operand)}`;
      else if (w === "BOUND") cond = `${wrap(operand)} != null`;
      else if (w === "SUPPLIED") cond = `${wrap(operand)} !== undefined`;
      else if (w === "ASSIGNED") cond = `${wrap(operand)} != null`;
      else if (w === "INSTANCE") {
        // IS INSTANCE OF cls
        const cls = atoms[i + (negated ? 4 : 3)];
        cond = `${wrap(operand)} instanceof ${cls.str}`;
        i += 2;
      } else cond = `${wrap(operand)} /* TODO(abap2js): IS ${w} */`;
      if (w === "BOUND" && negated) cond = `${wrap(operand)} == null`;
      else if (w === "INITIAL" && negated) cond = `${wrap(operand)}` === operand ? `${wrap(operand)}` : cond;
      if (negated) {
        if (w === "INITIAL") cond = `${wrap(operand)}`;
        else if (w === "BOUND") cond = `${wrap(operand)} == null` === cond ? cond : `!(${cond})`;
        else if (w !== "INSTANCE") cond = `!(${cond})`;
      }
      // careful: NOT BOUND swap
      if (negated && w === "BOUND") cond = `${wrap(operand)} != null`;
      if (!negated && w === "BOUND") cond = `${wrap(operand)} != null`;
      if (negated && w === "BOUND") cond = `${wrap(operand)} != null`;
      out.push(cond);
      i += negated ? 2 : 1;
      continue;
    }
    switch (up) {
      case "=":
      case "EQ":
      case "<>":
      case "NE": {
        const eq = up === "=" || up === "EQ";
        // abap_bool comparisons need truthiness semantics, not identity:
        // depending on origin the value is true/false (JS literals), `X`/``
        // (ABAP char1 convention) or unset (row field never initialized), so
        // `selkz = abap_false` must match ``/undefined too. abap_true/false
        // render as bare true/false literals — no other source produces them.
        const rhsAtom = atoms[i + 1];
        const lhsStr = out.length ? out[out.length - 1] : null;
        const isBoolLit = (s) => s === "true" || s === "false";
        if (rhsAtom?.kind === "expr" && lhsStr !== null && (isBoolLit(rhsAtom.str) || isBoolLit(lhsStr))) {
          out.pop();
          const [expr, lit] = isBoolLit(rhsAtom.str) ? [lhsStr, rhsAtom.str] : [rhsAtom.str, lhsStr];
          const truthy = `(${wrap(expr)} === true || ${wrap(expr)} === \`X\`)`;
          out.push((lit === "true") === eq ? truthy : `!${truthy}`);
          i++;
        } else {
          out.push(eq ? "===" : "!==");
        }
        break;
      }
      case ">":
      case "GT":
        out.push(">");
        break;
      case "<":
      case "LT":
        out.push("<");
        break;
      case ">=":
      case "GE":
        out.push(">=");
        break;
      case "<=":
      case "LE":
        out.push("<=");
        break;
      case "AND":
        out.push("&&");
        break;
      case "OR":
        out.push("||");
        break;
      case "NOT": {
        // NOT <expr> <compare-op> ... — the comparison binds tighter than NOT
        // postfix form: <expr> NOT IN ... — lhs is already on the out stack
        const operand = atoms[i + 1];
        const after = atoms[i + 2];
        if (operand?.kind === "op" && COMPARE_WORDS.has(operand.up)) {
          const lhs = out.pop() ?? "undefined";
          const r = renderCompare(operand.up, lhs, atoms, i + 1, ctx);
          out.push(`!(${r.str})`);
          i = r.last;
        } else if (operand?.kind === "expr" && after?.kind === "op" && COMPARE_WORDS.has(after.up)) {
          const r = renderCompare(after.up, operand.str, atoms, i + 2, ctx);
          out.push(`!(${r.str})`);
          i = r.last;
        } else if (operand?.kind === "expr") {
          out.push(`!${wrap(operand.str)}`);
          i++;
        } else out.push("!");
        break;
      }
      case "&&":
      case "&":
        out.push("+");
        break;
      case "MOD":
        out.push("%");
        break;
      case "DIV": {
        const lhs = out.pop() ?? "0";
        const rhs = atoms[i + 1];
        ctx.requires?.add("z2ui5_cl_util");
        out.push(`Math.trunc(z2ui5_cl_util.abap_div(${wrap(lhs)}, ${wrap(rhs?.str ?? "1")}))`);
        i++;
        break;
      }
      case "/": {
        // ABAP raises CX_SY_ZERO_DIVIDE on division by zero (0 / 0 is 0);
        // plain JS `/` would silently yield Infinity/NaN. Route through the
        // runtime helper when both operands are proper expressions.
        const rhs = atoms[i + 1];
        const lhs = out.length ? out[out.length - 1] : null;
        if (rhs?.kind === "expr" && lhs && !/^[+\-*/%&|!<>=]+$/.test(lhs)) {
          out.pop();
          ctx.requires?.add("z2ui5_cl_util");
          out.push(`z2ui5_cl_util.abap_div(${wrap(lhs)}, ${wrap(rhs.str)})`);
          i++;
        } else {
          out.push(a.str);
        }
        break;
      }
      case "CS":
      case "CP":
      case "NS":
      case "NP":
      case "CO":
      case "CN":
      case "CA":
      case "NA":
      case "IN":
      case "BETWEEN": {
        const lhs = out.pop() ?? "undefined";
        const r = renderCompare(up, lhs, atoms, i, ctx);
        out.push(r.str);
        i = r.last;
        break;
      }
      default:
        out.push(a.str);
    }
  }
  return out.join(" ").replace(/\s+/g, " ").trim();
}

const COMPARE_WORDS = new Set(["CS", "CP", "NS", "NP", "CO", "CN", "CA", "NA", "IN", "BETWEEN"]);

/**
 * ABAP string/range comparison operators — lhs is already rendered, the
 * operator sits at atoms[opIdx]. Returns the rendered condition and the
 * index of the last consumed atom.
 */
function renderCompare(op, lhs, atoms, opIdx, ctx) {
  const rhsAtom = atoms[opIdx + 1];
  if (!rhsAtom || rhsAtom.kind !== "expr") {
    ctx.todos?.push(`${op} comparison without operand — rewrite manually`);
    return { str: `false /* TODO(abap2js): ${op} */`, last: opIdx };
  }
  const rhs = rhsAtom.str;
  switch (op) {
    case "CS":
      return { str: `String(${lhs}).toLowerCase().includes(String(${rhs}).toLowerCase())`, last: opIdx + 1 };
    case "NS":
      return { str: `!String(${lhs}).toLowerCase().includes(String(${rhs}).toLowerCase())`, last: opIdx + 1 };
    case "CP":
      ctx.todos?.push(`CP pattern match approximated with includes()`);
      return { str: `String(${lhs}).includes(String(${rhs}).replace(/\\*/g, ""))`, last: opIdx + 1 };
    case "NP":
      ctx.todos?.push(`NP pattern match approximated with includes()`);
      return { str: `!String(${lhs}).includes(String(${rhs}).replace(/\\*/g, ""))`, last: opIdx + 1 };
    case "CO":
      return { str: `[...String(${lhs})].every(($c) => String(${rhs}).includes($c))`, last: opIdx + 1 };
    case "CN":
      return { str: `![...String(${lhs})].every(($c) => String(${rhs}).includes($c))`, last: opIdx + 1 };
    case "CA":
      return { str: `[...String(${lhs})].some(($c) => String(${rhs}).includes($c))`, last: opIdx + 1 };
    case "NA":
      return { str: `![...String(${lhs})].some(($c) => String(${rhs}).includes($c))`, last: opIdx + 1 };
    case "IN":
      // range table check (sign/option approximated: I/EQ, BT, CP, NE)
      ctx.todos?.push(`IN range-table check approximated (sign E ignored)`);
      return {
        str: `(($v, $r) => !$r || !$r.length || $r.some(($x) => ($x.option === \`BT\` ? $v >= $x.low && $v <= $x.high : $x.option === \`NE\` ? $v !== $x.low : $x.option === \`CP\` ? String($v).includes(String($x.low).replace(/\\*/g, "")) : $v === $x.low)))(${lhs}, ${rhs})`,
        last: opIdx + 1,
      };
    case "BETWEEN": {
      const andAtom = atoms[opIdx + 2];
      const highAtom = atoms[opIdx + 3];
      if (!andAtom || andAtom.up !== "AND" || !highAtom || highAtom.kind !== "expr") {
        ctx.todos?.push(`BETWEEN without AND bound — rewrite manually`);
        return { str: `false /* TODO(abap2js): BETWEEN */`, last: opIdx + 1 };
      }
      return { str: `${wrap(lhs)} >= ${rhs} && ${wrap(lhs)} <= ${highAtom.str}`, last: opIdx + 3 };
    }
    default:
      return { str: `false /* TODO(abap2js): ${op} */`, last: opIdx };
  }
}

function wrap(s) {
  return /^[a-zA-Z0-9_$.`]+$/.test(s) || /^[a-zA-Z0-9_$.]+\(.*\)$/.test(s) ? s : `(${s})`;
}

// ---------------------------------------------------------------------------
// statement transpiler
// ---------------------------------------------------------------------------

function transpileClass(source, filename) {
  const reg = new Registry().addFile(new MemoryFile(filename, source));
  reg.parse();
  const obj = reg.getFirstObject();
  if (!obj) throw new Error(`no ABAP object parsed from ${filename}`);
  const file = obj.getABAPFiles()[0];
  const model = buildModel(file);
  if (!model) throw new Error(`no class found in ${filename}`);

  const requires = new Set();
  const todos = [];
  const lines = [];

  // interface z2ui5_if_app → extends (the JS base class provides factory glue)
  const base = model.superclass ?? (model.interfaces.includes("z2ui5_if_app") ? "z2ui5_if_app" : null);
  if (base) requires.add(base);

  lines.push(`class ${model.name}${base ? ` extends ${base}` : ""} {`);

  // fields
  const instanceFields = [...model.fields.entries()].filter(([, f]) => !f.isStatic);
  const staticFields = [...model.fields.entries()].filter(([, f]) => f.isStatic);
  for (const [name, f] of staticFields) lines.push(`  static ${name} = ${f.default};`);
  for (const [name, members] of model.structConsts) {
    lines.push(`  static ${name} = { ${members.map((m) => `${m.name}: ${m.value ?? m.default}`).join(", ")} };`);
  }
  if (staticFields.length || model.structConsts.size) lines.push("");
  for (const [name, f] of instanceFields) lines.push(`  ${name} = ${f.default};`);
  if (instanceFields.length) lines.push("");

  // methods
  for (const body of model.methodBodies) {
    emitMethod(model, body, lines, requires, todos);
    lines.push("");
  }
  while (lines[lines.length - 1] === "") lines.pop();
  lines.push(`}`);
  lines.push("");
  lines.push(`module.exports = ${model.name};`);

  // requires header
  const header = [];
  for (const req of [...requires].sort()) {
    if (req === model.name) continue;
    if (!/^[a-z_][a-z0-9_]*$/.test(req)) {
      todos.push(`unresolvable reference skipped: ${req}`);
      continue;
    }
    const p = requirePathFor(req);
    if (p) header.push(`const ${req} = require("${p}");`);
    else if (req === base) {
      // an unresolved superclass would throw at load time — stub it
      header.push(`const ${req} = class {}; // TODO(abap2js): unresolved superclass — replace stub manually`);
      todos.push(`unresolved superclass stubbed: ${req}`);
    } else {
      header.push(`// TODO(abap2js): unresolved reference ${req} — add require manually`);
      todos.push(`unresolved class reference: ${req}`);
    }
  }
  header.push("");

  return { code: header.join("\n") + "\n" + lines.join("\n") + "\n", todos, name: model.name };
}

function emitMethod(model, body, lines, requires, todos) {
  const lname = body.name;
  const isIntfMain = /~main$/.test(lname);
  const plainName = lname.replace(/^.*~/, "");
  const def = model.methods.get(lname) ?? model.methods.get(plainName) ?? { isStatic: false, importing: [], returning: null };
  const ctx = new Ctx(model, { name: plainName, def });
  ctx.requires = requires;
  ctx.todos = todos;

  // find reassigned locals to pick const/let; inline declarations inside a
  // nested block are hoisted to the method top (ABAP DATA(x) is
  // method-scoped, a JS let/const at the site would be block-scoped)
  const assignedTwice = new Set();
  const declared = new Set();
  const hoisted = new Set();
  {
    const OPEN = new Set(["If", "Case", "Loop", "Do", "While", "Try"]);
    const CLOSE = new Set(["EndIf", "EndCase", "EndLoop", "EndDo", "EndWhile", "EndTry"]);
    let depth = 0;
    for (const s of body.statements) {
      if (OPEN.has(s.type)) depth++;
      else if (CLOSE.has(s.type)) depth = Math.max(0, depth - 1);
      if (s.type === "Move") {
        const toks = s.toks;
        if ((KW(toks[0].str) === "DATA" || KW(toks[0].str) === "FINAL") && isParenL(toks[1])) {
          const n = toks[2].str.toLowerCase();
          if (declared.has(n) || depth > 0) hoisted.add(safeIdent(n));
          declared.add(n);
        } else if (isId(toks[0]) && toks[1]?.str === "=" && declared.has(toks[0].str.toLowerCase())) {
          assignedTwice.add(toks[0].str.toLowerCase());
        }
      } else if (s.type === "ReadTable" && depth > 0) {
        const toks = s.toks;
        const intoIdx = findTopWord(toks, "INTO");
        if (intoIdx > 0 && ["DATA", "FINAL"].includes(KW(toks[intoIdx + 1]?.str ?? "")) && isParenL(toks[intoIdx + 2] ?? { type: "" })) {
          hoisted.add(safeIdent(toks[intoIdx + 3].str.toLowerCase()));
        }
      }
    }
  }

  // signature
  let sig;
  if (isIntfMain) {
    sig = `async main(client)`;
    ctx.locals.add("client");
  } else if (def.importing.length) {
    const params = def.importing
      .map((p) => {
        const local = safeIdent(p.name);
        ctx.locals.add(local);
        const bind = local === p.name ? p.name : `${p.name}: ${local}`;
        return p.defaultToks ? `${bind} = ${txExpr(p.defaultToks, ctx)}` : bind;
      })
      .join(", ");
    sig = `${def.isStatic ? "static " : ""}${plainName}({ ${params} } = {})`;
  } else {
    sig = `${def.isStatic ? "static " : ""}${plainName}()`;
  }
  lines.push(`  ${sig} {`);

  const st = { indent: 2, caseStack: [], loopStack: [], tabixSeq: 0, caughtSeq: 0 };

  // annotate multi-CATCH try blocks — JS allows only one catch clause, so
  // additional CATCHes become an instanceof if/else chain
  {
    const tryStack = [];
    for (const s of body.statements) {
      if (s.type === "Try") tryStack.push({ catches: 0 });
      else if (s.type === "Catch" && tryStack.length) {
        const t = tryStack[tryStack.length - 1];
        t.catches++;
        s._catch = { ordinal: t.catches, tryInfo: t };
      } else if (s.type === "EndTry" && tryStack.length) {
        s._endTry = tryStack.pop();
      }
    }
  }
  const push = (s) => lines.push("  ".repeat(st.indent) + s);

  if (def.returning) {
    ctx.locals.add(def.returning.name);
    push(`let ${def.returning.name} = ${typeDefault(def.returning.typeTokens)};`);
  }

  // one declaration per method — LOOPs reset/save/restore it (nested loops
  // in the same block must not redeclare)
  if (body.statements.some((x) => x.type === "Loop")) {
    ctx.locals.add("sy_tabix");
    push(`let sy_tabix = 0;`);
  }

  // sy-subrc — declared once per method when read anywhere or set by a
  // supported statement (ASSIGN / READ TABLE)
  if (body.statements.some((x) => x.type === "Assign" || x.type === "ReadTable" || /\bsy-subrc\b/i.test(x.src))) {
    ctx.locals.add("sy_subrc");
    push(`let sy_subrc = 0;`);
  }

  // field symbols are method-scoped in ABAP while the ASSIGN sites may sit in
  // nested blocks — hoist every target to the method top. Each gets a shadow
  // var holding its { o, k } write-back target so plain `<fs> = val` writes
  // propagate into the assigned structure component / table line.
  for (const name of collectFsTargets(body.statements)) {
    if (ctx.locals.has(name)) continue;
    ctx.locals.add(name);
    ctx.fsBacked.set(name, `_fs$${name}`);
    push(`let ${name} = null;`);
    push(`let _fs$${name} = null;`);
  }

  // inline DATA(x) declarations that sit inside nested blocks — hoist to the
  // method top, the declaration sites then assign only
  ctx.hoisted = hoisted;
  for (const name of hoisted) {
    if (ctx.locals.has(name)) continue;
    ctx.locals.add(name);
    push(`let ${name};`);
  }

  for (const s of body.statements) {
    emitStatement(s, ctx, st, push, assignedTwice, def);
  }

  if (def.returning) push(`return ${def.returning.name};`);
  lines.push(`  }`);
}

/** field-symbol names a method body declares or assigns to (FIELD-SYMBOLS,
 *  ASSIGN ... TO, READ TABLE ... ASSIGNING, UNASSIGN) */
function collectFsTargets(statements) {
  const names = new Set();
  const grab = (tok) => {
    if (tok && /^<\w+>$/.test(tok.str)) names.add(fsIdent(tok.str));
  };
  for (const s of statements) {
    if (s.type === "FieldSymbol" || s.type === "Unassign") {
      grab(s.toks[1]);
    } else if (s.type === "Assign" || s.type === "ReadTable") {
      for (let i = 0; i < s.toks.length; i++) {
        const up = KW(s.toks[i].str);
        if (up === "TO" || up === "ASSIGNING") {
          // TO <x> | TO FIELD-SYMBOL( <x> ) — FIELD-SYMBOL lexes as 3 tokens
          for (let j = i + 1; j < Math.min(i + 7, s.toks.length); j++) {
            if (/^<\w+>$/.test(s.toks[j].str)) {
              grab(s.toks[j]);
              break;
            }
          }
        }
      }
    }
  }
  return names;
}

function emitStatement(s, ctx, st, push, assignedTwice, methodDef) {
  const T = s.type;
  const toks = s.toks.slice(0, -1); // drop trailing "."
  const todo = () => {
    ctx.todos.push(`unsupported statement: ${s.src.slice(0, 120)}`);
    push(`// TODO(abap2js): ${s.src}`);
  };

  switch (T) {
    case "Data": {
      // DATA x TYPE t.
      const name = safeIdent(toks[1].str.toLowerCase());
      ctx.locals.add(name);
      const { typeTokens } = parseTypeAfter(toks.slice(2), 0);
      push(`let ${name} = ${typeDefault(typeTokens)};`);
      break;
    }
    case "Constant": {
      // method-local CONSTANTS c_x TYPE t VALUE lit.
      const name = safeIdent(toks[1].str.toLowerCase());
      ctx.locals.add(name);
      const { typeTokens, value } = parseTypeAfter(toks.slice(2), 0);
      const rendered = value ? renderLiteralToken(value) : null;
      push(`const ${name} = ${rendered ?? typeDefault(typeTokens)};`);
      break;
    }
    case "FieldSymbol":
      // FIELD-SYMBOLS <x> TYPE t. — already hoisted to the method top
      break;
    case "Type":
    case "TypeBegin":
    case "TypeEnd":
      // method-local TYPES (incl. BEGIN OF ... END OF): pure type declarations
      // carry no runtime meaning in JS — references resolve structurally, so
      // the declaration is simply dropped.
      break;
    case "Unassign": {
      const name = fsIdent(toks[1].str);
      push(`${name} = null;`);
      const shadow = ctx.fsBacked.get(name);
      if (shadow) push(`${shadow} = null;`);
      break;
    }
    case "Assign": {
      // ASSIGN COMPONENT c OF STRUCTURE s TO <x>. | ASSIGN src TO <x>.
      const toIdx = findTopWord(toks, "TO");
      if (toIdx < 0) return todo();
      // TO <x> | TO FIELD-SYMBOL( <x> ) — FIELD-SYMBOL lexes as FIELD - SYMBOL
      let fsAt = toIdx + 1;
      if (KW(toks[fsAt]?.str ?? "") === "FIELD" && isDash(toks[fsAt + 1] ?? { type: "" })) fsAt = toIdx + 5;
      const fsTok = toks[fsAt];
      if (!fsTok || !/^<\w+>$/.test(fsTok.str)) return todo();
      // trailing options: ELSE UNASSIGN matches our null handling, the rest
      // (CASTING, dynamic pieces) has no JS mapping
      const trailing = toks.slice(fsAt + (fsAt === toIdx + 5 ? 2 : 1));
      if (trailing.length && !(KW(trailing[0].str) === "ELSE" && KW(trailing[1]?.str ?? "") === "UNASSIGN")) return todo();
      const name = fsIdent(fsTok.str);
      const shadow = ctx.fsBacked.get(name);
      if (KW(toks[1].str) === "COMPONENT") {
        // component by name (ABAP-uppercase -> JS-lowercase keys) or by index
        const ofIdx = findTopWord(toks, "OF");
        if (ofIdx < 0 || KW(toks[ofIdx + 1].str) !== "STRUCTURE") return todo();
        const comp = txExpr(toks.slice(2, ofIdx), ctx);
        const struct = txExpr(toks.slice(ofIdx + 2, toIdx), ctx);
        push(`${shadow} = ((_o, _c) => { if (_o == null) return null; const _k = typeof _c === "number" ? Object.keys(_o)[_c - 1] : String(_c).toLowerCase(); return _k != null && _k in _o ? { o: _o, k: _k } : null; })(${struct}, ${comp});`);
        push(`${name} = ${shadow} ? ${shadow}.o[${shadow}.k] : null;`);
        push(`sy_subrc = ${shadow} ? 0 : 4;`);
      } else {
        // dynamic access (ref->*, obj->('NAME'), (name)) has no JS mapping
        const srcToks = toks.slice(1, toIdx);
        if (isParenL(srcToks[0])) return todo();
        for (let k = 0; k < srcToks.length; k++) {
          if (srcToks[k].str === "->*" || (srcToks[k].str === "->" && (srcToks[k + 1]?.str === "*" || isParenL(srcToks[k + 1] ?? { type: "" })))) return todo();
        }
        const src = txExpr(srcToks, ctx);
        const m = src.match(/^(.+)\.([A-Za-z_$][\w$]*)$/);
        push(`${name} = ${src};`);
        push(`${shadow} = ${m ? `{ o: ${m[1]}, k: \`${m[2]}\` }` : "null"};`);
        push(`sy_subrc = 0;`);
      }
      break;
    }
    case "ReadTable": {
      // READ TABLE tab [WITH [TABLE] KEY c = v ...] [INDEX n]
      //   [INTO [DATA(]x[)] | REFERENCE INTO [DATA(]x[)]
      //    | ASSIGNING [FIELD-SYMBOL(]<x>[)] | TRANSPORTING NO FIELDS].
      const intoIdx = findTopWord(toks, "INTO");
      const asgIdx = findTopWord(toks, "ASSIGNING");
      const withIdx = findTopWord(toks, "WITH");
      const idxIdx = findTopWord(toks, "INDEX");
      const transIdx = findTopWord(toks, "TRANSPORTING");
      const refIdx = findTopWord(toks, "REFERENCE");
      const stops = [intoIdx, asgIdx, withIdx, idxIdx, transIdx, refIdx].filter((x) => x > 0);
      const tab = txExpr(toks.slice(2, stops.length ? Math.min(...stops) : toks.length), ctx);
      // locator — INDEX n or WITH [TABLE] KEY c1 = v1 c2 = v2 (BINARY SEARCH is a no-op)
      let locator = null;
      if (idxIdx > 0) {
        const end = stops.filter((x) => x > idxIdx).sort((a, b) => a - b)[0] ?? toks.length;
        locator = `(${txExpr(toks.slice(idxIdx + 1, end), ctx)}) - 1`;
      } else if (withIdx > 0) {
        let k = withIdx + 1;
        if (KW(toks[k].str) === "TABLE") k++;
        if (KW(toks[k].str) !== "KEY") return todo();
        k++;
        const conds = [];
        while (k < toks.length) {
          if (!isId(toks[k]) || toks[k + 1]?.str !== "=") break;
          const comp = toks[k].str.toLowerCase();
          // value expr runs until the next `comp =` pair or section keyword
          let end = toks.length;
          let depth = 0;
          for (let j = k + 2; j < toks.length; j++) {
            depth += depthDelta(toks[j]);
            if (depth !== 0) continue;
            const u = KW(toks[j].str);
            if (["INTO", "ASSIGNING", "REFERENCE", "TRANSPORTING", "BINARY", "INDEX"].includes(u) || (isId(toks[j]) && toks[j + 1]?.str === "=")) {
              end = j;
              break;
            }
          }
          const val = txExpr(toks.slice(k + 2, end), ctx);
          conds.push(comp === "table_line" ? `_r === ${val}` : `_r.${comp} === ${val}`);
          k = end;
        }
        if (!conds.length) return todo();
        locator = `_t.findIndex((_r) => ${conds.join(" && ")})`;
      } else {
        return todo();
      }
      // target
      let target = null; // { name, isFs }
      if (asgIdx > 0) {
        let fsAt = asgIdx + 1;
        if (KW(toks[fsAt]?.str ?? "") === "FIELD" && isDash(toks[fsAt + 1] ?? { type: "" })) fsAt = asgIdx + 5;
        if (!toks[fsAt] || !/^<\w+>$/.test(toks[fsAt].str)) return todo();
        target = { name: fsIdent(toks[fsAt].str), isFs: true };
      } else if (intoIdx > 0) {
        let tAt = intoIdx + 1;
        if (["DATA", "FINAL"].includes(KW(toks[tAt]?.str ?? "")) && isParenL(toks[tAt + 1] ?? { type: "" })) {
          const name = safeIdent(toks[tAt + 2].str.toLowerCase());
          if (ctx.hoisted?.has(name)) {
            push(`${name} = {};`);
          } else {
            ctx.locals.add(name);
            push(`let ${name} = {};`);
          }
          target = { name, isFs: false };
        } else {
          const end = stops.filter((x) => x > tAt).sort((a, b) => a - b)[0] ?? toks.length;
          target = { name: txExpr(toks.slice(tAt, end), ctx), isFs: false };
        }
      } else if (transIdx < 0) {
        return todo();
      }
      push(`{`);
      st.indent++;
      push(`const _t = ${tab};`);
      push(`const _i = ${locator};`);
      push(`sy_subrc = _i >= 0 && _i < _t.length ? 0 : 4;`);
      if (target) {
        if (target.isFs) {
          push(`${target.name} = sy_subrc === 0 ? _t[_i] : null;`);
          const shadow = ctx.fsBacked.get(target.name);
          if (shadow) push(`${shadow} = sy_subrc === 0 ? { o: _t, k: _i } : null;`);
        } else {
          push(`if (sy_subrc === 0) ${target.name} = _t[_i];`);
        }
      }
      st.indent--;
      push(`}`);
      break;
    }
    case "Move": {
      // possibly DATA(x) = ... / FINAL(x) = ...
      let i = 0;
      let decl = null;
      if ((KW(toks[0].str) === "DATA" || KW(toks[0].str) === "FINAL") && isParenL(toks[1])) {
        decl = safeIdent(toks[2].str.toLowerCase());
        ctx.locals.add(decl);
        i = 4;
      }
      // split at first top-level "=" (also handles ?=)
      let depth = 0;
      let eq = -1;
      for (let k = i; k < toks.length; k++) {
        depth += depthDelta(toks[k]);
        if (depth === 0 && (toks[k].str === "=" || toks[k].str === "?=") && isId(toks[k]) === false ? false : depth === 0 && (toks[k].str === "=" || toks[k].str === "?=")) {
          eq = k;
          break;
        }
      }
      if (eq < 0) return todo();
      let rhs = txExpr(toks.slice(eq + 1), ctx);
      // vars initialized from client.get() carry UPPERCASE component keys
      if (decl && /(?:^|\.)client\.get\(\)/.test(rhs)) ctx.upperLocals.add(decl);
      // ABAP assignments have VALUE semantics: copying a table/struct variable
      // must not alias it (a later DELETE on the copy would empty the source
      // too). When the RHS is a plain reference into existing data — a bare
      // variable/attribute chain, optionally with index access — route it
      // through the runtime copy helper (class refs pass through unchanged).
      // Constructor expressions / calls already produce fresh values.
      if (/^(this\.)?[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]*\])*$/.test(rhs) && !/^(true|false|null|undefined)$/.test(rhs)) {
        ctx.requires?.add("z2ui5_cl_util");
        rhs = `z2ui5_cl_util.abap_copy(${rhs})`;
      }
      if (decl) {
        const kw = ctx.hoisted?.has(decl) ? "" : `${assignedTwice.has(decl) ? "let" : "const"} `;
        push(`${kw}${decl} = ${rhs};`);
      } else {
        // offset/length writes (lv_x+off(len) = ...) have no JS counterpart
        if (toks.slice(i, eq).some((t) => t.str === "+")) return todo();
        const lhs = txExpr(toks.slice(i, eq), ctx);
        // x = VALUE #( ). resets to the type's INITIAL value — restore the
        // declared component defaults instead of dropping the keys
        let rhs2 = rhs;
        if (rhs === "{}") {
          const f = ctx.model.fields.get(lhs.replace(/^this\./, ""));
          if (f && f.default.startsWith("{")) rhs2 = f.default;
        }
        // A struct copied out of client.get() carries UPPERCASE wire keys,
        // but non-local targets are read with the lowercase naming later on —
        // rebuild the copy with lowercase keys (scalars/class refs pass
        // through struct_lower_keys unchanged).
        if (
          /^\(\{ \.\.\.[^{}]*client\.get\(\)[^{}]*\}\)$/.test(rhs2) ||
          /client\.get\(\)(\.[A-Za-z0-9_]+)+$/.test(rhs2)
        ) {
          ctx.requires?.add("z2ui5_cl_util");
          rhs2 = `z2ui5_cl_util.struct_lower_keys(${rhs2})`;
        }
        push(`${lhs} = ${rhs2};`);
        // writes through a backed field symbol propagate into the structure
        const shadow = ctx.fsBacked.get(lhs);
        if (shadow) push(`if (${shadow}) ${shadow}.o[${shadow}.k] = ${lhs};`);
      }
      break;
    }
    case "Call": {
      // CALL METHOD long form / dynamic invocation cannot be mapped inline
      if (KW(toks[0].str) === "CALL") return todo();
      // out-params on a plain call statement need a rewritten callee —
      // EXPORTING/CHANGING-only calls go through txArgs (merged object)
      if (toks.some((t) => isId(t) && ["IMPORTING", "RECEIVING", "EXCEPTIONS"].includes(KW(t.str)))) return todo();
      push(`${txExpr(toks, ctx)};`);
      break;
    }
    case "CreateObject": {
      // CREATE OBJECT x TYPE (name) — dynamic instantiation resolves through
      // the framework's app-class registry (the same lookup app_start uses).
      // A miss throws, mirroring ABAP's cx_sy_create_object_error.
      const target = txExpr([toks[2]], ctx);
      const typeIdx = toks.findIndex((t) => isId(t) && KW(t.str) === "TYPE");
      if (typeIdx > 0 && isParenL(toks[typeIdx + 1])) {
        const close = matchGroup(toks, typeIdx + 1);
        if (close === toks.length - 1) {
          const nameExpr = txExpr(toks.slice(typeIdx + 2, close), ctx);
          ctx.requires?.add("z2ui5_cl_util");
          push(`${target} = (() => { const _n = String(${nameExpr}); const _c = z2ui5_cl_util.rtti_get_class(_n.toLowerCase()); if (!_c) throw new Error(\`CREATE OBJECT: class \${_n} not found\`); return new _c(); })();`);
          break;
        }
      }
      // static TYPE cls without EXPORTING
      if (typeIdx > 0 && typeIdx === toks.length - 2 && isId(toks[typeIdx + 1])) {
        const cls = toks[typeIdx + 1].str.toLowerCase();
        if (/^z2ui5_/.test(cls)) ctx.requires?.add(cls);
        push(`${target} = new ${safeIdent(cls)}();`);
        break;
      }
      ctx.todos.push(`CREATE OBJECT: ${s.src}`);
      push(`${target} = null; // TODO(abap2js): ${s.src}`);
      break;
    }
    case "If":
      push(`if (${txCond(toks.slice(1), ctx)}) {`);
      st.indent++;
      break;
    case "ElseIf":
      st.indent--;
      push(`} else if (${txCond(toks.slice(1), ctx)}) {`);
      st.indent++;
      break;
    case "Else":
      st.indent--;
      push(`} else {`);
      st.indent++;
      break;
    case "EndIf":
      st.indent--;
      push(`}`);
      break;
    case "Case":
      push(`switch (${txExpr(toks.slice(1), ctx)}) {`);
      st.indent++;
      st.caseStack.push({ open: false });
      break;
    case "WhenOthers":
    case "When": {
      const top = st.caseStack[st.caseStack.length - 1];
      if (top?.open) {
        push(`break;`);
        st.indent--;
      }
      const isOthers = KW(toks[1].str) === "OTHERS";
      if (isOthers) push(`default:`);
      else for (const alt of splitTop(toks.slice(1), (t) => isId(t) && KW(t.str) === "OR")) push(`case ${txExpr(alt, ctx)}:`);
      st.indent++;
      if (top) top.open = true;
      break;
    }
    case "EndCase": {
      const top = st.caseStack.pop();
      if (top?.open) {
        push(`break;`);
        st.indent--;
      }
      st.indent--;
      push(`}`);
      break;
    }
    case "Loop": {
      // LOOP AT tab [INTO DATA(x)|REFERENCE INTO DATA(x)|ASSIGNING FIELD-SYMBOL(<x>)] [WHERE cond].
      const atIdx = toks.findIndex((t) => KW(t.str) === "AT");
      const intoIdx = toks.findIndex((t) => KW(t.str) === "INTO");
      const assignIdx = toks.findIndex((t) => KW(t.str) === "ASSIGNING");
      const whereIdx = toks.findIndex((t) => KW(t.str) === "WHERE");
      const tabEnd = [intoIdx, assignIdx, whereIdx, toks.findIndex((t) => KW(t.str) === "REFERENCE")].filter((x) => x > 0);
      const tabToks = toks.slice(atIdx + 1, tabEnd.length ? Math.min(...tabEnd) : toks.length);
      const tab = txExpr(tabToks, ctx);
      let rowVar = "row";
      if (intoIdx > 0 && toks[intoIdx + 2] && isParenL(toks[intoIdx + 2])) rowVar = varOrFsIdent(toks[intoIdx + 3].str);
      else if (intoIdx > 0) rowVar = varOrFsIdent(toks[intoIdx + 1].str);
      else if (assignIdx > 0) {
        // ASSIGNING <fs> (pre-declared) or ASSIGNING FIELD-SYMBOL(<fs>)
        const fs = /^<\w+>$/.test(toks[assignIdx + 1]?.str ?? "") ? toks[assignIdx + 1].str : (toks[assignIdx + 1 + 2]?.str ?? "fs");
        rowVar = varOrFsIdent(fs);
      }
      ctx.locals.add(rowVar);
      const loopDepth = st.loopStack.filter((l) => l && l.restoreTabix !== undefined).length;
      let restoreTabix = null;
      if (loopDepth > 0) {
        restoreTabix = `_sy_tabix_${++st.tabixSeq}`;
        push(`const ${restoreTabix} = sy_tabix;`);
      }
      push(`sy_tabix = 0;`);
      push(`for (const ${rowVar} of ${tab}) {`);
      st.indent++;
      push(`sy_tabix++;`);
      if (whereIdx > 0) {
        const cond = txWhere(toks.slice(whereIdx + 1), rowVar, ctx);
        push(`if (!(${cond})) continue;`);
      }
      st.loopStack.push({ restoreTabix });
      break;
    }
    case "EndLoop": {
      st.indent--;
      push(`}`);
      const closed = st.loopStack.pop();
      if (closed?.restoreTabix) push(`sy_tabix = ${closed.restoreTabix};`);
      break;
    }
    case "Do": {
      if (toks.length > 1 && KW(toks[toks.length - 1].str) === "TIMES") {
        ctx.locals.add("sy_index");
        push(`for (let sy_index = 1; sy_index <= ${txExpr(toks.slice(1, -1), ctx)}; sy_index++) {`);
      } else {
        // bare DO. — sy-index still counts the passes
        ctx.locals.add("sy_index");
        push(`for (let sy_index = 1; ; sy_index++) {`);
      }
      st.indent++;
      st.loopStack.push("do");
      break;
    }
    case "EndDo":
      st.indent--;
      push(`}`);
      st.loopStack.pop();
      break;
    case "While":
      push(`while (${txCond(toks.slice(1), ctx)}) {`);
      st.indent++;
      st.loopStack.push("while");
      break;
    case "EndWhile":
      st.indent--;
      push(`}`);
      st.loopStack.pop();
      break;
    case "Exit":
      push(st.loopStack.length ? `break;` : methodDef.returning ? `return ${methodDef.returning.name};` : `return;`);
      break;
    case "Continue":
      push(`continue;`);
      break;
    case "Check": {
      const cond = txCond(toks.slice(1), ctx);
      push(st.loopStack.length ? `if (!(${cond})) continue;` : methodDef.returning ? `if (!(${cond})) return ${methodDef.returning.name};` : `if (!(${cond})) return;`);
      break;
    }
    case "Return":
      push(methodDef.returning ? `return ${methodDef.returning.name};` : `return;`);
      break;
    case "Clear": {
      const target = txExpr(toks.slice(1), ctx);
      // best effort by declared default
      const name = toks[1].str.toLowerCase();
      const f = ctx.model.fields.get(name);
      const dflt = f ? f.default : ctx.isLocal(name) ? "null" : "null";
      push(`${target} = ${dflt === "null" && /\.length/.test(target) ? "[]" : dflt};`);
      const shadow = ctx.fsBacked.get(target);
      if (shadow) push(`if (${shadow}) ${shadow}.o[${shadow}.k] = ${target};`);
      break;
    }
    case "Append": {
      // APPEND [INITIAL LINE TO t | LINES OF t1 TO t2 | expr TO t]
      //        [REFERENCE INTO DATA(x) | ASSIGNING FIELD-SYMBOL(<x>)]
      const refIdx = findTopWord(toks, "REFERENCE");
      const asgIdx = findTopWord(toks, "ASSIGNING");
      const end = Math.min(...[refIdx, asgIdx, toks.length].filter((x) => x > 0));
      let refVar = null;
      if (refIdx > 0 || asgIdx > 0) {
        // the target name sits inside the DATA( x ) / FIELD-SYMBOL( <x> ) group
        for (let k = end; k < toks.length; k++) {
          if (isParenL(toks[k])) {
            refVar = varOrFsIdent(toks[k + 1].str);
            break;
          }
        }
        if (refVar) ctx.locals.add(refVar);
      }
      const up1 = KW(toks[1].str);
      if (up1 === "INITIAL") {
        const tab = txExpr(toks.slice(4, end), ctx);
        if (refVar) {
          push(`const ${refVar} = {};`);
          push(`${tab}.push(${refVar});`);
        } else {
          push(`${tab}.push({});`);
        }
      } else if (up1 === "LINES") {
        const toIdx = toks.findIndex((t, k) => k > 2 && KW(t.str) === "TO");
        push(`${txExpr(toks.slice(toIdx + 1, end), ctx)}.push(...${txExpr(toks.slice(3, toIdx), ctx)});`);
      } else {
        const toIdx = findTopWord(toks, "TO");
        if (toIdx < 0) return todo();
        const tab = txExpr(toks.slice(toIdx + 1, end), ctx);
        const val = txExpr(toks.slice(1, toIdx), ctx);
        if (refVar) {
          push(`const ${refVar} = ${val};`);
          push(`${tab}.push(${refVar});`);
        } else {
          push(`${tab}.push(${val});`);
        }
      }
      break;
    }
    case "InsertInternal": {
      // INSERT [LINES OF] expr INTO [TABLE] tab [INDEX n]
      //        [REFERENCE INTO [DATA(]x[)] | ASSIGNING FIELD-SYMBOL(<x>)].
      const intoIdx = findTopWord(toks, "INTO");
      if (intoIdx < 0) return todo();
      const idxIdx = findTopWord(toks, "INDEX");
      const refIdx = findTopWord(toks, "REFERENCE");
      const asgIdx = findTopWord(toks, "ASSIGNING");
      const end = Math.min(...[idxIdx, refIdx, asgIdx, toks.length].filter((x) => x > 0));
      let tabStart = intoIdx + 1;
      if (KW(toks[tabStart].str) === "TABLE") tabStart++;
      const tab = txExpr(toks.slice(tabStart, end), ctx);
      const isLines = KW(toks[1].str) === "LINES" && KW(toks[2].str) === "OF";
      const isInitial = KW(toks[1].str) === "INITIAL" && KW(toks[2].str) === "LINE";
      let val = isInitial ? "{}" : txExpr(toks.slice(isLines ? 3 : 1, intoIdx), ctx);
      const spread = isLines ? "..." : "";
      // capture the inserted line into a reference/field symbol
      if ((refIdx > 0 || asgIdx > 0) && !isLines) {
        const from = refIdx > 0 ? refIdx + 2 : asgIdx + 1;
        const target = toks.slice(from);
        const parenAt = target.findIndex(isParenL);
        if (parenAt >= 0) {
          // DATA(x) / FINAL(x) / FIELD-SYMBOL(<x>) inline declaration
          const name = varOrFsIdent(target[parenAt + 1].str);
          ctx.locals.add(name);
          push(`const ${name} = ${val};`);
          val = name;
        } else if (target.length) {
          const rendered = txExpr(target, ctx);
          push(`${rendered} = ${val};`);
          val = rendered;
        }
      }
      if (idxIdx > 0) {
        const idxEnd = [refIdx, asgIdx].filter((x) => x > idxIdx).sort((a, b) => a - b)[0] ?? toks.length;
        push(`${tab}.splice((${txExpr(toks.slice(idxIdx + 1, idxEnd), ctx)}) - 1, 0, ${spread}${val});`);
      } else {
        push(`${tab}.push(${spread}${val});`);
      }
      break;
    }
    case "DeleteInternal": {
      // DELETE tab WHERE cond.
      const whereIdx = findTopWord(toks, "WHERE");
      if (whereIdx < 0) return todo();
      const tab = txExpr(toks.slice(1, whereIdx), ctx);
      const cond = txWhere(toks.slice(whereIdx + 1), "row", ctx);
      push(`for (let _i = ${tab}.length - 1; _i >= 0; _i--) { const row = ${tab}[_i]; if (${cond}) ${tab}.splice(_i, 1); }`);
      break;
    }
    case "Sort": {
      // SORT tab [BY comp ... [DESCENDING] | BY (dynamic)].
      const byIdx = findTopWord(toks, "BY");
      if (byIdx < 0) {
        push(`${txExpr(toks.slice(1), ctx)}.sort();`);
        break;
      }
      const tab = txExpr(toks.slice(1, byIdx), ctx);
      const rest = toks.slice(byIdx + 1);
      const desc = rest.some((t) => KW(t.str) === "DESCENDING");
      if (isParenL(rest[0])) {
        // dynamic component name — ABAP names are uppercase, JS keys lowercase
        const close = matchGroup(rest, 0);
        const nameExpr = txExpr(rest.slice(1, close), ctx);
        push(`{ const _f = String(${nameExpr}).toLowerCase(); ${tab}.sort((a, b) => (a[_f] > b[_f] ? 1 : a[_f] < b[_f] ? -1 : 0)${desc ? " * -1" : ""}); }`);
        break;
      }
      const comps = [];
      for (const t of rest) {
        const u = KW(t.str);
        if (u === "DESCENDING" || u === "ASCENDING" || u === "AS" || u === "TEXT") continue;
        if (isId(t)) comps.push(t.str.toLowerCase());
      }
      if (!comps.length) return todo();
      const cmp = comps.map((c) => `(a.${c} > b.${c} ? 1 : a.${c} < b.${c} ? -1 : 0)`).join(" || ");
      push(`${tab}.sort((a, b) => (${cmp})${desc ? " * -1" : ""});`);
      break;
    }
    case "Concatenate": {
      // CONCATENATE a b INTO c [SEPARATED BY s].
      const intoIdx = findTopWord(toks, "INTO");
      if (intoIdx < 0) return todo();
      const sepIdx = findTopWord(toks, "SEPARATED");
      const parts = splitTopExprs(toks.slice(1, intoIdx), ctx);
      const target = txExpr(toks.slice(intoIdx + 1, sepIdx > 0 ? sepIdx : undefined), ctx);
      const sep = sepIdx > 0 ? txExpr(toks.slice(sepIdx + 2), ctx) : "``";
      push(`${target} = [${parts.join(", ")}].join(${sep});`);
      break;
    }
    case "Split": {
      // SPLIT s AT sep INTO TABLE t / INTO a b.
      const atIdx = findTopWord(toks, "AT");
      const intoIdx = findTopWord(toks, "INTO");
      if (atIdx < 0 || intoIdx < 0) return todo();
      const src = txExpr(toks.slice(1, atIdx), ctx);
      const sep = txExpr(toks.slice(atIdx + 1, intoIdx), ctx);
      let rest = toks.slice(intoIdx + 1);
      if (KW(rest[0].str) === "TABLE") {
        rest = rest.slice(1);
        if ((KW(rest[0].str) === "DATA" || KW(rest[0].str) === "FINAL") && rest[1] && isParenL(rest[1])) {
          const name = safeIdent(rest[2].str.toLowerCase());
          ctx.locals.add(name);
          push(`let ${name} = ${src}.split(${sep});`);
        } else {
          push(`${txExpr(rest, ctx)} = ${src}.split(${sep});`);
        }
      } else {
        // target list: DATA(x) / FINAL(x) inline decls or identifier chains (a-b, a->b, a=>b)
        const targets = [];
        const decls = [];
        let k = 0;
        while (k < rest.length) {
          if ((KW(rest[k].str) === "DATA" || KW(rest[k].str) === "FINAL") && rest[k + 1] && isParenL(rest[k + 1])) {
            const name = safeIdent(rest[k + 2].str.toLowerCase());
            ctx.locals.add(name);
            decls.push(name);
            targets.push(name);
            k += 4;
            continue;
          }
          let end = k + 1;
          while (end + 1 < rest.length && (isDash(rest[end]) || isInstArrow(rest[end]) || isStatArrow(rest[end]))) end += 2;
          targets.push(txExpr(rest.slice(k, end), ctx));
          k = end;
        }
        if (decls.length === targets.length) {
          push(`let [${targets.join(", ")}] = ${src}.split(${sep});`);
        } else {
          for (const d of decls) push(`let ${d};`);
          push(`[${targets.join(", ")}] = ${src}.split(${sep});`);
        }
      }
      break;
    }
    case "Try":
      push(`try {`);
      st.indent++;
      break;
    case "Catch": {
      // CATCH cx_a cx_b [INTO DATA(x)].
      const intoIdx = findTopWord(toks, "INTO");
      let varName = null;
      if (intoIdx > 0) {
        if (toks[intoIdx + 2] && isParenL(toks[intoIdx + 2])) varName = safeIdent(toks[intoIdx + 3].str.toLowerCase());
        else varName = safeIdent(toks[intoIdx + 1].str.toLowerCase());
        ctx.locals.add(varName);
      }
      const info = s._catch;
      if (!info || info.tryInfo.catches <= 1) {
        st.indent--;
        push(`} catch (${varName ?? "error"}) {`);
        st.indent++;
        if (!varName) ctx.locals.add("error");
        break;
      }
      // multi-CATCH: dispatch on the exception class
      const tryInfo = info.tryInfo;
      const classToks = toks.slice(1, intoIdx > 0 ? intoIdx : undefined).filter((t) => isId(t) && !["BEFORE", "UNWIND"].includes(KW(t.str)));
      const caught = tryInfo.caughtVar ?? (tryInfo.caughtVar = `_caught${++st.caughtSeq}`);
      const cond = classToks
        .map((t) => {
          const cls = t.str.toLowerCase();
          if (["cx_root", "cx_static_check", "cx_dynamic_check", "cx_no_check"].includes(cls)) return "true";
          if (/^z2ui5_/.test(cls)) {
            ctx.requires.add(cls);
            return `${caught} instanceof ${cls}`;
          }
          // unknown platform class — no JS counterpart, never matches
          return `${caught}?.constructor?.name === ${JSON.stringify(cls)}`;
        })
        .join(" || ") || "true";
      if (info.ordinal === 1) {
        st.indent--;
        push(`} catch (${caught}) {`);
        st.indent++;
        push(`if (${cond}) {`);
        st.indent++;
      } else {
        st.indent--;
        push(`} else if (${cond}) {`);
        st.indent++;
      }
      if (varName) push(`const ${varName} = ${caught};`);
      break;
    }
    case "EndTry": {
      const t = s._endTry;
      if (t && t.catches > 1) {
        st.indent--;
        push(`} else {`);
        st.indent++;
        push(`throw ${t.caughtVar};`);
        st.indent--;
        push(`}`);
        st.indent--;
        push(`}`);
      } else {
        st.indent--;
        push(`}`);
      }
      break;
    }
    case "Raise": {
      // RAISE EXCEPTION TYPE cx EXPORTING a = b. / RAISE EXCEPTION NEW cx( ) / RAISE EXCEPTION x.
      const typeIdx = findTopWord(toks, "TYPE");
      if (typeIdx > 0) {
        const cls = toks[typeIdx + 1].str.toLowerCase();
        ctx.requires.add(cls);
        const expIdx = findTopWord(toks, "EXPORTING");
        if (expIdx > 0) {
          const named = namedArgsOf(toks.slice(expIdx + 1), ctx);
          push(`throw new ${cls}({ ${[...(named ?? new Map()).entries()].map(([k, v]) => `${k}: ${renderNamedVal(v)}`).join(", ")} });`);
        } else {
          push(`throw new ${cls}();`);
        }
      } else {
        push(`throw ${txExpr(toks.slice(2), ctx)};`);
      }
      break;
    }
    case "Assert":
      push(`if (!(${txCond(toks.slice(1), ctx)})) throw new Error(\`ASSERT failed\`);`);
      break;
    case "DeleteDatabase": {
      // DELETE FROM <t> WHERE <conds>. → neutral DB IR marker.
      // Only the plain `DELETE FROM <t>` form is lowered; bulk/other forms TODO.
      if (KW(toks[1].str) !== "FROM") return todo();
      const whereIdx = findTopWord(toks, "WHERE");
      const table = toks[2].str.toLowerCase();
      if (!isTableName(table)) return todo();
      const where = whereIdx > 0 ? sqlWhere(toks.slice(whereIdx + 1), ctx) : "[]";
      if (where === null) return todo();
      ctx.requires?.add("z2ui5_port");
      push(`z2ui5_port.db({ op: \`delete\`, table: \`${table}\`, where: ${where} });`);
      push(`sy_subrc = z2ui5_port.sy_subrc;`);
      break;
    }
    case "ModifyDatabase": {
      // MODIFY <t> FROM @<row>. → neutral DB IR marker (upsert by table key).
      // FROM TABLE @<itab> (bulk) is not lowered.
      const fromIdx = findTopWord(toks, "FROM");
      const table = toks[1].str.toLowerCase();
      if (fromIdx < 0 || !isTableName(table)) return todo();
      let rowToks = toks.slice(fromIdx + 1);
      if (KW(rowToks[0]?.str ?? "") === "TABLE") return todo();
      if (rowToks[0]?.type === "WAt") rowToks = rowToks.slice(1);
      ctx.requires?.add("z2ui5_port");
      push(`z2ui5_port.db({ op: \`modify\`, table: \`${table}\`, row: ${txExpr(rowToks, ctx)} });`);
      push(`sy_subrc = z2ui5_port.sy_subrc;`);
      break;
    }
    case "Commit":
      ctx.requires?.add("z2ui5_port");
      push(`z2ui5_port.db({ op: \`commit\` });`);
      break;
    case "Select": {
      // SELECT [SINGLE] <fields|FIELDS *|*> FROM <t> [WHERE <conds>]
      //   INTO ( [TABLE] @DATA(x) | @x | CORRESPONDING FIELDS OF [TABLE] @x )
      // Anything outside this subset (joins, aggregates, ORDER/GROUP, UP TO,
      // non eq/in WHERE ops) falls back to a clean TODO — never broken JS.
      const single = KW(toks[1].str) === "SINGLE";
      const fromIdx = findTopWord(toks, "FROM");
      const whereIdx = findTopWord(toks, "WHERE");
      const intoIdx = findTopWord(toks, "INTO");
      const fieldsIdx = findTopWord(toks, "FIELDS");
      if (fromIdx < 0 || intoIdx < 0) return todo();
      for (const w of ["JOIN", "GROUP", "ORDER", "HAVING", "UNION", "UP"]) {
        if (findTopWord(toks.slice(0, intoIdx), w) > 0) return todo();
      }
      const table = toks[fromIdx + 1].str.toLowerCase();
      if (!isTableName(table)) return todo();
      const fieldToks = fieldsIdx >= 0 ? toks.slice(fieldsIdx + 1, whereIdx > 0 ? whereIdx : intoIdx) : toks.slice(single ? 2 : 1, fromIdx);
      if (fieldToks.some((t) => isParenL(t))) return todo(); // aggregates COUNT( )/SUM( )
      const isStar = fieldToks.length === 1 && fieldToks[0].str === "*";
      const fieldList = isStar ? [] : fieldToks.filter((t) => t.str !== ",").map((t) => `\`${t.str.toLowerCase()}\``);
      const where = whereIdx > 0 ? sqlWhere(toks.slice(whereIdx + 1, intoIdx), ctx) : "[]";
      if (where === null) return todo();

      let intoToks = toks.slice(intoIdx + 1);
      let op, target, dataDecl = false, singleField = false;
      if (KW(intoToks[0].str) === "CORRESPONDING") {
        const ofIdx = intoToks.findIndex((t) => KW(t.str) === "OF");
        if (ofIdx < 0) return todo();
        let rest = intoToks.slice(ofIdx + 1);
        const isTable = KW(rest[0]?.str ?? "") === "TABLE";
        if (isTable) rest = rest.slice(1);
        if (rest[0]?.type === "WAt") rest = rest.slice(1);
        if (!rest.length) return todo();
        op = isTable ? "select_table" : "select_single";
        dataDecl = KW(rest[0].str) === "DATA" && isParenL(rest[1] ?? { type: "" });
        target = dataDecl ? safeIdent(rest[2].str.toLowerCase()) : txExpr(rest, ctx);
      } else {
        let t0 = intoToks;
        let forceTable = false;
        if (KW(t0[0].str) === "TABLE") { t0 = t0.slice(1); forceTable = true; }
        if (t0[0]?.type === "WAt") t0 = t0.slice(1);
        if (!t0.length) return todo();
        op = forceTable ? "select_table" : single ? "select_single" : "select_table";
        dataDecl = KW(t0[0].str) === "DATA" && isParenL(t0[1] ?? { type: "" });
        target = dataDecl ? safeIdent(t0[2].str.toLowerCase()) : txExpr(t0, ctx);
        singleField = op === "select_single" && fieldList.length === 1;
      }
      if (!/^[A-Za-z_$][\w$.]*$/.test(target)) return todo(); // guard against garbage lvalue
      if (dataDecl) ctx.locals.add(target);
      ctx.requires?.add("z2ui5_port");
      const extra = op === "select_single" ? `, single_field: ${singleField}` : "";
      push(`${dataDecl ? "let " : ""}${target} = z2ui5_port.db({ op: \`${op}\`, table: \`${table}\`, fields: [${fieldList.join(", ")}], where: ${where}${extra} });`);
      push(`sy_subrc = z2ui5_port.sy_subrc;`);
      break;
    }
    case "Comment":
      break;
    default:
      todo();
  }
}

const isTableName = (s) => /^[a-z_]\w*$/i.test(s);

/**
 * OpenSQL WHERE (`a = @v AND b IN @r ...`) → neutral condition-array literal.
 * Only equality (`=`) and range membership (`IN`) map cleanly; any other
 * comparison (<, >, <>, LIKE, …) or a malformed condition returns null so the
 * caller falls back to a TODO instead of emitting wrong semantics.
 */
function sqlWhere(condToks, ctx) {
  const parts = [];
  let cur = [];
  let depth = 0;
  for (const t of condToks) {
    depth += depthDelta(t);
    if (depth === 0 && isId(t) && KW(t.str) === "AND") { parts.push(cur); cur = []; }
    else cur.push(t);
  }
  if (cur.length) parts.push(cur);
  const conds = [];
  for (const p of parts) {
    if (p.length < 3 || !isId(p[0])) return null;
    const opTok = KW(p[1].str);
    const op = opTok === "IN" ? "in" : opTok === "=" ? "eq" : null;
    if (!op) return null; // unsupported comparison operator
    const field = p[0].str.toLowerCase();
    let valToks = p.slice(2);
    if (valToks[0]?.type === "WAt") valToks = valToks.slice(1);
    if (!valToks.length) return null;
    conds.push(`{ field: \`${field}\`, op: \`${op}\`, value: ${txExpr(valToks, ctx)} }`);
  }
  return `[${conds.join(", ")}]`;
}

function findTopWord(toks, word) {
  let depth = 0;
  for (let i = 0; i < toks.length; i++) {
    depth += depthDelta(toks[i]);
    if (depth === 0 && isId(toks[i]) && KW(toks[i].str) === word) return i;
  }
  return -1;
}

function splitTopExprs(toks, ctx) {
  // whitespace-separated top-level primaries (for CONCATENATE)
  const parts = [];
  let i = 0;
  while (i < toks.length) {
    const { str, next } = parsePrimary(toks, i, ctx);
    parts.push(str);
    i = next;
  }
  return parts;
}

/** WHERE conditions: bare component names refer to the row variable */
function txWhere(toks, rowVar, ctx) {
  const sub = new Ctx(ctx.model, ctx.method);
  sub.requires = ctx.requires;
  sub.todos = ctx.todos;
  sub.locals = ctx.locals;
  sub.upperLocals = ctx.upperLocals;
  sub.fsBacked = ctx.fsBacked;
  sub.rowVar = rowVar; // unresolved bare identifiers become row components
  return txCond(toks, sub);
}

// ---------------------------------------------------------------------------
// pretty printing: break long builder chains
// ---------------------------------------------------------------------------

function breakChains(code) {
  return code
    .split("\n")
    .map((line) => {
      if (line.length <= 120) return line;
      const indent = line.match(/^\s*/)[0];
      // break before ".method(" following ")" — only at top nesting level of the line
      let out = "";
      let depth = 0;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === "(") depth++;
        if (c === ")") depth--;
        if (c === "." && depth === 0 && line[i - 1] === ")" && /[a-z_$]/i.test(line[i + 1] ?? "")) {
          out += "\n" + indent + "  ";
        }
        out += c;
      }
      return out;
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// interfaces — constants become a plain object export (types and method
// definitions have no JS representation; implementers flatten the methods)
// ---------------------------------------------------------------------------

function transpileInterface(source, filename) {
  const reg = new Registry().addFile(new MemoryFile(filename, source));
  reg.parse();
  const obj = reg.getFirstObject();
  if (!obj) throw new Error(`no ABAP object parsed from ${filename}`);
  const file = obj.getABAPFiles()[0];

  let name = null;
  const consts = []; // { name, value } — value is a rendered literal or object
  let structCollector = null;

  for (const s of file.getStatements()) {
    const T = s.get().constructor.name;
    const toks = tokify(s);
    if (T === "Interface") {
      name = toks[1].str.toLowerCase();
    } else if (T === "ConstantBegin") {
      const ofIdx = toks.findIndex((t) => KW(t.str) === "OF");
      structCollector = { name: toks[ofIdx + 1].str.toLowerCase(), members: [] };
    } else if (T === "ConstantEnd") {
      if (structCollector) {
        consts.push({ name: structCollector.name, value: `{ ${structCollector.members.map((m) => `${m.name}: ${m.value}`).join(", ")} }` });
        structCollector = null;
      }
    } else if (T === "Constant") {
      const cname = toks[1].str.toLowerCase();
      const { typeTokens, value } = parseTypeAfter(toks.slice(2, -1), 0);
      const rendered = value ? renderLiteralToken(value) : typeDefault(typeTokens);
      if (structCollector) structCollector.members.push({ name: cname, value: rendered });
      else consts.push({ name: cname, value: rendered });
    }
  }
  if (!name) throw new Error(`no interface found in ${filename}`);

  const lines = [];
  lines.push(`// transpiled ABAP interface — constants only, types/methods have no JS form`);
  lines.push(`const ${name} = {`);
  for (const c of consts) lines.push(`  ${c.name}: ${c.value},`);
  lines.push(`};`);
  lines.push("");
  lines.push(`module.exports = ${name};`);
  return { code: lines.join("\n") + "\n", todos: [], name };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function transpileFile(inputPath) {
  const source = fs.readFileSync(inputPath, "utf8");
  if (inputPath.endsWith(".intf.abap")) {
    return transpileInterface(source, path.basename(inputPath));
  }
  const { code, todos, name } = transpileClass(source, path.basename(inputPath));
  return { code: breakChains(code), todos, name };
}

/** regenerate the PREFERRED_PARAM map for srv/z2ui5/02/z2ui5_cl_xml_view.js */
function printPreferredMap(abapPath) {
  const src = fs.readFileSync(abapPath, "utf8");
  const reg = new Registry().addFile(new MemoryFile(path.basename(abapPath), src));
  reg.parse();
  const map = {};
  for (const s of reg.getFirstObject().getABAPFiles()[0].getStatements()) {
    if (s.get().constructor.name !== "MethodDef") continue;
    const toks = s.getTokens().map((t) => t.getStr());
    const up = toks.map((t) => t.toUpperCase());
    const name = (up[0] === "CLASS" ? toks[3] : toks[1]).toLowerCase();
    if (name === "factory" || name === "factory_popup") continue;
    const prefIdx = up.indexOf("PREFERRED");
    if (prefIdx >= 0) {
      map[name] = toks[prefIdx + 2].toLowerCase();
      continue;
    }
    const impIdx = up.indexOf("IMPORTING");
    if (impIdx < 0) continue;
    const params = [];
    for (let i = impIdx + 1; i < toks.length; i++) {
      if (["EXPORTING", "CHANGING", "RETURNING", "RAISING"].includes(up[i])) break;
      if (up[i + 1] === "TYPE" || up[i + 1] === "LIKE") params.push(toks[i].toLowerCase());
    }
    if (params.length === 1) map[name] = params[0];
  }
  for (const [k, v] of Object.entries(map).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`    ${/^[a-z_][a-z0-9_]*$/.test(k) ? k : JSON.stringify(k)}: \`${v}\`,`);
  }
}

function main(argv) {
  const args = argv.slice(2);
  const inputs = [];
  let outDir = null;
  let stdout = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-o") outDir = args[++i];
    else if (args[i] === "--stdout") stdout = true;
    else if (args[i] === "--preferred-map") return printPreferredMap(args[++i]);
    else inputs.push(args[i]);
  }
  if (!inputs.length) {
    console.error("usage: node builder/scripts/abap2js.js <file.clas.abap|dir>... [-o outdir | --stdout]");
    process.exit(1);
  }
  // collect inputs; directories are walked recursively and their internal
  // layout (e.g. abap2UI5 src/02/01) is mirrored 1:1 below the -o target
  const files = []; // { file, relDir }
  const walk = (dir, root) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, root);
      else if ((entry.name.endsWith(".clas.abap") || entry.name.endsWith(".intf.abap")) && !entry.name.includes(".testclasses.")) {
        files.push({ file: full, relDir: path.relative(root, dir) });
      }
    }
  };
  for (const input of inputs) {
    const stat = fs.statSync(input);
    if (stat.isDirectory()) walk(input, input);
    else files.push({ file: input, relDir: "" });
  }
  let todoTotal = 0;
  for (const { file: f, relDir } of files) {
    try {
      const { code, todos, name } = transpileFile(f);
      todoTotal += todos.length;
      if (stdout) {
        console.log(code);
      } else {
        const out = path.join(outDir ?? path.dirname(f), outDir ? relDir : "", `${name}.js`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, code);
        console.log(`${f} -> ${out}${todos.length ? `  (${todos.length} TODOs)` : ""}`);
      }
      for (const t of todos) console.error(`  TODO(${name}): ${t}`);
    } catch (e) {
      console.error(`FAILED ${f}: ${e.message}`);
      process.exitCode = 1;
    }
  }
  if (todoTotal) console.error(`\n${todoTotal} TODO(s) need manual follow-up (search for "TODO(abap2js)").`);
}

module.exports = { transpileClass, transpileFile };

if (require.main === module) main(process.argv);
