// abap2js - an abap2UI5 app class as a cap2UI5 app module, line for line.
//
//   const { abap2js } = require("@cap2ui5/cds-plugin");
//   const { code } = abap2js(fs.readFileSync(file, "utf8"), { file });
//
//   npx --no-install cap2ui5 abap2js src/z2ui5_cl_my_app.clas.abap --out srv/apps
//
// WHY A TRANSLATION AND NOT THE TRANSPILER
//
// An ABAP app already runs in cap2UI5 without any of this: transpiled by
// @abaplint/transpiler it is a class of boxed values and await chains. It
// runs, and nobody reads it. This writes the class a person would write - a
// defineApp( ) class whose client is z2ui5_if_client by its own names and
// whose view is built with z2ui5_cl_ui5_view_builder, called as ABAP calls
// them. That API is what makes a translation that keeps every line possible
// at all, and it is why only the APP is translated: the framework underneath
// stays upstream's transpiled ABAP.
//
// NARROW ON PURPOSE - IT REFUSES RATHER THAN GUESSES
//
// A translator for the whole language was built once, for the framework
// itself (cap2UI5/builder-abap2UI5-js, archived with ADR-008), and it broke
// exactly where ABAP is not JavaScript: RTTI, CALL TRANSFORMATION, dynamic
// calls, Open SQL. An app needs none of that. This file knows the part of
// ABAP an abap2UI5 app uses, and for anything else - an unknown statement,
// an identifier it cannot place, a field-symbol - it stops with the file, the
// row and the column and says what it met. A translation that comes out is
// meant to BEHAVE as the ABAP class does; abap2UI5's samples are held to that
// by running the transpiled original and the translation side by side.
//
// LINE FOR LINE
//
// A statement starts at the column the ABAP statement starts at and breaks
// where the ABAP breaks: a view chain keeps one call per line, VALUE #( ) one
// row per line, and the padding that aligns `v =` in ABAP aligns `v:` here.
// Comments come along; texts are never touched.
//
// WHAT JAVASCRIPT FORCES (the same list as the client's README)
//
// - _bind( ) takes a field's NAME: client->_bind( s_order-customer ) is
//   client._bind("s_order-customer"). A _bind( ) of anything but an
//   attribute path is refused.
// - nav_app_call( NEW zcl_app( ) ) names the app: nav_app_call("ZCL_APP").
// - A read of a table or structure field is a copy (define-app.js), so a
//   write to a component of an attribute assigns the whole structure again.
// - abap_bool is a boolean; in a string template it prints as ABAP prints
//   it, "X" or nothing.
"use strict";

const fs = require("fs");
const path = require("path");

// Loaded on first use: the plugin's runtime path never translates anything.
let core;
const A = () => (core ??= require("@abaplint/core"));

class Abap2jsError extends Error {
  constructor(message, file, token) {
    const at = token ? `${file}:${token.getRow()}:${token.getCol()}` : file;
    super(`${at} - ${message}`);
    this.name = "Abap2jsError";
    this.file = file;
    if (token) Object.assign(this, { row: token.getRow(), col: token.getCol() });
  }
}

const kind = (n) => n.get().constructor.name;
const isToken = (n) => n instanceof A().Nodes.TokenNode || n instanceof A().Nodes.TokenNodeRegex;
const text = (n) => (isToken(n) ? n.get().getStr() : n.concatTokens());
const lc = (s) => String(s).toLowerCase();
const tokensOf = (n) => (isToken(n) ? [n.get()] : n.getTokens());
const firstToken = (n) => tokensOf(n)[0];
const child = (n, k) => n.getChildren().find((c) => !isToken(c) && kind(c) === k);
const children = (n, k) => n.getChildren().filter((c) => !isToken(c) && kind(c) === k);
const hasWord = (n, w) => n.getChildren().some((c) => isToken(c) && lc(text(c)) === w);

// Words JavaScript reserves; an ABAP local or parameter of that name gets a
// trailing underscore. Attributes and components are always behind a `.`.
const RESERVED = new Set(("break case catch class const continue debugger default delete do else enum export " +
  "extends false finally for function if import in instanceof new null return super switch this throw true " +
  "try typeof var void while with yield let static implements interface package private protected public " +
  "await arguments eval undefined").split(" "));
const jsName = (name) => (RESERVED.has(lc(name)) ? `${name}_` : name);

// JavaScript ends a line - and so a `//` comment - at \n, \r, U+2028 and
// U+2029; ABAP ends one at \n only. A comment that carried one of the others
// through would end early and run the rest of the ABAP comment as code, so
// whatever lands behind `//` goes through lineText( ), and a string literal
// spells the two Unicode separators as escapes.
const LINE_BREAKS = /[\n\r\u2028\u2029]/g;
const lineText = (s) => String(s).replace(LINE_BREAKS, " ");
const jsString = (s) => JSON.stringify(s).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

/** An ABAP literal as JavaScript. A backquote literal is a string; a quote
 *  literal is type c, whose trailing blanks ABAP drops wherever it becomes a
 *  string. Where a boolean is expected, 'X' and ' ' are abap_true/false. */
function literalJs(n, expected, fail) {
  const s = text(n).trim();
  if (/^-?\d+$/.test(s.replace(/\s+/g, ""))) return s.replace(/\s+/g, "");
  let value;
  if (s.startsWith("`") && s.endsWith("`")) value = s.slice(1, -1).replace(/``/g, "`");
  else if (s.startsWith("'")) value = s.slice(1, s.lastIndexOf("'")).replace(/''/g, "'").replace(/ +$/, "");
  else fail(`the literal ${s} is not supported`);
  if (expected?.k === "bool" && (value === "X" || value === "")) return value === "X" ? "true" : "false";
  return jsString(value);
}

// ------------------------------------------------------------------ parsing
function parse(source, file) {
  const { Registry, Config, MemoryFile } = A();
  const reg = new Registry(new Config(JSON.stringify({
    global: { files: "/**/*.*" }, syntax: { version: "v758", errorNamespace: "." }, rules: {},
  })));
  reg.addFile(new MemoryFile(file, source));
  reg.parse();
  const obj = reg.getFirstObject();
  const af = obj?.getABAPFiles?.()[0];
  if (!af) throw new Abap2jsError("no ABAP class or interface in this file", file);
  const unknown = af.getStatements().find((s) => kind(s) === "Unknown");
  if (unknown) throw new Abap2jsError(`ABAP syntax error: ${unknown.concatTokens().slice(0, 60)}`, file, unknown.getFirstToken());
  return af;
}

// -------------------------------------------------------------------- types
//
// { k: "string" | "int" | "float" | "bool" | "xstring" | "date" | "time" }
// { k: "packed", length, decimals }  { k: "char" | "numc", length }
// { k: "struct", name, owner, fields: [{ name, type, gap, comments }] }
// { k: "table", row }  { k: "ref", to }  { k: "unknown", name }
const BUILTIN = {
  string: { k: "string" }, sstring: { k: "string" }, xstring: { k: "xstring" },
  i: { k: "int" }, int1: { k: "int" }, int2: { k: "int" }, int4: { k: "int" }, int8: { k: "int" }, b: { k: "int" }, s: { k: "int" },
  f: { k: "float" }, decfloat16: { k: "float" }, decfloat34: { k: "float" },
  abap_bool: { k: "bool" }, abap_boolean: { k: "bool" }, boolean: { k: "bool" }, xfeld: { k: "bool" },
  flag: { k: "bool" }, xsdboolean: { k: "bool" }, boole_d: { k: "bool" },
  d: { k: "date" }, t: { k: "time" },
  string_table: { k: "table", row: { k: "string" } },
};
const sized = (name, length, decimals) => {
  if (name === "c") return { k: "char", length: length ?? 1 };
  if (name === "n") return { k: "numc", length: length ?? 1 };
  if (name === "p") return { k: "packed", length: length ?? 8, decimals: decimals ?? 0 };
  return null;
};

// ------------------------------------------------------------- the library
//
// Types another class declares - `z2ui5_cl_smp_app_489=>ty_s_result`, or
// the client's own `z2ui5_if_client=>ty_s_get`, whose components decide how
// client->get( )-check_on_navigated prints - are read from that class's
// source. The framework's are the sources @abap2ui5/node-runtime ships in
// downport/, which is what its transpiled output was made from.
function runtimeSources() {
  try {
    const dir = path.join(path.dirname(require.resolve("@abap2ui5/node-runtime/package.json")), "downport");
    return fs.existsSync(dir) ? dir : null;
  } catch {
    return null;
  }
}
function indexDir(dir, index) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) indexDir(p, index);
    else if (/\.(clas|intf)\.abap$/.test(e.name)) {
      const name = e.name.split(".")[0];
      if (!index.has(name)) index.set(name, p);
    }
  }
  return index;
}
function library(lib = []) {
  const dirs = [...lib];
  const rt = runtimeSources();
  if (rt) dirs.push(rt);
  const index = new Map();
  for (const d of dirs) if (fs.existsSync(d)) indexDir(d, index);
  const models = new Map();
  return {
    frameworkFound: !!rt,
    model(name) {
      const key = lc(name);
      if (!models.has(key)) {
        const file = index.get(key);
        models.set(key, file ? readModel(parse(fs.readFileSync(file, "utf8"), path.basename(file)),
          path.basename(file), this, false) : null);
      }
      return models.get(key);
    },
  };
}

// ------------------------------------------------------- the class, as data
function readModel(af, file, lib, strict, at = {}) {
  const m = {
    file, lib, strict, name: null, isInterface: false, header: [], types: new Map(), typeOrder: [],
    constants: new Map(), constOrder: [], attributes: [], methods: new Map(), impls: [], interfaces: [],
  };
  const fail = (msg, tok) => {
    if (strict) throw new Abap2jsError(msg, file, tok);
  };
  let section = "public";
  let comments = [];
  const take = () => { const c = comments; comments = []; return c; };
  const stack = [];
  let impl = null;
  let inDefinition = false;

  for (const s of af.getStatements()) {
    const k = kind(s);
    at.node = s;
    if (impl) {
      if (k === "EndMethod") { impl.end = s; m.impls.push(impl); impl = null; continue; }
      impl.body.push(s);
      continue;
    }
    if (k === "Comment") { comments.push(s); continue; }
    switch (k) {
      case "ClassDefinition": {
        m.name = text(child(s, "ClassName"));
        m.header = take();
        inDefinition = true;
        if (hasWord(s, "inheriting") || s.findDirectExpression(A().Expressions.SuperClassName)) {
          fail("a class that inherits is not supported", s.getFirstToken());
        }
        break;
      }
      case "Interface":
        m.name = text(s.findDirectExpression(A().Expressions.InterfaceName));
        m.isInterface = true;
        m.header = take();
        inDefinition = true;
        break;
      case "Public": case "Protected": case "Private":
        section = lc(k);
        take();
        break;
      case "InterfaceDef":
        m.interfaces.push(lc(text(child(s, "InterfaceName"))));
        take();
        break;
      case "TypeBegin": case "DataBegin": case "ConstantBegin": {
        const nameNode = s.findDirectExpression(A().Expressions.NamespaceSimpleName) ?? s.findDirectExpression(A().Expressions.DefinitionName);
        stack.push({ kind: k.replace("Begin", ""), name: text(nameNode), fields: [], stmt: s, comments: take(), section });
        break;
      }
      case "TypeEnd": case "DataEnd": case "ConstantEnd": {
        const top = stack.pop();
        const struct = { k: "struct", name: top.name, owner: m, fields: top.fields };
        if (stack.length) {
          stack.at(-1).fields.push({ name: top.name, type: struct, gap: 1, comments: top.comments, stmt: top.stmt });
        } else {
          register(m, top.kind, top.name, struct, top.stmt, top.comments, top.section);
        }
        break;
      }
      case "IncludeType": {
        if (hasWord(s, "as") || hasWord(s, "renaming")) {
          fail("INCLUDE TYPE ... AS / RENAMING WITH SUFFIX is not supported", s.getFirstToken());
          break;
        }
        const t = resolveType(m, text(child(s, "TypeName")), s.getFirstToken());
        if (t.k !== "struct") { fail("INCLUDE TYPE of a type that is no structure", s.getFirstToken()); break; }
        // flat, as in ABAP - `include` remembers where the components came from
        stack.at(-1)?.fields.push(...t.fields.map((f) => ({ ...f, comments: [], include: t })));
        break;
      }
      case "Type": case "Data": case "Constant": {
        const decl = declaration(m, s);
        if (!decl) break;
        const cmts = take();
        if (stack.length) stack.at(-1).fields.push({ ...decl, comments: cmts, stmt: s });
        else register(m, k, decl.name, decl.type, s, cmts, section, decl);
        break;
      }
      case "MethodDef":
        methodDef(m, s, take(), section);
        break;
      case "ClassData": case "ClassMethods": case "ClassDataBegin":
        fail(`${k === "ClassMethods" ? "CLASS-METHODS" : "CLASS-DATA"} is not supported`, s.getFirstToken());
        take();
        break;
      case "EndClass": case "EndInterface":
        if (inDefinition) { inDefinition = false; take(); }
        break;
      case "ClassImplementation":
        take();
        break;
      case "MethodImplementation":
        impl = { name: text(child(s, "MethodName")), start: s, body: [], comments: take() };
        break;
      default:
        fail(`${k} is not supported in a class definition`, s.getFirstToken());
        take();
    }
  }
  return m;
}

function register(m, k, name, type, stmt, comments, section, decl) {
  if (k === "Type") {
    m.types.set(lc(name), { name, type, stmt, comments });
    m.typeOrder.push(lc(name));
  } else if (k === "Constant") {
    m.constants.set(lc(name), { name, type, value: decl?.value, stmt, comments });
    m.constOrder.push(lc(name));
  } else {
    m.attributes.push({ name, type, section, stmt, comments, value: decl?.value,
      gap: decl?.gap ?? 1, isStatic: kind(stmt) === "ClassData" });
  }
}

/** One TYPES / DATA / CONSTANTS entry: its name, type and VALUE, and the
 *  padding between name and TYPE - the column the ABAP aligned. */
function declaration(m, s) {
  const E = A().Expressions;
  const def = s.findDirectExpression(E.DataDefinition) ?? s;
  const nameNode = def.findDirectExpression(E.DefinitionName) ?? def.findDirectExpression(E.NamespaceSimpleName);
  if (!nameNode) {
    if (m.strict) throw new Abap2jsError(`${kind(s)} without a name`, m.file, s.getFirstToken());
    return null;
  }
  const typeNode = def.findDirectExpression(E.Type) ?? def.findDirectExpression(E.TypeTable);
  const type = typeNode ? typeOf(m, typeNode, def) : { k: "unknown", name: "" };
  const valueNode = def.findDirectExpression(E.Value);
  const nameTok = nameNode.getLastToken();
  const next = typeNode ? typeNode.getFirstToken() : null;
  const gap = next && next.getRow() === nameTok.getRow()
    ? Math.max(1, next.getCol() - nameTok.getCol() - nameTok.getStr().length) : 1;
  return { name: text(nameNode), type, gap, value: valueNode };
}

/** `node` is the TYPE part; `around` the statement or definition it sits in,
 *  which is where abaplint puts LENGTH and DECIMALS. */
function typeOf(m, node, around = node) {
  const E = A().Expressions;
  const words = node.getChildren().filter(isToken).map((t) => lc(text(t)));
  const nameNode = node.findFirstExpression(E.TypeName);
  const tok = node.getFirstToken();
  if (words[0] === "like") return { k: "unknown", name: text(node) };
  if (kind(node) === "TypeTable") {
    if (words.includes("range")) return { k: "range" };
    const row = words.includes("ref") ? { k: "ref", to: lc(text(nameNode)) } : resolveType(m, text(nameNode), tok);
    return { k: "table", row, sorted: words.includes("sorted") || words.includes("hashed") };
  }
  if (words.includes("table")) {
    const row = words.includes("ref") ? { k: "ref", to: lc(text(nameNode)) } : resolveType(m, text(nameNode), tok);
    return { k: "table", row };
  }
  if (words.includes("ref")) return { k: "ref", to: lc(text(nameNode)) };
  if (!nameNode) return { k: "unknown", name: text(node) };
  const name = lc(text(nameNode));
  const len = (node.findDirectExpression(E.Length) ?? around.findDirectExpression(E.Length))?.findFirstExpression(E.Integer);
  const dec = (node.findDirectExpression(E.Decimals) ?? around.findDirectExpression(E.Decimals))?.findFirstExpression(E.Integer);
  return sized(name, len ? +text(len) : undefined, dec ? +text(dec) : undefined) ?? resolveType(m, name, tok);
}

function resolveType(m, raw, tok) {
  const name = lc(raw);
  if (name.includes("=>")) {
    const [cls, sub] = name.split("=>");
    const other = lc(cls) === lc(m.name) ? m : m.lib.model(cls);
    return other ? resolveType(other, sub, tok) : { k: "unknown", name };
  }
  if (m.types.has(name)) return m.types.get(name).type;
  if (BUILTIN[name]) return BUILTIN[name];
  return sized(name) ?? { k: "unknown", name };
}

function methodDef(m, s, comments, section) {
  const E = A().Expressions;
  const name = text(child(s, "MethodName"));
  const params = (expr) => (s.findDirectExpression(expr)?.findAllExpressions(E.MethodParam) ?? []).map((p) => ({
    name: text(p.findDirectExpression(E.MethodParamName)),
    type: typeOf(m, p.findDirectExpression(E.TypeParam) ?? p),
  }));
  const importing = [];
  const imp = s.findDirectExpression(E.MethodDefImporting);
  if (imp) {
    for (const c of imp.getChildren()) {
      if (isToken(c)) continue;
      const opt = kind(c) === "MethodParamOptional";
      const p = opt ? c.findDirectExpression(E.MethodParam) : kind(c) === "MethodParam" ? c : null;
      if (!p) continue;
      const def = opt ? c.findDirectExpression(E.Default) : null;
      importing.push({
        name: text(p.findDirectExpression(E.MethodParamName)),
        type: typeOf(m, p.findDirectExpression(E.TypeParam) ?? p),
        optional: opt && (hasWord(c, "optional") || !!def),
        default: def ?? null,
      });
    }
    const pref = imp.getChildren().findIndex((c) => isToken(c) && lc(text(c)) === "preferred");
    if (pref >= 0) importing.preferred = lc(text(imp.getChildren()[pref + 2]));
  }
  const ret = s.findDirectExpression(E.MethodDefReturning);
  const out = [...params(E.MethodDefExporting), ...params(E.MethodDefChanging)];
  m.methods.set(lc(name), {
    name, section, comments, importing, out,
    returning: ret ? { name: text(ret.findDirectExpression(E.MethodParamName)), type: typeOf(m, ret.findDirectExpression(E.TypeParam)) } : null,
    stmt: s,
  });
}

// ------------------------------------------------------ the module, emitted
function abap2js(source, options = {}) {
  const file = options.file ? path.basename(options.file) : classFile(source);
  const af = parse(source, file);
  const lib = options.library ?? library(options.lib);
  if (!lib.frameworkFound) {
    throw new Abap2jsError("@abap2ui5/node-runtime carries no downport/ - the client's ABAP types are read from there", file);
  }
  // where the translation is - so that a slip of the translator itself, a
  // TypeError on a statement it did not expect, still names the row
  const at = { node: null };
  try {
    const m = readModel(af, file, lib, true, at);
    if (m.isInterface) throw new Abap2jsError("an interface is not an app - give the class that implements z2ui5_if_app", file);
    if (!m.interfaces.includes("z2ui5_if_app")) throw new Abap2jsError("the class does not implement z2ui5_if_app", file);
    const other = m.interfaces.filter((i) => i !== "z2ui5_if_app");
    if (other.length) throw new Abap2jsError(`INTERFACES ${other.join(", ")}: only z2ui5_if_app is supported`, file);
    const g = new Generator(af, m, options, at);
    return { name: m.name.toUpperCase(), code: g.module() };
  } catch (e) {
    if (e instanceof Abap2jsError) throw e;
    const err = new Abap2jsError(`abap2js failed on this statement (${e.message}) - not translated; ` +
      "this is abap2js's own limit, please report it", file, at.node ? firstToken(at.node) : undefined);
    err.cause = e;
    throw err;
  }
}

/** The abapGit file name a class source would have, for sources passed as text. */
function classFile(source) {
  const hit = /^\s*CLASS\s+(\S+)\s+DEFINITION\b/im.exec(source);
  if (!hit) throw new Abap2jsError("no CLASS ... DEFINITION in the source", "(source)");
  return `${lc(hit[1])}.clas.abap`;
}

class Generator {
  constructor(af, model, options, at = {}) {
    this.at = at;
    this.af = af;
    this.m = model;
    this.file = model.file;
    this.options = options;
    this.imports = new Set(["defineApp"]);
    const code = af.getTokens().filter((t) => !(t instanceof A().Tokens.Comment) && !(t instanceof A().Tokens.Pragma));
    this.rowStart = new Set();
    this.prev = new Map();
    let row = -1;
    for (const [i, t] of code.entries()) {
      if (t.getRow() !== row) { this.rowStart.add(t); row = t.getRow(); }
      if (i) this.prev.set(t, code[i - 1]);
    }
    this.used = new Set();          // row-start tokens a line break was already emitted for
    this.comments = new Map();      // row -> comment statement, for comments INSIDE a statement
    for (const s of af.getStatements()) if (kind(s) === "Comment") this.comments.set(s.getFirstToken().getRow(), s);
    this.emittedComments = new Set();
  }

  fail(message, node) {
    throw new Abap2jsError(message, this.file, node ? firstToken(node) : undefined);
  }

  // ---------------------------------------------------------------- layout
  /** The line break the ABAP has in front of this token, with the comments
   *  that sit on the rows it skips - or nothing. */
  breakAt(tok) {
    if (!tok || !this.rowStart.has(tok) || this.used.has(tok)) return "";
    this.used.add(tok);
    const before = this.prev.get(tok);
    let out = "";
    if (before) {
      for (let r = before.getRow() + 1; r < tok.getRow(); r++) {
        const c = this.comments.get(r);
        if (c && !this.emittedComments.has(c)) {
          this.emittedComments.add(c);
          const line = this.comment(c);
          if (line !== null) out += `\n${" ".repeat(c.getFirstToken().getCol() - 1)}${line}`;
        }
      }
    }
    return `${out}\n${" ".repeat(tok.getCol() - 1)}`;
  }
  lead(node) {
    return this.breakAt(firstToken(node));
  }
  /** The spaces between two tokens on one row - the alignment the ABAP had. */
  gap(a, b, min = 1) {
    return a && b && a.getRow() === b.getRow() ? " ".repeat(Math.max(min, b.getCol() - a.getCol() - a.getStr().length)) : " ";
  }

  /** A comment, as JavaScript. `"!` is ABAP Doc, `"` and `*` are comments. A
   *  linter pragma keeps its reason and drops the rule, which JavaScript has
   *  no linter for; a pseudo-comment (`"#EC`) goes. */
  comment(c) {
    const raw = c.concatTokens();
    let body = raw.replace(/^\*/, "").replace(/^"!?/, "");
    if (/^#EC\b/i.test(body)) return null;
    const pragma = /^\s*abap2ui5lint-(?:disable|enable)\S*\s+\S+(?:\s+--\s*(.*))?$/.exec(body);
    if (pragma) return pragma[1] ? `// ${lineText(pragma[1])}` : null;
    body = lineText(body).replace(/\s+$/, "");
    return body.trim() ? `//${body.startsWith(" ") ? "" : " "}${body}` : "//";
  }

  // ---------------------------------------------------------------- module
  module() {
    const out = [];
    out.push(...this.header());
    const consts = this.constants();
    const fields = this.fields();
    const methods = this.methods();
    const names = ["defineApp", "t", "z2ui5_cl_ui5_view_builder", "z2ui5_if_client"].filter((n) => this.imports.has(n));
    out.push(this.options.format === "cjs"
      ? `const { ${names.join(", ")} } = require("@cap2ui5/cds-plugin");`
      : `import { ${names.join(", ")} } from "@cap2ui5/cds-plugin";`);
    out.push("");
    if (consts.length) out.push(...consts, "");
    out.push(`defineApp(${JSON.stringify(this.m.name.toUpperCase())}, class {`);
    if (fields.length) out.push("", ...fields);
    for (const meth of methods) out.push("", ...meth);
    out.push("});", "");
    return out.join("\n");
  }

  header() {
    const lines = [];
    let doc = false;
    const origin = this.options.origin ? `// @origin ${lineText(this.options.origin)}` : null;
    const cmts = this.m.header;
    const lastTag = cmts.map((c) => /^"\s*@\w+/.test(c.concatTokens())).lastIndexOf(true);
    for (const [i, c] of cmts.entries()) {
      const isDoc = c.concatTokens().startsWith('"!');
      if (isDoc && !doc && lines.length) lines.push("//");
      doc = isDoc;
      const line = this.comment(c);
      if (line !== null) lines.push(line);
      if (i === lastTag && origin) lines.push(origin);
    }
    if (lastTag < 0 && origin) lines.unshift(origin);
    return lines;
  }

  /** Module-level constants for the class's structure TYPES and its
   *  CONSTANTS - JavaScript has no type declarations, and a class body no
   *  place for either. */
  constants() {
    const out = [];
    for (const key of this.m.typeOrder) {
      const t = this.m.types.get(key);
      this.at.node = t.stmt;
      if (t.type.k !== "struct") continue;
      if (out.length) out.push("");
      out.push(...t.comments.map((c) => this.comment(c)).filter((l) => l !== null));
      out.push(`const ${t.name} = ${this.structLiteral(t.type, "field")};`);
    }
    for (const key of this.m.constOrder) {
      const c = this.m.constants.get(key);
      this.at.node = c.stmt;
      if (out.length) out.push("");
      out.push(...c.comments.map((x) => this.comment(x)).filter((l) => l !== null));
      out.push(`const ${c.name} = ${this.constValue(c.type, c.value, 0, c.stmt)};`);
    }
    return out;
  }

  constValue(type, value, indent, stmt) {
    if (type.k === "struct") {
      const pad = " ".repeat(indent + 2);
      const rows = type.fields.map((f) => `${pad}${f.name}:${" ".repeat(f.gap)}${this.constValue(f.type, f.value, indent + 2, f.stmt)},`);
      return `{\n${rows.join("\n")}\n${" ".repeat(indent)}}`;
    }
    if (!value) return this.initial(type, "plain", stmt);
    return this.literal(value, type);
  }

  literal(valueNode, type) {
    const E = A().Expressions;
    if (hasWord(valueNode, "initial")) return this.initial(type, "plain", valueNode);
    const c = valueNode.findDirectExpression(E.Constant) ?? valueNode.findDirectExpression(E.SimpleFieldChain) ??
      valueNode.findDirectExpression(E.FieldChain);
    if (!c) this.fail("a VALUE that is no literal", valueNode);
    if (kind(c) === "Constant") return literalJs(c, type, (msg) => this.fail(msg, c));
    const name = lc(text(c));
    if (name === "abap_true") return "true";
    if (name === "abap_false") return "false";
    this.fail(`VALUE ${text(c)} - only literals, abap_true and abap_false`, c);
  }

  /** A class field's initial value. Scalars the way defineApp( ) reads
   *  them, the ABAP types a plain JavaScript value cannot say as t.*. */
  initial(type, mode, node) {
    const field = mode === "field";
    switch (type.k) {
      case "string": return '""';
      case "int": return "0";
      case "bool": return "false";
      case "float": return field ? this.t("float()") : "0";
      case "packed": return field ? this.t(`packed(${type.length}, ${type.decimals})`) : "0";
      case "char": return field ? this.t(`char(${type.length})`) : '""';
      case "numc": return field ? this.t(`numc(${type.length})`) : JSON.stringify("0".repeat(type.length));
      case "date": return field ? this.t("date()") : '"00000000"';
      case "time": return field ? this.t("time()") : '"000000"';
      case "struct": return this.structRef(type, mode);
      case "table":
        if (!field) return "[]";
        if (type.row.k !== "struct") this.fail("a table of scalars cannot be a cap2UI5 field yet", node);
        return this.t(`table(${this.structRef(type.row, "field")})`);
      case "ref": if (!field) return "null";
      // falls through
      default:
        this.fail(`a ${type.k === "ref" ? `REF TO ${type.to}` : type.name || type.k} ${field ? "field" : "value"} is not supported`, node);
    }
  }
  t(expr) {
    this.imports.add("t");
    return `t.${expr}`;
  }
  /** A structure: the module constant of this class's own named type, or the
   *  literal of any other. A local variable gets a copy, never the constant -
   *  and a literal where the constant holds a field's t.*( ), which only a
   *  class field reads. */
  structRef(type, mode) {
    if (this.ownConstant(type, mode)) return mode === "field" ? type.name : `{ ...${type.name} }`;
    return this.structLiteral(type, mode);
  }
  ownConstant(type, mode) {
    const own = type.owner === this.m && type.name && this.m.types.get(lc(type.name))?.type === type;
    const plain = (t) => ["string", "int", "bool"].includes(t.k) || (t.k === "struct" && t.fields.every((f) => plain(f.type)));
    return own && (mode === "field" || plain(type));
  }
  /** `{`, a line per component, `}` - from column 0; whoever places it
   *  indents the lines after the first. */
  structLiteral(type, mode) {
    const rows = [];
    for (let i = 0; i < type.fields.length; i++) {
      const f = type.fields[i];
      // INCLUDE TYPE of an own type: its constant, spread - the ABAP names it too
      if (f.include && this.ownConstant(f.include, mode)) {
        rows.push(`  ...${f.include.name},`);
        while (type.fields[i + 1]?.include === f.include) i++;
        continue;
      }
      rows.push(...(f.comments ?? []).map((c) => this.comment(c)).filter((l) => l !== null).map((l) => `  ${l}`));
      const value = f.value ? this.literal(f.value, f.type) : this.initial(f.type, mode, f.stmt);
      rows.push(`  ${f.name}:${" ".repeat(f.gap ?? 1)}${value.replace(/\n/g, "\n  ")},`);
    }
    return `{\n${rows.join("\n")}\n}`;
  }

  fields() {
    const out = [];
    let section = null;
    let lastRow = 0;
    for (const a of this.m.attributes) {
      this.at.node = a.stmt;
      if (a.type.k === "ref" && a.type.to === "z2ui5_if_client") continue;   // assigned in main( ), see define-app.js
      if (a.isStatic) this.fail("CLASS-DATA is not supported", a.stmt);
      const row = a.stmt.getFirstToken().getRow();
      if (section !== null && (section !== a.section || row - lastRow > 1)) out.push("");
      section = a.section;
      lastRow = a.stmt.getLastToken().getRow();
      for (const c of a.comments) {
        const line = this.comment(c);
        if (line !== null) out.push(`  ${line}`);
      }
      const value = a.value ? this.literal(a.value, a.type) : this.initial(a.type, "field", a.stmt);
      // another class's structure is written out - the note says which it is
      const typeNote = a.type.k === "struct" && a.type.owner !== this.m
        ? `      // ${a.type.owner?.name ? `${a.type.owner.name}=>` : ""}${a.type.name}` : "";
      const [first, ...rest] = `  ${a.name}${" ".repeat(a.gap)}= ${value.replace(/\n/g, "\n  ")};`.split("\n");
      out.push(first + typeNote, ...rest);
    }
    return out;
  }

  methods() {
    const defs = this.m.methods;
    return this.m.impls.map((impl) => {
      this.at.node = impl.start;
      const name = lc(impl.name);
      if (name.includes("~") && name !== "z2ui5_if_app~main") this.fail(`${impl.name}: only z2ui5_if_app~main is supported`, impl.start);
      const def = name === "z2ui5_if_app~main"
        ? { name: "main", importing: [{ name: "client", type: { k: "ref", to: "z2ui5_if_client" } }], out: [], returning: null }
        : defs.get(name);
      if (!def) this.fail(`METHOD ${impl.name} has no definition`, impl.start);
      if (def.out.length) this.fail(`${def.name}: EXPORTING and CHANGING parameters have no JavaScript counterpart - use RETURNING`, def.stmt);
      return new MethodGen(this, impl, def).lines();
    });
  }
}

// ------------------------------------------------------------ one method
class MethodGen {
  constructor(g, impl, def) {
    this.g = g;
    this.m = g.m;
    this.impl = impl;
    this.def = def;
    this.locals = new Map();          // lc name -> { name, type, js }
    for (const p of def.importing) this.locals.set(lc(p.name), { name: p.name, js: jsName(p.name), type: p.type });
    if (def.returning) this.locals.set(lc(def.returning.name), { name: def.returning.name, js: jsName(def.returning.name), type: def.returning.type });
    this.hoisted = new Set();          // declared on top of the method
    this.outside = new Set();          // … and read where their declaration may not have run
    this.reassigned = new Set();
  }

  fail(msg, node) { this.g.fail(msg, node); }

  lines() {
    const g = this.g;
    const col = this.impl.start.getFirstToken().getCol() - 1;
    const pad = " ".repeat(col);
    const inner = " ".repeat(col + 2);
    const out = [];
    for (const c of this.def.comments ?? []) {
      const line = g.comment(c);
      if (line !== null) out.push(pad + line);
    }
    for (const c of this.impl.comments) {
      const line = g.comment(c);
      if (line !== null) out.push(pad + line);
    }
    out.push(`${pad}${this.signature()} {`);
    this.scan();
    const top = out.length;
    this.body(out);
    // the declarations on top come last: a local's type is known once its
    // statement is translated
    const decls = [];
    const indent = (value) => value.replace(/\n/g, `\n${inner}`);
    if (this.def.returning) {
      const r = this.def.returning;
      decls.push(`${inner}let ${jsName(r.name)} = ${indent(this.g.initial(r.type, "plain", this.def.stmt))};`);
    }
    for (const name of this.hoisted) {
      const local = this.locals.get(name);
      const start = this.outside.has(name) ? this.startValue(local) : "";
      decls.push(`${inner}let ${local?.js ?? jsName(name)}${start ? ` = ${indent(start)}` : ""};`);
    }
    out.splice(top, 0, ...decls);
    if (this.def.returning) out.push(`${inner}return ${jsName(this.def.returning.name)};`);
    out.push(`${pad}}`);
    return out;
  }

  /** What a local declared on top starts with. ABAP creates every local on
   *  entering the method - with its DATA's VALUE, else its type's initial
   *  value - so that is what a read finds where the declaration did not run
   *  (`IF … DATA(x) = 1. ENDIF.` and x after it). Nothing when the type is
   *  not known here. */
  startValue(local) {
    if (!local) return "";
    if (local.start !== undefined) return local.start;
    if (!local.type || local.type.k === "unknown") return "";
    try {
      return this.g.initial(local.type, "plain", this.def.stmt);
    } catch (e) {
      if (e instanceof Abap2jsError) return "";
      throw e;
    }
  }

  signature() {
    const ps = this.def.importing;
    const E = A().Expressions;
    const dflt = (p) => {
      if (p.default) {
        const v = p.default.findFirstExpression(E.Constant) ?? p.default.findFirstExpression(E.FieldChain);
        if (!v) this.fail("this DEFAULT is not supported", p.default);
        return ` = ${kind(v) === "Constant" ? literalJs(v, p.type, (msg) => this.fail(msg, v)) : this.fieldChain(v).js}`;
      }
      return p.optional ? ` = ${this.g.initial(p.type, "plain", this.def.stmt)}` : "";
    };
    if (!ps.length) return `${this.def.name}()`;
    if (ps.length === 1) return `${this.def.name}(${jsName(ps[0].name)}${dflt(ps[0])})`;
    const names = ps.map((p) => (RESERVED.has(lc(p.name)) ? `${p.name}: ${jsName(p.name)}` : p.name) + dflt(p));
    return `${this.def.name}({ ${names.join(", ")} } = {})`;
  }

  /** Before emitting: which locals are assigned twice (let, not const), and
   *  which are used outside the block they are declared in - ABAP scopes a
   *  local to the method, JavaScript to the block, so those are declared at
   *  the top of the method instead. So is what a WHEN declares right in it:
   *  a case clause is no block, its `let` would belong to the whole switch. */
  scan() {
    const E = A().Expressions;
    const blocks = [{ id: 0, kind: "method" }];
    let next = 1;
    const declared = new Map();         // name -> block path at the declaration
    const open = (k) => blocks.push({ id: next++, kind: k });
    for (const s of this.impl.body) {
      const k = kind(s);
      if (k === "EndCase") {
        if (blocks.at(-1).kind === "when") blocks.pop();
        blocks.pop();
        continue;
      }
      if (["EndIf", "EndDo", "EndLoop", "EndWhile"].includes(k)) { blocks.pop(); continue; }
      if (k === "ElseIf" || k === "Else") { blocks.pop(); open("if"); }
      if (k === "When" || k === "WhenOthers") {
        if (blocks.at(-1).kind === "when") blocks.pop();
        open("when");
      }
      const path = blocks.map((b) => b.id).join("/");
      for (const f of s.findAllExpressions(E.Field)) {
        const name = lc(text(f));
        const d = declared.get(name);
        if (d !== undefined && !(path === d || path.startsWith(d + "/"))) {
          this.hoisted.add(name);
          this.outside.add(name);
        }
      }
      // a LOOP's INTO DATA( ) lives in the loop's block in JavaScript (for…of),
      // so a use after ENDLOOP - legal in ABAP, the last row - declares it on top
      const at = k === "Loop" ? `${path}/${next}` : path;
      const inWhen = k !== "Loop" && blocks.at(-1).kind === "when";
      for (const inline of s.findAllExpressions(E.InlineData)) {
        const name = lc(text(inline.findFirstExpression(E.Field)));
        declared.set(name, at);
        if (inWhen) this.hoisted.add(name);
      }
      if (k === "Data") {
        const name = lc(text(s.findFirstExpression(E.DefinitionName)));
        declared.set(name, path);
        if (inWhen) this.hoisted.add(name);
        // DATA is no statement that runs: ABAP creates the variable once, on
        // entering the method, and the next iteration does not set it back
        if (blocks.some((b) => b.kind === "loop")) {
          this.fail("DATA inside DO / LOOP / WHILE keeps its value from one iteration to the next in ABAP - " +
            "not supported, declare it before the loop", s);
        }
      }
      if (k === "Move") {
        const target = s.findDirectExpression(E.Target);
        if (target && !target.findDirectExpression(E.InlineData) && target.getChildren().length === 1) {
          this.reassigned.add(lc(text(target)));
        }
      }
      if (k === "If") open("block");
      if (["Do", "Loop", "While"].includes(k)) open("loop");
      if (k === "Case") open("case");
    }
  }

  // ------------------------------------------------------------- statements
  body(out) {
    const g = this.g;
    let lastRow = this.impl.start.getLastToken().getRow();
    const cases = [];                  // open CASEs: { bodyCol, hasBody, whenLine, loops }
    let loops = 0;                     // open DO / LOOP / WHILE
    const push = (line) => out.push(line);
    // abaplint lists a comment that stands INSIDE a statement - between the
    // calls of a view chain - before that statement: the statement places it,
    // at its row (breakAt)
    const statements = this.impl.body;
    const inside = new Set(statements.filter((s, i) => {
      if (kind(s) !== "Comment") return false;
      const next = statements.slice(i + 1).find((x) => kind(x) !== "Comment");
      const r = s.getFirstToken().getRow();
      return next && next.getFirstToken().getRow() < r && r < next.getLastToken().getRow();
    }));
    for (const s of statements) {
      const k = kind(s);
      const tok = s.getFirstToken();
      const row = tok.getRow();
      if (k === "Comment") {
        if (g.emittedComments.has(s) || inside.has(s)) continue;
        if (row === lastRow && out.length) {           // a comment behind code on the same row
          const line = g.comment(s);
          if (line !== null) out[out.length - 1] += `  ${line}`;
          g.emittedComments.add(s);
          continue;
        }
      }
      for (let r = lastRow + 1; r < row; r++) if (!g.comments.has(r)) push("");
      if (k === "Comment") {
        g.emittedComments.add(s);
        const line = g.comment(s);
        if (line !== null) push(" ".repeat(tok.getCol() - 1) + line);
        lastRow = row;
        continue;
      }
      const col = tok.getCol() - 1;
      g.at.node = s;
      if ((k === "When" || k === "WhenOthers" || k === "EndCase") && cases.length) {
        const c = cases.at(-1);
        if (c.hasBody && !c.ended) {
          const blanks = [];
          while (out.length && out.at(-1) === "") blanks.push(out.pop());
          push(`${" ".repeat(c.bodyCol)}break;`);
          out.push(...blanks);
        } else if (!c.hasBody && c.whenLine !== undefined && k !== "EndCase") {
          // an empty WHEN does nothing - in a switch it would run into the next case
          out[c.whenLine] += " break;";
        }
        c.hasBody = false;
        c.ended = false;
        c.whenLine = undefined;
      }
      g.used.add(tok);
      if (k === "Exit" && loops && cases.length && cases.at(-1).loops === loops) {
        // ABAP's EXIT inside a CASE inside a loop leaves the LOOP; JavaScript's
        // break would only leave the switch
        this.fail("EXIT inside a CASE inside a loop is not supported", s);
      }
      if (k === "Continue" && !loops) this.fail("CONTINUE outside a loop is not supported", s);
      // EXIT outside a loop leaves the method, as RETURN does
      const js = k === "Exit" && !loops ? this.statement(s, "Return") : this.statement(s);
      const lines = js.split("\n");
      push(" ".repeat(col) + lines[0]);
      out.push(...lines.slice(1));
      // what the enclosing WHEN has, for the break before the next WHEN
      const mark = (c) => {
        if (!c) return;
        if (!c.hasBody) c.bodyCol = col;
        c.hasBody = true;
        c.ended = js.startsWith("return");
      };
      if (k === "Case") { mark(cases.at(-1)); cases.push({ bodyCol: col + 2, hasBody: false, loops }); }
      else if (k === "EndCase") { cases.pop(); mark(cases.at(-1)); }
      else if (k === "When") cases.at(-1).whenLine = out.length - 1;
      else if (k !== "WhenOthers") mark(cases.at(-1));
      if (["Do", "Loop", "While"].includes(k)) loops++;
      if (["EndDo", "EndLoop", "EndWhile"].includes(k)) loops--;
      lastRow = s.getLastToken().getRow();
      // comments inside the statement that no line break carried
      for (const [r, c] of g.comments) {
        if (r > row && r < lastRow && !g.emittedComments.has(c)) {
          g.emittedComments.add(c);
          const line = g.comment(c);
          if (line !== null) push(" ".repeat(c.getFirstToken().getCol() - 1) + line);
        }
      }
    }
    for (let r = lastRow + 1; r < this.impl.end.getFirstToken().getRow(); r++) if (!g.comments.has(r)) out.push("");
  }

  statement(s, as) {
    const E = A().Expressions;
    const k = as ?? kind(s);
    switch (k) {
      case "Move": return this.move(s);
      case "Call": return `${this.callChain(s.getChildren().find((c) => !isToken(c)))};`;
      case "Data": {
        const decl = declaration(this.m, s);
        const start = decl.value ? this.g.literal(decl.value, decl.type) : this.g.initial(decl.type, "plain", s);
        this.locals.set(lc(decl.name), { name: decl.name, js: jsName(decl.name), type: decl.type, start });
        const value = start.replace(/\n/g, `\n${" ".repeat(s.getFirstToken().getCol() - 1)}`);
        if (this.hoisted.has(lc(decl.name))) return `${jsName(decl.name)} = ${value};`;
        return `let ${jsName(decl.name)} = ${value};`;
      }
      case "If": return `if (${this.cond(s.findDirectExpression(E.Cond))}) {`;
      case "ElseIf": return `} else if (${this.cond(s.findDirectExpression(E.Cond))}) {`;
      case "Else": return "} else {";
      case "EndIf": case "EndDo": case "EndLoop": case "EndWhile": case "EndCase": return "}";
      case "Case": return `switch (${this.source(s.findDirectExpression(E.Source))}) {`;
      case "When": {
        const values = [...children(s, "Source"), ...children(s, "Or").map((o) => o.findDirectExpression(E.Source))];
        return values.map((v) => `case ${this.source(v)}:`).join(" ");
      }
      case "WhenOthers": return "default:";
      case "Do": {
        const times = s.findDirectExpression(E.Source);
        if (hasWord(s, "varying")) this.fail("DO ... VARYING is not supported", s);
        if (!times) return "for (let sy_index = 1; ; sy_index++) {";
        // ABAP reads the count once, when the loop starts
        const count = this.source(times);
        if (/^\d+$/.test(count)) return `for (let sy_index = 1; sy_index <= ${count}; sy_index++) {`;
        return `for (let sy_index = 1, sy_times = ${count}; sy_index <= sy_times; sy_index++) {`;
      }
      case "While": return `while (${this.cond(s.findDirectExpression(E.Cond))}) {`;
      case "Loop": return this.loop(s);
      case "Return": return this.def.returning ? `return ${jsName(this.def.returning.name)};` : "return;";
      case "Exit": return "break;";
      case "Continue": return "continue;";
      case "InsertInternal": case "Append": return this.insert(s);
      default:
        this.fail(`${k} is not supported yet`, s);
    }
  }

  move(s) {
    const E = A().Expressions;
    const targets = s.getChildren().filter((c) => !isToken(c) && kind(c) === "Target");
    if (targets.length !== 1) this.fail("a chained assignment is not supported", s);
    const target = targets[0];
    if (s.getChildren().some((c) => isToken(c) && text(c) === "?=")) {
      this.fail("?= (a down cast) is not supported - an app's own objects are not translated", s);
    }
    const kids = s.getChildren();
    const at = kids.findIndex((c) => isToken(c) && /^([+\-*/]|&&)?=$/.test(text(c)));
    if (at < 0) this.fail("this assignment is not supported", s);
    // abaplint reads `a += 1` as the two tokens + and = ( *= /= &&= as one)
    const split = text(kids[at]) === "=" && isToken(kids[at - 1]) && ["+", "-"].includes(text(kids[at - 1]));
    const opTok = (split ? kids[at - 1] : kids[at]).get();
    const opText = split ? `${text(kids[at - 1])}=` : text(kids[at]);
    const source = s.findDirectExpression(E.Source);
    const gap = this.g.gap(target.getLastToken(), opTok);
    const jsOp = opText === "&&=" ? "+=" : opText;
    const inline = target.findDirectExpression(E.InlineData);
    if (inline) {
      const name = lc(text(inline.findFirstExpression(E.Field)));
      const type = this.typeOfSource(source);
      this.locals.set(name, { name, js: jsName(name), type });
      const value = this.source(source, type);
      if (this.hoisted.has(name)) return `${jsName(name)}${gap}= ${value};`;
      return `${this.reassigned.has(name) ? "let" : "const"} ${jsName(name)}${gap}= ${value};`;
    }
    const t = this.target(target);
    const value = this.source(source, t.type);
    if (t.component) {
      // a read of a structure attribute is a copy - so the whole structure is written again
      if (jsOp !== "=") this.fail(`${opText} on a component of an attribute is not supported`, s);
      return `${t.js}${gap}= ${t.component(value)};`;
    }
    return `${t.js}${gap}${jsOp} ${value};`;
  }

  target(node) {
    const parts = node.getChildren();
    const first = parts[0];
    if (isToken(first) || kind(first) !== "TargetField") this.fail(`the target ${text(node)} is not supported`, node);
    let name = lc(text(first));
    let i = 1;
    let base;
    if (name === "me" && parts[1] && text(parts[1]) === "->") {
      name = lc(text(parts[2]));
      i = 3;
      base = this.attribute(name, node, true);
    } else {
      base = this.ident(name, node, true);
    }
    const comps = [];
    for (; i < parts.length; i++) {
      const p = parts[i];
      if (isToken(p) && text(p) === "-") continue;
      if (!isToken(p) && kind(p) === "ComponentName") comps.push(text(p));
      else this.fail(`the target ${text(node)} is not supported`, node);
    }
    let type = base.type;
    for (const c of comps) type = this.component(type, c, node);
    if (!comps.length) return { js: base.js, type };
    if (base.attribute) {
      const spread = (js, rest, value) => rest.length === 0 ? value
        : `{ ...${js}, ${rest[0]}: ${spread(`${js}.${rest[0]}`, rest.slice(1), value)} }`;
      return { js: base.js, type, component: (value) => spread(base.js, comps, value) };
    }
    return { js: `${base.js}.${comps.join(".")}`, type };
  }

  component(type, name, node) {
    if (type?.k === "struct") {
      const f = type.fields.find((x) => lc(x.name) === lc(name));
      if (f) return f.type;
    }
    return type?.k === "unknown" || !type ? { k: "unknown", name } : { k: "unknown", name };
  }

  /** A name in a method: `me`, a parameter or local, an attribute, a
   *  constant of the class, or abap_true / abap_false. */
  ident(name, node, asTarget = false) {
    const key = lc(name);
    if (this.locals.has(key)) { const l = this.locals.get(key); return { js: l.js, type: l.type, local: true }; }
    if (this.m.attributes.some((a) => lc(a.name) === key)) return this.attribute(key, node, asTarget);
    if (!asTarget) {
      if (this.m.constants.has(key)) { const c = this.m.constants.get(key); return { js: c.name, type: c.type }; }
      if (key === "abap_true") return { js: "true", type: { k: "bool" } };
      if (key === "abap_false") return { js: "false", type: { k: "bool" } };
      if (key === "me") return { js: "this", type: { k: "ref", to: lc(this.m.name) } };
    }
    if (key === "sy") this.fail("sy- fields are not supported yet", node);
    this.fail(`${name} is no parameter, local, attribute or constant of this class`, node);
  }
  attribute(key, node) {
    const a = this.m.attributes.find((x) => lc(x.name) === key);
    if (!a) this.fail(`${key} is no attribute of this class`, node);
    return { js: `this.${a.name}`, type: a.type, attribute: a };
  }

  loop(s) {
    const E = A().Expressions;
    const target = s.findDirectExpression(E.LoopTarget);
    if (target && (hasWord(target, "assigning") || hasWord(target, "reference") || target.findFirstExpression(E.FSTarget))) {
      this.fail("LOOP AT ... ASSIGNING / REFERENCE INTO writes through the row - not supported yet", s);
    }
    for (const w of ["from", "to", "group", "using", "step"]) if (hasWord(s, w)) this.fail(`LOOP AT ... ${w.toUpperCase()} is not supported yet`, s);
    // LOOP AT's table is a restricted source: a field chain, or a call
    const src = s.findDirectExpression(E.LoopSource);
    const inner = src?.findDirectExpression(E.SimpleSource2) ?? src;
    const operand = inner?.getChildren().find((c) => !isToken(c));
    if (!operand) this.fail("this LOOP AT is not supported yet", s);
    const tab = this.operand(operand);
    let tabType = { k: "unknown" };
    if (kind(operand) === "FieldChain") try { tabType = this.fieldChainType(operand); } catch { /* the loop still translates */ }
    const where = s.findDirectExpression(E.ComponentCond);
    let variable = "_row";
    let decl = "const";
    if (target) {
      const inline = target.findFirstExpression(E.InlineData);
      const name = lc(text((inline ?? target).findFirstExpression(E.Field) ?? target));
      if (inline) this.locals.set(name, { name, js: jsName(name), type: tabType.row ?? { k: "unknown" } });
      variable = jsName(name);
      if (!inline || this.hoisted.has(name)) decl = "";
    }
    const filter = where ? `.filter((${variable}) => ${this.componentCond(where, variable)})` : "";
    return `for (${decl ? `${decl} ` : ""}${variable} of ${tab}${filter}) {`;
  }

  componentCond(node, row) {
    const E = A().Expressions;
    return node.getChildren().map((c) => {
      if (isToken(c)) {
        const w = lc(text(c));
        if (w === "and") return "&&";
        if (w === "or") return "||";
        this.fail(`${text(c)} in a WHERE condition is not supported yet`, c);
      }
      // abaplint puts a NOT in front of a comparison INTO it: `WHERE NOT id = 1`
      const not = hasWord(c, "not") ? "!" : "";
      if (kind(c) === "ComponentCompare") {
        const comp = lc(text(c.findDirectExpression(E.ComponentChainSimple)));
        const op = c.findDirectExpression(E.CompareOperator);
        if (!op) this.fail("this WHERE condition is not supported yet", c);
        // table_line is the row itself, in a table of scalars
        const left = comp === "table_line" ? row : `${row}.${comp.replace(/-/g, ".")}`;
        const expr = `${left} ${this.operator(op)} ${this.source(c.findDirectExpression(E.Source))}`;
        return not ? `!(${expr})` : expr;
      }
      if (kind(c) === "ComponentCondSub") return `${not}(${this.componentCond(c.findDirectExpression(E.ComponentCond), row)})`;
      this.fail("this WHERE condition is not supported yet", c);
    }).join(" ");
  }

  insert(s) {
    const E = A().Expressions;
    if (hasWord(s, "index") || hasWord(s, "assigning") || hasWord(s, "reference")) this.fail(`${kind(s)} ... INDEX / ASSIGNING is not supported yet`, s);
    const targetNode = s.findDirectExpression(E.Target) ?? s.findDirectExpression(E.SimpleTarget);
    const sources = s.findDirectExpression(E.Source) ?? s.findDirectExpression(E.SimpleSource4);
    const lines = hasWord(s, "lines");
    const t = this.target(targetNode);
    const v = this.source(sources, lines ? t.type : t.type?.row);
    if (t.component) this.fail("an INSERT into a component of an attribute is not supported yet", s);
    if (t.js.startsWith("this.")) return `${t.js} = [...${t.js}, ${lines ? "..." : ""}${v}];`;
    return `${t.js}.push(${lines ? "..." : ""}${v});`;
  }

  // ----------------------------------------------------------- expressions
  /** A Source: operands and the operators between them, as the ABAP has them. */
  source(node, expected) {
    if (!node) return "";
    const lead = this.g.lead(node);
    const js = this.sourceBody(node, expected);
    // abap_bool is a boolean here; where ABAP hands it to a string it is "X" or ""
    if ((expected?.k === "string" || expected?.k === "char") && this.typeOfSource(node).k === "bool") {
      return `${lead}(${js} ? "X" : "")`;
    }
    return lead + js;
  }
  sourceBody(node, expected) {
    const E = A().Expressions;
    const parts = node.getChildren();
    const first = parts[0];
    if ((!isToken(first) || text(first) === "(") && this.hasOp(node, ["div", "mod", "**"])) return this.arith(node);
    if (isToken(first)) {
      const w = lc(text(first));
      if (w === "value") return this.value(node, expected);
      if (w === "cond") return this.condExpr(node, expected);
      if (w === "switch") return this.switchExpr(node, expected);
      if (w === "conv") return this.conv(node);
      if (w === "xsdbool" || w === "boolc") return `(${this.cond(node.findDirectExpression(E.Cond))})`;
      if (w === "(") {
        const inner = parts[1];
        const rest = this.rest(node, 3);
        return `(${this.source(inner)})${rest}`;
      }
      if (w === "-" && parts.length === 2) return `-${this.source(parts[1])}`;
      this.fail(`${text(first).toUpperCase()} is not supported yet`, node);
    }
    let js = this.operand(first, expected);
    let i = 1;
    // client->get( )-s_config-hash: components after a call
    if (parts[i] && isToken(parts[i]) && text(parts[i]) === "-" && parts[i + 1] && kind(parts[i + 1]) === "ComponentChain") {
      js += "." + parts[i + 1].getChildren().filter((c) => !isToken(c) || text(c) !== "-")
        .filter((c) => isToken(c) ? false : kind(c) === "ComponentName").map((c) => text(c)).join(".");
      i += 2;
    }
    return js + this.rest(node, i);
  }
  /** Whether the flat operator chain abaplint builds for `a + b DIV c` -
   *  nested to the right - has one of these operators at any depth. */
  hasOp(node, ops) {
    for (const p of node.getChildren()) {
      if (!isToken(p) && kind(p) === "ArithOperator" && ops.includes(lc(text(p)))) return true;
      if (!isToken(p) && kind(p) === "Source" && this.hasOp(p, ops)) return true;
    }
    return false;
  }
  /** An arithmetic chain with DIV or MOD, regrouped by ABAP's precedence -
   *  JavaScript has neither, and Math.floor( ) has to wrap exactly the two
   *  operands the ABAP operator takes. ABAP's DIV and MOD keep the remainder
   *  non-negative; for a positive divisor that is floor and a mod that wraps. */
  arith(node) {
    const items = [];
    const walk = (n) => {
      const parts = n.getChildren();
      let i;
      if (isToken(parts[0]) && text(parts[0]) === "(") { items.push(`(${this.source(parts[1])})`); i = 3; }
      else if (isToken(parts[0])) this.fail(`${text(parts[0]).toUpperCase()} in arithmetic with DIV or MOD is not supported yet`, n);
      else { items.push(this.operand(parts[0])); i = 1; }
      for (; i < parts.length; i++) {
        const p = parts[i];
        if (!isToken(p) && kind(p) === "ArithOperator") items.push({ op: lc(text(p)) });
        else if (!isToken(p) && kind(p) === "Source") walk(p);
        else this.fail(`${text(p)} in arithmetic is not supported yet`, p);
      }
    };
    walk(node);
    const reduce = (ops, fn) => {
      for (let i = 1; i < items.length;) {
        if (ops.includes(items[i].op)) items.splice(i - 1, 3, fn(items[i - 1], items[i].op, items[i + 1]));
        else i += 2;
      }
    };
    const divisor = (r, op) => {
      if (!/^\d+$/.test(r) || +r === 0) this.fail(`${op.toUpperCase()} by anything but a positive number literal is not supported yet`, node);
      return r;
    };
    reduce(["**"], (l, o, r) => `${l} ** ${r}`);
    reduce(["*", "/", "div", "mod"], (l, o, r) => {
      if (o === "*") return `${l} * ${r}`;
      if (o === "div") return `Math.floor(${l} / ${divisor(r, o)})`;
      if (o === "mod") return `((${l} % ${divisor(r, o)}) + ${r}) % ${r}`;
      this.fail("the operator / is not supported yet - ABAP rounds an integer quotient and raises on zero", node);
    });
    reduce(["+", "-"], (l, o, r) => `${l} ${o} ${r}`);
    return items[0];
  }

  /** `op Source` pairs after the first operand. */
  rest(node, from) {
    const parts = node.getChildren();
    let js = "";
    for (let i = from; i < parts.length; i++) {
      const p = parts[i];
      if (isToken(p)) {
        const w = text(p);
        const brk = this.g.breakAt(p.get());
        if (w === "&&") js += brk ? `${brk}+` : " +";
        else this.fail(`the operator ${w} is not supported yet`, node);
        continue;
      }
      if (kind(p) === "ArithOperator") {
        const op = lc(text(p));
        if (!["+", "-", "*"].includes(op)) this.fail(`the operator ${text(p).toUpperCase()} is not supported yet`, p);
        const brk = this.g.lead(p);
        js += brk ? `${brk}${op}` : ` ${op}`;
        continue;
      }
      if (kind(p) === "Source") {
        const lead = this.g.lead(p);
        js += (lead || " ") + this.sourceBody(p);
        continue;
      }
      this.fail(`${kind(p)} is not supported yet`, p);
    }
    return js;
  }

  operand(n, expected) {
    switch (kind(n)) {
      case "Constant": return literalJs(n, expected, (msg) => this.fail(msg, n));
      case "TextElementString": {
        // 'Hello'(004): the text pool's entry for 004, which abapGit keeps beside the class -
        // the literal is what the class says when the pool has none, and what it says here
        const lit = n.getChildren().find((c) => isToken(c) || kind(c) !== "TextElementKey");
        return literalJs(lit, expected, (msg) => this.fail(msg, n));
      }
      case "StringTemplate": return this.template(n);
      case "FieldChain": return this.fieldChain(n).js;
      case "MethodCallChain": return this.callChain(n);
      default: this.fail(`${kind(n)} is not supported yet`, n);
    }
  }

  template(n) {
    let out = "`";
    for (const c of n.getChildren()) {
      if (isToken(c)) {
        let s = text(c);
        s = s.replace(/^[|}]/, "").replace(/[|{]$/, "");
        out += this.templateText(s, c);
        continue;
      }
      if (kind(c) === "StringTemplateSource") {
        if (c.findDirectExpression(A().Expressions.StringTemplateFormatting)) {
          this.fail("string template formatting options are not supported yet", c);
        }
        const src = c.findDirectExpression(A().Expressions.Source);
        const type = this.typeOfSource(src);
        const js = this.sourceBody(src);
        out += type.k === "bool" ? `\${${js} ? "X" : ""}` : `\${${js}}`;
      }
    }
    return `${out}\``;
  }
  /** A literal part of an ABAP string template: ABAP's escapes undone first,
   *  then JavaScript's applied - so `$\{` becomes `\${` and not a ${ that
   *  opens an expression. */
  templateText(s, node) {
    let raw = "";
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch !== "\\") { raw += ch; continue; }
      const e = s[++i];
      if (e === "n") raw += "\n";
      else if (e === "t") raw += "\t";
      else if (e === "r") raw += "\r";
      else if ("\\|{}".includes(e)) raw += e;
      else this.fail(`the escape \\${e} in a string template is not supported`, node);
    }
    return raw.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
      .replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r")
      .replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }

  fieldChain(n) {
    const parts = n.getChildren();
    let i = 0;
    let base;
    const p0 = parts[0];
    if (kind(p0) === "ClassName") {
      const cls = lc(text(p0));
      const attr = lc(text(parts[2]));
      i = 3;
      if (cls === lc(this.m.name)) base = this.ident(attr, n);
      else if (cls === "z2ui5_if_client") {
        this.g.imports.add("z2ui5_if_client");
        base = { js: `z2ui5_if_client.${attr}`, type: this.frameworkConstant(attr) };
      } else if (cls === "cl_abap_char_utilities") {
        const map = { newline: '"\\n"', horizontal_tab: '"\\t"', cr_lf: '"\\r\\n"' };
        if (!map[attr]) this.fail(`cl_abap_char_utilities=>${attr} is not supported`, n);
        base = { js: map[attr], type: { k: "string" } };
      } else {
        this.fail(`${text(p0)}=>${attr} is not supported`, n);
      }
    } else if (kind(p0) === "SourceField") {
      const name = lc(text(p0));
      if (name === "me" && parts[1] && text(parts[1]) === "->") {
        base = this.attribute(lc(text(parts[2])), n);
        i = 3;
      } else {
        base = this.ident(name, n);
        i = 1;
      }
    } else {
      this.fail(`${kind(p0)} is not supported yet`, n);
    }
    let js = base.js;
    let type = base.type;
    for (; i < parts.length; i++) {
      const p = parts[i];
      if (isToken(p)) {
        const w = text(p);
        if (w === "-") continue;
        if (w === "->") {
          const attr = parts[++i];
          if (type?.k === "ref" && type.to === "z2ui5_if_client") {
            js += `.${lc(text(attr))}`;
            type = this.frameworkConstant(lc(text(attr)));
            continue;
          }
          this.fail(`->${text(attr)} is not supported`, n);
        }
        this.fail(`${w} is not supported here`, n);
      }
      if (kind(p) === "ComponentName") {
        js += `.${text(p)}`;
        type = this.component(type, text(p), n);
        continue;
      }
      if (kind(p) === "ArrowOrDash") continue;
      this.fail(`${kind(p)} is not supported yet`, p);
    }
    return { js, type };
  }

  frameworkConstant(name) {
    const intf = this.m.lib.model("z2ui5_if_client");
    const c = intf?.constants.get(lc(name));
    return c ? c.type : { k: "unknown", name };
  }

  /** A method call chain: an own method, a built-in function, the client,
   *  a view builder, or z2ui5_cl_ui5_view_builder=>factory( ). */
  callChain(n) {
    const E = A().Expressions;
    const parts = n.getChildren();
    let js;
    let recv;             // { kind: "client" | "builder" | "other", type }
    let i = 1;
    const p0 = parts[0];
    if (kind(p0) === "MethodCall") {
      const r = this.ownOrBuiltin(p0);
      js = r.js;
      recv = r.recv;
    } else if (kind(p0) === "FieldChain") {
      const f = this.fieldChain(p0);
      js = f.js;
      recv = this.receiver(f.type);
    } else if (kind(p0) === "ClassName") {
      const cls = lc(text(p0));
      if (cls !== "z2ui5_cl_ui5_view_builder") this.fail(`${text(p0)}=>... is not supported`, p0);
      this.g.imports.add("z2ui5_cl_ui5_view_builder");
      js = "z2ui5_cl_ui5_view_builder";
      recv = { kind: "builder-class" };
    } else if (kind(p0) === "NewObject") {
      this.fail("NEW is supported only as the app of nav_app_call( ) and nav_app_leave( )", p0);
    } else {
      this.fail(`${kind(p0)} is not supported yet`, p0);
    }
    for (; i < parts.length; i++) {
      const p = parts[i];
      if (isToken(p)) {
        const arrow = text(p);
        if (arrow !== "->" && arrow !== "=>") this.fail(`${arrow} is not supported here`, n);
        // the ABAP breaks before `)->`: the `)` closing the previous call opens the row
        const before = this.g.prev.get(p.get());
        const brk = before && before.getStr() === ")" && this.g.rowStart.has(before) ? this.g.breakAt(before) : this.g.breakAt(p.get());
        const call = parts[++i];
        if (kind(call) !== "MethodCall") this.fail(`${kind(call)} after ${arrow} is not supported`, call);
        const name = lc(text(call.findDirectExpression(E.MethodName)));
        const r = this.call(recv, name, call);
        js += `${brk}.${name}${r.args}`;
        recv = r.recv;
        continue;
      }
      this.fail(`${kind(p)} is not supported yet`, p);
    }
    return js;
  }

  receiver(type) {
    if (type?.k === "ref" && type.to === "z2ui5_if_client") return { kind: "client" };
    if (type?.k === "ref" && type.to === "z2ui5_cl_ui5_view_builder") return { kind: "builder" };
    return { kind: "other", type };
  }

  call(recv, name, call) {
    if (recv.kind === "builder" || recv.kind === "builder-class") {
      const def = this.m.lib.model("z2ui5_cl_ui5_view_builder")?.methods.get(name);
      return { args: this.args(call, {}, def), recv: { kind: "builder" } };
    }
    if (recv.kind === "client") {
      const intf = this.m.lib.model("z2ui5_if_client");
      const def = intf?.methods.get(name);
      if (intf && !def) this.fail(`z2ui5_if_client has no method ${name}`, call);
      const ret = def?.returning?.type ?? { k: "unknown" };
      if (/^_bind(_edit|_path)?$/.test(name)) return { args: this.args(call, { val: "path", tab: "path" }, def), recv: this.receiver(ret), type: ret };
      if (name === "nav_app_call" || name === "nav_app_leave") return { args: this.args(call, { app: "app", "": "app" }, def), recv: this.receiver(ret), type: ret };
      return { args: this.args(call, {}, def), recv: this.receiver(ret), type: ret };
    }
    this.fail(`a call on ${recv.type?.name ?? recv.type?.to ?? "this value"} is not supported yet`, call);
  }

  ownOrBuiltin(call) {
    const E = A().Expressions;
    const name = lc(text(call.findDirectExpression(E.MethodName)));
    const def = this.m.methods.get(name);
    if (def) {
      const js = `this.${def.name}${this.ownArgs(def, call)}`;
      return { js, recv: this.receiver(def.returning?.type), type: def.returning?.type };
    }
    const b = this.builtin(name, call);
    if (b !== undefined) return { js: b, recv: { kind: "other" } };
    this.fail(`${name}( ) is no method of this class and no built-in function this translation knows`, call);
  }

  /** The parameters of a call as the client and the view builder take them:
   *  nothing, one positional value, or one object with the ABAP names. */
  args(call, special = {}, def) {
    const E = A().Expressions;
    const param = call.findDirectExpression(E.MethodCallParam);
    const inner = param.getChildren().filter((c) => !isToken(c));
    if (!inner.length) return "()";
    const node = inner[0];
    const types = Object.fromEntries((def?.importing ?? []).map((p) => [lc(p.name), p.type]));
    if (kind(node) === "Source") {
      const how = special[""] ?? special.val;
      const ps = def?.importing ?? [];
      const pref = ps.find((p) => lc(p.name) === ps.preferred) ?? ps.find((p) => !p.optional) ?? ps[0];
      return `(${this.arg(node, how, pref?.type)})`;
    }
    if (kind(node) === "ParameterListS") return `(${this.named(node.findAllExpressions(E.ParameterS), special, types)})`;
    if (kind(node) === "MethodParameters") {
      const words = node.getChildren().filter(isToken).map((t) => lc(text(t)));
      if (words.some((w) => w !== "exporting")) this.fail("IMPORTING / CHANGING / RECEIVING in a call is not supported", node);
      return `(${this.named(node.findAllExpressions(E.ParameterS), special, types)})`;
    }
    this.fail(`${kind(node)} is not supported yet`, node);
  }
  named(params, special = {}, types = {}) {
    const E = A().Expressions;
    let out = "{";
    params.forEach((p, idx) => {
      const nameNode = p.findDirectExpression(E.ParameterName);
      const eq = p.getChildren().find((c) => isToken(c) && text(c) === "=");
      const src = p.findDirectExpression(E.Source);
      const lead = this.g.lead(p);
      const prevLast = idx ? params[idx - 1].getLastToken() : null;
      const sep = idx ? (lead ? "," : `,${this.g.gap(prevLast, nameNode.getFirstToken())}`) : (lead ? "" : " ");
      const name = lc(text(nameNode));
      const gapEq = this.g.gap(nameNode.getLastToken(), eq.get());
      this.g.used.add(src.getFirstToken());
      out += `${sep}${lead}${name}:${gapEq}${this.arg(src, special[name], types[name])}`;
    });
    return `${out} }`;
  }
  arg(src, how, expected) {
    if (how === "path") return JSON.stringify(this.bindPath(src));
    if (how === "app") {
      const E = A().Expressions;
      const chain = src.findDirectExpression(E.MethodCallChain);
      const nw = chain?.getChildren().length === 1 ? chain.findDirectExpression(E.NewObject) : null;
      if (nw) {
        const cls = nw.findFirstExpression(E.TypeName);
        if (!cls || nw.findDirectExpression(E.ParameterListS) || nw.findDirectExpression(E.Source)) {
          this.fail("NEW with constructor parameters is not supported", nw);
        }
        return JSON.stringify(text(cls).toUpperCase());
      }
    }
    return this.source(src, expected);
  }
  /** _bind( ) takes the field's name: an attribute, or a component of one. */
  bindPath(src) {
    const E = A().Expressions;
    const chain = src.getChildren().length === 1 ? src.findDirectExpression(E.FieldChain) : null;
    if (!chain) this.fail(`_bind( ${text(src)} ): only an attribute or a component of one can be bound by name`, src);
    const parts = chain.getChildren();
    let i = 0;
    let name = lc(text(parts[0]));
    if (name === "me" && parts[1] && text(parts[1]) === "->") { name = lc(text(parts[2])); i = 3; } else i = 1;
    if (this.locals.has(name) || !this.m.attributes.some((a) => lc(a.name) === name)) {
      this.fail(`_bind( ${text(src)} ): ${name} is no attribute - only an attribute can be bound by name`, src);
    }
    const comps = parts.slice(i).filter((p) => !isToken(p) && kind(p) === "ComponentName").map((p) => text(p));
    if (parts.slice(i).some((p) => !isToken(p) && kind(p) !== "ComponentName")) this.fail(`_bind( ${text(src)} ) is not supported`, src);
    return [this.m.attributes.find((a) => lc(a.name) === name).name, ...comps].join("-");
  }

  ownArgs(def, call) {
    const E = A().Expressions;
    const param = call.findDirectExpression(E.MethodCallParam);
    const inner = param.getChildren().filter((c) => !isToken(c));
    const ps = def.importing;
    if (!inner.length) return "()";
    const node = inner[0];
    if (kind(node) === "Source") {
      if (ps.length === 1) return `(${this.source(node, ps[0].type)})`;
      const pref = ps.find((p) => lc(p.name) === ps.preferred) ?? ps.find((p) => !p.optional);
      return `({ ${pref.name}: ${this.source(node, pref.type)} })`;
    }
    const list = node.findAllExpressions(E.ParameterS);
    if (kind(node) === "MethodParameters" && node.getChildren().filter(isToken).some((t) => lc(text(t)) !== "exporting")) {
      this.fail("IMPORTING / CHANGING / RECEIVING in a call is not supported", node);
    }
    if (ps.length === 1 && list.length === 1) return `(${this.source(list[0].findDirectExpression(E.Source), ps[0].type)})`;
    return `(${this.named(list, {}, Object.fromEntries(ps.map((p) => [lc(p.name), p.type])))})`;
  }

  builtin(name, call) {
    const E = A().Expressions;
    const param = call.findDirectExpression(E.MethodCallParam);
    const inner = param.getChildren().filter((c) => !isToken(c))[0];
    const named = {};
    let single;
    if (inner && kind(inner) === "Source") single = inner;
    else if (inner) for (const p of inner.findAllExpressions(E.ParameterS)) named[lc(text(p.findDirectExpression(E.ParameterName)))] = p.findDirectExpression(E.Source);
    const val = single ?? named.val;
    const wrap = (js) => (/^[\w$.]+(\(\))?$/.test(js) ? js : `(${js})`);
    const v = () => wrap(this.source(val));
    const only = (...allowed) => {
      const extra = Object.keys(named).filter((k) => !allowed.includes(k));
      if (extra.length) this.fail(`${name}( ${extra.join(", ")} = … ) is not supported yet`, call);
    };
    switch (name) {
      case "lines": return `${v()}.length`;
      case "strlen": case "numofchar": return `${v()}.length`;
      case "to_upper": return `${v()}.toUpperCase()`;
      case "to_lower": return `${v()}.toLowerCase()`;
      case "find": {
        only("val", "sub", "case");
        const caseless = named.case && lc(text(named.case)) === "abap_false";
        if (named.case && !caseless && lc(text(named.case)) !== "abap_true") this.fail("find( case = … ) takes abap_true or abap_false", call);
        return caseless
          ? `${v()}.toLowerCase().indexOf(${wrap(this.source(named.sub))}.toLowerCase())`
          : `${v()}.indexOf(${this.source(named.sub)})`;
      }
      case "replace": {
        only("val", "sub", "with", "occ");
        const occ = named.occ ? text(named.occ) : "1";
        if (occ !== "0" && occ !== "1") this.fail("replace( occ = … ) other than 0 and 1 is not supported", call);
        const w = this.source(named.with);
        const repl = /^"[^$]*"$/.test(w) ? w : `() => ${w}`;
        return `${v()}.${occ === "0" ? "replaceAll" : "replace"}(${this.source(named.sub)}, ${repl})`;
      }
      case "substring": {
        only("val", "off", "len");
        const off = named.off ? this.source(named.off) : "0";
        return named.len ? `${v()}.substr(${off}, ${this.source(named.len)})` : `${v()}.substr(${off})`;
      }
      case "substring_after": case "substring_before": {
        only("val", "sub");
        const s = v();
        const sub = wrap(this.source(named.sub));
        return name === "substring_after"
          ? `(${s}.includes(${sub}) ? ${s}.slice(${s}.indexOf(${sub}) + ${sub}.length) : "")`
          : `(${s}.includes(${sub}) ? ${s}.slice(0, ${s}.indexOf(${sub})) : "")`;
      }
      default: return undefined;
    }
  }

  // --------------------------------------------------------------- VALUE #
  value(node, expected) {
    const E = A().Expressions;
    const typeNode = node.findDirectExpression(E.TypeNameOrInfer);
    let type = expected;
    if (typeNode && text(typeNode) !== "#") type = resolveType(this.m, text(typeNode), typeNode.getFirstToken());
    const body = node.findDirectExpression(E.ValueBody);
    if (!body) {
      if (type?.k === "table") return "[]";
      if (type?.k === "struct") return "{}";
      if (type?.k && type.k !== "unknown") return this.g.initial(type, "plain", node);
      this.fail("VALUE #( ) of a type this translation cannot see", node);
    }
    for (const c of body.getChildren()) {
      if (isToken(c) && ["base", "for", "let", "default", "optional"].includes(lc(text(c)))) {
        this.fail(`VALUE #( ${text(c).toUpperCase()} … ) is not supported yet`, c);
      }
      if (!isToken(c) && ["For", "Let"].includes(kind(c))) this.fail(`VALUE #( ${kind(c).toUpperCase()} … ) is not supported yet`, c);
    }
    const lines = children(body, "ValueBodyLine");
    if (lines.length) {
      const rowType = type?.k === "table" ? type.row : undefined;
      let out = "[";
      lines.forEach((line, idx) => {
        const lead = this.g.lead(line);
        const sep = idx ? "," : "";
        out += `${sep}${lead || (idx ? " " : " ")}${this.valueLine(line, rowType)}`;
      });
      return `${out} ]`;
    }
    return this.fieldsLiteral(children(body, "FieldAssignment"), type);
  }
  valueLine(line, rowType) {
    const E = A().Expressions;
    const assigns = children(line, "FieldAssignment");
    if (assigns.length) return this.fieldsLiteral(assigns, rowType);
    const src = line.findDirectExpression(E.Source);
    if (src) return this.source(src, rowType);
    return "{}";
  }
  fieldsLiteral(assigns, type) {
    const E = A().Expressions;
    let out = "{";
    assigns.forEach((a, idx) => {
      const sub = a.findDirectExpression(E.FieldSub);
      const eq = a.getChildren().find((c) => isToken(c) && text(c) === "=");
      const src = a.findDirectExpression(E.Source);
      const lead = this.g.lead(a);
      const prevLast = idx ? assigns[idx - 1].getLastToken() : null;
      const sep = idx ? (lead ? "," : `,${this.g.gap(prevLast, sub.getFirstToken())}`) : (lead ? "" : " ");
      const name = text(sub);
      if (name.includes("-")) this.fail("a component path in VALUE #( ) is not supported", a);
      const ftype = type?.k === "struct" ? type.fields.find((f) => lc(f.name) === lc(name))?.type : undefined;
      this.g.used.add(src.getFirstToken());
      out += `${sep}${lead}${name}:${this.g.gap(sub.getLastToken(), eq.get())}${this.source(src, ftype)}`;
    });
    return `${out} }`;
  }

  condExpr(node, expected) {
    const E = A().Expressions;
    const body = node.findDirectExpression(E.CondBody);
    const parts = body.getChildren();
    let out = "(";
    let els = null;
    let firstType;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!isToken(p)) continue;
      const w = lc(text(p));
      if (w === "when") {
        const brk = i ? this.g.breakAt(p.get()) : "";
        const cond = this.cond(parts[i + 1]);
        const then = parts[i + 3];
        firstType ??= this.typeOfSource(then);
        out += `${i ? `${brk || " "}: ` : ""}${cond} ? ${this.source(then, expected ?? firstType)}`;
        i += 3;
      } else if (w === "else") {
        els = { tok: p, src: parts[i + 1] };
        i += 1;
      } else if (w === "let" || w === "throw") {
        this.fail(`COND #( ${w.toUpperCase()} … ) is not supported yet`, p);
      }
    }
    const t = expected ?? firstType;
    const brk = els ? this.g.breakAt(els.tok.get()) : "";
    const elseJs = els ? this.source(els.src, t) : this.fallback(t, node);
    return `${out}${brk || " "}: ${elseJs})`;
  }
  switchExpr(node, expected) {
    const E = A().Expressions;
    const body = node.findDirectExpression(E.SwitchBody);
    const parts = body.getChildren();
    const subject = this.source(parts[0]);
    let out = "(";
    let els = null;
    let firstType;
    let first = true;
    for (let i = 1; i < parts.length; i++) {
      const p = parts[i];
      if (!isToken(p)) continue;
      const w = lc(text(p));
      if (w === "when") {
        const brk = this.g.breakAt(p.get());
        const when = this.source(parts[i + 1]);
        const then = parts[i + 3];
        firstType ??= this.typeOfSource(then);
        out += `${first ? "" : `${brk || " "}: `}${subject} === ${when} ? ${this.source(then, expected ?? firstType)}`;
        first = false;
        i += 3;
      } else if (w === "else") {
        els = { tok: p, src: parts[i + 1] };
        i += 1;
      } else if (w === "let" || w === "throw") {
        this.fail(`SWITCH #( ${w.toUpperCase()} … ) is not supported yet`, p);
      }
    }
    const t = expected ?? firstType;
    const brk = els ? this.g.breakAt(els.tok.get()) : "";
    const elseJs = els ? this.source(els.src, t) : this.fallback(t, node);
    return `${out}${brk || " "}: ${elseJs})`;
  }
  fallback(type, node) {
    if (!type || type.k === "unknown") this.fail("COND / SWITCH without ELSE, of a type this translation cannot see", node);
    return type.k === "table" ? "[]" : type.k === "struct" ? "{}" : this.g.initial(type, "plain", node);
  }
  conv(node) {
    const E = A().Expressions;
    const type = lc(text(node.findDirectExpression(E.TypeNameOrInfer)));
    const src = node.findDirectExpression(E.ConvBody).findDirectExpression(E.Source);
    // abap_bool converts to "X" or ""; a number without ABAP's trailing sign position ("0 ")
    if (type === "string") {
      return this.typeOfSource(src).k === "bool" ? `(${this.source(src)} ? "X" : "")` : `String(${this.source(src)})`;
    }
    this.fail(`CONV ${type}( ) is not supported yet`, node);
  }

  // ------------------------------------------------------------ conditions
  cond(node) {
    const E = A().Expressions;
    let out = "";
    for (const c of node.getChildren()) {
      if (isToken(c)) {
        const w = lc(text(c));
        const brk = this.g.breakAt(c.get());
        if (w === "and") out += ` ${brk}&&`;
        else if (w === "or") out += ` ${brk}||`;
        else if (w === "not") out += `${brk}!`;
        else this.fail(`${text(c)} in a condition is not supported yet`, node);
        continue;
      }
      if (kind(c) === "Compare") out += (out && !out.endsWith("!") ? " " : "") + this.compare(c);
      else if (kind(c) === "CondSub") {
        const not = hasWord(c, "not");
        const lead = this.g.lead(c);
        out += `${out && !out.endsWith("!") ? " " : ""}${lead}${not ? "!" : ""}(${this.cond(c.findDirectExpression(E.Cond))})`;
      } else this.fail(`${kind(c)} is not supported yet`, c);
    }
    return out;
  }

  compare(node) {
    const lead = this.g.lead(node);
    const kids = node.getChildren();
    const words = kids.filter(isToken).map((t) => lc(text(t)));
    const sources = children(node, "Source");
    if (!sources.length && kids.length === 1 && kind(kids[0]) === "MethodCallChain") {
      return lead + this.callChain(kids[0]);                         // a predicative call
    }
    if (words[0] === "not" && kids.length === 2 && kind(kids[1]) === "MethodCallChain") {
      return `${lead}!${this.callChain(kids[1])}`;
    }
    // `NOT a = b`: abaplint puts the NOT into the comparison it negates
    const leadingNot = isToken(kids[0]) && lc(text(kids[0])) === "not";
    if (words.includes("is")) {
      const src = sources[0];
      const type = this.typeOfSource(src);
      const js = this.source(src);
      // NOT a IS NOT INITIAL is a IS INITIAL
      const not = words.filter((w) => w === "not").length % 2 === 1;
      if (words.includes("initial")) return lead + this.initialTest(js, type, not, node);
      this.fail(`IS ${words.filter((w) => w !== "is" && w !== "not").join(" ").toUpperCase()} is not supported yet`, node);
    }
    if (words.includes("between")) this.fail("BETWEEN is not supported yet", node);
    if (words.includes("in")) this.fail("IN (a range) is not supported yet", node);
    const op = child(node, "CompareOperator");
    if (!op || sources.length !== 2) this.fail("this comparison is not supported yet", node);
    const [a, b] = sources;
    const ta = this.typeOfSource(a);
    const tb = this.typeOfSource(b);
    const left = this.source(a, tb);
    const right = this.source(b, ta);
    const o = lc(text(op));
    const w = (js) => (/^[\w$.]+(\(\))?$|^"[^"]*"$/.test(js) ? js : `(${js})`);
    let expr;
    switch (o) {
      case "cs": expr = `${w(left)}.toUpperCase().includes(${w(right)}.toUpperCase())`; break;
      case "ns": expr = `!${w(left)}.toUpperCase().includes(${w(right)}.toUpperCase())`; break;
      case "co": expr = `[...${w(left)}].every((c) => ${w(right)}.includes(c))`; break;
      case "cn": expr = `![...${w(left)}].every((c) => ${w(right)}.includes(c))`; break;
      default: expr = `${left} ${this.operator(op)} ${right}`;
    }
    return lead + (leadingNot ? `!(${expr})` : expr);
  }
  operator(op) {
    const o = lc(text(op));
    const map = { "=": "===", eq: "===", "<>": "!==", "><": "!==", ne: "!==", "<": "<", lt: "<", ">": ">", gt: ">", "<=": "<=", "=<": "<=", le: "<=", ">=": ">=", "=>": ">=", ge: ">=" };
    if (!map[o]) this.fail(`the comparison ${text(op).toUpperCase()} is not supported yet`, op);
    return map[o];
  }
  initialTest(js, type, not, node) {
    const w = /^[\w$.]+(\(\))?$/.test(js) ? js : `(${js})`;
    switch (type.k) {
      case "string": case "char": return `${w} ${not ? "!==" : "==="} ""`;
      case "int": case "float": case "packed": return `${w} ${not ? "!==" : "==="} 0`;
      case "bool": return `${w} ${not ? "!==" : "==="} false`;
      case "table": return `${w}.length ${not ? "!==" : "==="} 0`;
      default: this.fail(`IS INITIAL of a ${type.k === "unknown" ? "value whose type this translation cannot see" : type.k}`, node);
    }
  }

  // ------------------------------------------------------------------ types
  typeOfSource(node) {
    if (!node) return { k: "unknown" };
    const E = A().Expressions;
    const parts = node.getChildren();
    const first = parts[0];
    if (isToken(first)) {
      const w = lc(text(first));
      if (w === "xsdbool" || w === "boolc") return { k: "bool" };
      if (w === "conv" || w === "value") {
        const t = node.findDirectExpression(E.TypeNameOrInfer);
        return t && text(t) !== "#" ? resolveType(this.m, text(t), t.getFirstToken()) : { k: "unknown" };
      }
      if (w === "cond" || w === "switch") {
        // the type it names, else what its first THEN gives - not SWITCH's
        // operand, nor the value a WHEN compares it with
        const t = node.findDirectExpression(E.TypeNameOrInfer);
        if (t && text(t) !== "#") return resolveType(this.m, text(t), t.getFirstToken());
        const body = (node.findDirectExpression(w === "cond" ? E.CondBody : E.SwitchBody)?.getChildren() ?? []);
        const then = body.findIndex((c) => isToken(c) && lc(text(c)) === "then");
        return this.typeOfSource(then < 0 ? null : body.slice(then + 1).find((c) => !isToken(c)));
      }
      if (w === "(") return this.typeOfSource(parts[1]);
      return { k: "unknown" };
    }
    if (parts.some((p) => isToken(p) && text(p) === "&&")) return { k: "string" };
    if (parts.some((p) => !isToken(p) && kind(p) === "ArithOperator")) return { k: "int" };
    let type;
    switch (kind(first)) {
      case "Constant": type = /^-?\d+$/.test(text(first)) ? { k: "int" } : { k: "string" }; break;
      case "TextElementString": case "StringTemplate": type = { k: "string" }; break;
      case "FieldChain": {
        try { type = this.fieldChainType(first); } catch { type = { k: "unknown" }; }
        break;
      }
      case "MethodCallChain": type = this.callType(first); break;
      default: type = { k: "unknown" };
    }
    if (parts[1] && isToken(parts[1]) && text(parts[1]) === "-" && parts[2] && kind(parts[2]) === "ComponentChain") {
      for (const c of children(parts[2], "ComponentName")) type = this.component(type, text(c));
    }
    return type;
  }
  fieldChainType(n) {
    const used = new Set(this.g.used);
    const r = this.fieldChain(n);
    this.g.used = used;                 // a type question must not consume line breaks
    return r.type;
  }
  callType(n) {
    const E = A().Expressions;
    const parts = n.getChildren();
    let type;
    let recv;
    const p0 = parts[0];
    if (kind(p0) === "MethodCall") {
      const name = lc(text(p0.findDirectExpression(E.MethodName)));
      const def = this.m.methods.get(name);
      if (def) type = def.returning?.type ?? { k: "unknown" };
      else type = ["lines", "strlen", "numofchar", "find"].includes(name) ? { k: "int" } : { k: "string" };
    } else if (kind(p0) === "FieldChain") {
      try { type = this.fieldChainType(p0); } catch { type = { k: "unknown" }; }
    } else if (kind(p0) === "ClassName") type = { k: "ref", to: "z2ui5_cl_ui5_view_builder" };
    for (let i = 1; i < parts.length; i++) {
      if (!isToken(parts[i]) && kind(parts[i]) === "MethodCall") {
        recv = this.receiver(type);
        const name = lc(text(parts[i].findDirectExpression(E.MethodName)));
        if (recv.kind === "client") {
          type = this.m.lib.model("z2ui5_if_client")?.methods.get(name)?.returning?.type ?? { k: "unknown" };
        } else if (recv.kind === "builder" || recv.kind === "builder-class") {
          type = name === "stringify" ? { k: "string" } : { k: "ref", to: "z2ui5_cl_ui5_view_builder" };
        } else type = { k: "unknown" };
      }
    }
    return type ?? { k: "unknown" };
  }
}

module.exports = { abap2js, library, Abap2jsError };
